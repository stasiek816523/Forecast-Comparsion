async function openStreetMapNominatim(city){
    let apiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
    apiUrl += city + "&limit=1";

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