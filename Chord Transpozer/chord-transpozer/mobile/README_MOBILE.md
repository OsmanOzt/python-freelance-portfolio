# Capacitor Mobil Paketleme Rehberi (Android & iOS)

Chord Transpozer uygulaması web tabanlı Web Audio API ve Pitchy kullandığı için Capacitor vasıtasıyla hiçbir kod değişikliği yapılmadan iOS ve Android uygulaması olarak derlenebilir.

## Native İzin Gereksinimleri

### 1. Android (`android/app/src/main/AndroidManifest.xml`)
Mikrofon izni için aşağıdaki satırları `<manifest>` etiketinin içine ekleyin:

```xml
<!-- Mikrofon ve Ses Kayıt İzinleri -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-feature android:name="android.hardware.microphone" android:required="true" />
```

### 2. iOS (`ios/App/App/Info.plist`)
Mikrofon izni açıklaması için `<dict>` etiketi altına ekleyin:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Chord Transpozer, söylediğiniz notayı analiz edip akorları otomatik transpoze etmek için mikrofona ihtiyaç duyar.</string>
```

---

## Derleme Komutları

```bash
# 1. Next.js static export al
npm run build

# 2. Capacitor Android projesini ekle
npx cap add android

# 3. Capacitor iOS projesini ekle
npx cap add ios

# 4. Web varlıklarını native projelere senkronize et
npx cap sync

# 5. Android Studio / Xcode'da aç
npx cap open android
npx cap open ios
```
