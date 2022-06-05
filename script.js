
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".fetch-section .cities");

const apiKeyOpenWeather = '4d8fb5b93d4af21d66a2948710284366';
const apiKeyWeatherApi = '0d7fd0a1287642beaf493432220205';
const apiKeyWeatherStack = '75adccd692aa942ed88d0d8d88cac588';
const apiKeyWeatherBit = '63e0fbad419a4763a260f073a7bfbd69';

input.addEventListener('keydown', function(e){
  if( e.key.match(/[0-9]/) ) return this.preventDefault();
});

input.addEventListener('input', function(e){
  this.value = this.value.replace(/[0-9]/g, "");
});

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;
  list.innerHTML = "";

  const urlOpenWeather = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKeyOpenWeather}&units=metric`;
  //Open weather запрос
  (async function openWeatherAPICall(){
      fetch(urlOpenWeather)
      .then(response => response.json())
      .then(data => {
        const { main, name, sys, weather, wind } = data;

        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
        }.svg`;

        const li = createWeatherCard({
          source_name: "Open Weather API",
          href: "https://openweathermap.org/",
          city_name: name,
          country: sys.country,
          icon: icon,
          description: weather[0]["description"],
          temperature: main.temp,
          humidity: main.humidity,
          pressure: main.pressure,
          wind: wind.speed
        });

        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Enter the correct city name";
      });
  })();

  function createWeatherCard(data){
    const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${data.city_name},${data.country}">
          <a href="${data.href}" target="_blank">${data.source_name}</a>
          <span>${data.city_name}</span>
          <sup>${data.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(data.temperature)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${data.icon}" alt="${
        data.description
      }">
          <figcaption>${data.description}</figcaption>
        </figure>
        <div>
          Humidity: ${Math.round(data.humidity)}%
        </div>
        <div>
          Pressure(sea level): ${Math.round(data.pressure/1.333)} mm
        </div>
        <div>
          Wind speed: ${Math.round(data.wind/(data.wind_units == 'm/h'?2.237:data.wind_units == 'k/h'?3.1:1))} m/s
        </div>
      `;
      li.innerHTML = markup;
      return li;
  }

  const urlWeatherApi = `http://api.weatherapi.com/v1/current.json?key=${apiKeyWeatherApi}&q=${inputVal}&aqi=no`;  
  //Weather API запрос
  (async function weatherAPICall() {
    fetch(urlWeatherApi)
      .then(response => response.json())
      .then(data => {
        const { location, current } = data;
        const icon = `${current.condition.icon}`;

        const li = createWeatherCard({
          source_name: "Weather API",
          href: "https://www.weatherapi.com/",
          city_name: location.name,
          country: location.country,
          icon: icon,
          description: current.condition.text,
          temperature: current.temp_c,
          humidity: current.humidity,
          pressure: current.pressure_mb,
          wind: current.wind_mph,
          wind_units: "m/h"
        });

        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Enter the correct city name";
      });
  })();

    const urlWeatherStack = `http://api.weatherstack.com/current?access_key=${apiKeyWeatherStack}&query=${inputVal}`;

    (async function weatherStackAPICall() {
      //Weather Stack API запрос
      fetch(urlWeatherStack)
      .then(response => response.json())
      .then(data => {

        const { request, location, current } = data;
        const icon = `${current.weather_icons[0]}`;

        const li = createWeatherCard({
          source_name: "Weather Stack API",
          href: "https://weatherstack.com/",
          city_name: location.name,
          country: location.country,
          icon: icon,
          description: current.weather_descriptions[0],
          temperature: current.temperature,
          humidity: current.humidity,
          pressure: current.pressure,
          wind: current.wind_speed,
          wind_units: "k/h"
        });

        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Enter the correct city name";
      });
  })();

  //WeatherBit запрос
  const urlWeatherBit = `https://api.weatherbit.io/v2.0/current?key=${apiKeyWeatherBit}&city=${inputVal}`;

  (async function weatherBitAPICall() {
    fetch(urlWeatherBit)
    .then(response => response.json())
    .then(data => {
        const info = data.data[0];
        const icon = `https://www.weatherbit.io/static/img/icons/${info.weather.icon}.png`;

        const li = createWeatherCard({
          source_name: "WeatherBit API",
          href: "https://www.weatherbit.io/",
          city_name: info.city_name,
          country: info.country_code,
          icon: icon,
          description: info.weather.description,
          temperature: info.temp,
          humidity: info.rh,
          pressure: info.slp,
          wind: info.wind_spd
        });

        list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Enter the correct city name";
    });
  })();

  msg.textContent = "";
  form.reset();
  input.focus();
});