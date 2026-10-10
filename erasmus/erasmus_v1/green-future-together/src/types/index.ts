export type AppStage = 'global' | 'country' | 'city';

export type HazardLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface HazardItem {
  id: string;
  name: string;
  nameEn: string;
  level: HazardLevel;
  percentage: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface SensorNode {
  id: string;
  name: string;
  type: string;
  reading: string;
  status: 'online' | 'warning' | 'alert';
  battery: number;
}

export interface TelemetryData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  aqi: number;
  aqiStatus: 'İyi' | 'Orta' | 'Hassas' | 'Sağlıksız' | 'Tehlikeli';
  pm25: number;
  co2: number;
  uvIndex: number;
  rainfall24h: number;
  greenCoverPercent: number;
  weatherCode?: number;
  conditionText?: string;
  isLive?: boolean;
  lastUpdated?: string;
}

export interface ClimaAdvice {
  summary: string;
  actionItems: string[];
  alertLevel: 'info' | 'warning' | 'critical';
}

export type ClimateAnomalyType = 'normal' | 'disturbed' | 'severe' | 'rapid' | 'psycho';

export interface AnomalyInfo {
  title: string;
  description: string;
  impact: string;
  badge: string;
}

export interface ClassicalClimateProfile {
  climateZone: string;
  typicalPattern: string;
  activeAnomaly: ClimateAnomalyType;
  anomalyDetails: Record<ClimateAnomalyType, AnomalyInfo>;
}

export interface CityData {
  id: string;
  name: string;
  countryId: string;
  tagline: string;
  address?: string;
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  boundaryGeoJson: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  telemetry: TelemetryData;
  hazards: HazardItem[];
  sensors: SensorNode[];
  climaAdvice: ClimaAdvice;
  classicalProfile: ClassicalClimateProfile;
}

export interface CountryData {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  flag: string;
  partnerRole: string;
  institution: string;
  address?: string;
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  stats: {
    renewableRate: string;
    afforestation: string;
    sensorsCount: number;
    activeAlerts: number;
  };
  cities: CityData[];
}

export interface SimulationStep {
  label: string;
  sublabel: string;
  tempDelta: number;
  hazardMultiplier: number;
  climaNote: string;
}

export interface CountryRegion {
  id: string;
  name: string;
  countryId: string;
  anomalyType: ClimateAnomalyType;
  classicalClimate: string;
  currentStatus: string;
  temperatureAvg: number;
  center: [number, number]; // [lng, lat]
  polygon: number[][][]; // GeoJSON coordinates
}
