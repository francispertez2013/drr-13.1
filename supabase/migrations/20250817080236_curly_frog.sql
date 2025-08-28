/*
  # Add Videos Table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `video_url` (text, required)
      - `thumbnail` (text, required)
      - `category` (text, optional)
      - `date` (date, optional)
      - `location` (text, optional)
      - `duration` (text, optional)
      - `tags` (text array, default empty)
      - `status` (enum: published/draft, default draft)
      - `featured` (boolean, default false)
      - `view_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `videos` table
    - Add policy for public to read published videos
    - Add policy for authenticated users to manage all videos
*/

-- Create videos table
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

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read published videos"
  ON videos
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage all videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_videos_updated_at'
  ) THEN
    CREATE TRIGGER update_videos_updated_at
      BEFORE UPDATE ON videos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample video data
INSERT INTO videos (title, description, video_url, thumbnail, category, date, location, duration, tags, status, featured, view_count) VALUES
('BDRRM Training Workshop', 'Comprehensive training for barangay officials on disaster risk reduction', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForestCamping.mp4', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg', 'Training', '2024-01-15', 'Municipal Hall', '3:45', ARRAY['training', 'barangay', 'officials'], 'published', true, 245),
('Earthquake Drill Documentation', 'Community-wide earthquake preparedness drill', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg', 'Drill', '2024-01-20', 'Various Barangays', '2:30', ARRAY['earthquake', 'drill', 'community'], 'published', true, 189),
('Water Rescue Training', 'WASAR training session for emergency responders', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg', 'Training', '2024-01-25', 'Coastal Area', '4:12', ARRAY['water', 'rescue', 'wasar'], 'published', false, 156),
('Fire Safety Campaign', 'Community fire prevention and safety awareness', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg', 'Campaign', '2024-02-01', 'Community Center', '1:58', ARRAY['fire', 'safety', 'prevention'], 'published', false, 134),
('Emergency Response Simulation', 'Multi-agency emergency response exercise', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg', 'Drill', '2024-02-05', 'Municipal Grounds', '5:20', ARRAY['emergency', 'response', 'simulation'], 'published', false, 98),
('Community Preparedness Workshop', 'Educating families on disaster preparedness', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg', 'Workshop', '2024-02-10', 'Barangay Hall', '3:33', ARRAY['community', 'preparedness', 'education'], 'published', false, 87);