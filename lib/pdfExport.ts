// ============================================
// PDF Editor - Export / Burn-In Logic
// Takes a source PDF and an array of text
// annotations, and produces a new PDF with all
// text permanently embedded using pdf-lib.
// ============================================

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { TextAnnotation } from '@/components/pdf-editor/types';

/**
 * Map our font family + bold/italic combo to a pdf-lib StandardFont key.
 */
function resolveFont(ann: TextAnnotation): string {
  const { fontFamily, bold, italic } = ann;

  if (fontFamily === 'TimesRoman') {
    if (bold && italic) return StandardFonts.TimesRomanBoldItalic;
    if (bold) return StandardFonts.TimesRomanBold;
    if (italic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }

  if (fontFamily === 'Courier') {
    if (bold && italic) return StandardFonts.CourierBoldOblique;
    if (bold) return StandardFonts.CourierBold;
    if (italic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }

  // Helvetica (default)
  if (bold && italic) return StandardFonts.HelveticaBoldOblique;
  if (bold) return StandardFonts.HelveticaBold;
  if (italic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

/**
 * Parse a hex color string (e.g. "#ef4444") into rgb() values for pdf-lib.
 */
function parseColor(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

/**
 * Burn all text annotations permanently into the PDF.
 *
 * Coordinate system:
 * - annotation.pdfX: distance from left edge in PDF points
 * - annotation.pdfY: distance from BOTTOM edge in PDF points (top of the text line)
 * - pdf-lib drawText y: baseline of the text from bottom edge
 *
 * So we need to subtract the font size (approx) from pdfY to get the baseline.
 */
export async function burnTextAnnotations(
  sourceData: ArrayBuffer,
  annotations: TextAnnotation[]
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(sourceData);
  const pages = pdfDoc.getPages();

  // Embed all needed fonts (deduplicate)
  const fontKeys = new Set(annotations.map(resolveFont));
  const fontMap = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedFont>>>();

  for (const key of fontKeys) {
    const font = await pdfDoc.embedFont(key);
    fontMap.set(key, font);
  }

  // Draw each annotation
  for (const ann of annotations) {
    // Skip empty text boxes
    if (!ann.text.trim()) continue;

    const page = pages[ann.pageIndex];
    if (!page) continue;

    const fontKey = resolveFont(ann);
    const font = fontMap.get(fontKey);
    if (!font) continue;

    const color = parseColor(ann.color);

    // Split text into lines for multiline support
    const lines = ann.text.split('\n');
    const lineHeight = ann.fontSize * 1.2;

    // pdfY is the top of the text box in PDF coords (from bottom).
    // We need to start drawing from the first baseline, which is
    // pdfY minus one fontSize (roughly the ascent).
    let baselineY = ann.pdfY - ann.fontSize;

    for (const line of lines) {
      if (line.length === 0) {
        baselineY -= lineHeight;
        continue;
      }

      page.drawText(line, {
        x: ann.pdfX,
        y: baselineY,
        size: ann.fontSize,
        font,
        color,
      });

      baselineY -= lineHeight;
    }
  }

  const savedData = await pdfDoc.save();
  return savedData.buffer as ArrayBuffer;
}
