/*
  # Fix Weather Data Table - Add Missing Alerts Column

  1. Updates
    - Add alerts column to weather_data table if it doesn't exist
    - Ensure proper data types and constraints
    - Update existing records with empty alerts array

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity
*/

-- Add alerts column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'weather_data' AND column_name = 'alerts'
  ) THEN
    ALTER TABLE weather_data ADD COLUMN alerts text[] DEFAULT '{}';
    
    -- Update existing records to have empty alerts array
    UPDATE weather_data SET alerts = '{}' WHERE alerts IS NULL;
    
    RAISE NOTICE 'Added alerts column to weather_data table';
  ELSE
    RAISE NOTICE 'Alerts column already exists in weather_data table';
  END IF;
END $$;

-- Ensure weather_api_settings table exists and has sample data
DO $$
BEGIN
  -- Check if weather_api_settings table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'weather_api_settings'
  ) THEN
    -- Check if there are any active settings
    IF NOT EXISTS (
      SELECT 1 FROM weather_api_settings WHERE is_active = true
    ) THEN
      -- Insert sample settings if none exist
      INSERT INTO weather_api_settings (
        api_key, 
        api_secret, 
        station_id, 
        is_active,
        last_sync
      ) VALUES (
        'sample_api_key_replace_with_real',
        'sample_api_secret_replace_with_real', 
        'sample_station_id_replace_with_real',
        true,
        now()
      );
      
      RAISE NOTICE 'Added sample weather API settings - please update with real credentials';
    END IF;
  END IF;
END $$;

-- Ensure weather_data table has at least one record
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM weather_data WHERE is_active = true
  ) THEN
    INSERT INTO weather_data (
      temperature, 
      humidity, 
      wind_speed, 
      visibility, 
      condition, 
      description, 
      location, 
      alerts, 
      is_active
    ) VALUES (
      28, 
      75, 
      12, 
      10, 
      'partly-cloudy', 
      'Partly Cloudy', 
      'Pio Duran, Albay', 
      '{}', 
      true
    );
    
    RAISE NOTICE 'Added default weather data record';
  END IF;
END $$;

-- Ensure weather_forecast table has data for the next 7 days
DO $$
BEGIN
  -- Clear old forecast data
  DELETE FROM weather_forecast WHERE date < CURRENT_DATE;
  
  -- Check if we have forecast data for today and the next 6 days
  IF (SELECT COUNT(*) FROM weather_forecast WHERE is_active = true AND date >= CURRENT_DATE) < 7 THEN
    -- Clear existing forecast and insert new 7-day forecast
    UPDATE weather_forecast SET is_active = false WHERE is_active = true;
    
    INSERT INTO weather_forecast (date, temperature_high, temperature_low, condition, humidity, wind_speed, precipitation, icon, is_active) VALUES
    (CURRENT_DATE, 31, 23, 'Partly Cloudy', 78, 8, 10, 'partly-cloudy', true),
    (CURRENT_DATE + INTERVAL '1 day', 29, 22, 'Sunny', 72, 6, 0, 'sunny', true),
    (CURRENT_DATE + INTERVAL '2 days', 27, 21, 'Light Rain', 85, 15, 70, 'rainy', true),
    (CURRENT_DATE + INTERVAL '3 days', 28, 22, 'Cloudy', 80, 12, 30, 'cloudy', true),
    (CURRENT_DATE + INTERVAL '4 days', 30, 24, 'Partly Cloudy', 75, 10, 5, 'partly-cloudy', true),
    (CURRENT_DATE + INTERVAL '5 days', 32, 25, 'Sunny', 70, 5, 0, 'sunny', true),
    (CURRENT_DATE + INTERVAL '6 days', 30, 23, 'Partly Cloudy', 75, 8, 0, 'partly-cloudy', true);
    
    RAISE NOTICE 'Added 7-day weather forecast data';
  END IF;
END $$;