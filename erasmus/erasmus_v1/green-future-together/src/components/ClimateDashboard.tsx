import React, { useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import type { CityData, CountryData, SimulationStep, ClimateAnomalyType } from '../types';
import { ClimaAssistant } from './ClimaAssistant';
import { ModelViewer3D } from './ModelViewer3D';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Waves,
  Mountain,
  Droplets,
  Sun,
  Check,
  RotateCw,
} from 'lucide-react';
import { SIMULATION_STEPS } from '../data/climateData';
import { playUiSound } from '../utils/audio';
import { project, springDefault, springSheet, springSnappy } from '../utils/motion';
import { CLIMATE_ANOMALY_CONFIG } from '../utils/climateAnomaly';
import { useLanguage } from '../context/LanguageContext';
import { useWeather } from '../context/WeatherContext';

interface ClimateDashboardProps {
  city: CityData;
  country: CountryData;
  simulationStep: SimulationStep;
  activeAnomaly: ClimateAnomalyType;
  onSimulationChange: (step: SimulationStep) => void;
  onAnomalyChange: (anomaly: ClimateAnomalyType) => void;
  onClose: () => void;
}

type TabId = 'overview' | 'sensors' | 'simulation';

const LEVEL_STYLE: Record<string, { color: string }> = {
  critical: { color: 'var(--danger)' },
  high: { color: 'var(--warn)' },
  moderate: { color: 'var(--ink-2)' },
  low: { color: 'var(--accent)' },
};

const ANOMALY_ORDER: ClimateAnomalyType[] = ['normal', 'disturbed', 'severe', 'rapid', 'psycho'];

/** Off-screen resting offset (px) for the sheet: wider than its 440px max plus margin. */
const OFFSCREEN = 520;
const SHEET_WIDTH = 440;

function hazardIcon(name: string) {
  const cls = 'w-4 h-4';
  switch (name) {
    case 'Flame':
      return <Flame className={cls} />;
    case 'Waves':
      return <Waves className={cls} />;
    case 'Mountain':
      return <Mountain className={cls} />;
    case 'Droplets':
      return <Droplets className={cls} />;
    default:
      return <Sun className={cls} />;
  }
}

const SectionTitle: React.FC<{ title: string; aside?: React.ReactNode }> = ({ title, aside }) => (
  <div className="flex items-baseline justify-between gap-3 mb-2">
    <h3 className="t-headline label-1">{title}</h3>
    {aside && <span className="t-caption label-3 tabular">{aside}</span>}
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-baseline justify-between gap-4 py-2.5">
    <dt className="t-callout label-2">{label}</dt>
    <dd className="t-callout label-1 tabular text-right">{children}</dd>
  </div>
);

