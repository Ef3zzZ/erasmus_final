import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountryData, CountryRegion } from '../types';
import { COUNTRY_REGIONS } from '../data/countryRegionsData';
import { CLIMATE_ANOMALY_CONFIG } from '../utils/climateAnomaly';
import { playUiSound } from '../utils/audio';
import { springDefault, springSnappy } from '../utils/motion';
import { RotateCcw, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CountryScanBarProps {
  country: CountryData;
  isCountryScanned: boolean;
  overrideAllNormal: boolean;
  selectedRegion: CountryRegion | null;
  onScanCountry: () => void;
  onResetScan: () => void;
  onToggleOverrideAllNormal: (value: boolean) => void;
  onSelectRegion: (region: CountryRegion | null) => void;
}

export const CountryScanBar: React.FC<CountryScanBarProps> = ({
  country,
  isCountryScanned,
  overrideAllNormal,
  selectedRegion,
  onScanCountry,
  onResetScan,
  onToggleOverrideAllNormal,
  onSelectRegion,
}) => {
  const { t, language, getCountryName, getRegionName, getRegionTexts } = useLanguage();
  const [isScanningActive, setIsScanningActive] = useState(false);
  const regions = COUNTRY_REGIONS[country.id] || [];
  const countryName = getCountryName(country);

  const legendItems = [
    { color: CLIMATE_ANOMALY_CONFIG.normal.color, label: t('badgeNormal') },
    { color: CLIMATE_ANOMALY_CONFIG.disturbed.color, label: t('badgeDisturbed') },
    { color: CLIMATE_ANOMALY_CONFIG.severe.color, label: t('badgeSevere') },
    { color: CLIMATE_ANOMALY_CONFIG.rapid.color, label: t('badgeRapid') },
    { color: CLIMATE_ANOMALY_CONFIG.psycho.color, label: t('badgePsycho') },
  ];

  const handleStartScan = () => {
    setIsScanningActive(true);
    playUiSound('select');
    window.setTimeout(() => {
      setIsScanningActive(false);
      onScanCountry();
      playUiSound('success');
    }, 1100);
  };

  const regionTone = selectedRegion
    ? overrideAllNormal
      ? CLIMATE_ANOMALY_CONFIG.normal.color
      : CLIMATE_ANOMALY_CONFIG[selectedRegion.anomalyType].color
    : 'transparent';

  const seg = 'pressable relative h-8 px-3 rounded-[7px] t-caption flex items-center gap-1.5';

  return (
    <>
      {/* Tarama sürerken ekranı bloklamayan sakin bir durum satırı */}
      <AnimatePresence>
        {isScanningActive && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springSnappy}
            role="status"
            className="surface pointer-events-none absolute top-[3.75rem] left-0 right-0 mx-auto w-fit z-40 px-4 py-2.5 rounded-[var(--r-m)]"
          >
            <div className="t-callout font-semibold label-1">
              {language === 'tr' ? `${countryName} bölgeleri taranıyor` : `Scanning ${countryName} regions`}
            </div>
            <div className="t-caption label-3">
              {language === 'tr'
                ? 'Klasik normaller ile güncel ölçümler karşılaştırılıyor…'
                : 'Comparing classical norms with live telemetry…'}
            </div>
            <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                className="h-full w-full origin-left rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kontrol çubuğu, alt dock'un hemen üstünde */}
      <div className="absolute bottom-[4.75rem] left-0 right-0 mx-auto w-fit z-20 px-3">
        <AnimatePresence mode="wait">
          {!isCountryScanned ? (
            <motion.div
              key="pre-scan"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={springDefault}
              className="surface rounded-[var(--r-m)] p-1.5 flex items-center gap-3 pl-3.5"
            >
              <span className="t-caption label-3 hidden sm:inline">{t('countryScanSubtitle')}</span>
              <button onClick={handleStartScan} disabled={isScanningActive} className="pressable btn btn-primary">
                {language === 'tr' ? `${countryName}'yi tara` : `Scan ${countryName}`}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="post-scan"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 14, opacity: 0 }}
              transition={springDefault}
              className="surface rounded-[var(--r-m)] p-1.5 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="px-2.5 t-callout label-1 whitespace-nowrap">
                {countryName}
                <span className="label-3 font-normal tabular">
                  {' '}
                  · {regions.length} {t('scannedRegions')}
                </span>
              </div>

              <div className="segmented flex" role="radiogroup" aria-label="Gösterim modu">
                <button
                  role="radio"
                  aria-checked={!overrideAllNormal}
                  onClick={() => {
                    onToggleOverrideAllNormal(false);
                    playUiSound('select');
                  }}
                  className={`${seg} ${!overrideAllNormal ? 'label-1 font-semibold' : 'label-3'}`}
                  title={t('showAnomaly')}
                >
                  {!overrideAllNormal && (
                    <motion.span layoutId="scan-thumb" transition={springSnappy} className="segmented-thumb absolute inset-0" />
                  )}
                  <span className="relative">{t('showAnomaly')}</span>
                </button>
                <button
                  role="radio"
                  aria-checked={overrideAllNormal}
                  onClick={() => {
                    onToggleOverrideAllNormal(true);
                    playUiSound('select');
                  }}
                  className={`${seg} ${overrideAllNormal ? 'label-1 font-semibold' : 'label-3'}`}
                  title={t('naturalReference')}
                >
                  {overrideAllNormal && (
                    <motion.span layoutId="scan-thumb" transition={springSnappy} className="segmented-thumb absolute inset-0" />
                  )}
                  <span className="relative">{t('naturalReference')}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  playUiSound('select');
                  onResetScan();
                }}
                className="pressable btn btn-ghost h-8"
                title={t('closeScan')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {language === 'tr' ? 'Sıfırla' : 'Reset'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Seçili bölge kartı */}
      <AnimatePresence>
        {isCountryScanned && selectedRegion && (() => {
          const regionTexts = getRegionTexts(selectedRegion);
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={springSnappy}
              className="surface absolute top-[9.5rem] left-3 z-20 w-[min(21rem,calc(100%-1.5rem))] p-4 rounded-[var(--r-m)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="status-dot" style={{ color: regionTone }} />
                  <h3 className="t-title label-1 truncate">{getRegionName(selectedRegion)}</h3>
                </div>
                <button
                  onClick={() => onSelectRegion(null)}
                  className="pressable btn btn-ghost btn-icon !w-7 !h-7 -mr-1.5 -mt-1"
                  aria-label={t('close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="t-caption label-2 mt-1">
                <span style={{ color: regionTone, fontWeight: 600 }}>
                  {overrideAllNormal
                    ? t('badgeNormal')
                    : selectedRegion.anomalyType === 'normal'
                    ? t('badgeNormal')
                    : selectedRegion.anomalyType === 'disturbed'
                    ? t('badgeDisturbed')
                    : selectedRegion.anomalyType === 'severe'
                    ? t('badgeSevere')
                    : selectedRegion.anomalyType === 'rapid'
                    ? t('badgeRapid')
                    : t('badgePsycho')}
                </span>
                <span className="label-3 tabular"> · {selectedRegion.temperatureAvg}°C</span>
              </p>

              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="t-caption label-3">{t('classicalBaseline')}</dt>
                  <dd className="t-body label-1 mt-0.5">{regionTexts.classicalClimate}</dd>
                </div>
                <div>
                  <dt className="t-caption label-3">{language === 'tr' ? 'Mevcut durum' : 'Current status'}</dt>
                  <dd className="t-body label-1 mt-0.5">
                    {overrideAllNormal
                      ? language === 'tr'
                        ? 'Bölge şu anda dengeli ve klasik normallerde işliyor.'
                        : 'Region is currently balanced and following classical baselines.'
                      : regionTexts.currentStatus}
                  </dd>
                </div>
              </dl>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Renk anahtarı */}
      <AnimatePresence>
        {isCountryScanned && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            aria-label="Renk anahtarı"
            className="surface-chip hidden lg:block absolute top-[3.75rem] right-3 z-20 px-3 py-2.5 rounded-[var(--r-m)] space-y-1.5"
          >
            {legendItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2 t-caption label-2">
                <span className="status-dot" style={{ color: item.color, width: '0.4375rem', height: '0.4375rem' }} />
                {item.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};
