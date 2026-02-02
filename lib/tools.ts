// ============================================
// PDFKit Pro - Tool Registry
// ============================================

import type { Tool, ToolCategory } from '@/types';

export const TOOL_CATEGORIES: Record<ToolCategory, { label: string; icon: string }> = {
  essentials: { label: 'Essentials', icon: 'Layers' },
  edit: { label: 'Edit & Organize', icon: 'Edit3' },
  security: { label: 'Security', icon: 'Shield' },
  advanced: { label: 'Advanced', icon: 'Zap' },
};

export const TOOLS: Tool[] = [
  // Essentials
  {
    slug: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one document',
    icon: 'Merge',
    category: 'essentials',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },
  {
    slug: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: 'Minimize2',
    category: 'essentials',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality images',
    icon: 'Image',
    category: 'essentials',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },
  {
    slug: 'split',
    name: 'Split PDF',
    description: 'Extract pages or split into multiple files',
    icon: 'Scissors',
    category: 'essentials',
    isPro: false,
    status: 'ready',
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF',
    icon: 'FileText',
    category: 'essentials',
    isPro: false,
    status: 'soon',
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Combine images into a single PDF',
    icon: 'Images',
    category: 'essentials',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },

  // Edit & Organize
  {
    slug: 'extract-text',
    name: 'Extract Text',
    description: 'Copy text content from PDF',
    icon: 'Type',
    category: 'edit',
    isPro: false,
    status: 'ready',
  },
  {
    slug: 'add-text',
    name: 'Add Text & Signature',
    description: 'Add text, signatures, and annotations',
    icon: 'PenTool',
    category: 'edit',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },
  {
    slug: 'crop',
    name: 'Crop & Resize',
    description: 'Adjust page dimensions and margins',
    icon: 'Crop',
    category: 'edit',
    isPro: false,
    status: 'soon',
  },
  {
    slug: 'organize',
    name: 'Organize Pages',
    description: 'Reorder, rotate, and delete pages',
    icon: 'LayoutGrid',
    category: 'edit',
    isPro: false,
    status: 'ready',
  },
  {
    slug: 'watermark',
    name: 'Watermark',
    description: 'Add text or image watermarks',
    icon: 'Droplet',
    category: 'edit',
    isPro: false,
    status: 'soon',
  },
  {
    slug: 'page-numbers',
    name: 'Page Numbers',
    description: 'Add page numbers to your PDF',
    icon: 'Hash',
    category: 'edit',
    isPro: false,
    status: 'soon',
  },

  // Security
  {
    slug: 'encrypt',
    name: 'Encrypt PDF',
    description: 'Password protect your documents',
    icon: 'Lock',
    category: 'security',
    isPro: false,
    status: 'ready',
    isFeatured: true,
  },
  {
    slug: 'unlock',
    name: 'Remove Password',
    description: 'Unlock password-protected PDFs',
    icon: 'Unlock',
    category: 'security',
    isPro: false,
    status: 'ready',
  },
  {
    slug: 'redact',
    name: 'Redact PDF',
    description: 'Permanently remove sensitive content',
    icon: 'EyeOff',
    category: 'security',
    isPro: true,
    status: 'pro',
  },
  {
    slug: 'metadata',
    name: 'Metadata Cleaner',
    description: 'Remove hidden metadata from PDFs',
    icon: 'FileX',
    category: 'security',
    isPro: false,
    status: 'ready',
  },

  // Advanced
  {
    slug: 'compare',
    name: 'Compare PDFs',
    description: 'Find differences between two documents',
    icon: 'GitCompare',
    category: 'advanced',
    isPro: true,
    status: 'pro',
  },
  {
    slug: 'chat',
    name: 'Chat with PDF',
    description: 'Ask questions about your document using AI',
    icon: 'MessageSquare',
    category: 'advanced',
    isPro: true,
    status: 'pro',
    isFeatured: true,
  },
  {
    slug: 'ocr',
    name: 'OCR',
    description: 'Extract text from scanned documents',
    icon: 'ScanText',
    category: 'advanced',
    isPro: true,
    status: 'pro',
  },
  {
    slug: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    description: 'Convert Markdown files to PDF',
    icon: 'Code',
    category: 'advanced',
    isPro: false,
    status: 'soon',
  },
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert web pages to PDF',
    icon: 'Globe',
    category: 'advanced',
    isPro: false,
    status: 'soon',
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((tool) => tool.isFeatured);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
  );
}
