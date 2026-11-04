
export type WeatherTheme = {
  colors: readonly [string, string, string]; 
  text: string;
};

export function getStyling(type?: string): WeatherTheme {
  switch (type) {
    // Clear
    case 'CLEAR':
    case 'MOSTLY_CLEAR':
      return { colors: ['#8ec2fd', '#92d5f4', '#f9edd5'], text: '#151b21' };

    // Partly cloudy
    case 'PARTLY_CLOUDY':
      return { colors: ['#9ac2e9', '#c3e4f2', '#feebd6'], text: '#151b21' };

    // Cloudy
    case 'MOSTLY_CLOUDY':
    case 'CLOUDY':
      return { colors: ['#b9bcd1', '#b5c3d1', '#e5ddd0'], text: '#151b21' };

    // Windy
    case 'WINDY':
    case 'WIND_AND_RAIN':
      return { colors: ['#95cfe1', '#b3e3dd', '#e3f5df'], text: '#151b21' };

    // Light rain
    case 'LIGHT_RAIN_SHOWERS':
    case 'CHANCE_OF_SHOWERS':
    case 'SCATTERED_SHOWERS':
    case 'RAIN_SHOWERS':
    case 'LIGHT_TO_MODERATE_RAIN':
    case 'RAIN':
    case 'LIGHT_RAIN':
      return { colors: ['#adc0d8', '#b3d4e2', '#b5d6d3'], text: '#151b21' };

    // Heavy rain
    case 'HEAVY_RAIN_SHOWERS':
    case 'MODERATE_TO_HEAVY_RAIN':
    case 'HEAVY_RAIN':
    case 'RAIN_PERIODICALLY_HEAVY':
      return { colors: ['#0d1b2d', '#053343', '#145154'], text: '#ebeff4' };

    // Snow
    case 'LIGHT_SNOW_SHOWERS':
    case 'CHANCE_OF_SNOW_SHOWERS':
    case 'SCATTERED_SNOW_SHOWERS':
    case 'SNOW_SHOWERS':
    case 'HEAVY_SNOW_SHOWERS':
    case 'LIGHT_TO_MODERATE_SNOW':
    case 'MODERATE_TO_HEAVY_SNOW':
    case 'SNOW':
    case 'LIGHT_SNOW':
    case 'HEAVY_SNOW':
    case 'SNOWSTORM':
    case 'SNOW_PERIODICALLY_HEAVY':
    case 'HEAVY_SNOW_STORM':
    case 'BLOWING_SNOW':
    case 'RAIN_AND_SNOW':
      return { colors: ['#bbcde1', '#d7e8f1', '#f7f3fe'], text: '#151b21' };

    // Storms
    case 'HAIL':
    case 'HAIL_SHOWERS':
    case 'THUNDERSTORM':
    case 'THUNDERSHOWER':
    case 'LIGHT_THUNDERSTORM_RAIN':
    case 'SCATTERED_THUNDERSTORMS':
    case 'HEAVY_THUNDERSTORM':
      return { colors: ['#100a23', '#2b1540', '#5e244d'], text: '#ebeff4' };

    default:
      return { colors: ['#b9bcd1', '#b5c3d1', '#e5ddd0'], text: '#151b21' };
  }
}