/*
  # Unified MDRRMO Database Schema
  
  This migration consolidates all previous migrations into a single, comprehensive schema
  for the MDRRMO Pio Duran system.

  1. Core Tables
    - news - News articles and announcements
    - services - MDRRMO services and offerings  
    - incident_reports - Public incident reports with image support
    - gallery - Photo gallery with bulk upload support
    - pages - Dynamic page content management
    - page_sections - Modular page sections
    - resources - Downloadable resources management
    - emergency_alerts - Emergency alert system with frontend display
    - social_posts - Social media content management
    - navigation_items - Dynamic navigation menu management
    - organizational_hierarchy - Staff organizational structure
    - key_personnel - Key personnel management
    - emergency_hotlines - Emergency contact management
    - system_settings - Application settings storage
    - users - User management system
    - weather_data - Weather information management

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Public read access for published content
    - Authenticated user management access
    - Proper access policies for each table

  3. Storage
    - Gallery images bucket
    - Incident images bucket
    - File upload support with proper policies

  4. Sample Data
    - Pre-populated with comprehensive demo content
    - Ready for immediate use and testing
*/

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- News table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  image text,
  author text,
  status text DEFAULT 'draft',
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT news_status_check CHECK (status IN ('published', 'draft'))
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news"
  ON news FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage news"
  ON news FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text DEFAULT 'Shield',
  tags jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT services_status_check CHECK (status IN ('active', 'inactive'))
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Incident reports table with image support
CREATE TABLE IF NOT EXISTS incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  reporter_name text NOT NULL,
  contact_number text NOT NULL,
  location text,
  incident_type text,
  description text,
  urgency text DEFAULT 'MEDIUM',
  status text DEFAULT 'pending',
  image_url text,
  date_reported timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT incident_urgency_check CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH')),
  CONSTRAINT incident_status_check CHECK (status IN ('pending', 'in-progress', 'resolved'))
);

ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all incident reports"
  ON incident_reports FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Anyone can create incident reports"
  ON incident_reports FOR INSERT
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can update incident reports"
  ON incident_reports FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Gallery table with bulk upload support
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image text,
  category text,
  date date DEFAULT CURRENT_DATE,
  location text,
  tags jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  bulk_upload_id text,
  file_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT gallery_status_check CHECK (status IN ('published', 'draft'))
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published gallery items"
  ON gallery FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage gallery"
  ON gallery FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Pages table for dynamic content
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
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT pages_status_check CHECK (status IN ('published', 'draft')),
  CONSTRAINT pages_template_check CHECK (template IN ('default', 'about', 'services', 'news', 'resources', 'disaster-plan'))
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published pages"
  ON pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Page sections table
CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text,
  content text,
  data jsonb DEFAULT '{}'::jsonb,
  order_index integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT section_type_check CHECK (type IN ('hero', 'content', 'cards', 'stats', 'gallery', 'contact', 'accordion', 'grid', 'timeline'))
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active page sections"
  ON page_sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage page sections"
  ON page_sections FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text DEFAULT 'pdf',
  file_size bigint DEFAULT 0,
  category text DEFAULT 'guide',
  subcategory text,
  tags jsonb DEFAULT '[]'::jsonb,
  download_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT resources_file_type_check CHECK (file_type IN ('pdf', 'doc', 'docx', 'image', 'video', 'zip')),
  CONSTRAINT resources_category_check CHECK (category IN ('guide', 'form', 'map', 'report', 'plan', 'manual')),
  CONSTRAINT resources_status_check CHECK (status IN ('published', 'draft'))
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published resources"
  ON resources FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Emergency alerts table with frontend display
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  location text,
  coordinates jsonb,
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  status text DEFAULT 'draft',
  channels jsonb DEFAULT '[]'::jsonb,
  sent_to jsonb DEFAULT '[]'::jsonb,
  priority integer DEFAULT 3,
  show_on_frontend boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT alert_type_check CHECK (type IN ('typhoon', 'earthquake', 'flood', 'fire', 'landslide', 'tsunami', 'general')),
  CONSTRAINT alert_severity_check CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT alert_status_check CHECK (status IN ('draft', 'active', 'expired', 'cancelled')),
  CONSTRAINT alert_priority_check CHECK (priority BETWEEN 1 AND 5)
);

ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active emergency alerts"
  ON emergency_alerts FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage emergency alerts"
  ON emergency_alerts FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Social posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  content text NOT NULL,
  image text,
  link text,
  scheduled_time timestamptz,
  status text DEFAULT 'draft',
  engagement jsonb DEFAULT '{"likes": 0, "shares": 0, "comments": 0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT social_platform_check CHECK (platform IN ('facebook', 'twitter', 'instagram', 'youtube')),
  CONSTRAINT social_status_check CHECK (status IN ('draft', 'scheduled', 'published', 'failed'))
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published social posts"
  ON social_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage social posts"
  ON social_posts FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Navigation items table
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
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage navigation items"
  ON navigation_items FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Organizational hierarchy table
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
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage organizational hierarchy"
  ON organizational_hierarchy FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Key personnel table
