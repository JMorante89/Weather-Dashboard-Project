import {getForecast} from './weatherAPI.js';  // import the getForecast function from weatherAPI.js

var searchHistory = [];

$(function (){
    $('.search').on('submit', handleWeatherSearch);
    $('.search-history').on('click', 'li', handleSearchHistoryClick);
    updateSearchHistory();
    renderSearchHistory();
});


async function handleWeatherSearch (event) {
    event.preventDefault();
    var cityName = $('#city-search').val();
    var forecast = await getForecast(cityName);
    renderWeather(forecast);
    renderDate(forecast);
    renderWeekdayWeather(forecast);
    addSearchHistory(forecast.weather.city, forecast.weather.state)
};

function renderDate ({weather}) {
    var date = new Date(weather.date* 1000);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    $('#todays-date').text(`${month}/${day}/${year}`);
};

function renderWeather ({weather}) {
    var html = `
        <img src="${returnWeatherIcon(weather.icon)}" alt="${weather.description}" class="weather-icon">
        <h1 class="temp">${weather.temp}°F</h1>
        <h1 class="city">${weather.city}, ${weather.state}</h1>
        <h3 class="humidity">Humidity: ${weather.humidity}% 
        <img src="./assets/images/humidity.png" alt="humidity" class="display-image"></h3>
        <h3 class="wind-speed">Wind Speed: ${weather.windSpeed}mph 
        <img src="./assets/images/wind.png" alt="wind" class="display-image"></h3>
    `;
    $('.weather').html(html);
}

function renderWeekdayWeather ({weekdayWeather}) {
    var html = '';
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    function getDay (date) {
        date = new Date(date);
        return days[date.getDay()];
    }
    weekdayWeather.forEach(function (weather) {
        html += `
            <div class="day">
                <h2>${getDay(weather.date)}</h2>
                <h3>${weather.temp}°F</h3>
                <img src="${returnWeatherIcon(weather.icon)}" alt="${weather.description}" class="weather-icon">
                <h4 class="humitdiy">${weather.humidity}%<image src="./assets/images/humidity.png" class="display-image"></h4>
                <h4 class="wind-speed">${weather.windSpeed}mph<image src="./assets/images/wind.png" class="display-image"></h4>
            </div>
        `;
    });
    $('.forecast').html(html);
};

function returnWeatherIcon (icon) {
    icon = icon.slice(0, -1);
    var icons = {
        '01': './assets/images/clear.png',
        '02': './assets/images/clouds.png',
        '03': './assets/images/clouds.png',
        '04': './assets/images/clouds.png',
        '09': './assets/images/rain.png',
        '10': './assets/images/rain.png',
        '11': './assets/images/rain.png',
        '13': './assets/images/snow.png',
        '50': './assets/images/mist.png'
    };
    return icons[icon];
};

function updateLocalStorage () {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

function addSearchHistory (cityName, stateName) {
    if (searchHistory.find(location => location.city === cityName)) {
        return;
    }
    if (searchHistory.length >= 5) {
        searchHistory.shift();
    }
    searchHistory.push({city: cityName, state: stateName});
    updateLocalStorage();
    renderSearchHistory();
};

function updateSearchHistory () {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (!searchHistory) {
        searchHistory = [];
    }
};

function renderSearchHistory () {
    var html = '';
    searchHistory.forEach(function (location) {
        html += `<li>${location.city}, ${location.state}</li>`;
    });
    $('.search-history').html(html);
};

async function handleSearchHistoryClick (event) {
    var cityName = event.target.textContent;
    var forecast = await getForecast(cityName);
    renderWeather(forecast);
    renderDate(forecast);
    renderWeekdayWeather(forecast);
}