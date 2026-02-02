'use client';

import { useState, useCallback, useRef } from 'react';
import { Plus, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';
import ToolLayout, { ToolColumns, PanelHeader } from '@/components/ToolLayout';
import Dropzone from '@/components/Dropzone';
import PdfViewer from '@/components/PdfViewer';
import ActionBar from '@/components/ActionBar';
import { loadPdf, downloadFile } from '@/lib/pdf';
import { cn } from '@/lib/utils';
import type { Tool, PdfFile, ProcessingStatus } from '@/types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface TextAnnotation {
  id: string;
  text: string;
  page: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: 'Helvetica' | 'Times' | 'Courier';
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
}

interface AddTextToolProps {
  tool: Tool;
}

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Orange', value: '#f97316' },
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

export default function AddTextTool({ tool }: AddTextToolProps) {
  const [file, setFile] = useState<PdfFile | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [processedData, setProcessedData] = useState<ArrayBuffer | null>(null);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // New annotation defaults
  const [newText, setNewText] = useState('Your text here');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState<'Helvetica' | 'Times' | 'Courier'>('Helvetica');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');

  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    setStatus('loading');
    const fileData = newFiles[0];
    const buffer = await fileData.arrayBuffer();
    const result = await loadPdf(buffer, fileData.name);

    if (result.ok) {
      setFile(result.data);
      setAnnotations([]);
      setSelectedAnnotation(null);
      setCurrentPage(1);
    }
    setStatus('idle');
    setProcessedData(null);
  }, []);

  const handleAddAnnotation = useCallback(() => {
    if (!file) return;

    const newAnnotation: TextAnnotation = {
      id: `ann-${Date.now()}`,
      text: newText,
      page: currentPage,
      x: 50, // Default position - center of page
      y: 400,
      fontSize,
      color: fontColor,
      fontFamily,
      bold,
      italic,
      align,
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    setSelectedAnnotation(newAnnotation.id);
  }, [file, newText, currentPage, fontSize, fontColor, fontFamily, bold, italic, align]);

  const handleUpdateAnnotation = useCallback((id: string, updates: Partial<TextAnnotation>) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
    );
  }, []);

  const handleRemoveAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    if (selectedAnnotation === id) {
      setSelectedAnnotation(null);
    }
  }, [selectedAnnotation]);

  const handleProcess = useCallback(async () => {
    if (!file || annotations.length === 0) return;

    setStatus('processing');
    try {
      const pdfDoc = await PDFDocument.load(file.data);
      const pages = pdfDoc.getPages();

      for (const annotation of annotations) {
        const page = pages[annotation.page - 1];
        if (!page) continue;

        // Get the appropriate font
        let fontKey = StandardFonts.Helvetica;
        if (annotation.fontFamily === 'Times') {
          fontKey = annotation.bold
            ? (annotation.italic ? StandardFonts.TimesRomanBoldItalic : StandardFonts.TimesRomanBold)
            : (annotation.italic ? StandardFonts.TimesRomanItalic : StandardFonts.TimesRoman);
        } else if (annotation.fontFamily === 'Courier') {
          fontKey = annotation.bold
            ? (annotation.italic ? StandardFonts.CourierBoldOblique : StandardFonts.CourierBold)
            : (annotation.italic ? StandardFonts.CourierOblique : StandardFonts.Courier);
        } else {
          fontKey = annotation.bold
            ? (annotation.italic ? StandardFonts.HelveticaBoldOblique : StandardFonts.HelveticaBold)
            : (annotation.italic ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica);
        }

        const font = await pdfDoc.embedFont(fontKey);

        // Parse color
        const hex = annotation.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        // Calculate x position based on alignment
        const textWidth = font.widthOfTextAtSize(annotation.text, annotation.fontSize);
        const pageWidth = page.getWidth();
        let x = annotation.x;
        if (annotation.align === 'center') {
          x = (pageWidth - textWidth) / 2;
        } else if (annotation.align === 'right') {
          x = pageWidth - textWidth - 50;
        }

        page.drawText(annotation.text, {
          x,
          y: annotation.y,
          size: annotation.fontSize,
          font,
          color: rgb(r, g, b),
        });
      }

      const savedData = await pdfDoc.save();
      setProcessedData(savedData.buffer as ArrayBuffer);
      setStatus('complete');
    } catch (error) {
      console.error('Failed to add text:', error);
      setStatus('error');
      alert('Failed to add text to PDF');
    }
  }, [file, annotations]);

  const handleReset = useCallback(() => {
    setFile(null);
    setAnnotations([]);
    setSelectedAnnotation(null);
    setStatus('idle');
    setProcessedData(null);
    setCurrentPage(1);
  }, []);

  const handleDownload = useCallback(() => {
    if (!processedData || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadFile(processedData, `${baseName}-edited.pdf`);
  }, [processedData, file]);

  const hasFile = !!file;
  const canProcess = hasFile && annotations.length > 0 && status !== 'processing';

  const selectedAnn = annotations.find((a) => a.id === selectedAnnotation);

  return (
    <ToolLayout title={tool.name} description={tool.description}>
      {!hasFile ? (
        <div className="max-w-2xl mx-auto">
          <Dropzone onFilesAdded={handleFilesAdded} multiple={false} />
        </div>
      ) : (
        <ToolColumns
          left={
            <div className="space-y-4">
              <PanelHeader title="Text Annotations" />

              {/* Add new annotation */}
              <div className="space-y-3 p-4 rounded-xl bg-gray-50">
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter your text..."
                  className="w-full p-3 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-privacy-teal/20 focus:border-privacy-teal"
                  rows={2}
                />

                {/* Font controls */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as typeof fontFamily)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times">Times</option>
                    <option value="Courier">Courier</option>
                  </select>

                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
                  >
                    {FONT_SIZES.map((size) => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Style buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBold(!bold)}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      bold ? 'bg-slate-dark text-white border-slate-dark' : 'border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setItalic(!italic)}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      italic ? 'bg-slate-dark text-white border-slate-dark' : 'border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <div className="w-px h-6 bg-gray-200 mx-1" />

                  <button
                    onClick={() => setAlign('left')}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      align === 'left' ? 'bg-slate-dark text-white border-slate-dark' : 'border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAlign('center')}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      align === 'center' ? 'bg-slate-dark text-white border-slate-dark' : 'border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAlign('right')}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      align === 'right' ? 'bg-slate-dark text-white border-slate-dark' : 'border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFontColor(color.value)}
                      className={cn(
                        'w-6 h-6 rounded-full border-2 transition-all',
                        fontColor === color.value ? 'border-slate-dark scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>

                <button
                  onClick={handleAddAnnotation}
                  className="w-full py-2.5 rounded-xl bg-privacy-teal text-white font-medium hover:bg-privacy-teal/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Page {currentPage}
                </button>
              </div>

              {/* Annotations list */}
              {annotations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Added Text ({annotations.length})
                  </h4>
                  {annotations.map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => setSelectedAnnotation(ann.id)}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all',
                        selectedAnnotation === ann.id
                          ? 'border-privacy-teal bg-privacy-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-dark truncate">
                            {ann.text}
                          </p>
                          <p className="text-xs text-gray-500">
                            Page {ann.page} • {ann.fontSize}px • {ann.fontFamily}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAnnotation(ann.id);
                          }}
                          className="text-gray-400 hover:text-rose-500 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          }
          center={
            <div>
              <PanelHeader
                title="Preview"
                action={
                  file && (
                    <span className="text-xs text-gray-500">
                      Page {currentPage} of {file.pageCount}
                    </span>
                  )
                }
              />
              <PdfViewer file={file} />
            </div>
          }
          right={
            <div>
              <PanelHeader title="Output Settings" />
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <strong>{annotations.length}</strong> text annotation{annotations.length !== 1 ? 's' : ''} will be added to your PDF.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-privacy-teal/5 border border-privacy-teal/20">
                  <div className="flex items-center gap-2 text-privacy-teal text-sm font-medium mb-1">
                    <span className="w-2 h-2 rounded-full bg-privacy-teal animate-pulse" />
                    Local Processing
                  </div>
                  <p className="text-xs text-gray-500">
                    Your PDF is edited locally and never uploaded to any server.
                  </p>
                </div>

                {status === 'complete' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-700 font-medium">
                      Text added successfully!
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Click Download to save your edited PDF.
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm text-amber-700 font-medium mb-1">
                    Tip
                  </p>
                  <p className="text-xs text-amber-600">
                    Text position is approximate. For precise positioning, use coordinates in the Y position field.
                  </p>
                </div>
              </div>
            </div>
          }
        />
      )}

      {hasFile && (
        <ActionBar
          status={status}
          onProcess={handleProcess}
          onReset={handleReset}
          onDownload={handleDownload}
          processLabel="Add Text"
          downloadLabel="Download PDF"
          disabled={!canProcess}
        />
      )}
    </ToolLayout>
  );
}
