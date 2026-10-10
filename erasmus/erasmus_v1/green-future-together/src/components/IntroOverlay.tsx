import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { playUiSound } from '../utils/audio';

interface IntroOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ isOpen, onComplete }) => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [needsInteractionForAudio, setNeedsInteractionForAudio] = useState(false);

  // Initialize and handle autoplay
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    // Reset playback
    video.currentTime = 0;
    setProgress(0);

    // Attempt unmuted play first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setNeedsInteractionForAudio(false);
        })
        .catch(() => {
          // Browser blocked unmuted autoplay: fall back to muted autoplay
          video.muted = true;
          setIsMuted(true);
          setNeedsInteractionForAudio(true);
          video.play().catch((err) => {
            console.warn('[IntroOverlay] Autoplay completely blocked:', err);
          });
        });
    }

    // Keyboard listener: Esc or Space skips intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        handleSkip();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSkip = useCallback(() => {
    playUiSound('select');
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  }, [onComplete]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playUiSound('select');
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setNeedsInteractionForAudio(false);
    }
    playUiSound('select');
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration > 0) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] w-screen h-screen bg-black text-white flex items-center justify-center select-none overflow-hidden"
        >
          {/* Edge-to-Edge Screen-Fitted Video */}
          <video
            ref={videoRef}
            src="./climamap_intro.mp4"
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleSkip}
            onClick={togglePlayPause}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Floating Top Controls (Top-Right) */}
          <div className="absolute top-5 right-6 z-30 flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="pressable p-2.5 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 backdrop-blur-md border border-white/20 transition-all text-white/90 hover:text-white shadow-xl"
              title={isMuted ? t('unmuteSound') : t('muteSound')}
              aria-label={isMuted ? t('unmuteSound') : t('muteSound')}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Skip Intro Button */}
            <button
              onClick={handleSkip}
              className="pressable group flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 hover:bg-black/90 active:bg-black backdrop-blur-md border border-white/25 transition-all text-sm font-medium shadow-2xl hover:shadow-emerald-500/20 text-white"
              title={`${t('skipIntro')} (Esc)`}
              aria-label={t('skipIntro')}
            >
              <span>{t('skipIntro')}</span>
              <SkipForward className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-emerald-400" />
              <kbd className="hidden md:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/15 text-white/80 ml-1">
                Esc
              </kbd>
            </button>
          </div>

          {/* Click to Unmute Floating Prompt */}
          {needsInteractionForAudio && isMuted && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={toggleMute}
              className="absolute bottom-8 px-4 py-2 rounded-full bg-emerald-600/95 hover:bg-emerald-500 backdrop-blur-md text-white font-medium text-xs shadow-2xl flex items-center gap-2 border border-emerald-400/50 transition-transform hover:scale-105 z-30"
            >
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>{language === 'tr' ? 'Sesi Açmak İçin Dokunun' : 'Tap to Unmute Audio'}</span>
            </motion.button>
          )}

          {/* Bottom Sleek Progress Line */}
          <div
            className="absolute bottom-0 left-0 right-0 z-30 h-1.5 hover:h-2.5 transition-all cursor-pointer bg-white/15 group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              if (videoRef.current) {
                videoRef.current.currentTime = pos * (videoRef.current.duration || 0);
              }
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
