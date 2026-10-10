import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CityData, ClimateAnomalyType, CountryRegion, HazardLevel, SimulationStep } from '../types';

export type Language = 'tr' | 'en' | 'it' | 'es' | 'ro';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
];

export interface TranslationDictionary {
  // Header
  appTitle: string;
  appTagline: string;
  demoTour: string;
  stopTour: string;
  continueTour: string;
  lightTheme: string;
  darkTheme: string;
  switchToLight: string;
  switchToDark: string;
  muteSound: string;
  unmuteSound: string;
  aboutProject: string;
  languageSelect: string;

  // Breadcrumbs & Nav
  world: string;
  allMap: string;
  regionAnalysis: string;
  cityFocusMode: string;

  // Country Scan Bar
  countryScan: string;
  countryScanSubtitle: string;
  startScan: string;
  closeScan: string;
  naturalReference: string;
  showAnomaly: string;
  normalClimateHistorical: string;
  regionalStatus: string;
  scannedRegions: string;

  // Telemetry & Metrics
  feelsLike: string;
  digitalTwin3D: string;
  airQuality: string;
  relativeHumidity: string;
  rainfall24h: string;
  wind: string;
  greenCover: string;
  uvIndex: string;

  // AQI Statuses
  aqiGood: string;
  aqiModerate: string;
  aqiSensitive: string;
  aqiUnhealthy: string;
  aqiHazardous: string;

  // Hazards & Risks
  climateHazards: string;
  criticalThreshold: string;
  highRisk: string;
  moderateRisk: string;
  lowRisk: string;
  criticalLevel: string;
  trendUp: string;
  trendDown: string;
  trendStable: string;

  // Regional Regime
  regionalRegime: string;
  classicalBaseline: string;
  anomalyType: string;

  // Anomalies
  anomalyNormal: string;
  anomalyDisturbed: string;
  anomalySevere: string;
  anomalyRapid: string;
  anomalyPsycho: string;

  badgeNormal: string;
  badgeDisturbed: string;
  badgeSevere: string;
  badgeRapid: string;
  badgePsycho: string;

  // Sensors & Telemetry
  sensorsTelemetry: string;
  activeSensors: string;
  battery: string;
  statusOnline: string;
  statusWarning: string;
  statusAlert: string;

  // Clima Assistant & Actions
  climaAssistant: string;
  climaGuide: string;
  climaActionPlanFor: string;
  recommendedActions: string;
  allActionsDone: string;
  decisionSupportNote: string;
  minimizeAssistant: string;
  expandAssistant: string;

  // Simulation
  simulationTitle: string;
  simulationStep: string;
  simulationLive: string;
  simulation12h: string;
  simulation24h: string;
  simulation2030: string;

  // 3D Model Viewer
  modelViewerTitle: string;
  modelLoading: string;
  modelDragHint: string;
  modelReady: string;
  modelAddHint: string;

  // Quick Country Dock
  partnerCountries: string;
  renewable: string;
  afforestation: string;
  sensorsCount: string;
  activeAlerts: string;

  // Spotlight Overlay
  spotlightActive: string;
  sensorNetOnline: string;
  exitFocus: string;
  close: string;

  // Dashboard Tabs & Sections
  tabOverview: string;
  tabSensors: string;
  tabSimulator: string;
  layerThermal: string;
  layerFlood: string;
  layerAir: string;
  layerGreen: string;
  visualizationLayer: string;
  activeIoTNodes: string;
  onlineCount: string;
  timeSimulator: string;
  timeSimulatorDesc: string;
  historicalBaseline: string;
  ecologicalImpact: string;
  indicatorsCount: string;
  explorePrototype: string;
  openClimaGuide: string;
  cityPanel: string;
  showClimatePanel: string;

  // Erasmus Modal
  consortiumPartners: string;
  keyCapabilities: string;
  euFundingStatement: string;
  euFundingNotice: string;
  closeDialog: string;
  projectPeriod: string;
  pillar1Title: string;
  pillar1Text: string;
  pillar2Title: string;
  pillar2Text: string;
  pillar3Title: string;
  pillar3Text: string;
  erasmusModalDesc: string;

  // Actions
  actionNormal1: string;
  actionNormal2: string;
  actionNormal3: string;
  actionDisturbed1: string;
  actionDisturbed2: string;
  actionDisturbed3: string;
  actionSevere1: string;
  actionSevere2: string;
  actionSevere3: string;
  actionRapid1: string;
  actionRapid2: string;
  actionRapid3: string;
  actionPsycho1: string;
  actionPsycho2: string;
  actionPsycho3: string;

