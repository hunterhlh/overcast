import { getCityLocation, getUserLocation } from "@/services/location";
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
  TextInput,
  View,
} from "react-native";
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



async function searchCity(){


      const cords = await getCityLocation(text);
    if (!cords) return;

    setCity(cords.city);
    setState(cords.state);

    const weatherData = await getCurrentWeather(
      cords.locat.latitude,
      cords.locat.longitude,
    );
    setWeatherCurrent(weatherData.current);


    const newPlace = {
    city: cords.city,
    state: cords.state,
    lat: cords.locat.latitude,
    lng: cords.locat.longitude,
    weather: weatherData.current,
    condition: weatherData?.current?.weatherCondition?.text,
  };

  setPlaces([...places, newPlace]);
  onChangeText("");
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
{places.map((place) => (
  <View key={`${place.city}-${place.state}`} style={styles.placeCard}>
    <Text style={[styles.placeLocation, { color: theme.text }]}>
      {place.isCurrent ? "My Location" : `${place.city}`}
    </Text>
    <Text style={{ color: theme.text }}>
      {(place.condition ?? 0)}
    </Text>
    <Text style={{ color: theme.text }}>
      {Math.round(place.weather?.temperature?.degrees ?? 0)}°
    </Text>
    <Text style={{ color: theme.text }}>
      {Math.round(place.weather?.temperature?.degrees ?? 0)}°
    </Text>
  </View>
))}
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
    marginBottom: "3%"
  },
    placeCard: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: "5%",
  },
    placeLocation: {
    fontFamily: FONT,
    fontSize: 25,
    fontWeight: "600",
    paddingTop: 5,
    marginBottom: 20,
  },
});
