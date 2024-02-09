window.onload = function() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(success, error);
    }
}

async function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    navigator.geolocation.clearWatch(watchId);

    visualcrossing(latitude,longitude);
    openMeteo(latitude,longitude)
}

async function visualcrossing(latitude,longitude){
    var timeZoneData = await timezoneDB(latitude,longitude);
    var forecast1 = await visualCrossingAPIbyXY(latitude,longitude, timeZoneData[0]);
    document.getElementById("currentCity").textContent = timeZoneData[1]+", "+timeZoneData[2];
    document.getElementById("tempTitle1").textContent = forecast1[0] +"°";
    document.getElementById("icon1").src = iconMatching(forecast1[9]);
    document.getElementById("icon1").display = 'block';
    document.getElementById("temperature1").textContent = "Temperature: " + forecast1[0] +" C°";
    document.getElementById("feelslike1").textContent = "Feels like: " + forecast1[1] +" C°";
    document.getElementById("precip1").textContent = "Precip: " + forecast1[2] +" mm "+precipCorrection(forecast1[3]);
    document.getElementById("wind1").textContent = "Wind: " + forecast1[5] + " kph " + windDirectionCorrection(forecast1[4]);
    document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";

}

function error() {
    return -1;
}

function timezoneDB(latitude, longitude){
    var base = "http://api.timezonedb.com/v2.1/get-time-zone?key=6Y48984OB897&format=json&by=position&lat=";
    base+=latitude;
    base+="&lng=";
    base+=longitude;
    var time = null, cityName =null, countryCode=null;

    return fetch(base)
    .then(response => response.json())
        .then(data => {
            time = data.formatted;
            time = time.replace(" ", "T");
            cityName = data.cityName;
            countryCode = data.countryCode;
            return [time, cityName, countryCode];
        })
    .catch(error => {
        console.error('Error:', error);
    });
}

function visualCrossingAPIbyXY(latitude, longitude, time){

    var base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    base+=latitude + "%2C";
    base+=longitude +"/";
    base+="today?unitGroup=metric&elements=datetime%2Ctemp%2Cfeelslike%2Cprecip%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cicon&include=current%2Cfcst&key=KUTJNGNY63AY36H5R5YAE9ZY8&contentType=json"

    return fetch(base, {
        "method": "GET",
        "headers": {}
    })
    .then(response => response.json())
        .then(data => {
            var currentConditions = data.currentConditions;
            return[currentConditions.temp, currentConditions.feelslike,currentConditions.precip,currentConditions.preciptype,currentConditions.windspeed,currentConditions.winddir,currentConditions.pressure,currentConditions.sunrise, currentConditions.sunset, currentConditions.icon];
        })
    .catch(err => {
        console.error(err);
    });
}

