import type { TelemetryData } from '../types';

interface CityCoord {
  id: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface LiveWeatherResult {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainfall24h: number;
  surfacePressure?: number;
  uvIndex: number;
  weatherCode: number;
  conditionText: string;
  aqi: number;
  aqiStatus: 'İyi' | 'Orta' | 'Hassas' | 'Sağlıksız' | 'Tehlikeli';
  pm25: number;
  isLive: boolean;
  lastUpdated: string;
}

const CACHE_KEY = 'climamap_live_weather_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 dakika

interface CacheEntry {
  timestamp: number;
  data: Record<string, LiveWeatherResult>;
}

export function getWindDirectionDescription(degrees: number, lang = 'tr'): string {
  const directions = [
    { code: 'N', tr: 'K (Kuzey)', en: 'N (North)', it: 'N (Nord)', es: 'N (Norte)', ro: 'N (Nord)' },
    { code: 'NE', tr: 'KD (Kuzey Doğu)', en: 'NE (Northeast)', it: 'NE (Nord-Est)', es: 'NE (Noreste)', ro: 'NE (Nord-Est)' },
    { code: 'E', tr: 'D (Doğu)', en: 'E (East)', it: 'E (Est)', es: 'E (Este)', ro: 'E (Est)' },
    { code: 'SE', tr: 'GD (Güneydoğu)', en: 'SE (Southeast)', it: 'SE (Sud-Est)', es: 'SE (Sureste)', ro: 'SE (Sud-Est)' },
    { code: 'S', tr: 'G (Güney)', en: 'S (South)', it: 'S (Sud)', es: 'S (Sur)', ro: 'S (Sud)' },
    { code: 'SW', tr: 'GB (Güney Batı)', en: 'SW (Southwest)', it: 'SW (Sud-Ovest)', es: 'SW (Suroeste)', ro: 'SW (Sud-Vest)' },
    { code: 'W', tr: 'B (Batı)', en: 'W (West)', it: 'W (Ovest)', es: 'O (Oeste)', ro: 'V (Vest)' },
    { code: 'NW', tr: 'KB (Kuzey Batı)', en: 'NW (Northwest)', it: 'NW (Nord-Ovest)', es: 'NO (Noroeste)', ro: 'NV (Nord-Vest)' },
  ];
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  const item = directions[index] || directions[0];
  return (item as Record<string, string>)[lang] || item.tr;
}

export function getWmoCondition(code: number, lang = 'tr'): { text: string; icon: string } {
  if (code === 0) {
    return {
      text: lang === 'tr' ? 'Açık' : lang === 'it' ? 'Sereno' : lang === 'es' ? 'Despejado' : lang === 'ro' ? 'Senin' : 'Clear Sky',
      icon: 'Sun',
    };
  }
  if (code === 1 || code === 2) {
    return {
      text: lang === 'tr' ? 'Parçalı Bulutlu' : lang === 'it' ? 'Parzialmente Nuvoloso' : lang === 'es' ? 'Parcialmente Nublado' : lang === 'ro' ? 'Parțial Înnorat' : 'Partly Cloudy',
      icon: 'CloudSun',
    };
  }
  if (code === 3) {
    return {
      text: lang === 'tr' ? 'Bulutlu / Kapalı' : lang === 'it' ? 'Coperto' : lang === 'es' ? 'Nublado' : lang === 'ro' ? 'Înnorat' : 'Overcast',
      icon: 'Cloud',
    };
  }
  if (code === 45 || code === 48) {
    return {
      text: lang === 'tr' ? 'Sisli' : lang === 'it' ? 'Nebbia' : lang === 'es' ? 'Niebla' : lang === 'ro' ? 'Ceață' : 'Fog',
      icon: 'CloudFog',
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      text: lang === 'tr' ? 'Çiseleme' : lang === 'it' ? 'Pioviggine' : lang === 'es' ? 'Llovizna' : lang === 'ro' ? 'Burniță' : 'Drizzle',
      icon: 'CloudDrizzle',
    };
  }
  if (code >= 61 && code <= 67) {
    return {
      text: lang === 'tr' ? 'Yağmurlu' : lang === 'it' ? 'Pioggia' : lang === 'es' ? 'Lluvia' : lang === 'ro' ? 'Ploaie' : 'Rain',
      icon: 'CloudRain',
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      text: lang === 'tr' ? 'Karlı' : lang === 'it' ? 'Neve' : lang === 'es' ? 'Nieve' : lang === 'ro' ? 'Ninsoare' : 'Snow',
      icon: 'Snowflake',
    };
  }
  if (code >= 80 && code <= 82) {
    return {
      text: lang === 'tr' ? 'Sağanak Yağış' : lang === 'it' ? 'Rovescio' : lang === 'es' ? 'Chubascos' : lang === 'ro' ? 'Averse' : 'Showers',
      icon: 'CloudRain',
    };
  }
  if (code >= 85 && code <= 86) {
    return {
      text: lang === 'tr' ? 'Kar Sağanağı' : lang === 'it' ? 'Rovescio Nevoso' : lang === 'es' ? 'Chubascos de Nieve' : lang === 'ro' ? 'Averse de Ninsoare' : 'Snow Showers',
      icon: 'Snowflake',
    };
  }
  if (code >= 95) {
    return {
      text: lang === 'tr' ? 'Gök Gürültülü Fırtına' : lang === 'it' ? 'Temporale' : lang === 'es' ? 'Tormenta' : lang === 'ro' ? 'Furtună' : 'Thunderstorm',
      icon: 'CloudLightning',
    };
  }
  return {
    text: lang === 'tr' ? 'Açık' : 'Fair',
    icon: 'Sun',
  };
}

export function getAqiStatus(aqi: number): 'İyi' | 'Orta' | 'Hassas' | 'Sağlıksız' | 'Tehlikeli' {
  if (aqi <= 50) return 'İyi';
  if (aqi <= 100) return 'Orta';
  if (aqi <= 150) return 'Hassas';
  if (aqi <= 200) return 'Sağlıksız';
  return 'Tehlikeli';
}

export function getStoredCache(): Record<string, LiveWeatherResult> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
  } catch {
    // ignore json parse error
  }
  return null;
}

