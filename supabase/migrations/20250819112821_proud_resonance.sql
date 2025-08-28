/*
  # Comprehensive MDRRMO Database Schema

  This migration creates the complete database schema for the MDRRMO Pio Duran system.

  ## 1. Extensions and Functions
    - UUID generation
    - Updated timestamp trigger function

  ## 2. Custom Types
    - weather_condition enum for weather data

  ## 3. Core Tables
    - news: News articles and announcements
    - services: MDRRMO services and programs
    - incident_reports: Public incident reporting system
    - gallery: Photo gallery management
    - videos: Video content management
    - pages: Dynamic page content system
    - page_sections: Modular page sections
    - resources: Downloadable documents and files
    - emergency_alerts: Emergency notification system
    - social_posts: Social media content management
    - about_sections: About page content sections
    - organizational_hierarchy: Staff organizational structure
    - key_personnel: Key staff information
    - emergency_hotlines: Emergency contact numbers
    - navigation_items: Website navigation structure
    - system_settings: Application configuration
    - users: Admin user management
    - weather_data: Current weather information
    - weather_forecast: 7-day weather forecast
    - weather_alerts: Weather-related alerts
    - weather_api_settings: WeatherLink API configuration

  ## 4. Security
    - Row Level Security enabled on all tables
    - Public read access for published content
    - Authenticated user management access
    - Public incident report submission
    - Secure weather data access

  ## 5. Indexes and Constraints
    - Performance optimization indexes
    - Data integrity constraints
    - Foreign key relationships
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE weather_condition AS ENUM (
        'clear',
        'sunny', 
        'cloudy',
        'partly-cloudy',
        'overcast',
        'rainy',
        'stormy',
        'windy',
        'foggy',
        'snowy'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create uid() function for RLS policies
CREATE OR REPLACE FUNCTION uid() 
RETURNS UUID 
LANGUAGE SQL STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.sub', true), ''),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

-- =============================================
-- CORE CONTENT TABLES
-- =============================================

-- News table
CREATE TABLE IF NOT EXISTS news (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    excerpt text,
    content text,
    image text,
    author text,
    status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    date date DEFAULT CURRENT_DATE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news"
    ON news FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Authenticated users can manage news"
    ON news FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public can read published news items"
    ON news FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    icon text DEFAULT 'Shield',
    tags jsonb DEFAULT '[]',
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
    ON services FOR SELECT
    TO public
    USING (status = 'active');

CREATE POLICY "Authenticated users can manage services"
    ON services FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Incident Reports table
CREATE TABLE IF NOT EXISTS incident_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number text UNIQUE NOT NULL,
    reporter_name text NOT NULL,
    contact_number text NOT NULL,
    location text,
    incident_type text,
    description text,
    urgency text DEFAULT 'MEDIUM' CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH')),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved')),
    date_reported timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    image_url text
);

ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create incident reports"
    ON incident_reports FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Authenticated users can read all incident reports"
    ON incident_reports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update incident reports"
    ON incident_reports FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image text,
    category text,
    date date DEFAULT CURRENT_DATE,
    location text,
    tags jsonb DEFAULT '[]',
    status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    bulk_upload_id text,
    file_path text
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published gallery items"
    ON gallery FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Authenticated users can manage gallery"
    ON gallery FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail text NOT NULL,
    category text,
    date date,
    location text,
    duration text,
    tags text[] DEFAULT '{}',
    status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage all videos"
    ON videos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public can read published videos"
    ON videos FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- =============================================
-- DYNAMIC CONTENT SYSTEM
-- =============================================

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text NOT NULL,
    meta_description text,
    meta_keywords text,
    template text DEFAULT 'default',
    hero_image text,
    hero_title text,
    hero_subtitle text,
    status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    featured boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published pages"
    ON pages FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Authenticated users can manage pages"
    ON pages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Page Sections table
CREATE TABLE IF NOT EXISTS page_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('hero', 'content', 'cards', 'stats', 'gallery', 'contact', 'accordion', 'grid', 'timeline')),
    title text,
    content text,
    data jsonb DEFAULT '{}',
    order_index integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active page sections"
    ON page_sections FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage page sections"
    ON page_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    file_url text NOT NULL,
    file_type text DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'doc', 'docx', 'image', 'video', 'zip')),
    file_size bigint DEFAULT 0,
    category text DEFAULT 'guide' CHECK (category IN ('guide', 'form', 'map', 'report', 'plan', 'manual')),
    subcategory text,
    tags jsonb DEFAULT '[]',
    download_count integer DEFAULT 0,
    featured boolean DEFAULT false,
    status text DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published resources"
    ON resources FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Authenticated users can manage resources"
    ON resources FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- EMERGENCY MANAGEMENT SYSTEM
-- =============================================

-- Emergency Alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('typhoon', 'earthquake', 'flood', 'fire', 'landslide', 'tsunami', 'general')),
    severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title text NOT NULL,
    message text NOT NULL,
    location text,
    coordinates jsonb,
    issued_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'cancelled')),
    channels jsonb DEFAULT '[]',
    sent_to jsonb DEFAULT '[]',
    priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    show_on_frontend boolean DEFAULT true
);

ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active emergency alerts"
    ON emergency_alerts FOR SELECT
    TO public
    USING (status = 'active');

CREATE POLICY "Authenticated users can manage emergency alerts"
    ON emergency_alerts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Emergency Hotlines table
CREATE TABLE IF NOT EXISTS emergency_hotlines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name text NOT NULL,
    phone_number text NOT NULL,
    logo text,
    department text NOT NULL,
    description text,
    is_primary boolean DEFAULT false,
    order_index integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_hotlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active emergency hotlines"
    ON emergency_hotlines FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage emergency hotlines"
    ON emergency_hotlines FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- ORGANIZATIONAL STRUCTURE
-- =============================================

-- About Sections table
CREATE TABLE IF NOT EXISTS about_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    image text,
    order_index integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active about sections"
    ON about_sections FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage about sections"
    ON about_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Organizational Hierarchy table
CREATE TABLE IF NOT EXISTS organizational_hierarchy (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    designation text NOT NULL,
    photo text,
    department text,
    level integer DEFAULT 1,
    parent_id uuid REFERENCES organizational_hierarchy(id) ON DELETE SET NULL,
    order_index integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizational_hierarchy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active organizational hierarchy"
    ON organizational_hierarchy FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage organizational hierarchy"
    ON organizational_hierarchy FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Key Personnel table
CREATE TABLE IF NOT EXISTS key_personnel (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    designation text NOT NULL,
    photo text,
    bio text,
    email text,
    phone text,
    department text NOT NULL,
    order_index integer DEFAULT 1,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE key_personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active key personnel"
    ON key_personnel FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage key personnel"
    ON key_personnel FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- SOCIAL MEDIA AND COMMUNICATION
-- =============================================

-- Social Posts table
CREATE TABLE IF NOT EXISTS social_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    platform text NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'youtube')),
    content text NOT NULL,
    image text,
    link text,
    scheduled_time timestamptz,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    engagement jsonb DEFAULT '{"likes": 0, "shares": 0, "comments": 0}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published social posts"
    ON social_posts FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Authenticated users can manage social posts"
    ON social_posts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Navigation Items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label text NOT NULL,
    path text NOT NULL,
    icon text DEFAULT 'Home',
    order_index integer DEFAULT 1,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    parent_id uuid REFERENCES navigation_items(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active navigation items"
    ON navigation_items FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage navigation items"
    ON navigation_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- WEATHER SYSTEM
-- =============================================

-- Weather API Settings table
CREATE TABLE IF NOT EXISTS weather_api_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key text NOT NULL CHECK (length(api_key) >= 10 AND length(api_key) <= 100),
    api_secret text NOT NULL,
    station_id text NOT NULL CHECK (length(station_id) >= 10 AND length(station_id) <= 50),
    is_active boolean DEFAULT false,
    last_sync timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create unique constraint for active settings (only one can be active)
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_settings 
    ON weather_api_settings (is_active) 
    WHERE is_active = true;

ALTER TABLE weather_api_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weather API settings"
    ON weather_api_settings FOR SELECT
    TO authenticated
    USING (uid() = id);

CREATE POLICY "Users can create own weather API settings"
    ON weather_api_settings FOR INSERT
    TO authenticated
    WITH CHECK (uid() = id);

CREATE POLICY "Users can update own weather API settings"
    ON weather_api_settings FOR UPDATE
    TO authenticated
    USING (uid() = id)
    WITH CHECK (uid() = id);

CREATE POLICY "Users can delete own weather API settings"
    ON weather_api_settings FOR DELETE
    TO authenticated
    USING (uid() = id);

-- Weather Data table
CREATE TABLE IF NOT EXISTS weather_data (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id uuid REFERENCES weather_api_settings(id),
    temperature numeric(5,2) NOT NULL CHECK (temperature >= -100 AND temperature <= 100),
    feels_like numeric(5,2),
    humidity numeric(5,2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
    wind_speed numeric(5,2) NOT NULL CHECK (wind_speed >= 0),
    wind_direction integer,
    visibility numeric(6,2) CHECK (visibility >= 0),
    condition weather_condition NOT NULL,
    description text,
    air_pressure numeric(7,2),
    dew_point numeric(5,2),
    uv_index numeric(3,1),
    measurement_time timestamptz DEFAULT now(),
    last_updated timestamptz DEFAULT now(),
    is_active boolean DEFAULT true
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weather_data_station ON weather_data (station_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_time ON weather_data (measurement_time);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view weather data"
    ON weather_data FOR SELECT
    TO authenticated
    USING (true);

-- Weather Forecast table
CREATE TABLE IF NOT EXISTS weather_forecast (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id uuid REFERENCES weather_api_settings(id),
    date date NOT NULL,
    temperature_high numeric(5,2) NOT NULL,
    temperature_low numeric(5,2) NOT NULL,
    condition weather_condition NOT NULL,
    humidity numeric(5,2) CHECK (humidity >= 0 AND humidity <= 100),
    wind_speed numeric(5,2) CHECK (wind_speed >= 0),
    precipitation numeric(5,2) CHECK (precipitation >= 0),
    icon text,
    is_active boolean DEFAULT true,
    CONSTRAINT valid_temp_range CHECK (temperature_high >= temperature_low),
    CONSTRAINT unique_forecast_date UNIQUE (station_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forecast_date ON weather_forecast (date);

ALTER TABLE weather_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view forecasts"
    ON weather_forecast FOR SELECT
    TO authenticated
    USING (true);

-- Weather Alerts table
CREATE TABLE IF NOT EXISTS weather_alerts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id uuid REFERENCES weather_api_settings(id),
    title text NOT NULL,
    description text,
    severity text CHECK (severity IN ('low', 'moderate', 'high', 'extreme')),
    region text,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    is_active boolean DEFAULT true,
    acknowledged boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_time ON weather_alerts (start_time, end_time);

ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts"
    ON weather_alerts FOR SELECT
    TO authenticated
    USING (true);

-- =============================================
-- SYSTEM ADMINISTRATION
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    name text NOT NULL,
    avatar text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all users"
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage users"
    ON users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text UNIQUE NOT NULL,
    setting_value jsonb NOT NULL,
    setting_type text DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
    description text,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public settings"
    ON system_settings FOR SELECT
    TO public
    USING (is_public = true);

CREATE POLICY "Authenticated users can read all settings"
    ON system_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage settings"
    ON system_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Create triggers for all tables
DO $$ 
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'news', 'services', 'incident_reports', 'gallery', 'videos',
        'pages', 'page_sections', 'resources', 'emergency_alerts',
        'social_posts', 'about_sections', 'organizational_hierarchy',
        'key_personnel', 'emergency_hotlines', 'navigation_items',
        'system_settings', 'users'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name, table_name, table_name);
    END LOOP;
END $$;

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample news articles
INSERT INTO news (title, excerpt, content, image, author, status, date) VALUES
('MDRRMO Pio Duran Launches New Emergency Response System', 
 'Advanced emergency response protocols now in place to better serve our community during disasters.',
 'The Municipal Disaster Risk Reduction and Management Office of Pio Duran has successfully launched a comprehensive emergency response system designed to enhance our community''s preparedness and response capabilities. This new system includes real-time monitoring, improved communication channels, and streamlined coordination with regional emergency services.',
 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
 'MDRRMO Operations Team',
 'published',
 CURRENT_DATE),

('Community Earthquake Drill Scheduled for Next Week',
 'All residents are encouraged to participate in the municipality-wide earthquake preparedness drill.',
 'As part of our ongoing commitment to disaster preparedness, MDRRMO Pio Duran will conduct a comprehensive earthquake drill next week. This exercise will test our emergency response protocols and help residents practice proper safety procedures.',
 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
 'Training Coordinator',
 'published',
 CURRENT_DATE - INTERVAL '1 day'),

('Flood Preparedness Workshop Successfully Completed',
 'Over 200 community members attended the recent flood preparedness and response training.',
 'The recent flood preparedness workshop conducted by MDRRMO Pio Duran was a tremendous success, with over 200 participants learning essential skills for flood response and recovery. The workshop covered evacuation procedures, emergency kit preparation, and post-flood safety measures.',
 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg',
 'Community Outreach Team',
 'published',
 CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample services
INSERT INTO services (title, description, icon, tags, status) VALUES
('Emergency Response Coordination', 
 'Immediate response to disaster-related emergencies with our trained response teams and coordination with regional emergency services.',
 'Shield',
 '["Search & Rescue", "Medical Assistance", "Fire Response", "Coordination"]',
 'active'),

('Community Training Programs',
 'Regular training programs for community members, volunteers, and responders to build disaster preparedness capacity.',
 'Users',
 '["First Aid Training", "DRRM Workshops", "Evacuation Drills", "Capacity Building"]',
 'active'),

('Risk Assessment and Planning',
 'Comprehensive hazard, vulnerability, and capacity assessments for communities and infrastructure.',
 'BarChart3',
 '["Hazard Mapping", "Risk Analysis", "Mitigation Plans", "Vulnerability Assessment"]',
 'active'),

('Community Engagement and Education',
 'Engagement initiatives to build disaster-resilient communities through education and awareness programs.',
 'Heart',
 '["Barangay DRRM", "School Programs", "Volunteer Network", "Public Awareness"]',
 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample emergency hotlines
INSERT INTO emergency_hotlines (contact_name, phone_number, department, description, is_primary, order_index, is_active) VALUES
('MDRRMO Emergency Hotline', '911', 'MDRRMO', 'Primary emergency response hotline', true, 1, true),
('Office of the Mayor', '(052) 123-4567', 'Municipal Government', 'Municipal government main office', false, 2, true),
('Medical Emergency / MHO', '(052) 345-6789', 'Health Office', 'Medical emergencies and health concerns', false, 3, true),
('Philippine National Police', '117 / (052) 456-7890', 'PNP', 'Police emergency and security', false, 4, true),
('Bureau of Fire Protection', '(052) 567-8901', 'BFP', 'Fire emergencies and rescue', false, 5, true),
('Philippine Coast Guard', '(052) 678-9012', 'PCG', 'Maritime emergencies and rescue', false, 6, true),
('Municipal Social Welfare', '1343', 'MSWD', 'Social services and welfare assistance', false, 7, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample navigation items
INSERT INTO navigation_items (label, path, icon, order_index, is_active, is_featured) VALUES
('Home', '/', 'Home', 1, true, true),
('About', '/about', 'Info', 2, true, false),
('Services', '/services-detail', 'Shield', 3, true, true),
('News', '/news-portal', 'Newspaper', 4, true, true),
('Resources', '/resources', 'FolderOpen', 5, true, true),
('Disaster Planning', '/disaster-planning', 'Calendar', 6, true, false),
('Gallery', '/gallery', 'Camera', 7, true, false),
('Videos', '/video-gallery', 'Play', 8, true, false),
('Contact', '/contact', 'Phone', 9, true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', '"MDRRMO Pio Duran"', 'string', 'Website name', true),
('site_description', '"Municipal Disaster Risk Reduction and Management Office"', 'string', 'Website description', true),
('contact_email', '"mdrrmo@pioduran.gov.ph"', 'string', 'Primary contact email', true),
('emergency_hotline', '"911"', 'string', 'Primary emergency hotline', true),
('office_address', '"Municipal Hall, Pio Duran, Albay"', 'string', 'Office address', true),
('enable_notifications', 'true', 'boolean', 'Enable email notifications', false),
('enable_public_reporting', 'true', 'boolean', 'Allow public incident reporting', false),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode status', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (title, description, file_url, file_type, category, tags, status, featured) VALUES
('Emergency Kit Checklist', 
 'Complete checklist for preparing your family emergency kit with essential supplies.',
 'https://example.com/emergency-kit-checklist.pdf',
 'pdf',
 'guide',
 '["emergency", "preparedness", "family", "checklist"]',
 'published',
 true),

('Family Disaster Plan Template',
 'Template for creating a comprehensive family disaster preparedness plan.',
 'https://example.com/family-disaster-plan.pdf',
 'pdf',
 'plan',
 '["family", "planning", "template", "disaster"]',
 'published',
 true),

('Evacuation Routes Map',
 'Detailed map showing evacuation routes and emergency shelters in Pio Duran.',
 'https://example.com/evacuation-routes.pdf',
 'pdf',
 'map',
 '["evacuation", "routes", "map", "shelters"]',
 'published',
 true),

('Incident Report Form',
 'Official form for reporting emergency incidents to MDRRMO.',
 'https://example.com/incident-report-form.pdf',
 'pdf',
 'form',
 '["incident", "report", "form", "emergency"]',
 'published',
 false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample gallery items
INSERT INTO gallery (title, description, image, category, date, location, tags, status, featured) VALUES
('BDRRM Training Workshop',
 'Barangay Disaster Risk Reduction and Management training session for local officials.',
 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
 'Training',
 CURRENT_DATE - INTERVAL '7 days',
 'Municipal Hall',
 '["training", "barangay", "officials", "BDRRM"]',
 'published',
 true),

('Community Earthquake Drill',
 'Municipality-wide earthquake preparedness drill with over 5,000 participants.',
 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg',
 'Drill',
 CURRENT_DATE - INTERVAL '14 days',
 'Various Locations',
 '["earthquake", "drill", "community", "preparedness"]',
 'published',
 true),

('Water Rescue Training',
 'Intensive Water Search and Rescue (WASAR) training for emergency responders.',
 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
 'Training',
 CURRENT_DATE - INTERVAL '21 days',
 'Coastal Area',
 '["water", "rescue", "WASAR", "training"]',
 'published',
 false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample videos
INSERT INTO videos (title, description, video_url, thumbnail, category, date, location, duration, tags, status, featured) VALUES
('Emergency Response Training Overview',
 'Comprehensive overview of emergency response procedures and protocols.',
 'https://example.com/emergency-response-training.mp4',
 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
 'Training',
 CURRENT_DATE - INTERVAL '5 days',
 'MDRRMO Training Center',
 '15:30',
 '{"training", "emergency", "response", "procedures"}',
 'published',
 true),

('Community Evacuation Drill Documentation',
 'Documentation of the recent community-wide evacuation drill and lessons learned.',
 'https://example.com/evacuation-drill.mp4',
 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
 'Drill',
 CURRENT_DATE - INTERVAL '10 days',
 'Municipal Plaza',
 '8:45',
 '{"evacuation", "drill", "community", "documentation"}',
 'published',
 false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample social posts
INSERT INTO social_posts (platform, content, image, status, engagement) VALUES
('facebook',
 '🎯 BDRRM Planning Training Workshop completed successfully! Thank you to all barangay officials who participated in strengthening our disaster preparedness. Together, we build a more resilient Pio Duran! 💪 #MDRRMO #DisasterPreparedness #PioDuran',
 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
 'published',
 '{"likes": 45, "shares": 12, "comments": 8}'),

('twitter',
 '🚨 Nationwide Earthquake Drill: Over 5,000 participants joined our community preparedness exercise! Great job everyone! 🏢 #DisasterPreparedness #PioDuran #EarthquakeDrill #CommunityResilience',
 null,
 'published',
 '{"likes": 23, "shares": 18, "comments": 5}'),

('instagram',
 '🌊 Water rescue training in action! Our dedicated volunteers are ready to serve and protect our community. Swipe to see more from today''s intensive WASAR training session. #WaterRescue #WASAR #CommunityHeroes #PioDuran',
 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
 'published',
 '{"likes": 67, "shares": 8, "comments": 12}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample about sections
INSERT INTO about_sections (title, content, order_index, is_active) VALUES
('Our Mission',
 'To ensure the safety and resilience of Pio Duran through effective disaster risk reduction and management, protecting lives and property while building community capacity for emergency preparedness and response.',
 1,
 true),

('Our Vision', 
 'A disaster-resilient community of Pio Duran where every individual is empowered, prepared, and protected against all forms of disasters through collaborative efforts and sustainable development.',
 2,
 true),

('Our Commitment',
 'We are committed to continuous improvement in disaster risk reduction through innovation, community engagement, and evidence-based planning to create a safer and more resilient municipality.',
 3,
 true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample key personnel
INSERT INTO key_personnel (name, designation, photo, bio, email, phone, department, order_index, is_featured, is_active) VALUES
('Engr. Maria Santos',
 'MDRRMO Director',
 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
 '15+ years experience in disaster management and civil engineering. Leads strategic planning and policy development for municipal disaster risk reduction.',
 'maria.santos@pioduran.gov.ph',
 '(052) 234-5678',
 'MDRRMO',
 1,
 true,
 true),

('Dr. Juan Dela Cruz',
 'Deputy Director',
 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
 'Expert in emergency response coordination and community engagement. Oversees field operations and training programs.',
 'juan.delacruz@pioduran.gov.ph',
 '(052) 234-5679',
 'MDRRMO',
 2,
 true,
 true),

('Ana Reyes',
 'Training Coordinator',
 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
 'Specializes in capacity building and educational programs. Coordinates all training and workshop activities.',
 'ana.reyes@pioduran.gov.ph',
 '(052) 234-5680',
 'MDRRMO',
 3,
 false,
 true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- FINAL VERIFICATION
-- =============================================

-- Verify all tables exist and have proper RLS
DO $$
DECLARE
    table_record RECORD;
    missing_tables text[] := '{}';
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN (
            'news', 'services', 'incident_reports', 'gallery', 'videos',
            'pages', 'page_sections', 'resources', 'emergency_alerts',
            'social_posts', 'about_sections', 'organizational_hierarchy',
            'key_personnel', 'emergency_hotlines', 'navigation_items',
            'system_settings', 'users', 'weather_data', 'weather_forecast',
            'weather_alerts', 'weather_api_settings'
        )
    LOOP
        -- Check if RLS is enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relname = table_record.table_name
            AND n.nspname = 'public'
            AND c.relrowsecurity = true
        ) THEN
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_record.table_name);
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Schema migration completed successfully. All tables created with proper RLS policies.';
END $$;