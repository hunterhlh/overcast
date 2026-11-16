import { getUserLocation } from "@/services/location";
import { getStyling } from "@/services/styling";
import { getCurrentWeather } from "@/services/weatherAPI";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = Platform.select({ ios: "Helvetica Neue", android: "sans-serif" });

const formatCurrentTime = (currentTime: string) => {
  //Function, using arrow syntax
  return new Date(currentTime)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\u202F/g, " ");
};

function DetailCardComponent({
  // Function / Component, a funtion but passes back JSX rather than a value
  title,
  value,
  description,
  theme,
}: {
  title: string;
  value: string;
  description: string;
  theme: any;
}) {
  return (
    <View style={styles.dataCard}>
      <Text style={[styles.titleFormat, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.valueFormat, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.descriptionFormat, { color: theme.text }]}>
        {description}
      </Text>
    </View>
  );
}

function uvLabel(uv: number) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very high";
  return "Extreme";
}

function pressureLabel(pressure: number) {
  if (pressure <= 980) return "Very Low Pressure";
  if (pressure <= 1009) return "Low Pressure";
  if (pressure <= 1022) return "Normal Pressure";
  if (pressure <= 1035) return "High Pressure";
  else return "Extremly High Pressure";
}

function visibilityLabel(visibility: number) {
  if (visibility <= 0.25) return "Dense Fog";
  if (visibility <= 1) return "Foggy";
  if (visibility <= 3) return "Hazy";
  if (visibility <= 5) return "Light Haze";
  if (visibility <= 9.99) return "Good Visibility";
  else return "Clear Visibility";
}

function cloudLabel(clouds: number) {
  if (clouds <= 10) return "Clear Skies";
  if (clouds <= 30) return "Mostly Clear";
  if (clouds <= 60) return "Partly Cloudy";
  if (clouds <= 90) return "Mostly Cloudy";
  else return "Overcast";
}

function rainLabel(rain: number) {
  if (rain <= 10) return "Unlikely";
  if (rain <= 30) return "Slight Chance";
  if (rain <= 50) return "Possible";
  if (rain <= 70) return "Likely";
  else return "Likely";
}

const SHORT_DIRECTION: Record<string, string> = {
  //Object, just stores the data, holds a list of pairs
  NORTH: "North",
  NORTHEAST: "NorthEast",
  EAST: "East",
  SOUTHEAST: "SouthEast",
  SOUTH: "South",
  SOUTHWEST: "SouthWest",
  WEST: "West",
  NORTHWEST: "NorthWest",
};

export default function Details() {
  const [refreshing, setRefreshing] = useState(false);

  const [city, setCity] = useState<any>(null);

  const [state, setState] = useState<any>(null);

  const [weather, setWeatherCurrent] = useState<any>(null);

  const theme = getStyling(weather?.weatherCondition?.type, weather?.isDaytime);

  async function load() {
    const cords = await getUserLocation();
    if (!cords) return;

    setCity(cords.city);
    setState(cords.state);

    const weatherData = await getCurrentWeather(
      cords.locat.latitude,
      cords.locat.longitude,
    );
    setWeatherCurrent(weatherData.current);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <LinearGradient
      colors={theme.colors}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={[styles.city, { color: theme.text }]}>
            {city}, {state}
          </Text>
          <Text style={[styles.update, { color: theme.text }]}>
            Last updated: {formatCurrentTime(weather?.currentTime)}
          </Text>
          <View style={styles.columnCard}>
            <DetailCardComponent
              title="UV INDEX"
              value={weather?.uvIndex?.toString()}
              description={uvLabel(weather?.uvIndex)}
              theme={theme}
            />
            <DetailCardComponent
              title="HUMIDITY"
              value={`${weather?.relativeHumidity?.toString()}%`}
              description={`Dew Point: ${Math.round(weather?.dewPoint?.degrees?.toString())}°`}
              theme={theme}
            />
          </View>
          <View style={styles.columnCard}>
            <DetailCardComponent
              title="WIND SPEED"
              value={`${weather?.wind?.speed?.value?.toString()} mph`}
              description={`Gusts: ${weather?.wind?.gust?.value?.toString()} mph`}
              theme={theme}
            />
            <DetailCardComponent
              title="WIND DIRECTION"
              value={weather?.wind?.speed?.value?.toString()}
              description={`${SHORT_DIRECTION[weather?.wind?.direction?.cardinal?.toString()]}`}
              theme={theme}
            />
          </View>
          <View style={styles.columnCard}>
            <DetailCardComponent
              title="PRESSURE"
              value={`${Math.round(weather?.airPressure?.meanSeaLevelMillibars ?? 0)}`}
              description={pressureLabel(
                weather?.airPressure?.meanSeaLevelMillibars?.toString(),
              )}
              theme={theme}
            />
            <DetailCardComponent
              title="VISIBILITY"
              value={`${weather?.visibility?.distance?.toString()} mi`}
              description={visibilityLabel(
                weather?.visibility?.distance?.toString(),
              )}
              theme={theme}
            />
          </View>
          <View style={styles.columnCard}>
            <DetailCardComponent
              title="CLOUD COVER"
              value={`${weather?.cloudCover?.toString()}%`}
              description={`${cloudLabel(weather?.cloudCover?.toString())}`}
              theme={theme}
            />
            <DetailCardComponent
              title="RAIN CHANCE"
              value={`${weather?.precipitation?.probability?.percent?.toString()}%`}
              description={`${rainLabel(weather?.precipitation?.probability?.percent?.toString())}`}
              theme={theme}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    alignItems: "flex-start",
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  city: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "600",
  },
  update: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "300",
    paddingTop: 5,
    marginBottom: 20,
  },
  dataCard: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: 135,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 22,
    padding: 16,
    gap: 5,
    marginTop: 5,
  },
  columnCard: {
    flexDirection: "row",
    gap: 18,
    alignSelf: "stretch",
    padding: 5,
  },
  titleFormat: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "300",
  },
  valueFormat: {
    fontFamily: FONT,
    fontSize: 40,
    fontWeight: "300",
    marginBottom: 5,
    marginTop: 5,
  },
  descriptionFormat: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: "400",
  },
});
