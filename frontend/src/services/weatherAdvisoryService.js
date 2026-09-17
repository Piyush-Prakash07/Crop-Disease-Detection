// Weather Advisory Service for OpenWeatherMap API & Disease Risk Assessment

const DEFAULT_API_KEY = 'ab8629a8cd7b84053a7b32992f2a65a0';

/**
 * Calculates disease risk level based on relative humidity.
 * Humidity > 80%  -> High Risk (red)
 * Humidity 60-80% -> Medium Risk (yellow)
 * Humidity < 60%  -> Low Risk (green)
 */
export function getDiseaseRisk(humidity) {
  if (humidity > 80) {
    return {
      level: 'High Risk',
      color: 'red',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
      progressColor: '#ef4444',
      score: 85 + Math.min(15, Math.round((humidity - 80) * 0.75)),
      description: 'High humidity detected. High risk of fungal diseases. Apply preventive fungicide immediately.'
    };
  } else if (humidity >= 60) {
    return {
      level: 'Medium Risk',
      color: 'yellow',
      badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      progressColor: '#eab308',
      score: 45 + Math.round((humidity - 60) * 1.5),
      description: 'Moderate humidity. Monitor your crops closely for early signs of disease.'
    };
  } else {
    return {
      level: 'Low Risk',
      color: 'green',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      progressColor: '#10b981',
      score: Math.max(10, Math.round((humidity / 60) * 40)),
      description: 'Weather conditions are favorable. Continue regular crop maintenance.'
    };
  }
}

/**
 * Generates an advisory message based on temperature, humidity, and rainfall.
 */
export function getWeatherAdvisoryMessage(temp, humidity, rainMm) {
  if (humidity > 80) {
    return 'High humidity detected. High risk of fungal diseases. Apply preventive fungicide immediately.';
  } else if (humidity >= 60) {
    return 'Moderate humidity. Monitor your crops closely for early signs of disease.';
  } else {
    return 'Weather conditions are favorable. Continue regular crop maintenance.';
  }
}

/**
 * Fallback mock weather provider when API key is missing or network call fails
 */
function getMockWeatherData(city = 'New Delhi') {
  const mockTemp = 28;
  const mockHumidity = 84; // High risk demo default
  const mockRain = 2.4;
  const risk = getDiseaseRisk(mockHumidity);
  const advisory = getWeatherAdvisoryMessage(mockTemp, mockHumidity, mockRain);

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'IN',
    temp: mockTemp,
    humidity: mockHumidity,
    rainfall: mockRain,
    condition: 'Light Rain',
    icon: '10d',
    risk,
    advisory,
    isMock: true
  };
}

/**
 * Fetches live weather from OpenWeatherMap using coordinates (latitude and longitude)
 */
export async function fetchWeatherByCoords(lat, lon, customApiKey = '') {
  const apiKey = customApiKey.trim() || DEFAULT_API_KEY;

  if (!apiKey) {
    console.warn('No OpenWeatherMap API key provided. Using realistic weather advisor mode.');
    return getMockWeatherData('Your Location');
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OpenWeather API coordinates query returned status ${res.status}`);
    }

    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const rainMm = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;
    const condition = data.weather[0]?.main || 'Clear';
    const icon = data.weather[0]?.icon || '01d';
    
    const risk = getDiseaseRisk(humidity);
    const advisory = getWeatherAdvisoryMessage(temp, humidity, rainMm);

    return {
      city: data.name || 'Your Location',
      country: data.sys?.country || '',
      temp,
      humidity,
      rainfall: rainMm,
      condition,
      icon,
      risk,
      advisory,
      isMock: false
    };
  } catch (err) {
    console.error('Failed to fetch OpenWeatherMap coordinate data:', err);
    return getMockWeatherData('Your Location');
  }
}

/**
 * Fetches live weather from OpenWeatherMap or falls back gracefully
 */
export async function fetchCurrentWeather(city = 'New Delhi', customApiKey = '') {
  const apiKey = customApiKey.trim() || DEFAULT_API_KEY;

  if (!apiKey) {
    console.warn('No OpenWeatherMap API key provided. Using realistic weather advisor mode.');
    return getMockWeatherData(city);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OpenWeather API returned status ${res.status}`);
    }

    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const rainMm = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;
    const condition = data.weather[0]?.main || 'Clear';
    const icon = data.weather[0]?.icon || '01d';
    
    const risk = getDiseaseRisk(humidity);
    const advisory = getWeatherAdvisoryMessage(temp, humidity, rainMm);

    return {
      city: data.name,
      country: data.sys?.country || '',
      temp,
      humidity,
      rainfall: rainMm,
      condition,
      icon,
      risk,
      advisory,
      isMock: false
    };
  } catch (err) {
    console.error('Failed to fetch OpenWeatherMap data:', err);
    return getMockWeatherData(city);
  }
}
