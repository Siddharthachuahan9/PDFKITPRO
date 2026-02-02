// ============================================
// PDFKit Pro - AI Proxy Client (Skeleton)
// ============================================

import type { Result } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  sources?: Array<{ page: number; text: string }>;
}

/**
 * Chat with a PDF document
 * Uses the /api/ai endpoint to proxy requests to OpenAI/Mistral
 */
export async function chatWithPdf(
  documentId: string,
  messages: ChatMessage[]
): Promise<Result<ChatResponse>> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, messages }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'AI request failed' };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'Failed to connect to AI service' };
  }
}

/**
 * Summarize a PDF document
 */
export async function summarizePdf(
  documentId: string
): Promise<Result<string>> {
  try {
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'Summarization failed' };
    }

    const data = await response.json();
    return { ok: true, data: data.summary };
  } catch {
    return { ok: false, error: 'Failed to summarize document' };
  }
}

/**
 * Extract key points from a PDF
 */
export async function extractKeyPoints(
  documentId: string
): Promise<Result<string[]>> {
  try {
    const response = await fetch('/api/ai/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.message || 'Extraction failed' };
    }

    const data = await response.json();
    return { ok: true, data: data.keyPoints };
  } catch {
    return { ok: false, error: 'Failed to extract key points' };
  }
}
