import { getUserLocation } from "@/services/location";
import { getStyling } from "@/services/styling";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentWeather } from "../services/weatherAPI";

const FONT = Platform.select({ ios: "Helvetica Neue", android: "sans-serif" });

function convertDay(year: number, month: number, day: number) {
  const dayOfMonth = new Date().getDate();
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const date = new Date(year, month - 1, day);
  const dayName = daysOfWeek[date.getDay()];

  if (dayOfMonth === day) {
    return "Today";
  } else {
    return dayName;
  }
}

const formatTime = (hourlyHour: Date) => {
  return hourlyHour.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
};

export default function HomeScreen() {
  const [weather, setWeatherCurrent] = useState<any>(null);

  const [weatherHourly, setWeatherHourly] = useState<any>(null);

  const [weatherDaily, setWeatherDaily] = useState<any>(null);

  const [city, setCity] = useState<any>(null);

  const [state, setState] = useState<any>(null);

  const [text, onChangeText] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const hours = (weatherHourly?.forecastHours ?? [])
    .slice(1, 9)
    .map((hour: any) => ({
      time: formatTime(
        new Date(
          hour.displayDateTime.year,
          hour.displayDateTime.month - 1,
          hour.displayDateTime.day,
          hour.displayDateTime.hours,
        ),
      ),
      temp: Math.round(hour.temperature.degrees),
      condition: hour.weatherCondition.type,
    }));

  const days = (weatherDaily?.forecastDays ?? []).map((day: any) => ({
    dayName: convertDay(
      day.displayDate.year,
      day.displayDate.month,
      day.displayDate.day,
    ),
    condition: day.daytimeForecast.weatherCondition.description.text,
    rainPercent: day.daytimeForecast.precipitation.percent,
    tempHigh: Math.round(day.maxTemperature.degrees),
    tempLow: Math.round(day.minTemperature.degrees),
  }));

  async function load() {
    const cords = await getUserLocation();
    if (!cords) return null;

    setCity(cords.city);
    setState(cords.state);

    getCurrentWeather(cords.locat.latitude, cords.locat.longitude).then(
      (weatherData) => {
        setWeatherCurrent(weatherData.current);
        setWeatherHourly(weatherData.hourly);
        setWeatherDaily(weatherData.daily);
      },
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const maxTemp = Math.max(...hours.map((hour: any) => hour.temp));
  const minTemp = Math.min(...hours.map((hour: any) => hour.temp));

  useEffect(() => {}, []);

  const theme = getStyling(weather?.weatherCondition?.type);

  return (
    <LinearGradient
      colors={theme.colors}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={[styles.city, { color: theme.text }]}>
            {city}, {state}
          </Text>
          <Text style={[styles.hero, { color: theme.text }]}>
            {Math.round(weather?.temperature?.degrees)}°
          </Text>
          <Text style={[styles.condition, { color: theme.text }]}>
            {weather?.weatherCondition?.description?.text}
          </Text>
          <View style={styles.rangeRow}>
            <Text style={[styles.range, { color: theme.text }]}>
              High:{" "}
              {Math.round(
                weatherDaily?.forecastDays?.[0]?.maxTemperature?.degrees,
              )}
              °
            </Text>
            <Text style={[styles.range, { color: theme.text }]}>
              Low:{" "}
              {Math.round(
                weatherDaily?.forecastDays?.[0]?.minTemperature?.degrees,
              )}
              °
            </Text>
            <Text style={[styles.range, { color: theme.text }]}>
              Feels like: {Math.round(weather?.feelsLikeTemperature?.degrees)}°
            </Text>
          </View>
          <Text style={[styles.body, { color: theme.text }]}>
            {"Clouds break up after 4 PM. Light rain likely Tuesday morning"}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              onChangeText={onChangeText}
              value={text}
              style={[styles.aiBar, { color: theme.text }]}
              placeholderTextColor={theme.text + "70"}
              placeholder="Ask about the weather"
            />

            <Pressable
              style={styles.radarButton}
              onPress={() => router.navigate("/radar")}
            >
              <Text style={{ color: theme.text }}>Radar</Text>
            </Pressable>
          </View>
          <View style={styles.hourlyCard}>
            <Text style={{ color: theme.text }}>HOURLY</Text>
            <View style={{ flexDirection: "row", gap: 6, paddingTop: 10 }}>
              {hours.map((hour: any) => (
                <View key={hour.time} style={styles.hourCol}>
                  <Text style={{ color: theme.text }}>{hour.temp}°</Text>
                  <View
                    key={hour.time}
                    style={[
                      styles.bar,
                      {
                        backgroundColor: getStyling(hour.condition).colors[0],
                        height:
                          30 +
                          ((hour.temp - minTemp) / (maxTemp - minTemp)) * 66,
                      },
                    ]}
                  />
                  <Text style={{ color: theme.text }}>{hour.time}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.dailyCard}>
            {days.map((day: any) => (
              <View
                key={day.day}
                style={[
                  styles.dayRow,
                  { borderBottomColor: theme.text + "80" },
                ]}
              >
                <Text style={[styles.dayName, { color: theme.text }]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayCondition, { color: theme.text }]}>
                  {day.condition}
                </Text>
                {day.rainPercent > 15 && (
                  <Text style={styles.dayRain}>{day.rainPercent}%</Text>
                )}
                <Text style={[styles.dayHigh, { color: theme.text }]}>
                  {day.tempHigh}°
                </Text>
                <Text style={[styles.dayLow, { color: theme.text }]}>
                  {day.tempLow}°
                </Text>
              </View>
            ))}
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
  },
  city: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "600",
  },
  hero: {
    paddingTop: "12%",
    paddingLeft: "7%",
    fontFamily: FONT,
    fontSize: 135,
    fontWeight: "300",
    letterSpacing: -7.9,
    lineHeight: 132,
  },
  condition: {
    fontFamily: FONT,
    fontSize: 26,
    lineHeight: 132,
    fontWeight: "400",
    marginTop: "-10%",
  },
  rangeRow: {
    flexDirection: "row",
    gap: 12,
  },
  range: {
    fontFamily: FONT,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
    marginTop: "-11%",
  },
  body: {
    fontFamily: FONT,
    fontSize: 23,
    lineHeight: 25,
    fontWeight: "200",
    marginTop: "1%",
  },
  aiBar: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: FONT,
    fontSize: 17,
    marginTop: "3%",
  },
  inputRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 15,
    marginTop: "5%",
  },
  radarButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontFamily: FONT,
    fontSize: 20,
    marginTop: "3%",
  },
  hourlyCard: {
    alignSelf: "stretch",
    height: "200",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 24,
    marginTop: 15,
    padding: 16,
  },
  bar: {
    width: 35,
    height: 100,
    borderRadius: 10,
  },
  hourCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    justifyContent: "flex-end",
  },
  dailyCard: {
    flexDirection: "column",
    gap: 6,
    alignSelf: "stretch",
    height: "500",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 24,
    marginTop: 20,
    padding: 16,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dayText: {
    fontWeight: "bold",
  },
  dayName: {
    width: 60,
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "500",
  },
  dayCondition: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "300",
  },
  dayRain: {
    width: 30,
    fontFamily: FONT,
    fontSize: 15,
    color: "#62a0ca",
  },
  dayHigh: {
    width: 40,
    textAlign: "right",
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  dayLow: {
    width: 34,
    textAlign: "right",
    fontFamily: FONT,
    fontSize: 17,
    fontVariant: ["tabular-nums"],
    fontWeight: "300",
  },
});