function windDirectionCorrection(directionInDegrees){
    if(directionInDegrees > 327 || directionInDegrees <= 22){ //N
        return 'N';
    }else if(directionInDegrees <= 67 && directionInDegrees > 22){ // NE
        return 'NE';
    }else if(directionInDegrees <= 112 && directionInDegrees > 67){ // E
        return 'E';
    }else if(directionInDegrees <= 157 && directionInDegrees > 112){ // SE
        return 'SE';
    }else if(directionInDegrees <= 202 && directionInDegrees > 157){ // S
        return 'S';
    }else if(directionInDegrees <= 247 && directionInDegrees > 202){ // SW
        return 'SW';
    }else if(directionInDegrees <= 292 && directionInDegrees > 247){ // W
        return 'W';
    }else if(directionInDegrees <= 327 && directionInDegrees > 292){ // NW
        return 'NW';
    }else{
        return '?';
    }
}
function iconMatching(JSONdescription){
    switch(JSONdescription) {
        case 'snow':
            return "weatherIcons/snow.png"
        case 'rain':
            return "weatherIcons/rain.png";
        case 'fog':
            return "weatherIcons/fog.png";
        case 'wind':
            return "weatherIcons/wind.png";
        case 'cloudy':
            return "weatherIcons/cloudy.png";
        case 'partly-cloudy-day':
            return "weatherIcons/partly-cloudy-day.png";
        case 'partly-cloudy-night':
            return "weatherIcons/partly-cloudy-night.png";
        case 'clear-day':
            return "weatherIcons/clear-day.png";
        case 'clear-night':
            return "weatherIcons/clear-night.png";
        default:
            return '?';
    }
}
function precipCorrection(precip){
    if(precip == null){
        return "";
    }else{
        return precip;
    }
}
function shortenResolvedAddress(resolvedAddress){
    const start = resolvedAddress.indexOf(",");
    const end = resolvedAddress.indexOf(",", start + 1);
    if (start !== -1 && end !== -1) {
        resolvedAddress = resolvedAddress.substring(0, start) + resolvedAddress.substring(end);
    }   
    return resolvedAddress;
}
function openMeteoByXY(latitude, longitude){
    let base = "https://api.open-meteo.com/v1/dwd-icon?latitude="
    base += latitude + "&longitude=";
    base+= longitude + "&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&forecast_days=1";

    return fetch(base, {
        "method": "GET",
        "headers": {}
    })
    .then(response => response.json())
        .then(data => {
            var currentConditions = data.current;
            return[currentConditions.temperature_2m, currentConditions.apparent_temperature,currentConditions.precipitation,currentConditions.wind_speed_10m,currentConditions.wind_directon_10m,currentConditions.pressure_ms1, currentConditions.is_day, currentConditions.weather_code, currentConditions.rain, currentConditions.shower, currentConditions.snowfall];
        })
    .catch(err => {
        console.error(err);
    });
}
async function openMeteo(latitude,longitude){
    var forecast2 = await openMeteoByXY(latitude,longitude);
    document.getElementById("tempTitle2").textContent = forecast2[0] +"°";
    document.getElementById("icon2").src = iconMatchingOpenMeteo(forecast2[8], forecast2[7]);
    document.getElementById("icon2").display = 'block';
    document.getElementById("temperature2").textContent = "Temperature: " + forecast2[0] +" C°";
    document.getElementById("feelslike2").textContent = "Feels like: " + forecast2[1] +" C°";
    document.getElementById("precip2").textContent = "Precip: " + forecast2[2] +" mm "+openMeteoPrecip(forecast2[2],forecast2[9],forecast2[10],forecast2[11]);
    document.getElementById("wind2").textContent = "Wind: " + forecast2[4] + " kph " + windDirectionCorrection(forecast2[5]);
    document.getElementById("pressure2").textContent = " Pressure:  " + forecast2[6] +" hPa.";

}
function openMeteoPrecip(precipitation, rain, shower, snowfall){
    if(precipitation == 0){
        return "";
    }else{
        if((rain > 0 || shower > 0) && snowfall > 0){
            return "rain, snow";
        }else if((rain > 0 || shower > 0) && snowfall == 0){
            return "rain";
        }else if((rain == 0 && shower == 0) && snowfall > 0){
            return "snow";
        }else{
            return "rain";
        }
    }
}
function iconMatchingOpenMeteo(weatherCode, isDay){
    if(weatherCode < 20){
        if(isDay == 0){
            return "weatherIcons/clear-night.png";
        }else{
            return "weatherIcons/clear-day.png";
        }
    }else if(weatherCode < 30){
        switch(weatherCode){
            case 20:
            case 21:
                return "weatherIcons/rain.png";
            case 22:
            case 23:
            case 24:
                return "weatherIcons/snow.png";
            case 25: 
                return "weatherIcons/rain.png";
            case 26:
                return "weatherIcons/snow.png";
            case 27: 
                return "weatherIcons/rain.png";
            case 28:
                return "weatherIcons/fog.png";
            case 29: 
                return "weatherIcons/rain.png";
            default:
                break;
        }
    }else if(weatherCode < 40){
        return "weatherIcons/wind.png";
    }else if(weatherCode < 50){
        return "weatherIcons/fog.png";
    }else if(weatherCode < 68){
        return "weatherIcons/rain.png";
    }else if(weatherCode < 80){
        return "weatherIcons/snow.png";
    }else if(weatherCode < 93){
        return "weatherIcons/rain.png";
    }else if(weatherCode < 94){
        return "weatherIcons/snow.png";
    }else{
        return "weatherIcons/rain.png";
    }
}


document.getElementById("cityForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var city = document.getElementById("city").value;

    visualCrossingAPIbyCity(city)
    .then(function(forecast1) {
        document.getElementById("currentCity").textContent = shortenResolvedAddress(forecast1[10]);
        document.getElementById("tempTitle1").textContent = forecast1[0] +"°";
        document.getElementById("icon1").src = iconMatching(forecast1[9]);
        document.getElementById("icon1").style.display = 'block';
        document.getElementById("temperature1").textContent = "Temperature: " + forecast1[0] +" C°";
        document.getElementById("feelslike1").textContent = "Feels like: " + forecast1[1] +" C°";
        document.getElementById("precip1").textContent = "Precip: " + forecast1[2] +" mm "+precipCorrection(forecast1[3]);
        document.getElementById("wind1").textContent = "Wind: " + forecast1[5] + " kph " + windDirectionCorrection(forecast1[4]);
        document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";
    })
    .catch(function(error) {
        console.error("An error occurred while fetching data:", error);
    });
});
function visualCrossingAPIbyCity(city){
    var base="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    base+=city+"/today?unitGroup=metric&elements=resolvedAddress%2Ctemp%2Cfeelslike%2Cprecip%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cicon&include=fcst%2Ccurrent&key=KUTJNGNY63AY36H5R5YAE9ZY8&contentType=json"

    return fetch(base, {
        "method": "GET",
        "headers": {}
    })
    .then(response => response.json())
        .then(data => {
            var currentConditions = data.currentConditions;
            return[currentConditions.temp, currentConditions.feelslike,currentConditions.precip,currentConditions.preciptype,currentConditions.windspeed,currentConditions.winddir,currentConditions.pressure,currentConditions.sunrise, currentConditions.sunset, currentConditions.icon, data.resolvedAddress];
        })
    .catch(err => {
        console.error(err);
    });
}