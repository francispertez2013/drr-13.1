import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Page, PageSection, Resource } from '../types';

interface PagesContextType {
  // Pages
  pages: Page[];
  addPage: (page: Omit<Page, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'sections'>) => Promise<void>;
  updatePage: (id: string, page: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  getPageBySlug: (slug: string) => Page | null;
  incrementPageView: (id: string) => Promise<void>;
  
  // Page Sections
  sections: PageSection[];
  addSection: (section: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSection: (id: string, section: Partial<PageSection>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  getSectionsByPageId: (pageId: string) => PageSection[];
  
  // Resources
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count'>) => Promise<void>;
  updateResource: (id: string, resource: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  incrementDownload: (id: string) => Promise<void>;

  // Loading states
  loading: boolean;
  error: string | null;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export const usePages = () => {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
};

export const PagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time subscriptions for pages and resources
    const pagesSubscription = supabase
      .channel('pages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, 
        (payload) => {
          console.log('Pages change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    const resourcesSubscription = supabase
      .channel('resources_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, 
        (payload) => {
          console.log('Resources change detected:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      pagesSubscription.unsubscribe();
      resourcesSubscription.unsubscribe();
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (pagesError && !pagesError.message.includes('relation "pages" does not exist')) {
        throw pagesError;
      }

      // Fetch page sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (sectionsError && !sectionsError.message.includes('relation "page_sections" does not exist')) {
        throw sectionsError;
      }

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resourcesError && !resourcesError.message.includes('relation "resources" does not exist')) {
        throw resourcesError;
      }

      // Transform data to match our types
      const transformedPages = (pagesData || []).map(page => ({
        ...page,
        sections: (sectionsData || []).filter(section => section.page_id === page.id)
      }));

      setPages(transformedPages);
      setSections(sectionsData || []);
      setResources(resourcesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching pages data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pages functions
  const addPage = async (pageData: Omit<Page, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'sections'>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([{ ...pageData, view_count: 0 }])
        .select()
        .single();

      if (error) throw error;
      setPages(prev => [{ ...data, sections: [] }, ...prev]);
    } catch (err) {
      console.error('Error adding page:', err);
      throw err;
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPages(prev => prev.map(page => 
        page.id === id 
          ? { ...data, sections: page.sections }
          : page
      ));
    } catch (err) {
      console.error('Error updating page:', err);
      throw err;
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPages(prev => prev.filter(page => page.id !== id));
    } catch (err) {
      console.error('Error deleting page:', err);
      throw err;
    }
  };

  const getPageBySlug = (slug: string): Page | null => {
    return pages.find(page => page.slug === slug && page.status === 'published') || null;
  };

  const incrementPageView = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('view_count')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('pages')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error incrementing page view:', err);
    }
  };

  // Sections functions
  const addSection = async (sectionData: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .insert([sectionData])
        .select()
        .single();

      if (error) throw error;
      setSections(prev => [...prev, data]);
      
      // Update pages state
      setPages(prev => prev.map(page => 
        page.id === sectionData.page_id
          ? { ...page, sections: [...page.sections, data] }
          : page
      ));
    } catch (err) {
      console.error('Error adding section:', err);
      throw err;
    }
  };

  const updateSection = async (id: string, updates: Partial<PageSection>) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSections(prev => prev.map(section => section.id === id ? data : section));
      
      // Update pages state
      setPages(prev => prev.map(page => ({
        ...page,
        sections: page.sections.map(section => section.id === id ? data : section)
      })));
    } catch (err) {
      console.error('Error updating section:', err);
      throw err;
    }
  };

  const deleteSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSections(prev => prev.filter(section => section.id !== id));
      
      // Update pages state
      setPages(prev => prev.map(page => ({
        ...page,
        sections: page.sections.filter(section => section.id !== id)
      })));
    } catch (err) {
      console.error('Error deleting section:', err);
      throw err;
    }
  };

  const getSectionsByPageId = (pageId: string): PageSection[] => {
    return sections.filter(section => section.page_id === pageId && section.is_active)
      .sort((a, b) => a.order_index - b.order_index);
  };

  // Resources functions
  const addResource = async (resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{ ...resourceData, download_count: 0 }])
        .select()
        .single();

      if (error) throw error;
      setResources(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding resource:', err);
      throw err;
    }
  };

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setResources(prev => prev.map(resource => resource.id === id ? data : resource));
    } catch (err) {
      console.error('Error updating resource:', err);
      throw err;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setResources(prev => prev.filter(resource => resource.id !== id));
    } catch (err) {
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  const incrementDownload = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ download_count: supabase.sql`download_count + 1` })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setResources(prev => prev.map(resource => 
        resource.id === id 
          ? { ...resource, download_count: resource.download_count + 1 }
          : resource
      ));
    } catch (err) {
      console.error('Error incrementing download count:', err);
    }
  };

  return (
    <PagesContext.Provider value={{
      pages, addPage, updatePage, deletePage, getPageBySlug, incrementPageView,
      sections, addSection, updateSection, deleteSection, getSectionsByPageId,
      resources, addResource, updateResource, deleteResource, incrementDownload,
      loading, error
    }}>
      {children}
    </PagesContext.Provider>
  );
};