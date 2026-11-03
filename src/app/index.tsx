import { getUserLocation } from '@/services/location';
import { getStyling } from '@/services/styling';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentWeather } from '../services/weatherAPI';


const FONT = Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' });




export default function HomeScreen() {

  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState<any>(null);


  useEffect(() => {

    async function load() {
    const cords = await getUserLocation();
    if (!cords) return null;

    setCity(cords.city);


    getCurrentWeather(cords.locat.latitude, cords.locat.longitude).then((weatherData) => {
      setWeather(weatherData);
    });
  }

  load();
  }, []);
  
  const theme = getStyling(weather?.weatherCondition.type);

return (
<LinearGradient colors={theme.colors} locations={[0, 0.45, 1]} style={styles.gradient}>
  <SafeAreaView style={styles.content}>
    <Text style={[styles.city, {color: theme.text }]}>{city}</Text>
    <Text style={[ styles.hero, {color: theme.text }]}>{Math.round(weather?.temperature?.degrees)}°</Text>
  </SafeAreaView>
</LinearGradient>
);
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  city: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '500',
  },
  hero: {
    paddingTop: '10%',
    fontFamily: FONT,
    fontSize: 132,
    fontWeight: '400',
    letterSpacing: -7.9,
    lineHeight: 132,
  },
});