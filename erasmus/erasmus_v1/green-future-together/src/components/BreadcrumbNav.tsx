import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppStage, CountryData, CityData } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { springSnappy } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbNavProps {
  stage: AppStage;
  selectedCountry: CountryData | null;
  selectedCity: CityData | null;
  onResetGlobal: () => void;
  onReturnToCountry: () => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  stage,
  selectedCountry,
  selectedCity,
  onResetGlobal,
  onReturnToCountry,
}) => {
  const { t, language, getCountryName, getCityName } = useLanguage();

  const countryName = selectedCountry ? getCountryName(selectedCountry) : '';
  const cityName = selectedCity ? getCityName(selectedCity) : '';

  const backLabel =
    language === 'tr' ? 'Geri' : language === 'it' ? 'Indietro' : language === 'es' ? 'Atrás' : language === 'ro' ? 'Înapoi' : 'Back';

  const hint =
    stage === 'global'
      ? language === 'tr'
        ? 'Ülke düzeyine inmek için bir ortak ülke seçin.'
        : language === 'it'
        ? 'Seleziona un paese partner per ingrandire.'
        : language === 'es'
        ? 'Selecciona un país socio para acercar.'
        : language === 'ro'
        ? 'Selectează o țară parteneră pentru mărire.'
        : 'Select a partner country to zoom in.'
      : stage === 'country' && selectedCountry
      ? language === 'tr'
        ? `${countryName} içinde bir kente dokunarak dijital ikizi açın.`
        : language === 'it'
        ? `Tocca una città in ${countryName} per aprire il gemello digitale.`
        : language === 'es'
        ? `Toca una ciudad en ${countryName} para abrir su gemelo digital.`
        : language === 'ro'
        ? `Apasă pe un oraș din ${countryName} pentru a deschide gemenele digital.`
        : `Click a city in ${countryName} to open its digital twin.`
      : selectedCity
      ? language === 'tr'
        ? `${cityName} odakta. Çıkmak için Esc tuşuna basın.`
        : language === 'it'
        ? `${cityName} in primo piano. Premi Esc per uscire.`
        : language === 'es'
        ? `${cityName} en foco. Pulsa Esc para salir.`
        : language === 'ro'
        ? `${cityName} în focalizare. Apasă Esc pentru ieșire.`
        : `${cityName} in focus. Press Esc to exit.`
      : '';

  const crumb = 'pressable h-7 px-2 rounded-[var(--r-xs)] t-callout flex items-center row-hover';

  return (
    // Yön bulma: neredeyim, nereye gidebilirim, nasıl çıkarım
    <nav
      aria-label="Konum"
      className="absolute top-[3.75rem] left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-auto"
    >
      <div className="surface-chip rounded-[var(--r-s)] flex items-center p-0.5">
        <AnimatePresence initial={false} mode="popLayout">
          {stage !== 'global' && (
            <motion.button
              key="back"
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={springSnappy}
              onClick={() => (stage === 'city' ? onReturnToCountry() : onResetGlobal())}
              className={`${crumb} pl-1 gap-0.5 font-semibold`}
              style={{ color: 'var(--accent)' }}
              aria-label={stage === 'city' ? (language === 'tr' ? 'Ülkeye dön' : 'Back to country') : (language === 'tr' ? 'Dünyaya dön' : 'Back to global')}
            >
              <ChevronLeft className="w-4 h-4" />
              {backLabel}
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={() => stage !== 'global' && onResetGlobal()}
          className={`${crumb} ${stage === 'global' ? 'label-1 font-semibold' : 'label-2'}`}
          aria-current={stage === 'global' ? 'page' : undefined}
        >
          {t('world')}
        </button>

        {selectedCountry && (
          <>
            <ChevronRight className="w-3.5 h-3.5 label-3" aria-hidden />
            <button
              onClick={() => stage === 'city' && onReturnToCountry()}
              className={`${crumb} ${stage === 'country' ? 'label-1 font-semibold' : 'label-2'}`}
              aria-current={stage === 'country' ? 'page' : undefined}
            >
              {countryName}
            </button>
          </>
        )}
        {selectedCity && (
          <>
            <ChevronRight className="w-3.5 h-3.5 label-3" aria-hidden />
            <span className="h-7 px-2 flex items-center t-callout font-semibold label-1" aria-current="page">
              {cityName}
            </span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={hint}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="surface-chip rounded-[var(--r-xs)] px-2.5 py-1.5 t-caption label-2 max-w-[17rem]"
        >
          {hint}
        </motion.p>
      </AnimatePresence>
    </nav>
  );
};
