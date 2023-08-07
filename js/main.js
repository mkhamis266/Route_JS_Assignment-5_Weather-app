const weatherAPI_Key = "5f5fb4371d9e44cd98773112233007";
const LocationIQToken = "pk.b183d65f98b0edcd4c017444842b07a6";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const changeLocationButton = document.querySelector(".change-location");

const dayNameElement = document.querySelector(".day-name");
const dateElement = document.querySelector(".date");
const cityElement = document.querySelector(".city");
const weatherIconImg = document.querySelector(".weather-icon img");
const temperatureElement = document.querySelector(".temperature .degree");
const conditionElement = document.querySelector(".condition");
const precipitationElement = document.querySelector(".precipitation");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const futureDays = Array.from(document.querySelectorAll(".day"));

let cityName;

function loadCoordinates() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    const lat = crd.latitude.toString();
    const lng = crd.longitude.toString();
    const coordinates = [lat, lng];
    return coordinates;
  }

  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve(success(position));
      },
      function (err) {
        reject(err);
      },
      options
    );
  });
}

async function loadCity(coordinates) {
  const lat = coordinates[0];
  const lng = coordinates[1];
  const data = await fetch("https://us1.locationiq.com/v1/reverse.php?key=" + LocationIQToken + "&lat=" + lat + "&lon=" + lng + "&format=json");
  const response = await data.json();
  return response.address.city.toLowerCase();
}


async function loadCurrentWeather(cityName){
  const data = await fetch("http://api.weatherapi.com/v1/forecast.json?key=" + weatherAPI_Key + "&q=" + cityName + "&days=4&aqi=no&alerts=no");
  return await data.json();
}

loadCoordinates()
  .then((coords) => loadCity(coords))
  .then((cityName) => loadCurrentWeather(cityName))
  .then((weather) => {
    const lastUpdate = new Date(weather.current.last_updated);
    const weatherInfo = {
      date: lastUpdate.toDateString(),
      dayName: weekdays[lastUpdate.getDay()],
      location: `${weather.location.name}, ${weather.location.country}`,
      icon: weather.current.condition.icon,
      temperature: Math.ceil(weather.current.temp_c),
      conditionText: weather.current.condition.text,
      precipitation: Math.ceil(weather.current.precip_in),
      humidity: Math.ceil(weather.current.humidity),
      wind: Math.ceil(weather.current.wind_kph),
    };
    render(weatherInfo);
    handleFutureDays(weather.forecast.forecastday);
  });

function render(weatherInfo) {
  dateElement.innerHTML = weatherInfo.date;
  dayNameElement.innerHTML = weatherInfo.dayName;
  cityElement.innerHTML = weatherInfo.location;
  weatherIconImg.src = weatherInfo.icon;
  conditionElement.innerHTML = weatherInfo.conditionText;
  temperatureElement.innerHTML = weatherInfo.temperature;
  precipitationElement.innerHTML = weatherInfo.precipitation;
  humidityElement.innerHTML = weatherInfo.humidity;
  windElement.innerHTML = weatherInfo.wind;
}

function handleFutureDays(forecastdays) {
  for (let i = 0; i < futureDays.length; i++) {
    let dayDate = new Date(forecastdays[i].date);
    futureDays[i].innerHTML = `
    <div class="weather-img d-flex justify-content-center p-1">
      <img src="${forecastdays[i].day.condition.icon}" class="img-fluid" alt="" />
    </div>
    <h6 class="fw-bold">${weekdays[dayDate.getDay()].slice(0, 3)}</h6>
    <h6 class="fw-bold"><span class="degree">${Math.ceil(forecastdays[i].day.avgtemp_c)}</span> <sup>o</sup>C</h6>
    `;
    futureDays[i].addEventListener("click", function () {
      handleSelectedDay(futureDays[i], forecastdays[i]);
    });
  }
}

changeLocationButton.addEventListener("click", function () {
  cityName = document.querySelector(".change-city-form input").value;
  loadCurrentWeather(cityName).then((weather) => {
    const lastUpdate = new Date(weather.current.last_updated);
    const weatherInfo = {
      date: lastUpdate.toDateString(),
      dayName: weekdays[lastUpdate.getDay()],
      location: `${weather.location.name}, ${weather.location.country}`,
      icon: weather.current.condition.icon,
      temperature: Math.ceil(weather.current.temp_c),
      conditionText: weather.current.condition.text,
      precipitation: Math.ceil(weather.current.precip_in),
      humidity: Math.ceil(weather.current.humidity),
      wind: Math.ceil(weather.current.wind_kph),
    };
    render(weatherInfo);
    handleFutureDays(weather.forecast.forecastday);
  });
});

function handleSelectedDay(weekday, forecastday) {
  futureDays.forEach((day) => day.classList.remove("active"));
  weekday.classList.add("active");
  let dayDate = new Date(forecastday.date);
  const weatherInfo = {
    date: dayDate.toDateString(),
    dayName: weekdays[dayDate.getDay()],
    location: cityName,
    icon: forecastday.day.condition.icon,
    temperature: Math.ceil(forecastday.day.avgtemp_c),
    conditionText: forecastday.day.condition.text,
    precipitation: Math.ceil(forecastday.day.totalprecip_in),
    humidity: Math.ceil(forecastday.day.avghumidity),
    wind: Math.ceil(forecastday.day.avgvis_km),
  };
  render(weatherInfo);
}
