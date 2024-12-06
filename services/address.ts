const BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
const url = 'pk.eyJ1IjoiZHVuZ3BodW5nMjcwOSIsImEiOiJjbTNybXozeHMwNXIxMnJzYmFiNWxxM3lyIn0.RJjcATnxHqamjd1n8KgHmQ'
export async function getAddress(long: number,lat: number) {

    const Location = await fetch(
    `${BASE_URL}${long},${lat}.json?access_token=${url}`);
  const json1 = await Location.json();
  
  console.log(1,json1.features[0].place_name)   
        return json1.features[0].place_name
}