async function openStreetMapNominatim(city){
    try{
        let apiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
        apiUrl += city + "&limit=1";

        const response = await fetch(apiUrl);

        const data = await response.json();

        return data;
    }catch(error){
        console.error(error);
    }
}

async function reverseOpenStreetMapNominatim(latitude, longitude){
    try{
        let apiUrl = "https://nominatim.openstreetmap.org/reverse.php?lat="
        apiUrl += latitude + "&lon=" + longitude + "&zoom=10&format=jsonv2";

        const response = await fetch(apiUrl);

        const data = await response.json();

        return data.display_name;
    }catch(error){
        console.error(error);
    }
}