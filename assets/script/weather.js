var cities = [];
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector(".forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var fiveDayForeCast = document.querySelector("#fiveDayForeCast");
var searchButtonEl = document.querySelector("#searchButton");
var firstForecast = document.querySelector("#firstForecast");

var formSumbitHandler = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  console.log(city);
  if (city) {
    getWeather(city);
    get5day(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a City!");
  }
  saveSearch();
};
// Saves search history in local storage
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};
// got api from https://home.openweathermap.org/api_keys
var getWeather = function (city) {
  var weatherKey = "8371b4ee50d39272992fca3c8540eb68";
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherKey}`;

  fetch(weatherUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);

      var card = document.createElement("div");
      var cardBody = document.createElement("div");
      var cityName = document.createElement("h2");
      var cityTemp = document.createElement("p");
      var cityWind = document.createElement("p");
      var cityHumidity = document.createElement("p");
      var cityUvIndex = document.createElement("p");

      cityName.textContent = data.name;
      cityTemp.textContent = `Temp: ${data.main.temp} °F`;
      cityWind.textContent = `Wind Speed: ${data.wind.speed} MPH`;
      cityHumidity.textContent = `Humidity: ${data.main.humidity} %`;
      cityUvIndex.textContent = `Uv Index: ${(data.coord.lon, data.coord.lat)}`;

      cardBody.append(cityName, cityTemp, cityWind, cityHumidity, cityUvIndex);
      card.append(cardBody);
      firstForecast.append(card);

      card.setAttribute("class", "card");
      cardBody.setAttribute("class", "card-body");

      //cityUvIndex(data.coord.lon, data.coord.lat);
      //cityUvIndex.textContent = `Uv: ${data.coord.lon, data.coord.lat}`;
      //whatItisbeingappended to.append(what is being appended);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      cityUvIndex(lat, lon);
    });
  });
};

//seperate api call
var cityUvIndex = function (lat, lon) {
  var weatherKey = "8371b4ee50d39272992fca3c8540eb68";
  var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherKey}`;

  fetch(weatherUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      cityUvIndex(data);
      //console.log(data)
    });
  });
  //console.log(lat);
  //console.log(lon);
};

var get5day = function (city) {
  var weatherKey = "8371b4ee50d39272992fca3c8540eb68";
  var weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherKey}`;

  fetch(weatherURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

// display 5 days ----
var display5day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];
    //tried to replicate from above method
    var forecastEl = document.createElement("div");
    var forecastDate = document.createElement("h5");
    var forecastTempEl = document.createElement("p");
    var forecastHumEl = document.createElement("p");

    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    forecastTempEl.textContent = dailyForecast.main.temp + " °F";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastDate, forecastTempEl, forecastHumEl);
    forecastContainerEl.appendChild(forecastEl);
    fiveDayForeCast.appendChild(forecastContainerEl);

    card.setAttribute("class", "forestContainerEl");
    cardBody.setAttribute("class", "card-body");
  }
};

searchButtonEl.addEventListener("click", formSumbitHandler);