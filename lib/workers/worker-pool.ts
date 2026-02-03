/**
 * Web Worker Pool for PDF Processing
 * Manages a pool of workers for parallel PDF operations
 */

export interface WorkerTask<T = unknown> {
  id: string;
  type: string;
  payload: unknown;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: number) => void;
  abortController?: AbortController;
}

export interface WorkerMessage {
  id: string;
  type: 'result' | 'error' | 'progress';
  data?: unknown;
  error?: string;
  progress?: number;
}

export interface TaskOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  priority?: 'high' | 'normal' | 'low';
}

class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask<unknown>[] = [];
  private activeTasksMap: Map<string, { worker: Worker; task: WorkerTask<unknown> }> = new Map();
  private workerStatus: Map<Worker, 'idle' | 'busy'> = new Map();
  private maxWorkers: number;
  private workerScript: string;
  private initialized = false;

  constructor(workerScript: string, maxWorkers?: number) {
    this.workerScript = workerScript;
    this.maxWorkers = maxWorkers || Math.min(navigator.hardwareConcurrency || 4, 8);
  }

  private createWorker(): Worker {
    const worker = new Worker(this.workerScript, { type: 'module' });

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      this.handleWorkerMessage(worker, event.data);
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.handleWorkerError(worker, error);
    };

    this.workerStatus.set(worker, 'idle');
    return worker;
  }

  init(): void {
    if (this.initialized) return;

    // Create initial worker pool
    const initialWorkers = Math.min(2, this.maxWorkers);
    for (let i = 0; i < initialWorkers; i++) {
      this.workers.push(this.createWorker());
    }
    this.initialized = true;
  }

  private handleWorkerMessage(worker: Worker, message: WorkerMessage): void {
    const activeTask = Array.from(this.activeTasksMap.entries()).find(
      ([, v]) => v.worker === worker
    );

    if (!activeTask) return;

    const [taskId, { task }] = activeTask;

    switch (message.type) {
      case 'progress':
        if (message.progress !== undefined && task.onProgress) {
          task.onProgress(message.progress);
        }
        break;

      case 'result':
        task.resolve(message.data);
        this.activeTasksMap.delete(taskId);
        this.workerStatus.set(worker, 'idle');
        this.processNextTask();
        break;

      case 'error':
        task.reject(new Error(message.error || 'Unknown worker error'));
        this.activeTasksMap.delete(taskId);
        this.workerStatus.set(worker, 'idle');
        this.processNextTask();
        break;
    }
  }

  private handleWorkerError(worker: Worker, error: ErrorEvent): void {
    // Find task assigned to this worker
    const activeTask = Array.from(this.activeTasksMap.entries()).find(
      ([, v]) => v.worker === worker
    );

    if (activeTask) {
      const [taskId, { task }] = activeTask;
      task.reject(new Error(error.message || 'Worker crashed'));
      this.activeTasksMap.delete(taskId);
    }

    // Replace crashed worker
    const index = this.workers.indexOf(worker);
    if (index > -1) {
      worker.terminate();
      this.workers[index] = this.createWorker();
    }

    this.processNextTask();
  }

  private getIdleWorker(): Worker | null {
    for (const worker of this.workers) {
      if (this.workerStatus.get(worker) === 'idle') {
        return worker;
      }
    }

    // Create new worker if under limit
    if (this.workers.length < this.maxWorkers) {
      const worker = this.createWorker();
      this.workers.push(worker);
      return worker;
    }

    return null;
  }

  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    const worker = this.getIdleWorker();
    if (!worker) return;

    const task = this.taskQueue.shift()!;

    // Check if task was cancelled
    if (task.abortController?.signal.aborted) {
      task.reject(new Error('Task cancelled'));
      this.processNextTask();
      return;
    }

    this.workerStatus.set(worker, 'busy');
    this.activeTasksMap.set(task.id, { worker, task });

    worker.postMessage({
      id: task.id,
      type: task.type,
      payload: task.payload,
    });
  }

  async execute<T>(type: string, payload: unknown, options?: TaskOptions): Promise<T> {
    this.init();

    const taskId = crypto.randomUUID();
    const abortController = new AbortController();

    // Link external signal if provided
    if (options?.signal) {
      options.signal.addEventListener('abort', () => abortController.abort());
    }

    return new Promise<T>((resolve, reject) => {
      const task: WorkerTask<unknown> = {
        id: taskId,
        type,
        payload,
        resolve: resolve as (result: unknown) => void,
        reject,
        onProgress: options?.onProgress,
        abortController,
      };

      // Add to queue based on priority
      if (options?.priority === 'high') {
        this.taskQueue.unshift(task);
      } else {
        this.taskQueue.push(task);
      }

      this.processNextTask();
    });
  }

  cancel(taskId: string): boolean {
    // Check if in queue
    const queueIndex = this.taskQueue.findIndex((t) => t.id === taskId);
    if (queueIndex > -1) {
      const task = this.taskQueue.splice(queueIndex, 1)[0];
      task.reject(new Error('Task cancelled'));
      return true;
    }

    // Check if active
    const activeTask = this.activeTasksMap.get(taskId);
    if (activeTask) {
      activeTask.task.abortController?.abort();
      return true;
    }

    return false;
  }

  cancelAll(): void {
    // Cancel queued tasks
    for (const task of this.taskQueue) {
      task.reject(new Error('Task cancelled'));
    }
    this.taskQueue = [];

    // Cancel active tasks
    for (const [, { task }] of this.activeTasksMap) {
      task.abortController?.abort();
    }
  }

  getStatus(): {
    workers: number;
    idle: number;
    busy: number;
    queued: number;
  } {
    let idle = 0;
    let busy = 0;

    for (const status of this.workerStatus.values()) {
      if (status === 'idle') idle++;
      else busy++;
    }

    return {
      workers: this.workers.length,
      idle,
      busy,
      queued: this.taskQueue.length,
    };
  }

  terminate(): void {
    this.cancelAll();
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.workerStatus.clear();
    this.activeTasksMap.clear();
    this.initialized = false;
  }
}

// Create PDF worker pool instance
let pdfWorkerPool: WorkerPool | null = null;

export function getPdfWorkerPool(): WorkerPool {
  if (!pdfWorkerPool) {
    // Worker script path - will be created
    pdfWorkerPool = new WorkerPool('/workers/pdf-worker.js');
  }
  return pdfWorkerPool;
}

export { WorkerPool };
