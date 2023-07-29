let temp = [];
let tempMax = [];
let tempMin = [];
let sunrise = [];
let sunset = [];
let rain = [];
let wind = [];
let time = 0;

// get city from user input and convert to coordinates for open-meteo api
document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault(); // prevent page from reloading
    document.getElementById("catch").innerHTML = "";
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;

    var request = 'https://api.api-ninjas.com/v1/geocoding?city=' + city + '&country=' + country;

    fetch(request, { headers: { "X-Api-Key": 'SVL0N0tI0TZs8gFOxQcD/g==5jwNe2Tr4lSPusv9' } })
        .then(response => response.json())
        .then(data => {
            data = data[0];     // choose first city because its probably the right one
            var coords = [data.latitude, data.longitude];
            getWeather(coords);

            country = data.country;
            updateCityCountry(city, country);

        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("catch").innerHTML = "City not found";
        });
});

function getWeather(coords) {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=" + coords[0].toString() + "&longitude=" + coords[1].toString() + "&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,weathercode,cloudcover,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateTimeDate(data.current_weather.time);
            processData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateCityCountry(city, country) {
    document.getElementById("display-city").innerText = city;
    document.getElementById("display-country").innerText = country;
}

function parseDate(date) {
    var time = date.toString().substring(11, 16);
    date = date.toString().substring(0, 10);
    var dateArr = date.split("-");
    var year = dateArr[0];
    var month = dateArr[1];
    var day = dateArr[2];
    switch (month) {
        case "01":
            month = "January";
            break;
        case "02":
            month = "February";
            break;
        case "03":
            month = "March";
            break;
        case "04":
            month = "April";
            break;
        case "05":
            month = "May";
            break;
        case "06":
            month = "June";
            break;
        case "07":
            month = "July";
            break;
        case "08":
            month = "August";
            break;
        case "09":
            month = "September";
            break;
        case "10":
            month = "October";
            break;
        case "11":
            month = "November";
            break;
        case "12":
            month = "December";
            break;
    }
    var arr = [year, month, day];
    return [arr, time];
}

function getDayOfWeek(date) {
    date.toString().substring(0, 10);
    var dateArr = date.split("-");
    var year = dateArr[0];
    var month = dateArr[1];
    var day = dateArr[2];
    date = new Date(year, month - 1, day);    // month-1 because months are 0-11, even though days and years aren't?
    var dayOfWeek = date.getDay();
    dayOfWeek = dayOfWeek % 7;
    switch (dayOfWeek) {
        case 0:
            dayOfWeek = "Sun";
            break;
        case 1:
            dayOfWeek = "Mon";
            break;
        case 2:
            dayOfWeek = "Tue";
            break;
        case 3:
            dayOfWeek = "Wed";
            break;
        case 4:
            dayOfWeek = "Thu";
            break;
        case 5:
            dayOfWeek = "Fri";
            break;
        case 6:
            dayOfWeek = "Sat";
            break;
    }
    return dayOfWeek;
}


function updateTimeDate(date) {
    var dateArr = parseDate(date);
    time = dateArr[1];
    document.getElementById("display-time").innerText = time;

    var year = dateArr[0][0];
    var month = dateArr[0][1];
    var day = dateArr[0][2];
    document.getElementById("display-date").innerText = month + " " + day + ", " + year;
}



function processData(data) {

    // let res = arr1.map((x, i) => [x, arr2[i]]);
    // let arr1 = data.hourly.temperature_2m;
    // let arr2 = data.hourly.time;
    // let res = arr1.map((x, i) => [x, arr2[i]]);

    // current day
    temp = data.current_weather.temperature;
    tempMax = data.daily.temperature_2m_max;
    tempMin = data.daily.temperature_2m_min;
    document.getElementById("today-temp-max").innerText = "High: " + tempMax[0] + "°";
    document.getElementById("today-temp-min").innerText = "Low: " + tempMin[0] + "°";
    document.getElementById("today-temp").innerText = temp + "°";

    var currentTime = data.current_weather.time;
    currentTime = currentTime.toString().substring(0, 10);
    document.getElementById("display-dayofweek").innerText = getDayOfWeek(currentTime);

    // sunrise and sunset
    sunrise = data.daily.sunrise;
    sunset = data.daily.sunset;
    var sunriseArr = parseDate(sunrise[0]);
    var sunsetArr = parseDate(sunset[0]);
    document.getElementById("today-sunrise").innerHTML = "Sunrise: " + sunriseArr[1];
    document.getElementById("today-sunset").innerHTML = "Sunset: " + sunsetArr[1];

    // update weather icon based on WMO weather code
    var weatherCode = data.current_weather.weathercode;
    var currentWeather = document.getElementById("current-weather");

    switch (weatherCode) {
        case 0:
            if (time >= sunriseArr[1] && time <= sunsetArr[1]) {
                currentWeather.innerHTML = "clear_day";
            } else {
                currentWeather.innerHTML = "clear_night";
            }
            break;
        case 1:
        case 2:
        case 3:
            if (time >= sunriseArr[1] && time <= sunsetArr[1]) {
                currentWeather.innerHTML = "partly_cloudy_day";
            } else {
                currentWeather.innerHTML = "partly_cloudy_night";
            }
            break;
        case 45:
        case 48:
            currentWeather.innerHTML = "foggy";
            break;
        case 51:
        case 53:
        case 55:
            currentWeather.innerHTML = "rainy";
            break;
        case 56:
        case 57:
            currentWeather.innerHTML = "weather_mix";
            break;
        case 61:
        case 63:
        case 65:
            currentWeather.innerHTML = "rainy";
            break;
        case 66:
        case 67:
            currentWeather.innerHTML = "weather_mix";
            break;
        case 71:
        case 73:
        case 75:
            currentWeather.innerHTML = "weather_snowy";
            break;
        case 77:
            currentWeather.innerHTML = "snowing_heavy";
            break;
        case 80:
        case 81:
        case 82:
            currentWeather.innerHTML = "rainy";
            break;
        case 85:
        case 86:
            currentWeather.innerHTML = "weather_snowy";
        case 95:
        case 96:
        case 99:
            currentWeather.innerHTML = "thunderstorm";
            break;
        default:
            currentWeather.innerHTML = "";
            break;
    }

    // day names
    for (var i = 1; i < 7; i++) {
        // can't use javascript date object because it uses local time
        var date = getDayOfWeek(data.daily.time[i]);
        var card = document.getElementById("fore-" + i + "-day");
        card.innerHTML = date
            + '<span class="material-symbols-sharp" id="card">'
            + weatherCodeToIcon(data.daily.weathercode[i])
            + '</span>'
            + '<div id="fore-max">' + data.daily.temperature_2m_max[i] + '°</div>'
            + '<div id="fore-min">' + data.daily.temperature_2m_min[i] + '°</div>';
    }

    return data;
}

function weatherCodeToIcon(weatherCode) {

    switch (weatherCode) {
        case 0:
            weatherCode = "clear_day";
            break;
        case 1:
        case 2:
        case 3:
            weatherCode = "partly_cloudy_day";
            break;
        case 45:
        case 48:
            weatherCode = "foggy";
            break;
        case 51:
        case 53:
        case 55:
            weatherCode = "rainy";
            break;
        case 56:
        case 57:
            weatherCode = "weather_mix";
            break;
        case 61:
        case 63:
        case 65:
            weatherCode = "rainy";
            break;
        case 66:
        case 67:
            weatherCode = "weather_mix";
            break;
        case 71:
        case 73:
        case 75:
            weatherCode = "weather_snowy";
            break;
        case 77:
            weatherCode = "snowing_heavy";
            break;
        case 80:
        case 81:
        case 82:
            weatherCode = "rainy";
            break;
        case 85:
        case 86:
            weatherCode = "weather_snowy";
        case 95:
        case 96:
        case 99:
            weatherCode = "thunderstorm";
            break;
        default:
            weatherCode = "";
            break;
    }
    return weatherCode;
}



function updateForecast(data) {


}