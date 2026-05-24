import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

const isIgnoredBrowserNoise = (message: string) => (
  message.includes('ERR_BLOCKED_BY_CLIENT') ||
  message.includes('Refused to get unsafe header')
);

export const GlobalErrorHandler = () => {
  const { showToast } = useToast();

  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || String(event.reason || '');
      if (!message || isIgnoredBrowserNoise(message)) return;
      console.error('[GlobalErrorHandler] Unhandled promise rejection:', event.reason);
      showToast('Something took too long. Please try again.', 'error');
    };

    const handleError = (event: ErrorEvent) => {
      const message = event.message || '';
      if (!message || isIgnoredBrowserNoise(message)) return;
      console.error('[GlobalErrorHandler] Runtime error:', event.error || event.message);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, [showToast]);

  return null;
};
