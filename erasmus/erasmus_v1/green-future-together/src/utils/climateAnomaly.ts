import type { ClimateAnomalyType } from '../types';

export interface ClimateAnomalyConfigItem {
  id: ClimateAnomalyType;
  label: string;
  shortLabel: string;
  color: string;
  contourColor: string;
  fillOpacity: number;
  glowColor: string;
  badge: string;
  headline: string;
  ruleExplanation: string;
  iconName: string;
}

// Renkler iki temada da okunur orta tonlardır; haritada boyalı alan, arayüzde nokta olarak kullanılır.
export const CLIMATE_ANOMALY_CONFIG: Record<ClimateAnomalyType, ClimateAnomalyConfigItem> = {
  normal: {
    id: 'normal',
    label: 'Normal / Dengeli',
    shortLabel: 'Dengeli',
    color: '#3f8a5c',
    contourColor: '#2f7048',
    fillOpacity: 0.16,
    glowColor: '#3f8a5c',
    badge: 'Yeşil · Dengeli',
    headline: 'Klasik İklim Normallerinde',
    ruleExplanation:
      'Bölgede iklim dengede, hiçbir anomali yok. Bölge haritada tamamen YEŞİL parlar.',
    iconName: 'CheckCircle',
  },
  disturbed: {
    id: 'disturbed',
    label: 'İklim Bozulması',
    shortLabel: 'Bozulmuş',
    color: '#c98a1f',
    contourColor: '#a87012',
    fillOpacity: 0.22,
    glowColor: '#c98a1f',
    badge: 'Sarı · Bozulma',
    headline: 'Klasik İklim Ritmi Bozuldu',
    ruleExplanation:
      'Örn: Karadeniz normalde sürekli yağmurlu iken şu an güneş vuruyor ve kuruma başladı. Bölge haritada tamamen SARI parlar.',
    iconName: 'AlertTriangle',
  },
  severe: {
    id: 'severe',
    label: 'Aşırı İklim Bozulması',
    shortLabel: 'Aşırı kriz',
    color: '#c2432d',
    contourColor: '#9f3320',
    fillOpacity: 0.28,
    glowColor: '#c2432d',
    badge: 'Kırmızı · Aşırı Bozulma',
    headline: 'Şiddetli Güneş & Ekstrem Kuraklık',
    ruleExplanation:
      'İklim aşırı bozuldu; tehlikeli sıcaklık, rekor güneşlenme ve kuruma var. Bölge haritada tamamen KIRMIZI parlar.',
    iconName: 'Flame',
  },
  rapid: {
    id: 'rapid',
    label: 'Hızlı Değişen İklim',
    shortLabel: 'Hızlı değişim',
    color: '#2f86ad',
    contourColor: '#226a8c',
    fillOpacity: 0.24,
    glowColor: '#2f86ad',
    badge: 'Açık Mavi · Hızlı Değişim',
    headline: 'Kaotik & Çok Hızlı İklim Salınımları',
    ruleExplanation:
      'İklim ve hava koşulları gün içinde aşırı hızlı ve dengesiz değişiyor. Bölge haritada tamamen AÇIK MAVİ parlar.',
    iconName: 'Zap',
  },
  psycho: {
    id: 'psycho',
    label: 'Psiko-İklim Etkisi',
    shortLabel: 'Eko-anksiyete',
    color: '#8660b0',
    contourColor: '#6a4a92',
    fillOpacity: 0.25,
    glowColor: '#8660b0',
    badge: 'Mor · Psikolojik Etki',
    headline: 'İnsan Psikolojisi & Solastalgia',
    ruleExplanation:
      'İklim değişikliği insanların psikolojisini, uyku kalitesini ve kaygı seviyesini vuruyor. Bölge haritada tamamen MOR parlar.',
    iconName: 'Brain',
  },
};
