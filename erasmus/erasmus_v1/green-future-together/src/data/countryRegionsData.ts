import type { CountryRegion } from '../types';

export const COUNTRY_REGIONS: Record<string, CountryRegion[]> = {
  turkey: [
    {
      id: 'tr-karadeniz',
      name: 'Karadeniz Bölgesi',
      countryId: 'turkey',
      anomalyType: 'disturbed', // SARI
      classicalClimate: 'Her mevsim bol yağışlı, ılıman ve nemli Karadeniz iklimi.',
      currentStatus: 'İklim Bozulmuş: Klasik yağış döngüsü kırıldı; anormal güneşlenme ve toprak kuruma sapması yaşanıyor.',
      temperatureAvg: 23.4,
      center: [36.2, 41.2],
      polygon: [
        [
          [30.2, 41.2],
          [31.8, 41.5],
          [33.5, 42.0],
          [35.4, 42.1],
          [37.2, 41.7],
          [39.0, 41.3],
          [40.8, 41.4],
          [41.6, 41.6],
          [41.8, 40.8],
          [40.2, 40.4],
          [38.2, 40.3],
          [36.0, 40.5],
          [33.8, 40.7],
          [31.5, 40.7],
          [30.2, 41.2],
        ],
      ],
    },
    {
      id: 'tr-marmara',
      name: 'Marmara Bölgesi',
      countryId: 'turkey',
      anomalyType: 'rapid', // AÇIK MAVİ
      classicalClimate: 'Akdeniz ve Karadeniz geçiş kuşağı, dengeli rüzgar ve mevsimsel serinlik.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani hava cephesi sıçramaları, şok dolu ve basınç fırtınaları.',
      temperatureAvg: 26.8,
      center: [28.2, 40.9],
      polygon: [
        [
          [26.0, 42.0],
          [28.0, 42.0],
          [30.0, 41.2],
          [30.2, 40.5],
          [29.5, 40.0],
          [28.0, 40.1],
          [26.2, 40.2],
          [26.0, 41.0],
          [26.0, 42.0],
        ],
      ],
    },
    {
      id: 'tr-ege',
      name: 'Ege Bölgesi',
      countryId: 'turkey',
      anomalyType: 'psycho', // MOR
      classicalClimate: 'Ilıman Akdeniz mikro-iklimi, kıyı meltemleri ve zeytin vadileri.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Eko-anksiyete, kronik sıcaklık uykusuzluğu ve solastalgia (yitirilen doğa yası).',
      temperatureAvg: 28.5,
      center: [27.9, 38.4],
      polygon: [
        [
          [26.2, 39.8],
          [28.2, 39.8],
          [29.6, 39.0],
          [29.8, 37.5],
          [28.5, 36.6],
          [27.2, 36.8],
          [26.5, 38.2],
          [26.2, 39.8],
        ],
      ],
    },
    {
      id: 'tr-akdeniz',
      name: 'Akdeniz & Güney Bölgesi',
      countryId: 'turkey',
      anomalyType: 'severe', // KIRMIZI
      classicalClimate: 'Sıcak ve kuru yazlar, ılıman ve bol yağışlı kışlar.',
      currentStatus: 'Aşırı Bozulmuş: Çok güneşli, ekstrem ısı dalgaları (+41°C) ve kritik orman yangını/kuraklık alarmı.',
      temperatureAvg: 37.2,
      center: [34.5, 36.9],
      polygon: [
        [
          [29.0, 36.6],
          [30.5, 37.5],
          [33.5, 37.5],
          [36.5, 37.8],
          [39.5, 38.0],
          [42.5, 37.5],
          [42.2, 36.8],
          [38.5, 36.7],
          [36.0, 35.9],
          [33.0, 36.2],
          [30.5, 36.2],
          [29.0, 36.6],
        ],
      ],
    },
    {
      id: 'tr-icanadolu',
      name: 'İç Anadolu Bölgesi',
      countryId: 'turkey',
      anomalyType: 'normal', // YEŞİL
      classicalClimate: 'Yarı kurak step iklimi, serin geceler ve karasal denge.',
      currentStatus: 'Normal ve Dengeli: Hiçbir sorun yok; mevsim normallerinde sıcaklık ve stabil toprak nemi.',
      temperatureAvg: 22.0,
      center: [33.2, 39.2],
      polygon: [
        [
          [30.5, 40.5],
          [34.0, 40.6],
          [36.8, 40.2],
          [37.2, 38.5],
          [34.0, 37.8],
          [31.2, 37.8],
          [30.2, 39.2],
          [30.5, 40.5],
        ],
      ],
    },
    {
      id: 'tr-doguanadolu',
      name: 'Doğu Anadolu Bölgesi',
      countryId: 'turkey',
      anomalyType: 'normal', // YEŞİL
      classicalClimate: 'Sert karasal yayla iklimi, serin yazlar ve yüksek dağ ekosistemi.',
      currentStatus: 'Normal ve Dengeli: Doğal döngü korunuyor; buzul ve nehir beslenmeleri dengede.',
      temperatureAvg: 19.5,
      center: [41.2, 39.6],
      polygon: [
        [
          [37.5, 40.2],
          [41.5, 41.2],
          [43.8, 41.0],
          [44.5, 39.5],
          [44.0, 38.0],
          [41.5, 38.2],
          [38.5, 38.5],
          [37.5, 40.2],
        ],
      ],
    },
  ],

  italy: [
    {
      id: 'it-north',
      name: 'Kuzey İtalya & Alpler',
      countryId: 'italy',
      anomalyType: 'rapid', // AÇIK MAVİ
      classicalClimate: 'Alp dağ iklimi, daimi kar ve serin vadi rüzgarları.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Hızlı buzul erimesi ve ani şiddetli fırtına döngüleri.',
      temperatureAvg: 20.4,
      center: [10.8, 45.8],
      polygon: [
        [
          [7.0, 46.5],
          [12.5, 46.8],
          [13.5, 45.8],
          [11.5, 45.0],
          [8.0, 45.0],
          [7.0, 46.5],
        ],
      ],
    },
    {
      id: 'it-po',
      name: 'Po Ovası & Emilia',
      countryId: 'italy',
      anomalyType: 'disturbed', // SARI
      classicalClimate: 'Nemli subtropikal nehir deltası ve düzenli bahar yağışları.',
      currentStatus: 'İklim Bozulmuş: Yağış döngüsü kırıldı; nehir debisi anormal düşüşte ve tarımsal nem sapması var.',
      temperatureAvg: 25.6,
      center: [11.2, 44.7],
      polygon: [
        [
          [8.0, 45.0],
          [12.5, 45.2],
          [12.6, 44.2],
          [9.5, 44.4],
          [8.0, 45.0],
        ],
      ],
    },
    {
      id: 'it-central',
      name: 'Merkez İtalya & Toskana',
      countryId: 'italy',
      anomalyType: 'psycho', // MOR
      classicalClimate: 'Akdeniz ılıman tepeleri, dengeli selvi ve bağ ekosistemi.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Tarihi peyzajın kurumasından kaynaklı solastalgia ve eko-stres.',
      temperatureAvg: 29.2,
      center: [12.2, 42.8],
      polygon: [
        [
          [9.8, 44.3],
          [12.8, 44.0],
          [14.2, 42.4],
          [12.2, 41.5],
          [11.0, 42.3],
          [9.8, 44.3],
        ],
      ],
    },
    {
      id: 'it-south',
      name: 'Güney İtalya & Sicilya',
      countryId: 'italy',
      anomalyType: 'severe', // KIRMIZI
      classicalClimate: 'Sıcak ve kuru Akdeniz sahil kuşağı.',
      currentStatus: 'Aşırı Bozulmuş: Tropikal sıcak dalgaları (+42°C), aşırı güneşlenme ve su kıtlığı acil durumu.',
      temperatureAvg: 38.0,
      center: [14.8, 38.8],
      polygon: [
        [
          [12.2, 41.5],
          [16.2, 41.8],
          [18.2, 40.2],
          [16.0, 38.0],
          [14.5, 37.0],
          [12.5, 37.8],
          [14.5, 40.5],
          [12.2, 41.5],
        ],
      ],
    },
  ],

  spain: [
    {
      id: 'es-north',
      name: 'Cantabria & Bask',
      countryId: 'spain',
      anomalyType: 'disturbed', // SARI
      classicalClimate: 'Okyanusal iklim, sürekli yeşil meralar ve düzenli çiseleyen yağışlar.',
      currentStatus: 'İklim Bozulmuş: Yağmur yerine uzun süreli kavurucu güneş; toprak nemi alışılmadık şekilde tükeniyor.',
      temperatureAvg: 24.2,
      center: [-3.8, 43.2],
      polygon: [
        [
          [-6.5, 43.6],
          [-1.5, 43.4],
          [-1.8, 42.5],
          [-5.5, 42.7],
          [-6.5, 43.6],
        ],
      ],
    },
    {
      id: 'es-galicia',
      name: 'Galiçya Bölgesi',
      countryId: 'spain',
      anomalyType: 'normal', // YEŞİL
      classicalClimate: 'Atlantik nemli iklimi, serin fiyortlar ve ormanlık vadiler.',
      currentStatus: 'Normal ve Dengeli: Doğal yağış ve nem rejiminde sapma yok.',
      temperatureAvg: 21.0,
      center: [-8.2, 42.8],
      polygon: [
        [
          [-9.2, 43.8],
          [-6.8, 43.6],
          [-6.8, 41.8],
          [-8.8, 41.9],
          [-9.2, 43.8],
        ],
      ],
    },
    {
      id: 'es-central',
      name: 'Merkez & Madrid Platosu',
      countryId: 'spain',
      anomalyType: 'psycho', // MOR
      classicalClimate: 'Karasal Akdeniz yüksek platosu, berrak gökyüzü.',
      currentStatus: 'İnsan Psikolojisi Etkileniyor: Uzayan sıcak dalgaları ve kentsel ısı stresi toplum ruh sağlığını baskılıyor.',
      temperatureAvg: 32.5,
      center: [-3.7, 40.2],
      polygon: [
        [
          [-5.8, 41.8],
          [-1.8, 41.5],
          [-1.8, 38.8],
          [-5.5, 38.8],
          [-5.8, 41.8],
        ],
      ],
    },
    {
      id: 'es-east',
      name: 'Katalonya & Valensiya',
      countryId: 'spain',
      anomalyType: 'rapid', // AÇIK MAVİ
      classicalClimate: 'Kıyı Akdeniz iklimi, ılıman kışlar ve sıcak yazlar.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani damla fırtınaları (DANA) ve rekor kıran basınç anomalileri.',
      temperatureAvg: 28.9,
      center: [0.5, 40.5],
      polygon: [
        [
          [-1.5, 42.5],
          [3.2, 42.4],
          [0.8, 38.5],
          [-1.2, 38.8],
          [-1.5, 42.5],
        ],
      ],
    },
    {
      id: 'es-south',
      name: 'Endülüs & Murcia',
      countryId: 'spain',
      anomalyType: 'severe', // KIRMIZI
      classicalClimate: 'Akdeniz yarı kurak kıyı ve zeytin vadileri.',
      currentStatus: 'Aşırı Bozulmuş: Aşırı güneşli ve çölleşme eşiğinde; rekor sıcaklık (+44°C) ve su rezervuarı krizi.',
      temperatureAvg: 41.4,
      center: [-4.5, 37.4],
      polygon: [
        [
          [-7.4, 37.5],
          [-4.5, 38.8],
          [-1.0, 38.5],
          [-1.8, 36.6],
          [-6.0, 36.1],
          [-7.4, 37.5],
        ],
      ],
    },
  ],

  romania: [
    {
      id: 'ro-carpathians',
      name: 'Karpatlar & Transilvanya',
      countryId: 'romania',
      anomalyType: 'normal', // YEŞİL
      classicalClimate: 'Orta Avrupa dağ iklimi, zengin iğne yapraklı ormanlar ve serin yazlar.',
      currentStatus: 'Normal ve Dengeli: Orman örtüsü ve su kaynakları dengesini koruyor.',
      temperatureAvg: 19.8,
      center: [24.5, 46.5],
      polygon: [
        [
          [22.5, 47.8],
          [26.0, 47.5],
          [26.2, 45.4],
          [23.2, 45.3],
          [22.0, 46.5],
          [22.5, 47.8],
        ],
      ],
    },
    {
      id: 'ro-danube',
      name: 'Tuna & Muntenia',
      countryId: 'romania',
      anomalyType: 'severe', // KIRMIZI
      classicalClimate: 'Karasal ova iklimi, tarımsal tahıl havzası.',
      currentStatus: 'Aşırı Bozulmuş: Kavurucu sıcak hava kütleleri (+39°C), yoğun güneşlenme ve akifer kuruması.',
      temperatureAvg: 36.2,
      center: [26.0, 44.4],
      polygon: [
        [
          [23.2, 45.3],
          [27.5, 45.2],
          [28.2, 44.0],
          [23.5, 43.8],
          [23.2, 45.3],
        ],
      ],
    },
    {
      id: 'ro-moldova',
      name: 'Moldova & Siret Vadisi',
      countryId: 'romania',
      anomalyType: 'disturbed', // SARI
      classicalClimate: 'Doğu Avrupa karasal geçiş iklimi.',
      currentStatus: 'İklim Bozulmuş: Yağış dengesi bozuldu; beklenmeyen kurak güneş ve nehir debisi sapmaları.',
      temperatureAvg: 25.1,
      center: [27.0, 46.8],
      polygon: [
        [
          [26.0, 47.5],
          [28.2, 47.5],
          [28.2, 45.5],
          [26.2, 45.5],
          [26.0, 47.5],
        ],
      ],
    },
    {
      id: 'ro-blacksea',
      name: 'Dobruca & Karadeniz Sahili',
      countryId: 'romania',
      anomalyType: 'rapid', // AÇIK MAVİ
      classicalClimate: 'Karadeniz kıyı mikro-iklimi, deniz meltemleri.',
      currentStatus: 'İklim Çok Hızlı Değişiyor: Ani fırtına hatları ve Karadeniz deniz suyu sıcaklığı sıçramaları.',
      temperatureAvg: 27.4,
      center: [28.6, 44.8],
      polygon: [
        [
          [27.8, 45.4],
          [29.6, 45.3],
          [28.8, 43.8],
          [27.8, 43.9],
          [27.8, 45.4],
        ],
      ],
    },
  ],
};