export const ClimateDashboard: React.FC<ClimateDashboardProps> = ({
  city,
  country,
  simulationStep,
  activeAnomaly,
  onSimulationChange,
  onAnomalyChange,
  onClose,
}) => {
  const {
    language,
    t,
    getCityName,
    getCountryName,
    getHazardName,
    getSimulationStepLabel,
    getAqiStatusLabel,
    getHazardLevelLabel,
    getCityClassicalProfileTexts,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [tabDirection, setTabDirection] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'thermal' | 'flood' | 'air' | 'green'>('thermal');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: t('tabOverview') },
    { id: 'sensors', label: t('tabSensors') },
    { id: 'simulation', label: t('tabSimulator') },
  ];

  const layers = [
    { id: 'thermal' as const, label: t('layerThermal') },
    { id: 'flood' as const, label: t('layerFlood') },
    { id: 'air' as const, label: t('layerAir') },
    { id: 'green' as const, label: t('layerGreen') },
  ];

  // ---- Sheet drag (direct manipulation + velocity handoff + momentum projection) ----
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  const sheetOpacity = useTransform(x, [0, SHEET_WIDTH], [1, 0.7]);

  const handleDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const projected = x.get() + project(info.velocity.x);
    if (projected > SHEET_WIDTH * 0.5) {
      animate(x, OFFSCREEN, {
        ...springSheet,
        velocity: info.velocity.x,
        onComplete: onClose,
      });
    } else {
      animate(x, 0, { ...springSheet, velocity: info.velocity.x });
    }
  };

  const selectTab = (id: TabId) => {
    if (id === activeTab) return;
    const from = tabs.findIndex((tabItem) => tabItem.id === activeTab);
    const to = tabs.findIndex((tabItem) => tabItem.id === id);
    setTabDirection(to > from ? 1 : -1);
    setActiveTab(id);
    playUiSound('select');
  };

  const { isWeatherLoading, lastUpdated, refreshWeather, getCityTelemetry } = useWeather();
  const currentTelemetry = getCityTelemetry(city) || city.telemetry;

  const simulatedTemp = (currentTelemetry.temperature + simulationStep.tempDelta).toFixed(1);
  const simulatedFeelsLike = (currentTelemetry.feelsLike + simulationStep.tempDelta * 1.2).toFixed(1);
  const aqiColor =
    currentTelemetry.aqi <= 50 ? 'var(--accent)' : currentTelemetry.aqi <= 100 ? 'var(--warn)' : 'var(--danger)';
  const anomaly = CLIMATE_ANOMALY_CONFIG[activeAnomaly];

  const localizedCityName = getCityName(city);
  const localizedCountryName = getCountryName(country);
  const localizedProfile = getCityClassicalProfileTexts(city);

  const getAnomalyLabel = (mode: ClimateAnomalyType) => {
    switch (mode) {
      case 'normal':
        return t('anomalyNormal');
      case 'disturbed':
        return t('anomalyDisturbed');
      case 'severe':
        return t('anomalySevere');
      case 'rapid':
        return t('anomalyRapid');
      case 'psycho':
        return t('anomalyPsycho');
    }
  };

  return (
    <motion.aside
      aria-label={`${localizedCityName} ${t('cityPanel')}`}
      initial={{ x: OFFSCREEN }}
      animate={{ x: 0 }}
      exit={{ x: OFFSCREEN }}
      transition={springDefault}
      style={{ x, opacity: sheetOpacity }}
      drag="x"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.06, right: 1 }}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      className="surface-sheet absolute top-[3.75rem] right-3 bottom-3 w-[calc(100%-1.5rem)] max-w-[440px] z-30 flex flex-col rounded-[var(--r-l)] overflow-hidden"
    >
      {/* Başlık alanından tutup sürüklenebilir */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="relative shrink-0 cursor-grab active:cursor-grabbing touch-none"
      >
        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="t-display label-1 truncate">{localizedCityName}</h2>
            <p className="t-caption label-3 mt-1 truncate">
              {localizedCountryName} · {city.tagline}
            </p>
            {city.address && (
              <p className="t-footnote label-3 mt-0.5 opacity-80 truncate" title={city.address}>
                📍 {city.address}
              </p>
            )}
          </div>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="pressable btn btn-ghost btn-icon shrink-0 -mr-2 -mt-1"
            aria-label={t('close')}
            title={t('close')}
          >
            <ChevronRight className="w-[1.125rem] h-[1.125rem]" />
          </button>
        </div>

        <div
          role="tablist"
          aria-label={t('tabOverview')}
          onPointerDown={(e) => e.stopPropagation()}
          className="segmented mx-5 mb-3 flex"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(tab.id)}
                className={`pressable relative flex-1 h-8 rounded-[7px] t-caption flex items-center justify-center ${
                  isActive ? 'label-1 font-semibold' : 'label-2'
                }`}
              >
                {isActive && (
                  <motion.span layoutId="dashboard-tab" transition={springSnappy} className="segmented-thumb absolute inset-0" />
                )}
                <span className="relative">
                  {tab.label}
                  {tab.id === 'sensors' && <span className="label-3 tabular"> {city.sensors.length}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gövde: içerik yumuşak kenarların altından akar */}
      <div className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-edge">
        <AnimatePresence mode="popLayout" initial={false} custom={tabDirection}>
          <motion.div
            key={activeTab}
            custom={tabDirection}
            variants={{
              enter: (d: number) => ({ x: 14 * d, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: -14 * d, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springDefault}
            className="px-5 pt-3 pb-6 space-y-8"
          >
            {activeTab === 'overview' && (
              <>
                {/* Sıcaklık */}
                <section aria-label="Overview">
                  <div className="flex items-end gap-3">
                    <motion.span
                      key={simulatedTemp}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="t-numeral label-1"
                    >
                      {simulatedTemp}°
                    </motion.span>
                    <div className="pb-1 t-caption label-3 tabular leading-snug">
                      <div>
                        {t('feelsLike')} {simulatedFeelsLike}°
                      </div>
                      {simulationStep.tempDelta > 0 && (
                        <div style={{ color: 'var(--danger)' }}>
                          +{simulationStep.tempDelta}° · {getSimulationStepLabel(simulationStep).label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canlı Meteoroloji Rozeti (Open-Meteo API) */}
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="t-caption font-semibold text-[12px]">
                      {currentTelemetry.conditionText || (language === 'tr' ? 'Canlı Hava Durumu' : 'Live Weather')}
                    </span>
                    <span className="t-footnote text-[11px] opacity-75">· Open-Meteo API</span>
                    {(currentTelemetry.lastUpdated || lastUpdated) && (
                      <span className="t-footnote text-[11px] opacity-75 font-mono">
                        ({currentTelemetry.lastUpdated || lastUpdated})
                      </span>
                    )}
                    <button
                      onClick={() => refreshWeather()}
                      disabled={isWeatherLoading}
                      title={language === 'tr' ? 'Hava durumunu şimdi güncelle' : 'Refresh live weather now'}
                      className="p-1 hover:bg-emerald-500/20 rounded-full transition-all ml-auto pressable"
                      aria-label="Yenile"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* 3D Dijital İkiz Modeli (<model-viewer>) */}
                  <ModelViewer3D
                    src={`./models/${city.id}.glb`}
                    alt={`${localizedCityName} 3D`}
                    title={`${localizedCityName} ${t('digitalTwin3D')}`}
                    height={220}
                    className="my-3"
                  />

                  <dl className="divide-line mt-4">
                    <Row label={t('airQuality')}>
                      {currentTelemetry.aqi}{' '}
                      <span style={{ color: aqiColor }} className="font-semibold">
                        {getAqiStatusLabel(currentTelemetry.aqiStatus)}
                      </span>
                    </Row>
                    <Row label="PM2.5">{currentTelemetry.pm25} µg/m³</Row>
                    <Row label={t('relativeHumidity')}>%{currentTelemetry.humidity}</Row>
                    <Row label={t('rainfall24h')}>{currentTelemetry.rainfall24h} mm</Row>
                    <Row label={t('wind')}>
                      {currentTelemetry.windSpeed} km/h <span className="label-3 font-normal">{currentTelemetry.windDirection}</span>
                    </Row>
                  </dl>
                </section>

                {/* Bölgesel iklim rejimi */}
                <section>
                  <SectionTitle title={t('regionalRegime')} aside={localizedProfile.climateZone} />
                  <p className="t-body label-2">
                    <span className="label-1 font-medium">{t('historicalBaseline')}: </span>
                    {localizedProfile.typicalPattern}
                  </p>

                  <div role="radiogroup" aria-label={t('anomalyType')} className="mt-3 -mx-2">
                    {ANOMALY_ORDER.map((mode) => {
                      const item = CLIMATE_ANOMALY_CONFIG[mode];
                      const isSelected = activeAnomaly === mode;
                      const modeLabel = getAnomalyLabel(mode);
                      return (
                        <button
                          key={mode}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => {
                            onAnomalyChange(mode);
                            playUiSound('select');
                          }}
                          title={`${modeLabel}: ${item.ruleExplanation}`}
                          className={`pressable relative w-full h-9 px-2 rounded-[var(--r-s)] flex items-center gap-2.5 text-left t-callout row-hover ${
                            isSelected ? 'label-1 font-semibold' : 'label-2'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="anomaly-row"
                              transition={springSnappy}
                              className="absolute inset-0 rounded-[var(--r-s)]"
                              style={{ background: 'var(--surface-2)', boxShadow: 'inset 0 0 0 1px var(--line)' }}
                            />
                          )}
                          <span className="relative status-dot" style={{ color: item.color }} />
                          <span className="relative flex-1">{modeLabel}</span>
                          {isSelected && <Check className="relative w-4 h-4" style={{ color: 'var(--accent)' }} strokeWidth={2.5} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <span className="status-dot" style={{ color: anomaly.color }} />
                      <h4 className="t-callout label-1 font-semibold">
                        {city.classicalProfile.anomalyDetails[activeAnomaly].title}
                      </h4>
                    </div>
                    <p className="t-body label-2 mt-1">
                      {city.classicalProfile.anomalyDetails[activeAnomaly].description}
                    </p>
                    <p className="t-caption label-3 mt-1.5">
                      <span className="label-2 font-medium">{t('ecologicalImpact')}: </span>
                      {city.classicalProfile.anomalyDetails[activeAnomaly].impact}
                    </p>
                  </div>
                </section>

                {/* Riskler */}
                <section>
                  <SectionTitle title={t('climateHazards')} aside={`${city.hazards.length} ${t('indicatorsCount')}`} />
                  <ul className="divide-line">
                    {city.hazards.map((hazard) => {
                      const localizedHazard = getHazardName(hazard);
                      const pct = Math.min(100, Math.round(hazard.percentage * simulationStep.hazardMultiplier));
                      const lvlColor = LEVEL_STYLE[hazard.level]?.color ?? 'var(--accent)';
                      const lvlLabel = getHazardLevelLabel(hazard.level);
                      return (
                        <li key={hazard.id} className="py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="label-3 shrink-0">{hazardIcon(hazard.icon)}</span>
                            <span className="t-callout label-1 font-semibold flex-1 min-w-0 truncate">{localizedHazard.name}</span>
                            <span className="t-callout label-1 tabular">%{pct}</span>
                          </div>

                          <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: pct / 100 }}
                              transition={springDefault}
                              className="h-full w-full rounded-full origin-left"
                              style={{ background: lvlColor }}
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-1.5 t-caption">
                            <span className="font-semibold" style={{ color: lvlColor }}>
                              {lvlLabel}
                            </span>
                            <span className="label-3 flex items-center gap-1">
                              {hazard.trend === 'up' ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : hazard.trend === 'down' ? (
                                <TrendingDown className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                              {hazard.trend === 'up' ? t('trendUp') : hazard.trend === 'down' ? t('trendDown') : t('trendStable')}
                            </span>
                          </div>
                          <p className="t-caption label-3 mt-1 line-clamp-2">{localizedHazard.description}</p>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Katmanlar */}
                <section>
                  <SectionTitle title={t('visualizationLayer')} />
                  <div role="radiogroup" aria-label={t('visualizationLayer')} className="segmented grid grid-cols-2 gap-0.5">
                    {layers.map((layer) => {
                      const isCurrent = activeLayer === layer.id;
                      return (
                        <button
                          key={layer.id}
                          role="radio"
                          aria-checked={isCurrent}
                          onClick={() => {
                            if (isCurrent) return;
                            setActiveLayer(layer.id);
                            playUiSound('select');
                          }}
                          className={`pressable relative h-8 rounded-[7px] t-caption flex items-center justify-center ${
                            isCurrent ? 'label-1 font-semibold' : 'label-2'
                          }`}
                        >
                          {isCurrent && (
                            <motion.span layoutId="dashboard-layer" transition={springSnappy} className="segmented-thumb absolute inset-0" />
                          )}
                          <span className="relative">{layer.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <ClimaAssistant city={city} simulationStep={simulationStep} activeAnomaly={activeAnomaly} />
              </>
            )}

            {activeTab === 'sensors' && (
              <section>
                <SectionTitle title={t('activeIoTNodes')} aside={`${city.sensors.length} ${t('onlineCount')}`} />
                <ul className="divide-line">
                  {city.sensors.map((sensor) => {
                    const color =
                      sensor.status === 'alert'
                        ? 'var(--danger)'
                        : sensor.status === 'warning'
                        ? 'var(--warn)'
                        : 'var(--accent)';
                    return (
                      <li key={sensor.id} className="py-3 flex items-start gap-3">
                        <span className="status-dot mt-[0.4375rem]" style={{ color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="t-callout label-1 font-semibold truncate">{sensor.name}</span>
                            <span className="t-footnote label-3 font-mono">{sensor.id}</span>
                          </div>
                          <div className="t-caption label-2 mt-0.5 tabular">{sensor.reading}</div>
                          <div className="t-caption label-3 mt-0.5 flex items-center justify-between">
                            <span>{sensor.type}</span>
                            <span className="tabular">
                              {t('battery')} %{sensor.battery}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {activeTab === 'simulation' && (
              <section className="space-y-4">
                <div>
                  <h3 className="t-title label-1">{t('timeSimulator')}</h3>
                  <p className="t-body label-2 mt-1">
                    {t('timeSimulatorDesc')}
                  </p>
                </div>

                <div role="radiogroup" aria-label={t('simulationStep')} className="-mx-2">
                  {SIMULATION_STEPS.map((step) => {
                    const isSelected = simulationStep.label === step.label;
                    const localizedStep = getSimulationStepLabel(step);
                    return (
                      <button
                        key={step.label}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          if (isSelected) return;
                          onSimulationChange(step);
                          playUiSound('select');
                        }}
                        className="pressable relative w-full px-3 py-3 rounded-[var(--r-m)] text-left row-hover"
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="sim-step"
                            transition={springSnappy}
                            className="absolute inset-0 rounded-[var(--r-m)]"
                            style={{ background: 'var(--surface-2)', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }}
                          />
                        )}
                        <div className="relative flex items-center justify-between gap-2">
                          <span className="t-headline label-1">{localizedStep.label}</span>
                          <span
                            className="t-caption tabular font-semibold"
                            style={{ color: step.tempDelta > 0 ? 'var(--danger)' : 'var(--ink-3)' }}
                          >
                            {step.tempDelta > 0 ? `+${step.tempDelta}°C` : 'Ref'}
                          </span>
                        </div>
                        <p className="relative t-caption label-2 mt-0.5">{localizedStep.sublabel}</p>
                        <p className="relative t-caption label-3 mt-1.5">{localizedStep.climaNote}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 hairline-t px-5 py-2.5 t-footnote label-3">Erasmus+ · ClimaMap</div>
    </motion.aside>
  );
};
