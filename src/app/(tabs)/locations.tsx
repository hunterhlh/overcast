import { getCityLocation, getUserLocation } from "@/services/location";
import { getStyling } from "@/services/styling";
import { getCurrentWeather } from "@/services/weatherAPI";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = Platform.select({ ios: "Helvetica Neue", android: "sans-serif" });

export default function Locations() {
  const [refreshing, setRefreshing] = useState(false);

  const [weather, setWeatherCurrent] = useState<any>(null);

  const [text, onChangeText] = useState("");

  const [city, setCity] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  const [weatherLocal, setWeatherCurrentLocal] = useState<any>(null);
  const [cityLocal, setCityLocal] = useState<any>(null);
  const [stateLocal, setStateLocal] = useState<any>(null);

  const [places, setPlaces] = useState<any[]>([]);

  const theme = getStyling(
    weatherLocal?.weatherCondition?.type,
    weatherLocal?.isDaytime,
  );

  async function searchCity() {
    const cords = await getCityLocation(text);
    if (!cords) return;

    setCity(cords.city);
    setState(cords.state);

    const weatherData = await getCurrentWeather(
      cords.locat.latitude,
      cords.locat.longitude,
    );

    const newPlace = {
      city: cords.city,
      state: cords.state,
      lat: cords.locat.latitude,
      lng: cords.locat.longitude,
      weather: weatherData.current,
      condition: weatherData?.current?.weatherCondition?.text,
      high: weatherData.daily?.forecastDays?.[0]?.maxTemperature?.degrees ?? 0,
      low: weatherData.daily?.forecastDays?.[0]?.minTemperature?.degrees ?? 0,
    };

    setPlaces([...places, newPlace]);
    onChangeText("");
  }

  function removePlace(placeToRemove: any) {
    const updatedPlaces = places.filter(
      (place) =>
        !(
          place.city === placeToRemove.city &&
          place.state === placeToRemove.state
        ),
    );
    setPlaces(updatedPlaces);
  }

  async function load() {
    const cordsLocal = await getUserLocation();
    if (!cordsLocal) return;

    setCityLocal(cordsLocal.city);
    setStateLocal(cordsLocal.state);

    const weatherDataLocal = await getCurrentWeather(
      cordsLocal.locat.latitude,
      cordsLocal.locat.longitude,
    );
    setWeatherCurrentLocal(weatherDataLocal.current);

    const currentPlace = {
      city: cordsLocal.city,
      state: cordsLocal.state,
      lat: cordsLocal.locat.latitude,
      lng: cordsLocal.locat.longitude,
      weather: weatherDataLocal.current,
      condition: weatherDataLocal?.current?.weatherCondition?.text,
      high:
        weatherDataLocal.daily?.forecastDays?.[0]?.maxTemperature?.degrees ?? 0,
      low:
        weatherDataLocal.daily?.forecastDays?.[0]?.minTemperature?.degrees ?? 0,
    };

    setPlaces([currentPlace]);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (!weatherLocal) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

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
          <Text style={[styles.places, { color: theme.text }]}>Places</Text>

          <TextInput
            onChangeText={onChangeText}
            value={text}
            style={[styles.searchBar, { color: theme.text }]}
            placeholderTextColor={theme.text + "70"}
            placeholder="Search for a City"
            onSubmitEditing={searchCity}
            returnKeyType="search"
          />
          {places.map((place) => {
            const placeTheme = getStyling(
              place.weather?.weatherCondition?.type,
              place.weather?.isDaytime,
            );
            return (
              <ReanimatedSwipeable
                key={`${place.city}-${place.state}`}
                enabled={!place.isCurrent}
                containerStyle={{ alignSelf: "stretch", marginTop: "5%" }}
                renderRightActions={() => (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => removePlace(place)}
                  >
                    <Text style={{ color: "white" }}>Delete</Text>
                  </Pressable>
                )}
              >
                <LinearGradient
                  colors={placeTheme.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.placeCard}
                >
                  <View style={styles.placeLeft}>
                    <Text style={[styles.placeLocation, { color: theme.text }]}>
                      {place.isCurrent ? "My Location" : `${place.city}`}
                    </Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                      {place.weather?.weatherCondition?.description?.text ??
                        "null"}
                    </Text>
                    <View style={styles.highlowCard}>
                      <Text style={[styles.highLow, { color: theme.text }]}>
                        H: {Math.round(place.high ?? 0)}°
                      </Text>
                      <Text style={[styles.highLow, { color: theme.text }]}>
                        L: {Math.round(place.low ?? 0)}°
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.currentTemp, { color: theme.text }]}>
                    {Math.round(place.weather?.temperature?.degrees ?? 0)}°
                  </Text>
                </LinearGradient>
              </ReanimatedSwipeable>
            );
          })}
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
  places: {
    fontFamily: FONT,
    fontSize: 45,
    fontWeight: "600",
  },
  update: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "300",
    paddingTop: 5,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: FONT,
    fontSize: 17,
    marginTop: "6%",
    marginBottom: "3%",
  },
  placeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  placeLocation: {
    fontFamily: FONT,
    fontSize: 25,
    fontWeight: "700",
    paddingTop: 5,
    marginBottom: 3,
  },
  description: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "300",
    marginBottom: 15,
  },
  currentTemp: {
    fontFamily: FONT,
    fontSize: 60,
    fontWeight: "300",
  },
  highlowCard: {
    flexDirection: "row",
    gap: 12,
  },
  highLow: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: "400",
  },
  placeLeft: {
    flex: 1,
    gap: 4,
  },
  deleteButton: {
    backgroundColor: "#eb827b",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 25,
    marginLeft: 10,
  },
});
