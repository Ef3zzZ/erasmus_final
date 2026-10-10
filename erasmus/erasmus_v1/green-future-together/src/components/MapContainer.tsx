import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { AppStage, CountryData, CityData, ClimateAnomalyType, CountryRegion } from '../types';
import { PARTNER_COUNTRIES } from '../data/climateData';
import { COUNTRY_REGIONS } from '../data/countryRegionsData';
import { CLIMATE_ANOMALY_CONFIG } from '../utils/climateAnomaly';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader';
import { useLanguage } from '../context/LanguageContext';
import { useWeather } from '../context/WeatherContext';
import { RotateCw } from 'lucide-react';

interface MapContainerProps {
  stage: AppStage;
  theme: 'dark' | 'light';
  selectedCountry: CountryData | null;
  selectedCity: CityData | null;
  activeAnomaly: ClimateAnomalyType;
  isCountryScanned: boolean;
  overrideAllNormal: boolean;
  onSelectCountry: (country: CountryData) => void;
  onSelectCity: (city: CityData) => void;
  onSelectRegion?: (region: CountryRegion | null) => void;
}

const getGoogleTiles = (lang: string) => [
  `https://mt0.google.com/vt/lyrs=m&hl=${lang}&x={x}&y={y}&z={z}`,
  `https://mt1.google.com/vt/lyrs=m&hl=${lang}&x={x}&y={y}&z={z}`,
  `https://mt2.google.com/vt/lyrs=m&hl=${lang}&x={x}&y={y}&z={z}`,
  `https://mt3.google.com/vt/lyrs=m&hl=${lang}&x={x}&y={y}&z={z}`,
];

