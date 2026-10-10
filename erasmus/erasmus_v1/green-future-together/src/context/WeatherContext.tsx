import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CityData, TelemetryData, CountryData } from '../types';
import { PARTNER_COUNTRIES } from '../data/climateData';
import {
  fetchLiveWeatherData,
  mergeWithLiveTelemetry,
  getStoredCache,
  type LiveWeatherResult,
} from '../services/weatherService';
import { useLanguage } from './LanguageContext';

interface WeatherContextType {
  liveWeather: Record<string, LiveWeatherResult>;
  isWeatherLoading: boolean;
  lastUpdated: string | null;
  refreshWeather: () => Promise<void>;
  getCityTelemetry: (city: CityData) => TelemetryData;
  countriesWithLiveWeather: CountryData[];
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  // İlk renderda görsel kırpışma olmaması için varsa son veriyi al
  const [liveWeather, setLiveWeather] = useState<Record<string, LiveWeatherResult>>(() => {
    return getStoredCache() || {};
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    const cached = getStoredCache();
    if (!cached) return null;
    const first = Object.values(cached)[0];
    return first?.lastUpdated || null;
  });

  // Tüm şehirlerin koordinat listesini çıkar
  const allCitiesCoords = useMemo(() => {
    return PARTNER_COUNTRIES.flatMap((country) =>
      country.cities.map((c) => ({
        id: c.id,
        coordinates: c.coordinates,
      }))
    );
  }, []);

  const loadWeather = useCallback(
    async (force = true) => {
      setIsWeatherLoading(true);
      try {
        const results = await fetchLiveWeatherData(allCitiesCoords, force, language);
        if (results && Object.keys(results).length > 0) {
          setLiveWeather((prev) => ({ ...prev, ...results }));
          const firstKey = Object.keys(results)[0];
          if (results[firstKey]?.lastUpdated) {
            setLastUpdated(results[firstKey].lastUpdated);
          }
        }
      } catch (err) {
        console.warn('[WeatherContext] Canlı meteoroloji verisi yüklenirken sorun oluştu:', err);
      } finally {
        setIsWeatherLoading(false);
      }
    },
    [allCitiesCoords, language]
  );

  // Sayfa her açıldığında ve yenilendiğinde Open-Meteo'dan taze verileri doğrudan çek
  useEffect(() => {
    loadWeather(true);

    // Her 3 dakikada bir arka planda otomatik yenile
    const intervalId = window.setInterval(() => {
      loadWeather(true);
    }, 3 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadWeather]);

  const refreshWeather = useCallback(async () => {
    await loadWeather(true);
  }, [loadWeather]);

  const getCityTelemetry = useCallback(
    (city: CityData): TelemetryData => {
      const live = liveWeather[city.id];
      return mergeWithLiveTelemetry(city.telemetry, live);
    },
    [liveWeather]
  );

  // PARTNER_COUNTRIES nesnesini canlı telemetry verileri ile zenginleştir
  const countriesWithLiveWeather = useMemo(() => {
    return PARTNER_COUNTRIES.map((country) => ({
      ...country,
      cities: country.cities.map((city) => ({
        ...city,
        telemetry: getCityTelemetry(city),
      })),
    }));
  }, [getCityTelemetry]);

  const value = useMemo(
    () => ({
      liveWeather,
      isWeatherLoading,
      lastUpdated,
      refreshWeather,
      getCityTelemetry,
      countriesWithLiveWeather,
    }),
    [
      liveWeather,
      isWeatherLoading,
      lastUpdated,
      refreshWeather,
      getCityTelemetry,
      countriesWithLiveWeather,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
