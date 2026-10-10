import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppStage, CountryData, CityData, SimulationStep, ClimateAnomalyType, CountryRegion } from './types';
import { SIMULATION_STEPS } from './data/climateData';
import { MapContainer } from './components/MapContainer';
import { Header } from './components/Header';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { CitySpotlightOverlay } from './components/CitySpotlightOverlay';
import { ClimateDashboard } from './components/ClimateDashboard';
import { QuickCountryDock } from './components/QuickCountryDock';
import { CountryScanBar } from './components/CountryScanBar';
import { ErasmusInfoModal } from './components/ErasmusInfoModal';
import { setMuteState, playUiSound } from './utils/audio';
import { springSnappy } from './utils/motion';
import { SlidersHorizontal } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useWeather } from './context/WeatherContext';
import { IntroOverlay } from './components/IntroOverlay';

interface TourStepConfig {
  id: string;
  name: string;
  type: 'global' | 'country' | 'city';
  countryId?: string;
  cityId?: string;
  nextRequiresPermission: boolean;
  autoDelayMs?: number;
}

const TOUR_STEPS: TourStepConfig[] = [
  // 0. Başta dünya konumuna dönecek ("izinsiz" -> Türkiye'ye geçecek)
  { id: 'global-start', name: 'Dünya', type: 'global', nextRequiresPermission: false, autoDelayMs: 2500 },
  // 1. Ardından Türkiye'ye geçecek ("izinsiz" -> Trabzon'a geçecek)
  { id: 'turkey', name: 'Türkiye', type: 'country', countryId: 'turkey', nextRequiresPermission: false, autoDelayMs: 3200 },
  // 2. Ardından Trabzon'a geçecek. Trabzon'da buton 2'ye bölünür: Devam Et | X. ("izin gerekli" -> İstanbul'a geçiş için)
  { id: 'trabzon', name: 'Trabzon', type: 'city', countryId: 'turkey', cityId: 'trabzon', nextRequiresPermission: true },
  // 3. Ardından İstanbul'a geçecek ("izin gerekli" -> Romanya'ya geçiş için)
  { id: 'istanbul', name: 'İstanbul', type: 'city', countryId: 'turkey', cityId: 'istanbul', nextRequiresPermission: true },
  // 4. Ardından Romanya ülkesine geçecek ("izinsiz" -> Bükreş'e geçecek)
  { id: 'romania', name: 'Romanya', type: 'country', countryId: 'romania', nextRequiresPermission: false, autoDelayMs: 3200 },
  // 5. Ardından Bükreş'e geçecek ("izinli" -> İtalya'ya geçiş için)
  { id: 'bucharest', name: 'Bükreş', type: 'city', countryId: 'romania', cityId: 'bucharest', nextRequiresPermission: true },
  // 6. Ardından İtalya'ya geçecek ("izinsiz" -> Roma'ya geçecek)
  { id: 'italy', name: 'İtalya', type: 'country', countryId: 'italy', nextRequiresPermission: false, autoDelayMs: 3200 },
  // 7. Ardından Roma'ya geçecek ("izinli" -> İspanya'ya geçiş için)
  { id: 'rome', name: 'Roma', type: 'city', countryId: 'italy', cityId: 'rome', nextRequiresPermission: true },
  // 8. Ardından İspanya'ya geçecek ("izinsiz" -> Madrid'e geçecek)
  { id: 'spain', name: 'İspanya', type: 'country', countryId: 'spain', nextRequiresPermission: false, autoDelayMs: 3200 },
  // 9. Ardından Madrid'e geçecek ("izinli" -> Dünyaya dönmek için)
  { id: 'madrid', name: 'Madrid', type: 'city', countryId: 'spain', cityId: 'madrid', nextRequiresPermission: true },
  // 10. Başlangıç konumu yani Dünyaya geri dönecek (Tur Tamamlandı)
  { id: 'global-end', name: 'Dünya', type: 'global', nextRequiresPermission: false },
];

