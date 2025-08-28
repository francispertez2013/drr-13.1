/*
  # Create Weather Data Table

  1. New Tables
    - `weather_data`
      - `id` (uuid, primary key)
      - `temperature` (integer, required)
      - `humidity` (integer, required)
      - `wind_speed` (integer, required)
      - `visibility` (integer, required)
      - `condition` (text, required)
      - `description` (text, required)
      - `location` (text, required)
      - `alerts` (text array, default empty)
      - `last_updated` (timestamp)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `weather_data` table
    - Add policy for public to read active weather data
    - Add policy for authenticated users to manage weather data
*/

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature integer NOT NULL,
  humidity integer NOT NULL,
  wind_speed integer NOT NULL,
  visibility integer NOT NULL DEFAULT 10,
  condition text NOT NULL CHECK (condition IN ('sunny', 'cloudy', 'rainy', 'stormy')),
  description text NOT NULL,
  location text NOT NULL DEFAULT 'Pio Duran, Albay',
  alerts text[] DEFAULT '{}',
  last_updated timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read active weather data"
  ON weather_data
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage weather data"
  ON weather_data
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
    WHERE tgname = 'update_weather_data_updated_at'
  ) THEN
    CREATE TRIGGER update_weather_data_updated_at
      BEFORE UPDATE ON weather_data
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert initial weather data
INSERT INTO weather_data (temperature, humidity, wind_speed, visibility, condition, description, location, alerts, is_active) VALUES
(28, 75, 12, 10, 'cloudy', 'Partly Cloudy', 'Pio Duran, Albay', ARRAY[]::text[], true)
ON CONFLICT DO NOTHING;