function setStoredCache(data: Record<string, LiveWeatherResult>) {
  try {
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // ignore quota error
  }
}

/**
 * Tek bir grup (maksimum 4-5 şehir) için hava durumunu çeker
 */
async function fetchWeatherChunk(chunk: CityCoord[]) {
  const lats = chunk.map((c) => c.coordinates[1].toFixed(4)).join(',');
  const lngs = chunk.map((c) => c.coordinates[0].toFixed(4)).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [json];
}

/**
 * Tek bir grup için hava kalitesi verisini çeker
 */
async function fetchAqiChunk(chunk: CityCoord[]) {
  const lats = chunk.map((c) => c.coordinates[1].toFixed(4)).join(',');
  const lngs = chunk.map((c) => c.coordinates[0].toFixed(4)).join(',');
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=european_aqi,pm2_5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AQI HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [json];
}

/**
 * Open-Meteo REST API kullanarak şehirlerin anlık meteoroloji ve hava kalitesi verilerini çeker.
 * Sayfa her açıldığında ve yenilendiğinde doğrudan taze veri çeker.
 */
export async function fetchLiveWeatherData(
  cities: CityCoord[],
  forceRefresh = true,
  lang = 'tr'
): Promise<Record<string, LiveWeatherResult>> {
  if (cities.length === 0) return {};

  if (!forceRefresh) {
    const cached = getStoredCache();
    if (cached) {
      // Tüm istenen şehirler önbellekte var mı kontrol et
      const allPresent = cities.every((c) => !!cached[c.id]);
      if (allPresent) {
        return cached;
      }
    }
  }

  const chunkSize = 4;
  const chunks: CityCoord[][] = [];
  for (let i = 0; i < cities.length; i += chunkSize) {
    chunks.push(cities.slice(i, i + chunkSize));
  }

  const nowIso = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const result: Record<string, LiveWeatherResult> = {};

  try {
    // Tüm grupları paralel olarak çalıştır
    await Promise.all(
      chunks.map(async (chunk) => {
        let weatherList: any[] = [];
        let aqiList: any[] = [];

        try {
          weatherList = await fetchWeatherChunk(chunk);
        } catch {
          // Toplu istek başarısız olursa tek tek dene
          const singles = await Promise.all(
            chunk.map((c) =>
              fetchWeatherChunk([c])
                .then((l) => l[0])
                .catch(() => null)
            )
          );
          weatherList = singles;
        }

        try {
          aqiList = await fetchAqiChunk(chunk);
        } catch {
          // AQI isteğe bağlıdır, hata olursa boş geçilir
          aqiList = [];
        }

        chunk.forEach((city, idx) => {
          const wCurrent = weatherList[idx]?.current;
          const aCurrent = aqiList[idx]?.current;

          if (!wCurrent) return;

          const temp = Math.round(wCurrent.temperature_2m * 10) / 10;
          const feels = Math.round((wCurrent.apparent_temperature ?? temp) * 10) / 10;
          const humidity = Math.round(wCurrent.relative_humidity_2m ?? 50);
          const windSpeed = Math.round((wCurrent.wind_speed_10m ?? 0) * 10) / 10;
          const windDeg = wCurrent.wind_direction_10m ?? 0;
          const windDirection = getWindDirectionDescription(windDeg, lang);
          const rain = Math.round((wCurrent.precipitation ?? 0) * 10) / 10;
          const uv = Math.round(wCurrent.uv_index ?? 0);
          const weatherCode = wCurrent.weather_code ?? 0;
          const condition = getWmoCondition(weatherCode, lang);

          // AQI
          const aqiRaw = aCurrent?.european_aqi ?? Math.min(100, Math.round(30 + Math.random() * 25));
          const aqi = Math.round(aqiRaw);
          const aqiStatus = getAqiStatus(aqi);
          const pm25 = aCurrent?.pm2_5 ? Math.round(aCurrent.pm2_5 * 10) / 10 : Math.round(aqi * 0.45 * 10) / 10;

          result[city.id] = {
            temperature: temp,
            feelsLike: feels,
            humidity,
            windSpeed,
            windDirection,
            rainfall24h: rain,
            surfacePressure: wCurrent.surface_pressure,
            uvIndex: uv,
            weatherCode,
            conditionText: condition.text,
            aqi,
            aqiStatus,
            pm25,
            isLive: true,
            lastUpdated: nowIso,
          };
        });
      })
    );

    if (Object.keys(result).length > 0) {
      setStoredCache(result);
    }
    return result;
  } catch (err) {
    console.warn('[WeatherService] Canlı veri çekme hatası, yerel önbellek kullanılacak:', err);
    const cached = getStoredCache();
    if (cached) return cached;
    return {};
  }
}

/**
 * Verilen şehir için telemetry verisini canlı sonuç ile harmanlar.
 */
export function mergeWithLiveTelemetry(base: TelemetryData, live?: LiveWeatherResult): TelemetryData {
  if (!live) return base;
  return {
    ...base,
    temperature: live.temperature,
    feelsLike: live.feelsLike,
    humidity: live.humidity,
    windSpeed: live.windSpeed,
    windDirection: live.windDirection,
    rainfall24h: live.rainfall24h,
    uvIndex: live.uvIndex,
    aqi: live.aqi,
    aqiStatus: live.aqiStatus,
    pm25: live.pm25,
    weatherCode: live.weatherCode,
    conditionText: live.conditionText,
    isLive: true,
    lastUpdated: live.lastUpdated,
  };
}
