// ============================================
// PDF Editor - Floating Toolbar
// Appears above the selected text box with
// font, size, bold, italic, underline, color controls.
// ============================================

'use client';

import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TextAnnotation } from './types';

interface FloatingToolbarProps {
  /** The annotation being edited */
  annotation: TextAnnotation;
  /** Screen-space position for the toolbar (top-left of text box) */
  anchorX: number;
  anchorY: number;
  /** Scale factor for proper font size display */
  scale: number;
  /** Callback when a property changes */
  onChange: (updates: Partial<TextAnnotation>) => void;
  /** Callback to delete the annotation */
  onDelete: () => void;
}

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

const FONT_FAMILIES: { label: string; value: TextAnnotation['fontFamily'] }[] = [
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times Roman', value: 'TimesRoman' },
  { label: 'Courier', value: 'Courier' },
];

const PRESET_COLORS = [
  '#000000', '#ef4444', '#3b82f6', '#22c55e',
  '#8b5cf6', '#f97316', '#ec4899', '#6b7280',
];

export default function FloatingToolbar({
  annotation,
  anchorX,
  anchorY,
  scale,
  onChange,
  onDelete,
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Position the toolbar above the text box, clamped to viewport
  useEffect(() => {
    if (!toolbarRef.current) return;
    const rect = toolbarRef.current.getBoundingClientRect();
    const toolbar = toolbarRef.current;

    // Ensure toolbar doesn't go off-screen left
    if (rect.left < 8) {
      toolbar.style.left = '8px';
      toolbar.style.transform = 'none';
    }
    // Ensure toolbar doesn't go off-screen right
    if (rect.right > window.innerWidth - 8) {
      toolbar.style.left = `${window.innerWidth - rect.width - 8}px`;
      toolbar.style.transform = 'none';
    }
  }, [anchorX, anchorY]);

  // Prevent toolbar clicks from propagating to the canvas
  const stopProp = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] flex items-center gap-1 px-2 py-1.5 bg-white rounded-lg shadow-lg border border-gray-200 select-none"
      style={{
        left: anchorX,
        top: Math.max(8, anchorY - 48),
        transform: 'translateX(-50%)',
      }}
      onMouseDown={stopProp}
      onClick={stopProp}
    >
      {/* Font family */}
      <select
        value={annotation.fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value as TextAnnotation['fontFamily'] })}
        className="h-7 px-1.5 text-xs border border-gray-200 rounded bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Font size */}
      <select
        value={annotation.fontSize}
        onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
        className="h-7 w-14 px-1 text-xs border border-gray-200 rounded bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer text-center"
      >
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Bold */}
      <button
        onClick={() => onChange({ bold: !annotation.bold })}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded transition-colors',
          annotation.bold
            ? 'bg-gray-800 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        )}
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => onChange({ italic: !annotation.italic })}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded transition-colors',
          annotation.italic
            ? 'bg-gray-800 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        )}
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        onClick={() => onChange({ underline: !annotation.underline })}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded transition-colors',
          annotation.underline
            ? 'bg-gray-800 text-white'
            : 'hover:bg-gray-100 text-gray-600'
        )}
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Color picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="Text color"
        >
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: annotation.color }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 grid grid-cols-4 gap-1.5 z-10">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange({ color });
                  setShowColorPicker(false);
                }}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  annotation.color === color
                    ? 'border-gray-800 scale-110'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
            {/* Custom color input */}
            <label className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden">
              <input
                type="color"
                value={annotation.color}
                onChange={(e) => {
                  onChange({ color: e.target.value });
                  setShowColorPicker(false);
                }}
                className="opacity-0 absolute w-0 h-0"
              />
              <span className="text-[8px] text-gray-400">+</span>
            </label>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete text box"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
