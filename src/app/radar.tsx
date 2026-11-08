import { getUserLocation } from "@/services/location";
import { getRadar } from "@/services/radarAPI";
import { useEffect, useState } from "react";
import MapView, { UrlTile } from "react-native-maps";

export default function Radar() {
  const [radarData, setRadar] = useState<any>(null);

  const [locationData, setLatLong] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const cords = await getUserLocation();
      if (!cords) return null;
      setLatLong(cords);

      getRadar().then((radarData) => {
        setRadar(radarData);
      });
    }

    load();
  }, []);

  return (
    locationData && (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: locationData.locat.latitude,
          longitude: locationData.locat.longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}
      >
        {radarData?.snapshot && (
          <UrlTile
            urlTemplate={`https://api.rainbow.ai/tiles/v1/precip/${radarData.snapshot}/0/{z}/{x}/{y}?token=${process.env.EXPO_PUBLIC_RAINBOW_API_KEY}&color=1`}
          />
        )}
      </MapView>
    )
  );
}
