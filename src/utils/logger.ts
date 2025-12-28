/**
 * Simple logger utility for debugging
 */

export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[APP]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[APP ERROR]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[APP WARN]', ...args);
  },
};

