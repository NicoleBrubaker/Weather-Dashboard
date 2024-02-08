var forecastDate = document.getElementById("card-date");
var clearSearches = document.getElementById("clearSearches");
var weatherIcon = document.getElementById("weather-icon");

// Fetching the weather API for the "todays weather" card
function getApi(cityName) {
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=33129ac380cd1cfa406b3bbb417e18ca&units=imperial`;

  fetch(requestURL)
    .then(function (response) {
      if (response.ok) return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateTodaysWeather(data);
      // Grabbing lat & lon of chosen city to pass into forecastCards API function
      forecastCards(data.coord.lat, data.coord.lon);
    });

  saveSearchHistory(cityName);
  displaySearchHistory();
}

// Fetching the forecast API for the 5 day forecast cards. Also calling data to display on cards.
var forecastCards = function (lat, lon) {
  var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=33129ac380cd1cfa406b3bbb417e18ca&units=imperial`;

  fetch(forecastURL)
    .then(function (response) {
      if (response.ok) return response.json();
    })
    .then(function (data) {
      console.log(data);
      // 5 day forecast Temp
      $(".card-temp").each(function (i) {
        var newTemp = data.list[i].main.temp;
        $(this).text("Temp: " + newTemp + "°F");
      });
      // 5 day forecast Wind
      $(".card-wind").each(function (i) {
        var newWind = data.list[i].wind.speed;
        $(this).text("Wind: " + newWind + " MPH");
      });
      // 5 day forecast Humidity
      $(".card-humd").each(function (i) {
        var newHumd = data.list[i].main.humidity;
        $(this).text("Humidity: " + newHumd + "%");
      });
      // Icon based on weather condition
      $(".card-body .weather-icon").each(function (i) {
        var forecastCondition = data.list[i].weather[0].main;
        displayIcon(forecastCondition, this);
      });
    });
};

// Displaying weather icons based on weather retrieved by API
function displayIcon(condition, element) {
  var iconHTML = "";
  if (condition == "Clear") {
    iconHTML = '<i class="fa-solid fa-sun"></i>';
  } else if (condition == "Clouds") {
    iconHTML = '<i class="fa-solid fa-cloud"></i>';
  } else if (condition == "Rain") {
    iconHTML = '<i class="fa-solid fa-cloud-rain"></i>';
  }
  $(element).html(iconHTML);
}

// Displaying todays date and 5 day forecast dates
var todaysDate = dayjs();
$("#current-date").text(todaysDate.format("MMMM D, YYYY"));
$(".card-date").each(function (i) {
  // Add 1 to i to start with tomorrow for the first card
  var newDate = todaysDate.add(i + 1, "day").format("MMMM D, YYYY");
  $(this).text(newDate);
});

// Displays all data to the "todays weather" card
function updateTodaysWeather(data) {
  document.getElementById(
    "current-city"
  ).textContent = `Today's Weather in ${data.name}`;
  document.getElementById(
    "current-temp"
  ).textContent = `Temperature: ${data.main.temp}°F`;
  document.getElementById(
    "current-wind"
  ).textContent = `Wind: ${data.wind.speed} MPH`;
  document.getElementById(
    "current-humidity"
  ).textContent = `Humidity: ${data.main.humidity}%`;
  displayIcon(data.weather[0].main, weatherIcon);
}

// Saves the city searched for to local storage
function saveSearchHistory(searchTerm) {
  var searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searches.push(searchTerm);
  localStorage.setItem("searchHistory", JSON.stringify(searches));
}

// Displays the search history from local storage
function displaySearchHistory() {
  var searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
  var searchList = document.getElementById("search-history");
  // Clear out the current list
  searchList.innerHTML = "";
  // Create a list item for each search in the history and append to the list
  searches.forEach(function (city) {
    var li = document.createElement("li");
    li.textContent = city;
    li.classList.add("list-group-item");
    searchList.appendChild(li);
  });
}

// Clears search history list when "clear search" button is clicked
clearSearches.addEventListener("click", function () {
  localStorage.setItem("searchHistory", JSON.stringify([]));
  displaySearchHistory();
});

// Runs when the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Displays any search history
  displaySearchHistory();

  var searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", function () {
    var citySearch = document.getElementById("city-search").value;
    if (citySearch) {
      getApi(citySearch); // Calls the weather API with the city name
    }
  });
});
