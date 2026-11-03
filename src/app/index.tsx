import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { getCurrentWeather } from '../services/weatherAPI';



export default function HomeScreen() {

  const [weather, setWeather] = useState<any>(null);


  useEffect(() => {
    getCurrentWeather().then((weatherData) => {
      setWeather(weatherData);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{weather?.temperature?.degrees}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
