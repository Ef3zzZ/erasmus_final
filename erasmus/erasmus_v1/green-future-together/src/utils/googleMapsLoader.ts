/**
 * Google Maps API Dynamic Loader & Fallback Manager
 * Ensures robust Google Maps integration. If the official JS API encounters
 * any error (missing key, quota, domain restrictions), it falls back seamlessly
 * to the High-Definition Google Maps Tile Engine so the UI never breaks.
 */

let apiLoadPromise: Promise<boolean> | null = null;

export interface GoogleMapsConfig {
  apiKey?: string;
  libraries?: string[];
  language?: string;
}

export const getGoogleMapsApiKey = (): string => {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
};

export const loadGoogleMapsApi = async (config?: GoogleMapsConfig): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Already loaded
  if ((window as any).google?.maps) {
    return true;
  }

  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  const apiKey = config?.apiKey || getGoogleMapsApiKey();

  // If no API key provided, log helpful dev message and gracefully use Tile Engine
  if (!apiKey) {
    console.info(
      '%c[Google Maps]%c API anahtarı (VITE_GOOGLE_MAPS_API_KEY) tanımlanmamış. Kesintisiz yüksek çözünürlüklü Google Maps Katman Motoru devrede.',
      'color: #4285F4; font-weight: bold;',
      'color: inherit;'
    );
    return false;
  }

  apiLoadPromise = new Promise<boolean>((resolve) => {
    try {
      const scriptId = 'google-maps-js-sdk';
      if (document.getElementById(scriptId)) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      const lang = config?.language || 'tr';
      const libs = (config?.libraries || ['places', 'geometry']).join(',');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libs}&language=${lang}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.info(
          '%c[Google Maps API]%c Resmi Google Maps JS SDK başarıyla yüklendi.',
          'color: #34A853; font-weight: bold;',
          'color: inherit;'
        );
        resolve(true);
      };

      script.onerror = (err) => {
        console.warn(
          '%c[Google Maps API]%c Google Maps SDK yüklenemedi, akıllı Google Maps Motoru fallback olarak sürdürülüyor.',
          'color: #EA4335; font-weight: bold;',
          'color: inherit;',
          err
        );
        resolve(false);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('[Google Maps API] Yükleme sırasında hata yakalandı:', error);
      resolve(false);
    }
  });

  return apiLoadPromise;
};
