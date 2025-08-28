// Resource validation utilities for production system

import { validateUrl, validateRequired, validateFileUpload } from './validation';
import type { Resource } from '../types';

export interface ResourceValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export interface ResourceFormData {
  title: string;
  description: string;
  file_url: string;
  file_type: Resource['file_type'];
  file_size?: number;
  category: Resource['category'];
  subcategory?: string;
  tags: string[];
  featured?: boolean;
  status: Resource['status'];
}

export const validateResourceForm = (formData: ResourceFormData): ResourceValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // Required field validation
  if (!validateRequired(formData.title)) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (formData.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!validateRequired(formData.file_url)) {
    errors.file_url = 'File URL is required';
  } else if (!validateUrl(formData.file_url)) {
    errors.file_url = 'Please enter a valid URL';
  }

  // Category validation
  const validCategories = ['guide', 'form', 'map', 'report', 'plan', 'manual'];
  if (!validCategories.includes(formData.category)) {
    errors.category = 'Please select a valid category';
  }

  // File type validation
  const validFileTypes = ['pdf', 'doc', 'docx', 'image', 'video', 'zip'];
  if (!validFileTypes.includes(formData.file_type)) {
    errors.file_type = 'Please select a valid file type';
  }

  // Tags validation
  if (formData.tags.length === 0) {
    warnings.push('Consider adding tags to improve discoverability');
  } else if (formData.tags.length > 10) {
    warnings.push('Too many tags may reduce effectiveness. Consider using 3-5 relevant tags.');
  }

  // File size validation
  if (formData.file_size && formData.file_size > 50 * 1024 * 1024) { // 50MB
    warnings.push('Large file size may affect download performance');
  }

  // URL accessibility validation (async check would be done separately)
  if (formData.file_url && !formData.file_url.startsWith('https://')) {
    warnings.push('Consider using HTTPS URLs for better security');
  }

  // SEO and accessibility warnings
  if (formData.description.length < 50) {
    warnings.push('Longer descriptions improve SEO and user understanding');
  }

  if (!formData.subcategory && formData.category === 'guide') {
    warnings.push('Subcategory helps users find specific types of guides');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

export const validateResourceFile = async (url: string): Promise<{
  valid: boolean;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    accessible: boolean;
  };
}> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      return {
        valid: false,
        error: `File not accessible: HTTP ${response.status}`
      };
    }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    return {
      valid: true,
      metadata: {
        size: contentLength ? parseInt(contentLength) : 0,
        type: contentType || 'unknown',
        accessible: true
      }
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
};

export const sanitizeResourceData = (formData: ResourceFormData): ResourceFormData => {
  return {
    title: formData.title.trim(),
    description: formData.description.trim(),
    file_url: formData.file_url.trim(),
    file_type: formData.file_type,
    file_size: formData.file_size,
    category: formData.category,
    subcategory: formData.subcategory?.trim(),
    tags: formData.tags.map(tag => tag.trim()).filter(tag => tag.length > 0),
    featured: formData.featured,
    status: formData.status
  };
};

export const generateResourceSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50); // Limit length
};

export const validateResourceBatch = (resources: ResourceFormData[]): {
  valid: ResourceFormData[];
  invalid: Array<{ index: number; data: ResourceFormData; errors: Record<string, string> }>;
} => {
  const valid: ResourceFormData[] = [];
  const invalid: Array<{ index: number; data: ResourceFormData; errors: Record<string, string> }> = [];

  resources.forEach((resource, index) => {
    const validation = validateResourceForm(resource);
    
    if (validation.isValid) {
      valid.push(sanitizeResourceData(resource));
    } else {
      invalid.push({
        index,
        data: resource,
        errors: validation.errors
      });
    }
  });

  return { valid, invalid };
};