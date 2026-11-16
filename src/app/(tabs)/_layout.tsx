import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 24,
          bottom: 25,
          height: 80,
          paddingBottom: 0,
          backgroundColor: "rgba(255,255,255,.95)",
          borderTopWidth: 0,
          elevation: 0,
          boxShadow: "0px 10px 32px rgba(30, 40, 60, 0.16)",
          borderRadius: 34,
        },
        tabBarItemStyle: {
          paddingTop: 12,
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="weather-partly-cloudy" size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="radar"
        options={{
          title: "Radar",
          tabBarIcon: () => <MaterialCommunityIcons name="radar" size={28} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Ask",
          tabBarIcon: () => (
            <MaterialCommunityIcons size={28} name="message-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Places",
          tabBarIcon: () => (
            <MaterialCommunityIcons size={28} name="map-marker-outline" />
          ),
        }}
      />
    </Tabs>
  );
}
