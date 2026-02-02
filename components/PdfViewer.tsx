'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PdfFile } from '@/types';

interface PdfViewerProps {
  file: PdfFile | null;
  className?: string;
}

export default function PdfViewer({ file, className }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when file changes
  useEffect(() => {
    setCurrentPage(1);
    setZoom(100);
    setRotation(0);
    setImageUrl(null);
  }, [file?.id]);

  // Render PDF page using PDF.js
  useEffect(() => {
    if (!file) return;

    const renderPage = async () => {
      setLoading(true);
      try {
        // Dynamic import of PDF.js to avoid SSR issues
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const pdf = await pdfjs.getDocument({ data: file.data }).promise;
        const page = await pdf.getPage(currentPage);

        const scale = zoom / 100;
        const viewport = page.getViewport({ scale, rotation });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        setImageUrl(canvas.toDataURL());
      } catch (error) {
        console.error('Failed to render PDF page:', error);
      } finally {
        setLoading(false);
      }
    };

    renderPage();
  }, [file, currentPage, zoom, rotation]);

  if (!file) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-full min-h-[400px] text-gray-400',
          className
        )}
      >
        <div className="text-center">
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm mt-1">Add files to preview them here</p>
        </div>
      </div>
    );
  }

  const totalPages = file.pageCount;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!canGoPrev}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 transition-colors',
              !canGoPrev && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={!canGoNext}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 transition-colors',
              !canGoNext && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            disabled={zoom <= 50}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 transition-colors',
              zoom <= 50 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            disabled={zoom >= 200}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 transition-colors',
              zoom >= 200 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto mt-4 flex items-center justify-center bg-gray-50 rounded-xl p-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-privacy-teal border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : imageUrl ? (
          <motion.img
            key={`${file.id}-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={imageUrl}
            alt={`Page ${currentPage} of ${file.name}`}
            className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
          />
        ) : null}

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
