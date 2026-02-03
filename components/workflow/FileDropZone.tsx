'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, File, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroppedFile {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

interface FileDropZoneProps {
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  onFilesAdded: (files: File[]) => void;
  onFileRemoved?: (fileId: string) => void;
  className?: string;
  multiple?: boolean;
  files?: DroppedFile[];
  compact?: boolean;
}

const DEFAULT_ACCEPT = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function FileDropZone({
  accept = DEFAULT_ACCEPT,
  maxFiles = 20,
  maxSize = DEFAULT_MAX_SIZE,
  onFilesAdded,
  onFileRemoved,
  className,
  multiple = true,
  files = [],
  compact = false,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!accept.includes(file.type)) {
        return `File type not supported: ${file.type || 'unknown'}`;
      }
      if (file.size > maxSize) {
        return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`;
      }
      return null;
    },
    [accept, maxSize]
  );

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList);
      const validFiles: File[] = [];
      let error: string | null = null;

      if (files.length + newFiles.length > maxFiles) {
        error = `Maximum ${maxFiles} files allowed`;
        setDragError(error);
        setTimeout(() => setDragError(null), 3000);
        return;
      }

      for (const file of newFiles) {
        const fileError = validateFile(file);
        if (fileError) {
          error = fileError;
        } else {
          validFiles.push(file);
        }
      }

      if (error) {
        setDragError(error);
        setTimeout(() => setDragError(null), 3000);
      }

      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [files.length, maxFiles, validateFile, onFilesAdded]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [handleFiles]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = ''; // Reset for same file selection
      }
    },
    [handleFiles]
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return FileText;
    if (type.startsWith('image/')) return Image;
    return File;
  };

  if (compact && files.length > 0) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Compact file list */}
        <div className="space-y-2">
          {files.map((item) => {
            const Icon = getFileIcon(item.file.type);
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl bg-white border',
                  item.error ? 'border-red-200 bg-red-50' : 'border-gray-200'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    item.error ? 'bg-red-100' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5', item.error ? 'text-red-500' : 'text-gray-500')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-dark truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.error || formatBytes(item.file.size)}
                  </p>
                </div>
                {onFileRemoved && (
                  <button
                    onClick={() => onFileRemoved(item.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add more button */}
        {multiple && files.length < maxFiles && (
          <button
            onClick={handleClick}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-privacy-teal hover:text-privacy-teal transition-colors"
          >
            + Add more files
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#0FB9B1' : '#E5E7EB',
        }}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed',
          'bg-white hover:bg-gray-50 transition-colors',
          'flex flex-col items-center justify-center',
          compact ? 'p-8' : 'p-12',
          isDragging && 'border-privacy-teal bg-privacy-teal/5'
        )}
      >
        <AnimatePresence mode="wait">
          {isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-privacy-teal/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-privacy-teal" />
              </div>
              <p className="text-lg font-semibold text-privacy-teal">Drop files here</p>
            </motion.div>
          ) : dragError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">{dragError}</p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-slate-dark mb-1">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                PDF, JPG, PNG up to {(maxSize / 1024 / 1024).toFixed(0)}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File count indicator */}
        {files.length > 0 && !compact && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </span>
              <span>
                {files.length}/{maxFiles} max
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* File preview list */}
      {files.length > 0 && !compact && (
        <div className="mt-4 space-y-2">
          {files.map((item) => {
            const Icon = getFileIcon(item.file.type);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl bg-white border',
                  item.error ? 'border-red-200 bg-red-50' : 'border-gray-200'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    item.error ? 'bg-red-100' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5', item.error ? 'text-red-500' : 'text-gray-500')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-dark truncate">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.error || formatBytes(item.file.size)}
                  </p>
                </div>
                {onFileRemoved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemoved(item.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type { DroppedFile };
