import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CityData, ClimateAnomalyType } from '../types';
import { springDefault } from '../utils/motion';
import { CLIMATE_ANOMALY_CONFIG } from '../utils/climateAnomaly';
import { useLanguage } from '../context/LanguageContext';

interface CitySpotlightOverlayProps {
  isActive: boolean;
  city: CityData | null;
  activeAnomaly: ClimateAnomalyType;
  theme?: 'dark' | 'light';
}

// Maske iki durumda aynı kalır; yalnızca filtre şiddeti canlanır
const MASK = 'radial-gradient(ellipse 520px 420px at 42% 52%, transparent 35%, rgba(0,0,0,0.55) 70%, black 100%)';

export const CitySpotlightOverlay: React.FC<CitySpotlightOverlayProps> = ({
  isActive,
  city,
  activeAnomaly,
  theme = 'dark',
}) => {
  const { t, language, getCityName } = useLanguage();
  const anomalyConfig = CLIMATE_ANOMALY_CONFIG[activeAnomaly];
  const filter =
    theme === 'light'
      ? 'blur(6px) brightness(1.04) saturate(0.8)'
      : 'blur(6px) brightness(0.7) saturate(0.8)';

  const badgeText =
    activeAnomaly === 'normal'
      ? t('badgeNormal')
      : activeAnomaly === 'disturbed'
      ? t('badgeDisturbed')
      : activeAnomaly === 'severe'
      ? t('badgeSevere')
      : activeAnomaly === 'rapid'
      ? t('badgeRapid')
      : t('badgePsycho');

  const latLabel = language === 'tr' ? '° K' : '° N';
  const lngLabel = language === 'tr' ? '° D' : '° E';

  return (
    <AnimatePresence>
      {isActive && city && (
        <motion.div
          key="city-spotlight"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="absolute inset-0"
            style={{ backdropFilter: filter, WebkitBackdropFilter: filter, maskImage: MASK, WebkitMaskImage: MASK }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ ...springDefault, delay: 0.3 }}
            className="surface-chip absolute bottom-5 left-3 max-w-sm px-3.5 py-2.5 rounded-[var(--r-m)]"
          >
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 t-callout font-semibold label-1">
                <span className="status-dot" style={{ color: anomalyConfig.color }} />
                {getCityName(city)}
                <span className="font-normal label-2">{badgeText}</span>
              </span>
              <span className="t-footnote label-3 tabular">
                {city.coordinates[1].toFixed(2)}{latLabel}, {city.coordinates[0].toFixed(2)}{lngLabel}
              </span>
            </div>
            <div className="t-caption label-3 mt-1 truncate">
              {t('classicalBaseline')}: <span className="label-2">{city.classicalProfile.climateZone}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
