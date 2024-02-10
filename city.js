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
     get_temperature() {
        return this._temperature;
    }
     get_feelslike() {
        return this._feelslike;
    }
     get_precip() {
        return this._precip;
    }
     get_wind_speed() {
        return this._wind_speed;
    }
     get_wind_direction() {
        return this._wind_direction;
    }
     get_pressure() {
        return this._pressure;
    }
     get_sunrise() {
        return this._sunrise;
    }
     get_sunset() {
        return this._sunset;
    }
     get_rain() {
        return this._rain;
    }
     get_showers() {
        return this._showers;
    }
     get_snowfall() {
        return this._snowfall;
    }
     get_weather_code() {
        return this._weather_code;
    }
     get_resolvedAddress() {
        return this._resolvedAddress;
    }
     get_precipType() {
        return this._precipType;
    }
     get_icon(){
        return this._icon;
    }
     get_isDay(){
        return this._isDay;
    }
     set_temperature(value) {
        this._temperature = value;
        return this;

    }
     set_feelslike(value) {
        this._feelslike = value;
        return this;

    }
     set_precip(value) {
        this._precip = value;
        return this;

    }
     set_wind_speed(value) {
        this._wind_speed = value;
        return this;

    }
     set_wind_direction(value) {
        this._wind_direction = value;
        return this;

    }
     set_pressure(value) {
        this._pressure = value;
        return this;

    }
     set_sunrise(value) {
        this._sunrise = value;
        return this;

    }
     set_sunset(value) {
        this._sunset = value;
        return this;
    }
     set_rain(value) {
        this._rain = value;
        return this;

    }
     set_showers(value) {
        this._showers = value;
        return this;

    }
     set_snowfall(value) {
        this._snowfall = value;
        return this;

    }
     set_weather_code(value) {
        this._weather_code = value;
        return this;

    }
     set_resolvedAddress(value) {
        this._resolvedAddress = value;
        return this;

    }
     set_precipType(value) {
        this._precipType = value;
        return this;

    }
     set_isDay(value){
        this._isDay = value;
        return this;

    }
     set_icon(value){
        this._icon = value;
        return this;
    }
}

window.onload = function() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(success, error);
    }
}
async function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    navigator.geolocation.clearWatch(watchId);
    let adr = await reverseOpenStreetMapNominatim(latitude, longitude);
    document.getElementById("currentCity").textContent = shortenResolvedAddress(adr);
    visualcrossing(latitude,longitude);
    openMeteo(latitude,longitude);
}
function error() {
    return -1;
}
function setDataToTile(dataFromApi, number){

    document.getElementById(`tempTitle${number}`).textContent = dataFromApi.get_temperature() +"°";
    if(number ==1){
        document.getElementById(`icon${number}`).src = iconMatching(dataFromApi.get_icon());
    }else if(number ==2){
        document.getElementById(`icon${number}`).src = iconMatchingOpenMeteo(dataFromApi.get_weather_code(), dataFromApi.get_isDay());
    }else{
        document.getElementById(`icon${number}`).src = iconMatchingOpenMeteo(dataFromApi.get_weather_code(), dataFromApi.get_sunrise(), dataFromApi.get_sunset());
    }
    document.getElementById(`icon${number}`).display = 'block';
    document.getElementById(`temperature${number}`).textContent = "Temperature: " + dataFromApi.get_temperature() +" C°";
    document.getElementById(`feelslike${number}`).textContent = "Feels like: " + dataFromApi.get_feelslike() +" C°";
    if(number ==1){
        document.getElementById(`precip${number}`).textContent = "Precip: " + dataFromApi.get_precip() +" mm "+precipCorrection(dataFromApi.get_precipType());
    }else if(number ==2){
        document.getElementById(`precip${number}`).textContent = "Precip: " + dataFromApi.get_precip() +" mm "+openMeteoPrecip(dataFromApi.get_precip(),dataFromApi.get_rain(),dataFromApi.get_showers(),dataFromApi.get_snowfall());
    }else{

    }
    document.getElementById(`wind${number}`).textContent = "Wind: " + dataFromApi.get_wind_speed() + " kph " + windDirectionCorrection(dataFromApi.get_wind_direction());
    document.getElementById(`pressure${number}`).textContent = " Pressure:  " + dataFromApi.get_pressure() +" hPa.";
}



document.getElementById("cityForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    var city = document.getElementById("city").value;
    var data = await openStreetMapNominatim(city);
    const adr = await reverseOpenStreetMapNominatim(data[0],data[1]);
    document.getElementById("currentCity").textContent = shortenResolvedAddress(adr);

    visualcrossing(data[0],data[1]);
    openMeteo(data[0], data[1]);

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

