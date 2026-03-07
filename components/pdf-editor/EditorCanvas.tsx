// ============================================
// PDF Editor - Editor Canvas
// Renders the PDF page on a <canvas>, overlays
// interactive text boxes, and handles click-to-add.
// ============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Type, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PdfFile } from '@/types';
import TextOverlay from './TextOverlay';
import FloatingToolbar from './FloatingToolbar';
import type { TextAnnotation, PageDimensions, EditorTool } from './types';
import { screenToPdf } from './types';

interface EditorCanvasProps {
  file: PdfFile;
  annotations: TextAnnotation[];
  selectedId: string | null;
  activeTool: EditorTool;
  onAnnotationsChange: (annotations: TextAnnotation[]) => void;
  onSelectedChange: (id: string | null) => void;
}

/** Default scale: 1.5x for crisp rendering */
const DEFAULT_SCALE = 1.5;

export default function EditorCanvas({
  file,
  annotations,
  selectedId,
  activeTool,
  onAnnotationsChange,
  onSelectedChange,
}: EditorCanvasProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [zoom, setZoom] = useState(100); // percentage
  const [pageDims, setPageDims] = useState<PageDimensions | null>(null);
  const [loading, setLoading] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Effective scale: base scale * zoom
  const scale = DEFAULT_SCALE * (zoom / 100);

  // ---- Render PDF page to canvas ----
  useEffect(() => {
    if (!file?.data) return;

    let isMounted = true;

    const renderPage = async () => {
      setLoading(true);
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const uint8Array = new Uint8Array(file.data.slice(0));
        const pdf = await pdfjs.getDocument({ data: uint8Array }).promise;

        if (!isMounted) { pdf.destroy(); return; }

        const page = await pdf.getPage(currentPage + 1); // PDF.js is 1-based

        if (!isMounted) { pdf.destroy(); return; }

        const viewport = page.getViewport({ scale });

        // Store the page dimensions in PDF points
        const rawViewport = page.getViewport({ scale: 1 });
        if (isMounted) {
          setPageDims({ width: rawViewport.width, height: rawViewport.height });
        }

        const canvas = canvasRef.current;
        if (!canvas) { pdf.destroy(); return; }

        const context = canvas.getContext('2d');
        if (!context) { pdf.destroy(); return; }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        pdf.destroy();
      } catch (error) {
        console.error('Failed to render PDF page:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    renderPage();

    return () => { isMounted = false; };
  }, [file, currentPage, scale]);

  // Reset page when file changes
  useEffect(() => {
    setCurrentPage(0);
    setZoom(100);
  }, [file?.id]);

  // ---- Click on canvas to place a text box ----
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only create text boxes in text mode
      if (activeTool !== 'text') return;

      // Don't create if clicking on an existing overlay
      const target = e.target as HTMLElement;
      if (target !== overlayRef.current && target !== canvasRef.current) return;

      if (!pageDims) return;

      // Get click position relative to the overlay container
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert to PDF coordinates
      const { pdfX, pdfY } = screenToPdf(clickX, clickY, scale, pageDims.height);

      // Create a new text annotation
      const defaultWidth = 150; // PDF points
      const defaultHeight = 24; // PDF points
      const id = `text-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const newAnnotation: TextAnnotation = {
        id,
        pageIndex: currentPage,
        pdfX: Math.max(0, pdfX),
        pdfY: Math.min(pageDims.height, pdfY + defaultHeight), // Offset so text appears at click point
        pdfWidth: defaultWidth,
        pdfHeight: defaultHeight,
        text: '',
        fontSize: 16,
        fontFamily: 'Helvetica',
        color: '#000000',
        bold: false,
        italic: false,
        underline: false,
      };

      onAnnotationsChange([...annotations, newAnnotation]);
      onSelectedChange(id);
      setFreshId(id);
    },
    [activeTool, pageDims, scale, currentPage, annotations, onAnnotationsChange, onSelectedChange]
  );

  // ---- Deselect when clicking on empty canvas ----
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool === 'text') return; // In text mode, clicks create boxes
      const target = e.target as HTMLElement;
      if (target === overlayRef.current || target === canvasRef.current) {
        onSelectedChange(null);
      }
    },
    [activeTool, onSelectedChange]
  );

  // ---- Update a single annotation ----
  const updateAnnotation = useCallback(
    (id: string, updates: Partial<TextAnnotation>) => {
      onAnnotationsChange(
        annotations.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    [annotations, onAnnotationsChange]
  );

  // ---- Delete an annotation ----
  const deleteAnnotation = useCallback(
    (id: string) => {
      onAnnotationsChange(annotations.filter((a) => a.id !== id));
      if (selectedId === id) onSelectedChange(null);
    },
    [annotations, selectedId, onAnnotationsChange, onSelectedChange]
  );

  // Filter annotations for current page
  const pageAnnotations = annotations.filter((a) => a.pageIndex === currentPage);
  const selectedAnnotation = annotations.find((a) => a.id === selectedId);

  // Compute floating toolbar position
  const getToolbarPosition = () => {
    if (!selectedAnnotation || !pageDims || !containerRef.current) {
      return { x: 0, y: 0 };
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const screenX = selectedAnnotation.pdfX * scale;
    const screenY = (pageDims.height - selectedAnnotation.pdfY) * scale;
    return {
      x: containerRect.left + screenX + (selectedAnnotation.pdfWidth * scale) / 2,
      y: containerRect.top + screenY,
    };
  };

  const totalPages = file.pageCount;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar: page nav + zoom + tool selector */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        {/* Tool selector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              // Toggle between select and text mode via parent — for now just deselect
              onSelectedChange(null);
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTool === 'text'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            )}
            title="Click anywhere on the PDF to add text"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Add Text</span>
          </button>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={!canGoPrev}
            className={cn(
              'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              !canGoPrev && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={!canGoNext}
            className={cn(
              'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              !canGoNext && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            disabled={zoom <= 50}
            className={cn(
              'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              zoom <= 50 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 min-w-[40px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            disabled={zoom >= 200}
            className={cn(
              'p-1.5 rounded-lg hover:bg-gray-100 transition-colors',
              zoom >= 200 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hint bar */}
      {activeTool === 'text' && (
        <div className="py-2 px-3 bg-blue-50 text-blue-700 text-xs rounded-lg mt-2 flex items-center gap-2">
          <Type className="w-3.5 h-3.5 flex-shrink-0" />
          Click anywhere on the page to place a text box. Type immediately, then click outside to deselect.
        </div>
      )}

      {/* Canvas area with overlays */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto mt-3 flex justify-center bg-gray-100 rounded-xl p-4"
      >
        {loading && (
          <div className="flex items-center justify-center w-full min-h-[400px]">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div
          className="relative inline-block shadow-lg"
          style={{ display: loading ? 'none' : 'inline-block' }}
        >
          {/* PDF canvas */}
          <canvas
            ref={canvasRef}
            className="block rounded-sm"
            style={{ cursor: activeTool === 'text' ? 'crosshair' : 'default' }}
          />

          {/* Overlay container — same dimensions as canvas, positioned on top */}
          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{ cursor: activeTool === 'text' ? 'crosshair' : 'default' }}
            onClick={activeTool === 'text' ? handleCanvasClick : handleBackgroundClick}
          >
            {pageDims &&
              pageAnnotations.map((ann) => (
                <TextOverlay
                  key={ann.id}
                  annotation={ann}
                  scale={scale}
                  pageHeight={pageDims.height}
                  isSelected={ann.id === selectedId}
                  autoFocus={ann.id === freshId}
                  onSelect={() => {
                    onSelectedChange(ann.id);
                    setFreshId(null);
                  }}
                  onChange={(updates) => updateAnnotation(ann.id, updates)}
                  onBlur={() => {
                    // Don't deselect if user is clicking toolbar
                  }}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Floating toolbar for selected annotation */}
      {selectedAnnotation && pageDims && (() => {
        const pos = getToolbarPosition();
        return (
          <FloatingToolbar
            annotation={selectedAnnotation}
            anchorX={pos.x}
            anchorY={pos.y}
            scale={scale}
            onChange={(updates) => updateAnnotation(selectedAnnotation.id, updates)}
            onDelete={() => deleteAnnotation(selectedAnnotation.id)}
          />
        );
      })()}
    </div>
  );
}
