'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/pdf';
import { PanelHeader } from './ToolLayout';
import type { PdfFile } from '@/types';

interface FileListProps {
  files: PdfFile[];
  onReorder: (files: PdfFile[]) => void;
  onRemove: (id: string) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function FileList({
  files,
  onReorder,
  onRemove,
  selectedId,
  onSelect,
  className,
}: FileListProps) {
  const totalPages = useMemo(
    () => files.reduce((sum, f) => sum + f.pageCount, 0),
    [files]
  );

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files]
  );

  const moveFile = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newFiles = [...files];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= files.length) return;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      onReorder(newFiles);
    },
    [files, onReorder]
  );

  if (files.length === 0) {
    return (
      <div className={className}>
        <PanelHeader title="Files" />
        <div className="py-8 text-center text-gray-400 text-sm">
          No files added yet
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <PanelHeader
        title="Files"
        action={
          <span className="text-xs text-gray-400">
            {files.length} files · {totalPages} pages · {formatFileSize(totalSize)}
          </span>
        }
      />

      <Reorder.Group
        axis="y"
        values={files}
        onReorder={onReorder}
        className="space-y-2"
      >
        <AnimatePresence>
          {files.map((file, index) => (
            <Reorder.Item
              key={file.id}
              value={file}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div
                onClick={() => onSelect?.(file.id)}
                className={cn(
                  'group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer',
                  'border border-transparent transition-all duration-150',
                  selectedId === file.id
                    ? 'bg-privacy-teal/10 border-privacy-teal/30'
                    : 'hover:bg-gray-50'
                )}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-dark truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 pl-6">
                    {file.pageCount} pages · {formatFileSize(file.size)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveFile(index, 'up');
                    }}
                    disabled={index === 0}
                    className={cn(
                      'p-1 rounded hover:bg-gray-100 transition-colors',
                      index === 0 && 'opacity-30 cursor-not-allowed'
                    )}
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveFile(index, 'down');
                    }}
                    disabled={index === files.length - 1}
                    className={cn(
                      'p-1 rounded hover:bg-gray-100 transition-colors',
                      index === files.length - 1 && 'opacity-30 cursor-not-allowed'
                    )}
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(file.id);
                    }}
                    className="p-1 rounded hover:bg-red-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
