export async function getCurrentWeather(lat: number, long: number) {

  const urlCurrent =
    `https://weather.googleapis.com/v1/currentConditions:lookup` +
    `?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}` +
    `&location.latitude=${lat}&location.longitude=${long}&units_system=IMPERIAL`;

  const res = await fetch(urlCurrent);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));



  const urlHourly =
    `https://weather.googleapis.com/v1/forecast/hours:lookup` +
    `?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}` +
    `&location.latitude=${lat}&location.longitude=${long}&hours=24&units_system=IMPERIAL`;

  const resHourly = await fetch(urlHourly);
  const dataHourly = await resHourly.json();
  console.log(JSON.stringify(dataHourly.forecastHours?.[0], null, 2));

  return { current: data, hourly: dataHourly };
}