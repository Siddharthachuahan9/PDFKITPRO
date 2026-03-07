// ============================================
// PDF Editor - Shared Type Definitions
// ============================================

/** A text annotation placed on a PDF page */
export interface TextAnnotation {
  id: string;
  /** 0-based page index */
  pageIndex: number;
  /** X position in PDF points (from left edge) */
  pdfX: number;
  /** Y position in PDF points (from bottom edge, PDF coordinate system) */
  pdfY: number;
  /** Width in PDF points */
  pdfWidth: number;
  /** Height in PDF points */
  pdfHeight: number;
  /** The text content (may contain newlines) */
  text: string;
  /** Font size in PDF points */
  fontSize: number;
  /** Font family name for display + export */
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
  /** Hex color string e.g. "#000000" */
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

/** A whiteout rectangle placed over PDF content */
export interface WhiteoutAnnotation {
  id: string;
  pageIndex: number;
  pdfX: number;
  pdfY: number;
  pdfWidth: number;
  pdfHeight: number;
}

/** An image annotation placed on a PDF page */
export interface ImageAnnotation {
  id: string;
  pageIndex: number;
  pdfX: number;
  pdfY: number;
  pdfWidth: number;
  pdfHeight: number;
  /** Base64 data URL of the image */
  dataUrl: string;
  /** Original MIME type */
  mimeType: 'image/png' | 'image/jpeg';
}

/** All annotation types combined */
export type Annotation = TextAnnotation | WhiteoutAnnotation | ImageAnnotation;

/** The active tool mode in the editor */
export type EditorTool = 'text' | 'whiteout' | 'highlight' | 'image' | 'signature' | 'select';

/** Page dimensions from the PDF */
export interface PageDimensions {
  /** Width in PDF points */
  width: number;
  /** Height in PDF points */
  height: number;
}

// ============================================
// Coordinate conversion helpers
// ============================================

/**
 * Convert screen/canvas coordinates to PDF coordinates.
 * Screen: origin top-left, Y increases downward.
 * PDF: origin bottom-left, Y increases upward.
 */
export function screenToPdf(
  screenX: number,
  screenY: number,
  scale: number,
  pageHeight: number
): { pdfX: number; pdfY: number } {
  return {
    pdfX: screenX / scale,
    pdfY: pageHeight - screenY / scale,
  };
}

/**
 * Convert PDF coordinates to screen/canvas coordinates.
 */
export function pdfToScreen(
  pdfX: number,
  pdfY: number,
  scale: number,
  pageHeight: number
): { screenX: number; screenY: number } {
  return {
    screenX: pdfX * scale,
    screenY: (pageHeight - pdfY) * scale,
  };
}

/**
 * Map a CSS font family string for the given pdf-lib font name.
 */
export function fontFamilyToCss(fontFamily: TextAnnotation['fontFamily']): string {
  switch (fontFamily) {
    case 'Helvetica':
      return 'Helvetica, Arial, sans-serif';
    case 'TimesRoman':
      return '"Times New Roman", Times, serif';
    case 'Courier':
      return '"Courier New", Courier, monospace';
    default:
      return 'Helvetica, Arial, sans-serif';
  }
}
