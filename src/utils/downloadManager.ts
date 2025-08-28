// Enhanced download management utilities for production system

export interface DownloadOptions {
  filename?: string;
  fallbackUrl?: string;
  onProgress?: (progress: number) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  retryAttempts?: number;
}

export interface DownloadResult {
  success: boolean;
  error?: string;
  filename?: string;
  size?: number;
}

export class DownloadManager {
  private static activeDownloads = new Map<string, AbortController>();
  private static downloadQueue: Array<{ url: string; options: DownloadOptions }> = [];
  private static isProcessingQueue = false;

  static async downloadFile(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const {
      filename,
      fallbackUrl,
      onProgress,
      onSuccess,
      onError,
      timeout = 30000,
      retryAttempts = 3
    } = options;

    const downloadId = `${url}_${Date.now()}`;
    const controller = new AbortController();
    this.activeDownloads.set(downloadId, controller);

    try {
      // Validate URL accessibility
      const headResponse = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        timeout
      });

      if (!headResponse.ok) {
        throw new Error(`File not accessible: ${headResponse.status} ${headResponse.statusText}`);
      }

      // Get file info
      const contentLength = headResponse.headers.get('content-length');
      const contentType = headResponse.headers.get('content-type');
      const fileSize = contentLength ? parseInt(contentLength) : 0;

      // Determine filename
      const finalFilename = filename || this.extractFilenameFromUrl(url) || 'download';

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track progress (simulated for direct downloads)
      if (onProgress) {
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 20;
          onProgress(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 200);
      }

      onSuccess?.();
      
      return {
        success: true,
        filename: finalFilename,
        size: fileSize
      };

    } catch (error) {
      console.error('Download failed:', error);
      
      // Try fallback URL if provided
      if (fallbackUrl && retryAttempts > 0) {
        return this.downloadFile(fallbackUrl, {
          ...options,
          retryAttempts: retryAttempts - 1,
          fallbackUrl: undefined
        });
      }

      // Offer alternative download methods
      const shouldOpenInNewTab = window.confirm(
        'Direct download failed. Would you like to open the file in a new tab?'
      );

      if (shouldOpenInNewTab) {
        window.open(url, '_blank');
        return { success: true, filename: filename || 'opened_in_tab' };
      }

      const downloadError = error instanceof Error ? error : new Error('Download failed');
      onError?.(downloadError);
      
      return {
        success: false,
        error: downloadError.message
      };
    } finally {
      this.activeDownloads.delete(downloadId);
    }
  }

  static async downloadMultiple(
    downloads: Array<{ url: string; options?: DownloadOptions }>,
    onBatchProgress?: (completed: number, total: number) => void
  ): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];
    
    for (let i = 0; i < downloads.length; i++) {
      const { url, options = {} } = downloads[i];
      
      try {
        const result = await this.downloadFile(url, options);
        results.push(result);
        
        onBatchProgress?.(i + 1, downloads.length);
        
        // Small delay between downloads to prevent overwhelming the browser
        if (i < downloads.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Download failed'
        });
      }
    }
    
    return results;
  }

  static cancelDownload(url: string): boolean {
    const downloadId = Array.from(this.activeDownloads.keys()).find(id => id.startsWith(url));
    
    if (downloadId) {
      const controller = this.activeDownloads.get(downloadId);
      controller?.abort();
      this.activeDownloads.delete(downloadId);
      return true;
    }
    
    return false;
  }

  static cancelAllDownloads(): void {
    this.activeDownloads.forEach(controller => controller.abort());
    this.activeDownloads.clear();
  }

  static getActiveDownloads(): string[] {
    return Array.from(this.activeDownloads.keys());
  }

  private static extractFilenameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop();
      
      if (filename && filename.includes('.')) {
        return filename;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  static async checkFileAccessibility(url: string): Promise<{
    accessible: boolean;
    size?: number;
    type?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        return {
          accessible: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        accessible: true,
        size: response.headers.get('content-length') 
          ? parseInt(response.headers.get('content-length')!) 
          : undefined,
        type: response.headers.get('content-type') || undefined
      };
    } catch (error) {
      return {
        accessible: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  static createDownloadLink(url: string, filename?: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || this.extractFilenameFromUrl(url) || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  static async downloadAsBlob(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const { onProgress, timeout = 30000 } = options;
    
    try {
      const response = await fetch(url, { 
        signal: AbortSignal.timeout(timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength) : 0;
      
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (onProgress && total > 0) {
          onProgress((received / total) * 100);
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      
      const link = this.createDownloadLink(blobUrl, options.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      return {
        success: true,
        filename: options.filename,
        size: received
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    }
  }
}

export const downloadManager = DownloadManager;