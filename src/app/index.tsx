import { getUserLocation } from '@/services/location';
import { getStyling } from '@/services/styling';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentWeather } from '../services/weatherAPI';



const FONT = Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' });


export default function HomeScreen() {

  const [weather, setWeatherCurrent] = useState<any>(null);

  const [weatherHourly, setWeatherHourly] = useState<any>(null);

  const [city, setCity] = useState<any>(null);

  const [state, setState] = useState<any>(null);

  const [text, onChangeText] = useState('');


const hours = (weatherHourly?.forecastHours ?? []).slice(1, 9).map((hour: any) => ({
  time: hour.displayDateTime.hours,
  temp: Math.round(hour.temperature.degrees),
  condition: hour.weatherCondition.type,
}));

//const now = {
//  time: "now",
//  temp: Math.round(weather?.temperature?.degrees),
//  condition: weather?.weatherCondition?.type,
//};


const maxTemp = Math.max(...hours.map((hour: any) => hour.temp));
const minTemp = Math.min(...hours.map((hour: any) => hour.temp));




  useEffect(() => {

    async function load() {

    const cords = await getUserLocation();
    if (!cords) return null;

    setCity(cords.city);
    setState(cords.state);


    getCurrentWeather(cords.locat.latitude, cords.locat.longitude).then((weatherData) => {
      setWeatherCurrent(weatherData.current);
      setWeatherHourly(weatherData.hourly);
    });
  }

  load();
  }, []);
  
  const theme = getStyling(weather?.weatherCondition?.type);

return (
<LinearGradient colors={theme.colors} locations={[0, 0.45, 1]} style={styles.gradient}>  
  <SafeAreaView style={styles.content}>
    <Text style={[styles.city, {color: theme.text }]}>{city}, {state}</Text>
    <Text style={[ styles.hero, {color: theme.text }]}>{Math.round(weather?.temperature?.degrees)}°</Text>
    <Text style={[ styles.condition, {color: theme.text }]}>{weather?.weatherCondition?.description?.text}</Text>
    <View style={styles.rangeRow}>
      <Text style={[ styles.range, {color: theme.text }]}>High: {Math.round(weather?.currentConditionsHistory?.maxTemperature?.degrees)}°</Text>
      <Text style={[ styles.range, {color: theme.text }]}>Low: {Math.round(weather?.currentConditionsHistory?.minTemperature?.degrees)}°</Text>
      <Text style={[ styles.range, {color: theme.text }]}>Feels like: {Math.round(weather?.feelsLikeTemperature?.degrees)}°</Text>
    </View>
    <Text style={[ styles.body, {color: theme.text }]}>{"Clouds break up after 4 PM. Light rain likely Tuesday morning"}</Text>
    <View style={styles.inputRow}>
      <TextInput
            onChangeText={onChangeText}
            value={text}
            style={[styles.aiBar, {color: theme.text }]}
            placeholderTextColor={theme.text + '70'}
            placeholder="Ask about the weather"
          />

      <Pressable style={styles.radarButton} onPress={() => router.navigate('/radar')} >
        <Text style={{ color: theme.text }}>Radar</Text>
      </Pressable>
    </View>
    <View style={styles.hourlyCard}>
      {hours.map((hour: any) => (
        <View key={hour.time} style={styles.hourCol}>
          <Text style={{ color: theme.text }}>{hour.temp}°</Text>
          <View key={hour.time} style={[styles.bar, { backgroundColor: getStyling(hour.condition).colors[0], height: 30 + ((hour.temp - minTemp) / (maxTemp - minTemp)) * 66 }]} />
          <Text style={{ color: theme.text }}>{hour.time}</Text>
        </View>
      ))}
    </View>

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
    fontSize: 20,
    fontWeight: '600',
  },
  hero: {
    paddingTop: '14%',
    paddingLeft: '7%',
    fontFamily: FONT,
    fontSize: 135,
    fontWeight: '300',
    letterSpacing: -7.9,
    lineHeight: 132
  },
  condition: {
    fontFamily: FONT,
    fontSize: 26,
    lineHeight: 132,
    fontWeight: '400',
    marginTop: '-10%',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  range: {
    fontFamily: FONT,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    marginTop: '-11%',
},
  body: {
    fontFamily: FONT,
    fontSize: 23,
    lineHeight: 25,
    fontWeight: '200',
    marginTop: '1%',
},
  aiBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',  
    borderRadius: 25,                          
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: FONT,
    fontSize: 17,
    marginTop: '3%',  

},
  inputRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',   
    alignItems: 'center',   
    gap: 15,
    marginTop: '5%',
},
  radarButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontFamily: FONT,
    fontSize: 20,
    marginTop: '3%',  
  },
  hourlyCard: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'stretch',
    height: '23%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    marginTop: 20,
    padding: 16
},
  bar: {
    width: 35,
    height: 100,
    borderRadius: 10,
},
hourCol: {
  flex: 1,
  alignItems: 'center',
  gap: 6,
  justifyContent: 'flex-end',
},
});