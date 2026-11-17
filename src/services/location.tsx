import * as Location from "expo-location";

export async function getUserLocation() {
  // Step 1: ask permission (this pops the iOS "Allow location?" dialog)
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log("Permission status:", status);

  if (status !== "granted") {
    console.log("Location permission denied");
    return null;
  }

  // Step 2: get the coordinates
  const position = await Location.getCurrentPositionAsync({});

  const locationResults = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  console.log(
    "Location:",
    position.coords.latitude,
    position.coords.longitude,
    locationResults,
  );

  return {
    locat: position.coords,
    city: locationResults[0].city,
    state: locationResults[0].region,
  };
}

export async function getCityLocation(search: string) {
  const results = await Location.geocodeAsync(search);
  if (results.length === 0) return null;

  const { latitude, longitude } = results[0];

  const locationResults = await Location.reverseGeocodeAsync({
    latitude: latitude,
    longitude: longitude,
  });

  return {
    locat: { latitude, longitude },
    city: locationResults[0].city,
    state: locationResults[0].region,
  };
}
