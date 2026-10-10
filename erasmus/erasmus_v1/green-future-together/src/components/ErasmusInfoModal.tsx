import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PARTNER_COUNTRIES } from '../data/climateData';
import { springModal } from '../utils/motion';
import { EuMark } from './EuMark';
import { useLanguage } from '../context/LanguageContext';

interface ErasmusInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Screen point of the trigger (kept for api compatibility) */
  origin?: { x: number; y: number } | null;
}

export const ErasmusInfoModal: React.FC<ErasmusInfoModalProps> = ({ isOpen, onClose }) => {
  const { t, getCountryName } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const pillars = [
    {
      title: t('pillar1Title'),
      text: t('pillar1Text'),
    },
    {
      title: t('pillar2Title'),
      text: t('pillar2Text'),
    },
    {
      title: t('pillar3Title'),
      text: t('pillar3Text'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="erasmus-modal" className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div
            key="scrim"
            className="absolute inset-0"
            style={{ background: 'var(--scrim)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={onClose}
          />

          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="erasmus-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={springModal}
            className="surface-sheet relative w-full max-w-[40rem] max-h-[85vh] flex flex-col rounded-[var(--r-l)] overflow-hidden"
          >
            <div className="shrink-0 px-7 pt-6 pb-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src="./climamap_logo.png"
                  alt="ClimaMap Logo"
                  className="w-11 h-11 rounded-xl object-contain shadow-sm mt-0.5 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 id="erasmus-modal-title" className="t-display label-1">
                      ClimaMap
                    </h2>
                    <EuMark size={20} className="shrink-0" />
                  </div>
                  <p className="t-caption label-3 mt-1">
                    {t('projectPeriod')}
                  </p>
                </div>
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                className="pressable btn btn-ghost btn-icon shrink-0 -mr-2 -mt-1"
                aria-label={t('close')}
              >
                <X className="w-[1.0625rem] h-[1.0625rem]" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scroll-edge px-7 pb-4 space-y-8">
              <p className="t-body label-2" style={{ maxWidth: '62ch' }}>
                {t('erasmusModalDesc')}
              </p>

              <section>
                <h3 className="t-headline label-1 mb-1">{t('consortiumPartners')}</h3>
                <ul className="divide-line">
                  {PARTNER_COUNTRIES.map((country) => (
                    <li key={country.id} className="py-3 flex items-baseline gap-4">
                      <span className="t-footnote label-3 font-mono w-6 shrink-0">{country.code}</span>
                      <div className="min-w-0">
                        <div className="t-callout label-1 font-medium">
                          {getCountryName(country)}
                          <span className="label-3 font-normal"> · {country.institution}</span>
                        </div>
                        <div className="t-caption label-3 mt-0.5">{country.partnerRole}</div>
                        {country.address && (
                          <div className="t-footnote label-3 mt-1 flex items-center gap-1.5 opacity-80">
                            <span className="text-[0.7rem]">📍</span>
                            <span>{country.address}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="t-headline label-1 mb-3">{t('keyCapabilities')}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  {pillars.map(({ title, text }) => (
                    <li key={title}>
                      <div className="t-callout label-1 font-semibold">{title}</div>
                      <p className="t-caption label-2 mt-1">{text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="shrink-0 hairline-t px-7 py-3.5 flex items-center justify-between gap-4">
              <span className="t-footnote label-3 font-mono truncate">2024-1-TR01-KA220-HED-000281</span>
              <button onClick={onClose} className="pressable btn btn-primary shrink-0">
                {t('explorePrototype')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
