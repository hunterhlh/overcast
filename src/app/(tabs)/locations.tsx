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

  const theme = getStyling(
    weatherLocal?.weatherCondition?.type,
    weatherLocal?.isDaytime,
  );

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

    const cords = await getCityLocation(text);
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
          <Text style={[styles.places, { color: theme.text }]}>Places</Text>

          <TextInput
            onChangeText={onChangeText}
            value={text}
            style={[styles.searchBar, { color: theme.text }]}
            placeholderTextColor={theme.text + "70"}
            placeholder="Search for a City"
            onSubmitEditing={load}
            returnKeyType="search"
          />
          <View>
            <Text>
              {city}, {state}
            </Text>
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
  },
});
