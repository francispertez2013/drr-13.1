import { useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { AppError, logError } from '../utils/errorHandling';

export const useErrorHandler = () => {
  const { addNotification } = useNotifications();

  const handleError = useCallback((error: Error, context: string = 'Application') => {
    logError(error, context);

    if (error instanceof AppError) {
      addNotification('error', 'Error', error.message);
    } else if (error.message.includes('fetch')) {
      addNotification('error', 'Network Error', 'Unable to connect to the server. Please check your internet connection.');
    } else if (error.message.includes('auth')) {
      addNotification('error', 'Authentication Error', 'Please log in again to continue.');
    } else {
      addNotification('error', 'Unexpected Error', 'Something went wrong. Please try again.');
    }
  }, [addNotification]);

  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    context: string = 'Operation'
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncOperation };
};