async function openMeteo(latitude,longitude){
    let data = await openMeteoByXY(latitude,longitude);
    setDataToTile(data, 2);
}


function openMeteoByCity(city){
    var data = openStreetMapNominatim(city);
    var xy = data.then(response => {
        const result = response[0];
        const lat = result.lat;
        const lon = result.lon;
        return [lat,lon];
    }).catch(error => {
        console.error('Error ', error);
    });
    return openMeteoByXY(xy[0],xy[1]);
}
function openMeteoByXY(latitude, longitude){
    let apiUrl = "https://api.open-meteo.com/v1/dwd-icon?latitude="
    apiUrl += latitude + "&longitude=";
    apiUrl+= longitude + "&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&forecast_days=1";

    return fetch(apiUrl, {
        "method": "GET",
        "headers": {}
    })
    .then(response => response.json())
        .then(data => {
            var currentConditions = data.current;

            const api1data = new weatherDataFromAPI();
            api1data.temperature(currentConditions.temperature_2m).feelslike(currentConditions.apparent_temperature).precip(currentConditions.precipitation)
            .wind_dir(currentConditions.wind_direction_10m).wind_speed(currentConditions.wind_speed_10m).pressure(currentConditions.pressure_msl).isDay(currentConditions.is_day)
            .weatherCode(currentConditions.weather_code).rain(currentConditions.rain).showers(currentConditions.showers).snowfall(currentConditions.snowfall);
            return api1data;
        })
    .catch(err => {
        console.error(err);
    });
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