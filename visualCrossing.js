async function visualcrossing(latitude,longitude){
    var forecast1 = await visualCrossingAPIbyXY(latitude,longitude);
    document.getElementById("currentCity").textContent = shortenResolvedAddress(forecast1[10]);
    document.getElementById("tempTitle1").textContent = forecast1[0] +"°";
    document.getElementById("icon1").src = iconMatching(forecast1[9]);
    document.getElementById("icon1").display = 'block';
    document.getElementById("temperature1").textContent = "Temperature: " + forecast1[0] +" C°";
    document.getElementById("feelslike1").textContent = "Feels like: " + forecast1[1] +" C°";
    document.getElementById("precip1").textContent = "Precip: " + forecast1[2] +" mm "+precipCorrection(forecast1[3]);
    document.getElementById("wind1").textContent = "Wind: " + forecast1[4] + " kph " + windDirectionCorrection(forecast1[5]);
    document.getElementById("pressure1").textContent = " Pressure:  " + forecast1[6] +" hPa.";

}

function visualCrossingAPIbyXY(latitude, longitude){

    var apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    apiUrl+=latitude + "%2C";
    apiUrl+=longitude +"/";
    apiUrl+="today?unitGroup=metric&elements=datetime%2Ctemp%2Cfeelslike%2Cprecip%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cicon&include=current%2Cfcst&key=KUTJNGNY63AY36H5R5YAE9ZY8&contentType=json"

    return fetch(apiUrl, {
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
function visualCrossingAPIbyCity(city){
    var apiUrl="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    apiUrl+=city+"/today?unitGroup=metric&elements=resolvedAddress%2Ctemp%2Cfeelslike%2Cprecip%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cicon&include=fcst%2Ccurrent&key=KUTJNGNY63AY36H5R5YAE9ZY8&contentType=json"

    return fetch(apiUrl, {
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