// Dünya Şehirleri Veritabanı: Avrupa (Türkiye dahil), Amerika, Rusya ve Asya'nın tamamı
// Enlem, boylam, rakım (dağlık seviye), iklim anomalisi (°C) ve bölge bilgileri
const WORLD_CITIES = [
  // --- TÜRKİYE ---
  { id: "ist", name: "İstanbul", country: "Türkiye", region: "turkey", lat: 40.9327, lng: 29.2127, elevation: 120, climateAnomaly: 1.6, droughtRisk: "Orta", baseTemp: 18 },
  { id: "tra", name: "Trabzon", country: "Türkiye", region: "turkey", lat: 41.0027, lng: 39.7168, elevation: 36, climateAnomaly: 1.3, droughtRisk: "Düşük", baseTemp: 16 },

  // --- AVRUPA ---
  { id: "lon", name: "Londra", country: "Birleşik Krallık", region: "europe", lat: 51.5074, lng: -0.1278, elevation: 11, climateAnomaly: 1.4, droughtRisk: "Düşük", baseTemp: 13 },
  { id: "par", name: "Paris", country: "Fransa", region: "europe", lat: 48.8566, lng: 2.3522, elevation: 35, climateAnomaly: 1.8, droughtRisk: "Orta", baseTemp: 15 },
  { id: "ber", name: "Berlin", country: "Almanya", region: "europe", lat: 52.5200, lng: 13.4050, elevation: 34, climateAnomaly: 1.7, droughtRisk: "Orta", baseTemp: 13 },
  { id: "rom", name: "Roma", country: "İtalya", region: "europe", lat: 41.9028, lng: 12.4964, elevation: 21, climateAnomaly: 2.1, droughtRisk: "Yüksek", baseTemp: 20 },
  { id: "mad", name: "Madrid", country: "İspanya", region: "europe", lat: 40.4168, lng: -3.7038, elevation: 667, climateAnomaly: 2.4, droughtRisk: "Kritik", baseTemp: 19 },
  { id: "bar", name: "Barselona", country: "İspanya", region: "europe", lat: 41.3879, lng: 2.16992, elevation: 12, climateAnomaly: 2.0, droughtRisk: "Kritik", baseTemp: 20 },
  { id: "ams", name: "Amsterdam", country: "Hollanda", region: "europe", lat: 52.3676, lng: 4.9041, elevation: -2, climateAnomaly: 1.5, droughtRisk: "Düşük", baseTemp: 12 },
  { id: "bru", name: "Brüksel", country: "Belçika", region: "europe", lat: 50.8503, lng: 4.3517, elevation: 13, climateAnomaly: 1.6, droughtRisk: "Düşük", baseTemp: 13 },
  { id: "vie", name: "Viyana", country: "Avusturya", region: "europe", lat: 48.2082, lng: 16.3738, elevation: 171, climateAnomaly: 1.9, droughtRisk: "Orta", baseTemp: 14 },
  { id: "zur", name: "Zürih", country: "İsviçre", region: "europe", lat: 47.3769, lng: 8.5417, elevation: 408, climateAnomaly: 2.2, droughtRisk: "Düşük", baseTemp: 12 },
  { id: "gen", name: "Cenevre", country: "İsviçre", region: "europe", lat: 46.2044, lng: 6.1432, elevation: 375, climateAnomaly: 2.1, droughtRisk: "Düşük", baseTemp: 13 },
  { id: "war", name: "Varşova", country: "Polonya", region: "europe", lat: 52.2297, lng: 21.0122, elevation: 103, climateAnomaly: 1.8, droughtRisk: "Orta", baseTemp: 11 },
  { id: "pra", name: "Prag", country: "Çekya", region: "europe", lat: 50.0755, lng: 14.4378, elevation: 235, climateAnomaly: 1.7, droughtRisk: "Orta", baseTemp: 12 },
  { id: "bud", name: "Budapeşte", country: "Macaristan", region: "europe", lat: 47.4979, lng: 19.0402, elevation: 96, climateAnomaly: 2.0, droughtRisk: "Yüksek", baseTemp: 15 },
  { id: "ath", name: "Atina", country: "Yunanistan", region: "europe", lat: 37.9838, lng: 23.7275, elevation: 70, climateAnomaly: 2.3, droughtRisk: "Kritik", baseTemp: 22 },
  { id: "lis", name: "Lizbon", country: "Portekiz", region: "europe", lat: 38.7223, lng: -9.1393, elevation: 15, climateAnomaly: 1.8, droughtRisk: "Yüksek", baseTemp: 19 },
  { id: "dub", name: "Dublin", country: "İrlanda", region: "europe", lat: 53.3498, lng: -6.2603, elevation: 20, climateAnomaly: 1.1, droughtRisk: "Çok Düşük", baseTemp: 11 },
  { id: "cph", name: "Kopenhag", country: "Danimarka", region: "europe", lat: 55.6761, lng: 12.5683, elevation: 14, climateAnomaly: 1.4, droughtRisk: "Düşük", baseTemp: 11 },
  { id: "sto", name: "Stokholm", country: "İsveç", region: "europe", lat: 59.3293, lng: 18.0686, elevation: 28, climateAnomaly: 1.9, droughtRisk: "Düşük", baseTemp: 9 },
  { id: "osl", name: "Oslo", country: "Norveç", region: "europe", lat: 59.9139, lng: 10.7522, elevation: 23, climateAnomaly: 2.0, droughtRisk: "Düşük", baseTemp: 8 },
  { id: "hel", name: "Helsinki", country: "Finlandiya", region: "europe", lat: 60.1699, lng: 24.9384, elevation: 17, climateAnomaly: 2.2, droughtRisk: "Düşük", baseTemp: 8 },
  { id: "buc", name: "Bükreş", country: "Romanya", region: "europe", lat: 44.4268, lng: 26.1025, elevation: 85, climateAnomaly: 2.1, droughtRisk: "Yüksek", baseTemp: 16 },
  { id: "bel", name: "Belgrad", country: "Sırbistan", region: "europe", lat: 44.7866, lng: 20.4489, elevation: 117, climateAnomaly: 2.0, droughtRisk: "Yüksek", baseTemp: 16 },
  { id: "kyi", name: "Kiev", country: "Ukrayna", region: "europe", lat: 50.4501, lng: 30.5234, elevation: 168, climateAnomaly: 1.9, droughtRisk: "Orta", baseTemp: 11 },
  { id: "sof", name: "Sofya", country: "Bulgaristan", region: "europe", lat: 42.6977, lng: 23.3219, elevation: 550, climateAnomaly: 1.9, droughtRisk: "Orta", baseTemp: 13 },
  { id: "zag", name: "Zagrep", country: "Hırvatistan", region: "europe", lat: 45.8150, lng: 15.9819, elevation: 158, climateAnomaly: 1.8, droughtRisk: "Orta", baseTemp: 14 },
  { id: "mun", name: "Münih", country: "Almanya", region: "europe", lat: 48.1351, lng: 11.5820, elevation: 519, climateAnomaly: 1.9, droughtRisk: "Düşük", baseTemp: 11 },
  { id: "mil", name: "Milano", country: "İtalya", region: "europe", lat: 45.4642, lng: 9.1900, elevation: 120, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 17 },

  // --- KUZEY VE GÜNEY AMERİKA ---
  { id: "nyc", name: "New York", country: "ABD", region: "americas", lat: 40.7128, lng: -74.0060, elevation: 10, climateAnomaly: 1.6, droughtRisk: "Düşük", baseTemp: 16 },
  { id: "lax", name: "Los Angeles", country: "ABD", region: "americas", lat: 34.0522, lng: -118.2437, elevation: 71, climateAnomaly: 2.3, droughtRisk: "Kritik", baseTemp: 22 },
  { id: "chi", name: "Chicago", country: "ABD", region: "americas", lat: 41.8781, lng: -87.6298, elevation: 181, climateAnomaly: 1.5, droughtRisk: "Orta", baseTemp: 13 },
  { id: "hou", name: "Houston", country: "ABD", region: "americas", lat: 29.7604, lng: -95.3698, elevation: 14, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 24 },
  { id: "phx", name: "Phoenix", country: "ABD", region: "americas", lat: 33.4484, lng: -112.0740, elevation: 331, climateAnomaly: 3.1, droughtRisk: "Aşırı", baseTemp: 30 },
  { id: "dal", name: "Dallas", country: "ABD", region: "americas", lat: 32.7767, lng: -96.7970, elevation: 131, climateAnomaly: 2.7, droughtRisk: "Kritik", baseTemp: 24 },
  { id: "aus", name: "Austin", country: "ABD", region: "americas", lat: 30.2672, lng: -97.7431, elevation: 149, climateAnomaly: 2.8, droughtRisk: "Kritik", baseTemp: 25 },
  { id: "sat", name: "San Antonio", country: "ABD", region: "americas", lat: 29.4241, lng: -98.4936, elevation: 198, climateAnomaly: 2.8, droughtRisk: "Kritik", baseTemp: 25 },
  { id: "sfo", name: "San Francisco", country: "ABD", region: "americas", lat: 37.7749, lng: -122.4194, elevation: 16, climateAnomaly: 1.7, droughtRisk: "Yüksek", baseTemp: 17 },
  { id: "sea", name: "Seattle", country: "ABD", region: "americas", lat: 47.6062, lng: -122.3321, elevation: 53, climateAnomaly: 1.9, droughtRisk: "Düşük", baseTemp: 13 },
  { id: "den", name: "Denver", country: "ABD", region: "americas", lat: 39.7392, lng: -104.9903, elevation: 1609, climateAnomaly: 2.4, droughtRisk: "Yüksek", baseTemp: 14 },
  { id: "mia", name: "Miami", country: "ABD", region: "americas", lat: 25.7617, lng: -80.1918, elevation: 2, climateAnomaly: 1.8, droughtRisk: "Deniz Yükselmesi", baseTemp: 27 },
  { id: "bos", name: "Boston", country: "ABD", region: "americas", lat: 42.3601, lng: -71.0589, elevation: 14, climateAnomaly: 1.6, droughtRisk: "Düşük", baseTemp: 14 },
  { id: "atl", name: "Atlanta", country: "ABD", region: "americas", lat: 33.7490, lng: -84.3880, elevation: 320, climateAnomaly: 1.9, droughtRisk: "Orta", baseTemp: 20 },
  { id: "las", name: "Las Vegas", country: "ABD", region: "americas", lat: 36.1699, lng: -115.1398, elevation: 610, climateAnomaly: 3.2, droughtRisk: "Aşırı", baseTemp: 28 },
  { id: "slc", name: "Salt Lake City", country: "ABD", region: "americas", lat: 40.7608, lng: -111.8910, elevation: 1288, climateAnomaly: 2.6, droughtRisk: "Aşırı", baseTemp: 15 },
  { id: "tor", name: "Toronto", country: "Kanada", region: "americas", lat: 43.6532, lng: -79.3832, elevation: 76, climateAnomaly: 1.7, droughtRisk: "Düşük", baseTemp: 11 },
  { id: "van_ca", name: "Vancouver", country: "Kanada", region: "americas", lat: 49.2827, lng: -123.1207, elevation: 4, climateAnomaly: 1.8, droughtRisk: "Düşük", baseTemp: 13 },
  { id: "mon_ca", name: "Montreal", country: "Kanada", region: "americas", lat: 45.5017, lng: -73.5673, elevation: 36, climateAnomaly: 1.8, droughtRisk: "Düşük", baseTemp: 10 },
  { id: "cal_ca", name: "Calgary", country: "Kanada", region: "americas", lat: 51.0447, lng: -114.0719, elevation: 1045, climateAnomaly: 2.2, droughtRisk: "Orta", baseTemp: 8 },
  { id: "mex", name: "Mexico City", country: "Meksika", region: "americas", lat: 19.4326, lng: -99.1332, elevation: 2240, climateAnomaly: 2.1, droughtRisk: "Kritik", baseTemp: 18 },
  { id: "gdl", name: "Guadalajara", country: "Meksika", region: "americas", lat: 20.6597, lng: -103.3496, elevation: 1566, climateAnomaly: 2.3, droughtRisk: "Yüksek", baseTemp: 22 },
  { id: "mty", name: "Monterrey", country: "Meksika", region: "americas", lat: 25.6866, lng: -100.3161, elevation: 540, climateAnomaly: 2.9, droughtRisk: "Aşırı", baseTemp: 26 },
  { id: "tij", name: "Tijuana", country: "Meksika", region: "americas", lat: 32.5149, lng: -117.0382, elevation: 20, climateAnomaly: 2.0, droughtRisk: "Kritik", baseTemp: 20 },
  { id: "can_mx", name: "Cancún", country: "Meksika", region: "americas", lat: 21.1619, lng: -86.8515, elevation: 10, climateAnomaly: 1.7, droughtRisk: "Fırtına", baseTemp: 28 },
  { id: "sao", name: "São Paulo", country: "Brezilya", region: "americas", lat: -23.5505, lng: -46.6333, elevation: 760, climateAnomaly: 1.9, droughtRisk: "Yüksek", baseTemp: 22 },
  { id: "rio", name: "Rio de Janeiro", country: "Brezilya", region: "americas", lat: -22.9068, lng: -43.1729, elevation: 11, climateAnomaly: 1.8, droughtRisk: "Orta", baseTemp: 26 },
  { id: "bue", name: "Buenos Aires", country: "Arjantin", region: "americas", lat: -34.6037, lng: -58.3816, elevation: 25, climateAnomaly: 1.5, droughtRisk: "Orta", baseTemp: 19 },
  { id: "bog", name: "Bogota", country: "Kolombiya", region: "americas", lat: 4.7110, lng: -74.0721, elevation: 2640, climateAnomaly: 1.6, droughtRisk: "Orta", baseTemp: 14 },
  { id: "lim", name: "Lima", country: "Peru", region: "americas", lat: -12.0464, lng: -77.0428, elevation: 154, climateAnomaly: 1.4, droughtRisk: "Aşırı Kurak", baseTemp: 20 },
  { id: "scl", name: "Santiago", country: "Şili", region: "americas", lat: -33.4489, lng: -70.6693, elevation: 570, climateAnomaly: 2.2, droughtRisk: "Mega-Kuraklık", baseTemp: 17 },
  { id: "uio", name: "Quito", country: "Ekvador", region: "americas", lat: -0.1807, lng: -78.4678, elevation: 2850, climateAnomaly: 1.5, droughtRisk: "Orta", baseTemp: 15 },
  { id: "lpz", name: "La Paz", country: "Bolivya", region: "americas", lat: -16.4897, lng: -68.1193, elevation: 3640, climateAnomaly: 1.9, droughtRisk: "Buzul Kaybı", baseTemp: 11 },

  // --- RUSYA ---
  { id: "mow", name: "Moskova", country: "Rusya", region: "russia", lat: 55.7558, lng: 37.6173, elevation: 156, climateAnomaly: 2.5, droughtRisk: "Orta", baseTemp: 9 },
  { id: "led", name: "Sankt-Peterburg", country: "Rusya", region: "russia", lat: 59.9343, lng: 30.3351, elevation: 11, climateAnomaly: 2.3, droughtRisk: "Düşük", baseTemp: 8 },
  { id: "ovb", name: "Novosibirsk", country: "Rusya", region: "russia", lat: 55.0084, lng: 82.9357, elevation: 150, climateAnomaly: 2.8, droughtRisk: "Orta", baseTemp: 5 },
  { id: "svx", name: "Yekaterinburg", country: "Rusya", region: "russia", lat: 56.8389, lng: 60.6057, elevation: 237, climateAnomaly: 2.6, droughtRisk: "Orta", baseTemp: 6 },
  { id: "kzn", name: "Kazan", country: "Rusya", region: "russia", lat: 55.8304, lng: 49.0661, elevation: 60, climateAnomaly: 2.4, droughtRisk: "Orta", baseTemp: 8 },
  { id: "cek", name: "Çelyabinsk", country: "Rusya", region: "russia", lat: 55.1644, lng: 61.4368, elevation: 220, climateAnomaly: 2.7, droughtRisk: "Orta", baseTemp: 6 },
  { id: "kuf", name: "Samara", country: "Rusya", region: "russia", lat: 53.2415, lng: 50.2212, elevation: 28, climateAnomaly: 2.4, droughtRisk: "Yüksek", baseTemp: 9 },
  { id: "oms", name: "Omsk", country: "Rusya", region: "russia", lat: 54.9885, lng: 73.3242, elevation: 90, climateAnomaly: 2.9, droughtRisk: "Yüksek", baseTemp: 5 },
  { id: "rov", name: "Rostov-na-Donu", country: "Rusya", region: "russia", lat: 47.2357, lng: 39.7015, elevation: 70, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 14 },
  { id: "ufa", name: "Ufa", country: "Rusya", region: "russia", lat: 54.7388, lng: 55.9721, elevation: 160, climateAnomaly: 2.6, droughtRisk: "Orta", baseTemp: 6 },
  { id: "kja", name: "Krasnoyarsk", country: "Rusya", region: "russia", lat: 56.0153, lng: 92.8932, elevation: 160, climateAnomaly: 3.1, droughtRisk: "Orman Yangını", baseTemp: 4 },
  { id: "pee", name: "Perm", country: "Rusya", region: "russia", lat: 58.0105, lng: 56.2502, elevation: 150, climateAnomaly: 2.5, droughtRisk: "Düşük", baseTemp: 5 },
  { id: "vog", name: "Volgograd", country: "Rusya", region: "russia", lat: 48.7080, lng: 44.5133, elevation: 30, climateAnomaly: 2.3, droughtRisk: "Yüksek", baseTemp: 12 },
  { id: "krr", name: "Krasnodar", country: "Rusya", region: "russia", lat: 45.0393, lng: 38.9872, elevation: 35, climateAnomaly: 2.1, droughtRisk: "Orta", baseTemp: 15 },
  { id: "ikt", name: "İrkutsk", country: "Rusya", region: "russia", lat: 52.2870, lng: 104.3050, elevation: 440, climateAnomaly: 3.0, droughtRisk: "Baykal Isınması", baseTemp: 2 },
  { id: "vvo", name: "Vladivostok", country: "Rusya", region: "russia", lat: 43.1198, lng: 131.8869, elevation: 30, climateAnomaly: 2.0, droughtRisk: "Düşük", baseTemp: 8 },
  { id: "khv", name: "Habarovsk", country: "Rusya", region: "russia", lat: 48.4827, lng: 135.0838, elevation: 72, climateAnomaly: 2.7, droughtRisk: "Taşkın", baseTemp: 4 },
  { id: "mmk", name: "Murmansk", country: "Rusya", region: "russia", lat: 68.9585, lng: 33.0827, elevation: 50, climateAnomaly: 3.4, droughtRisk: "Arktik Erime", baseTemp: 1 },
  { id: "yks", name: "Yakutsk", country: "Rusya", region: "russia", lat: 62.0355, lng: 129.6755, elevation: 100, climateAnomaly: 3.8, droughtRisk: "Permafrost Erimesi", baseTemp: -5 },
  { id: "aer", name: "Soçi", country: "Rusya", region: "russia", lat: 43.6028, lng: 39.7342, elevation: 30, climateAnomaly: 1.8, droughtRisk: "Düşük", baseTemp: 18 },

  // --- DOĞU ASYA & ASYA'NIN TAMAMI ---
  // ÇİN
  { id: "bjs", name: "Pekin", country: "Çin", region: "asia", lat: 39.9042, lng: 116.4074, elevation: 43, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 16 },
  { id: "sha", name: "Şanghay", country: "Çin", region: "asia", lat: 31.2304, lng: 121.4737, elevation: 4, climateAnomaly: 2.1, droughtRisk: "Deniz Yükselmesi", baseTemp: 20 },
  { id: "can_cn", name: "Guangzhou", country: "Çin", region: "asia", lat: 23.1291, lng: 113.2644, elevation: 21, climateAnomaly: 1.8, droughtRisk: "Tayfun & Sel", baseTemp: 25 },
  { id: "szx", name: "Şenzen", country: "Çin", region: "asia", lat: 22.5431, lng: 114.0579, elevation: 15, climateAnomaly: 1.9, droughtRisk: "Tayfun & Sel", baseTemp: 25 },
  { id: "ctu", name: "Çengdu", country: "Çin", region: "asia", lat: 30.5728, lng: 104.0668, elevation: 500, climateAnomaly: 1.9, droughtRisk: "Sıcak Dalgası", baseTemp: 19 },
  { id: "ckg", name: "Çongçing", country: "Çin", region: "asia", lat: 29.4316, lng: 106.9123, elevation: 244, climateAnomaly: 2.5, droughtRisk: "Aşırı Sıcak Dalgası", baseTemp: 21 },
  { id: "wuh", name: "Vuhan", country: "Çin", region: "asia", lat: 30.5928, lng: 114.3055, elevation: 37, climateAnomaly: 2.3, droughtRisk: "Yangtze Taşkını", baseTemp: 20 },
  { id: "xiy", name: "Şian", country: "Çin", region: "asia", lat: 34.3416, lng: 108.9398, elevation: 405, climateAnomaly: 2.3, droughtRisk: "Kuraklık", baseTemp: 18 },
  { id: "hrb", name: "Harbin", country: "Çin", region: "asia", lat: 45.8038, lng: 126.5350, elevation: 150, climateAnomaly: 2.8, droughtRisk: "Kış Kısalması", baseTemp: 6 },
  { id: "urc", name: "Urumçi", country: "Çin", region: "asia", lat: 43.8256, lng: 87.6168, elevation: 800, climateAnomaly: 2.9, droughtRisk: "Çölleşme", baseTemp: 11 },
  { id: "lxa", name: "Lhasa", country: "Çin (Tibet)", region: "asia", lat: 29.6525, lng: 91.1721, elevation: 3656, climateAnomaly: 2.7, droughtRisk: "Buzul Erimesi", baseTemp: 10 },
  { id: "hkg", name: "Hong Kong", country: "Çin", region: "asia", lat: 22.3193, lng: 114.1694, elevation: 30, climateAnomaly: 1.7, droughtRisk: "Aşırı Fırtına", baseTemp: 25 },
  { id: "tpe", name: "Taipei", country: "Tayvan", region: "asia", lat: 25.0330, lng: 121.5654, elevation: 9, climateAnomaly: 1.8, droughtRisk: "Süper Tayfun", baseTemp: 24 },

  // JAPONYA
  { id: "tyo", name: "Tokyo", country: "Japonya", region: "asia", lat: 35.6762, lng: 139.6503, elevation: 40, climateAnomaly: 2.2, droughtRisk: "Sıcak Adası & Tayfun", baseTemp: 18 },
  { id: "osa", name: "Osaka", country: "Japonya", region: "asia", lat: 34.6937, lng: 135.5023, elevation: 15, climateAnomaly: 2.3, droughtRisk: "Sıcak Dalgası", baseTemp: 19 },
  { id: "kyo", name: "Kyoto", country: "Japonya", region: "asia", lat: 35.0116, lng: 135.7681, elevation: 54, climateAnomaly: 2.2, droughtRisk: "Sıcak Dalgası", baseTemp: 18 },
  { id: "ngo", name: "Nagoya", country: "Japonya", region: "asia", lat: 35.1815, lng: 136.9066, elevation: 15, climateAnomaly: 2.1, droughtRisk: "Sıcak Dalgası", baseTemp: 18 },
  { id: "spk", name: "Sapporo", country: "Japonya", region: "asia", lat: 43.0618, lng: 141.3545, elevation: 29, climateAnomaly: 2.6, droughtRisk: "Kar Örtüsü Azalması", baseTemp: 10 },
  { id: "fuk", name: "Fukuoka", country: "Japonya", region: "asia", lat: 33.5904, lng: 130.4017, elevation: 10, climateAnomaly: 2.0, droughtRisk: "Yoğun Yağış", baseTemp: 19 },
  { id: "hij", name: "Hiroşima", country: "Japonya", region: "asia", lat: 34.3853, lng: 132.4553, elevation: 12, climateAnomaly: 2.0, droughtRisk: "Taşkın", baseTemp: 18 },
  { id: "oka", name: "Naha (Okinawa)", country: "Japonya", region: "asia", lat: 26.2124, lng: 127.6809, elevation: 8, climateAnomaly: 1.6, droughtRisk: "Mercan Ağarması", baseTemp: 25 },

  // GÜNEY KORE
  { id: "sel", name: "Seul", country: "Güney Kore", region: "asia", lat: 37.5665, lng: 126.9780, elevation: 38, climateAnomaly: 2.4, droughtRisk: "Aşırı Sıcak Dalgası", baseTemp: 15 },
  { id: "pus", name: "Busan", country: "Güney Kore", region: "asia", lat: 35.1796, lng: 129.0756, elevation: 10, climateAnomaly: 1.9, droughtRisk: "Tayfun & Sel", baseTemp: 17 },
  { id: "icn", name: "İnçon", country: "Güney Kore", region: "asia", lat: 37.4563, lng: 126.7052, elevation: 7, climateAnomaly: 2.1, droughtRisk: "Deniz Seviyesi", baseTemp: 15 },
  { id: "tae", name: "Daegu", country: "Güney Kore", region: "asia", lat: 35.8714, lng: 128.6014, elevation: 50, climateAnomaly: 2.7, droughtRisk: "Aşırı Havza Sıcağı", baseTemp: 16 },
  { id: "cju", name: "Jeju", country: "Güney Kore", region: "asia", lat: 33.4996, lng: 126.5312, elevation: 52, climateAnomaly: 1.8, droughtRisk: "Fırtına", baseTemp: 18 },

  // GÜNEY ASYA & HİNDİSTAN
  { id: "del", name: "Yeni Delhi", country: "Hindistan", region: "asia", lat: 28.6139, lng: 77.2090, elevation: 216, climateAnomaly: 2.9, droughtRisk: "Ölümcül Sıcak Dalgası", baseTemp: 28 },
  { id: "bom", name: "Mumbai", country: "Hindistan", region: "asia", lat: 19.0760, lng: 72.8777, elevation: 14, climateAnomaly: 2.0, droughtRisk: "Muson Seli & Deniz", baseTemp: 29 },
  { id: "blr", name: "Bengaluru", country: "Hindistan", region: "asia", lat: 12.9716, lng: 77.5946, elevation: 920, climateAnomaly: 2.2, droughtRisk: "Su Kıtlığı", baseTemp: 24 },
  { id: "ccu", name: "Kalküta", country: "Hindistan", region: "asia", lat: 22.5726, lng: 88.3639, elevation: 9, climateAnomaly: 2.2, droughtRisk: "Kasırga & Sel", baseTemp: 29 },
  { id: "maa", name: "Chennai", country: "Hindistan", region: "asia", lat: 13.0827, lng: 80.2707, elevation: 6, climateAnomaly: 2.1, droughtRisk: "Su Krizi & Sıcak", baseTemp: 30 },
  { id: "hyd", name: "Haydarabad", country: "Hindistan", region: "asia", lat: 17.3850, lng: 78.4867, elevation: 542, climateAnomaly: 2.4, droughtRisk: "Kuraklık", baseTemp: 28 },
  { id: "dac", name: "Dakka", country: "Bangladeş", region: "asia", lat: 23.8103, lng: 90.4125, elevation: 4, climateAnomaly: 2.1, droughtRisk: "Kritik Sel & Deniz", baseTemp: 28 },
  { id: "isb", name: "İslamabad", country: "Pakistan", region: "asia", lat: 33.6844, lng: 73.0479, elevation: 507, climateAnomaly: 2.6, droughtRisk: "Buzul Taşkını & Sıcak", baseTemp: 23 },
  { id: "cmb", name: "Kolombo", country: "Sri Lanka", region: "asia", lat: 6.9271, lng: 79.8612, elevation: 1, climateAnomaly: 1.4, droughtRisk: "Muson Değişimi", baseTemp: 28 },

  // GÜNEYDOĞU ASYA
  { id: "bkk", name: "Bangkok", country: "Tayland", region: "asia", lat: 13.7563, lng: 100.5018, elevation: 1, climateAnomaly: 2.2, droughtRisk: "Çökme & Deniz Basması", baseTemp: 30 },
  { id: "sin", name: "Singapur", country: "Singapur", region: "asia", lat: 1.3521, lng: 103.8198, elevation: 15, climateAnomaly: 1.8, droughtRisk: "Aşırı Nem & Sıcak", baseTemp: 28 },
  { id: "jkt", name: "Cakarta", country: "Endonezya", region: "asia", lat: -6.2088, lng: 106.8456, elevation: 8, climateAnomaly: 2.0, droughtRisk: "Hızlı Batma & Sel", baseTemp: 29 },
  { id: "kul", name: "Kuala Lumpur", country: "Malezya", region: "asia", lat: 3.1390, lng: 101.6869, elevation: 60, climateAnomaly: 1.9, droughtRisk: "Ani Sel", baseTemp: 28 },
  { id: "mnl", name: "Manila", country: "Filipinler", region: "asia", lat: 14.5995, lng: 120.9842, elevation: 7, climateAnomaly: 1.9, droughtRisk: "Kategori 5 Tayfun", baseTemp: 29 },
  { id: "han", name: "Hanoi", country: "Vietnam", region: "asia", lat: 21.0285, lng: 105.8542, elevation: 10, climateAnomaly: 2.2, droughtRisk: "Nehir Taşkını", baseTemp: 26 },
  { id: "sgn", name: "Ho Chi Minh Kenti", country: "Vietnam", region: "asia", lat: 10.8231, lng: 106.6297, elevation: 19, climateAnomaly: 2.0, droughtRisk: "Mekong Deltası Tuzlanması", baseTemp: 29 },

  // ORTA ASYA, KAFKASLAR & ORTA DOĞU
  { id: "tas", name: "Taşkent", country: "Özbekistan", region: "asia", lat: 41.2995, lng: 69.2401, elevation: 450, climateAnomaly: 2.6, droughtRisk: "Aral Gölü Kuruması", baseTemp: 18 },
  { id: "ala", name: "Almatı", country: "Kazakistan", region: "asia", lat: 43.2220, lng: 76.8512, elevation: 785, climateAnomaly: 2.7, droughtRisk: "Tanrı Dağları Erimesi", baseTemp: 13 },
  { id: "tse", name: "Astana", country: "Kazakistan", region: "asia", lat: 51.1694, lng: 71.4491, elevation: 347, climateAnomaly: 3.1, droughtRisk: "Bozkır Çölleşmesi", baseTemp: 6 },
  { id: "bak", name: "Bakü", country: "Azerbaycan", region: "asia", lat: 40.4093, lng: 49.8671, elevation: -28, climateAnomaly: 2.0, droughtRisk: "Hazar Çekilmesi", baseTemp: 17 },
  { id: "tbs", name: "Tiflis", country: "Gürcistan", region: "asia", lat: 41.7151, lng: 44.8271, elevation: 490, climateAnomaly: 2.1, droughtRisk: "Orta", baseTemp: 15 },
  { id: "evn", name: "Erivan", country: "Ermenistan", region: "asia", lat: 40.1792, lng: 44.4991, elevation: 989, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 14 },
  { id: "thr", name: "Tahran", country: "İran", region: "asia", lat: 35.6892, lng: 51.3890, elevation: 1189, climateAnomaly: 2.8, droughtRisk: "Toprak Çökmesi & Kuraklık", baseTemp: 20 },
  { id: "bgw", name: "Bağdat", country: "Irak", region: "asia", lat: 33.3152, lng: 44.3661, elevation: 34, climateAnomaly: 3.3, droughtRisk: "Ölümcül Toz Fırtınası", baseTemp: 26 },
  { id: "ruh", name: "Riyad", country: "Suudi Arabistan", region: "asia", lat: 24.7136, lng: 46.6753, elevation: 612, climateAnomaly: 3.2, droughtRisk: "Aşırı Çölleşme", baseTemp: 29 },
  { id: "dxb", name: "Dubai", country: "BAE", region: "asia", lat: 25.2048, lng: 55.2708, elevation: 5, climateAnomaly: 2.9, droughtRisk: "Aşırı Yaş Termometre", baseTemp: 31 },
  { id: "doh", name: "Doha", country: "Katar", region: "asia", lat: 25.2854, lng: 51.5310, elevation: 10, climateAnomaly: 3.0, droughtRisk: "Aşırı Sıcak", baseTemp: 31 },
  { id: "kwi", name: "Kuveyt Şehri", country: "Kuveyt", region: "asia", lat: 29.3759, lng: 47.9774, elevation: 15, climateAnomaly: 3.5, droughtRisk: "+53°C Rekor Sıcaklar", baseTemp: 30 },
  { id: "tlv", name: "Tel Aviv", country: "İsrail", region: "asia", lat: 32.0853, lng: 34.7818, elevation: 10, climateAnomaly: 2.2, droughtRisk: "Yüksek", baseTemp: 22 },
  { id: "bey", name: "Beyrut", country: "Lübnan", region: "asia", lat: 33.8938, lng: 35.5018, elevation: 40, climateAnomaly: 2.1, droughtRisk: "Su Stresi", baseTemp: 22 }
];

