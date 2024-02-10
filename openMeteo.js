async function openMeteo(latitude,longitude){
    const data = await openMeteoByXY(latitude,longitude);
    setDataToTile(data, 2);
}

async function openMeteoByXY(latitude, longitude){
    try{
        let apiUrl = `https://api.open-meteo.com/v1/dwd-icon?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&forecast_days=1`;

        const response = await fetch(apiUrl);

        const data = await response.json();

        var currentConditions = data.current;
        const api1data = new weatherDataFromAPI();
        api1data.set_temperature(currentConditions.temperature_2m).set_feelslike(currentConditions.apparent_temperature).set_precip(currentConditions.precipitation)
        .set_wind_direction(currentConditions.wind_direction_10m).set_wind_speed(currentConditions.wind_speed_10m).set_pressure(currentConditions.pressure_msl).set_isDay(currentConditions.is_day)
        .set_weather_code(currentConditions.weather_code).set_rain(currentConditions.rain).set_showers(currentConditions.showers).set_snowfall(currentConditions.snowfall);

        return api1data;
    }catch(error){
        console.error(error);
    }
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