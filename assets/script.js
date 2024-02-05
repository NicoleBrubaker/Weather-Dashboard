var forecastDate = document.getElementById("#card-date");

// This function will be used to make the API call
function getApi(cityName) {
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=33129ac380cd1cfa406b3bbb417e18ca&units=imperial`;

  fetch(requestURL)
    .then(function (response) {
      if (response.ok) return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateTodaysWeather(data);
    });

  saveSearchHistory(cityName);
  displaySearchHistory();
}

var todaysDate = dayjs();
$('#current-date').text(todaysDate.format("MMMM D, YYYY"));
// looping through each forecast card to give correct date
$(".card-date").each(function (i) {
  // Add 1 to i to start with tomorrow for the first card
  var newDate = todaysDate.add(i + 1, "day").format("MMMM D, YYYY");
  $(this).text(newDate);
});

// Call this function with the city name to update the "today" weather card
// Corresponds with HTML elements to pass in weather data
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

// This will run when the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Display search history
  displaySearchHistory();

  var searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", function () {
    var citySearch = document.getElementById("city-search").value;
    if (citySearch) {
      getApi(citySearch); // Call the API with the city name
    }
  });
});
