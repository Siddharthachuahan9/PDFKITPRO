'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import ToolLayout, { ToolColumns, PanelHeader } from '@/components/ToolLayout';
import Dropzone from '@/components/Dropzone';
import FileList from '@/components/FileList';
import PdfViewer from '@/components/PdfViewer';
import ActionBar from '@/components/ActionBar';
import { loadPdf, mergePdfs, downloadFile } from '@/lib/pdf';
import type { Tool, PdfFile, ProcessingStatus } from '@/types';

interface MergeToolProps {
  tool: Tool;
}

export default function MergeTool({ tool }: MergeToolProps) {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [mergedData, setMergedData] = useState<ArrayBuffer | null>(null);

  const selectedFile = files.find((f) => f.id === selectedFileId) || files[0] || null;

  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    setStatus('loading');

    const loadedFiles: PdfFile[] = [];
    for (const file of newFiles) {
      const buffer = await file.arrayBuffer();
      const result = await loadPdf(buffer, file.name);
      if (result.ok) {
        loadedFiles.push(result.data);
      }
    }

    setFiles((prev) => [...prev, ...loadedFiles]);
    if (loadedFiles.length > 0 && !selectedFileId) {
      setSelectedFileId(loadedFiles[0].id);
    }
    setStatus('idle');
    setMergedData(null);
  }, [selectedFileId]);

  const handleReorder = useCallback((reorderedFiles: PdfFile[]) => {
    setFiles(reorderedFiles);
    setMergedData(null);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
    setMergedData(null);
  }, [selectedFileId]);

  const handleProcess = useCallback(async () => {
    if (files.length < 2) return;

    setStatus('processing');
    const result = await mergePdfs(files);

    if (result.ok) {
      setMergedData(result.data);
      setStatus('complete');
    } else {
      setStatus('error');
      alert(result.error);
    }
  }, [files]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setSelectedFileId(null);
    setStatus('idle');
    setMergedData(null);
  }, []);

  const handleDownload = useCallback(() => {
    if (!mergedData) return;
    downloadFile(mergedData, 'merged.pdf');
  }, [mergedData]);

  const hasFiles = files.length > 0;
  const canProcess = files.length >= 2 && status !== 'processing';

  return (
    <ToolLayout title={tool.name} description={tool.description}>
      {!hasFiles ? (
        // Initial state - show dropzone
        <div className="max-w-2xl mx-auto">
          <Dropzone onFilesAdded={handleFilesAdded} multiple />
        </div>
      ) : (
        // Working state - show three columns
        <ToolColumns
          left={
            <div>
              <FileList
                files={files}
                onReorder={handleReorder}
                onRemove={handleRemove}
                selectedId={selectedFileId || undefined}
                onSelect={setSelectedFileId}
              />

              {/* Add more files button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-privacy-teal hover:text-privacy-teal cursor-pointer transition-colors">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add more files</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={async (e) => {
                      const fileList = Array.from(e.target.files || []);
                      if (fileList.length > 0) {
                        await handleFilesAdded(fileList);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          }
          center={
            <div>
              <PanelHeader
                title="Preview"
                action={
                  status === 'complete' && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Merged successfully
                    </span>
                  )
                }
              />
              <PdfViewer file={selectedFile} />
            </div>
          }
          right={
            <div>
              <PanelHeader title="Output Settings" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <strong>{files.length}</strong> files will be merged in the
                    order shown. Drag to reorder.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-privacy-teal/5 border border-privacy-teal/20">
                  <div className="flex items-center gap-2 text-privacy-teal text-sm font-medium mb-1">
                    <span className="w-2 h-2 rounded-full bg-privacy-teal animate-pulse" />
                    Local Processing
                  </div>
                  <p className="text-xs text-gray-500">
                    Your files are processed locally and never uploaded to any server.
                  </p>
                </div>

                {status === 'complete' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-700 font-medium">
                      PDF merged successfully!
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Click Download to save your merged PDF.
                    </p>
                  </div>
                )}
              </div>
            </div>
          }
        />
      )}

      {/* Action bar */}
      {hasFiles && (
        <ActionBar
          status={status}
          onProcess={handleProcess}
          onReset={handleReset}
          onDownload={handleDownload}
          processLabel="Merge PDFs"
          downloadLabel="Download PDF"
          disabled={!canProcess}
        />
      )}
    </ToolLayout>
  );
}
