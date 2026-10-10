/**
 * GeoClimex - Topografik İklim ve Hava Durumu Harita Motoru
 * HTML5 Canvas, Leaflet & Google Maps Entegrasyonu
 */

(function () {
  "use strict";

  // --- UYGULAMA DURUMU (STATE) ---
  const state = {
    mode: "climate", // 'climate' (İklim Değişikliği) veya 'weather' (Hava Durumu)
    selectedCity: null,
    zoomLevel: 3,
    timelineYear: 2024,
    isPlayingTimeline: false,
    timelineInterval: null,
    heatOpacity: 0.82,
    reliefContrast: 1.25,
    mapEngine: "leaflet", // 'leaflet' veya 'google'
    weatherProvider: "openmeteo", // 'openmeteo', 'weathercom', 'mock'
    googleApiKey: localStorage.getItem("geoclimex_gmaps_key") || "",
    googleMapId: localStorage.getItem("geoclimex_gmaps_id") || "DEMO_MAP_ID",
    googleMapType: "terrain", // 'terrain', 'roadmap', 'satellite', 'hybrid'
    weatherApiKey: localStorage.getItem("geoclimex_weather_key") || "",
    tempUnit: "C", // 'C' veya 'F'
    activeRegion: "all",
    liveWeatherCache: {}
  };

  // Harita Referansları
  let leafletMap = null;
  let googleMap = null;
  let shadedReliefLayer = null;
  let boundariesLayer = null;
  let cityMarkers = [];
  let heatCanvas = null;
  let heatCtx = null;
  let animationFrameId = null;

  // --- RENK PALETLERİ (Image 1 ve 2 Referanslı) ---
  // İklim Değişikliği: Soluk Sarı -> Turuncu -> Kırmızı -> Koyu Bordo / Kızıl (Görsel 1 ile birebir uyumlu)
  const CLIMATE_COLORS = [
    { stop: 0.0, r: 255, g: 255, b: 204, a: 0.25 }, // +0.0°C - +0.6°C (Açık soluk sarı)
    { stop: 0.25, r: 254, g: 217, b: 118, a: 0.45 }, // +0.7°C - +1.2°C (Ilık sarı)
    { stop: 0.50, r: 253, g: 141, b: 60,  a: 0.65 }, // +1.3°C - +2.0°C (Turuncu)
    { stop: 0.75, r: 227, g: 26,  b: 28,  a: 0.85 }, // +2.1°C - +3.0°C (Kırmızı)
    { stop: 1.0,  r: 128, g: 0,   b: 38,  a: 0.95 }  // +3.1°C+ (Görsel 1'deki Texas bölgesi gibi derin bordo/mor)
  ];

  // Hava Durumu: Dondurucu Mavi -> Turkuaz -> Yeşil -> Sarı -> Sıcak Turuncu -> Aşırı Sıcak Mor
  const WEATHER_COLORS = [
    { stop: 0.0,  r: 43,  g: 131, b: 186, a: 0.70 }, // < -10°C (Buz Mavisi)
    { stop: 0.20, r: 100, g: 181, b: 246, a: 0.65 }, // -10°C - 5°C
    { stop: 0.40, r: 77,  g: 208, b: 225, a: 0.60 }, // 5°C - 14°C (Turkuaz)
    { stop: 0.55, r: 171, g: 221, b: 164, a: 0.60 }, // 14°C - 20°C (Ilıman Yeşil)
    { stop: 0.70, r: 255, g: 255, b: 191, a: 0.65 }, // 20°C - 26°C (Güneşli Sarı)
    { stop: 0.85, r: 253, g: 174, b: 97,  a: 0.75 }, // 26°C - 33°C (Sıcak Turuncu)
    { stop: 1.0,  r: 213, g: 62,  b: 79,  a: 0.90 }  // > 33°C (Kızıl Sıcak)
  ];

  // --- BAŞLATMA FONKSİYONU ---
  window.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    initLeafletMap();
    initUIEventListeners();
    updateMapContrast();
    renderAllCityMarkers();
    drawHeatOverlay();

    // Eğer Google API Key kayıtlıysa ve Google seçilmişse
    if (state.googleApiKey && state.mapEngine === "google") {
      loadGoogleMapsEngine();
    }
  });

  // --- CANVAS BAŞLATMA ---
  function initCanvas() {
    heatCanvas = document.getElementById("heat-canvas");
    if (!heatCanvas) return;
    heatCtx = heatCanvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", () => {
      resizeCanvas();
      drawHeatOverlay();
    });
  }

  function resizeCanvas() {
    if (!heatCanvas) return;
    heatCanvas.width = window.innerWidth;
    heatCanvas.height = window.innerHeight;
  }

  // --- LEAFLET HARİTA MOTORU (ESRI 3D Shaded Relief + Siyasi Sınırlar) ---
  function initLeafletMap() {
    const mapElement = document.getElementById("leaflet-map");
    if (!mapElement) return;

    // Harita başlatma (Dünya merkezi, Akdeniz/Avrupa & Asya dengesi)
    leafletMap = L.map("leaflet-map", {
      center: [34.0, 35.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 90
    });

    // Yakınlaştırma butonlarını sağ üste taşı
    L.control.zoom({ position: "topright" }).addTo(leafletMap);

    // 1. Temel Katman: ESRI World Shaded Relief (Görsel 2'deki gibi tek renkli kabartma dağlar)
    shadedReliefLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Topographic Shaded Relief",
        maxZoom: 13,
        className: "shaded-relief-layer"
      }
    ).addTo(leafletMap);

    // 2. Üst Katman: Siyasi Sınırlar, Ülke Çizgileri ve Şehir İsimleri (Görsel 2'deki siyasi etiketler)
    boundariesLayer = L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Boundaries &copy; Esri &mdash; Reference",
        maxZoom: 13,
        opacity: 0.85
      }
    ).addTo(leafletMap);

    // Harita Olayları (Scroll ile yakınlaşma & uzaklaşma)
    leafletMap.on("zoomend moveend", () => {
      const zoom = leafletMap.getZoom();
      state.zoomLevel = zoom;
      updateZoomBadge(zoom);
      updateMapContrast();
      drawHeatOverlay();
    });

    // Haritanın herhangi bir noktasına tıklama desteği (Tüm dünyada koordinat bazlı veri çekme)
    leafletMap.on("click", (e) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });
  }

  // --- DAĞ KABARTMASI VE KONTRAST AYARI ---
  // Kullanıcı scroll ile yakınlaştıkça (zoom arttıkça) Görsel 2'deki gibi dağlar daha belirginleşir!
  function updateMapContrast() {
    const zoom = state.zoomLevel;
    // Zoom arttıkça kontrastı otomatik yükselt
    const autoContrastMultiplier = 1 + (zoom - 2) * 0.08;
    const finalContrast = (state.reliefContrast * autoContrastMultiplier).toFixed(2);
    const finalBrightness = (1.05 - (zoom - 2) * 0.015).toFixed(2);

    const tiles = document.querySelectorAll(".shaded-relief-layer");
    tiles.forEach(tile => {
      tile.style.filter = `contrast(${finalContrast}) brightness(${finalBrightness})`;
    });

    // Şehir etiketlerini belirli bir zoom seviyesinden sonra göster
    const mapViewport = document.getElementById("map-viewport");
    if (mapViewport) {
      if (zoom >= 5) {
        mapViewport.classList.add("zoom-detailed");
      } else {
        mapViewport.classList.remove("zoom-detailed");
      }
    }
  }

  // --- DİNAMİK YAKINLAŞTIRMA-ÖLÇEKLİ ISI / İKLİM ÖRTÜSÜ (CANVAS OVERLAY) ---
  // İstenen Mantık: Uzaklaşınca (zoom düşükken) renk alanları Görsel 1'deki gibi büyük olur.
  // Yakınlaşınca inceleme yapar gibi daha detaylı ve renklerin alanı daha küçük olur!
  function drawHeatOverlay() {
    if (!heatCtx || !heatCanvas) return;

    heatCtx.clearRect(0, 0, heatCanvas.width, heatCanvas.height);
    const zoom = state.zoomLevel;

    // Yakınlaştırma seviyesine göre dinamik etki yarıçapı (Piksel cinsinden)
    // Zoom 2-3 (Uzak): 160-240px geniş bölgesel kemerler (Görsel 1 gibi)
    // Zoom 6-7 (Orta): 60-90px eyalet/bölge ölçeği
    // Zoom 9-12 (Yakın): 20-35px mikro-lokal iklim noktaları
    let radius;
    if (zoom <= 3) {
      radius = 180 + (3 - zoom) * 45;
    } else if (zoom <= 6) {
      radius = 140 - (zoom - 3) * 25;
    } else if (zoom <= 9) {
      radius = 65 - (zoom - 6) * 12;
    } else {
      radius = 28 - (zoom - 9) * 4;
    }
    radius = Math.max(16, radius);

    // Çözünürlük etiketini güncelle
    const resTag = document.getElementById("res-tag");
    if (resTag) {
      if (zoom <= 4) resTag.textContent = `Geniş Kemer Modu (~${Math.round(radius * 1.8)}km)`;
      else if (zoom <= 7) resTag.textContent = `Bölgesel İnceleme (~${Math.round(radius * 0.9)}km)`;
      else resTag.textContent = `Mikro-Klimatik Detay (~${Math.round(radius * 0.3)}km)`;
    }

    const currentColors = state.mode === "climate" ? CLIMATE_COLORS : WEATHER_COLORS;

    // Şehirleri tuval üzerine çiz
    WORLD_CITIES.forEach((city) => {
      // Bölge filtresi kontrolü
      if (state.activeRegion !== "all" && city.region !== state.activeRegion) {
        return;
      }

      let point;
      if (state.mapEngine === "leaflet" && leafletMap) {
        const latLng = L.latLng(city.lat, city.lng);
        point = leafletMap.latLngToContainerPoint(latLng);
      } else if (state.mapEngine === "google" && googleMap) {
        point = googleLatLonToPoint(city.lat, city.lng);
      }

      if (!point) return;

      // Ekran dışındaki noktaları gereksiz yere çizme
      if (
        point.x < -radius * 2 ||
        point.x > heatCanvas.width + radius * 2 ||
        point.y < -radius * 2 ||
        point.y > heatCanvas.height + radius * 2
      ) {
        return;
      }

      // Normalizasyon ve Değer Hesaplama
      let normValue = 0;
      if (state.mode === "climate") {
        // İklim Anomalisi: Zaman Çizelgesine (1970-2050) göre dinamik çarpan
        const yearFactor = (state.timelineYear - 1970) / (2050 - 1970);
        // 1970'te 0.3 kat, 2024'te 1.0 kat, 2050'de 1.55 kat ısınma projeksiyonu
        const currentAnomaly = city.climateAnomaly * (0.3 + yearFactor * 1.25);
        normValue = Math.min(1.0, Math.max(0.0, (currentAnomaly - 0.5) / 3.8));
      } else {
        // Hava Durumu: Sıcaklık (-15°C ile +40°C arası skalada)
        const liveTemp = getCityCurrentTemp(city);
        normValue = Math.min(1.0, Math.max(0.0, (liveTemp + 15) / 55));
      }

      // Değere göre renk türet
      const color = interpolatePalette(currentColors, normValue);

      // Radyal Gradyan Oluştur (Görsel 1'deki pürüzsüz ısı dağılımı)
      const grad = heatCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * state.heatOpacity})`);
      grad.addColorStop(0.45, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.65 * state.heatOpacity})`);
      grad.addColorStop(0.85, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.20 * state.heatOpacity})`);
      grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      heatCtx.fillStyle = grad;
      heatCtx.beginPath();
      heatCtx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      heatCtx.fill();
    });
  }

  // Renk Paleti İnterpolatörü
  function interpolatePalette(palette, t) {
    if (t <= palette[0].stop) return palette[0];
    if (t >= palette[palette.length - 1].stop) return palette[palette.length - 1];

    for (let i = 0; i < palette.length - 1; i++) {
      const c1 = palette[i];
      const c2 = palette[i + 1];
      if (t >= c1.stop && t <= c2.stop) {
        const factor = (t - c1.stop) / (c2.stop - c1.stop);
        return {
          r: Math.round(c1.r + (c2.r - c1.r) * factor),
          g: Math.round(c1.g + (c2.g - c1.g) * factor),
          b: Math.round(c1.b + (c2.b - c1.b) * factor),
          a: c1.a + (c2.a - c1.a) * factor
        };
      }
    }
    return palette[0];
  }

  // Şehir Canlı Sıcaklık Değeri
  function getCityCurrentTemp(city) {
    if (state.liveWeatherCache[city.id]) {
      return state.liveWeatherCache[city.id].temperature;
    }
    // Önbellek yoksa temel değer + iklim sapması simülasyonu
    return city.baseTemp;
  }

  // --- ŞEHİR İMLERİ (CLICKABLE MARKERS) ---
  function renderAllCityMarkers() {
    // Mevcut imleri temizle
    cityMarkers.forEach(m => {
      if (leafletMap && m.remove) m.remove();
    });
    cityMarkers = [];

    WORLD_CITIES.forEach(city => {
      if (state.activeRegion !== "all" && city.region !== state.activeRegion) {
        return;
      }

      // Özel HTML İmi Oluştur
      const markerHtml = `
        <div class="custom-city-marker" title="${city.name}, ${city.country} (Rakım: ${city.elevation}m)">
          <div class="marker-pin" style="background: ${getMarkerColor(city)};"></div>
          <div class="marker-label">${city.name}</div>
        </div>
      `;

      const icon = L.divIcon({
        className: "custom-div-icon",
        html: markerHtml,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([city.lat, city.lng], { icon: icon }).addTo(leafletMap);

      // TIKLAMA FONKSİYONU
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        selectAndInspectCity(city);
      });

      cityMarkers.push(marker);
    });
  }

  function getMarkerColor(city) {
    if (state.mode === "climate") {
      if (city.climateAnomaly > 2.8) return "#800026";
      if (city.climateAnomaly > 2.2) return "#e31a1c";
      if (city.climateAnomaly > 1.7) return "#fd8d3c";
      return "#fed976";
    } else {
      const temp = getCityCurrentTemp(city);
      if (temp > 28) return "#d53e4f";
      if (temp > 20) return "#fdae61";
      if (temp > 10) return "#ffffbf";
      if (temp > 0) return "#a8ddb5";
      return "#2b83ba";
    }
  }

  // --- ŞEHİR SEÇİMİ VE İNCELEME PANELİ (DRAWER) ---
  async function selectAndInspectCity(city) {
    state.selectedCity = city;

    // Paneli Aç
    const drawer = document.getElementById("city-detail-panel");
    if (!drawer) return;
    drawer.classList.add("open");

    // Başlık ve Konum Bilgileri
    document.getElementById("drawer-city-title").textContent = city.name;
    document.getElementById("drawer-country-sub").textContent = `${city.country} • ${city.lat.toFixed(2)}°K, ${city.lng.toFixed(2)}°D`;
    
    // Dağlık/Rakım Göstergesi (Görsel 2'deki dağlık topoğrafya ile uyumlu)
    const elevElem = document.getElementById("drawer-elevation");
    let terrainType = "Ova / Kıyı Düzlüğü";
    if (city.elevation > 1500) terrainType = "Yüksek Dağlık Havza";
    else if (city.elevation > 600) terrainType = "Engebeli / Plato";
    else if (city.elevation > 200) terrainType = "Tepelik";

    elevElem.textContent = `🏔️ Rakım: ${city.elevation} m (${terrainType})`;

    // Weather.com Doğrudan Bağlantı Butonu
    const weatherComBtn = document.getElementById("weathercom-direct-btn");
    if (weatherComBtn) {
      weatherComBtn.href = `https://weather.com/weather/today/l/${city.lat},${city.lng}`;
    }

    // İklim Sekmesini Doldur
    updateClimateTab(city);

    // Hava Durumu Verisini Getir (Canlı Open-Meteo veya Weather.com)
    await fetchLiveWeatherData(city);

    // Trend Grafiğini Çiz
    drawTemperatureTrendSVG(city);
  }

  function updateClimateTab(city) {
    const yearFactor = (state.timelineYear - 1970) / (2050 - 1970);
    const dynamicAnomaly = (city.climateAnomaly * (0.3 + yearFactor * 1.25)).toFixed(1);

    document.getElementById("climate-anomaly-val").textContent = `+${dynamicAnomaly}°C`;
    document.getElementById("climate-drought-val").textContent = city.droughtRisk;
    document.getElementById("climate-2050-val").textContent = `+${(city.climateAnomaly * 1.55).toFixed(1)}°C`;
    document.getElementById("climate-co2-val").textContent = `${(city.climateAnomaly * 115).toFixed(0)} ppm Artış`;
  }

  // --- CANLI HAVA DURUMU VERİ ÇEKME MOTORU ---
  async function fetchLiveWeatherData(city) {
    const tempElem = document.getElementById("live-temp-display");
    const condElem = document.getElementById("live-cond-display");
    const humidityElem = document.getElementById("live-humidity-val");
    const windElem = document.getElementById("live-wind-val");
    const pressureElem = document.getElementById("live-pressure-val");
    const feelsElem = document.getElementById("live-feels-val");

    tempElem.textContent = "...";
    condElem.textContent = "Veri alınıyor...";

    try {
      let data = null;

      // Tercih edilen sağlayıcı kontrolü
      if (state.weatherProvider === "openmeteo" || !state.weatherApiKey) {
        // Open-Meteo Canlı Meteoroloji API (Ücretsiz, CORS engelsiz, sıfır gecikme)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        data = await res.json();

        if (data && data.current) {
          const current = data.current;
          const temp = Math.round(current.temperature_2m);
          const feels = Math.round(current.apparent_temperature);
          const humidity = current.relative_humidity_2m;
          const wind = Math.round(current.wind_speed_10m);
          const pressure = Math.round(current.surface_pressure);
          const cond = getWeatherCodeDescription(current.weather_code);

          // Önbelleğe kaydet
          state.liveWeatherCache[city.id] = {
            temperature: temp,
            feelsLike: feels,
            humidity: humidity,
            windSpeed: wind,
            pressure: pressure,
            condition: cond,
            daily: data.daily
          };

          applyWeatherToUI(temp, feels, humidity, wind, pressure, cond);
          return;
        }
      } else if (state.weatherProvider === "weathercom" && state.weatherApiKey) {
        // Weather.com (The Weather Channel TWC v3 API Şablonu)
        const twcUrl = `https://api.weather.com/v3/wx/conditions/current?geocode=${city.lat},${city.lng}&format=json&units=m&apiKey=${state.weatherApiKey}`;
        const res = await fetch(twcUrl);
        const twcData = await res.json();
        if (twcData && twcData.temperature !== undefined) {
          applyWeatherToUI(
            twcData.temperature,
            twcData.temperatureFeelsLike || twcData.temperature,
            twcData.relativeHumidity || 50,
            twcData.windSpeed || 12,
            twcData.pressureAltimeter || 1013,
            twcData.wxPhraseLong || "Açık"
          );
          return;
        }
      }
    } catch (err) {
      console.warn("Canlı veri sunucusuna ulaşılamadı, yerel meteoroloji modeli devrede:", err);
    }

    // Çevrimdışı / Hata durumunda gerçekçi meteorolojik simülasyon
    const simTemp = city.baseTemp;
    const simFeels = simTemp - (city.elevation > 1000 ? 2 : 0);
    applyWeatherToUI(simTemp, simFeels, 58, 14, 1015 - Math.round(city.elevation / 8), "Parçalı Bulutlu");
  }

  function applyWeatherToUI(temp, feels, humidity, wind, pressure, cond) {
    document.getElementById("live-temp-display").textContent = `${temp}°${state.tempUnit}`;
    document.getElementById("live-cond-display").textContent = cond;
    document.getElementById("live-feels-val").textContent = `${feels}°${state.tempUnit}`;
    document.getElementById("live-humidity-val").textContent = `%${humidity}`;
    document.getElementById("live-wind-val").textContent = `${wind} km/s`;
    document.getElementById("live-pressure-val").textContent = `${pressure} hPa`;
  }

  // WMO Hava Durumu Kodları (Türkçe Açıklamalar)
  function getWeatherCodeDescription(code) {
    if (code === 0) return "☀️ Açık & Güneşli";
    if (code === 1 || code === 2) return "🌤️ Az Bulutlu";
    if (code === 3) return "☁️ Parçalı & Çok Bulutlu";
    if (code === 45 || code === 48) return "🌫️ Sisli & Puslu";
    if (code >= 51 && code <= 55) return "🌦️ Çiseleyen Yağmur";
    if (code >= 61 && code <= 65) return "🌧️ Yağmurlu";
    if (code >= 71 && code <= 77) return "❄️ Kar Yağışlı";
    if (code >= 80 && code <= 82) return "🌧️ Sağanak Yağış";
    if (code >= 95) return "⛈️ Gök Gürültülü Fırtına";
    return "🌤️ Tipik Hava";
  }

  // --- HARİTADA HERHANGİ BİR NOKTAYA TIKLAMA (CANLI KOORDİNAT SORGULAMA) ---
  async function handleMapClick(lat, lng) {
    // Tıklanan koordinat için geçici sanal şehir nesnesi
    const virtualCity = {
      id: `coord_${lat.toFixed(2)}_${lng.toFixed(2)}`,
      name: `Koordinat [${lat.toFixed(2)}°, ${lng.toFixed(2)}°]`,
      country: "Global Coğrafi Nokta",
      region: "custom",
      lat: lat,
      lng: lng,
      elevation: Math.round(Math.abs(Math.sin(lat) * 800) + 50),
      climateAnomaly: +(1.2 + Math.abs(lat / 40) * 0.8).toFixed(1),
      droughtRisk: lat < 35 && lat > 15 ? "Kritik" : "Orta",
      baseTemp: Math.round(30 - Math.abs(lat) * 0.5)
    };

    selectAndInspectCity(virtualCity);
  }

  // --- DİNAMİK SICAKLIK & İKLİM TRENDİ SVG GRAFİĞİ ---
  function drawTemperatureTrendSVG(city) {
    const svg = document.getElementById("trend-svg");
    if (!svg) return;

    const width = 340;
    const height = 90;
    const padding = 15;

    // 5 Günlük / 50 Yıllık Trend Verisi
    let points = [];
    if (state.mode === "climate") {
      // 1970'den 2050'ye sıcaklık anomalisi eğrisi
      points = [
        { label: "1970", val: +(city.climateAnomaly * 0.35).toFixed(1) },
        { label: "1990", val: +(city.climateAnomaly * 0.60).toFixed(1) },
        { label: "2010", val: +(city.climateAnomaly * 0.85).toFixed(1) },
        { label: "2024", val: +(city.climateAnomaly * 1.00).toFixed(1) },
        { label: "2050", val: +(city.climateAnomaly * 1.55).toFixed(1) }
      ];
    } else {
      // 5 Günlük Tahmin
      const base = city.baseTemp;
      points = [
        { label: "Pzt", val: base - 1 },
        { label: "Sal", val: base + 1 },
        { label: "Çar", val: base + 2 },
        { label: "Per", val: base },
        { label: "Cum", val: base - 2 }
      ];
    }

    const minVal = Math.min(...points.map(p => p.val));
    const maxVal = Math.max(...points.map(p => p.val));
    const range = (maxVal - minVal) || 1;

    let pathD = "";
    let circlesHtml = "";

    points.forEach((p, i) => {
      const x = padding + (i / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.val - minVal) / range) * (height - padding * 2);

      if (i === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;

      circlesHtml += `
        <circle cx="${x}" cy="${y}" r="4" fill="${state.mode === 'climate' ? '#f43f5e' : '#38bdf8'}" stroke="#fff" stroke-width="1.5"/>
        <text x="${x}" y="${y - 8}" font-size="10" fill="#cbd5e1" text-anchor="middle" font-weight="600">${p.val}°</text>
        <text x="${x}" y="${height - 2}" font-size="9" fill="#94a3b8" text-anchor="middle">${p.label}</text>
      `;
    });

    svg.innerHTML = `
      <defs>
        <linearGradient id="gradPath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${state.mode === 'climate' ? '#fbbf24' : '#38bdf8'}" />
          <stop offset="100%" stop-color="${state.mode === 'climate' ? '#e11d48' : '#0284c7'}" />
        </linearGradient>
      </defs>
      <path d="${pathD}" fill="none" stroke="url(#gradPath)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${circlesHtml}
    `;
  }

  // --- GOOGLE MAPS HARİTA MOTORU ENTEGRASYONU ---
  // Mandatory setting: internalUsageAttributionIds: ['gmp_git_agentskills_v1']
  function loadGoogleMapsEngine() {
    if (!state.googleApiKey) {
      alert("Lütfen önce Ayarlar (⚙️) menüsünden geçerli bir Google Maps API Anahtarı girin.");
      openSettingsModal();
      return;
    }

    if (window.google && window.google.maps) {
      setupGoogleMap();
      return;
    }

    // Google Maps Scriptini Dinamik Olarak Yükle
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(state.googleApiKey)}&v=weekly&libraries=maps,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setupGoogleMap();
    };
    script.onerror = () => {
      alert("Google Maps API yüklenemedi. Lütfen API anahtarınızı ve ağ bağlantınızı kontrol edin.");
      switchToLeafletEngine();
    };
    document.head.appendChild(script);
  }

  function setupGoogleMap() {
    const googleMapDiv = document.getElementById("google-map");
    const leafletMapDiv = document.getElementById("leaflet-map");
    if (!googleMapDiv || !leafletMapDiv) return;

    leafletMapDiv.style.display = "none";
    googleMapDiv.style.display = "block";

    const mapTypeMapping = {
      terrain: google.maps.MapTypeId.TERRAIN,
      roadmap: google.maps.MapTypeId.ROADMAP,
      satellite: google.maps.MapTypeId.SATELLITE,
      hybrid: google.maps.MapTypeId.HYBRID
    };

    const mapOptions = {
      center: { lat: 34.0, lng: 35.0 },
      zoom: 3,
      mapTypeId: mapTypeMapping[state.googleMapType] || google.maps.MapTypeId.TERRAIN,
      // Mandatory compliance parameter
      internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
      mapId: state.googleMapId || "DEMO_MAP_ID",
      disableDefaultUI: false,
      zoomControl: true
    };

    googleMap = new google.maps.Map(googleMapDiv, mapOptions);

    googleMap.addListener("zoom_changed", () => {
      state.zoomLevel = googleMap.getZoom();
      updateZoomBadge(state.zoomLevel);
      drawHeatOverlay();
    });

    googleMap.addListener("center_changed", () => {
      drawHeatOverlay();
    });

    googleMap.addListener("click", (e) => {
      handleMapClick(e.latLng.lat(), e.latLng.lng());
    });

    // Google Maps Şehir İmleri
    renderGoogleMarkers();
    drawHeatOverlay();
  }

  function renderGoogleMarkers() {
    if (!googleMap || !window.google) return;

    WORLD_CITIES.forEach(city => {
      if (state.activeRegion !== "all" && city.region !== state.activeRegion) return;

      const markerColor = getMarkerColor(city);
      const markerPin = document.createElement("div");
      markerPin.className = "custom-city-marker";
      markerPin.innerHTML = `
        <div class="marker-pin" style="background: ${markerColor};"></div>
        <div class="marker-label">${city.name}</div>
      `;

      markerPin.addEventListener("click", () => {
        selectAndInspectCity(city);
      });

      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        new google.maps.marker.AdvancedMarkerElement({
          map: googleMap,
          position: { lat: city.lat, lng: city.lng },
          title: `${city.name}, ${city.country}`,
          content: markerPin
        });
      }
    });
  }

  function googleLatLonToPoint(lat, lng) {
    if (!googleMap) return null;
    const bounds = googleMap.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const x = ((lng - sw.lng()) / (ne.lng() - sw.lng())) * heatCanvas.width;
    const y = ((ne.lat() - lat) / (ne.lat() - sw.lat())) * heatCanvas.height;

    return { x, y };
  }

  function switchToLeafletEngine() {
    const googleMapDiv = document.getElementById("google-map");
    const leafletMapDiv = document.getElementById("leaflet-map");
    if (googleMapDiv && leafletMapDiv) {
      googleMapDiv.style.display = "none";
      leafletMapDiv.style.display = "block";
    }
    state.mapEngine = "leaflet";
    if (leafletMap) leafletMap.invalidateSize();
    drawHeatOverlay();
  }

  // --- KULLANICI ARAYÜZÜ (UI) ETKİLEŞİMLERİ ---
  function initUIEventListeners() {
    // 1. Ana Mod Değiştirme Butonları (Switch: İklim vs Hava Durumu)
    const btnWeather = document.getElementById("mode-weather-btn");
    const btnClimate = document.getElementById("mode-climate-btn");
    const legendGradient = document.getElementById("legend-gradient");
    const legendTitle = document.getElementById("legend-title");
    const legendLeft = document.getElementById("legend-left");
    const legendMid = document.getElementById("legend-mid");
    const legendRight = document.getElementById("legend-right");
    const legendDesc = document.getElementById("legend-desc");

    if (btnWeather && btnClimate) {
      btnWeather.addEventListener("click", () => {
        state.mode = "weather";
        btnWeather.classList.add("active", "weather");
        btnClimate.classList.remove("active", "climate");

        // Lejantı Hava Durumuna Güncelle
        legendGradient.className = "legend-gradient weather-scale";
        legendTitle.textContent = "Hava Durumu Sıcaklık Skalası";
        legendLeft.textContent = "-15°C";
        legendMid.textContent = "18°C";
        legendRight.textContent = "42°C+";
        legendDesc.textContent = "Buz mavisi dondurucu havaları, sarı/turuncu ılıman iklimi, koyu kızıl aşırı sıcak dalgalarını gösterir.";

        renderAllCityMarkers();
        drawHeatOverlay();
        if (state.selectedCity) selectAndInspectCity(state.selectedCity);
      });

      btnClimate.addEventListener("click", () => {
        state.mode = "climate";
        btnClimate.classList.add("active", "climate");
        btnWeather.classList.remove("active", "weather");

        // Lejantı İklim Değişikliğine Güncelle
        legendGradient.className = "legend-gradient climate-scale";
        legendTitle.textContent = "İklim Değişikliği Isınma Anomalisi";
        legendLeft.textContent = "+0.5°C";
        legendMid.textContent = "+2.0°C";
        legendRight.textContent = "+4.5°C+";
        legendDesc.textContent = "Sanayi öncesine göre sıcaklık artışı. Soluk sarı hafif artışı, derin bordo aşırı sıcak ve kuraklık felaketini gösterir.";

        renderAllCityMarkers();
        drawHeatOverlay();
        if (state.selectedCity) selectAndInspectCity(state.selectedCity);
      });
    }

    // 2. Şehir Arama Kutusu
    const searchInput = document.getElementById("city-search-input");
    const searchDropdown = document.getElementById("search-results-dropdown");

    if (searchInput && searchDropdown) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 1) {
          searchDropdown.style.display = "none";
          return;
        }

        const filtered = WORLD_CITIES.filter(
          c => c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)
        ).slice(0, 8);

        if (filtered.length === 0) {
          searchDropdown.innerHTML = `<div class="search-result-item"><span class="city-name">Şehir bulunamadı</span></div>`;
        } else {
          searchDropdown.innerHTML = filtered.map(c => `
            <div class="search-result-item" data-id="${c.id}">
              <div>
                <span class="city-name">${c.name}</span>
                <span class="country-name">• ${c.country}</span>
              </div>
              <span class="elevation-pill" style="font-size:10px;">${c.elevation}m</span>
            </div>
          `).join("");

          searchDropdown.querySelectorAll(".search-result-item").forEach(item => {
            item.addEventListener("click", () => {
              const cityId = item.getAttribute("data-id");
              const city = WORLD_CITIES.find(c => c.id === cityId);
              if (city) {
                flyToCity(city);
                selectAndInspectCity(city);
                searchInput.value = city.name;
                searchDropdown.style.display = "none";
              }
            });
          });
        }
        searchDropdown.style.display = "block";
      });

      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.style.display = "none";
        }
      });
    }

    // 3. Bölge Filtreleri (Türkiye, Avrupa, Amerika, Rusya, Asya)
    const regionTabs = document.querySelectorAll(".region-tab");
    regionTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        regionTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const region = tab.getAttribute("data-region");
        state.activeRegion = region;

        // Bölgeye Göre Kamerayı Uçur
        flyToRegion(region);
        renderAllCityMarkers();
        drawHeatOverlay();
      });
    });

    // 4. Zaman Çizelgesi Slider (Timeline: 1970 - 2050)
    const timelineSlider = document.getElementById("timeline-slider");
    const timelineYearBadge = document.getElementById("timeline-year-badge");
    const timelinePlayBtn = document.getElementById("timeline-play-btn");

    if (timelineSlider && timelineYearBadge) {
      timelineSlider.addEventListener("input", (e) => {
        const year = parseInt(e.target.value, 10);
        state.timelineYear = year;
        timelineYearBadge.textContent = year;
        drawHeatOverlay();
        if (state.selectedCity) updateClimateTab(state.selectedCity);
      });
    }

    if (timelinePlayBtn) {
      timelinePlayBtn.addEventListener("click", () => {
        if (state.isPlayingTimeline) {
          clearInterval(state.timelineInterval);
          state.isPlayingTimeline = false;
          timelinePlayBtn.textContent = "▶";
        } else {
          state.isPlayingTimeline = true;
          timelinePlayBtn.textContent = "⏸";
          state.timelineInterval = setInterval(() => {
            let nextYear = state.timelineYear + 2;
            if (nextYear > 2050) nextYear = 1970;
            state.timelineYear = nextYear;
            timelineSlider.value = nextYear;
            timelineYearBadge.textContent = nextYear;
            drawHeatOverlay();
            if (state.selectedCity) updateClimateTab(state.selectedCity);
          }, 200);
        }
      });
    }

    // 5. Görünürlük & Dağ Kabartması Kontrolleri (Opacity & Contrast Sliders)
    const heatOpacitySlider = document.getElementById("heat-opacity-slider");
    const heatOpacityVal = document.getElementById("heat-opacity-val");
    if (heatOpacitySlider) {
      heatOpacitySlider.addEventListener("input", (e) => {
        state.heatOpacity = parseFloat(e.target.value);
        if (heatOpacityVal) heatOpacityVal.textContent = `%${Math.round(state.heatOpacity * 100)}`;
        drawHeatOverlay();
      });
    }

    const reliefContrastSlider = document.getElementById("relief-contrast-slider");
    const reliefContrastVal = document.getElementById("relief-contrast-val");
    if (reliefContrastSlider) {
      reliefContrastSlider.addEventListener("input", (e) => {
        state.reliefContrast = parseFloat(e.target.value);
        if (reliefContrastVal) reliefContrastVal.textContent = `${state.reliefContrast.toFixed(2)}x`;
        updateMapContrast();
      });
    }

    // 6. Çekmece Kapatma Butonu
    const closeDrawerBtn = document.getElementById("close-drawer-btn");
    const cityDrawer = document.getElementById("city-detail-panel");
    if (closeDrawerBtn && cityDrawer) {
      closeDrawerBtn.addEventListener("click", () => {
        cityDrawer.classList.remove("open");
      });
    }

    // 7. Çekmece İçi Sekmeler (Hava Durumu / İklim)
    const drawerTabBtns = document.querySelectorAll(".drawer-tab-btn");
    const weatherSection = document.getElementById("drawer-weather-section");
    const climateSection = document.getElementById("drawer-climate-section");
    drawerTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        drawerTabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        if (tab === "weather") {
          weatherSection.style.display = "block";
          climateSection.style.display = "none";
        } else {
          weatherSection.style.display = "none";
          climateSection.style.display = "block";
        }
        if (state.selectedCity) drawTemperatureTrendSVG(state.selectedCity);
      });
    });

    // 8. Ayarlar Modalı Aç / Kapat
    const settingsBtn = document.getElementById("settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings-btn");
    const cancelSettingsBtn = document.getElementById("cancel-settings-btn");
    const saveSettingsBtn = document.getElementById("save-settings-btn");

    if (settingsBtn) settingsBtn.addEventListener("click", openSettingsModal);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", closeSettingsModal);
    if (cancelSettingsBtn) cancelSettingsBtn.addEventListener("click", closeSettingsModal);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", saveSettings);
  }

  function openSettingsModal() {
    const modal = document.getElementById("settings-modal");
    if (!modal) return;
    document.getElementById("cfg-map-engine").value = state.mapEngine;
    document.getElementById("cfg-gmaps-key").value = state.googleApiKey;
    document.getElementById("cfg-gmaps-id").value = state.googleMapId;
    document.getElementById("cfg-gmaps-type").value = state.googleMapType;
    document.getElementById("cfg-weather-provider").value = state.weatherProvider;
    document.getElementById("cfg-weather-key").value = state.weatherApiKey;
    document.getElementById("cfg-temp-unit").value = state.tempUnit;
    modal.classList.add("active");
  }

  function closeSettingsModal() {
    const modal = document.getElementById("settings-modal");
    if (modal) modal.classList.remove("active");
  }

  function saveSettings() {
    const newEngine = document.getElementById("cfg-map-engine").value;
    const newGKey = document.getElementById("cfg-gmaps-key").value.trim();
    const newGId = document.getElementById("cfg-gmaps-id").value.trim() || "DEMO_MAP_ID";
    const newGType = document.getElementById("cfg-gmaps-type").value;
    const newWProv = document.getElementById("cfg-weather-provider").value;
    const newWKey = document.getElementById("cfg-weather-key").value.trim();
    const newUnit = document.getElementById("cfg-temp-unit").value;

    state.mapEngine = newEngine;
    state.googleApiKey = newGKey;
    state.googleMapId = newGId;
    state.googleMapType = newGType;
    state.weatherProvider = newWProv;
    state.weatherApiKey = newWKey;
    state.tempUnit = newUnit;

    localStorage.setItem("geoclimex_gmaps_key", newGKey);
    localStorage.setItem("geoclimex_gmaps_id", newGId);
    localStorage.setItem("geoclimex_weather_key", newWKey);

    closeSettingsModal();

    if (newEngine === "google") {
      loadGoogleMapsEngine();
    } else {
      switchToLeafletEngine();
    }

    if (state.selectedCity) {
      selectAndInspectCity(state.selectedCity);
    }
  }

  // --- KAMERA UÇUŞU VE BÖLGE HEDEFLERİ ---
  function flyToCity(city) {
    if (leafletMap && state.mapEngine === "leaflet") {
      leafletMap.flyTo([city.lat, city.lng], 7, { duration: 1.2 });
    } else if (googleMap && state.mapEngine === "google") {
      googleMap.panTo({ lat: city.lat, lng: city.lng });
      googleMap.setZoom(7);
    }
  }

  function flyToRegion(region) {
    const regions = {
      all: { center: [34.0, 35.0], zoom: 3 },
      turkey: { center: [39.0, 35.2], zoom: 6 },
      europe: { center: [49.5, 12.0], zoom: 5 },
      americas: { center: [28.0, -96.0], zoom: 4 },
      russia: { center: [58.0, 65.0], zoom: 4 },
      asia: { center: [32.0, 105.0], zoom: 4 }
    };

    const target = regions[region] || regions.all;
    if (leafletMap && state.mapEngine === "leaflet") {
      leafletMap.flyTo(target.center, target.zoom, { duration: 1.4 });
    } else if (googleMap && state.mapEngine === "google") {
      googleMap.panTo({ lat: target.center[0], lng: target.center[1] });
      googleMap.setZoom(target.zoom);
    }
  }

  function updateZoomBadge(zoom) {
    const badge = document.getElementById("zoom-level-badge");
    if (badge) badge.textContent = `z:${zoom}`;
  }

})();
