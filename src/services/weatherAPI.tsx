import { getUserLocation } from '@/services/location';


export async function getCurrentWeather() {

    const cords = await getUserLocation();
    if(!cords) return null;


  const url =
    `https://weather.googleapis.com/v1/currentConditions:lookup` +
    `?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}` +
    `&location.latitude=${cords.latitude}&location.longitude=${cords.longitude}&units_system=IMPERIAL`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
}