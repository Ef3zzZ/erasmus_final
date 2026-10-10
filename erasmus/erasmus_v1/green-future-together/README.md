# 🌍 ClimaMap - Digital Twin Platform
### Erasmus+ Projesi Web Prototipi

Bu proje, Avrupa Birliği **Erasmus+** programı kapsamında geliştirilen, 4 ortak ülkeyi (**Türkiye, İtalya, İspanya, Romanya**) ve pilot kentleri kapsayan fütüristik, **Glassmorphism** tasarım diline sahip yüksek etkileşimli bir **Dijital İkiz (Digital Twin)** prototipidir.

---

## ✨ Temel Özellikler & Akış (4 Aşamalı Deneyim)

1. **Aşama 1: Dünya Görünümü (Global View)**
   - Koyu tema (Dark Matter) yüksek çözünürlüklü küre/harita projeksiyonu.
   - Projenin ortak ülkeleri üzerinde parıldayan radar/beacon pinleri ve aktif iklim alarm sayıları.
   - Üst bilgi çubuğunda **"Co-Funded by EU - Erasmus+"** rozeti ve canlı telemetri göstergeleri.

2. **Aşama 2: Ülke Düzeyi (Country Level)**
   - Bir ülkeye (Örn: **Türkiye 🇹🇷**) tıklandığında sinematik `flyTo` kamera animasyonu ile yaklaşma.
   - Ülke içindeki pilot kentlerin (**Trabzon, İstanbul**) canlı sıcaklık ve hava kalitesi haplarıyla belirmesi.

3. **Aşama 3: Şehir Odaklanması & Coğrafi Sınır Blur Efekti (Core Feature)**
   - Şehre (Örn: **Trabzon**) tıklandığında maksimum 3D eğim (`pitch: 52°`) ile şehre iniş.
   - **Kritik Efekt**: Seçilen şehrin coğrafi sınırları çift katmanlı neon zümrüt ve cam göbeği çizgilerle çizilir.
   - **Spotlight Mask & Backdrop Blur**: Şehir sınırları dışındaki tüm harita coğrafyası CSS `backdrop-filter: blur(10px) brightness(0.42)` ve radyal vinyet maskesi ile bulanıklaştırılır ve karartılır. Kullanıcının odağı %100 seçili kente kilitlenir.

4. **Aşama 4: İklim Uyarı Sistemi & CLIMA Robot Asistanı**
   - Sağ tarafta kayarak açılan şık **Glassmorphism HUD Paneli**:
     - **Telemetri Grid**: Sıcaklık, Hissedilen, Bağıl Nem, Rüzgar, AQI (Hava Kalitesi), PM2.5, UV, CO2, Yağış.
     - **Tehlike & Risk Uyarı Sistemi (Hazards)**: Sel/Taşkın, Heyelan (Trabzon için), Kentsel Isı Adası, Orman Yangını, Kuraklık (Madrid için %92) riskleri; renk kodlu (Kırmızı/Turuncu/Sarı/Yeşil) animasyonlu çubuklar.
     - **CLIMA AI Asistanı**: Fütüristik, nefes alan, tehlike seviyesine göre renk değiştiren (yeşil/sarı/kırmızı) LED gözlü şirin robot avatarı ve dinamik iklim tavsiyesi konuşma balonu. Eylemler tamamlandığında kutlama konfetisi ve ses sentezi tetiklenir.
     - **Dijital İkiz Zaman Simülasyonu**: Şu An (Canlı), +12 Saat, +24 Saat ve 2030 İklim Projeksiyonu simülasyon adımları.
     - **Görselleştirme Katmanları**: Termal Isı, Sel Taşkını, Hava Partikülü, Yeşil Koridor.

5. **Ekstra Özellikler**:
   - **Web Audio API Ses Sentezleyici**: Sıfır dış dosya bağımlılığıyla fütüristik kullanıcı arayüzü sesleri (kamera geçiş tonu, pin klik tınısı, CLIMA konuşma bipi).
   - **Otomatik Demo Turu (1-Click Show)**: Üst menüdeki "Hızlı Demo Turu" butonuna basıldığında jüri veya izleyicilere Global → Türkiye → Trabzon akışını ve CLIMA asistanını otomatik olarak canlandırır.
   - **Geri Dön Butonları**: Sol üstte kesintisiz ekmek kırıntısı (Breadcrumbs) ve `← Ülkeye Dön` / `← Dünyaya Dön` kontrolleri.

---

## 🛠️ Teknoloji Yığını

- **React 19** + **TypeScript**
- **Vite** (Süper hızlı geliştirme ve üretim derleyicisi)
- **Tailwind CSS** (Glassmorphism, custom neon emerald/cyan paleti, blur filtreleri)
- **Framer Motion** (Pürüzsüz animasyonlar ve slide-over paneller)
- **MapLibre GL JS** (CartoDB Dark Matter retina haritası, 3D kamera açıları, GeoJSON poligon katmanları)
- **Lucide React** (Modern ikonografi)
- **Canvas Confetti** (İklim eylemi kutlama mikro-etkileşimi)

---

## 🚀 Projeyi Çalıştırma

Terminal veya PowerShell'de şu komutu çalıştırabilirsiniz:

```powershell
cd "C:\Users\Çınar Efe Sezer\.gemini\antigravity-ide\scratch\green-future-together"
npm run dev
```

Ardından tarayıcınızda açın:
```
http://localhost:5173
```

### Üretim (Production) Derlemesi
```powershell
npm run build
```
*(Zaten derlenmiş ve test edilmiştir; `dist/` klasörü hazırdır).*
