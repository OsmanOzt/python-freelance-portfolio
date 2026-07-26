"""
Dosya Düzenleyici — Klasördeki dosyaları uzantılarına göre organize eder
========================================================================
Bu script, belirtilen klasördeki dosyaları uzantılarına göre
otomatik olarak alt klasörlere taşır.

Örnek: .jpg → Resimler/, .pdf → PDF/, .docx → Word/

Kullanılan kütüphaneler (hepsi Python yerleşik — kurulum gerektirmez):
    - os: Dosya ve klasör işlemleri
    - shutil: Dosya taşıma
    - pathlib: Modern dosya yolu işlemleri

Kurulum: Gerekmez! Tüm kütüphaneler Python ile birlikte gelir.
"""

import os               # Dosya/klasör işlemleri
import shutil           # Dosya taşıma
from pathlib import Path # Modern dosya yolu işlemleri

# -----------------------------------------------
# 1. UZANTI → KLASÖR EŞLEŞTİRMESİ
# -----------------------------------------------
# Her uzantı hangi klasöre taşınacak?
# İstersen buraya yeni uzantılar ekleyebilirsin.
UZANTI_HARITASI = {
    # Resim dosyaları
    ".jpg": "Resimler",
    ".jpeg": "Resimler",
    ".png": "Resimler",
    ".gif": "Resimler",
    ".bmp": "Resimler",
    ".svg": "Resimler",

    # Belge dosyaları
    ".pdf": "PDF",
    ".docx": "Word",
    ".doc": "Word",
    ".xlsx": "Excel",
    ".xls": "Excel",
    ".pptx": "PowerPoint",
    ".ppt": "PowerPoint",
    ".txt": "Metin",

    # Kod dosyaları
    ".py": "Python",
    ".js": "JavaScript",
    ".html": "Web",
    ".css": "Web",
    ".json": "Veri",
    ".csv": "Veri",

    # Sıkıştırılmış dosyalar
    ".zip": "Arsiv",
    ".rar": "Arsiv",
    ".7z": "Arsiv",

    # Müzik ve Video
    ".mp3": "Muzik",
    ".wav": "Muzik",
    ".mp4": "Video",
    ".avi": "Video",
    ".mkv": "Video",
}

# Haritada olmayan uzantılar bu klasöre taşınır
DIGER_KLASOR = "Diger"


# -----------------------------------------------
# 2. TEST KLASÖRÜ OLUŞTURMA
# -----------------------------------------------
def test_klasoru_olustur(hedef_klasor):
    """
    Test amaçlı karışık dosyalar içeren bir klasör oluşturur.
    Gerçek dosyalarına dokunmadan script'i test edebilirsin.

    Parametre:
        hedef_klasor (str): Test klasörünün oluşturulacağı yol
    """
    test_yolu = Path(hedef_klasor)
    test_yolu.mkdir(exist_ok=True)  # Klasör yoksa oluştur

    # Farklı uzantılarda örnek dosyalar oluştur
    ornek_dosyalar = [
        "rapor.pdf",
        "ozgecmis.docx",
        "foto1.jpg",
        "foto2.png",
        "manzara.jpeg",
        "tablo.xlsx",
        "notlar.txt",
        "script.py",
        "veri.csv",
        "sunum.pptx",
        "muzik.mp3",
        "video.mp4",
        "arsiv.zip",
        "belgesiz_dosya.xyz",     # Haritada olmayan uzantı → "Diger"
    ]

    print(f"[KLASOR] Test klasoru olusturuluyor: {test_yolu}")
    print("-" * 40)

    for dosya_adi in ornek_dosyalar:
        dosya_yolu = test_yolu / dosya_adi
        # Boş bir dosya oluştur (sadece test için)
        dosya_yolu.write_text(f"Bu bir test dosyasidir: {dosya_adi}", encoding="utf-8")
        print(f"  [+] Olusturuldu: {dosya_adi}")

    print(f"\nToplam {len(ornek_dosyalar)} test dosyasi olusturuldu.\n")
    return str(test_yolu)


