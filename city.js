window.onload = function() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(success, error);
    }
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




async function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    navigator.geolocation.clearWatch(watchId);

    visualcrossing(latitude,longitude);
    openMeteo(latitude,longitude);
}


function error() {
    return -1;
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

