// ============================================
// PDF Editor - Text Overlay Component
// A contenteditable div that sits on top of
// the PDF canvas. Supports drag-to-move and
// corner-handle resize.
// ============================================

'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TextAnnotation } from './types';
import { fontFamilyToCss } from './types';

interface TextOverlayProps {
  annotation: TextAnnotation;
  /** Current scale factor (canvas pixels per PDF point) */
  scale: number;
  /** Page height in PDF points (for Y-axis conversion) */
  pageHeight: number;
  /** Whether this text box is currently selected */
  isSelected: boolean;
  /** Whether this is a freshly created box that should auto-focus */
  autoFocus?: boolean;
  /** Callback when selected */
  onSelect: () => void;
  /** Callback when text or dimensions change */
  onChange: (updates: Partial<TextAnnotation>) => void;
  /** Callback when the text box loses focus (click outside) */
  onBlur: () => void;
}

/** Minimum dimensions in screen pixels */
const MIN_WIDTH = 40;
const MIN_HEIGHT = 20;

export default function TextOverlay({
  annotation,
  scale,
  pageHeight,
  isSelected,
  autoFocus,
  onSelect,
  onChange,
  onBlur,
}: TextOverlayProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, startW: 0, startH: 0 });

  // Convert PDF coords to screen coords for display
  const screenX = annotation.pdfX * scale;
  // PDF Y is from bottom, screen Y is from top
  const screenY = (pageHeight - annotation.pdfY) * scale;
  const screenWidth = annotation.pdfWidth * scale;
  const screenHeight = annotation.pdfHeight * scale;

  // Scale the font size for display
  const displayFontSize = annotation.fontSize * scale;

  // Auto-focus the contenteditable when first created
  useEffect(() => {
    if (autoFocus && editRef.current && isSelected) {
      editRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [autoFocus, isSelected]);

  // Sync text content when annotation changes externally
  useEffect(() => {
    if (editRef.current && editRef.current.innerText !== annotation.text) {
      editRef.current.innerText = annotation.text;
    }
  }, [annotation.text]);

  // ---- Drag-to-move logic ----
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Only drag from the border/handle area, not from inside the text
      const target = e.target as HTMLElement;
      if (target === editRef.current || editRef.current?.contains(target)) {
        // Clicked inside the editable area — don't start drag
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      dragStart.current = {
        x: clientX,
        y: clientY,
        startX: annotation.pdfX,
        startY: annotation.pdfY,
      };

      const handleDragMove = (ev: MouseEvent | TouchEvent) => {
        const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
        const cy = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;

        const dx = (cx - dragStart.current.x) / scale;
        // Screen Y is inverted relative to PDF Y
        const dy = -(cy - dragStart.current.y) / scale;

        onChange({
          pdfX: dragStart.current.startX + dx,
          pdfY: dragStart.current.startY + dy,
        });
      };

      const handleDragEnd = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };

      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    },
    [annotation.pdfX, annotation.pdfY, scale, onChange]
  );

  // ---- Corner-resize logic ----
  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      resizeStart.current = {
        x: clientX,
        y: clientY,
        startW: annotation.pdfWidth,
        startH: annotation.pdfHeight,
      };

      const handleResizeMove = (ev: MouseEvent | TouchEvent) => {
        const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
        const cy = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;

        const dw = (cx - resizeStart.current.x) / scale;
        const dh = (cy - resizeStart.current.y) / scale;

        const newWidth = Math.max(MIN_WIDTH / scale, resizeStart.current.startW + dw);
        const newHeight = Math.max(MIN_HEIGHT / scale, resizeStart.current.startH + dh);

        onChange({
          pdfWidth: newWidth,
          pdfHeight: newHeight,
        });
      };

      const handleResizeEnd = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
        window.removeEventListener('touchmove', handleResizeMove);
        window.removeEventListener('touchend', handleResizeEnd);
      };

      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      window.addEventListener('touchmove', handleResizeMove, { passive: false });
      window.addEventListener('touchend', handleResizeEnd);
    },
    [annotation.pdfWidth, annotation.pdfHeight, scale, onChange]
  );

  // Handle text input
  const handleInput = useCallback(() => {
    if (!editRef.current) return;
    const newText = editRef.current.innerText;
    onChange({ text: newText });

    // Auto-expand height based on content
    const el = editRef.current;
    const contentHeight = el.scrollHeight;
    const currentScreenHeight = annotation.pdfHeight * scale;
    if (contentHeight > currentScreenHeight) {
      onChange({ pdfHeight: contentHeight / scale });
    }
  }, [onChange, annotation.pdfHeight, scale]);

  // Handle clicking on the box
  const handleBoxMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  return (
    <div
      ref={boxRef}
      className={cn(
        'absolute group',
        isDragging && 'cursor-grabbing',
        isResizing && 'cursor-nwse-resize',
        !isDragging && !isResizing && 'cursor-move'
      )}
      style={{
        left: screenX,
        top: screenY,
        width: screenWidth,
        minHeight: screenHeight,
      }}
      onMouseDown={handleBoxMouseDown}
      onTouchStart={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection border + drag handle area */}
      <div
        className={cn(
          'absolute inset-0 rounded-sm transition-all pointer-events-none',
          isSelected
            ? 'border-2 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]'
            : 'border border-transparent group-hover:border-blue-300'
        )}
      />

      {/* Drag handle — the entire border area triggers drag */}
      <div
        className="absolute -inset-1 cursor-move"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{ zIndex: 0 }}
      />

      {/* The editable text area */}
      <div
        ref={editRef}
        contentEditable={isSelected}
        suppressContentEditableWarning
        className={cn(
          'relative outline-none whitespace-pre-wrap break-words w-full min-h-full',
          'px-0.5',
          isSelected ? 'cursor-text' : 'cursor-move'
        )}
        style={{
          fontFamily: fontFamilyToCss(annotation.fontFamily),
          fontSize: `${displayFontSize}px`,
          lineHeight: 1.2,
          fontWeight: annotation.bold ? 'bold' : 'normal',
          fontStyle: annotation.italic ? 'italic' : 'normal',
          textDecoration: annotation.underline ? 'underline' : 'none',
          color: annotation.color,
          zIndex: 1,
        }}
        onInput={handleInput}
        onBlur={() => {
          // Small delay so toolbar clicks register before blur fires
          setTimeout(() => {
            if (!boxRef.current?.contains(document.activeElement)) {
              onBlur();
            }
          }, 150);
        }}
      >
        {annotation.text}
      </div>

      {/* Resize handle (bottom-right corner) — only when selected */}
      {isSelected && (
        <>
          {/* Bottom-right */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-10 hover:bg-blue-600 transition-colors"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          />
          {/* Bottom-left */}
          <div
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-10 hover:bg-blue-600 transition-colors"
            onMouseDown={(e) => {
              // For bottom-left, we need different resize logic
              e.preventDefault();
              e.stopPropagation();
              // Keep it simple — only bottom-right for now
            }}
            style={{ opacity: 0.5 }}
          />
        </>
      )}
    </div>
  );
}
