'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/pdf';
import { FILE_LIMITS, SUPPORTED_TYPES } from '@/lib/constants';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export default function Dropzone({
  onFilesAdded,
  accept = SUPPORTED_TYPES.PDF,
  maxFiles = FILE_LIMITS.MAX_FILES,
  maxSize = FILE_LIMITS.MAX_FILE_SIZE,
  multiple = true,
  className,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      setError(null);

      if (files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return files.slice(0, maxFiles);
      }

      const validFiles = files.filter((file) => {
        if (file.size > maxSize) {
          setError(`File ${file.name} exceeds ${formatFileSize(maxSize)} limit`);
          return false;
        }
        if (accept && !accept.includes(file.type)) {
          setError(`File ${file.name} is not a valid PDF`);
          return false;
        }
        return true;
      });

      return validFiles;
    },
    [accept, maxFiles, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(droppedFiles);

      if (validFiles.length > 0) {
        onFilesAdded(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [validateFiles, onFilesAdded, multiple]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = validateFiles(selectedFiles);

      if (validFiles.length > 0) {
        onFilesAdded(multiple ? validFiles : [validFiles[0]]);
      }

      // Reset input
      e.target.value = '';
    },
    [validateFiles, onFilesAdded, multiple]
  );

  return (
    <div className={cn('relative', className)}>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? '#0FB9B1' : '#E5E7EB',
        }}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 lg:p-12',
          'bg-white/50 hover:bg-white/80 transition-colors',
          'flex flex-col items-center justify-center gap-4',
          'cursor-pointer group'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <motion.div
          animate={{
            scale: isDragActive ? 1.1 : 1,
            y: isDragActive ? -4 : 0,
          }}
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center',
            'bg-privacy-teal/10 group-hover:bg-privacy-teal/20 transition-colors'
          )}
        >
          <Upload
            className={cn(
              'w-8 h-8 text-privacy-teal transition-transform',
              isDragActive && 'scale-110'
            )}
          />
        </motion.div>

        <div className="text-center">
          <p className="text-lg font-medium text-slate-dark">
            {isDragActive ? 'Drop files here' : 'Drag & drop PDFs here'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (max {formatFileSize(maxSize)})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FileText className="w-4 h-4" />
          <span>PDF files only</span>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-red-500 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
            <button
              onClick={() => setError(null)}
              className="p-0.5 hover:bg-red-50 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
