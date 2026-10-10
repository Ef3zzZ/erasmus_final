import React from 'react';
import { motion } from 'framer-motion';
import type { CountryData, AppStage } from '../types';
import { PARTNER_COUNTRIES } from '../data/climateData';
import { springDefault, springSnappy } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';
import { useWeather } from '../context/WeatherContext';

interface QuickCountryDockProps {
  stage: AppStage;
  selectedCountry: CountryData | null;
  onSelectCountry: (country: CountryData) => void;
  onResetGlobal: () => void;
}

const Thumb: React.FC = () => (
  // Tek bir gösterge seçenekler arasında yay gibi kayar; her zaman bulunduğu yerden başlar
  <motion.span layoutId="dock-thumb" transition={springSnappy} className="segmented-thumb absolute inset-0" />
);

export const QuickCountryDock: React.FC<QuickCountryDockProps> = ({
  stage,
  selectedCountry,
  onSelectCountry,
  onResetGlobal,
}) => {
  const { t, getCountryName } = useLanguage();
  const { countriesWithLiveWeather } = useWeather();
  const countries = countriesWithLiveWeather.length > 0 ? countriesWithLiveWeather : PARTNER_COUNTRIES;
  const activeId = stage === 'global' ? 'global' : selectedCountry?.id;
  const tab = 'pressable relative h-9 px-3.5 rounded-[7px] t-callout flex items-center gap-2';

  return (
    // Alt kenardan girer, aynı yoldan çıkar
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 16, opacity: 0 }}
      transition={springDefault}
      className="absolute bottom-5 left-0 right-0 mx-auto w-fit z-20"
    >
      <div role="tablist" aria-label={t('partnerCountries')} className="surface rounded-[var(--r-m)] p-1 flex items-center gap-0.5">
        <button
          role="tab"
          aria-selected={activeId === 'global'}
          onClick={() => stage !== 'global' && onResetGlobal()}
          className={`${tab} ${activeId === 'global' ? 'label-1 font-semibold' : 'label-2'}`}
        >
          {activeId === 'global' && <Thumb />}
          <span className="relative">{t('allMap')}</span>
        </button>

        <div className="h-4 w-px mx-1" style={{ background: 'var(--line-strong)' }} aria-hidden />

        {countries.map((country) => {
          const isSelected = activeId === country.id;
          return (
            <button
              key={country.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => !isSelected && onSelectCountry(country)}
              className={`${tab} ${isSelected ? 'label-1 font-semibold' : 'label-2'}`}
            >
              {isSelected && <Thumb />}
              <span className="relative">{getCountryName(country)}</span>
              <span className="relative t-footnote label-3 tabular hidden lg:inline">{country.cities.length}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
