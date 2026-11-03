export async function getCurrentWeather(lat: number, long: number) {

  const url =
    `https://weather.googleapis.com/v1/currentConditions:lookup` +
    `?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}` +
    `&location.latitude=${lat}&location.longitude=${long}&units_system=IMPERIAL`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}