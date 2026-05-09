import { useState } from 'react';
import './App.css';

const defaultWeather = {
  city: 'San Francisco',
  temperature: '22°',
  feelsLike: '21°',
  range: '18° - 25°',
  humidity: '62%',
  wind: '13 km/h',
  condition: 'Sunny',
  detail: 'Clear skies with a crisp breeze',
  icon: '☀️',
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(defaultWeather);
  const [status, setStatus] = useState('Enter a city and see the forecast.');

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      setStatus('Please enter a city name.');
      return;
    }

    setStatus('Loading weather data...');
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        setStatus('City not found. Please try another.');
        return;
      }
      
      const data = await response.json();
      setWeather(data);
      setStatus(`Forecast updated for ${data.city}.`);
      setQuery('');
    } catch (error) {
      setStatus('Error fetching weather. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <main className="dashboard-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Weather Studio</span>
            <h1>Classy weather, built for every mood.</h1>
            <p>
              A sleek dashboard for looking up cities, reviewing the forecast, and staying ahead of the day.
            </p>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, e.g. Paris"
                aria-label="City search"
              />
              <button type="submit">Check Forecast</button>
            </form>
            <p className="status-note">{status}</p>
          </div>
          <div className="weather-highlight">
            <div className="weather-headline">
              <span className="weather-icon">{weather.icon}</span>
              <div>
                <p className="weather-condition">{weather.condition}</p>
                <p className="weather-city">{weather.city}</p>
              </div>
            </div>
            <div className="temperature-display">{weather.temperature}</div>
            <p className="weather-detail">{weather.detail}</p>
          </div>
        </section>

        <section className="forecast-panel">
          <div className="panel-header">
            <div>
              <p className="panel-title">Today’s snapshot</p>
              <p className="panel-subtitle">Clean, elegant weather insights.</p>
            </div>
            <span className="status-pill">Live</span>
          </div>

          <div className="weather-grid">
            <article className="metric-card">
              <span className="metric-title">Feels Like</span>
              <strong>{weather.feelsLike}</strong>
            </article>
            <article className="metric-card">
              <span className="metric-title">Temperature Range</span>
              <strong>{weather.range}</strong>
            </article>
            <article className="metric-card">
              <span className="metric-title">Humidity</span>
              <strong>{weather.humidity}</strong>
            </article>
            <article className="metric-card">
              <span className="metric-title">Wind</span>
              <strong>{weather.wind}</strong>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
