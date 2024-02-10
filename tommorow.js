async function tommorowApi(latitude,longitude){
    const data = await tommorowApiByXY(latitude,longitude);
    setDataToTile(data, 3);
}
/*
1: Rain
2: Snow
3: Freezing Rain
4: Ice Pellets / Sleet

*/
async function tommorowApiByXY(latitude, longitude){
    try{

        let apiUrl = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}fields=temperature,precipitationIntensity,precipitationType,windSpeed,windDirection,temperatureApparent,weatherCode,pressureSurfaceLevel,sunriseTime,sunsetTime&timesteps=current&units=metric&apikey=AaApE7QJf5i5KoG3f441uoulxk6NT2KT`


        const response = await fetch(apiUrl);

        const data = await response.json();

        var currentConditions = data.current;
        const apidata = new weatherDataFromAPI();
        apidata.set_temperature(currentConditions.temperature).set_feelslike(currentConditions.temperatureApparent).set_precip(currentConditions.precipitationIntensity)
        .set_wind_direction(currentConditions.windDirection).set_wind_speed(currentConditions.windSpeed).set_pressure(currentConditions.pressureSurfaceLevel)
        .set_weather_code(currentConditions.weatherCode).set_precip_type(currentConditions.precipitationType).set_sunset(sunsetTime).set_sunrise(sunriseTime);

        return apidata;
    }catch(error){
        console.error(error);
    }
}

function iconMatchingTommorow(weatherCode,sunrise,sunset){

    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const now = new Date();


    let isDay = null;

    if(sunriseDate < now || sunsetDate > now){
        isDay = 0;
    }else{
        isDay = 1;
    }

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


function precipCorrectionTommorow(precipitationType){
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