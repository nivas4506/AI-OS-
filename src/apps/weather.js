// ============================================
// App: Weather
// ============================================

export function createWeather(container) {
    const forecasts = [
        { day: 'Mon', icon: '☀️', temp: '24°' },
        { day: 'Tue', icon: '⛅', temp: '22°' },
        { day: 'Wed', icon: '🌤️', temp: '23°' },
        { day: 'Thu', icon: '🌧️', temp: '18°' },
        { day: 'Fri', icon: '⛈️', temp: '16°' },
        { day: 'Sat', icon: '🌤️', temp: '21°' },
        { day: 'Sun', icon: '☀️', temp: '25°' },
    ];

    container.innerHTML = `
    <div class="app-weather">
      <div class="weather-current">
        <div class="weather-icon">🌤️</div>
        <div class="weather-temp">22°C</div>
        <div class="weather-desc">Partly Cloudy</div>
        <div class="weather-location">📍 San Francisco, CA</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail-card">
          <div class="weather-detail-value">45%</div>
          <div class="weather-detail-label">Humidity</div>
        </div>
        <div class="weather-detail-card">
          <div class="weather-detail-value">12 km/h</div>
          <div class="weather-detail-label">Wind</div>
        </div>
        <div class="weather-detail-card">
          <div class="weather-detail-value">UV 5</div>
          <div class="weather-detail-label">UV Index</div>
        </div>
      </div>
      <div class="weather-forecast">
        ${forecasts.map(f => `
          <div class="forecast-item">
            <div class="forecast-day">${f.day}</div>
            <div class="forecast-icon">${f.icon}</div>
            <div class="forecast-temp">${f.temp}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