export const App: React.FC = () => {
  const { t, getCityName } = useLanguage();
  const { countriesWithLiveWeather, getCityTelemetry } = useWeather();
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [stage, setStage] = useState<AppStage>('global');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [activeAnomaly, setActiveAnomaly] = useState<ClimateAnomalyType>('normal');
  const [isCountryScanned, setIsCountryScanned] = useState(false);
  const [overrideAllNormal, setOverrideAllNormal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<CountryRegion | null>(null);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>(SIMULATION_STEPS[0]);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('clima-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState<number>(-1);
  const [isWaitingForNext, setIsWaitingForNext] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [modalOrigin, setModalOrigin] = useState<{ x: number; y: number } | null>(null);

  const tourTimersRef = useRef<number[]>([]);

  // Theme Sync with HTML document attribute & persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clima-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Reset to Global World View
  const handleResetGlobal = useCallback(() => {
    setStage('global');
    setSelectedCountry(null);
    setSelectedCity(null);
    setActiveAnomaly('normal');
    setIsCountryScanned(false);
    setOverrideAllNormal(false);
    setSelectedRegion(null);
    setIsDashboardOpen(false);
    playUiSound('fly');
  }, []);

  // Stop tour helper (WWDC principle: interruptibility - cancel immediately on user interaction)
  const handleStopTour = useCallback(
    (resetToGlobal = true) => {
      tourTimersRef.current.forEach((t) => window.clearTimeout(t));
      tourTimersRef.current = [];
      setIsTourRunning(false);
      setTourStepIndex(-1);
      setIsWaitingForNext(false);
      if (resetToGlobal) {
        handleResetGlobal();
      }
    },
    [handleResetGlobal]
  );

  // Audio Toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      setMuteState(next);
      return next;
    });
  }, []);

  // Country Selection
  const handleSelectCountry = useCallback((country: CountryData) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    setIsCountryScanned(false);
    setOverrideAllNormal(false);
    setSelectedRegion(null);
    setStage('country');
    setIsDashboardOpen(false);
    playUiSound('fly');
  }, []);

  // City Selection (Focus & Spotlight Activation)
  const handleSelectCity = useCallback(
    (city: CityData) => {
      const liveTelemetry = getCityTelemetry(city);
      const cityWithLive = { ...city, telemetry: liveTelemetry };
      setSelectedCity(cityWithLive);
      setActiveAnomaly(city.classicalProfile?.activeAnomaly ?? 'normal');
      setSelectedRegion(null);
      setStage('city');
      setIsDashboardOpen(true);
      playUiSound('fly');

      // If city hazard is critical, play alert sound after zoom transition
      const alertTimer = window.setTimeout(() => {
        if (city.hazards.some((h) => h.level === 'critical')) {
          playUiSound('alert');
        }
      }, 1800);
      tourTimersRef.current.push(alertTimer);
    },
    [getCityTelemetry]
  );

  // Canlı hava durumu güncellendiğinde açık olan şehir ve ülkenin telemetri verisini taze tut
  useEffect(() => {
    if (selectedCountry) {
      const freshCountry = countriesWithLiveWeather.find((c) => c.id === selectedCountry.id);
      if (freshCountry) {
        setSelectedCountry(freshCountry);
      }
    }
    if (selectedCity) {
      const freshTelemetry = getCityTelemetry(selectedCity);
      setSelectedCity((prev) => (prev ? { ...prev, telemetry: freshTelemetry } : null));
    }
  }, [countriesWithLiveWeather, getCityTelemetry]);

  // Return to Country Level
  const handleReturnToCountry = useCallback(() => {
    if (selectedCountry) {
      setStage('country');
      setSelectedCity(null);
      setIsDashboardOpen(false);
      playUiSound('fly');
    } else {
      handleResetGlobal();
    }
  }, [selectedCountry, handleResetGlobal]);

  // Guided Automated Demo Tour Engine
  const executeTourStep = useCallback(
    (stepIdx: number) => {
      // Önceki zamanlayıcıları temizle
      tourTimersRef.current.forEach((t) => window.clearTimeout(t));
      tourTimersRef.current = [];

      if (stepIdx < 0 || stepIdx >= TOUR_STEPS.length) {
        handleStopTour(true);
        return;
      }

      const step = TOUR_STEPS[stepIdx];
      setTourStepIndex(stepIdx);

      // İlgili aşama navigasyonunu uygula
      if (step.type === 'global') {
        handleResetGlobal();
      } else if (step.type === 'country') {
        const country = countriesWithLiveWeather.find((c) => c.id === step.countryId);
        if (country) {
          handleSelectCountry(country);
        }
      } else if (step.type === 'city') {
        const country = countriesWithLiveWeather.find((c) => c.id === step.countryId);
        const city = country?.cities.find((c) => c.id === step.cityId);
        if (city) {
          handleSelectCity(city);
        }
      }

      // Son adım tamamlandığında tur biter
      const isLastStep = stepIdx === TOUR_STEPS.length - 1;
      if (isLastStep) {
        setIsTourRunning(false);
        setTourStepIndex(-1);
        setIsWaitingForNext(false);
        return;
      }

      // Sıradaki adıma geçiş için izin durumu ("izinsiz" / "izin gerekli")
      if (step.nextRequiresPermission) {
        // İzin gerekli: Kullanıcı "Devam Et" butonuna basana kadar beklenir
        setIsWaitingForNext(true);
      } else {
        // İzinsiz: Belirlenen süre sonunda otomatik olarak sıradaki adıma geçilir
        setIsWaitingForNext(false);
        const delay = step.autoDelayMs ?? 3200;
        const timer = window.setTimeout(() => {
          executeTourStep(stepIdx + 1);
        }, delay);
        tourTimersRef.current.push(timer);
      }
    },
    [handleStopTour, handleResetGlobal, countriesWithLiveWeather, handleSelectCountry, handleSelectCity]
  );

  // Kullanıcı "Devam Et" butonuna bastığında sıradaki adıma ilerle
  const handleNextTourStep = useCallback(() => {
    if (!isTourRunning || tourStepIndex < 0) return;
    executeTourStep(tourStepIndex + 1);
  }, [isTourRunning, tourStepIndex, executeTourStep]);

  // Demo Turunu Başlat
  const handleStartTour = useCallback(() => {
    tourTimersRef.current.forEach((t) => window.clearTimeout(t));
    tourTimersRef.current = [];
    setIsTourRunning(true);
    executeTourStep(0);
  }, [executeTourStep]);

  // Sıradaki adımın gösterim ismi
  const nextStepName = useMemo(() => {
    if (tourStepIndex < 0 || tourStepIndex >= TOUR_STEPS.length - 1) return '';
    const nextStep = TOUR_STEPS[tourStepIndex + 1];
    if (nextStep.type === 'global') return t('world');
    if (nextStep.type === 'city' && nextStep.cityId) {
      return getCityName({ id: nextStep.cityId, name: nextStep.name });
    }
    if (nextStep.type === 'country' && nextStep.countryId) {
      const country = countriesWithLiveWeather.find((c) => c.id === nextStep.countryId);
      return country?.name || nextStep.name;
    }
    return nextStep.name;
  }, [tourStepIndex, t, getCityName, countriesWithLiveWeather]);

  // Keyboard shortcut: Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTourRunning) {
          handleStopTour();
        } else if (isInfoModalOpen) {
          setIsInfoModalOpen(false);
        } else if (stage === 'city') {
          handleReturnToCountry();
        } else if (stage === 'country') {
          handleResetGlobal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourRunning, handleStopTour, isInfoModalOpen, stage, handleReturnToCountry, handleResetGlobal]);

  // Sayfanın her noktasında sağ tık bağlam menüsünü engelle
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    };
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[var(--canvas)] select-none"
      data-theme={theme}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 0. Cinematic Opening Intro Video */}
      <IntroOverlay
        isOpen={showIntro}
        onComplete={() => setShowIntro(false)}
      />

      {/* 1. Header Navigation Bar */}
      <Header
        isMuted={isMuted}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleMute={handleToggleMute}
        onStartTour={handleStartTour}
        onStopTour={() => handleStopTour(true)}
        onNextTourStep={handleNextTourStep}
        isTourRunning={isTourRunning}
        isTourSplit={isTourRunning && tourStepIndex >= 2}
        isWaitingForNext={isWaitingForNext}
        nextStepName={nextStepName}
        onOpenInfoModal={(origin) => {
          setModalOrigin(origin);
          setIsInfoModalOpen(true);
        }}
      />

      {/* 2. Interactive Breadcrumb Navigation in Top-Left */}
      <BreadcrumbNav
        stage={stage}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        onResetGlobal={() => {
          handleStopTour(false);
          handleResetGlobal();
        }}
        onReturnToCountry={() => {
          handleStopTour(false);
          handleReturnToCountry();
        }}
      />

      {/* 3. Core MapLibre Map Canvas */}
      <MapContainer
        stage={stage}
        theme={theme}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        activeAnomaly={activeAnomaly}
        isCountryScanned={isCountryScanned}
        overrideAllNormal={overrideAllNormal}
        onSelectCountry={(c) => {
          handleStopTour(false);
          handleSelectCountry(c);
        }}
        onSelectCity={(city) => {
          handleStopTour(false);
          handleSelectCity(city);
        }}
        onSelectRegion={setSelectedRegion}
      />

      {/* 4. Critical Feature: City Spotlight Overlay (Backdrop Blur outside City Boundary) */}
      <CitySpotlightOverlay
        isActive={stage === 'city'}
        city={selectedCity}
        activeAnomaly={activeAnomaly}
        theme={theme}
      />

      {/* 5. Climate Warning Dashboard & CLIMA Assistant (Apple-style Draggable Sheet) */}
      <AnimatePresence>
        {stage === 'city' && selectedCity && selectedCountry && isDashboardOpen && (
          <ClimateDashboard
            key={`dashboard-${selectedCity.id}`}
            city={selectedCity}
            country={selectedCountry}
            simulationStep={simulationStep}
            activeAnomaly={activeAnomaly}
            onSimulationChange={setSimulationStep}
            onAnomalyChange={setActiveAnomaly}
            onClose={() => setIsDashboardOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Re-open Dashboard button if closed while in city stage */}
      <AnimatePresence>
        {stage === 'city' && selectedCity && !isDashboardOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={springSnappy}
            onClick={() => {
              setIsDashboardOpen(true);
              playUiSound('select');
            }}
            className="pressable btn btn-secondary surface !h-9 absolute top-[3.75rem] right-3 z-20"
            title={t('showClimatePanel')}
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>
              {getCityName(selectedCity)} {t('cityPanel')}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 6. Country Regional Climate Radar & Scanner (Only when in Country stage) */}
      <AnimatePresence>
        {stage === 'country' && selectedCountry && (
          <CountryScanBar
            country={selectedCountry}
            isCountryScanned={isCountryScanned}
            overrideAllNormal={overrideAllNormal}
            selectedRegion={selectedRegion}
            onScanCountry={() => setIsCountryScanned(true)}
            onResetScan={() => {
              setIsCountryScanned(false);
              setSelectedRegion(null);
              setOverrideAllNormal(false);
            }}
            onToggleOverrideAllNormal={setOverrideAllNormal}
            onSelectRegion={setSelectedRegion}
          />
        )}
      </AnimatePresence>

      {/* 7. Quick Country Bottom Dock (Only when not in city focus mode to keep view clean) */}
      <AnimatePresence>
        {stage !== 'city' && (
          <QuickCountryDock
            stage={stage}
            selectedCountry={selectedCountry}
            onSelectCountry={(c) => {
              handleStopTour(false);
              handleSelectCountry(c);
            }}
            onResetGlobal={() => {
              handleStopTour(false);
              handleResetGlobal();
            }}
          />
        )}
      </AnimatePresence>

      {/* 7. Erasmus+ Consortium & Project Details Modal */}
      <ErasmusInfoModal
        isOpen={isInfoModalOpen}
        origin={modalOrigin}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};

export default App;
