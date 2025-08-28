// Enhanced database utilities for production system

import { supabase } from '../lib/supabase';
import { handleAsyncError } from './errorHandling';

export class DatabaseOperations {
  // Generic CRUD operations with error handling
  static async create<T>(table: string, data: any): Promise<T> {
    return handleAsyncError(async () => {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    }, `Failed to create ${table} record`);
  }

  static async read<T>(table: string, filters?: any): Promise<T[]> {
    return handleAsyncError(async () => {
      let query = supabase.from(table).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }, `Failed to read ${table} records`);
  }

  static async update<T>(table: string, id: string, data: any): Promise<T> {
    return handleAsyncError(async () => {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    }, `Failed to update ${table} record`);
  }

  static async delete(table: string, id: string): Promise<void> {
    return handleAsyncError(async () => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }, `Failed to delete ${table} record`);
  }

  // File upload operations
  static async uploadFile(bucket: string, file: File, path?: string): Promise<string> {
    return handleAsyncError(async () => {
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    }, 'Failed to upload file');
  }

  static async deleteFile(bucket: string, path: string): Promise<void> {
    return handleAsyncError(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
    }, 'Failed to delete file');
  }

  // Batch operations
  static async batchCreate<T>(table: string, records: any[]): Promise<T[]> {
    return handleAsyncError(async () => {
      const { data, error } = await supabase
        .from(table)
        .insert(records)
        .select();
      
      if (error) throw error;
      return data || [];
    }, `Failed to batch create ${table} records`);
  }

  static async batchUpdate<T>(table: string, updates: Array<{ id: string; data: any }>): Promise<T[]> {
    return handleAsyncError(async () => {
      const promises = updates.map(({ id, data }) =>
        supabase.from(table).update(data).eq('id', id).select().single()
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`Batch update failed: ${errors.map(e => e.error?.message).join(', ')}`);
      }
      
      return results.map(r => r.data).filter(Boolean);
    }, `Failed to batch update ${table} records`);
  }

  // Real-time subscriptions
  static subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  }

  // Health check
  static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      const { data, error } = await supabase.from('news').select('count').limit(1);
      if (error) throw error;
      return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export const db = DatabaseOperations;