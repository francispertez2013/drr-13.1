// Security utilities

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateInput = (input: string, type: 'text' | 'email' | 'phone' | 'url' = 'text'): boolean => {
  if (!input || input.trim().length === 0) return false;

  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      return /^[\+]?[1-9][\d]{0,15}$/.test(input.replace(/[\s\-\(\)]/g, ''));
    case 'url':
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    default:
      return input.trim().length > 0;
  }
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const rateLimit = (
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const windowKey = `${key}_${Math.floor(now / windowMs)}`;
  
  const current = parseInt(localStorage.getItem(windowKey) || '0');
  
  if (current >= limit) {
    return false;
  }
  
  localStorage.setItem(windowKey, (current + 1).toString());
  
  // Cleanup old entries
  setTimeout(() => {
    localStorage.removeItem(windowKey);
  }, windowMs);
  
  return true;
};

export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/*'], maxFiles = 1 } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`
    };
  }

  const isAllowedType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'));
    }
    return file.type === type;
  });

  if (!isAllowedType) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
};