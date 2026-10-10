import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, LANGUAGES, type Language } from '../context/LanguageContext';
import { playUiSound } from '../utils/audio';
import { springSnappy } from '../utils/motion';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    playUiSound('select');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          playUiSound('select');
        }}
        className={`pressable btn h-9 px-2.5 gap-1.5 rounded-[var(--r-s)] flex items-center transition-colors ${
          isOpen ? 'btn-secondary' : 'btn-ghost'
        }`}
        aria-label={t('languageSelect')}
        title={t('languageSelect')}
        aria-expanded={isOpen}
      >
        <Globe className="w-[1.0625rem] h-[1.0625rem] opacity-80" style={{ color: 'var(--accent)' }} />
        <span className="t-callout font-medium flex items-center gap-1 label-1">
          <span>{currentOption.flag}</span>
          <span className="text-[0.6875rem] font-bold uppercase tracking-wider">{currentOption.code}</span>
        </span>
        <ChevronDown
          className={`w-3 h-3 label-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={springSnappy}
            className="surface-sheet absolute right-0 mt-1.5 w-48 rounded-[var(--r-m)] p-1.5 z-50 overflow-hidden shadow-2xl"
          >
            <div className="px-2.5 py-1 t-footnote font-semibold uppercase tracking-wider label-3">
              {t('languageSelect')}
            </div>
            <div className="h-px mx-1 my-1" style={{ background: 'var(--line)' }} />
            <div className="space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`pressable w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--r-s)] t-callout transition-all ${
                      isSelected
                        ? 'font-semibold'
                        : 'label-2 row-hover hover:text-[var(--ink-1)]'
                    }`}
                    style={
                      isSelected
                        ? { background: 'var(--accent-wash)', color: 'var(--accent)' }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm leading-none">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
