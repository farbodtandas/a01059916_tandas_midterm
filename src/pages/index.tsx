import Image from "next/image";

import { use, useState } from "react";

export default function Home() {

  const [showCityName, setShowCityName] = useState(false);
  const [showAdditionalDiv, setShowAdditionalDiv] = useState(false);
  const [city, setCity] = useState("");

  function responseLog() {
    fetchCurrentWeather(city).then((response) => {
      setCurrentWeather(response)
      setShowCityName(true);
      setShowAdditionalDiv(true);
    })
    fetchWeatherForecast(city).then((response) => {
      setWeatherForecast(response)
    })
  }

  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherResponse>();
  const [weatherForecast, setWeatherForecast] = useState<ForecastWeatherResponse>();


  return (
    <div>
      <main style={{
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minWidth: 400,
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: "30px",
          justifyContent: "space-evenly",
          minWidth: 400,
        }}>
          <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
            <h1 style={{ fontFamily: "monospace", fontSize: "36px", }}>Farby Weather</h1>
            <img src="/images/logo.png" style={{width:"160px", }} alt="logo" />
          </div>
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
          }}>
            <input placeholder="search location" type="text" value={city} onChange={e => setCity(e.target.value)} style={{
              width: "200px",
              height: "20px",
              minHeight: "20px",
              minWidth: 150,
              padding: "10px",
              fontSize: "16px",
              borderRadius: "15px 0px 0px 15px",
              borderWidth: "3px",
              borderColor: "black",
            }}></input>
            <button onClick={responseLog} style={{
              width: "80px",
              height: "46px",
              minHeight: 40,
              minWidth: 60,
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#343434",
              borderRadius: "0px 15px 15px 0px",
              borderColor:"black",
              color: "white",
            }}>Search</button>
          </div>
        </div>
        <div style={{ marginTop: "30px" }}>
          {showCityName && <h1 style={{ textTransform: "capitalize" }}>{city}</h1>}
        </div>
        {showAdditionalDiv && (<div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          padding: 20,
          borderRadius: 20,
          width: "80vmax",
          height: "10vmax",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 50,
          marginTop: 50,
          backgroundColor: "#B9E2A7",
        }}>
          <p style={{ fontSize: "20px" }}>{currentWeather?.dt ? new Date(currentWeather?.dt * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ""}</p>
          {currentWeather?.weather[0].main && (
            <div>
              {currentWeather?.weather[0].main === "Clouds" && <img src="/images/cloudy.png" width={200} alt="Cloudy" />}
              {currentWeather?.weather[0].main === "Clear" && <img src="/images/sunny.png" width={300} alt="Clear" />}
              {currentWeather?.weather[0].main === "Rain" && <img src="/images/rainy.png" width={200} alt="Rainy" />}
              {currentWeather?.weather[0].main === "Snow" && <img src="/images/snowy.png" width={200} alt="Snowy" />}
            </div>
          )}
          <h4 style={{ fontSize: "20px" }}>{currentWeather?.weather[0].main}</h4>
          <h4 style={{ fontSize: "20px" }}>{currentWeather?.main.temp.toFixed(1)}°C</h4>
          <h4 style={{ fontSize: "20px" }}>{currentWeather?.wind.speed}km/h</h4>
        </div>)}
        <div>
          <div>
            {showCityName && <h1>5 Day Forecast</h1>}
          </div>
          {weatherForecast?.list.slice(0, 5).map((item, index) => (
            <div key={index} style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              padding: 20,
              borderRadius: 20,
              width: "80vmax",
              height: "10vmax",
              alignItems: "center",
              textAlign: "center",
              marginBottom: 20,
              backgroundColor: "skyblue",
            }}>
              <p style={{ fontSize: "20px" }}>{new Date(new Date().getTime() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
              {item.weather[0].main && (
                <div>
                  {item.weather[0].main === "Clouds" && <img src="/images/cloudy.png" width={200} alt="Cloudy" />}
                  {item.weather[0].main === "Clear" && <img src="/images/sunny.png" width={320} alt="Clear" />}
                  {item.weather[0].main === "Rain" && <img src="/images/rainy.png" width={200} alt="Rainy" />}
                  {item.weather[0].main === "Snow" && <img src="/images/snowy.png" width={200} alt="Snowy" />}
                </div>
              )}
              <div>
                <h4 style={{ fontSize: "20px" }}>{item.weather[0].main}</h4>
                <h4 style={{ fontSize: "18px", textTransform: "capitalize" }}>{item.weather[0].description}</h4>
              </div>
              <h4 style={{ fontSize: "20px" }}>{item.main.temp.toFixed(1)}°C</h4>
              <h4 style={{ fontSize: "20px" }}>{item.wind.speed}km/h</h4>
            </div>
          ))}
        </div>
        <footer style={{ position: "static", bottom: "0", }}>
          <h5>© 2024 Farbod Tandas</h5>
        </footer>
      </main>
    </div>
  );
}

interface CurrentWeatherResponse {
  weather: [
    {
      main: string;
      description: string;
    }
  ];
  main: {
    temp: number;
  };
  wind: {
    speed: number;
  };
  dt: number;
}

async function fetchCurrentWeather(city: string): Promise<CurrentWeatherResponse> {
  const apiKey = '21f2119d8c6a59dc8e08249a42bb3aa5';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data: CurrentWeatherResponse = await response.json();
  return data;
}

interface ForecastWeatherResponse {
  list: [
    {
      main: {
        temp: number;
      };
      weather: [
        {
          main: string;
          description: string;
        }
      ];
      wind: {
        speed: number;
      };
      dt_txt: string;
    }
  ];
}

async function fetchWeatherForecast(city: string): Promise<ForecastWeatherResponse> {
  const apiKey = '21f2119d8c6a59dc8e08249a42bb3aa5';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  const data: ForecastWeatherResponse = await response.json();
  return data;
}