export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  status: 'published' | 'draft';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  id: string;
  reference_number: string;
  reporter_name: string;
  contact_number: string;
  location: string;
  incident_type: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'pending' | 'in-progress' | 'resolved';
  date_reported: string;
  image_url?: string | null;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
  status: 'published' | 'draft';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  status: 'published' | 'draft';
  template: 'default' | 'about' | 'services' | 'news' | 'resources' | 'disaster-plan';
  sections: PageSection[];
  featured?: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  type: 'hero' | 'content' | 'cards' | 'stats' | 'gallery' | 'contact' | 'accordion';
  title: string;
  content: string;
  data: any;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: 'pdf' | 'doc' | 'docx' | 'image' | 'video' | 'zip';
  file_size?: number;
  category: 'guide' | 'form' | 'map' | 'report' | 'plan' | 'manual';
  subcategory?: string;
  tags: string[];
  download_count: number;
  featured?: boolean;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'typhoon' | 'earthquake' | 'flood' | 'fire' | 'landslide' | 'tsunami' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  issued_at: string;
  expires_at?: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  channels: string[];
  priority: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  image?: string;
  link?: string;
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  created_at: string;
  updated_at: string;
}