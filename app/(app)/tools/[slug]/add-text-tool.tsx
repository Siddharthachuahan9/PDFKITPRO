// ============================================
// Add Text & Signature Tool — Sejda-style Editor
// Full-page editor with click-to-add text,
// drag/resize, floating toolbar, and burn-to-PDF.
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { Download, RefreshCw, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolLayout from '@/components/ToolLayout';
import Dropzone from '@/components/Dropzone';
import EditorCanvas from '@/components/pdf-editor/EditorCanvas';
import { loadPdf, downloadFile } from '@/lib/pdf';
import { burnTextAnnotations } from '@/lib/pdfExport';
import { cn } from '@/lib/utils';
import type { Tool, PdfFile, ProcessingStatus } from '@/types';
import type { TextAnnotation, EditorTool } from '@/components/pdf-editor/types';

interface AddTextToolProps {
  tool: Tool;
}

export default function AddTextTool({ tool }: AddTextToolProps) {
  const [file, setFile] = useState<PdfFile | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>('text');

  // ---- File upload ----
  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    setStatus('loading');
    const fileData = newFiles[0];
    const buffer = await fileData.arrayBuffer();
    const result = await loadPdf(buffer, fileData.name);

    if (result.ok) {
      setFile(result.data);
      setAnnotations([]);
      setSelectedId(null);
      setActiveTool('text');
    }
    setStatus('idle');
  }, []);

  // ---- Download: burn annotations into PDF ----
  const handleDownload = useCallback(async () => {
    if (!file) return;

    // Filter out empty text boxes
    const validAnnotations = annotations.filter((a) => a.text.trim().length > 0);

    if (validAnnotations.length === 0) {
      alert('No text annotations to save. Click on the PDF to add text first.');
      return;
    }

    setStatus('processing');
    try {
      const resultBuffer = await burnTextAnnotations(file.data, validAnnotations);
      const baseName = file.name.replace(/\.pdf$/i, '');
      downloadFile(resultBuffer, `${baseName}-edited.pdf`);
      setStatus('complete');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to save PDF. Please try again.');
      setStatus('error');
    }
  }, [file, annotations]);

  // ---- Reset everything ----
  const handleReset = useCallback(() => {
    setFile(null);
    setAnnotations([]);
    setSelectedId(null);
    setStatus('idle');
    setActiveTool('text');
  }, []);

  // ---- Deselect when clicking outside ----
  const handleCanvasDeselect = useCallback(() => {
    setSelectedId(null);
  }, []);

  const validCount = annotations.filter((a) => a.text.trim().length > 0).length;

  return (
    <ToolLayout title={tool.name} description={tool.description}>
      {!file ? (
        /* Upload screen */
        <div className="max-w-2xl mx-auto">
          <Dropzone onFilesAdded={handleFilesAdded} multiple={false} />
        </div>
      ) : (
        /* Editor screen */
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {/* Editor canvas takes up most of the space */}
          <div className="flex-1 bg-white rounded-2xl shadow-soft p-4 lg:p-6">
            <EditorCanvas
              file={file}
              annotations={annotations}
              selectedId={selectedId}
              activeTool={activeTool}
              onAnnotationsChange={setAnnotations}
              onSelectedChange={setSelectedId}
            />
          </div>

          {/* Bottom action bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 lg:left-72',
              'bg-white/95 backdrop-blur-md border-t border-gray-100',
              'px-4 py-3 lg:px-6 z-20'
            )}
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              {/* Left: Reset + annotation count */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  disabled={status === 'processing'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                {validCount > 0 && (
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {validCount} text box{validCount !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>

              {/* Center: Privacy badge */}
              <div className="hidden md:flex items-center gap-2 text-xs text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All editing is local — your files never leave your device
              </div>

              {/* Right: Download */}
              <button
                onClick={handleDownload}
                disabled={validCount === 0 || status === 'processing'}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-xl',
                  'bg-gradient-to-r from-trust-blue to-privacy-teal',
                  'text-white font-medium shadow-medium',
                  'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                )}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Apply &amp; Download
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ToolLayout>
  );
}
