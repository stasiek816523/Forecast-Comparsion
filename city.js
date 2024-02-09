window.onload = function() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(success, error);
    }
}

async function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    navigator.geolocation.clearWatch(watchId);

    var timeZoneData = await timezoneDB(latitude,longitude);
    document.getElementById("currentCity").textContent = timeZoneData[1]+", "+timeZoneData[2];
    var forecast1 = await visualCrossingAPI(latitude,longitude, timeZoneData[0]);

    document.getElementById("icon1").src = iconMatching(forecast1[9]);
    document.getElementById("icon1").display = 'block';
    document.getElementById("temperature1").textContent = "Temperature: " + forecast1[0] +"C°";
    document.getElementById("feelslike1").textContent = "Feels like: " + forecast1[1] +"C°";
    document.getElementById("precip1").textContent = "Precip: " + forecast1[2] +" mm "+forecast1[3];
    document.getElementById("wind1").textContent = "Wind: " + forecast1[5] + " kph " + windDirectionCorrection(forecast1[4]);
    document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";

}
function error() {
    return -1;
}
document.getElementById("cityForm").addEventListener("submit", function(event) {
    event.preventDefault();

});

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

function visualCrossingAPI(latitude, longitude, time){

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

/*
function extractTimezoneOffset(timezoneString) {
    var parts = timezoneString.split(':');
    var offsetHours = parseInt(parts[0]);
    var offsetMinutes = parseInt(parts[1]);
    var timezoneOffsetInMinutes =0;

    if(offsetHours >= 0){
        timezoneOffsetInMinutes = offsetHours * 60 + offsetMinutes;
    }else{
        timezoneOffsetInMinutes = offsetHours * 60 - offsetMinutes;
    }
    return timezoneOffsetInMinutes;
}


function getCurrentUTCTime() {
    var now = new Date();
    var utcString = now.toISOString().split('.')[0];
    return utcString;
}

function getTimezone() {
    var date = new Date();
    var timezoneOffsetInMinutes = date.getTimezoneOffset();
    var timezoneOffsetHours = Math.floor(Math.abs(timezoneOffsetInMinutes) / 60);
    var timezoneOffsetMinutes = Math.abs(timezoneOffsetInMinutes) % 60;
    var timezoneOffsetSign = (timezoneOffsetInMinutes >= 0) ? '-' : '+';
    var timezone = timezoneOffsetSign + timezoneOffsetHours + ':' + timezoneOffsetMinutes;
    return timezone;
}



function getUserTime(){
    var utcTime = getCurrentUTCTime();
    var timezoneOffsetInMinutes = extractTimezoneOffset(getTimezone());
    var finalTime = utcCorrection(utcTime, timezoneOffsetInMinutes);
    return finalTime;
}
function utcCorrection(utcTime, timezoneOffsetInMinutes){
    var dateTimeString = utcTime;
    var parts = dateTimeString.split('T');
    var timeParts = parts[1].split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var totalMinutes = hours * 60 + minutes;

    var date = new Date();

    if(totalMinutes >= timezoneOffsetInMinutes){
        totalMinutes += timezoneOffsetInMinutes;
        minutesToTime(totalMinutes);
    }else{
        if(date.getDay() == 1 && date.getMonth() == 0){

        }else if(date.getDate() == 31 && date.getMonth() == 11){

        }else if(date.getDate() == 1){

        }else if()
    }
}

function minutesToTime(totalMinutes) {
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    if(hours < 10){
        hours = "0"+hours;
    }
    if(minutes < 10){
        minutes = "0"+minutes;
    }

    return hours + ":" + minutes;
}

*/

