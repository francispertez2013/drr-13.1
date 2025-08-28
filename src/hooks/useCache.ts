import { useState, useEffect, useCallback } from 'react';
import { cacheManager, persistentCache } from '../utils/cache';

export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    persistent?: boolean;
    refreshInterval?: number;
  } = {}
) => {
  const { ttl = 5 * 60 * 1000, persistent = false, refreshInterval } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cache = persistent ? persistentCache : cacheManager;

  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (!force) {
        const cached = cache.get<T>(key);
        if (cached) {
          setData(cached);
          setLoading(false);
          return cached;
        }
      }

      // Fetch fresh data
      const result = await fetcher();
      cache.set(key, result, ttl);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error(`Cache fetch error for key ${key}:`, err);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, cache]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    fetchData(true);
  }, [key, cache, fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh interval
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        fetchData(true);
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
};