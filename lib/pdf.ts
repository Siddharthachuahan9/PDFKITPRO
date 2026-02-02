// ============================================
// PDFKit Pro - PDF Operations
// ============================================

import { PDFDocument, degrees } from 'pdf-lib';
import type { Result, PdfFile } from '@/types';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Load a PDF file from ArrayBuffer
 */
export async function loadPdf(
  data: ArrayBuffer,
  name: string
): Promise<Result<PdfFile>> {
  try {
    const pdfDoc = await PDFDocument.load(data);
    const pageCount = pdfDoc.getPageCount();

    return {
      ok: true,
      data: {
        id: generateId(),
        name,
        size: data.byteLength,
        data,
        pageCount,
        createdAt: Date.now(),
      },
    };
  } catch {
    return { ok: false, error: 'Failed to load PDF. File may be corrupted.' };
  }
}

/**
 * Merge multiple PDFs into one
 */
export async function mergePdfs(
  files: PdfFile[]
): Promise<Result<ArrayBuffer>> {
  if (files.length === 0) {
    return { ok: false, error: 'No files to merge' };
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdf = await PDFDocument.load(file.data);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedData = await mergedPdf.save();
    return { ok: true, data: mergedData.buffer as ArrayBuffer };
  } catch {
    return { ok: false, error: 'Failed to merge PDFs' };
  }
}

/**
 * Split PDF by page ranges
 */
export async function splitPdf(
  file: PdfFile,
  ranges: Array<{ start: number; end: number }>
): Promise<Result<ArrayBuffer[]>> {
  try {
    const sourcePdf = await PDFDocument.load(file.data);
    const results: ArrayBuffer[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from(
        { length: range.end - range.start + 1 },
        (_, i) => range.start + i - 1
      );
      const pages = await newPdf.copyPages(sourcePdf, pageIndices);
      pages.forEach((page) => newPdf.addPage(page));
      const data = await newPdf.save();
      results.push(data.buffer as ArrayBuffer);
    }

    return { ok: true, data: results };
  } catch {
    return { ok: false, error: 'Failed to split PDF' };
  }
}

/**
 * Extract specific pages from PDF
 */
export async function extractPages(
  file: PdfFile,
  pageNumbers: number[]
): Promise<Result<ArrayBuffer>> {
  try {
    const sourcePdf = await PDFDocument.load(file.data);
    const newPdf = await PDFDocument.create();
    const indices = pageNumbers.map((n) => n - 1);
    const pages = await newPdf.copyPages(sourcePdf, indices);
    pages.forEach((page) => newPdf.addPage(page));
    const data = await newPdf.save();
    return { ok: true, data: data.buffer as ArrayBuffer };
  } catch {
    return { ok: false, error: 'Failed to extract pages' };
  }
}

/**
 * Rotate pages in PDF
 */
export async function rotatePages(
  file: PdfFile,
  rotation: 90 | 180 | 270,
  pageNumbers?: number[]
): Promise<Result<ArrayBuffer>> {
  try {
    const pdfDoc = await PDFDocument.load(file.data);
    const pages = pdfDoc.getPages();
    const targetPages = pageNumbers
      ? pageNumbers.map((n) => n - 1)
      : pages.map((_, i) => i);

    targetPages.forEach((index) => {
      const page = pages[index];
      if (page) {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }
    });

    const data = await pdfDoc.save();
    return { ok: true, data: data.buffer as ArrayBuffer };
  } catch {
    return { ok: false, error: 'Failed to rotate pages' };
  }
}

/**
 * Remove metadata from PDF
 */
export async function removeMetadata(
  file: PdfFile
): Promise<Result<ArrayBuffer>> {
  try {
    const pdfDoc = await PDFDocument.load(file.data);
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    pdfDoc.setCreationDate(new Date(0));
    pdfDoc.setModificationDate(new Date(0));

    const data = await pdfDoc.save();
    return { ok: true, data: data.buffer as ArrayBuffer };
  } catch {
    return { ok: false, error: 'Failed to remove metadata' };
  }
}

/**
 * Get PDF metadata
 */
export async function getMetadata(file: PdfFile): Promise<
  Result<{
    title: string | undefined;
    author: string | undefined;
    subject: string | undefined;
    pageCount: number;
  }>
> {
  try {
    const pdfDoc = await PDFDocument.load(file.data);
    return {
      ok: true,
      data: {
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        pageCount: pdfDoc.getPageCount(),
      },
    };
  } catch {
    return { ok: false, error: 'Failed to read metadata' };
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Download a file
 */
export function downloadFile(data: ArrayBuffer, filename: string): void {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
