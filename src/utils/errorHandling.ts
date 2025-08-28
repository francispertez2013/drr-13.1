export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(errorMessage, error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new AppError('Network connection failed', 'NETWORK_ERROR', 503);
    }
    
    if (error instanceof Error && error.message.includes('Missing Supabase')) {
      throw new AppError('Database configuration error', 'CONFIG_ERROR', 500);
    }
    
    if (error instanceof Error && error.message.includes('auth')) {
      throw new AppError('Authentication failed', 'AUTH_ERROR', 401);
    }
    
    throw new AppError(errorMessage, 'UNKNOWN_ERROR', 500);
  }
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

export const logError = (error: Error, context: string) => {
  console.error(`[${context}] ${error.name}: ${error.message}`, {
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};