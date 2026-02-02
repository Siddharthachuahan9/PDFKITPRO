import { useEffect } from 'react';

/**
 * Hook to handle Escape key press
 * @param onEscape - Callback when Escape is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useEscapeKey(onEscape: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, enabled]);
}
