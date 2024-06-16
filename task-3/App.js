import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: '', lon: '' });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchWeatherData(location.lat, location.lon);
    }
  }, [location]);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get('http://localhost:5000/api/weather', {
        params: { lat, lon },
      });

      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      {weatherData ? (
        <div>
          <h2>Location: {weatherData.city.name}</h2>
          <div className="weather-list">
            {weatherData.list.slice(0, 5).map((forecast, index) => (
              <div key={index} className="weather-item">
                <h3>{new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                <p>Temperature: {forecast.main.temp} °C</p>
                <p>Weather: {forecast.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default App;
