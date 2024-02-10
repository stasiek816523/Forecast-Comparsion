async function tommorowApi(latitude,longitude){
    const data = await tommorowApiByXY(latitude,longitude);
    setDataToTile(data, 3);
}
async function tommorowApiByXY(latitude, longitude){
    try{

        let apiUrl = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,precipitationIntensity,precipitationType,windSpeed,windDirection,temperatureApparent,weatherCode,pressureSurfaceLevel&timesteps=current&units=metric&apikey=AaApE7QJf5i5KoG3f441uoulxk6NT2KT`


        const response = await fetch(apiUrl);

        const data = await response.json();

        var currentConditions = data.data.timelines[0].intervals[0].values;
        const apidata = new weatherDataFromAPI();
        apidata.set_temperature(currentConditions.temperature.toFixed(1)).set_feelslike(currentConditions.temperatureApparent).set_precip(currentConditions.precipitationIntensity)
        .set_wind_direction(currentConditions.windDirection).set_wind_speed(currentConditions.windSpeed).set_pressure(currentConditions.pressureSurfaceLevel)
        .set_weather_code(currentConditions.weatherCode).set_precipType(currentConditions.precipitationType);

        return apidata;
    }catch(error){
        console.error(error);
    }
}

function iconMatchingTommorow(weatherCode){

    if(weatherCode < 1000){
        return "weatherIcons/clear-night.png";
    }else if(weatherCode < 2000){
        if(weatherCode == 1000){
            return "weatherIcons/clear-day.png";
        }
        if(weatherCode == 1001){
            return "weatherIcons/cloudy.png";
        }
        if(weatherCode < 1103 ){
            return "weatherIcons/partly-cloudy-day.png"
        }
    }else if(weatherCode < 4000){
        return "weatherIcons/fog.png";
    }else if(weatherCode < 5000){
        return "weatherIcons/rain.png";
    }else if(weatherCode < 8000){
        return "weatherIcons/snow.png";
    }else if(weatherCode == 8000){
        return "weatherIcons/wind.png";
    }else{
        return "weatherIcons/cloudy.png";
    }
}


function tommorowPrecipCorrection(precipitationType){
    switch(precipitationType){
        case 1:
            return 'rain';
        case 2:
            return 'snow';
        case 3:
            return 'freezing rain';
        case 4:
            return 'Ice pellets';
        default:
            return '';
    }
}