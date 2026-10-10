import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Square, Info, Sun, Moon, X, ChevronRight } from 'lucide-react';
import { playUiSound } from '../utils/audio';
import { springSnappy } from '../utils/motion';
import { EuMark } from './EuMark';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  isMuted: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onToggleMute: () => void;
  onStartTour: () => void;
  onStopTour: () => void;
  onNextTourStep?: () => void;
  isTourSplit?: boolean;
  isWaitingForNext?: boolean;
  nextStepName?: string;
  onOpenInfoModal: (origin: { x: number; y: number }) => void;
  isTourRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  theme,
  onToggleTheme,
  onToggleMute,
  onStartTour,
  onStopTour,
  onNextTourStep,
  isTourSplit = false,
  isWaitingForNext = false,
  nextStepName,
  onOpenInfoModal,
  isTourRunning,
}) => {
  const { t } = useLanguage();
  const icon = 'w-[1.0625rem] h-[1.0625rem]';

  return (
    // Tam genişlikte ince çubuk: harita altından akar, yalnızca burada hafif bulanıklık var
    <header className="bar absolute top-0 left-0 right-0 z-40 h-[3.25rem] pl-4 pr-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src="/climamap_logo.png"
          alt="ClimaMap Logo"
          className="w-7 h-7 rounded-lg object-contain shadow-sm shrink-0"
        />
        <div className="min-w-0 flex items-baseline gap-2.5">
          <h1 className="t-title label-1 truncate">{t('appTitle')}</h1>
          <span className="t-caption label-3 hidden md:inline truncate">
            {t('appTagline')}
          </span>
        </div>
        <EuMark size={18} className="shrink-0 hidden lg:block opacity-75 ml-1" />
      </div>

      <div className="flex items-center gap-1.5">
        {/* Tur Butonu: Trabzon'a ulaşıldığında 2'ye bölünür [ Devam Et | X ], öncesinde standart buton */}
        {isTourRunning && isTourSplit ? (
          <div className="flex items-center mr-1 rounded-xl overflow-hidden border border-emerald-500/40 bg-emerald-500/10 shadow-sm backdrop-blur-md">
            {/* Sol Kısım: Devam Ettirme Butonu */}
            <button
              onClick={() => {
                playUiSound('select');
                onNextTourStep?.();
              }}
              className={`h-[2.125rem] px-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-all duration-200 select-none cursor-pointer ${
                isWaitingForNext
                  ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)] animate-pulse'
                  : 'text-emerald-300 hover:bg-emerald-500/20 hover:text-white'
              }`}
              title={nextStepName ? `${t('continueTour')}: ${nextStepName}` : t('continueTour')}
              id="demo-tour-continue-btn"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{t('continueTour')}</span>
              {nextStepName && (
                <span className="opacity-90 text-[11px] font-medium hidden sm:inline ml-0.5">
                  ({nextStepName})
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Dikey Ayırıcı Çizgi */}
            <div className="w-[1px] h-4 bg-emerald-500/30" />

            {/* Sağ Kısım: X - Demo Turunu Sonlandırıp Dünyaya Dönme */}
            <button
              onClick={() => {
                playUiSound('select');
                onStopTour();
              }}
              className="h-[2.125rem] px-2.5 flex items-center justify-center text-emerald-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors duration-200 select-none cursor-pointer"
              title={`${t('stopTour')} (${t('world')})`}
              aria-label={`${t('stopTour')} (${t('world')})`}
              id="demo-tour-cancel-btn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              playUiSound('select');
              if (isTourRunning) onStopTour();
              else onStartTour();
            }}
            className={`pressable btn mr-1 overflow-hidden ${isTourRunning ? 'btn-secondary' : 'btn-primary'}`}
            aria-pressed={isTourRunning}
            id={isTourRunning ? 'demo-tour-stop-btn' : 'demo-tour-start-btn'}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={isTourRunning ? 'stop' : 'play'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={springSnappy}
                className="flex items-center gap-2"
              >
                {isTourRunning ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>{t('stopTour')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>{t('demoTour')}</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        )}

        {/* Dil Seçimi (Koyu/Açık Tema Seçiminin Yanında) */}
        <LanguageSelector />

        {/* Koyu / Açık Tema Seçimi */}
        <button
          onClick={() => {
            onToggleTheme();
            playUiSound('select');
          }}
          className="pressable btn btn-ghost btn-icon"
          aria-label={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
          title={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: theme === 'dark' ? -25 : 25 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: theme === 'dark' ? 25 : -25 }}
              transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
              className="grid place-items-center"
            >
              {theme === 'dark' ? <Sun className={icon} /> : <Moon className={icon} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          onClick={() => {
            onToggleMute();
            playUiSound('select');
          }}
          className="pressable btn btn-ghost btn-icon"
          aria-label={isMuted ? t('unmuteSound') : t('muteSound')}
          title={isMuted ? t('unmuteSound') : t('muteSound')}
        >
          {!isMuted ? <Volume2 className={icon} /> : <VolumeX className={icon} />}
        </button>

        <button
          onClick={(e) => {
            playUiSound('select');
            const r = e.currentTarget.getBoundingClientRect();
            onOpenInfoModal({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
          className="pressable btn btn-ghost btn-icon"
          aria-label="Proje hakkında"
          title="Proje hakkında"
        >
          <Info className={icon} />
        </button>
      </div>
    </header>
  );
};
