window.onload = function() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(success, error);
    }
}
function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    navigator.geolocation.clearWatch(watchId);

    visualcrossing(latitude,longitude);
    openMeteo(latitude,longitude);
}
function error() {
    return -1;
}

class weatherDataFromAPI{
    constructor() {
        this._temperature = null;
        this._feelslike = null;
        this._precip = null;
        this._wind_speed = null;
        this._wind_direction = null;
        this._pressure = null;
        this._sunrise = null;
        this._sunset = null;
        this._rain = null;
        this._showers = null;
        this._snowfall = null;
        this._weather_code = null;
        this._resolvedAddress = null;
        this._precipType = null;
        this._isDay = null;
        this._icon = null;
    }
    get temperature() {
        return this._temperature;
    }
    get feelslike() {
        return this._feelslike;
    }
    get precip() {
        return this._precip;
    }
    get wind_speed() {
        return this._wind_speed;
    }
    get wind_direction() {
        return this._wind_direction;
    }
    get pressure() {
        return this._pressure;
    }
    get sunrise() {
        return this._sunrise;
    }
    get sunset() {
        return this._sunset;
    }
    get rain() {
        return this._rain;
    }
    get showers() {
        return this._showers;
    }
    get snowfall() {
        return this._snowfall;
    }
    get weather_code() {
        return this._weather_code;
    }
    get resolvedAddress() {
        return this._resolvedAddress;
    }
    get precipType() {
        return this._precipType;
    }
    get icon(){
        return this._icon;
    }
    get isDay(){
        return this._isDay;
    }
    set temperature(value) {
        this._temperature = value;
        return this;

    }
    set feelslike(value) {
        this._feelslike = value;
        return this;

    }
    set precip(value) {
        this._precip = value;
        return this;

    }
    set wind_speed(value) {
        this._wind_speed = value;
        return this;

    }
    set wind_direction(value) {
        this._wind_direction = value;
        return this;

    }
    set pressure(value) {
        this._pressure = value;
        return this;

    }
    set sunrise(value) {
        this._sunrise = value;
        return this;

    }
    set sunset(value) {
        this._sunset = value;
        return this;

    }
    set rain(value) {
        this._rain = value;
        return this;

    }
    set showers(value) {
        this._showers = value;
        return this;

    }
    set snowfall(value) {
        this._snowfall = value;
        return this;

    }
    set weather_code(value) {
        this._weather_code = value;
        return this;

    }
    set resolvedAddress(value) {
        this._resolvedAddress = value;
        return this;

    }
    set precipType(value) {
        this._precipType = value;
        return this;

    }
    set isDay(value){
        this._isDay = value;
        return this;

    }
    set icon(value){
        this._icon = value;
        return this;
    }
}

function setDataToTile(dataFromApi, number){
    document.getElementById(`tempTitle${number}`).textContent = dataFromApi.temperature() +"°";
    if(number ==1){
        document.getElementById(`icon${number}`).src = iconMatching(dataFromApi.icon());
    }else if(number ==2){
        document.getElementById(`icon${number}`).src = iconMatchingOpenMeteo(dataFromApi.weather_code(), dataFromApi.isDay());
    }else{

    }
    document.getElementById(`icon${number}`).display = 'block';
    document.getElementById(`temperature${number}`).textContent = "Temperature: " + dataFromApi.temperature() +" C°";
    document.getElementById(`feelslike${number}`).textContent = "Feels like: " + dataFromApi.feelslike() +" C°";
    if(number ==1){
        document.getElementById(`precip${number}`).textContent = "Precip: " + dataFromApi.precip() +" mm "+precipCorrection(dataFromApi.precipType());
    }else if(number ==2){
        document.getElementById(`precip${number}`).textContent = "Precip: " + dataFromApi.precip() +" mm "+openMeteoPrecip(dataFromApi.precip(),dataFromApi.rain(),dataFromApi.showers(),dataFromApi.snowfall());
    }else{

    }
    document.getElementById(`wind${number}`).textContent = "Wind: " + dataFromApi.wind_speed() + " kph " + windDirectionCorrection(dataFromApi.wind_direction());
    document.getElementById(`pressure${number}`).textContent = " Pressure:  " + dataFromApi.pressure() +" hPa.";
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
        document.getElementById("wind1").textContent = "Wind: " + forecast1[4] + " kph " + windDirectionCorrection(forecast1[5]);
        document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";
    })
    .catch(function(error) {
        console.error("An error occurred while fetching data:", error);
    });


    openMeteoByCity(city)
    .then(function(forecast2) {
        document.getElementById("tempTitle2").textContent = forecast2[0] +"°";
        document.getElementById("icon2").src = iconMatchingOpenMeteo(forecast2[7], forecast2[6]);
        document.getElementById("icon2").display = 'block';
        document.getElementById("temperature2").textContent = "Temperature: " + forecast2[0] +" C°";
        document.getElementById("feelslike2").textContent = "Feels like: " + forecast2[1] +" C°";
        document.getElementById("precip2").textContent = "Precip: " + forecast2[2] +" mm "+openMeteoPrecip(forecast2[2],forecast2[8],forecast2[9],forecast2[10]);
        document.getElementById("wind2").textContent = "Wind: " + forecast2[3] + " kph " + windDirectionCorrection(forecast2[4]);
        document.getElementById("pressure2").textContent = " Pressure:  " + forecast2[5] +" hPa.";

       })
    .catch(function(error) {
        console.error("An error occurred while fetching data:", error);
    });
});


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

function precipCorrection(precip){
    if(precip == null){
        return "";
    }else{
        return precip;
    }
}
function shortenResolvedAddress(resolvedAddress){
    const start = resolvedAddress.indexOf(",");
    const end = resolvedAddress.lastIndexOf(",");
    if (start !== -1 && end !== -1) {
        resolvedAddress = resolvedAddress.substring(0, start) + resolvedAddress.substring(end);
    }   
    return resolvedAddress;
}

