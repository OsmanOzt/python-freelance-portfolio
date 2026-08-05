# Chord Transpozer — Canlı Ses Analizi ve Otomatik Akor Transpoze Sistemi

Kullanıcının mikrofonundan gelen sesi **gerçek zamanlı (real-time)** analiz eden, söylediği notayı tespit edip ekrandaki şarkı akorlarını **otomatik olarak kullanıcının ses tonuna transpoze eden** cross-platform web/mobil/masaüstü uygulaması.

---

## 🔒 Gizlilik & Mimari
- Ses verileri **asla sunucuya gönderilmez**. Tüm pitch detection ve transpoze işlemleri istemci tarafında (Client-Side) Web Audio API + AudioWorklet + Pitchy (McLeod Pitch Method) ile gerçekleşir.
- Gecikme (latency): **< 15ms** end-to-end işleme süresi (hedef: <100ms).

---

## 🚀 Proje Yapısı

```
chord-transpozer/
├── public/
│   ├── worklets/
│   │   └── audio-processor.js    # AudioWorklet processor (ayrı thread)
│   └── manifest.json             # PWA manifest
├── src/
│   ├── app/
│   │   ├── globals.css           # Custom dark theme & glassmorphism utilities
│   │   ├── layout.tsx            # Root layout (Inter + Geist fontları)
│   │   └── page.tsx              # Ana uygulama sayfası
│   ├── components/
│   │   ├── PitchDisplay.tsx      # Canlı Hz, nota, clarity ve cents göstergesi
│   │   └── ChordSheetTransposer.tsx # Akor transpoze & şarkı görüntüleme arayüzü
│   ├── hooks/
│   │   └── useMicrophone.ts      # Mikrofon erişimi & AudioWorklet yönetimi
│   ├── lib/
│   │   ├── audio/                # Framework-bağımsız ses katmanı
│   │   │   ├── pitch-detector.ts # Pitchy MPM pitch detection
│   │   │   ├── pitch-buffer.ts   # Jitter önleyici dairesel tampon bellek
│   │   │   ├── performance-logger.ts # Latency takip & performans ölçümü
│   │   │   └── __tests__/        # Audio katmanı birim testleri
│   │   └── music-theory/         # Framework-bağımsız müzik teorisi katmanı
│   │       ├── note-converter.ts # Hz ↔ MIDI ↔ Nota adı dönüşümü
│   │       ├── transpose-engine.ts # Tonal.js akor & metin transpoze motoru
│   │       └── __tests__/        # Müzik teorisi birim testleri
│   └── store/
│       └── useAudioStore.ts      # Zustand state yönetimi
├── mobile/
│   └── README_MOBILE.md          # Capacitor Android & iOS izinleri rehberi
├── capacitor.config.json         # Capacitor mobil konfigürasyonu
└── src-tauri/                    # Tauri 2.0 masaüstü (PC/Mac/Linux) yapılandırması
```

---

## 🛠️ Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:3000)
npm run dev

# Birim & Performans testlerini çalıştır
npm run test

# Production Build al
npm run build
```

---

## 📱 Cross-Platform Derleme

### Masaüstü (Tauri 2.0)
```bash
# Tauri geliştirme modunda çalıştır
npm run tauri:dev

# Masaüstü binary (.exe / .app / .deb) derle
npm run tauri:build
```

### Mobil (Capacitor Android & iOS)
Detaylı kılavuz için `mobile/README_MOBILE.md` belgesine göz atabilirsiniz.
```bash
# 1. Static export al
npm run build

# 2. Native projelere senkronize et
npm run cap:sync

# 3. Android Studio veya Xcode'da aç
npm run cap:android
npm run cap:ios
```