export const MapContainer: React.FC<MapContainerProps> = ({
  stage,
  theme,
  selectedCountry,
  selectedCity,
  activeAnomaly,
  isCountryScanned,
  overrideAllNormal,
  onSelectCountry,
  onSelectCity,
  onSelectRegion,
}) => {
  const { language, getCountryName, getCityName, getRegionName, t } = useLanguage();
  const { countriesWithLiveWeather, lastUpdated, isWeatherLoading, refreshWeather } = useWeather();
  const countries = countriesWithLiveWeather.length > 0 ? countriesWithLiveWeather : PARTNER_COUNTRIES;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialThemeRef = useRef(theme);
  const initialLanguageRef = useRef(language);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const prevViewRef = useRef<{ stage: AppStage; countryId?: string; cityId?: string }>({
    stage,
    countryId: selectedCountry?.id,
    cityId: selectedCity?.id,
  });

  // Background check for official Google Maps JS SDK (with fallback resilience)
  useEffect(() => {
    loadGoogleMapsApi().catch((err) => {
      console.warn('[Google Maps] Fallback aktif, yüksek çözünürlüklü motor kullanılıyor:', err);
    });
  }, []);

  // 1. Initialize Map with Google Maps Layers
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const isDark = initialThemeRef.current === 'dark';
    const initLang = initialLanguageRef.current;

    // Google Maps tile servers (mt0, mt1, mt2, mt3) provide vivid, full-color cartography
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'google-roadmap': {
            type: 'raster',
            tiles: getGoogleTiles(initLang),
            tileSize: 256,
            attribution: initLang === 'tr' ? '© Google Haritalar' : '© Google Maps',
          },
        },
        layers: [
          // 1. Google Maps Roadmap Layer
          {
            id: 'google-roadmap-layer',
            type: 'raster',
            source: 'google-roadmap',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'visible' },
            paint: {
              'raster-opacity': 1,
              'raster-saturation': isDark ? 0.05 : 0.15,
              'raster-contrast': isDark ? 0.08 : 0.05,
            },
          },
          // Night Dimmer Overlay (only subtle in dark mode, keeps colors vivid)
          {
            id: 'night-overlay-layer',
            type: 'background',
            paint: {
              'background-color': '#0d131a',
              'background-opacity': isDark ? 0.18 : 0,
            },
          },
        ],
      },
      center: [20, 42],
      zoom: 3.5,
      pitch: 0,
      bearing: 0,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Country Regions GeoJSON Source for Regional Climate Scan
      map.addSource('country-regions-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Country Regions Polygon Fill with data-driven color and opacity
      map.addLayer({
        id: 'country-regions-fill',
        type: 'fill',
        source: 'country-regions-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'fillOpacity'],
        },
      });

      // Country regions soft halo
      map.addLayer({
        id: 'country-regions-glow',
        type: 'line',
        source: 'country-regions-source',
        paint: {
          'line-color': ['get', 'glowColor'],
          'line-width': 4,
          'line-opacity': 0.22,
        },
      });

      // Country regions contour
      map.addLayer({
        id: 'country-regions-border',
        type: 'line',
        source: 'country-regions-source',
        paint: {
          'line-color': ['get', 'contourColor'],
          'line-width': 1.5,
          'line-opacity': 0.95,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 1.1 Live language update of Google Maps raster tiles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateTiles = () => {
      const source = map.getSource('google-roadmap') as maplibregl.RasterTileSource | undefined;
      if (source && typeof source.setTiles === 'function') {
        source.setTiles(getGoogleTiles(language));
        map.triggerRepaint();
      }
    };

    if (map.isStyleLoaded()) {
      updateTiles();
    } else {
      map.once('styledata', updateTiles);
    }
  }, [language]);


  // 2. Clear Markers
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  // 3. Update Camera and Markers based on Stage (Retaining all smooth motion curves)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clearMarkers();

    // Clear scanned country regions whenever entering non-scanned state or changing stage
    if (map.isStyleLoaded() && map.getSource('country-regions-source')) {
      (map.getSource('country-regions-source') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: [],
      });
    }

    const hasViewTargetChanged =
      prevViewRef.current.stage !== stage ||
      prevViewRef.current.countryId !== selectedCountry?.id ||
      prevViewRef.current.cityId !== selectedCity?.id;

    prevViewRef.current = {
      stage,
      countryId: selectedCountry?.id,
      cityId: selectedCity?.id,
    };

    if (stage === 'global') {
      if (hasViewTargetChanged) {
        // Fly to world view (snappy, silky smooth Apple & Google Maps feel)
        map.flyTo({
          center: [20, 42],
          zoom: 3.5,
          pitch: 0,
          bearing: 0,
          duration: 1500,
          curve: 1.35,
          essential: true,
        });
      }

      // Country labels
      countries.forEach((country) => {
        const localizedCountryName = getCountryName(country);
        const cityUnit =
          language === 'tr'
            ? 'kent'
            : language === 'it'
            ? 'città'
            : language === 'es'
            ? 'ciudades'
            : language === 'ro'
            ? 'orașe'
            : 'cities';
        const el = document.createElement('button');
        el.type = 'button';
        el.setAttribute('aria-label', `${localizedCountryName}: ${country.cities.length} ${cityUnit}`);
        el.className = 'map-pin cursor-pointer group';
        el.innerHTML = `
          <div class="pin-label h-8 px-3 rounded-[9px] shadow-md border border-black/10 backdrop-blur-md transition-all group-hover:scale-105">
            <span class="status-dot bg-emerald-500 mr-1.5 inline-block w-2 h-2 rounded-full"></span>
            <span class="t-callout font-semibold text-[13px]">${localizedCountryName}</span>
            <span class="t-caption label-3 tabular text-[11px] opacity-75">${country.cities.length} ${cityUnit}</span>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectCountry(country);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(country.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    } else if (stage === 'country' && selectedCountry) {
      if (hasViewTargetChanged) {
        // Fly to Country view
        map.flyTo({
          center: selectedCountry.coordinates,
          zoom: selectedCountry.zoom,
          pitch: selectedCountry.pitch,
          bearing: selectedCountry.bearing,
          duration: 1550,
          curve: 1.35,
          essential: true,
        });
      }

      // Show City Pins in this Country (Canlı meteoroloji verileriyle)
      const currentCountry = countries.find((c) => c.id === selectedCountry.id) || selectedCountry;
      currentCountry.cities.forEach((city) => {
        const localizedCityName = getCityName(city);
        const el = document.createElement('button');
        el.type = 'button';
        el.setAttribute('aria-label', `${localizedCityName} ${t('digitalTwin3D')}`);
        el.className = 'map-pin cursor-pointer group';
        const cityAnomaly = city.classicalProfile?.activeAnomaly ?? 'normal';
        const anomalyCfg = CLIMATE_ANOMALY_CONFIG[cityAnomaly];
        const anomalyLabel =
          cityAnomaly === 'normal'
            ? t('anomalyNormal')
            : cityAnomaly === 'disturbed'
            ? t('anomalyDisturbed')
            : cityAnomaly === 'severe'
            ? t('anomalySevere')
            : cityAnomaly === 'rapid'
            ? t('anomalyRapid')
            : t('anomalyPsycho');

        const weatherIcon = city.telemetry.weatherCode !== undefined
          ? (city.telemetry.weatherCode === 0 ? '☀️' : city.telemetry.weatherCode <= 3 ? '⛅' : city.telemetry.weatherCode >= 71 ? '❄️' : '🌧️')
          : '';
        const liveDot = city.telemetry.isLive
          ? '<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" title="Canlı Veri (Open-Meteo)"></span>'
          : '';

        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="pin-label gap-2 py-1.5 pl-3 pr-3.5 rounded-[9px] shadow-md border border-black/10 backdrop-blur-md transition-all group-hover:scale-105">
              <span class="status-dot" style="color:${anomalyCfg.color}"></span>
              <div class="leading-tight text-left">
                <div class="t-callout font-semibold text-[13px] flex items-center">
                  <span>${localizedCityName}</span>
                  ${liveDot}
                </div>
                <div class="t-caption label-3 tabular text-[11px] opacity-80 font-medium">
                  ${weatherIcon} ${city.telemetry.temperature}°C · ${anomalyLabel} · AQI ${city.telemetry.aqi}
                </div>
              </div>
            </div>
            <div class="w-px h-2.5 bg-black/40"></div>
            <div class="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" style="background:${anomalyCfg.color}"></div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectCity(city);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(city.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });

      // If country scan is active, render colored regions and region badges
      if (isCountryScanned) {
        const regions = COUNTRY_REGIONS[selectedCountry.id] || [];
        const features = regions.map((region) => {
          const anomaly = overrideAllNormal ? 'normal' : region.anomalyType;
          const config = CLIMATE_ANOMALY_CONFIG[anomaly];
          const localizedRegionName = getRegionName(region);
          return {
            type: 'Feature' as const,
            properties: {
              id: region.id,
              name: localizedRegionName,
              anomalyType: anomaly,
              color: config.color,
              fillOpacity: config.fillOpacity + 0.16,
              glowColor: config.glowColor,
              contourColor: config.contourColor,
            },
            geometry: {
              type: 'Polygon' as const,
              coordinates: region.polygon,
            },
          };
        });

        const updateRegionsSource = () => {
          if (map.getSource('country-regions-source')) {
            (map.getSource('country-regions-source') as maplibregl.GeoJSONSource).setData({
              type: 'FeatureCollection',
              features,
            });
          }
        };

        if (map.isStyleLoaded()) {
          updateRegionsSource();
        } else {
          map.once('idle', updateRegionsSource);
        }

        // Add interactive region badges
        regions.forEach((region) => {
          const anomaly = overrideAllNormal ? 'normal' : region.anomalyType;
          const config = CLIMATE_ANOMALY_CONFIG[anomaly];
          const badgeText = overrideAllNormal
            ? t('anomalyNormal')
            : anomaly === 'normal'
            ? t('anomalyNormal')
            : anomaly === 'disturbed'
            ? t('anomalyDisturbed')
            : anomaly === 'severe'
            ? t('anomalySevere')
            : anomaly === 'rapid'
            ? t('anomalyRapid')
            : t('anomalyPsycho');
          const localizedRegionName = getRegionName(region);
          const el = document.createElement('button');
          el.type = 'button';
          el.setAttribute('aria-label', localizedRegionName);
          el.className = 'map-pin cursor-pointer group';
          el.innerHTML = `
            <div class="pin-label h-8 px-2.5 rounded-[9px] shadow-md border border-black/10 backdrop-blur-md transition-all group-hover:scale-105">
              <span class="status-dot" style="color:${config.color}"></span>
              <span class="t-callout font-semibold text-[13px]">${localizedRegionName}</span>
              <span class="t-caption label-3 text-[11px] opacity-80">${badgeText}</span>
            </div>
          `;

          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelectRegion?.(region);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(region.center)
            .addTo(map);

          markersRef.current.push(marker);
        });
      }
    } else if (stage === 'city' && selectedCity) {
      if (hasViewTargetChanged) {
        // Fly to City view (maximum zoom and 3D pitch)
        map.flyTo({
          center: selectedCity.coordinates,
          zoom: selectedCity.zoom,
          pitch: selectedCity.pitch,
          bearing: selectedCity.bearing,
          duration: 1650,
          curve: 1.35,
          essential: true,
        });
      }

      // Add a central beacon label marker for the city
      const config = CLIMATE_ANOMALY_CONFIG[activeAnomaly];
      const localizedCityName = getCityName(selectedCity);
      const beaconLabel =
        activeAnomaly === 'normal'
          ? t('anomalyNormal')
          : activeAnomaly === 'disturbed'
          ? t('anomalyDisturbed')
          : activeAnomaly === 'severe'
          ? t('anomalySevere')
          : activeAnomaly === 'rapid'
          ? t('anomalyRapid')
          : t('anomalyPsycho');
      const el = document.createElement('div');
      el.className = 'cursor-default pointer-events-none';
      el.innerHTML = `
        <div class="pin-label h-8 px-2.5 rounded-[9px] shadow-md border border-black/10 backdrop-blur-md">
          <span class="status-dot" style="color:${config.color}"></span>
          <span class="t-callout font-semibold text-[13px]">${localizedCityName}</span>
          <span class="t-caption label-3 text-[11px] opacity-80">${beaconLabel}</span>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(selectedCity.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [
    stage,
    selectedCountry,
    selectedCity,
    activeAnomaly,
    isCountryScanned,
    overrideAllNormal,
    onSelectCountry,
    onSelectCity,
    onSelectRegion,
    language,
    getCountryName,
    getCityName,
    getRegionName,
    t,
    countries,
    lastUpdated,
  ]);

  // 4. Live theme update: adjust contrast & night overlay without losing Google Maps colors
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const isDark = theme === 'dark';
    const applyTheme = () => {
      if (map.getLayer('google-roadmap-layer')) {
        map.setPaintProperty('google-roadmap-layer', 'raster-saturation', isDark ? 0.05 : 0.15);
        map.setPaintProperty('google-roadmap-layer', 'raster-contrast', isDark ? 0.08 : 0.05);
      }
      if (map.getLayer('night-overlay-layer')) {
        map.setPaintProperty('night-overlay-layer', 'background-opacity', isDark ? 0.18 : 0);
      }
    };

    if (map.isStyleLoaded()) {
      applyTheme();
    } else {
      map.once('idle', applyTheme);
    }
  }, [theme]);

  return (
    <div className="relative w-full h-full select-none">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Harita ve Meteoroloji Veri Sağlayıcıları (Bottom-Left) */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Official Google Maps Brand Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm text-xs pointer-events-none">
          <span className="font-bold tracking-tight text-[#4285F4]">G</span>
          <span className="font-bold tracking-tight text-[#EA4335]">o</span>
          <span className="font-bold tracking-tight text-[#FBBC05]">o</span>
          <span className="font-bold tracking-tight text-[#4285F4]">g</span>
          <span className="font-bold tracking-tight text-[#34A853]">l</span>
          <span className="font-bold tracking-tight text-[#EA4335]">e</span>
          <span className="text-[10px] text-gray-600 dark:text-gray-300 ml-1 font-medium">{language === 'tr' ? 'Haritalar' : 'Maps'}</span>
        </div>

        {/* Canlı Meteoroloji Durum Rozeti */}
        <div className="surface flex items-center gap-2 px-2.5 py-1 rounded-md text-xs shadow-sm border border-black/10 dark:border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="label-2 font-medium">
            {language === 'tr' ? 'Canlı Meteoroloji' : 'Live Weather'}: <span className="label-1 font-semibold text-emerald-600 dark:text-emerald-400">Open-Meteo</span>
          </span>
          {lastUpdated && (
            <span className="label-3 tabular text-[11px] opacity-75">({lastUpdated})</span>
          )}
          <button
            onClick={() => refreshWeather()}
            disabled={isWeatherLoading}
            title={language === 'tr' ? 'Hava durumunu şimdi güncelle' : 'Refresh live weather now'}
            className="pressable p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors ml-0.5"
            aria-label="Yenile"
          >
            <RotateCw className={`w-3 h-3 ${isWeatherLoading ? 'animate-spin text-emerald-500' : 'opacity-70'}`} />
          </button>
        </div>
      </div>

    </div>
  );
};
