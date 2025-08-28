export const APP_CONFIG = {
  name: 'MDRRMO Pio Duran',
  description: 'Municipal Disaster Risk Reduction and Management Office',
  version: '4.0.0',
  author: 'MDRRMO Team',
  contact: {
    email: 'mdrrmo@pioduran.gov.ph',
    phone: '911',
    address: 'Municipal Hall, Pio Duran, Albay'
  },
  features: {
    offlineMode: true,
    realTimeUpdates: true,
    dynamicPages: true,
    socialIntegration: true,
    analytics: true,
    emergencyAlerts: true,
    resourceManagement: true
  }
};

export const EMERGENCY_CONTACTS = [
  { name: 'Office of the Mayor', number: '(052) 123-4567' },
  { name: 'MDRRMO', number: '911 / (052) 234-5678' },
  { name: 'MSWD', number: '1343' },
  { name: 'Medical/MHO', number: '(052) 345-6789' },
  { name: 'PNP', number: '117 / (052) 456-7890' },
  { name: 'BFP', number: '(052) 567-8901' },
  { name: 'PCG', number: '(052) 678-9012' }
];

export const BARANGAYS = [
  'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5',
  'Agol', 'Alabangpuro', 'Basicao Coastal', 'Basicao Interior', 'Banawan',
  'Binodegahan', 'Buenavista', 'Buyo', 'Caratagan', 'Cuyaoyao',
  'Flores', 'Lawinon', 'Macasitas', 'Malapay', 'Malidong',
  'Mamlad', 'Marigondon', 'Nablangbulod', 'Oringon', 'Palapas',
  'Panganiran', 'Rawis', 'Salvacion', 'Sto. Cristo', 'Sukip', 'Tibabo'
];

export const INCIDENT_TYPES = [
  'Fire', 'Flood', 'Landslide', 'Vehicular Accident', 'Medical Emergency', 'Others'
];

export const URGENCY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const STATUS_OPTIONS = ['pending', 'in-progress', 'resolved'] as const;

export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: 'text-blue-600' },
  { id: 'twitter', name: 'Twitter', color: 'text-sky-500' },
  { id: 'instagram', name: 'Instagram', color: 'text-pink-600' },
  { id: 'youtube', name: 'YouTube', color: 'text-red-600' }
];

export const FILE_TYPES = ['pdf', 'doc', 'docx', 'image', 'video', 'zip'] as const;

export const RESOURCE_CATEGORIES = ['guide', 'form', 'map', 'report', 'plan', 'manual'] as const;

export const PAGE_TEMPLATES = [
  { id: 'default', name: 'Default Page', description: 'Standard page layout' },
  { id: 'about', name: 'About Page', description: 'About MDRRMO template' },
  { id: 'services', name: 'Services Page', description: 'Services showcase template' },
  { id: 'news', name: 'News Portal', description: 'News listing and detail template' },
  { id: 'resources', name: 'Resources Page', description: 'Downloads and resources template' },
  { id: 'disaster-plan', name: 'Disaster Planning', description: 'DRRM planning template' }
];

export const ALERT_TYPES = [
  { id: 'typhoon', name: 'Typhoon/Storm', icon: '🌪️', color: 'bg-purple-500' },
  { id: 'earthquake', name: 'Earthquake', icon: '🌍', color: 'bg-red-600' },
  { id: 'flood', name: 'Flood', icon: '🌊', color: 'bg-blue-600' },
  { id: 'fire', name: 'Fire', icon: '🔥', color: 'bg-orange-600' },
  { id: 'landslide', name: 'Landslide', icon: '⛰️', color: 'bg-amber-600' },
  { id: 'tsunami', name: 'Tsunami', icon: '🌊', color: 'bg-blue-800' },
  { id: 'general', name: 'General Alert', icon: '⚠️', color: 'bg-gray-600' }
];

export const SEVERITY_LEVELS = [
  { id: 'low', name: 'Advisory', color: 'bg-green-500' },
  { id: 'medium', name: 'Watch', color: 'bg-yellow-500' },
  { id: 'high', name: 'Warning', color: 'bg-orange-500' },
  { id: 'critical', name: 'Emergency', color: 'bg-red-600' }
];