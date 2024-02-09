document.getElementById("cityForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var location = usersLocalization();
    document.getElementById("currentCity").textContent = location[1];
    if( location != -1){
        var timeData = timezoneDB(location[0],location[1]);
        var forecast1 = visualCrossingAPI(location[0],location[1], timeData[0]);
        document.getElementById("icon1").src = forecast1[9];
        document.getElementById("icon1").display = 'block';
        document.getElementById("temperature1").textContent = "Temperature: " + forecast1[0] +"C°";
        document.getElementById("feelslike1").textContent = "Feels like: " + forecast1[1] +"C°";
        document.getElementById("precip1").textContent = "Precip: " + forecast1[2] +"mm "+forecast1[3];
        document.getElementById("wind1").textContent = "Wind: " + forecast1[5] + " " + forecast1[4];
        document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";
    }else{
        document.getElementById("temperature1").textContent = "kurwa:";
    }

});
function usersLocalization(){
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            return [latitude, longitude];
        });
    }else{
        return -1;
    }
}

function timezoneDB(latitude, longitude){
    var base = "http://api.timezonedb.com/v2.1/get-time-zone?key=6Y48984OB897&format=json&by=position&lat="
    base+=latitude;
    base+="&lng=";
    base+=longitude;
    var time, cityName, countryCode;

    fetch(base).then(response => response.json())
    .then(data => {
        time = data.formatted;
        time = time.replace(" ", "T");
        cityName = data.cityName;
        countryCode = data.countryCode;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    return [time, cityName, countryCode];
}

function visualCrossingAPI(latitude, longitude, time){

    var base = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    base+=latitude + ",";
    base+=longitude +"/";
    base+=time;
    base+="?key=KUTJNGNY63AY36H5R5YAE9ZY8";
    base+="&include=current";
    base+="&elements=temp,feelslike,precip,preciptype,winddir,windspeed,pressure,sunrise,sunset,icon"

    fetch(base).then(response => response.json())
    .then(data => {
        return [data.temp,data.feelslike,data.precip,data.preciptype,data.winddir,data.windspeed,data.pressure,data.sunrise,data.sunset,data.icon];
    })
    .catch(error => {
        console.error('Error:', error);
    });
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

