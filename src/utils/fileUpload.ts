// File upload utilities for production system

import { supabase } from '../lib/supabase';
import { validateFileUpload } from './security';

export interface UploadOptions {
  bucket: string;
  maxSize?: number;
  allowedTypes?: string[];
  generatePath?: (file: File) => string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

export class FileUploadManager {
  static async uploadSingle(file: File, options: UploadOptions): Promise<UploadResult> {
    try {
      // Validate file
      const validation = validateFileUpload(file, {
        maxSize: options.maxSize,
        allowedTypes: options.allowedTypes
      });
      
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = options.generatePath 
        ? options.generatePath(file)
        : `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(fileName, file);

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(fileName);

      return { 
        success: true, 
        url: publicUrl, 
        fileName: fileName 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  static async uploadMultiple(files: File[], options: UploadOptions): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Report progress
      if (options.onProgress) {
        options.onProgress((i / files.length) * 100);
      }
      
      const result = await this.uploadSingle(file, options);
      results.push(result);
    }
    
    if (options.onProgress) {
      options.onProgress(100);
    }
    
    return results;
  }

  static async deleteFile(bucket: string, fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);
      
      return !error;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  static getFileUrl(bucket: string, fileName: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return publicUrl;
  }

  static async createBucket(bucketName: string, isPublic: boolean = true): Promise<boolean> {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword']
      });
      
      return !error;
    } catch (error) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }
}

export const fileUpload = FileUploadManager;