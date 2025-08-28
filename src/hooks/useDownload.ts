import { useState, useCallback } from 'react';
import { downloadManager, DownloadOptions, DownloadResult } from '../utils/downloadManager';
import { useAnalytics } from '../utils/analytics';

export interface UseDownloadState {
  isDownloading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export const useDownload = () => {
  const [state, setState] = useState<UseDownloadState>({
    isDownloading: false,
    progress: 0,
    error: null,
    success: false
  });
  
  const { trackDownload } = useAnalytics();

  const download = useCallback(async (
    url: string, 
    resourceId?: string,
    resourceTitle?: string,
    options: DownloadOptions = {}
  ): Promise<DownloadResult> => {
    setState({
      isDownloading: true,
      progress: 0,
      error: null,
      success: false
    });

    try {
      const result = await downloadManager.downloadFile(url, {
        ...options,
        onProgress: (progress) => {
          setState(prev => ({ ...prev, progress }));
          options.onProgress?.(progress);
        },
        onSuccess: () => {
          setState(prev => ({ ...prev, success: true, isDownloading: false }));
          
          // Track successful download
          if (resourceId && resourceTitle) {
            trackDownload(resourceId, resourceTitle);
          }
          
          options.onSuccess?.();
          
          // Reset success state after 3 seconds
          setTimeout(() => {
            setState(prev => ({ ...prev, success: false }));
          }, 3000);
        },
        onError: (error) => {
          setState(prev => ({ 
            ...prev, 
            error: error.message, 
            isDownloading: false 
          }));
          
          options.onError?.(error);
          
          // Reset error state after 5 seconds
          setTimeout(() => {
            setState(prev => ({ ...prev, error: null }));
          }, 5000);
        }
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setState({
        isDownloading: false,
        progress: 0,
        error: errorMessage,
        success: false
      });
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [trackDownload]);

  const downloadMultiple = useCallback(async (
    downloads: Array<{ url: string; resourceId?: string; resourceTitle?: string; options?: DownloadOptions }>
  ): Promise<DownloadResult[]> => {
    setState({
      isDownloading: true,
      progress: 0,
      error: null,
      success: false
    });

    try {
      const downloadItems = downloads.map(({ url, options }) => ({ url, options }));
      
      const results = await downloadManager.downloadMultiple(
        downloadItems,
        (completed, total) => {
          setState(prev => ({ ...prev, progress: (completed / total) * 100 }));
        }
      );

      const successCount = results.filter(r => r.success).length;
      
      setState({
        isDownloading: false,
        progress: 100,
        error: successCount < downloads.length ? `${downloads.length - successCount} downloads failed` : null,
        success: successCount > 0
      });

      return results;
    } catch (error) {
      setState({
        isDownloading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Batch download failed',
        success: false
      });
      
      return downloads.map(() => ({
        success: false,
        error: 'Batch download failed'
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isDownloading: false,
      progress: 0,
      error: null,
      success: false
    });
  }, []);

  return {
    ...state,
    download,
    downloadMultiple,
    reset
  };
};