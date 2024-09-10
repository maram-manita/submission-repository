import React, { useEffect, useState } from "react";
import axios from "axios";
const CountryProfile = ({ country }) => {
  const api_key = import.meta.env.VITE_WEATHER_KEY;
  const [weather, setWeather] = useState("");
  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {}, []);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <img
        style={{ width: "100px" }}
        src={country.flags.png}
        alt={country.flags.alt}
      />
      <p>
        <b>Capital:</b> {country.capital}
      </p>
      <p>
        <b>Area:</b> {country.area}m2
      </p>
      <h4>Languages</h4>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => (
          <li key={code}>{name}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          fetchWeather();
        }}
      >
        Get weather
      </button>
      {weather.main && (
        <div>
          <p>
            temperature {Math.floor(weather.main.temp - 273.15)} celsius, wind{" "}
            {weather.wind.speed} m/s
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
        </div>
      )}
    </div>
  );
};

export default CountryProfile;
