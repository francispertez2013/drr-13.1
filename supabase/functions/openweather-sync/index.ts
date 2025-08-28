import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpenWeatherCurrentResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: { all: number };
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: { speed: number };
    pop: number;
    dt_txt: string;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const API_KEY = '23a8e25f86655fb649c882839a57653b'
    const LAT = 13.0293
    const LON = 123.445

    // Fetch current weather from OpenWeatherMap
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
    
    const currentResponse = await fetch(currentWeatherUrl)
    
    if (!currentResponse.ok) {
      throw new Error(`OpenWeatherMap current weather API error: ${currentResponse.status}`)
    }

    const currentData: OpenWeatherCurrentResponse = await currentResponse.json()
    
    // Convert OpenWeatherMap condition to our format
    const weatherMain = currentData.weather[0]?.main.toLowerCase() || 'clear'
    let condition = 'sunny'
    
    switch (weatherMain) {
      case 'clear':
        condition = 'sunny'
        break
      case 'clouds':
        condition = currentData.clouds.all > 75 ? 'cloudy' : 'partly-cloudy'
        break
      case 'rain':
      case 'drizzle':
        condition = 'rainy'
        break
      case 'thunderstorm':
        condition = 'stormy'
        break
      default:
        condition = 'partly-cloudy'
    }

    // Generate weather alerts
    const alerts = []
    if (currentData.main.temp >= 35) alerts.push('Heat Warning: Extreme temperatures')
    if (currentData.wind.speed * 3.6 >= 50) alerts.push('High Wind Warning')
    if (weatherMain === 'thunderstorm') alerts.push('Thunderstorm Warning')

    // Update current weather data in database
    const { error: updateError } = await supabaseClient
      .from('weather_data')
      .upsert({
        temperature: Math.round(currentData.main.temp),
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round((currentData.visibility || 10000) / 1000), // Convert m to km
        condition,
        description: currentData.weather[0]?.description || 'Clear',
        location: 'Pio Duran, Albay',
        alerts,
        last_updated: new Date().toISOString(),
        is_active: true
      })

    if (updateError) {
      throw updateError
    }

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
    
    const forecastResponse = await fetch(forecastUrl)
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeatherMap forecast API error: ${forecastResponse.status}`)
    }

    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json()

    // Process forecast data - group by day and get daily highs/lows
    const dailyForecasts = new Map<string, any>()
    
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      const temp = item.main.temp
      const weatherMain = item.weather[0]?.main.toLowerCase() || 'clear'
      
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          temps: [temp],
          humidity: item.main.humidity,
          wind_speed: item.wind.speed * 3.6, // Convert m/s to km/h
          precipitation: item.pop * 100, // Convert to percentage
          weather: item.weather[0],
          clouds: 50 // Default clouds value
        })
      } else {
        const existing = dailyForecasts.get(date)
        existing.temps.push(temp)
      }
    })

    // Convert to our forecast format (5 days)
    const forecasts = []
    let dayCount = 0
    
    for (const [date, dayData] of dailyForecasts) {
      if (dayCount >= 5) break
      
      const temps = dayData.temps
      const weatherMain = dayData.weather.main.toLowerCase()
      
      let forecastCondition = 'sunny'
      let icon = 'sunny'
      
      switch (weatherMain) {
        case 'clear':
          forecastCondition = 'sunny'
          icon = 'sunny'
          break
        case 'clouds':
          forecastCondition = dayData.clouds > 75 ? 'cloudy' : 'partly-cloudy'
          icon = dayData.clouds > 75 ? 'cloudy' : 'partly-cloudy'
          break
        case 'rain':
        case 'drizzle':
          forecastCondition = 'rainy'
          icon = 'rainy'
          break
        case 'thunderstorm':
          forecastCondition = 'stormy'
          icon = 'stormy'
          break
        default:
          forecastCondition = 'partly-cloudy'
          icon = 'partly-cloudy'
      }

      forecasts.push({
        date,
        temperature_high: Math.round(Math.max(...temps)),
        temperature_low: Math.round(Math.min(...temps)),
        condition: dayData.weather.description,
        humidity: dayData.humidity,
        wind_speed: Math.round(dayData.wind_speed),
        precipitation: Math.round(dayData.precipitation),
        icon,
        is_active: true
      })
      
      dayCount++
    }

    // Clear existing forecast data and insert new
    await supabaseClient
      .from('weather_forecast')
      .update({ is_active: false })
      .eq('is_active', true)

    if (forecasts.length > 0) {
      const { error: forecastError } = await supabaseClient
        .from('weather_forecast')
        .insert(forecasts)

      if (forecastError) {
        console.error('Error inserting forecast data:', forecastError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          current: {
            temperature: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity,
            wind_speed: Math.round(currentData.wind.speed * 3.6),
            condition,
            description: currentData.weather[0]?.description,
            alerts
          },
          forecast: forecasts,
          last_updated: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('OpenWeatherMap sync error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})