/**
 * Şehirlerin güncel canlı hava durumunu Open-Meteo REST API üzerinden çeker
 * ve nesnelerin `liveTemp`, `baseTemp`, `liveWeather` alanlarını her daim güncel tutar.
 */
async function fetchLiveWeatherForCities(cities = WORLD_CITIES) {
  try {
    const lats = cities.map(c => c.lat.toFixed(4)).join(',');
    const lngs = cities.map(c => c.lng.toFixed(4)).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Hava durumu API yanıt vermedi: ' + res.status);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];
    cities.forEach((city, i) => {
      const current = list[i]?.current;
      if (current) {
        city.liveTemp = current.temperature_2m;
        city.baseTemp = current.temperature_2m; // dinamik güncel sıcaklık
        city.liveHumidity = current.relative_humidity_2m;
        city.liveFeelsLike = current.apparent_temperature;
        city.liveWindSpeed = current.wind_speed_10m;
        city.liveWeatherCode = current.weather_code;
        city.lastUpdated = new Date().toISOString();
      }
    });
    return cities;
  } catch (err) {
    console.warn('Canlı hava durumu çekilemedi:', err);
    return cities;
  }
}

// Dışa aktarma veya tarayıcı global penceresine bağlama
if (typeof window !== "undefined") {
  window.WORLD_CITIES = WORLD_CITIES;
  window.fetchLiveWeatherForCities = fetchLiveWeatherForCities;
}

export { WORLD_CITIES, fetchLiveWeatherForCities };
export default WORLD_CITIES;
