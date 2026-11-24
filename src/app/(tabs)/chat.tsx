import { getChatReply } from "@/services/claudeAPI";
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
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = Platform.select({ ios: "Helvetica Neue", android: "sans-serif" });

export default function Chat() {
  const [weatherLocal, setWeatherCurrentLocal] = useState<any>(null);
  const [cityLocal, setCityLocal] = useState<any>(null);
  const [stateLocal, setStateLocal] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [text, onChangeText] = useState("");

  const [messages, setMessages] = useState<any[]>([]);

  const theme = getStyling(
    weatherLocal?.weatherCondition?.type,
    weatherLocal?.isDaytime,
  );

  async function sendMessage() {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    onChangeText("");

    const claudeReply = await getChatReply(newMessages, weatherLocal);
    setMessages([...newMessages, { role: "assistant", content: claudeReply }]);
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
          {messages.map((message, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                message.role === "user"
                  ? styles.userBubble
                  : styles.claudeBubble,
              ]}
            >
              <Text style={[styles.bubbleText, { color: theme.text }]}>
                {message.content}
              </Text>
            </View>
          ))}
          <TextInput
            onChangeText={onChangeText}
            value={text}
            style={[styles.inputBar, { color: theme.text }]}
            placeholderTextColor={theme.text + "70"}
            placeholder="Ask about the weather"
            onSubmitEditing={sendMessage}
            returnKeyType="search"
          />
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
  messageList: {
    alignSelf: "stretch",
    gap: 10,
    marginTop: 20,
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginTop: 20,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderBottomRightRadius: 6,
  },
  claudeBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    fontFamily: FONT,
    fontSize: 18,
    lineHeight: 20,
  },
  inputBar: {
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
});