  // Intro Video
  skipIntro: string;
  replayIntro: string;
  enterMap: string;
}

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  tr: {
    appTitle: 'ClimaMap',
    appTagline: 'Erasmus+ · 4 ortak ülke',
    demoTour: 'Demo turu',
    stopTour: 'Turu durdur',
    continueTour: 'Devam Et',
    lightTheme: 'Açık tema',
    darkTheme: 'Koyu tema',
    switchToLight: 'Açık temaya geç',
    switchToDark: 'Koyu temaya geç',
    muteSound: 'Sesi kapat',
    unmuteSound: 'Sesi aç',
    aboutProject: 'Proje hakkında',
    languageSelect: 'Dil seçimi',

    world: 'Dünya',
    allMap: 'Tüm harita',
    regionAnalysis: 'Bölge Analizi',
    cityFocusMode: 'Kent Odak Modu',

    countryScan: 'Ülke İklim Taraması',
    countryScanSubtitle: 'Klasik rejim normalleri ve bölgesel iklim bozulma haritası',
    startScan: 'Taramayı Başlat',
    closeScan: 'İncelemeyi Kapat',
    naturalReference: 'Doğal Referans Göstergesi',
    showAnomaly: 'İklim Bozulma Anomalisini Göster',
    normalClimateHistorical: 'Normal İklim Referansı (Tarihi)',
    regionalStatus: 'Bölgesel Durum',
    scannedRegions: 'taranan bölge',

    feelsLike: 'Hissedilen',
    digitalTwin3D: '3D Dijital İkizi',
    airQuality: 'Hava kalitesi',
    relativeHumidity: 'Bağıl nem',
    rainfall24h: 'Yağış (24 sa)',
    wind: 'Rüzgâr',
    greenCover: 'Yeşil Örtü',
    uvIndex: 'UV İndeksi',

    aqiGood: 'İyi',
    aqiModerate: 'Orta',
    aqiSensitive: 'Hassas',
    aqiUnhealthy: 'Sağlıksız',
    aqiHazardous: 'Tehlikeli',

    climateHazards: 'İklim Tehlikeleri & Erken Uyarı',
    criticalThreshold: 'Kritik Eşik',
    highRisk: 'Yüksek Risk',
    moderateRisk: 'Orta Risk',
    lowRisk: 'Düşük Risk',
    criticalLevel: 'Kritik',
    trendUp: 'Artıyor',
    trendDown: 'Azalıyor',
    trendStable: 'Sabit',

    regionalRegime: 'Bölgesel iklim rejimi',
    classicalBaseline: 'Klasik rejim',
    anomalyType: 'Bozulma tipi',

    anomalyNormal: 'Dengeli',
    anomalyDisturbed: 'İklim Bozulması',
    anomalySevere: 'Aşırı İklim Bozulması',
    anomalyRapid: 'Hızlı Değişim',
    anomalyPsycho: 'İnsan Psikolojisi',

    badgeNormal: '🟢 Yeşil · Dengeli',
    badgeDisturbed: '🟡 Sarı · Bozulmuş',
    badgeSevere: '🔴 Kırmızı · Aşırı Bozulma',
    badgeRapid: '🔵 Açık Mavi · Hızlı Değişim',
    badgePsycho: '🟣 Mor · Psikolojik Etki',

    sensorsTelemetry: 'İzleme Sensörleri & Telemetri',
    activeSensors: 'Aktif Sensörler',
    battery: 'Pil',
    statusOnline: 'Aktif',
    statusWarning: 'Uyarı',
    statusAlert: 'Alarm',

    climaAssistant: 'ClimaBot Karar Destek Asistanı',
    climaGuide: 'ClimaBot',
    climaActionPlanFor: 'için eylem planı',
    recommendedActions: 'Önerilen Eylemler',
    allActionsDone: 'ClimaBot eylemleri tamamlandı',
    decisionSupportNote: 'ClimaBot karar destek notu',
    minimizeAssistant: 'ClimaBot\'u küçült',
    expandAssistant: 'ClimaBot\'u genişlet',

    simulationTitle: 'İklim Isınma Simülasyonu',
    simulationStep: 'Simülasyon Adımı',
    simulationLive: 'Şu An (Canlı)',
    simulation12h: '+12 Saat',
    simulation24h: '+24 Saat',
    simulation2030: '2030 Projeksiyonu',

    modelViewerTitle: '3D Dijital İkiz & Proje Modeli',
    modelLoading: '3D Model Yükleniyor...',
    modelDragHint: 'Çevirmek için sürükleyin ↺',
    modelReady: '3D Model Hazır',
    modelAddHint: 'dosyanızı public/models/ klasörüne ekleyiniz.',

    partnerCountries: 'Ortak Ülkeler',
    renewable: 'Yenilenebilir',
    afforestation: 'Ağaçlandırma',
    sensorsCount: 'Sensör',
    activeAlerts: 'Aktif Alarm',

    spotlightActive: 'Dijital İkiz Odak Modu',
    sensorNetOnline: 'Sensör Ağı Aktif',
    exitFocus: 'Odaktan Çık',
    close: 'Kapat',

    tabOverview: 'İklim ve risk',
    tabSensors: 'Sensörler',
    tabSimulator: 'Simülasyon',
    layerThermal: 'Termal ısı',
    layerFlood: 'Taşkın modeli',
    layerAir: 'Partikül (PM2.5)',
    layerGreen: 'Yeşil koridor',
    visualizationLayer: 'Görselleştirme katmanı',
    activeIoTNodes: 'Aktif IoT düğümleri',
    onlineCount: 'çevrimiçi',
    timeSimulator: 'Zaman simülasyonu',
    timeSimulatorDesc: 'IPCC modelleri ve sensör kestirimleriyle kentin iklim risklerini ileriye doğru simüle edin.',
    historicalBaseline: 'Tarihi beklenti',
    ecologicalImpact: 'Ekolojik ve toplumsal etki',
    indicatorsCount: 'gösterge',
    explorePrototype: 'Prototipi keşfet',
    openClimaGuide: 'ClimaBot\'u aç',
    cityPanel: 'paneli',
    showClimatePanel: 'İklim panelini göster',

    consortiumPartners: 'Konsorsiyum Ortakları',
    keyCapabilities: 'Temel Yetenekler & Mimari',
    euFundingStatement: 'Avrupa Birliği Finansman Beyanı',
    euFundingNotice:
      'ClimaMap, Avrupa Birliği Erasmus+ programı tarafından desteklenen çok ortaklı bir iklim eylemi ve kentsel dayanıklılık projesidir.',
    closeDialog: 'Pencereyi Kapat',
    projectPeriod: 'Erasmus+ · Kartal Şehit Salih Alışkan MTAL & Dijital İkiz Konsorsiyumu',
    pillar1Title: 'Mikro-iklim maskesi',
    pillar1Text: 'Seçili kentin sınırlarını çizer, çevreyi hafifçe soluklaştırarak dikkati kente odaklar.',
    pillar2Title: 'IoT erken uyarı',
    pillar2Text: 'Sel, aşırı sıcak, kuraklık ve heyelan risklerini anlık sensör verisiyle izler.',
    pillar3Title: 'CLIMA asistanı',
    pillar3Text: 'Vatandaşlar ve yetkililer için bağlama duyarlı, uygulanabilir iklim eylemleri önerir.',
    erasmusModalDesc:
      'ClimaMap, Avrupa Birliği Erasmus+ programı kapsamında desteklenen; Kartal Şehit Salih Alışkan Mesleki ve Teknik Anadolu Lisesi koordinatörlüğünde yürütülen iklim eylemi, sürdürülebilirlik ve kentsel dayanıklılık dijital ikiz projesidir. Yerel yönetimler, okullar ve genç iklim elçileri için dijital ikiz teknolojisi ve yapay zekâ destekli CLIMA karar destek asistanı geliştirmeyi hedefler.',

    actionNormal1: 'Yerel ekosistem dengesini korumak için doğal yeşil koridorları destekleyin.',
    actionNormal2: 'Klasik yağış döngüsünü izleyen yağmur suyu hasadı tanklarını kontrol edin.',
    actionNormal3: 'Çevre dostu kentsel yürüyüş akslarını ve bisiklet yollarını tercih edin.',
    actionDisturbed1: 'Klasik yağış rejiminin bozulması sebebiyle toprak nemini koruyucu malçlama yapın.',
    actionDisturbed2: 'Beklenmeyen güneşlenme buharlaşmasını azaltmak için sulamayı gece saatlerine planlayın.',
    actionDisturbed3: 'Gölge sağlayan kentsel tenteleri ve eko-tenteleri devreye alın.',
    actionSevere1: 'Aşırı güneş ve termal kriz saatlerinde (11:00-17:00) açık alan aktivitelerini sınırlayın.',
    actionSevere2: 'Kritik su tasarrufu seviye 3 protokolünü devreye alın.',
    actionSevere3: 'Yaşlılar ve hassas vatandaşlar için klimalı kamu sığınma merkezlerini açın.',
    actionRapid1: 'Ani hava cephesi sıçramalarına karşı kentsel drenaj pompalarını teyakkuza geçirin.',
    actionRapid2: 'Hızlı fırtına ve dolu riskine karşı erken uyarı bildirimlerini vatandaşlara yayınlayın.',
    actionRapid3: 'Atmosferik basınç ve rüzgar savrulmalarını IoT düğümleriyle anlık takip edin.',
    actionPsycho1: 'İklim değişikliği ve eko-anksiyete (solastalgia) destek masasını bilgilendirme rehberine ekleyin.',
    actionPsycho2: 'Toplum ruh sağlığı için kentsel yeşil dinlenme ve meditasyon vahaları oluşturun.',
    actionPsycho3: 'Kolektif genç iklim elçileri dayanışma çemberlerini ve atölyelerini destekleyin.',
    skipIntro: 'İntroyu Geç',
    replayIntro: 'İntroyu İzle',
    enterMap: 'Haritaya Geç',
  },

  en: {
    appTitle: 'ClimaMap',
    appTagline: 'Erasmus+ · 4 partner countries',
    demoTour: 'Demo tour',
    stopTour: 'Stop tour',
    continueTour: 'Continue',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    muteSound: 'Mute sound',
    unmuteSound: 'Unmute sound',
    aboutProject: 'About project',
    languageSelect: 'Language',

    world: 'Global',
    allMap: 'Whole map',
    regionAnalysis: 'Region Analysis',
    cityFocusMode: 'City Focus Mode',

    countryScan: 'Country Climate Scan',
    countryScanSubtitle: 'Classical regime baselines & regional climate anomaly map',
    startScan: 'Start Scan',
    closeScan: 'Close Scan',
    naturalReference: 'Natural Baseline Indicator',
    showAnomaly: 'Show Climate Anomaly',
    normalClimateHistorical: 'Historical Climate Normal',
    regionalStatus: 'Regional Status',
    scannedRegions: 'scanned regions',

    feelsLike: 'Feels like',
    digitalTwin3D: '3D Digital Twin',
    airQuality: 'Air quality',
    relativeHumidity: 'Humidity',
    rainfall24h: 'Rainfall (24h)',
    wind: 'Wind',
    greenCover: 'Green Canopy',
    uvIndex: 'UV Index',

    aqiGood: 'Good',
    aqiModerate: 'Moderate',
    aqiSensitive: 'Sensitive',
    aqiUnhealthy: 'Unhealthy',
    aqiHazardous: 'Hazardous',

    climateHazards: 'Climate Hazards & Early Warning',
    criticalThreshold: 'Critical Threshold',
    highRisk: 'High Risk',
    moderateRisk: 'Moderate Risk',
    lowRisk: 'Low Risk',
    criticalLevel: 'Critical',
    trendUp: 'Rising',
    trendDown: 'Falling',
    trendStable: 'Stable',

    regionalRegime: 'Regional climate regime',
    classicalBaseline: 'Classical baseline',
    anomalyType: 'Anomaly type',

    anomalyNormal: 'Balanced',
    anomalyDisturbed: 'Disturbed',
    anomalySevere: 'Severe Anomaly',
    anomalyRapid: 'Rapid Shift',
    anomalyPsycho: 'Eco-Anxiety',

    badgeNormal: '🟢 Green · Balanced',
    badgeDisturbed: '🟡 Yellow · Disturbed',
    badgeSevere: '🔴 Red · Severe Anomaly',
    badgeRapid: '🔵 Light Blue · Rapid Shift',
    badgePsycho: '🟣 Purple · Psychological Impact',

    sensorsTelemetry: 'Monitoring Sensors & Telemetry',
    activeSensors: 'Active Sensors',
    battery: 'Battery',
    statusOnline: 'Online',
    statusWarning: 'Warning',
    statusAlert: 'Alert',

    climaAssistant: 'ClimaBot Decision Support Assistant',
    climaGuide: 'ClimaBot',
    climaActionPlanFor: 'Action plan for',
    recommendedActions: 'Recommended Actions',
    allActionsDone: 'All ClimaBot actions completed',
    decisionSupportNote: 'ClimaBot Decision Support Note',
    minimizeAssistant: 'Minimize ClimaBot',
    expandAssistant: 'Expand ClimaBot',

    simulationTitle: 'Climate Warming Simulation',
    simulationStep: 'Simulation Step',
    simulationLive: 'Now (Live)',
    simulation12h: '+12 Hours',
    simulation24h: '+24 Hours',
    simulation2030: '2030 Projection',

    modelViewerTitle: '3D Digital Twin & Project Model',
    modelLoading: 'Loading 3D Model...',
    modelDragHint: 'Drag to rotate ↺',
    modelReady: '3D Model Ready',
    modelAddHint: 'add your file to public/models/ directory.',

    partnerCountries: 'Partner Countries',
    renewable: 'Renewable',
    afforestation: 'Afforestation',
    sensorsCount: 'Sensors',
    activeAlerts: 'Active Alerts',

    spotlightActive: 'Digital Twin Focus Mode',
    sensorNetOnline: 'Sensor Network Active',
    exitFocus: 'Exit Focus',
    close: 'Close',

    tabOverview: 'Climate & Risk',
    tabSensors: 'Sensors',
    tabSimulator: 'Simulator',
    layerThermal: 'Thermal heat',
    layerFlood: 'Flood model',
    layerAir: 'Particulate (PM2.5)',
    layerGreen: 'Green corridor',
    visualizationLayer: 'Visualization layer',
    activeIoTNodes: 'Active IoT nodes',
    onlineCount: 'online',
    timeSimulator: 'Time simulator',
    timeSimulatorDesc: 'Simulate the city’s climate risks forward using IPCC models and sensor forecasts.',
    historicalBaseline: 'Historical baseline',
    ecologicalImpact: 'Ecological & societal impact',
    indicatorsCount: 'indicators',
    explorePrototype: 'Explore prototype',
    openClimaGuide: 'Open ClimaBot',
    cityPanel: 'dashboard',
    showClimatePanel: 'Show climate dashboard',

    consortiumPartners: 'Consortium Partners',
    keyCapabilities: 'Key Capabilities & Architecture',
    euFundingStatement: 'European Union Funding Statement',
    euFundingNotice:
      'ClimaMap is a multi-partner climate action and urban resilience project co-funded by the Erasmus+ Programme of the European Union.',
    closeDialog: 'Close Window',
    projectPeriod: 'Erasmus+ KA220 · 2024–2027 · Digital twin & climate action consortium',
    pillar1Title: 'Micro-climate mask',
    pillar1Text: 'Outlines the chosen city, softly dimming the surroundings to spotlight urban resilience.',
    pillar2Title: 'IoT early warning',
    pillar2Text: 'Tracks floods, heatwaves, droughts, and landslide risks with live sensor telemetry.',
    pillar3Title: 'CLIMA assistant',
    pillar3Text: 'Recommends context-aware, actionable climate interventions for citizens and authorities.',
    erasmusModalDesc:
      'ClimaMap is a multi-partner climate action and urban resilience project co-funded by the Erasmus+ Programme of the European Union. It aims to develop digital twin technology and an AI-driven CLIMA decision support assistant for local governments, universities, and youth climate ambassadors.',

    actionNormal1: 'Support natural green corridors to preserve local ecological balance.',
    actionNormal2: 'Inspect rainwater harvesting storage tracking classic precipitation cycles.',
    actionNormal3: 'Promote eco-friendly urban pedestrian corridors and cycling paths.',
    actionDisturbed1: 'Apply moisture-retaining soil mulching due to disrupted classical rainfall regimes.',
    actionDisturbed2: 'Schedule municipal irrigation during nighttime to minimize solar evaporation.',
    actionDisturbed3: 'Deploy urban shade canopies and eco-tents in high heat spots.',
    actionSevere1: 'Restrict strenuous outdoor activities during peak heat stress hours (11:00-17:00).',
    actionSevere2: 'Enforce Level 3 critical water conservation protocol across municipal districts.',
    actionSevere3: 'Open air-conditioned civic cooling shelters for elderly and vulnerable residents.',
    actionRapid1: 'Put urban stormwater drainage pumps on alert against sudden atmospheric flash spikes.',
    actionRapid2: 'Broadcast real-time early warning advisories for sudden severe storms and hail.',
    actionRapid3: 'Continuously monitor barometric drops and wind gusts via distributed IoT sensor nodes.',
    actionPsycho1: 'Provide educational resources and counseling support addressing eco-anxiety and solastalgia.',
    actionPsycho2: 'Create serene urban green respites and mindfulness zones for public wellbeing.',
    actionPsycho3: 'Facilitate youth climate ambassador solidarity circles and resilience workshops.',
    skipIntro: 'Skip Intro',
    replayIntro: 'Watch Intro',
    enterMap: 'Enter Map',
  },

  it: {
    appTitle: 'ClimaMap',
    appTagline: 'Erasmus+ · 4 paesi partner',
    demoTour: 'Tour demo',
    stopTour: 'Ferma tour',
    continueTour: 'Continua',
    lightTheme: 'Tema chiaro',
    darkTheme: 'Tema scuro',
    switchToLight: 'Passa a tema chiaro',
    switchToDark: 'Passa a tema scuro',
    muteSound: 'Disattiva audio',
    unmuteSound: 'Attiva audio',
    aboutProject: 'Sul progetto',
    languageSelect: 'Lingua',

    world: 'Globale',
    allMap: 'Mappa completa',
    regionAnalysis: 'Analisi regionale',
    cityFocusMode: 'Modalità focus città',

    countryScan: 'Scansione Climatica Paese',
    countryScanSubtitle: 'Norme climatiche classiche e mappa anomalie regionali',
    startScan: 'Avvia Scansione',
    closeScan: 'Chiudi Scansione',
    naturalReference: 'Indicatore di Riferimento Naturale',
    showAnomaly: 'Mostra Anomalia Climatica',
    normalClimateHistorical: 'Riferimento Storico Normale',
    regionalStatus: 'Stato Regionale',
    scannedRegions: 'regioni scansionate',

    feelsLike: 'Percepita',
    digitalTwin3D: 'Gemello Digitale 3D',
    airQuality: 'Qualità aria',
    relativeHumidity: 'Umidità',
    rainfall24h: 'Pioggia (24h)',
    wind: 'Vento',
    greenCover: 'Copertura verde',
    uvIndex: 'Indice UV',

    aqiGood: 'Buona',
    aqiModerate: 'Moderata',
    aqiSensitive: 'Sensibile',
    aqiUnhealthy: 'Malsana',
    aqiHazardous: 'Pericolosa',

    climateHazards: 'Rischi Climatici & Allerta Rapida',
    criticalThreshold: 'Soglia Critica',
    highRisk: 'Rischio Alto',
    moderateRisk: 'Rischio Moderato',
    lowRisk: 'Rischio Basso',
    criticalLevel: 'Critico',
    trendUp: 'In aumento',
    trendDown: 'In calo',
    trendStable: 'Stabile',

    regionalRegime: 'Regime climatico regionale',
    classicalBaseline: 'Regime classico',
    anomalyType: 'Tipo anomalia',

    anomalyNormal: 'Bilanciato',
    anomalyDisturbed: 'Disturbato',
    anomalySevere: 'Anomalia Grave',
    anomalyRapid: 'Cambiamento Rapido',
    anomalyPsycho: 'Eco-Ansia',

    badgeNormal: '🟢 Verde · Equilibrato',
    badgeDisturbed: '🟡 Giallo · Disturbato',
    badgeSevere: '🔴 Rosso · Anomalia Grave',
    badgeRapid: '🔵 Celeste · Cambiamento Rapido',
    badgePsycho: '🟣 Viola · Impatto Psicologico',

    sensorsTelemetry: 'Sensori di Monitoraggio & Telemetria',
    activeSensors: 'Sensori Attivi',
    battery: 'Batteria',
    statusOnline: 'Online',
    statusWarning: 'Avviso',
    statusAlert: 'Allarme',

    climaAssistant: 'ClimaBot Assistente Decisionale',
    climaGuide: 'ClimaBot',
    climaActionPlanFor: 'Piano d’azione per',
    recommendedActions: 'Azioni Raccomandate',
    allActionsDone: 'Tutte le azioni ClimaBot completate',
    decisionSupportNote: 'Nota decisionale ClimaBot',
    minimizeAssistant: 'Riduci ClimaBot',
    expandAssistant: 'Espandi ClimaBot',

    simulationTitle: 'Simulazione Riscaldamento Climatico',
    simulationStep: 'Fase di Simulazione',
    simulationLive: 'Ora (Live)',
    simulation12h: '+12 Ore',
    simulation24h: '+24 Ore',
    simulation2030: 'Proiezione 2030',

    modelViewerTitle: 'Gemello Digitale 3D & Modello',
    modelLoading: 'Caricamento Modello 3D...',
    modelDragHint: 'Trascina per ruotare ↺',
    modelReady: 'Modello 3D Pronto',
    modelAddHint: 'aggiungi il file nella cartella public/models/.',

    partnerCountries: 'Paesi Partner',
    renewable: 'Rinnovabile',
    afforestation: 'Riforestazione',
    sensorsCount: 'Sensori',
    activeAlerts: 'Allarmi Attivi',

    spotlightActive: 'Focus Gemello Digitale',
    sensorNetOnline: 'Rete Sensori Attiva',
    exitFocus: 'Esci da Focus',
    close: 'Chiudi',

    tabOverview: 'Clima e rischi',
    tabSensors: 'Sensori',
    tabSimulator: 'Simulatore',
    layerThermal: 'Calore termico',
    layerFlood: 'Modello alluvione',
    layerAir: 'Particolato (PM2.5)',
    layerGreen: 'Corridoio verde',
    visualizationLayer: 'Livello di visualizzazione',
    activeIoTNodes: 'Nodi IoT attivi',
    onlineCount: 'online',
    timeSimulator: 'Simulatore temporale',
    timeSimulatorDesc: 'Simula i rischi climatici futuri della città usando modelli IPCC e previsioni dei sensori.',
    historicalBaseline: 'Aspettativa storica',
    ecologicalImpact: 'Impatto ecologico e sociale',
    indicatorsCount: 'indicatori',
    explorePrototype: 'Esplora prototipo',
    openClimaGuide: 'Apri ClimaBot',
    cityPanel: 'pannello',
    showClimatePanel: 'Mostra pannello climatico',

    consortiumPartners: 'Partner del Consorzio',
    keyCapabilities: 'Funzionalità Chiave & Architettura',
    euFundingStatement: 'Dichiarazione Finanziamento UE',
    euFundingNotice:
      'ClimaMap è un progetto europeo cofinanziato dal programma Erasmus+ dell’Unione Europea.',
    closeDialog: 'Chiudi Finestra',
    projectPeriod: 'Erasmus+ KA220 · 2024–2027 · Consorzio per il gemello digitale e azione climatica',
    pillar1Title: 'Maschera micro-climatica',
    pillar1Text: 'Evidenzia i confini della città selezionata, sfumando l’ambiente circostante.',
    pillar2Title: 'Allerta precoce IoT',
    pillar2Text: 'Monitora alluvioni, ondate di calore, siccità e frane con dati sensoriali in tempo reale.',
    pillar3Title: 'Assistente CLIMA',
    pillar3Text: 'Suggerisce interventi climatici concreti e contestualizzati per cittadini e amministratori.',
    erasmusModalDesc:
      'ClimaMap è un progetto europeo di azione climatica e resilienza urbana cofinanziato dal programma Erasmus+ dell’Unione Europea. Sviluppa gemelli digitali e l’assistente decisionale basato su IA CLIMA per comuni, università e giovani ambasciatori climatici.',

    actionNormal1: 'Sostieni i corridoi verdi naturali per preservare l’equilibrio dell’ecosistema locale.',
    actionNormal2: 'Verifica le cisterne di raccolta dell’acqua piovana secondo il ciclo idrico classico.',
    actionNormal3: 'Promuovi percorsi pedonali e piste ciclabili a impatto zero.',
    actionDisturbed1: 'Applica pacciamatura per trattenere l’umidità del suolo a causa delle anomalie di pioggia.',
    actionDisturbed2: 'Pianifica l’irrigazione nelle ore notturne per ridurre l’evaporazione solare.',
    actionDisturbed3: 'Installa tende ombreggianti ed eco-coperture nei punti a maggiore stress termico.',
    actionSevere1: 'Limita le attività all’aperto durante le ore di picco termico (11:00-17:00).',
    actionSevere2: 'Attiva il protocollo di risparmio idrico critico di livello 3.',
    actionSevere3: 'Apri centri pubblici di accoglienza climatizzati per anziani e persone vulnerabili.',
    actionRapid1: 'Metti in allerta le pompe idrauliche per prevenire improvvise bombe d’acqua.',
    actionRapid2: 'Invia allerte precoci ai cittadini contro improvvise tempeste e grandinate.',
    actionRapid3: 'Monitora cadute di pressione e raffiche di vento tramite la rete IoT.',
    actionPsycho1: 'Offri supporto psicologico contro l’eco-ansia e la solastalgia climatica.',
    actionPsycho2: 'Crea oasi verdi urbane e spazi di relax meditativo per la salute comunitaria.',
    actionPsycho3: 'Sostieni i circoli di solidarietà e i laboratori dei giovani ambasciatori per il clima.',
    skipIntro: 'Salta Intro',
    replayIntro: 'Guarda Intro',
    enterMap: 'Entra nella Mappa',
  },

  es: {
    appTitle: 'ClimaMap',
    appTagline: 'Erasmus+ · 4 países socios',
    demoTour: 'Tour demo',
    stopTour: 'Detener tour',
    continueTour: 'Continuar',
    lightTheme: 'Tema claro',
    darkTheme: 'Tema oscuro',
    switchToLight: 'Cambiar a tema claro',
    switchToDark: 'Cambiar a tema oscuro',
    muteSound: 'Silenciar',
    unmuteSound: 'Activar sonido',
    aboutProject: 'Sobre el proyecto',
    languageSelect: 'Idioma',

    world: 'Global',
    allMap: 'Todo el mapa',
    regionAnalysis: 'Análisis regional',
    cityFocusMode: 'Modo enfoque ciudad',

    countryScan: 'Escaneo Climático del País',
    countryScanSubtitle: 'Normas climáticas clásicas y mapa de anomalías regionales',
    startScan: 'Iniciar Escaneo',
    closeScan: 'Cerrar Escaneo',
    naturalReference: 'Indicador de Referencia Natural',
    showAnomaly: 'Mostrar Anomalía Climática',
    normalClimateHistorical: 'Referencia Histórica Normal',
    regionalStatus: 'Estado Regional',
    scannedRegions: 'regiones escaneadas',

    feelsLike: 'Sensación',
    digitalTwin3D: 'Gemelo Digital 3D',
    airQuality: 'Calidad del aire',
    relativeHumidity: 'Humedad',
    rainfall24h: 'Lluvia (24h)',
    wind: 'Viento',
    greenCover: 'Cobertura vegetal',
    uvIndex: 'Índice UV',

    aqiGood: 'Buena',
    aqiModerate: 'Moderada',
    aqiSensitive: 'Sensible',
    aqiUnhealthy: 'Insalubre',
    aqiHazardous: 'Peligrosa',

    climateHazards: 'Riesgos Climáticos y Alerta Temprana',
    criticalThreshold: 'Umbral Crítico',
    highRisk: 'Riesgo Alto',
    moderateRisk: 'Riesgo Moderado',
    lowRisk: 'Riesgo Bajo',
    criticalLevel: 'Crítico',
    trendUp: 'En aumento',
    trendDown: 'En descenso',
    trendStable: 'Estable',

    regionalRegime: 'Régimen climático regional',
    classicalBaseline: 'Régimen clásico',
    anomalyType: 'Tipo de anomalía',

    anomalyNormal: 'Equilibrado',
    anomalyDisturbed: 'Perturbado',
    anomalySevere: 'Anomalía Grave',
    anomalyRapid: 'Cambio Rápido',
    anomalyPsycho: 'Eco-Ansiedad',

    badgeNormal: '🟢 Verde · Equilibrado',
    badgeDisturbed: '🟡 Amarillo · Perturbado',
    badgeSevere: '🔴 Rojo · Anomalía Grave',
    badgeRapid: '🔵 Azul Claro · Cambio Rápido',
    badgePsycho: '🟣 Morado · Impacto Psicológico',

    sensorsTelemetry: 'Sensores de Monitorización y Telemetría',
    activeSensors: 'Sensores Activos',
    battery: 'Batería',
    statusOnline: 'En línea',
    statusWarning: 'Aviso',
    statusAlert: 'Alerta',

    climaAssistant: 'ClimaBot Asistente de Decisión',
    climaGuide: 'ClimaBot',
    climaActionPlanFor: 'Plan de acción para',
    recommendedActions: 'Acciones Recomendadas',
    allActionsDone: 'Todas las acciones de ClimaBot completadas',
    decisionSupportNote: 'Nota de apoyo ClimaBot',
    minimizeAssistant: 'Minimizar ClimaBot',
    expandAssistant: 'Expandir ClimaBot',

    simulationTitle: 'Simulación de Calentamiento Climático',
    simulationStep: 'Paso de Simulación',
    simulationLive: 'Ahora (En vivo)',
    simulation12h: '+12 Horas',
    simulation24h: '+24 Horas',
    simulation2030: 'Proyección 2030',

    modelViewerTitle: 'Gemelo Digital 3D y Modelo',
    modelLoading: 'Cargando Modelo 3D...',
    modelDragHint: 'Arrastra para rotar ↺',
    modelReady: 'Modelo 3D Listo',
    modelAddHint: 'añade tu archivo en la carpeta public/models/.',

    partnerCountries: 'Países Socios',
    renewable: 'Renovable',
    afforestation: 'Reforestación',
    sensorsCount: 'Sensores',
    activeAlerts: 'Alertas Activas',

    spotlightActive: 'Modo Enfoque Gemelo Digital',
    sensorNetOnline: 'Red de Sensores Activa',
    exitFocus: 'Salir de Enfoque',
    close: 'Cerrar',

    tabOverview: 'Clima y riesgos',
    tabSensors: 'Sensores',
    tabSimulator: 'Simulador',
    layerThermal: 'Calor térmico',
    layerFlood: 'Modelo de inundación',
    layerAir: 'Partículas (PM2.5)',
    layerGreen: 'Corredor verde',
    visualizationLayer: 'Capa de visualización',
    activeIoTNodes: 'Nodos IoT activos',
    onlineCount: 'en línea',
    timeSimulator: 'Simulador temporal',
    timeSimulatorDesc: 'Simula los riesgos climáticos futuros de la ciudad utilizando modelos del IPCC y sensores.',
    historicalBaseline: 'Expectativa histórica',
    ecologicalImpact: 'Impacto ecológico y social',
    indicatorsCount: 'indicadores',
    explorePrototype: 'Explorar prototipo',
    openClimaGuide: 'Abrir ClimaBot',
    cityPanel: 'panel',
    showClimatePanel: 'Mostrar panel climático',

    consortiumPartners: 'Socios del Consorcio',
    keyCapabilities: 'Capacidades Clave y Arquitectura',
    euFundingStatement: 'Declaración de Financiación de la UE',
    euFundingNotice:
      'ClimaMap es un proyecto de acción climática cofinanciado por el programa Erasmus+ de la Unión Europea.',
    closeDialog: 'Cerrar Ventana',
    projectPeriod: 'Erasmus+ KA220 · 2024–2027 · Consorcio de gemelos digitales y acción climática',
    pillar1Title: 'Máscara microclimática',
    pillar1Text: 'Delinea la ciudad seleccionada y atenúa suavemente el entorno para enfocar la resiliencia.',
    pillar2Title: 'Alerta temprana IoT',
    pillar2Text: 'Monitorea inundaciones, olas de calor, sequías y deslizamientos con sensores en tiempo real.',
    pillar3Title: 'Asistente CLIMA',
    pillar3Text: 'Recomienda acciones climáticas viables y adaptadas para ciudadanos y administraciones.',
    erasmusModalDesc:
      'ClimaMap es un proyecto multinacional de acción climática y resiliencia urbana cofinanciado por el programa Erasmus+ de la Unión Europea. Su objetivo es desarrollar gemelos digitales y el asistente CLIMA para municipios, universidades y jóvenes embajadores del clima.',

    actionNormal1: 'Fomentar los corredores verdes naturales para mantener el equilibrio del ecosistema local.',
    actionNormal2: 'Revisar los depósitos de captación de agua de lluvia según el ciclo clásico.',
    actionNormal3: 'Priorizar ejes peatonales urbanos ecológicos y ciclovías sostenibles.',
    actionDisturbed1: 'Aplicar acolchado para retener la humedad del suelo ante lluvias irregulares.',
    actionDisturbed2: 'Programar el riego durante la noche para reducir la evaporación solar.',
    actionDisturbed3: 'Instalar toldos ecológicos urbanos que proporcionen sombra en puntos críticos.',
    actionSevere1: 'Restringir actividades intensas al aire libre en horas de máxima insolación (11:00-17:00).',
    actionSevere2: 'Activar el protocolo de ahorro hídrico de emergencia nivel 3.',
    actionSevere3: 'Habilitar refugios climáticos públicos con aire acondicionado para personas vulnerables.',
    actionRapid1: 'Poner en alerta las bombas de drenaje urbano ante tormentas repentinas.',
    actionRapid2: 'Emitir notificaciones de alerta temprana a la población sobre granizo y vendavales.',
    actionRapid3: 'Seguimiento en tiempo real de caídas de presión atmosférica con nodos IoT.',
    actionPsycho1: 'Incorporar recursos de apoyo emocional frente a la eco-ansiedad y la solastalgia.',
    actionPsycho2: 'Diseñar oasis verdes urbanos de calma y bienestar mental comunitario.',
    actionPsycho3: 'Apoyar círculos de diálogo y talleres de jóvenes embajadores por el clima.',
    skipIntro: 'Saltar Intro',
    replayIntro: 'Ver Intro',
    enterMap: 'Entrar al Mapa',
  },

  ro: {
    appTitle: 'ClimaMap',
    appTagline: 'Erasmus+ · 4 țări partenere',
    demoTour: 'Tur demo',
    stopTour: 'Oprește tur',
    continueTour: 'Continuă',
    lightTheme: 'Temă luminoasă',
    darkTheme: 'Temă întunecată',
    switchToLight: 'Comută la tema luminoasă',
    switchToDark: 'Comută la tema întunecată',
    muteSound: 'Oprește sunetul',
    unmuteSound: 'Activează sunetul',
    aboutProject: 'Despre proiect',
    languageSelect: 'Limbă',

    world: 'Global',
    allMap: 'Toată harta',
    regionAnalysis: 'Analiză regională',
    cityFocusMode: 'Mod focalizare oraș',

    countryScan: 'Scanare Climatică a Țării',
    countryScanSubtitle: 'Norme climatice clasice și harta anomaliilor regionale',
    startScan: 'Începe Scanarea',
    closeScan: 'Închide Scanarea',
    naturalReference: 'Indicator de Referință Natural',
    showAnomaly: 'Arată Anomalia Climatică',
    normalClimateHistorical: 'Referință Istorică Normală',
    regionalStatus: 'Stare Regională',
    scannedRegions: 'regiuni scanate',

    feelsLike: 'Se simte ca',
    digitalTwin3D: 'Gemene Digital 3D',
    airQuality: 'Calitatea aerului',
    relativeHumidity: 'Umiditate',
    rainfall24h: 'Precipitații (24h)',
    wind: 'Vânt',
    greenCover: 'Acoperire vegetală',
    uvIndex: 'Index UV',

    aqiGood: 'Bună',
    aqiModerate: 'Moderată',
    aqiSensitive: 'Sensibilă',
    aqiUnhealthy: 'Nesănătoasă',
    aqiHazardous: 'Periculoasă',

    climateHazards: 'Riscuri Climatice & Avertizare Timpurie',
    criticalThreshold: 'Prag Critic',
    highRisk: 'Risc Ridicat',
    moderateRisk: 'Risc Moderat',
    lowRisk: 'Risc Scăzut',
    criticalLevel: 'Critic',
    trendUp: 'În creștere',
    trendDown: 'În scădere',
    trendStable: 'Stabil',

    regionalRegime: 'Regim climatic regional',
    classicalBaseline: 'Regim clasic',
    anomalyType: 'Tip anomalie',

    anomalyNormal: 'Echilibrat',
    anomalyDisturbed: 'Perturbat',
    anomalySevere: 'Anomalie Severă',
    anomalyRapid: 'Schimbare Rapidă',
    anomalyPsycho: 'Eco-Anxietate',

    badgeNormal: '🟢 Verde · Echilibrat',
    badgeDisturbed: '🟡 Galben · Perturbat',
    badgeSevere: '🔴 Roșu · Anomalie Severă',
    badgeRapid: '🔵 Albastru Deschis · Schimbare Rapidă',
    badgePsycho: '🟣 Mov · Impact Psihologic',

    sensorsTelemetry: 'Senzori de Monitorizare & Telemetrie',
    activeSensors: 'Senzori Activi',
    battery: 'Baterie',
    statusOnline: 'Activ',
    statusWarning: 'Avertisment',
    statusAlert: 'Alarmă',

    climaAssistant: 'ClimaBot Asistent Decizional',
    climaGuide: 'ClimaBot',
    climaActionPlanFor: 'Plan de acțiune pentru',
    recommendedActions: 'Acțiuni Recomandate',
    allActionsDone: 'Toate acțiunile ClimaBot finalizate',
    decisionSupportNote: 'Notă decizională ClimaBot',
    minimizeAssistant: 'Restrânge ClimaBot',
    expandAssistant: 'Extinde ClimaBot',

    simulationTitle: 'Simulare Încălzire Climatică',
    simulationStep: 'Pas Simulare',
    simulationLive: 'Acum (În direct)',
    simulation12h: '+12 Ore',
    simulation24h: '+24 Ore',
    simulation2030: 'Proiecție 2030',

    modelViewerTitle: 'Gemene Digital 3D & Model',
    modelLoading: 'Se încarcă modelul 3D...',
    modelDragHint: 'Trage pentru a roti ↺',
    modelReady: 'Model 3D Pregătit',
    modelAddHint: 'adaugă fișierul în folderul public/models/.',

    partnerCountries: 'Țări Partenere',
    renewable: 'Regenerabil',
    afforestation: 'Împădurire',
    sensorsCount: 'Senzori',
    activeAlerts: 'Alarme Active',

    spotlightActive: 'Mod Focalizare Gemene Digital',
    sensorNetOnline: 'Rețea Senzori Activă',
    exitFocus: 'Ieșire din Focalizare',
    close: 'Închide',

    tabOverview: 'Climă și riscuri',
    tabSensors: 'Senzori',
    tabSimulator: 'Simulator',
    layerThermal: 'Căldură termică',
    layerFlood: 'Model inundație',
    layerAir: 'Particule (PM2.5)',
    layerGreen: 'Coridor verde',
    visualizationLayer: 'Strat de vizualizare',
    activeIoTNodes: 'Noduri IoT active',
    onlineCount: 'online',
    timeSimulator: 'Simulator temporal',
    timeSimulatorDesc: 'Simulează riscurile climatice viitoare ale orașului pe baza modelelor IPCC și a senzorilor.',
    historicalBaseline: 'Așteptare istorică',
    ecologicalImpact: 'Impact ecologic și social',
    indicatorsCount: 'indicatori',
    explorePrototype: 'Explorează prototipul',
    openClimaGuide: 'Deschide ClimaBot',
    cityPanel: 'panou',
    showClimatePanel: 'Arată panoul climatic',

    consortiumPartners: 'Parteneri Consorțiu',
    keyCapabilities: 'Capabilități Cheie & Arhitectură',
    euFundingStatement: 'Declarație de Finanțare UE',
    euFundingNotice:
      'ClimaMap este un proiect de acțiune climatică cofinanțat prin programul Erasmus+ al Uniunii Europene.',
    closeDialog: 'Închide Fereastra',
    projectPeriod: 'Erasmus+ KA220 · 2024–2027 · Consorțiu pentru gemeni digitali și acțiune climatică',
    pillar1Title: 'Mască microclimatică',
    pillar1Text: 'Conturează orașul selectat și atenuează împrejurimile pentru a focaliza reziliența urbană.',
    pillar2Title: 'Avertizare timpurie IoT',
    pillar2Text: 'Monitorizează inundațiile, canicula, seceta și alunecările cu senzori în timp real.',
    pillar3Title: 'Asistent CLIMA',
    pillar3Text: 'Recomandă acțiuni climatice practice și adaptate pentru cetățeni și autorități.',
    erasmusModalDesc:
      'ClimaMap este un proiect transnațional de acțiune climatică și reziliență urbană cofinanțat prin programul Erasmus+ al Uniunii Europene. Vizează dezvoltarea tehnologiei gemenilor digitali și a asistentului CLIMA pentru administrații, universități și tineri ambasadori climatici.',

    actionNormal1: 'Susțineți coridoarele verzi naturale pentru a menține echilibrul ecologic local.',
    actionNormal2: 'Verificați rezervoarele de colectare a apei de ploaie conform ciclului clasic.',
    actionNormal3: 'Promovați culoarele pietonale urbane ecologice și pistele de biciclete.',
    actionDisturbed1: 'Aplicați mulcire pentru reținerea umidității solului din cauza anomaliilor de precipitații.',
    actionDisturbed2: 'Planificați irigarea spațiilor verzi noaptea pentru a reduce evaporarea.',
    actionDisturbed3: 'Amplasați copertine ecologice urbane în zonele cu stres termic ridicat.',
    actionSevere1: 'Limitați activitățile în aer liber în intervalul de caniculă intensă (11:00-17:00).',
    actionSevere2: 'Activați protocolul de economisire critică a apei de nivelul 3.',
    actionSevere3: 'Deschideți centre publice climatizate pentru adăpostirea persoanelor vulnerabile.',
    actionRapid1: 'Pregătiți pompele de drenaj urban pentru viituri rapide și averse torențiale.',
    actionRapid2: 'Transmiteți alerte timpurii cetățenilor împotriva furtunilor bruște și a grindinei.',
    actionRapid3: 'Monitorizați căderile bruște de presiune și rafalele de vânt prin rețeaua de noduri IoT.',
    actionPsycho1: 'Oferiți suport informațional și consiliere împotriva eco-anxietății și solastalgiei.',
    actionPsycho2: 'Amenajați oaze verzi de relaxare și mindfulness pentru sănătatea comunității.',
    actionPsycho3: 'Susțineți atelierele și cercurile de solidaritate ale tinerilor ambasadori climatici.',
    skipIntro: 'Sari Peste Intro',
    replayIntro: 'Urmărește Intro',
    enterMap: 'Intră pe Hartă',
  },
};