CREATE TABLE IF NOT EXISTS key_personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  photo text,
  bio text,
  email text,
  phone text,
  department text,
  order_index integer DEFAULT 1,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE key_personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active key personnel"
  ON key_personnel FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage key personnel"
  ON key_personnel FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Emergency hotlines table
CREATE TABLE IF NOT EXISTS emergency_hotlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name text NOT NULL,
  phone_number text NOT NULL,
  logo text,
  department text,
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
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage emergency hotlines"
  ON emergency_hotlines FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text DEFAULT 'string',
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT settings_type_check CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array'))
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public settings"
  ON system_settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can read all settings"
  ON system_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'editor',
  name text NOT NULL,
  avatar text,
  status text DEFAULT 'active',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('admin', 'editor')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive'))
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all users"
  ON users FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage users"
  ON users FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- About sections table
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
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage about sections"
  ON about_sections FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature integer NOT NULL,
  humidity integer NOT NULL,
  wind_speed integer NOT NULL,
  visibility integer NOT NULL,
  condition text NOT NULL,
  description text NOT NULL,
  location text DEFAULT 'Pio Duran, Albay',
  alerts jsonb DEFAULT '[]'::jsonb,
  last_updated timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT weather_condition_check CHECK (condition IN ('sunny', 'cloudy', 'rainy', 'stormy'))
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active weather data"
  ON weather_data FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage weather data"
  ON weather_data FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON emergency_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizational_hierarchy_updated_at BEFORE UPDATE ON organizational_hierarchy FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_personnel_updated_at BEFORE UPDATE ON key_personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_hotlines_updated_at BEFORE UPDATE ON emergency_hotlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON about_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weather_data_updated_at BEFORE UPDATE ON weather_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('gallery', 'gallery', true),
  ('incidents', 'incidents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery bucket
CREATE POLICY "Anyone can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can update gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');

-- Storage policies for incidents bucket
CREATE POLICY "Anyone can view incident images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'incidents');

CREATE POLICY "Anyone can upload incident images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'incidents');

CREATE POLICY "Authenticated users can update incident images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'incidents');

CREATE POLICY "Authenticated users can delete incident images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'incidents');

-- Insert comprehensive sample data

-- Sample news articles
INSERT INTO news (title, excerpt, content, image, author, status, date) VALUES
('BDRRM Planning Training Workshop for Barangay Officials', 'On June 25, 2024, the Municipal Disaster Risk Reduction and Management Office (MDRRMO) conducted an essential training session for barangay officials on Barangay Disaster Risk Reduction and Management Planning.', 'The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran successfully conducted a comprehensive training workshop on Barangay Disaster Risk Reduction and Management (BDRRM) Planning on June 25, 2024, at Barangay Basicao Interior.

The training session was attended by barangay officials, including barangay captains, kagawads, and BDRRM coordinators from various barangays within the municipality. The workshop aimed to enhance the capacity of local officials in developing effective disaster risk reduction and management plans at the barangay level.

Key topics covered during the training included:
- Risk assessment and hazard mapping
- Vulnerability and capacity assessment
- Development of barangay contingency plans
- Early warning systems implementation
- Community-based disaster preparedness
- Resource mobilization and coordination

The participants actively engaged in group exercises and practical sessions, working on real scenarios that could affect their respective barangays. The training emphasized the importance of community participation and the role of local government units in building disaster-resilient communities.

MDRRMO Director Engr. Maria Santos highlighted the significance of barangay-level preparedness, stating that "effective disaster management starts at the grassroots level. When our barangays are prepared, our entire municipality becomes more resilient."

The workshop concluded with each participating barangay committing to develop or update their respective BDRRM plans within the next three months. Follow-up sessions and technical assistance will be provided by the MDRRMO to ensure successful implementation of the plans.

This training is part of the municipality''s ongoing efforts to strengthen disaster preparedness and build resilient communities in accordance with the National Disaster Risk Reduction and Management Act of 2010.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg', 'MDRRMO Operations Center', 'published', '2024-06-29'),

('Successful Nationwide Simultaneous Earthquake Drill Conducted', 'The municipality of Pio Duran participated in the 2nd quarter nationwide simultaneous earthquake drill with remarkable community participation of over 5,000 residents.', 'The Municipality of Pio Duran successfully participated in the 2nd Quarter Nationwide Simultaneous Earthquake Drill (NSED) on June 9, 2023, demonstrating the community''s commitment to disaster preparedness and safety.

The drill, which was conducted simultaneously across the Philippines at exactly 2:00 PM, saw the participation of over 5,000 residents from all 31 barangays of Pio Duran. The exercise included students, teachers, government employees, private sector workers, and community members.

The earthquake drill simulation involved a magnitude 7.2 earthquake scenario, requiring participants to perform the standard "Drop, Cover, and Hold On" procedure. The drill lasted for approximately 15 minutes, including the evacuation phase to designated assembly areas.

Key highlights of the drill:
- 100% participation from all public schools
- Active involvement of barangay officials and volunteers
- Coordination with municipal departments and agencies
- Real-time communication testing between response teams
- Evaluation of evacuation routes and assembly areas

MDRRMO teams were strategically positioned across the municipality to observe and evaluate the drill''s effectiveness. The assessment focused on response time, evacuation procedures, communication protocols, and overall community preparedness.

Deputy Director Dr. Juan Dela Cruz commended the community''s active participation, noting that "the high level of engagement demonstrates our residents'' understanding of the importance of earthquake preparedness. This drill helps us identify areas for improvement and strengthens our collective response capabilities."

The drill results will be analyzed to enhance the municipality''s earthquake preparedness strategies and improve future emergency response procedures. Recommendations from the evaluation will be incorporated into the municipal disaster risk reduction and management plan.

Regular earthquake drills are conducted quarterly as part of the municipality''s commitment to building a disaster-resilient community and ensuring the safety of all residents.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg', 'MDRRMO Operations Center', 'published', '2023-06-09'),

('Water Search and Rescue (WASAR) Training Course Completed', 'Twenty dedicated volunteers successfully completed an intensive Water Search and Rescue training course, enhancing the municipality''s emergency response capabilities for water-related incidents.', 'The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran successfully concluded a comprehensive Water Search and Rescue (WASAR) training course on November 19, 2021, with 20 volunteers completing the intensive program.

The five-day training course was designed to enhance the municipality''s capacity to respond to water-related emergencies, including floods, drowning incidents, and other aquatic emergencies. The program covered both theoretical knowledge and practical skills essential for effective water rescue operations.

Training modules included:
- Basic Life Support (BLS) and CPR techniques
- Water rescue techniques and equipment usage
- Victim assessment and emergency medical care
- Swift water rescue operations
- Boat handling and water safety protocols
- Team coordination and communication
- Risk assessment in aquatic environments

The training was conducted by certified instructors from the Philippine Coast Guard and the Bureau of Fire Protection, ensuring that participants received high-quality instruction based on international standards and best practices.

Participants underwent rigorous practical exercises in various water conditions, including pool training, open water scenarios, and simulated emergency situations. The course emphasized safety protocols and proper use of rescue equipment such as throw bags, rescue tubes, and personal flotation devices.

Training Coordinator Ana Reyes expressed her satisfaction with the participants'' dedication, stating, "These volunteers have demonstrated exceptional commitment to serving their community. Their newly acquired skills will significantly enhance our emergency response capabilities, particularly during the rainy season when water-related incidents are more common."

The newly trained WASAR volunteers will be integrated into the municipality''s emergency response teams and will be on standby during high-risk periods such as typhoon season and heavy rainfall events. They will also assist in conducting water safety awareness programs in schools and communities.

This training initiative is part of the MDRRMO''s continuous effort to build local capacity and ensure that the municipality is well-prepared to handle various types of emergencies. Regular refresher courses and advanced training sessions are planned to maintain and enhance the volunteers'' skills.

The successful completion of this WASAR training course represents a significant milestone in strengthening Pio Duran''s disaster preparedness and emergency response capabilities.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg', 'MDRRMO Training Division', 'published', '2021-11-19'),

('Emergency Hotline Numbers Updated for 2025', 'The MDRRMO has updated the official emergency hotline numbers to ensure faster response times and better coordination during emergencies.', 'The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran announces the updated emergency hotline numbers for 2025, aimed at improving emergency response coordination and ensuring faster assistance to residents in need.

The updated emergency contact system includes:

PRIMARY EMERGENCY HOTLINE: 911
This remains the primary number for all life-threatening emergencies and disasters. The 911 hotline is operational 24/7 and connects directly to the MDRRMO Emergency Operations Center.

MDRRMO DIRECT LINE: (052) 234-5678
For non-life-threatening emergencies, disaster-related inquiries, and coordination with barangay officials.

SPECIALIZED EMERGENCY CONTACTS:
- Medical Emergency Hotline: (052) 345-6789
- Fire Emergency: (052) 567-8901  
- Police Emergency: 117
- Coast Guard: (052) 678-9012
- Municipal Social Welfare: 1343

The updated system features:
- Improved call routing and response times
- 24/7 availability for primary emergency services
- Multi-language support (Filipino, Bicol, English)
- Integration with mobile alert systems
- Direct coordination with regional emergency services

MDRRMO Director Engr. Maria Santos emphasized the importance of familiarizing residents with these numbers: "Every household should have these emergency numbers readily available. In times of crisis, quick access to emergency services can save lives and minimize damage."

The emergency hotline system is supported by trained dispatchers who can:
- Assess emergency situations quickly
- Deploy appropriate response teams
- Coordinate with other agencies as needed
- Provide immediate guidance to callers
- Track and monitor emergency responses

Residents are encouraged to:
- Save these numbers in their mobile phones
- Post them in visible areas at home and workplace
- Share with family members and neighbors
- Use responsibly for genuine emergencies only

The MDRRMO also reminds the public that false emergency reports are punishable by law and can delay response to actual emergencies.

For non-emergency inquiries about disaster preparedness, training schedules, or general information, residents can visit the MDRRMO office at the Municipal Hall during regular office hours (8:00 AM - 5:00 PM, Monday to Friday) or send an email to mdrrmo@pioduran.gov.ph.

These updated emergency hotlines are part of the municipality''s ongoing efforts to enhance public safety and emergency preparedness in line with national disaster risk reduction standards.', 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg', 'MDRRMO Communications', 'published', '2025-01-15');

-- Sample services
INSERT INTO services (title, description, icon, tags, status) VALUES
('Emergency Response and Rescue Operations', 'Immediate response to disaster-related emergencies with our trained response teams equipped with modern rescue equipment and vehicles.', 'Shield', '["Search & Rescue", "Medical Assistance", "Fire Response", "Emergency Medical Services", "Evacuation Support"]', 'active'),

('Community Training and Capacity Building', 'Comprehensive training programs for community members, volunteers, and local officials to enhance disaster preparedness and response capabilities.', 'Users', '["First Aid Training", "DRRM Workshops", "Evacuation Drills", "WASAR Training", "Leadership Development"]', 'active'),

('Risk Assessment and Hazard Mapping', 'Systematic evaluation of potential hazards, vulnerabilities, and risks to communities, infrastructure, and environment using modern GIS technology.', 'MapPin', '["Flood Mapping", "Risk Analysis", "Vulnerability Assessment", "Climate Data", "Mitigation Planning"]', 'active'),

('Early Warning Systems', 'Advanced monitoring and alert systems to provide timely information about impending disasters through multiple communication channels.', 'Bell', '["Weather Monitoring", "Alert Systems", "Community Warnings", "Mobile Notifications", "Siren Networks"]', 'active'),

('Barangay DRRM Planning Support', 'Technical assistance and guidance for barangays in developing their own disaster risk reduction and management plans and capabilities.', 'Building', '["Barangay Planning", "Local Coordination", "Resource Mapping", "Community Mobilization", "Plan Development"]', 'active'),

('Public Information and Education', 'Awareness campaigns and educational programs to inform the public about disaster risks and preparedness measures.', 'Megaphone', '["Public Awareness", "School Programs", "Media Campaigns", "Educational Materials", "Community Outreach"]', 'active');

-- Sample gallery items
INSERT INTO gallery (title, description, image, category, date, location, tags, status, featured) VALUES
('BDRRM Planning Training Workshop', 'Comprehensive training session on Barangay Disaster Risk Reduction and Management Planning conducted for barangay officials at Barangay Basicao Interior.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg', 'Training', '2024-06-25', 'Barangay Basicao Interior', '["BDRRM", "Training", "Workshop", "Barangay Officials", "Planning"]', 'published', true),

('Nationwide Simultaneous Earthquake Drill', 'Municipality-wide participation in the 2nd quarter nationwide simultaneous earthquake drill with over 5,000 participants demonstrating community preparedness.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg', 'Drill', '2023-06-09', 'Municipality-wide', '["Earthquake", "Drill", "Safety", "Community", "Preparedness"]', 'published', false),

('Water Search and Rescue Training Course', 'Intensive training program where 20 volunteers completed comprehensive training in Basic Life Support, survival skills, and Water Search and Rescue (WASAR) techniques.', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg', 'Training', '2021-11-19', 'MDRRMO Training Center', '["Water Rescue", "WASAR", "Volunteers", "Life Support", "Emergency Response"]', 'published', true),

('Fire Safety Awareness Campaign', 'Community fire safety awareness campaign conducted in partnership with the Bureau of Fire Protection, reaching over 500 families and businesses.', 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg', 'Campaign', '2023-12-10', 'Municipal Plaza', '["Fire Safety", "Prevention", "Community", "Awareness", "BFP Partnership"]', 'published', false),

('Emergency Response Equipment Inspection', 'Regular inspection and maintenance of emergency response equipment including rescue vehicles, medical supplies, and communication devices.', 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg', 'Operations', '2024-01-15', 'MDRRMO Headquarters', '["Equipment", "Maintenance", "Emergency Response", "Vehicles", "Preparedness"]', 'published', false),

('Community Evacuation Drill', 'Large-scale evacuation drill involving multiple barangays to test evacuation routes, transportation, and shelter management procedures.', 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg', 'Drill', '2023-11-20', 'Coastal Barangays', '["Evacuation", "Drill", "Community", "Transportation", "Shelter Management"]', 'published', false);

-- Sample about sections
INSERT INTO about_sections (title, content, order_index, is_active) VALUES
('Mission Statement', 'To reduce disaster risks and enhance community resilience through effective preparedness, response, recovery, and mitigation strategies, ensuring the safety and well-being of all residents in Pio Duran.', 1, true),
('Vision Statement', 'A disaster-resilient community of Pio Duran where every individual is empowered, prepared, and protected against all forms of disasters through collaborative efforts and sustainable development.', 2, true),
('Core Values', 'Integrity, Community Partnership, Resilience, and Sustainability guide all our operations and decision-making processes in serving the people of Pio Duran.', 3, true),
('Strategic Goals', 'To achieve zero casualties from disasters through proactive planning, effective response systems, community education, and sustainable development practices.', 4, true);

-- Sample pages
INSERT INTO pages (title, slug, content, meta_description, template, hero_title, hero_subtitle, status, featured) VALUES
('About MDRRMO Pio Duran', 'about', '<div class="prose max-w-none"><h2>Municipal Disaster Risk Reduction and Management Office</h2><p>The Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran serves as the primary agency responsible for ensuring the safety and resilience of our community through comprehensive disaster risk reduction and management strategies.</p><p>Our office is committed to protecting lives, property, and the environment through proactive planning, effective response, and sustainable recovery efforts. We work closely with local government units, community organizations, and residents to build a disaster-resilient municipality.</p></div>', 'Learn about the Municipal Disaster Risk Reduction and Management Office of Pio Duran, Albay and our commitment to community safety.', 'about', 'About DRRM Pio Duran', 'Municipal Disaster Risk Reduction and Management Office', 'published', true),

('Disaster Management Planning', 'disaster-planning', '<div class="prose max-w-none"><h2>Comprehensive Disaster Risk Reduction Planning</h2><p>Our disaster risk reduction and management planning involves systematic approaches to identify, assess, and reduce disaster risks while enhancing community resilience.</p><h3>Planning Components</h3><ul><li>Risk Assessment and Hazard Mapping</li><li>Vulnerability and Capacity Assessment</li><li>Contingency Planning</li><li>Early Warning Systems</li><li>Community Preparedness Programs</li></ul></div>', 'Comprehensive disaster risk reduction and management planning strategies and frameworks for building resilient communities.', 'disaster-plan', 'Disaster Risk Reduction & Management Planning', 'Building resilient communities through comprehensive planning and preparedness', 'published', true),

('Emergency Procedures Guide', 'emergency-procedures', '<div class="prose max-w-none"><h2>Emergency Response Procedures</h2><p>Essential procedures for responding to various types of emergencies and disasters that may affect Pio Duran.</p><h3>Before an Emergency</h3><ul><li>Prepare emergency kits</li><li>Know evacuation routes</li><li>Stay informed about risks</li></ul><h3>During an Emergency</h3><ul><li>Follow official instructions</li><li>Evacuate if ordered</li><li>Stay calm and help others</li></ul></div>', 'Step-by-step emergency procedures for various disaster types including typhoons, earthquakes, floods, and fires.', 'default', 'Emergency Procedures', 'What to do before, during, and after emergencies', 'published', false);

-- Sample resources
INSERT INTO resources (title, description, file_url, file_type, category, tags, download_count, status, featured) VALUES
('Family Disaster Preparedness Plan Template', 'A comprehensive, fillable template to help families create their own customized emergency preparedness plan with evacuation routes, contact information, and emergency supplies checklist.', 'https://www.ready.gov/sites/default/files/2020-03/family-emergency-plan.pdf', 'pdf', 'guide', '["preparedness", "family", "planning", "template", "emergency"]', 1248, 'published', true),

('Emergency Kit Checklist - Complete Guide', 'A detailed checklist of essential items every household should have in their emergency kit, including food, water, medical supplies, tools, and important documents.', 'https://www.ready.gov/sites/default/files/2020-03/basic-disaster-supplies-kit.pdf', 'pdf', 'guide', '["emergency", "kit", "checklist", "supplies", "preparedness"]', 987, 'published', true),

('Evacuation Routes Map - Pio Duran Municipality', 'Detailed map showing all official evacuation routes, evacuation centers, and safe zones throughout Pio Duran municipality with GPS coordinates and accessibility information.', 'https://example.com/evacuation-routes-map.pdf', 'pdf', 'map', '["evacuation", "routes", "map", "emergency", "safety", "navigation"]', 567, 'published', true),

('Basic First Aid Manual', 'Comprehensive illustrated guide covering basic first aid procedures, CPR techniques, and emergency medical care that can be administered by non-medical personnel.', 'https://www.redcross.org/content/dam/redcross/atg/PDF_s/Health___Safety_Services/Training/pm328140.pdf', 'pdf', 'guide', '["first-aid", "medical", "emergency", "health", "CPR", "treatment"]', 856, 'published', false),

('Typhoon Preparedness and Response Guide', 'Specific instructions and procedures for preparing for, responding to, and recovering from typhoons, including wind safety, flood protection, and post-storm recovery.', 'https://example.com/typhoon-guide.pdf', 'pdf', 'guide', '["typhoon", "storm", "preparedness", "weather", "wind", "flooding"]', 743, 'published', false),

('Earthquake Safety and Response Manual', 'Comprehensive guide covering earthquake safety procedures, including drop-cover-hold techniques, building safety assessment, and post-earthquake recovery steps.', 'https://example.com/earthquake-guide.pdf', 'pdf', 'guide', '["earthquake", "safety", "preparedness", "seismic", "building", "response"]', 692, 'published', false),

('Municipal DRRM Plan 2024-2028', 'The official Municipal Disaster Risk Reduction and Management Plan outlining strategies, policies, and programs for the next five years.', 'https://example.com/municipal-drrm-plan.pdf', 'pdf', 'plan', '["drrm", "municipal", "planning", "strategy", "policy", "governance"]', 445, 'published', false),

('Incident Report Form', 'Official form for reporting disasters, emergencies, and hazardous conditions to the MDRRMO for proper documentation and response coordination.', 'https://example.com/incident-report-form.pdf', 'pdf', 'form', '["incident", "reporting", "form", "emergency", "documentation"]', 234, 'published', false),

('Volunteer Registration Application', 'Application form for individuals interested in joining the MDRRMO volunteer program for emergency response, community training, and disaster preparedness activities.', 'https://example.com/volunteer-form.pdf', 'pdf', 'form', '["volunteer", "registration", "form", "community", "emergency response"]', 189, 'published', false),

('Flood Safety and Preparedness Guide', 'Essential information on flood safety, including evacuation procedures, water safety, and flood recovery steps specifically tailored for flood-prone areas in Pio Duran.', 'https://example.com/flood-guide.pdf', 'pdf', 'guide', '["flood", "water", "safety", "evacuation", "recovery", "preparedness"]', 634, 'published', false);

-- Sample organizational hierarchy
INSERT INTO organizational_hierarchy (name, designation, photo, department, level, order_index) VALUES
('Hon. Maria Santos', 'Municipal Mayor', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Executive Office', 1, 1),
('Engr. Juan Dela Cruz', 'MDRRMO Director', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'MDRRMO', 2, 1),
('Dr. Ana Reyes', 'Deputy Director', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'MDRRMO', 3, 1),
('Mark Santos', 'Operations Chief', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Operations Division', 3, 2),
('Lisa Garcia', 'Training Coordinator', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Training Division', 3, 3),
('Carlos Mendoza', 'Communications Officer', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Information Division', 3, 4);

-- Sample key personnel
INSERT INTO key_personnel (name, designation, photo, bio, email, phone, department, is_featured, order_index) VALUES
('Engr. Maria Santos', 'MDRRMO Director', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Licensed Civil Engineer with over 15 years of experience in disaster management and infrastructure development. Leads strategic planning and policy development for the municipality.', 'director@mdrrmo.gov.ph', '(052) 234-5678', 'MDRRMO', true, 1),

('Dr. Juan Dela Cruz', 'Deputy Director', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Medical Doctor specializing in emergency medicine and disaster health management. Expert in emergency response coordination and community health preparedness programs.', 'deputy@mdrrmo.gov.ph', '(052) 234-5679', 'MDRRMO', true, 2),

('Ana Reyes', 'Training Coordinator', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Education specialist with expertise in adult learning and community capacity building. Coordinates all training programs and educational initiatives for disaster preparedness.', 'training@mdrrmo.gov.ph', '(052) 234-5680', 'Training Division', true, 3),

('Mark Santos', 'Operations Chief', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'Former military officer with extensive experience in emergency operations and logistics. Oversees all field operations and emergency response activities.', 'operations@mdrrmo.gov.ph', '(052) 234-5681', 'Operations Division', false, 4);

-- Sample emergency hotlines
INSERT INTO emergency_hotlines (contact_name, phone_number, logo, department, description, is_primary, order_index) VALUES
('MDRRMO Emergency Hotline', '911', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'MDRRMO', 'Primary emergency response and disaster management hotline available 24/7', true, 1),
('Office of the Mayor', '(052) 123-4567', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Executive Office', 'Municipal government office for administrative and coordination matters', false, 2),
('Medical Emergency Hotline', '(052) 345-6789', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Municipal Health Office', 'Medical emergencies, health-related incidents, and ambulance services', false, 3),
('Fire Department', '(052) 567-8901', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Bureau of Fire Protection', 'Fire emergencies, rescue operations, and fire prevention services', false, 4),
('Police Station', '117', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Philippine National Police', 'Security, law enforcement, and crime-related emergencies', false, 5),
('Coast Guard', '(052) 678-9012', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Philippine Coast Guard', 'Maritime emergencies, water rescue, and coastal security', false, 6),
('Social Welfare Office', '1343', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp', 'Municipal Social Welfare', 'Social services, relief assistance, and vulnerable population support', false, 7);

-- Sample navigation items
INSERT INTO navigation_items (label, path, icon, order_index, is_active, is_featured) VALUES
('Home', '/', 'Home', 1, true, true),
('About MDRRMO', '/about', 'Info', 2, true, true),
('Our Services', '/services-detail', 'Shield', 3, true, true),
('News & Updates', '/news-portal', 'Newspaper', 4, true, true),
('Resources', '/resources', 'FolderOpen', 5, true, true),
('Disaster Planning', '/disaster-planning', 'Calendar', 6, true, true),
('Photo Gallery', '/gallery', 'Camera', 7, true, true),
('Contact Us', '/contact', 'Phone', 8, true, true);

-- Sample system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', '"MDRRMO Pio Duran"', 'string', 'Official website name', true),
('site_description', '"Municipal Disaster Risk Reduction and Management Office of Pio Duran, Albay"', 'string', 'Website description for SEO', true),
('contact_email', '"mdrrmo@pioduran.gov.ph"', 'string', 'Primary contact email address', true),
('emergency_hotline', '"911"', 'string', 'Primary emergency hotline number', true),
('office_address', '"Municipal Hall, Pio Duran, Albay, Philippines"', 'string', 'Physical office address', true),
('office_hours', '"Monday - Friday: 8:00 AM - 5:00 PM"', 'string', 'Regular office operating hours', true),
('enable_notifications', 'true', 'boolean', 'Enable email notifications for incident reports', false),
('enable_public_reporting', 'true', 'boolean', 'Allow public to submit incident reports', false),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode to disable public access', false),
('auto_backup', 'true', 'boolean', 'Enable automatic database backups', false),
('backup_frequency', '"daily"', 'string', 'Frequency of automatic backups', false),
('max_file_size', '5242880', 'number', 'Maximum file upload size in bytes (5MB)', false),
('allowed_file_types', '["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]', 'array', 'Allowed file types for uploads', false);

-- Sample demo users
INSERT INTO users (username, email, password_hash, role, name, status) VALUES
('admin', 'admin@mdrrmo.gov.ph', 'admin123', 'admin', 'MDRRMO Administrator', 'active'),
('editor', 'editor@mdrrmo.gov.ph', 'editor123', 'editor', 'Content Editor', 'active'),
('director', 'director@mdrrmo.gov.ph', 'director123', 'admin', 'MDRRMO Director', 'active');

-- Sample weather data
INSERT INTO weather_data (temperature, humidity, wind_speed, visibility, condition, description, location, alerts, is_active) VALUES
(28, 75, 12, 10, 'cloudy', 'Partly Cloudy', 'Pio Duran, Albay', '["Thunderstorm possible this afternoon", "Monitor weather updates regularly"]', true);

-- Sample social posts
INSERT INTO social_posts (platform, content, image, status, engagement) VALUES
('facebook', '🎯 BDRRM Planning Training Workshop completed successfully! Thank you to all barangay officials who participated in strengthening our disaster preparedness. Together, we build a more resilient Pio Duran! 💪 #MDRRMO #DisasterPreparedness #PioDuran', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg', 'published', '{"likes": 45, "shares": 12, "comments": 8}'),

('twitter', '🚨 Nationwide Earthquake Drill: Over 5,000 participants joined our community preparedness exercise! Great job everyone! 🏢 #DisasterPreparedness #PioDuran #EarthquakeDrill #CommunityResilience', '', 'published', '{"likes": 23, "shares": 18, "comments": 5}'),

('instagram', '🌊 Water rescue training in action! Our dedicated volunteers are ready to serve and protect our community. Swipe to see more from today''s intensive WASAR training session. #WaterRescue #WASAR #CommunityVolunteers #EmergencyResponse', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg', 'published', '{"likes": 67, "shares": 8, "comments": 12}'),

('facebook', '🔥 Fire Safety Awareness Campaign was a huge success! Thank you to all families and businesses who participated. Remember: Prevention is always better than cure. Stay safe, Pio Duran! 🏠 #FireSafety #Prevention #CommunityAwareness', 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg', 'published', '{"likes": 34, "shares": 9, "comments": 6}');

-- Sample emergency alerts
INSERT INTO emergency_alerts (type, severity, title, message, location, status, channels, priority, show_on_frontend) VALUES
('general', 'medium', 'Weather Monitoring Update', 'MDRRMO is closely monitoring weather conditions. Residents are advised to stay updated with official weather bulletins and prepare for possible heavy rainfall.', 'Municipality-wide', 'active', '["social-media", "website", "sms"]', 3, true),

('typhoon', 'high', 'Typhoon Watch Alert', 'A tropical depression is being monitored east of the Philippines. While not directly threatening our area, residents should review their emergency plans and monitor weather updates.', 'Coastal Areas', 'active', '["social-media", "website", "radio", "sms"]', 4, true);