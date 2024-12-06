const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';
const url = 'pk.eyJ1IjoiZHVuZ3BodW5nMjcwOSIsImEiOiJjbTNybXozeHMwNXIxMnJzYmFiNWxxM3lyIn0.RJjcATnxHqamjd1n8KgHmQ'
type Coordinates = [number, number];
export async function getDirections(from : Coordinates, to: Coordinates) {
  const response = await fetch(
    `${BASE_URL}/driving/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${url}`
  );
  const json = await response.json();
  return json;
}