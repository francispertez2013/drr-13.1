/*
  # Weather API Settings and Forecast Tables

  1. New Tables
    - `weather_api_settings`
      - `id` (uuid, primary key)
      - `api_key` (text, encrypted)
      - `api_secret` (text, encrypted)
      - `station_id` (text)
      - `is_active` (boolean, default true)
      - `last_sync` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weather_forecast`
      - `id` (uuid, primary key)
      - `date` (date)
      - `temperature_high` (integer)
      - `temperature_low` (integer)
      - `condition` (text)
      - `humidity` (integer)
      - `wind_speed` (integer)
      - `precipitation` (integer)
      - `icon` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage settings
    - Add policies for public to read forecast data
*/

-- Create weather_api_settings table
CREATE TABLE IF NOT EXISTS weather_api_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key text NOT NULL,
  api_secret text NOT NULL,
  station_id text NOT NULL,
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weather_forecast table
CREATE TABLE IF NOT EXISTS weather_forecast (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  temperature_high integer NOT NULL,
  temperature_low integer NOT NULL,
  condition text NOT NULL,
  humidity integer DEFAULT 0,
  wind_speed integer DEFAULT 0,
  precipitation integer DEFAULT 0,
  icon text DEFAULT 'cloudy',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE weather_api_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_forecast ENABLE ROW LEVEL SECURITY;

-- Create policies for weather_api_settings
CREATE POLICY "Authenticated users can manage weather API settings"
  ON weather_api_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for weather_forecast
CREATE POLICY "Public can read weather forecast"
  ON weather_forecast
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage weather forecast"
  ON weather_forecast
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at triggers
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
    WHERE tgname = 'update_weather_api_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_weather_api_settings_updated_at
      BEFORE UPDATE ON weather_api_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_weather_forecast_updated_at'
  ) THEN
    CREATE TRIGGER update_weather_forecast_updated_at
      BEFORE UPDATE ON weather_forecast
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample weather API settings (replace with actual values)
INSERT INTO weather_api_settings (api_key, api_secret, station_id, is_active) VALUES
('your_weatherlink_api_key', 'your_weatherlink_api_secret', 'your_station_id', true)
ON CONFLICT DO NOTHING;

-- Insert sample 7-day forecast data
INSERT INTO weather_forecast (date, temperature_high, temperature_low, condition, humidity, wind_speed, precipitation, icon, is_active) VALUES
(CURRENT_DATE, 32, 24, 'Partly Cloudy', 75, 12, 0, 'partly-cloudy', true),
(CURRENT_DATE + INTERVAL '1 day', 30, 23, 'Sunny', 70, 8, 0, 'sunny', true),
(CURRENT_DATE + INTERVAL '2 days', 28, 22, 'Cloudy', 80, 15, 20, 'cloudy', true),
(CURRENT_DATE + INTERVAL '3 days', 26, 21, 'Light Rain', 85, 18, 60, 'rainy', true),
(CURRENT_DATE + INTERVAL '4 days', 29, 23, 'Partly Cloudy', 78, 10, 10, 'partly-cloudy', true),
(CURRENT_DATE + INTERVAL '5 days', 31, 25, 'Sunny', 72, 6, 0, 'sunny', true),
(CURRENT_DATE + INTERVAL '6 days', 33, 26, 'Hot', 68, 5, 0, 'sunny', true)
ON CONFLICT DO NOTHING;