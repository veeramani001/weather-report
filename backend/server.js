require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }
  
  try {
    const response = await fetch(`${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'City not found' });
    }
    
    const data = await response.json();
    
    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp) + '°C',
      feelsLike: Math.round(data.main.feels_like) + '°C',
      range: Math.round(data.main.temp_min) + '° - ' + Math.round(data.main.temp_max) + '°C',
      humidity: data.main.humidity + '%',
      wind: Math.round(data.wind.speed) + ' km/h',
      condition: data.weather[0].main,
      detail: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

function getWeatherIcon(condition) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '💨',
    'Squall': '💨',
    'Tornado': '🌪️',
  };
  return icons[condition] || '🌤️';
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
