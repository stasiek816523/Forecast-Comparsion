async function visualcrossing(latitude,longitude){
    const data = await visualCrossingAPIbyXY(latitude,longitude);
    setDataToTile(data, 1);
}


async function visualCrossingAPIbyXY(latitude, longitude){
    try{
        var apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C${longitude}/today?unitGroup=metric&elements=datetime%2Ctemp%2Cfeelslike%2Cprecip%2Cpreciptype%2Cwindspeed%2Cwinddir%2Cpressure%2Csunrise%2Csunset%2Cicon&include=current%2Cfcst&key=KUTJNGNY63AY36H5R5YAE9ZY8&contentType=json`

        const response = await fetch(apiUrl);

        const data = await response.json();

        var currentConditions = data.currentConditions;

        const api1data = new weatherDataFromAPI();
        api1data.set_temperature(currentConditions.temp).set_feelslike(currentConditions.feelslike).set_precip(currentConditions.precip).set_precipType(currentConditions.preciptype)
        .set_wind_direction(currentConditions.winddir).set_wind_speed(currentConditions.windspeed).set_pressure(currentConditions.pressure).set_sunrise(currentConditions.sunrise).set_sunset(currentConditions.sunset)
        .set_icon(currentConditions.icon).set_resolvedAddress(currentConditions.resolvedAddress);

        return api1data;
    }catch(error){
        console.error(error);
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