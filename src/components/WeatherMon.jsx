import React, { useState, useEffect } from "react";
import axios from "axios";
import RainIcon from "../assests/rainy-day.png";
import Clouds from "../assests/clouds.png";
import Moderate from "../assests/Moderate.png";
import Snow from "../assests/snowy.png";
import Clear from "../assests/contrast.png";

export default function WeatherMon() {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "CHENNAI";
  });

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [triggerValue, setTriggerValue] = useState("");
  const [displayTrigger, setDisplayTrigger] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [currentTemp, setCurrentTemp] = useState(null); // Track current temperature
  const [previousTemp, setPreviousTemp] = useState(null); // Track previous temperature

  const cities = ["CHENNAI", "BENGALURU", "MUMBAI", "KOLKATA", "DELHI", "HYDERABAD"];

  const handleTriggerChange = (event) => {
    setTriggerValue(event.target.value);
  };

  const handleClick = () => {
    if (triggerValue) {
      setDisplayTrigger(triggerValue);
      alert(`Value stored: ${triggerValue}`);
      localStorage.setItem("storedValue", triggerValue);
      setTriggerValue("");
    }
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("storedValue");
    if (storedValue) {
      setDisplayTrigger(storedValue);
    }
  }, []);

  const apiKey = "6775eecd82d4d9f0bf485144b5f12ac2";

  const fetchWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await axios.get(apiUrl);
      const temp = Math.round(response.data.main.temp);
      console.log("Api connected Succesfully")

      // Update previous temperature to current, and current temperature to the new fetched temperature
      setPreviousTemp(currentTemp);
      setCurrentTemp(temp);

      setWeatherData(response.data);
      setTimestamp(convertTimestamp(response.data.dt));

      // Check if both current and previous temperatures exceed the trigger value
      if (previousTemp && displayTrigger && temp > displayTrigger && previousTemp > displayTrigger) {
        setAlertMessage(
          `The temperature has exceeded your threshold (${displayTrigger}°C) in ${selectedCity}. Current temp: ${temp}°C.`
        );
      } else {
        setAlertMessage(""); // Reset the alert message if within the threshold
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const convertTemp = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };

  const toggleTempUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return Clear;
      case "Rain":
        return RainIcon;
      case "Snow":
        return Snow;
      case "Clouds":
        return Clouds;
      case "Drizzle":
      case "Mist":
        return Moderate;
      default:
        return RainIcon;
    }
  };

  const fetchForecastData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const dailyData = processForecastData(response.data.list);
      setForecastData(dailyData);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  const convertTimestamp = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString();
  };

  const processForecastData = (data) => {
    const dailyForecast = [];
    for (let i = 0; i < data.length; i += 8) {
      const dailyTemps = data.slice(i, i + 8);
      const day = new Date(dailyTemps[0].dt * 1000).toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );
      const minTemp = Math.min(...dailyTemps.map((item) => item.main.temp_min));
      const maxTemp = Math.max(...dailyTemps.map((item) => item.main.temp_max));
      const avgTemp =
        dailyTemps.reduce((acc, item) => acc + item.main.temp, 0) /
        dailyTemps.length;
      const condition = dailyTemps[0].weather[0].description;
      const avgHumidity =
        dailyTemps.reduce((acc, item) => acc + item.main.humidity, 0) /
        dailyTemps.length;
      const windSpeed =
        dailyTemps.reduce((acc, item) => acc + item.wind.speed, 0) /
        dailyTemps.length;

      dailyForecast.push({
        day,
        minTemp,
        maxTemp,
        avgTemp,
        avgHumidity,
        windSpeed,
        condition,
        decision: condition.includes("rain")
          ? "Carry an umbrella"
          : "No umbrella needed",
      });
    }
    localStorage.setItem("dailyWeather", JSON.stringify(dailyForecast));

    return dailyForecast;
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
    fetchForecastData(selectedCity);

    const updateWeather = setInterval(() => {
      fetchWeatherData(selectedCity);
      fetchForecastData(selectedCity);
      // console.log("data retrived", selectedCity)

    }, 300000);

    return () => {
      clearInterval(updateWeather);
    };
  }, [selectedCity, displayTrigger]);

  useEffect(() => {
    const storedForecastData = localStorage.getItem("dailyWeather");
    if (storedForecastData) {
      setForecastData(JSON.parse(storedForecastData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
  }, [selectedCity]);

  const openMsg = () => {
    document.querySelector(".alert-box").style.display = "block";
  };

  const closeMsg = () => {
    document.querySelector(".alert-box").style.display = "none";
  };

  return (
    <div className="container ">
      <div className="row d-flex justify-content-center">
        {/* Weather Data Section */}
        <div className="col-12 trigger-alert mt-3 ms-5 d-flex">
          <div className="col-8">
            <label htmlFor="">Alert: </label>
            <input
              className="ms-3 mt-3"
              type="text"
              placeholder="type trigger value..."
              onChange={handleTriggerChange}
              value={triggerValue}
            />
            <button className="alert-btn ms-3" onClick={handleClick}>
              Enter
            </button>
            <button className="btn btn-primary ms-3" onClick={toggleTempUnit}>{isCelsius ? "Fahrenheit" : "celsius"}</button>
          </div>
          <div className="col-4 text-center my-3 me-5">
            <p>
              <i
                className="fs-2 bx bxs-bell"
                onClick={openMsg}
                style={{ cursor: "pointer" }}
              ></i>
              <span className="alert-msg">{alertMessage ? 1 : 0}</span>
            </p>
            <div
              className="alert-box px-3"
              style={{ backgroundColor: "#fff", display: "none" }}
            >
              <div className="d-flex mt-3">
                <h5 className="">Alert</h5>
                <p
                  className=""
                  style={{ marginLeft: "17rem", cursor: "pointer" }}
                  onClick={closeMsg}
                >
                  <i className="bx bx-x fs-3"></i>
                </p>
              </div>
              <hr />
              {alertMessage ? (
                <p style={{ color: "red" }}>{alertMessage}</p>
              ) : (
                <p>No temperature alerts at the moment.</p>
              )}{" "}
              <hr />
            </div>
          </div>
        </div>
        <div className="col-4 mt-4 weather-data">
          <div className="d-flex">
            <h5>My Weather App</h5>
            <div className="dropdown ms-5">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Select City
              </button>
              <ul className="dropdown-menu">
                {cities.map((city, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item"
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3">
            <h6>Alert Limit : {displayTrigger}</h6>
          </div>
          {weatherData ? (
            <div>
              <h2 className="text-center mt-3">
                {weatherData.weather[0].description.toUpperCase()}
              </h2>
              <div
                className="rain-img d-flex justify-content-center"
                style={{ marginTop: "20px" }}
              >
                <img
                  src={getWeatherIcon(weatherData.weather[0].main)}
                  alt={weatherData.weather[0].description}
                  style={{ width: "180px", height: "150px" }}
                />
              </div>
              <div className="weather-info text-center mt-3">
              <h3>{convertTemp(Math.round(weatherData.main.temp))} °{isCelsius ? "C" : "F"}</h3>
              <h3 className="text-warning">{selectedCity}</h3>
                <h6>IN</h6>
                <div className="d-flex justify-content-center mt-4">
                  <h6>
                    Feels Like
                    <br />
                    <span style={{ fontSize: "16px" }}>
                      {Math.round(weatherData.main.feels_like)} °C
                    </span>
                  </h6>
                  <h6 className="ms-5">
                    Time <br />
                    {timestamp}
                  </h6>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>

        {/* Daily Weather Update Section */}

        <div className="col-8 weather-daily-update mt-4 ms-5">
          <h3 className="my-2">Daily Weather Update</h3>
          <h5 style={{ color: "#008000" }}>City: {selectedCity}</h5>
          {forecastData.length > 0 ? (
            forecastData.map((item, index) => (
              <div className="card mb-3" key={index}>
                <div className="d-flex mt-2">
                  <h4 className="d-flex ms-3">{item.day}</h4>
                  <p className="daily-degree fw-bold">
                  {/* <h3>{convertTemp(Math.round(weatherData.main.temp))} °{isCelsius ? "C" : "F"}</h3> */}

                    {convertTemp(Math.round(item.avgTemp))} °{isCelsius ? "C" : "F"}
                  </p>
                </div>
                <div className="weather-icon ms-3 d-flex">
                  <img
                    src={
                      item.condition.includes("clear")
                        ? Clear
                        : item.condition.includes("rain")
                        ? RainIcon
                        : item.condition.includes("snow")
                        ? Snow
                        : item.condition.includes("Mist")
                        ? Moderate
                        : item.condition.includes("Drizzle")
                        ? Moderate
                        : RainIcon
                    } // Change icon based on condition
                    alt={item.condition}
                    className=""
                    style={{ width: "50px", height: "40px" }}
                  />
                  <h6 className="ms-5">
                    Humidity: {Math.round(item.avgHumidity)}%
                  </h6>{" "}
                  <h6 className="ms-5">
                    Wind: {Math.round(item.windSpeed * 3.6)} km/h
                  </h6>{" "}
                </div>
                <div className="calculate-values mt-3">
                  <ul className="d-flex">
                    <li>Min Temp: {convertTemp(Math.round(item.minTemp))} °{isCelsius ? "C" : "F"}</li>
                    <li className="ms-3">
                      Max Temp: {convertTemp(Math.round(item.maxTemp))} °{isCelsius ? "C" : "F"}
                    </li>
                    <li className="ms-3">
                      Avg Temp: {convertTemp(Math.round(item.avgTemp))} °{isCelsius ? "C" : "F"}
                    </li>{" "}
                    <li className="ms-3">
                      Dominant Condition: {item.condition}
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>Loading forecast data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
