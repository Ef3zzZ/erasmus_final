import React, { useState, useEffect, useRef } from 'react';
import { Box, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ModelViewer3DProps {
  /**
   * .glb formatındaki 3D model dosyasının yolu.
   * Projenizin public/ klasörüne (örneğin public/models/trabzon.glb) koyup '/models/trabzon.glb' olarak belirtebilirsiniz.
   */
  src?: string;
  /** Model için erişilebilirlik açıklaması */
  alt?: string;
  /** Panel içi maksimum yükseklik (piksel cinsinden veya css string) */
  height?: number | string;
  /** Model başlığı veya alt etiket */
  title?: string;
  /** İsteğe bağlı ek CSS sınıfı */
  className?: string;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  src = './models/school.glb',
  alt,
  height = 240,
  title,
  className = '',
}) => {
  const { t } = useLanguage();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);

  const displayTitle = title || t('modelViewerTitle');
  const displayAlt = alt || t('modelViewerTitle');
  const heightVal = typeof height === 'number' ? `${height}px` : height;

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      // Şehre özel dosya yoksa (./models/trabzon.glb vb.), genel school.glb modelini dene
      if (currentSrc !== './models/school.glb') {
        setCurrentSrc('./models/school.glb');
      } else {
        setIsLoading(false);
        setHasError(true);
      }
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, [currentSrc]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 group select-none ${className}`}
      style={{
        height: heightVal,
        background: 'transparent',
      }}
    >
      {/* Üstte minimal şeffaf başlık/rozet (koyu tema uyumlu) */}
      <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 dark:bg-white/10 backdrop-blur-md border border-white/10 text-[11px] text-gray-300 pointer-events-none">
        <Box className="w-3 h-3 text-emerald-400" />
        <span className="font-medium tracking-wide">{displayTitle}</span>
      </div>

      {/* Google <model-viewer> Web Bileşeni */}
      <model-viewer
        ref={viewerRef as React.Ref<HTMLElement>}
        src={currentSrc}
        alt={displayAlt}
        auto-rotate
        auto-rotate-delay={0}
        rotation-per-second="20deg"
        camera-controls
        touch-action="pan-y"
        interaction-prompt="none"
        shadow-intensity={0.7}
        shadow-softness={0.7}
        exposure={1.1}
        environment-image="neutral"
        loading="eager"
        reveal="auto"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          outline: 'none',
          border: 'none',
          display: 'block',
        }}
      />

      {/* Yükleniyor Göstergesi */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin opacity-80" />
          <span className="text-[11px] text-gray-400 font-medium">{t('modelLoading')}</span>
        </div>
      )}

      {/* Model Bulunamadığında veya Hata Alındığında Bilgilendirme */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center rounded-xl bg-white/5 border border-dashed border-white/10 backdrop-blur-sm">
          <Box className="w-8 h-8 text-amber-400/80 mb-1.5" />
          <p className="text-xs font-semibold text-gray-200">{t('modelReady')}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 max-w-[260px] leading-tight">
            <code className="text-emerald-400 font-mono text-[10px] bg-black/30 px-1 py-0.5 rounded">{src}</code> {t('modelAddHint')}
          </p>
        </div>
      )}

      {/* Sağ altta minimal döndürme ipucu */}
      {!hasError && !isLoading && (
        <div className="absolute bottom-2 right-3 z-10 text-[10px] text-gray-400/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
          {t('modelDragHint')}
        </div>
      )}
    </div>
  );
};
