function openStreetMapNominatim(city){
    let apiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=";
    apiUrl += city + "&limit=1";

    return fetch(apiUrl, {
        "method": "GET",
        "headers": {}
    })
    .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
    .catch(err => {
        console.error(err);
    });

}