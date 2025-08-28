import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { databaseManager } from '../lib/database';
import { handleAsyncError } from '../utils/errorHandling';
import type { Database } from '../lib/supabase';

type NewsItem = Database['public']['Tables']['news']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type IncidentReport = Database['public']['Tables']['incident_reports']['Row'];
type GalleryItem = Database['public']['Tables']['gallery']['Row'];
type VideoItem = Database['public']['Tables']['videos']['Row'];

interface DataContextType {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNews: (id: string, news: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  incidents: IncidentReport[];
  addIncident: (incident: Omit<IncidentReport, 'id' | 'date_reported' | 'updated_at' | 'reference_number'>) => Promise<void>;
  updateIncident: (id: string, incident: Partial<IncidentReport>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  videos: VideoItem[];
  addVideo: (video: Omit<VideoItem, 'id' | 'created_at' | 'updated_at' | 'view_count'>) => Promise<void>;
  updateVideo: (id: string, video: Partial<VideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  incrementVideoView: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
    // Real-time subscriptions
    const newsSubscription = supabase
      .channel('news_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' },
        (payload) => {
          console.log('News change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    const servicesSubscription = supabase
      .channel('services_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' },
        (payload) => {
          console.log('Services change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    const incidentsSubscription = supabase
      .channel('incidents_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incident_reports' },
        (payload) => {
          console.log('Incidents change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    const gallerySubscription = supabase
      .channel('gallery_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' },
        (payload) => {
          console.log('Gallery change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    const videosSubscription = supabase
      .channel('videos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' },
        (payload) => {
          console.log('Videos change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      newsSubscription.unsubscribe();
      servicesSubscription.unsubscribe();
      incidentsSubscription.unsubscribe();
      gallerySubscription.unsubscribe();
      videosSubscription.unsubscribe();
    };
  }, []);

  // Enhanced error handling for fetch failures
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Optional: show offline message if not connected
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError("You are currently offline. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const [newsData, servicesData, incidentsData, galleryData, videosData] = await Promise.all([
        databaseManager.getNews(),
        databaseManager.getServices(),
        databaseManager.getIncidents(),
        databaseManager.getGallery(),
        fetchVideos()
      ]);
      setNews(newsData);
      setServices(servicesData);
      setIncidents(incidentsData);
      setGallery(galleryData);
      setVideos(videosData);
    } catch (err: any) {
      // Specific handling for fetch errors
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to connect to the backend service. Please check your network, CORS settings, and Supabase configuration.");
        console.error('Error fetching data: Network/CORS/Supabase endpoint issue:', err);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ...rest of the CRUD methods (unchanged, but you may want to add similar error handling for fetch failures if needed)...

  const addNews = async (newsItem: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
    return handleAsyncError(async () => {
      const data = await databaseManager.createNews(newsItem);
      setNews(prev => [data, ...prev]);
    }, 'Failed to add news article');
  };

  const updateNews = async (id: string, updates: Partial<NewsItem>) => {
    return handleAsyncError(async () => {
      const data = await databaseManager.updateNews(id, updates);
      setNews(prev => prev.map(item => item.id === id ? data : item));
    }, 'Failed to update news article');
  };

  const deleteNews = async (id: string) => {
    return handleAsyncError(async () => {
      await databaseManager.deleteNews(id);
      setNews(prev => prev.filter(item => item.id !== id));
    }, 'Failed to delete news article');
  };

  const addService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await databaseManager.createService(service);
      setServices(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding service:', err);
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const data = await databaseManager.updateService(id, updates);
      setServices(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await databaseManager.deleteService(id);
      setServices(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  const addIncident = async (incident: Omit<IncidentReport, 'id' | 'date_reported' | 'updated_at' | 'reference_number'>) => {
    try {
      const referenceNumber = (incident as any).reference_number ||
        `RD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

      let imageUrl = null;
      if ((incident as any).imageFile) {
        try {
          const file = (incident as any).imageFile;
          const fileExt = file.name.split('.').pop();
          const fileName = `incident_${referenceNumber}_${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('incidents')
            .upload(fileName, file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('incidents')
              .getPublicUrl(fileName);
            imageUrl = publicUrl;
          }
        } catch (uploadError) {
          console.error('Error uploading incident image:', uploadError);
        }
      }

      const { data, error } = await supabase
        .from('incident_reports')
        .insert([{
          reference_number: referenceNumber,
          reporter_name: (incident as any).reporter_name || (incident as any).reporterName,
          contact_number: (incident as any).contact_number || (incident as any).contactNumber,
          location: incident.location,
          incident_type: (incident as any).incident_type || (incident as any).incidentType,
          description: incident.description,
          urgency: incident.urgency,
          status: 'pending',
          image_url: imageUrl || (incident as any).image_url
        }])
        .select()
        .single();

      if (error) throw error;
      setIncidents(prev => [data, ...prev]);
      return data.reference_number;
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to submit incident report. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error adding incident:', err);
      throw err;
    }
  };

  const updateIncident = async (id: string, updates: Partial<IncidentReport>) => {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setIncidents(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to update incident. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error updating incident:', err);
      throw err;
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incident_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIncidents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to delete incident. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error deleting incident:', err);
      throw err;
    }
  };

  const fetchVideos = async (): Promise<VideoItem[]> => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && !error.message.includes('relation "videos" does not exist')) {
        throw error;
      }
      return data || [];
    } catch (error: any) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("Network error: Unable to fetch videos. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error fetching videos:', error);
      return [];
    }
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await databaseManager.createGalleryItem(item);
      setGallery(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding gallery item:', err);
      throw err;
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    try {
      const data = await databaseManager.updateGalleryItem(id, updates);
      setGallery(prev => prev.map(item => item.id === id ? data : item));
    } catch (err) {
      console.error('Error updating gallery item:', err);
      throw err;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await databaseManager.deleteGalleryItem(id);
      setGallery(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      throw err;
    }
  };

  const addVideo = async (video: Omit<VideoItem, 'id' | 'created_at' | 'updated_at' | 'view_count'>) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{ ...video, view_count: 0 }])
        .select()
        .single();

      if (error) throw error;
      setVideos(prev => [data, ...prev]);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to add video. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error adding video:', err);
      throw err;
    }
  };

  const updateVideo = async (id: string, updates: Partial<VideoItem>) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setVideos(prev => prev.map(video => video.id === id ? data : video));
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to update video. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error updating video:', err);
      throw err;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVideos(prev => prev.filter(video => video.id !== id));
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to delete video. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error deleting video:', err);
      throw err;
    }
  };

  const incrementVideoView = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', id);

      if (error) throw error;

      setVideos(prev => prev.map(video =>
        video.id === id
          ? { ...video, view_count: video.view_count + 1 }
          : video
      ));
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error: Unable to increment video view count. Please check your network, CORS settings, and Supabase configuration.");
      }
      console.error('Error incrementing video view:', err);
    }
  };

  return (
    <DataContext.Provider value={{
      news, addNews, updateNews, deleteNews,
      services, addService, updateService, deleteService,
      incidents, addIncident, updateIncident, deleteIncident,
      gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      videos, addVideo, updateVideo, deleteVideo, incrementVideoView,
      loading, error
    }}>
      {children}
    </DataContext.Provider>
  );
};