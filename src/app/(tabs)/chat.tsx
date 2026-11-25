import { getChatReply } from "@/services/claudeAPI";
import { getUserLocation } from "@/services/location";
import { getStyling } from "@/services/styling";
import { getCurrentWeather } from "@/services/weatherAPI";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
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
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const FONT = Platform.select({ ios: "Helvetica Neue", android: "sans-serif" });

export default function Chat() {
  const [weatherLocal, setWeatherCurrentLocal] = useState<any>(null);
  const [weatherDaily, setWeatherCurrentDaily] = useState<any>(null);
  const [cityLocal, setCityLocal] = useState<any>(null);
  const [stateLocal, setStateLocal] = useState<any>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [text, onChangeText] = useState("");
  const { question } = useLocalSearchParams();

  const [messages, setMessages] = useState<any[]>([]);

  const theme = getStyling(
    weatherLocal?.weatherCondition?.type,
    weatherLocal?.isDaytime,
  );

  async function sendMessage(messageText: string) {
    const newMessages = [...messages, { role: "user", content: messageText }];
    setMessages(newMessages);
    onChangeText("");

    const claudeReply = await getChatReply(
      newMessages,
      weatherDaily,
      weatherLocal,
      cityLocal,
      stateLocal,
    );
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
    setWeatherCurrentDaily(weatherDataLocal.daily);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => {
    load();
    if (question) sendMessage(question as string);
  }, [question]);

  return (
    <LinearGradient
      colors={theme.colors}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={-100}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.header}>
              <View style={styles.headerSide} />

              <View style={styles.headerCenter}>
                <Text style={[styles.heading, { color: theme.text }]}>
                  Ask Nimbus
                </Text>

                <View style={styles.currentPill}>
                  <Text style={[styles.currentText, { color: theme.text }]}>
                    {Math.round(weatherLocal?.temperature?.degrees ?? 0)}° ·{" "}
                    {cityLocal} ·{" "}
                    {weatherLocal?.weatherCondition?.description?.text}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.headerSide}
                onPress={() => setMessages([])}
              >
                <Text style={[styles.clearText, { color: theme.text }]}>
                  Clear
                </Text>
              </Pressable>
            </View>

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
          </ScrollView>
          <TextInput
            onChangeText={onChangeText}
            value={text}
            style={[styles.inputBar, { color: theme.text }]}
            placeholderTextColor={theme.text + "70"}
            placeholder="Ask about the weather"
            onSubmitEditing={() => sendMessage(text)}
            returnKeyType="search"
          />
        </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 2,
    alignItems: "center",
    gap: 6,
  },
  currentPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  currentText: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "500",
  },
  clearText: {
    fontFamily: FONT,
    fontSize: 16,
    textAlign: "right",
    opacity: 0.7,
  },
  heading: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  headerSide: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  currentCard: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 24,
    marginTop: 15,
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: FONT,
    fontSize: 17,
    marginHorizontal: 24,
    marginBottom: 120,
  },
});
