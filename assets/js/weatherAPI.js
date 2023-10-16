var api = 'ee78ea65beb3a2a3c7c595cb6693d92c';

// This function gets the location of the city
async function getCityLocation (cityName) {
    var limit = 5;
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data = data.filter(function (city) {
            return city.country === 'US';
        });
        if (data.length === 0) {
            alert('City not found');
            return;
        }
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;
        const location = {lat, lon};
        console.log(location);
        return location;
    })
}

// This function gets the current weather for the city
async function getCurrentWeather ({lat, lon}) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${api}`);
    var data = await res.json();
    const res2 = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api}`);
    var cityData = (await res2.json())[0];
    console.log(cityData);
    data = {
        date: data.dt,
        city: data.name,
        state: cityData.state,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon
    };
    return data;
}

// This function gets the weather for the next 5 days
async function getWeekdayWeather ({lat, lon}) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${api}`);
    var data = await res.json();
    data = data.list.filter(function (weather) {
        return weather.dt_txt.includes('12:00:00');
    });
    data = data.map(function (weather) {
        return {
            date: weather.dt_txt,
            temp: weather.main.temp,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            description: weather.weather[0].description,
            icon: weather.weather[0].icon
        }
    });
    return data;
}

// This function gets the location, current weather, and weekday weather for a city
async function getForecast (cityName) {
    var location = await getCityLocation(cityName);
    var weather = await getCurrentWeather(location);
    var weekdayWeather = await getWeekdayWeather(location);
    return {weather, weekdayWeather};
}

export {getForecast};