# -----------------------------------------------
# 3. DOSYA DÜZENLEME FONKSİYONU
# -----------------------------------------------
def dosyalari_duzenle(klasor_yolu):
    """
    Verilen klasördeki dosyaları uzantılarına göre alt klasörlere taşır.

    Parametre:
        klasor_yolu (str): Düzenlenecek klasörün yolu

    Dönüş:
        dict: Her klasör adı → taşınan dosya sayısı
    """
    klasor = Path(klasor_yolu)

    # Klasör var mı kontrol et
    if not klasor.exists():
        print(f"HATA: '{klasor_yolu}' klasoru bulunamadi!")
        return {}

    if not klasor.is_dir():
        print(f"HATA: '{klasor_yolu}' bir klasor degil!")
        return {}

    print("=" * 60)
    print("  DOSYA DUZENLEYICI")
    print("=" * 60)
    print(f"\nDuzenlenecek klasor: {klasor}")

    # Kaç dosyanın hangi klasöre taşındığını takip et
    tasima_sayaci = {}
    # Toplam taşınan dosya sayısı
    toplam_tasindi = 0
    # Atlanan öğe sayısı (alt klasörler, vb.)
    atlanan = 0

    # Klasördeki her öğeyi (dosya/klasör) tara
    for oge in klasor.iterdir():
        # Eğer öğe bir klasörse atla (sadece dosyaları düzenliyoruz)
        if oge.is_dir():
            atlanan += 1
            continue

        # Dosyanın uzantısını al (küçük harfe çevir: .JPG → .jpg)
        uzanti = oge.suffix.lower()

        # Uzantıya göre hedef klasör adını belirle
        # Eğer uzantı haritada yoksa "Diger" klasörüne koy
        hedef_klasor_adi = UZANTI_HARITASI.get(uzanti, DIGER_KLASOR)

        # Hedef klasörün tam yolunu oluştur
        hedef_klasor = klasor / hedef_klasor_adi

        # Hedef klasör yoksa oluştur
        hedef_klasor.mkdir(exist_ok=True)

        # Dosyayı hedef klasöre taşı
        hedef_dosya = hedef_klasor / oge.name

        # Aynı isimde dosya varsa üzerine yazma, numaralandır
        if hedef_dosya.exists():
            # dosya.txt → dosya_1.txt, dosya_2.txt, ...
            sayac = 1
            while hedef_dosya.exists():
                yeni_ad = f"{oge.stem}_{sayac}{oge.suffix}"
                hedef_dosya = hedef_klasor / yeni_ad
                sayac += 1

        shutil.move(str(oge), str(hedef_dosya))

        # Sayacı güncelle
        tasima_sayaci[hedef_klasor_adi] = tasima_sayaci.get(hedef_klasor_adi, 0) + 1
        toplam_tasindi += 1

        print(f"  [>] {oge.name} -> {hedef_klasor_adi}/")

    # -----------------------------------------------
    # 4. ÖZET RAPOR
    # -----------------------------------------------
    print("\n" + "=" * 60)
    print("  OZET RAPOR")
    print("=" * 60)

    if toplam_tasindi == 0:
        print("  Tasinacak dosya bulunamadi.")
    else:
        print(f"\n  Toplam tasinan dosya: {toplam_tasindi}")
        if atlanan > 0:
            print(f"  Atlanan klasor sayisi: {atlanan}")
        print(f"\n  Klasor bazli dagilim:")
        print("  " + "-" * 30)
        for klasor_adi, sayi in sorted(tasima_sayaci.items()):
            print(f"     {klasor_adi:15s} -> {sayi} dosya")

    print("\n" + "=" * 60)
    return tasima_sayaci


# -----------------------------------------------
# 5. ANA PROGRAM
# -----------------------------------------------
def main():
    """
    Ana program: Test klasörü oluştur, sonra dosyaları düzenle.
    Böylece gerçek dosyalarına dokunmadan test edebilirsin.
    """
    # Script'in bulunduğu klasör
    script_klasoru = Path(__file__).parent

    # Test klasörünün yolu
    test_klasoru = script_klasoru / "test_karisik"

    print("\n--- Dosya Duzenleyici - Test Modu ---\n")

    # Adım 1: Test klasörü oluştur (içinde karışık dosyalar olacak)
    test_yolu = test_klasoru_olustur(str(test_klasoru))

    # Adım 2: Dosyaları düzenle
    print("\n--- Dosyalar duzenleniyor... ---\n")
    dosyalari_duzenle(test_yolu)

    # Adım 3: Sonucu göster — hangi alt klasörler oluştu?
    print("\nOlusturulan alt klasorler:")
    print("-" * 40)
    for oge in sorted(Path(test_yolu).iterdir()):
        if oge.is_dir():
            dosya_sayisi = len(list(oge.iterdir()))
            print(f"  [{oge.name}/] ({dosya_sayisi} dosya)")
            for dosya in sorted(oge.iterdir()):
                print(f"      -- {dosya.name}")

    print("\nTest tamamlandi!")
    print(f"   Test klasorunu kontrol et: {test_klasoru}")
    print("   Gercek klasorlerinde kullanmak istersen:")
    print(f'   dosyalari_duzenle("C:\\\\Users\\\\senin_klasorun")')


# Script doğrudan çalıştırıldığında main() fonksiyonunu çağır
if __name__ == "__main__":
    main()
