import getWeatherData from "./utils/httpReq.js";
import { removeModal, showModal } from "./utils/modal.js";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const modalButton = document.getElementById("modal-button");
const loaderButton = document.getElementById("loader");

const renderCurrentWeather = (data) => { 
  if (!data) return;
  const weatherJSX = `
  <h1>${data.name}, ${data.sys.country}</h1>

  <div id="second">
    <img alt="Weather Icon" src="https://api.openweathermap.org/img/w/${
      data.weather[0].icon
    }"/>
    <span>${data.weather[0].main}</span>
    <span>${Math.round(data.main.temp)}°C</span>
  </div>

  <div id="third">
    <span>Humidity: ${data.main.humidity}%</span>
    <span>Wind Speed: ${data.wind.speed}m/s</span>
  </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
      <div>
        <img alt="Weather Icon" src="https://api.openweathermap.org/img/w/${
          i.weather[0].icon
        }"/>
        <h3>${getWeekDay(i.dt)}</h3>
        <p>${Math.round(i.main.temp)}°C</p>
        <span>${i.weather[0].main}</span>
      </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    showModal("please enter a city name");
    return;
  }

  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const currentData = await getWeatherData("current", position.coords);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  showModal(error.message);
};

const loactionHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("your browser does not support geolocation");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "tehran");
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", "tehran");
  renderForecastWeather(forecastData);
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", loactionHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
