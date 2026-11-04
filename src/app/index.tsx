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

  const [weather, setWeather] = useState<any>(null);
  
  const [city, setCity] = useState<any>(null);

  const [state, setState] = useState<any>(null);

  const [text, onChangeText] = useState('');



  useEffect(() => {



    async function load() {
    const cords = await getUserLocation();
    if (!cords) return null;

    setCity(cords.city);
    setState(cords.state);


    getCurrentWeather(cords.locat.latitude, cords.locat.longitude).then((weatherData) => {
      setWeather(weatherData);
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
});