const REGION_TRANSLATIONS: Record<
  string,
  Record<
    Language,
    {
      name: string;
      classicalClimate: string;
      currentStatus: string;
    }
  >
> = {
  'tr-karadeniz': {
    tr: {
      name: 'Karadeniz Bölgesi',
      classicalClimate: 'Her mevsim bol yağışlı, ılıman ve nemli Karadeniz iklimi.',
      currentStatus: 'İklim Bozulmuş: Klasik yağış döngüsü kırıldı; anormal güneşlenme ve toprak kuruma sapması yaşanıyor.',
    },
    en: {
      name: 'Black Sea Region',
      classicalClimate: 'Temperate and humid Black Sea climate with abundant rainfall throughout the year.',
      currentStatus: 'Disturbed Climate: Disrupted rainfall regime; abnormal solar exposure and soil desiccation observed.',
    },
    it: {
      name: 'Regione del Mar Nero',
      classicalClimate: 'Clima temperato e umido del Mar Nero con abbondanti precipitazioni durante tutto l’anno.',
      currentStatus: 'Clima Disturbato: Ciclo delle precipitazioni alterato; insolazione anomala e disseccamento del suolo.',
    },
    es: {
      name: 'Región del Mar Negro',
      classicalClimate: 'Clima templado y húmedo del Mar Negro con lluvias abundantes durante todo el año.',
      currentStatus: 'Clima Perturbado: Ciclo de lluvias roto; insolación anómala y desecación del suelo.',
    },
    ro: {
      name: 'Regiunea Mării Negre',
      classicalClimate: 'Climat temperat și umed al Mării Negre, cu precipitații abundente pe tot parcursul anului.',
      currentStatus: 'Climat Perturbat: Regim de precipitații perturbat; insolație anormală și uscare accentuată a solului.',
    },
  },
  'tr-marmara': {
    tr: {
      name: 'Marmara Bölgesi',
      classicalClimate: 'Akdeniz ve Karadeniz geçiş kuşağı, dengeli rüzgar ve mevsimsel serinlik.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani hava cephesi sıçramaları, şok dolu ve basınç fırtınaları.',
    },
    en: {
      name: 'Marmara Region',
      classicalClimate: 'Transitional zone between Mediterranean and Black Sea climates with balanced seasonal winds.',
      currentStatus: 'Rapid Shift: Sudden frontal wind squalls, flash hail, and sharp atmospheric pressure jumps.',
    },
    it: {
      name: 'Regione di Marmara',
      classicalClimate: 'Fascia di transizione tra Mar Nero e Mediterraneo con venti bilanciati.',
      currentStatus: 'Cambiamento Rapido: Fronte temporalesco improvviso, grandinate violente e balzi barometrici.',
    },
    es: {
      name: 'Región de Mármara',
      classicalClimate: 'Zona de transición entre el Mediterráneo y el Mar Negro con vientos templados.',
      currentStatus: 'Cambio Rápido: Saltos bruscos de frentes térmicos, granizo repentino y tormentas de presión.',
    },
    ro: {
      name: 'Regiunea Marmara',
      classicalClimate: 'Zonă de tranziție între clima mediteraneană și cea pontică, cu brize echilibrate.',
      currentStatus: 'Schimbare Rapidă: Fronturi atmosferice bruște, grindină intensă și salturi de presiune.',
    },
  },
  'tr-ege': {
    tr: {
      name: 'Ege Bölgesi',
      classicalClimate: 'Ilıman Akdeniz mikro-iklimi, kıyı meltemleri ve zeytin vadileri.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Eko-anksiyete, kronik sıcaklık uykusuzluğu ve solastalgia (yitirilen doğa yası).',
    },
    en: {
      name: 'Aegean Region',
      classicalClimate: 'Mild Mediterranean microclimate, coastal sea breezes, and olive orchard valleys.',
      currentStatus: 'Eco-Anxiety Impact: Solastalgia, chronic heat insomnia, and distress from degraded landscapes.',
    },
    it: {
      name: 'Regione Egea',
      classicalClimate: 'Microclima mediterraneo mite, brezze costiere e valli di uliveti.',
      currentStatus: 'Impatto Psicologico: Eco-ansia, insonnia da calore cronico e solastalgia diffusa.',
    },
    es: {
      name: 'Región del Egeo',
      classicalClimate: 'Microclima mediterráneo suave, brisas costeras y valles de olivos.',
      currentStatus: 'Impacto Psicológico: Eco-ansiedad, insomnio por calor crónico y solastalgia.',
    },
    ro: {
      name: 'Regiunea Egeeană',
      classicalClimate: 'Microclimat mediteranean blând, brize marine și văi cultivate cu măslini.',
      currentStatus: 'Impact Psihologic: Eco-anxietate, insomnie provocată de căldură și solastalgie.',
    },
  },
  'tr-akdeniz': {
    tr: {
      name: 'Akdeniz & Güney Bölgesi',
      classicalClimate: 'Sıcak ve kuru yazlar, ılıman ve bol yağışlı kışlar.',
      currentStatus: 'Aşırı Bozulmuş: Çok güneşli, ekstrem ısı dalgaları (+41°C) ve kritik orman yangını/kuraklık alarmı.',
    },
    en: {
      name: 'Mediterranean & South Region',
      classicalClimate: 'Hot dry summers and mild rainy winters.',
      currentStatus: 'Severe Anomaly: Extreme heatwaves (+41°C), solar stress, and critical wildfire/drought alert.',
    },
    it: {
      name: 'Regione Mediterranea & Sud',
      classicalClimate: 'Estati calde e asciutte, inverni miti e piovosi.',
      currentStatus: 'Anomalia Grave: Ondate di caldo estremo (+41°C), radiazione solare intensa e allerta incendi.',
    },
    es: {
      name: 'Región Mediterránea y Sur',
      classicalClimate: 'Veranos calurosos y secos, inviernos suaves y lluviosos.',
      currentStatus: 'Anomalía Grave: Olas de calor extremo (+41°C), radiación severa y alerta máxima de incendios.',
    },
    ro: {
      name: 'Regiunea Mediteraneană și de Sud',
      classicalClimate: 'Veri calde și uscate, ierni blânde și ploioase.',
      currentStatus: 'Anomalie Severă: Valuri de căldură extremă (+41°C), radiații intense și alertă critică de incendii.',
    },
  },
  'tr-icanadolu': {
    tr: {
      name: 'İç Anadolu Bölgesi',
      classicalClimate: 'Yarı kurak step iklimi, serin geceler ve karasal denge.',
      currentStatus: 'Normal ve Dengeli: Hiçbir sorun yok; mevsim normallerinde sıcaklık ve stabil toprak nemi.',
    },
    en: {
      name: 'Central Anatolia Region',
      classicalClimate: 'Semi-arid steppe climate, cool continental nights, and steady seasonal cycles.',
      currentStatus: 'Balanced Normal: No issues; seasonal temperatures and stable soil moisture within historical baselines.',
    },
    it: {
      name: 'Anatolia Centrale',
      classicalClimate: 'Clima steppico semi-arido, notti fresche ed equilibrio continentale.',
      currentStatus: 'Normale ed Equilibrato: Nessun problema; temperature stagionali e umidità del suolo nella norma.',
    },
    es: {
      name: 'Anatolia Central',
      classicalClimate: 'Clima estepario semiárido, noches frescas y estabilidad continental.',
      currentStatus: 'Normal y Equilibrado: Sin problemas; temperaturas estacionales y humedad del suelo dentro de la norma.',
    },
    ro: {
      name: 'Anatolia Centrală',
      classicalClimate: 'Climat de stepă semiarid, nopți răcoroase și stabilitate continentală.',
      currentStatus: 'Normal și Echilibrat: Nicio problemă; temperaturi sezoniere și umiditate a solului în limite normale.',
    },
  },
  'tr-doguanadolu': {
    tr: {
      name: 'Doğu Anadolu Bölgesi',
      classicalClimate: 'Sert karasal yayla iklimi, serin yazlar ve yüksek dağ ekosistemi.',
      currentStatus: 'Normal ve Dengeli: Doğal döngü korunuyor; buzul ve nehir beslenmeleri dengede.',
    },
    en: {
      name: 'Eastern Anatolia Region',
      classicalClimate: 'Highland continental climate with cool summers and alpine ecosystems.',
      currentStatus: 'Balanced Normal: Natural cycles preserved; glacier fed rivers operating at equilibrium.',
    },
    it: {
      name: 'Anatolia Orientale',
      classicalClimate: 'Clima continentale d’altopiano con estati fresche ed ecosistemi alpini.',
      currentStatus: 'Normale ed Equilibrato: Cicli naturali preservati; portate glaciali e fluviali regolari.',
    },
    es: {
      name: 'Anatolia Oriental',
      classicalClimate: 'Clima continental de montaña con veranos frescos y ecosistemas alpinos.',
      currentStatus: 'Normal y Equilibrado: Ciclos naturales preservados; cauces fluviales y glaciares estables.',
    },
    ro: {
      name: 'Anatolia Orientală',
      classicalClimate: 'Climat continental montan cu veri răcoroase și ecosisteme alpine.',
      currentStatus: 'Normal și Echilibrat: Cicluri naturale conservate; cursuri de apă alimentate stabil.',
    },
  },
  'it-north': {
    tr: {
      name: 'Kuzey İtalya & Alpler',
      classicalClimate: 'Alp dağ iklimi, daimi kar ve serin vadi rüzgarları.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Hızlı buzul erimesi ve ani şiddetli fırtına döngüleri.',
    },
    en: {
      name: 'Northern Italy & Alps',
      classicalClimate: 'Alpine mountain climate, permanent snowfields, and cool valley drafts.',
      currentStatus: 'Rapid Shift: Accelerated glacier retreat and rapid convective storm outbreaks.',
    },
    it: {
      name: 'Nord Italia & Alpi',
      classicalClimate: 'Clima alpino montano, nevi perenni e brezze vallive fresche.',
      currentStatus: 'Cambiamento Rapido: Rapido scioglimento dei ghiacciai e frequenti temporali improvvisi.',
    },
    es: {
      name: 'Norte de Italia y Alpes',
      classicalClimate: 'Clima alpino de montaña, nieves perpetuas y vientos frescos de valle.',
      currentStatus: 'Cambio Rápido: Deshielo glaciar acelerado y tormentas repentinas de alta intensidad.',
    },
    ro: {
      name: 'Nordul Italiei și Alpii',
      classicalClimate: 'Climat alpin montan, zăpezi permanente și curenți răcoroși de vale.',
      currentStatus: 'Schimbare Rapidă: Retragere accelerată a ghețarilor și furtuni convective violente.',
    },
  },
  'it-po': {
    tr: {
      name: 'Po Ovası & Emilia',
      classicalClimate: 'Nemli subtropikal nehir deltası ve düzenli bahar yağışları.',
      currentStatus: 'İklim Bozulmuş: Yağış döngüsü kırıldı; nehir debisi anormal düşüşte ve tarımsal nem sapması var.',
    },
    en: {
      name: 'Po Valley & Emilia',
      classicalClimate: 'Humid subtropical river plains and reliable spring rainfall.',
      currentStatus: 'Disturbed Climate: Altered rainfall frequency; record river low flows and agricultural drought.',
    },
    it: {
      name: 'Pianura Padana ed Emilia',
      classicalClimate: 'Pianura alluvionale subtropicale umida con piogge primaverili costanti.',
      currentStatus: 'Clima Disturbato: Ciclo idrico interrotto; portate fluviali ai minimi storici e deficit irriguo.',
    },
    es: {
      name: 'Valle del Po y Emilia',
      classicalClimate: 'Llanura fluvial subtropical húmeda con precipitaciones primaverales regulares.',
      currentStatus: 'Clima Perturbado: Ciclo de lluvias alterado; caudales mínimos y estrés hídrico agrario.',
    },
    ro: {
      name: 'Valea Po și Emilia',
      classicalClimate: 'Câmpie fluvială subtropicală umedă și precipitații regulate de primăvară.',
      currentStatus: 'Climat Perturbat: Ciclu hidrologic afectat; debite fluviale scăzute și secetă agricolă.',
    },
  },
  'it-central': {
    tr: {
      name: 'Merkez İtalya & Toskana',
      classicalClimate: 'Akdeniz ılıman tepeleri, dengeli selvi ve bağ ekosistemi.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Tarihi peyzajın kurumasından kaynaklı solastalgia ve eko-stres.',
    },
    en: {
      name: 'Central Italy & Tuscany',
      classicalClimate: 'Temperate Mediterranean hill terrain, historic vineyards, and olive groves.',
      currentStatus: 'Eco-Anxiety Impact: Solastalgia and stress caused by degradation of iconic rural landscapes.',
    },
    it: {
      name: 'Italia Centrale & Toscana',
      classicalClimate: 'Colline mediterranee temperate con vigneti ed oliveti storici.',
      currentStatus: 'Impatto Psicologico: Solastalgia ed eco-ansia dovute al disseccamento del paesaggio storico.',
    },
    es: {
      name: 'Italia Central y Toscana',
      classicalClimate: 'Colinas mediterráneas templadas con viñedos y olivares tradicionales.',
      currentStatus: 'Impacto Psicológico: Solastalgia y angustia climática por el deterioro del paisaje rural.',
    },
    ro: {
      name: 'Italia Centrală și Toscana',
      classicalClimate: 'Dealuri mediteraneene temperate, podgorii istorice și livezi de măslini.',
      currentStatus: 'Impact Psihologic: Solastalgie și anxietate ecologică declanșate de degradarea peisajului.',
    },
  },
  'it-south': {
    tr: {
      name: 'Güney İtalya & Sicilya',
      classicalClimate: 'Sıcak ve kuru Akdeniz sahil kuşağı.',
      currentStatus: 'Aşırı Bozulmuş: Tropikal sıcak dalgaları (+42°C), aşırı güneşlenme ve su kıtlığı acil durumu.',
    },
    en: {
      name: 'Southern Italy & Sicily',
      classicalClimate: 'Warm and arid coastal Mediterranean climate.',
      currentStatus: 'Severe Anomaly: Persistent tropical heatwaves (+42°C), intense solar stress, and acute water shortage.',
    },
    it: {
      name: 'Sud Italia & Sicilia',
      classicalClimate: 'Fascia costiera mediterranea calda e arida.',
      currentStatus: 'Anomalia Grave: Ondate di calore tropicali (+42°C), forte insolazione ed emergenza siccità.',
    },
    es: {
      name: 'Sur de Italia y Sicilia',
      classicalClimate: 'Franja costera mediterránea cálida y árida.',
      currentStatus: 'Anomalía Grave: Olas de calor tropicales (+42°C), estrés térmico agudo y escasez de agua.',
    },
    ro: {
      name: 'Sudul Italiei și Sicilia',
      classicalClimate: 'Zonă de coastă mediteraneană caldă și aridă.',
      currentStatus: 'Anomalie Severă: Valuri tropicale de caniculă (+42°C), insolație severă și criză de apă potabilă.',
    },
  },
  'es-north': {
    tr: {
      name: 'Cantabria & Bask',
      classicalClimate: 'Okyanusal iklim, sürekli yeşil meralar ve düzenli çiseleyen yağışlar.',
      currentStatus: 'İklim Bozulmuş: Yağmur yerine uzun süreli kavurucu güneş; toprak nemi alışılmadık şekilde tükeniyor.',
    },
    en: {
      name: 'Cantabria & Basque',
      classicalClimate: 'Oceanic climate with lush green meadows and frequent light drizzle.',
      currentStatus: 'Disturbed Climate: Persistent scorching sun instead of regular rain; unusual soil moisture depletion.',
    },
    it: {
      name: 'Cantabria e Paesi Baschi',
      classicalClimate: 'Clima oceanico con prati sempreverdi e frequenti piogge sottili.',
      currentStatus: 'Clima Disturbato: Sole cocente prolungato al posto delle piogge; deficit insolito di umidità.',
    },
    es: {
      name: 'Cantabria y País Vasco',
      classicalClimate: 'Clima oceánico, praderas verdes continuas y lluvias orográficas frecuentes.',
      currentStatus: 'Clima Perturbado: Sol abrasador prolongado en vez del calabobos habitual; sequedad anómala.',
    },
    ro: {
      name: 'Cantabria și Țara Bascilor',
      classicalClimate: 'Climat oceanic cu pășuni verzi și burnițe frecvente.',
      currentStatus: 'Climat Perturbat: Soare arzător prelungit în locul ploilor; scădere neobișnuită a umidității.',
    },
  },
  'es-galicia': {
    tr: {
      name: 'Galiçya Bölgesi',
      classicalClimate: 'Atlantik nemli iklimi, serin fiyortlar ve ormanlık vadiler.',
      currentStatus: 'Normal ve Dengeli: Doğal yağış ve nem rejiminde sapma yok.',
    },
    en: {
      name: 'Galicia Region',
      classicalClimate: 'Humid Atlantic maritime climate, fresh estuaries, and forested hills.',
      currentStatus: 'Balanced Normal: Preserved rainfall baseline and steady moisture balance.',
    },
    it: {
      name: 'Regione della Galizia',
      classicalClimate: 'Clima atlantico umido, estuari freschi e valli boscose.',
      currentStatus: 'Normale ed Equilibrato: Nessuna anomalia nel regime naturale di piogge e umidità.',
    },
    es: {
      name: 'Región de Galicia',
      classicalClimate: 'Clima atlántico húmedo, rías frescas y valles boscosos.',
      currentStatus: 'Normal y Equilibrado: Sin anomalías en el régimen de precipitaciones y humedad.',
    },
    ro: {
      name: 'Regiunea Galiția',
      classicalClimate: 'Climat atlantic umed, fiorduri răcoroase și văi împădurite.',
      currentStatus: 'Normal și Echilibrat: Fără abateri în regimul natural de precipitații și umiditate.',
    },
  },
  'es-central': {
    tr: {
      name: 'Merkez & Madrid Platosu',
      classicalClimate: 'Karasal Akdeniz yüksek platosu, berrak gökyüzü.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Uzayan sıcak dalgaları ve kentsel ısı stresi toplum ruh sağlığını baskılıyor.',
    },
    en: {
      name: 'Central & Madrid Plateau',
      classicalClimate: 'Continental Mediterranean highland plateau with sharp diurnal variance.',
      currentStatus: 'Eco-Anxiety Impact: Prolonged heatwaves and urban thermal strain dampening collective wellbeing.',
    },
    it: {
      name: 'Centro & Altopiano di Madrid',
      classicalClimate: 'Altopiano continentale mediterraneo ad elevata escursione termica.',
      currentStatus: 'Impatto Psicologico: Ondate di calore prolungate e stress termico che pesano sulla salute mentale.',
    },
    es: {
      name: 'Centro y Meseta de Madrid',
      classicalClimate: 'Meseta mediterránea continental con cielos despejados y fuerte oscilación.',
      currentStatus: 'Impacto Psicológico: Olas de calor sofocantes y estrés térmico urbano afectando el ánimo social.',
    },
    ro: {
      name: 'Centru și Podișul Madrid',
      classicalClimate: 'Podiș mediteranean continental cu cer senin și variații termice accentuate.',
      currentStatus: 'Impact Psihologic: Canicule prelungite și stres termic urban cu impact asupra sănătății psihice.',
    },
  },
  'es-east': {
    tr: {
      name: 'Katalonya & Valensiya',
      classicalClimate: 'Kıyı Akdeniz iklimi, ılıman kışlar ve sıcak yazlar.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani damla fırtınaları (DANA) ve rekor kıran basınç anomalileri.',
    },
    en: {
      name: 'Catalonia & Valencia',
      classicalClimate: 'Coastal Mediterranean climate with mild winters and warm summers.',
      currentStatus: 'Rapid Shift: Severe cut-off low storms (DANA) and record atmospheric pressure swings.',
    },
    it: {
      name: 'Catalogna e Valencia',
      classicalClimate: 'Clima costiero mediterraneo con inverni miti ed estati calde.',
      currentStatus: 'Cambiamento Rapido: Violente tempeste DANA e anomalie barometriche record.',
    },
    es: {
      name: 'Cataluña y Valencia',
      classicalClimate: 'Clima mediterráneo litoral con inviernos suaves y veranos cálidos.',
      currentStatus: 'Cambio Rápido: Episodios repentinos de DANA (gota fría) y anomalías récord de presión.',
    },
    ro: {
      name: 'Catalonia și Valencia',
      classicalClimate: 'Climat mediteranean de coastă cu ierni blânde și veri calde.',
      currentStatus: 'Schimbare Rapidă: Furtuni bruște de tip DANA și variații barice record.',
    },
  },
  'es-south': {
    tr: {
      name: 'Endülüs & Murcia',
      classicalClimate: 'Akdeniz yarı kurak kıyı ve zeytin vadileri.',
      currentStatus: 'Aşırı Bozulmuş: Aşırı güneşli ve çölleşme eşiğinde; rekor sıcaklık (+44°C) ve su rezervuarı krizi.',
    },
    en: {
      name: 'Andalusia & Murcia',
      classicalClimate: 'Semi-arid Mediterranean coastal and interior olive valleys.',
      currentStatus: 'Severe Anomaly: Borderline desertification; scorching +44°C peaks and depleted reservoirs.',
    },
    it: {
      name: 'Andalusia e Murcia',
      classicalClimate: 'Clima mediterraneo semi-arido con valli di ulivi.',
      currentStatus: 'Anomalia Grave: Rischio desertificazione; picchi record (+44°C) e bacini idrici in emergenza.',
    },
    es: {
      name: 'Andalucía y Murcia',
      classicalClimate: 'Mediterráneo semiárido costero y campiñas de olivar.',
      currentStatus: 'Anomalía Grave: En umbral de desertización; temperaturas récord (+44°C) y embalses críticos.',
    },
    ro: {
      name: 'Andaluzia și Murcia',
      classicalClimate: 'Climat mediteranean semiarid și văi cu livezi de măslini.',
      currentStatus: 'Anomalie Severă: La pragul deșertificării; temperaturi de +44°C și secare a rezervoarelor.',
    },
  },
  'ro-carpathians': {
    tr: {
      name: 'Karpatlar & Transilvanya',
      classicalClimate: 'Orta Avrupa dağ iklimi, zengin iğne yapraklı ormanlar ve serin yazlar.',
      currentStatus: 'Normal ve Dengeli: Orman örtüsü ve su kaynakları dengesini koruyor.',
    },
    en: {
      name: 'Carpathians & Transylvania',
      classicalClimate: 'Central European alpine climate with dense coniferous forests and cool summers.',
      currentStatus: 'Balanced Normal: Intact forest canopy and healthy headwater river basins.',
    },
    it: {
      name: 'Carpazi & Transilvania',
      classicalClimate: 'Clima montano centro-europeo con fitte foreste di conifere ed estati fresche.',
      currentStatus: 'Normale ed Equilibrato: Copertura forestale integra e sorgenti idriche stabili.',
    },
    es: {
      name: 'Cárpatos y Transilvania',
      classicalClimate: 'Clima de montaña centroeuropeo con densos bosques de coníferas y veranos frescos.',
      currentStatus: 'Normal y Equilibrado: Cobertura forestal intacta y cuencas fluviales estables.',
    },
    ro: {
      name: 'Carpații și Transilvania',
      classicalClimate: 'Climat montan central-european cu păduri bogate de conifere și veri răcoroase.',
      currentStatus: 'Normal și Echilibrat: Învelișul forestier și resursele de apă își păstrează echilibrul.',
    },
  },
  'ro-danube': {
    tr: {
      name: 'Tuna & Muntenia',
      classicalClimate: 'Karasal ova iklimi, tarımsal tahıl havzası.',
      currentStatus: 'Aşırı Bozulmuş: Kavurucu sıcak hava kütleleri (+39°C), yoğun güneşlenme ve akifer kuruması.',
    },
    en: {
      name: 'Danube & Muntenia',
      classicalClimate: 'Continental lowland plains with agricultural cereal basins.',
      currentStatus: 'Severe Anomaly: Blistering heat plumes (+39°C), high solar stress, and aquifer drawdown.',
    },
    it: {
      name: 'Danubio & Muntenia',
      classicalClimate: 'Pianura continentale con estesi bacini cerealicoli.',
      currentStatus: 'Anomalia Grave: Masse d’aria torride (+39°C), insolazione intensa e abbassamento delle falde.',
    },
    es: {
      name: 'Danubio y Muntenia',
      classicalClimate: 'Llanura continental con cuencas agrícolas cerealistas.',
      currentStatus: 'Anomalía Grave: Masas de aire abrasador (+39°C), insolación intensa y agotamiento de acuíferos.',
    },
    ro: {
      name: 'Dunărea și Muntenia',
      classicalClimate: 'Climat de câmpie continentală, bazin cerealier agricol.',
      currentStatus: 'Anomalie Severă: Mase de aer toride (+39°C), insolație intensă și secarea acviferelor.',
    },
  },
  'ro-moldova': {
    tr: {
      name: 'Moldova & Siret Vadisi',
      classicalClimate: 'Doğu Avrupa karasal geçiş iklimi.',
      currentStatus: 'İklim Bozulmuş: Yağış dengesi bozuldu; beklenmeyen kurak güneş ve nehir debisi sapmaları.',
    },
    en: {
      name: 'Moldavia & Siret Valley',
      classicalClimate: 'Eastern European transitional continental climate.',
      currentStatus: 'Disturbed Climate: Precipitation imbalance; erratic drought spells and disrupted river flows.',
    },
    it: {
      name: 'Moldavia e Valle del Siret',
      classicalClimate: 'Clima continentale di transizione dell’Europa orientale.',
      currentStatus: 'Clima Disturbato: Precipitazioni sbilanciate; siccità inattesa e calo di portata fluviale.',
    },
    es: {
      name: 'Moldavia y Valle del Siret',
      classicalClimate: 'Clima continental de transición de Europa del Este.',
      currentStatus: 'Clima Perturbado: Desequilibrio de precipitaciones; sequía imprevista y caudales alterados.',
    },
    ro: {
      name: 'Moldova și Valea Siretului',
      classicalClimate: 'Climat continental de tranziție est-european.',
      currentStatus: 'Climat Perturbat: Echilibru pluviometric afectat; secetă neașteptată și debite fluviale reduse.',
    },
  },
  'ro-blacksea': {
    tr: {
      name: 'Dobruca & Karadeniz Sahili',
      classicalClimate: 'Karadeniz kıyı mikro-iklimi, deniz meltemleri.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani fırtına hatları ve Karadeniz deniz suyu sıcaklığı sıçramaları.',
    },
    en: {
      name: 'Dobruja & Black Sea Coast',
      classicalClimate: 'Black Sea coastal maritime microclimate with steady sea breezes.',
      currentStatus: 'Rapid Shift: Sudden squall lines and unprecedented Black Sea marine heatwave spikes.',
    },
    it: {
      name: 'Dobrugia & Costa del Mar Nero',
      classicalClimate: 'Microclima costiero del Mar Nero con brezze marine costanti.',
      currentStatus: 'Cambiamento Rapido: Linee di groppo repentine e ondate di calore marino nel Mar Nero.',
    },
    es: {
      name: 'Dobruja y Costa del Mar Negro',
      classicalClimate: 'Microclima costero del Mar Negro con brisas marinas moderadas.',
      currentStatus: 'Cambio Rápido: Líneas de turbonada repentinas y picos térmicos marinos sin precedentes.',
    },
    ro: {
      name: 'Dobrogea și Litoralul Mării Negre',
      classicalClimate: 'Microclimat maritim costier al Mării Negre, brize marine regulate.',
      currentStatus: 'Schimbare Rapidă: Linii bruște de vijelie și creșteri record ale temperaturii apei mării.',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  getCountryName: (country: { name: string; nameEn?: string; id: string }) => string;
  getCityName: (city: { name: string; id: string }) => string;
  getRegionName: (region: { id: string; name: string }) => string;
  getRegionTexts: (region: CountryRegion) => { name: string; classicalClimate: string; currentStatus: string };
  getHazardName: (hazard: { name: string; nameEn?: string; description?: string }) => { name: string; description: string };
  getSimulationStepLabel: (step: SimulationStep) => { label: string; sublabel: string; climaNote: string };
  getAqiStatusLabel: (status: string) => string;
  getHazardLevelLabel: (level: HazardLevel) => string;
  getAnomalyActions: (anomaly: ClimateAnomalyType) => string[];
  getCitySummary: (city: CityData) => string;
  getCityClassicalProfileTexts: (city: CityData) => { typicalPattern: string; climateZone: string };
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('clima-lang');
    if (saved && (saved === 'tr' || saved === 'en' || saved === 'it' || saved === 'es' || saved === 'ro')) {
      return saved as Language;
    }
    return 'tr';
  });

  useEffect(() => {
    localStorage.setItem('clima-lang', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: keyof TranslationDictionary): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.tr;
      return dict[key] || TRANSLATIONS.tr[key] || key;
    },
    [language]
  );

  const getCountryName = useCallback(
    (country: { name: string; nameEn?: string; id: string }): string => {
      if (language === 'tr') return country.name;
      if (country.nameEn) {
        if (language === 'it') {
          if (country.id === 'turkey') return 'Turchia';
          if (country.id === 'italy') return 'Italia';
          if (country.id === 'spain') return 'Spagna';
          if (country.id === 'romania') return 'Romania';
        }
        if (language === 'es') {
          if (country.id === 'turkey') return 'Turquía';
          if (country.id === 'italy') return 'Italia';
          if (country.id === 'spain') return 'España';
          if (country.id === 'romania') return 'Rumanía';
        }
        if (language === 'ro') {
          if (country.id === 'turkey') return 'Turcia';
          if (country.id === 'italy') return 'Italia';
          if (country.id === 'spain') return 'Spania';
          if (country.id === 'romania') return 'România';
        }
        return country.nameEn;
      }
      return country.name;
    },
    [language]
  );

  const getCityName = useCallback(
    (city: { name: string; id: string }): string => {
      if (city.id === 'bucharest') {
        if (language === 'tr') return 'Bükreş';
        if (language === 'ro') return 'București';
        if (language === 'it') return 'Bucarest';
        if (language === 'es') return 'Bucarest';
        return 'Bucharest';
      }
      if (city.id === 'rome') {
        if (language === 'en') return 'Rome';
        return 'Roma';
      }
      if (city.id === 'istanbul') {
        if (language === 'en' || language === 'es' || language === 'it' || language === 'ro') return 'Istanbul';
        return 'İstanbul';
      }
      return city.name;
    },
    [language]
  );

  const getHazardName = useCallback(
    (hazard: { name: string; nameEn?: string; description?: string }): { name: string; description: string } => {
      if (language === 'tr') {
        return { name: hazard.name, description: hazard.description || '' };
      }
      const englishName = hazard.nameEn || hazard.name;
      // Provide localized descriptions
      const translations: Record<string, Record<Language, { name: string; desc: string }>> = {
        'Aşırı Sıcak Dalgası': {
          tr: { name: 'Aşırı Sıcak Dalgası', desc: 'Kentsel ısı adası etkisiyle tepe sıcaklıklar artıyor.' },
          en: { name: 'Heatwave', desc: 'Peak daytime temperatures elevated due to urban heat island effect.' },
          it: { name: 'Ondata di Calore', desc: 'Temperature massime elevate per effetto dell’isola di calore urbana.' },
          es: { name: 'Ola de Calor', desc: 'Temperaturas máximas elevadas por efecto isla de calor urbana.' },
          ro: { name: 'Val de Căldură', desc: 'Temperaturi de vârf ridicate din cauza insulei de căldură urbane.' },
        },
        'Taşkın / Ani Yağış': {
          tr: { name: 'Taşkın / Ani Yağış', desc: 'Ani konvektif fırtınalarda drenaj kapasitesi zorlanıyor.' },
          en: { name: 'Flash Flood', desc: 'Drainage network under stress during sudden convective rainbursts.' },
          it: { name: 'Alluvione Lampo', desc: 'Rete di drenaggio sotto sforzo durante precipitazioni improvvise.' },
          es: { name: 'Inundación Repentina', desc: 'Red de drenaje sobrecargada por lluvias convectivas repentinas.' },
          ro: { name: 'Inundație Rapidă', desc: 'Sistemul de drenaj sub presiune în timpul averselor convective bruște.' },
        },
        'Kuraklık & Su Stresi': {
          tr: { name: 'Kuraklık & Su Stresi', desc: 'Baraj doluluk oranları mevsim normallerinin altında.' },
          en: { name: 'Drought & Water Stress', desc: 'Reservoir capacity operating below seasonal baseline norms.' },
          it: { name: 'Siccità & Stress Idrico', desc: 'Bacini idrici al di sotto delle medie storiche stagionali.' },
          es: { name: 'Sequía y Estrés Hídrico', desc: 'Embalses por debajo de las medias históricas estacionales.' },
          ro: { name: 'Secetă & Stres Hidric', desc: 'Nivelul rezervoarelor sub cotele istorice sezoniere.' },
        },
        'Heyelan ve Eğim Stresi': {
          tr: { name: 'Heyelan ve Eğim Stresi', desc: 'Aşırı yağışlarda yamaç doygunluğu ve zemin kayma riski.' },
          en: { name: 'Landslide Risk', desc: 'Slope soil saturation and ground slip hazard during intense rainfall.' },
          it: { name: 'Rischio Frana', desc: 'Saturazione del terreno e pericolo frane durante piogge violente.' },
          es: { name: 'Riesgo de Deslizamiento', desc: 'Saturación del suelo de ladera y riesgo de deslizamiento con lluvias intensas.' },
          ro: { name: 'Risc de Alunecare', desc: 'Saturația solului și pericol de alunecări de teren în timpul ploilor torențiale.' },
        },
        'Kentsel Isı Adası': {
          tr: { name: 'Kentsel Isı Adası', desc: 'Tarihi merkezde beton ve asfalt yüzeyler gece soğumasını engelliyor.' },
          en: { name: 'Urban Heat Island', desc: 'Dense concrete and asphalt core impedes nocturnal radiative cooling.' },
          it: { name: 'Isola di Calore Urbana', desc: 'Cemento e asfalto ostacolano il raffreddamento radiativo notturno.' },
          es: { name: 'Isla de Calor Urbana', desc: 'El asfalto y hormigón impiden el enfriamiento nocturno del centro.' },
          ro: { name: 'Insulă de Căldură Urbană', desc: 'Betonul și asfaltul dens împiedică răcirea radiativă nocturnă.' },
        },
      };

      const matched = translations[hazard.name];
      if (matched && matched[language]) {
        return { name: matched[language].name, description: matched[language].desc };
      }

      return { name: englishName, description: hazard.description || '' };
    },
    [language]
  );

  const getSimulationStepLabel = useCallback(
    (step: SimulationStep) => {
      if (language === 'tr') {
        return { label: step.label, sublabel: step.sublabel, climaNote: step.climaNote };
      }
      if (step.tempDelta === 0) {
        return {
          label: language === 'it' ? 'Ora (Live)' : language === 'es' ? 'Ahora (En vivo)' : language === 'ro' ? 'Acum (Live)' : 'Now (Live)',
          sublabel: 'IoT Real-Time Telemetry',
          climaNote: 'Synchronized with real-time IoT sensors and satellite telemetry.',
        };
      }
      if (step.tempDelta <= 2.0) {
        return {
          label: '+12 ' + (language === 'it' ? 'Ore' : language === 'es' ? 'Horas' : language === 'ro' ? 'Ore' : 'Hours'),
          sublabel: 'Short-Term Weather Forecast',
          climaNote: 'Expected temperature rise and localized wind anomalies over the next 12 hours.',
        };
      }
      if (step.tempDelta <= 3.5) {
        return {
          label: '+24 ' + (language === 'it' ? 'Ore' : language === 'es' ? 'Horas' : language === 'ro' ? 'Ore' : 'Hours'),
          sublabel: 'High Pressure Front',
          climaNote: 'Rapid atmospheric pressure shift: local flash storm or thermal spike triggered.',
        };
      }
      return {
        label: '2030 ' + (language === 'it' ? 'Proiezione' : language === 'es' ? 'Proyección' : language === 'ro' ? 'Proiecție' : 'Projection'),
        sublabel: 'IPCC SSP2-4.5 Climate Model',
        climaNote: 'Digital Twin 2030 Projection: Hazard exposure rises by +65% without urban adaptation.',
      };
    },
    [language]
  );

  const getAqiStatusLabel = useCallback(
    (status: string): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.tr;
      if (status.includes('İyi') || status.includes('Good')) return dict.aqiGood;
      if (status.includes('Hassas') || status.includes('Sensitive')) return dict.aqiSensitive;
      if (status.includes('Orta') || status.includes('Moderate')) return dict.aqiModerate;
      if (status.includes('Sağlıksız') || status.includes('Unhealthy')) return dict.aqiUnhealthy;
      if (status.includes('Tehlikeli') || status.includes('Hazardous')) return dict.aqiHazardous;
      return status;
    },
    [language]
  );

  const getHazardLevelLabel = useCallback(
    (level: HazardLevel): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.tr;
      if (level === 'critical') return dict.criticalLevel;
      if (level === 'high') return dict.highRisk;
      if (level === 'moderate') return dict.moderateRisk;
      return dict.lowRisk;
    },
    [language]
  );

  const getAnomalyActions = useCallback(
    (anomaly: ClimateAnomalyType): string[] => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.tr;
      switch (anomaly) {
        case 'normal':
          return [dict.actionNormal1, dict.actionNormal2, dict.actionNormal3];
        case 'disturbed':
          return [dict.actionDisturbed1, dict.actionDisturbed2, dict.actionDisturbed3];
        case 'severe':
          return [dict.actionSevere1, dict.actionSevere2, dict.actionSevere3];
        case 'rapid':
          return [dict.actionRapid1, dict.actionRapid2, dict.actionRapid3];
        case 'psycho':
          return [dict.actionPsycho1, dict.actionPsycho2, dict.actionPsycho3];
      }
    },
    [language]
  );

  const getCitySummary = useCallback(
    (city: CityData): string => {
      if (language === 'tr') return city.climaAdvice.summary;
      if (city.id === 'istanbul') {
        if (language === 'it') return 'Priorità a mitigazione dell’isola di calore urbana e sensori costieri.';
        if (language === 'es') return 'Prioridad en mitigación de islas de calor urbano y sensores costeros.';
        if (language === 'ro') return 'Prioritate pentru atenuarea insulei de căldură și senzori de coastă.';
        return 'Prioritized mitigation of urban heat islands and coastal storm surge monitoring.';
      }
      if (city.id === 'trabzon') {
        if (language === 'it') return 'Rete di monitoraggio frane e drenaggio fluviale attiva h24.';
        if (language === 'es') return 'Red de monitorización de deslizamientos y drenaje fluvial activa 24/7.';
        if (language === 'ro') return 'Rețea de monitorizare a alunecărilor de teren și drenaj activă 24/7.';
        return 'Landslide prevention sensor network and slope stormwater drainage active 24/7.';
      }
      if (city.id === 'rome') {
        if (language === 'it') return 'Focus sulla tutela del patrimonio storico dalle ondate di calore estreme.';
        if (language === 'es') return 'Protección del patrimonio histórico frente a olas de calor extremas.';
        if (language === 'ro') return 'Protecția patrimoniului istoric împotriva valurilor de căldură extremă.';
        return 'Historic heritage protection and thermal mitigation corridors in ancient center.';
      }
      if (city.id === 'madrid') {
        if (language === 'it') return 'Attivazione del bosco metropolitano e corridoi di ventilazione notturna.';
        if (language === 'es') return 'Activación del bosque metropolitano y corredores de ventilación nocturna.';
        if (language === 'ro') return 'Activarea centurii verzi metropolitane și coridoare de ventilație nocturnă.';
        return 'Metropolitan green belt activation and nocturnal urban ventilation corridors.';
      }
      if (city.id === 'bucharest') {
        if (language === 'it') return 'Piano di riforestazione urbana e mitigazione delle polveri sottili.';
        if (language === 'es') return 'Plan de reforestación urbana y reducción de partículas en suspensión.';
        if (language === 'ro') return 'Plan de împădurire urbană și atenuare a pulberilor în suspensie.';
        return 'Urban afforestation program and particulate matter reduction active.';
      }
      return city.climaAdvice.summary;
    },
    [language]
  );

  const getCityClassicalProfileTexts = useCallback(
    (city: CityData) => {
      if (language === 'tr') {
        return {
          typicalPattern: city.classicalProfile.typicalPattern,
          climateZone: city.classicalProfile.climateZone,
        };
      }
      if (city.id === 'istanbul') {
        return {
          typicalPattern: language === 'it' ? 'Estate calda e umida, transizione tra Mar Nero e Mediterraneo' : language === 'es' ? 'Verano cálido y húmedo, transición entre Mar Negro y Mediterráneo' : language === 'ro' ? 'Vară caldă și umedă, tranziție între Marea Neagră și Mediterana' : 'Warm, humid summer with Black Sea and Mediterranean transitions',
          climateZone: language === 'it' ? 'Mediterraneo / Mar Nero' : language === 'es' ? 'Mediterráneo / Mar Negro' : language === 'ro' ? 'Mediteranean / Marea Neagră' : 'Mediterranean / Black Sea Transition',
        };
      }
      if (city.id === 'trabzon') {
        return {
          typicalPattern: language === 'it' ? 'Clima oceanico umido, precipitazioni costanti in ogni stagione' : language === 'es' ? 'Clima oceánico húmedo, precipitaciones regulares todo el año' : language === 'ro' ? 'Climat oceanic umed, precipitații regulate în toate sezoanele' : 'Humid oceanic climate with year-round rainfall and slope microclimates',
          climateZone: language === 'it' ? 'Oceanico / Pontico' : language === 'es' ? 'Oceánico / Póntico' : language === 'ro' ? 'Oceanic / Pontic' : 'Oceanic / Pontic Rainforest',
        };
      }
      if (city.id === 'rome') {
        return {
          typicalPattern: language === 'it' ? 'Clima mediterraneo classico: estati calde e asciutte, inverni miti' : language === 'es' ? 'Clima mediterráneo clásico: veranos calurosos y secos, inviernos suaves' : language === 'ro' ? 'Climat mediteranean clasic: veri calde și uscate, ierni blânde' : 'Classical Mediterranean: hot dry summers and mild wet winters',
          climateZone: language === 'it' ? 'Mediterraneo (Csa)' : language === 'es' ? 'Mediterráneo (Csa)' : language === 'ro' ? 'Mediteranean (Csa)' : 'Mediterranean (Csa)',
        };
      }
      if (city.id === 'madrid') {
        return {
          typicalPattern: language === 'it' ? 'Mediterraneo continentale: forte escursione termica estiva' : language === 'es' ? 'Mediterráneo continental: gran oscilación térmica y veranos tórridos' : language === 'ro' ? 'Mediteranean continental: oscilații termice puternice și veri toride' : 'Continental Mediterranean: sharp diurnal temperature swings, arid summers',
          climateZone: language === 'it' ? 'Mediterraneo Continentale' : language === 'es' ? 'Mediterráneo Continental' : language === 'ro' ? 'Mediteranean Continental' : 'Continental Mediterranean (BSk/Csa)',
        };
      }
      if (city.id === 'bucharest') {
        return {
          typicalPattern: language === 'it' ? 'Clima continentale umido con estati calde e inverni freddi' : language === 'es' ? 'Clima continental húmedo con veranos cálidos e inviernos fríos' : language === 'ro' ? 'Climat temperat-continental moderat cu veri calde și ierni reci' : 'Humid continental with warm summers and cold snowy winters',
          climateZone: language === 'it' ? 'Continentale Moderato' : language === 'es' ? 'Continental Moderado' : language === 'ro' ? 'Continental Moderat (Dfa)' : 'Moderate Continental (Dfa)',
        };
      }
      return {
        typicalPattern: city.classicalProfile.typicalPattern,
        climateZone: city.classicalProfile.climateZone,
      };
    },
    [language]
  );

  const getRegionName = useCallback(
    (region: { id: string; name: string }): string => {
      const entry = REGION_TRANSLATIONS[region.id];
      if (entry && entry[language]) {
        return entry[language].name;
      }
      return region.name;
    },
    [language]
  );

  const getRegionTexts = useCallback(
    (region: CountryRegion): { name: string; classicalClimate: string; currentStatus: string } => {
      const entry = REGION_TRANSLATIONS[region.id];
      if (entry && entry[language]) {
        return entry[language];
      }
      return {
        name: region.name,
        classicalClimate: region.classicalClimate,
        currentStatus: region.currentStatus,
      };
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      getCountryName,
      getCityName,
      getRegionName,
      getRegionTexts,
      getHazardName,
      getSimulationStepLabel,
      getAqiStatusLabel,
      getHazardLevelLabel,
      getAnomalyActions,
      getCitySummary,
      getCityClassicalProfileTexts,
    }),
    [
      language,
      setLanguage,
      t,
      getCountryName,
      getCityName,
      getRegionName,
      getRegionTexts,
      getHazardName,
      getSimulationStepLabel,
      getAqiStatusLabel,
      getHazardLevelLabel,
      getAnomalyActions,
      getCitySummary,
      getCityClassicalProfileTexts,
    ]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
