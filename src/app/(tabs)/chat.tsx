import { getUserLocation } from "@/services/location";
import { getStyling } from "@/services/styling";
import { getCurrentWeather } from "@/services/weatherAPI";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const [weatherLocal, setWeatherCurrentLocal] = useState<any>(null);
  const [cityLocal, setCityLocal] = useState<any>(null);
  const [stateLocal, setStateLocal] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

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
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Chat</Text>
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
});
