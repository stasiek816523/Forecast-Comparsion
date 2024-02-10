async function openStreetMapNominatim(city){
    try{
        let apiUrl = `https://nominatim.openstreetmap.org/search.php?q=${city}&format=json`;
        const response = await fetch(apiUrl);

        const data = await response.json();

        const latitude = data[0].lat;
        const longitude = data[0].lon;
        return [latitude, longitude];
    }catch(error){
        console.error(error);
    }
}

async function reverseOpenStreetMapNominatim(latitude, longitude){
    try{
        let apiUrl = `https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=10&format=json`;

        const response = await fetch(apiUrl);

        const data = await response.json();

        let displayName = data.display_name;
        return displayName;
    }catch(error){
        console.error(error);
    }
}