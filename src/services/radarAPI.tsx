export async function getRadar() {
  const url = `https://api.rainbow.ai/tiles/v1/snapshot?layer=precip&token=${process.env.EXPO_PUBLIC_RAINBOW_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    console.log("Rainbow error:", res.status, await res.text());
    return null;
  }
  const radarData = await res.json();
  console.log(JSON.stringify(radarData, null, 2));
  return radarData;
}
