export type WeatherTheme = {
  colors: readonly [string, string, string];
  text: string;
};

export function getStyling(
  type?: string,
  isDaytime: boolean = true,
): WeatherTheme {
  switch (type) {
    // Clear
    case "CLEAR":
    case "MOSTLY_CLEAR":
      return isDaytime
        ? { colors: ["#8ec2fd", "#92d5f4", "#f9edd5"], text: "#151b21" }
        : { colors: ["#0c0a28", "#0f1a3d", "#44294c"], text: "#ebeff4" };

    // Partly cloudy
    case "PARTLY_CLOUDY":
      return isDaytime
        ? { colors: ["#9ac2e9", "#c3e4f2", "#feebd6"], text: "#151b21" }
        : { colors: ["#121a33", "#1f2a48", "#3d3a55"], text: "#ebeff4" };

    // Cloudy
    case "MOSTLY_CLOUDY":
    case "CLOUDY":
      return isDaytime
        ? { colors: ["#b9bcd1", "#b5c3d1", "#e5ddd0"], text: "#151b21" }
        : { colors: ["#1a1d26", "#262b36", "#3a3d47"], text: "#ebeff4" };

    // Windy
    case "WINDY":
    case "WIND_AND_RAIN":
      return isDaytime
        ? { colors: ["#95cfe1", "#b3e3dd", "#e3f5df"], text: "#151b21" }
        : { colors: ["#0d1f2a", "#163341", "#2c4b52"], text: "#ebeff4" };

    // Light rain
    case "LIGHT_RAIN_SHOWERS":
    case "CHANCE_OF_SHOWERS":
    case "SCATTERED_SHOWERS":
    case "RAIN_SHOWERS":
    case "LIGHT_TO_MODERATE_RAIN":
    case "RAIN":
    case "LIGHT_RAIN":
      return isDaytime
        ? { colors: ["#adc0d8", "#b3d4e2", "#b5d6d3"], text: "#151b21" }
        : { colors: ["#141c2a", "#1d2b3b", "#2d3f4c"], text: "#ebeff4" };

    // Heavy rain
    case "HEAVY_RAIN_SHOWERS":
    case "MODERATE_TO_HEAVY_RAIN":
    case "HEAVY_RAIN":
    case "RAIN_PERIODICALLY_HEAVY":
      return isDaytime
        ? { colors: ["#0d1b2d", "#053343", "#145154"], text: "#ebeff4" }
        : { colors: ["#070d17", "#0a1c26", "#12333a"], text: "#ebeff4" };

    // Snow
    case "LIGHT_SNOW_SHOWERS":
    case "CHANCE_OF_SNOW_SHOWERS":
    case "SCATTERED_SNOW_SHOWERS":
    case "SNOW_SHOWERS":
    case "HEAVY_SNOW_SHOWERS":
    case "LIGHT_TO_MODERATE_SNOW":
    case "MODERATE_TO_HEAVY_SNOW":
    case "SNOW":
    case "LIGHT_SNOW":
    case "HEAVY_SNOW":
    case "SNOWSTORM":
    case "SNOW_PERIODICALLY_HEAVY":
    case "HEAVY_SNOW_STORM":
    case "BLOWING_SNOW":
    case "RAIN_AND_SNOW":
      return isDaytime
        ? { colors: ["#bbcde1", "#d7e8f1", "#f7f3fe"], text: "#151b21" }
        : { colors: ["#1b2233", "#2b3549", "#4a5268"], text: "#ebeff4" };

    // Storms
    case "HAIL":
    case "HAIL_SHOWERS":
    case "THUNDERSTORM":
    case "THUNDERSHOWER":
    case "LIGHT_THUNDERSTORM_RAIN":
    case "SCATTERED_THUNDERSTORMS":
    case "HEAVY_THUNDERSTORM":
      return isDaytime
        ? { colors: ["#100a23", "#2b1540", "#5e244d"], text: "#ebeff4" }
        : { colors: ["#08061a", "#1a0f2e", "#3d1838"], text: "#ebeff4" };

    // TYPE_UNSPECIFIED or anything new Google adds
    default:
      return isDaytime
        ? { colors: ["#b9bcd1", "#b5c3d1", "#e5ddd0"], text: "#151b21" }
        : { colors: ["#1a1d26", "#262b36", "#3a3d47"], text: "#ebeff4" };
  }
}
