"""
Web Scraping Script — quotes.toscrape.com sitesinden alıntı çekici
=====================================================================
Bu script, quotes.toscrape.com sitesindeki alıntıları (quotes),
yazarlarını ve etiketlerini çekip bir CSV dosyasına kaydeder.

Kullanılan kütüphaneler:
    - requests: Web sayfasını indirmek için
    - BeautifulSoup (bs4): HTML içeriğini ayrıştırmak (parse etmek) için
    - csv: Verileri CSV dosyasına yazmak için (Python yerleşik modülü)

Kurulum:
    pip install requests beautifulsoup4
"""

import requests                      # Web sayfasını indirmek için
from bs4 import BeautifulSoup        # HTML'den veri çekmek için
import csv                           # CSV dosyasına yazmak için

# ──────────────────────────────────────────────
# 1. AYARLAR
# ──────────────────────────────────────────────
# Scraping yapacağımız sitenin ana URL'si
BASE_URL = "https://quotes.toscrape.com"

# Çekilecek maksimum sayfa sayısı (site 10 sayfa içerir)
MAX_SAYFA = 5

# Çıktı dosyasının adı
CIKTI_DOSYASI = "alintilar.csv"

# ──────────────────────────────────────────────
# 2. VERİ ÇEKME FONKSİYONU
# ──────────────────────────────────────────────
def sayfa_cek(url):
    """
    Verilen URL'deki sayfayı indirir ve alıntıları çeker.

    Her alıntı için şu bilgileri toplar:
        - metin: Alıntının kendisi
        - yazar: Alıntıyı söyleyen kişi
        - etiketler: Alıntıya ait etiketler (virgülle ayrılmış)

    Parametre:
        url (str): Çekilecek sayfanın URL'si

    Dönüş:
        list: Her eleman bir sözlük (dict) olan alıntı listesi
    """
    # Sayfayı indir
    cevap = requests.get(url)

    # HTTP durum kodu 200 değilse (başarısız) boş liste döndür
    if cevap.status_code != 200:
        print(f"  HATA: Sayfa indirilemedi (HTTP {cevap.status_code})")
        return []

    # HTML içeriğini BeautifulSoup ile ayrıştır
    # "html.parser" Python'un yerleşik HTML ayrıştırıcısıdır
    soup = BeautifulSoup(cevap.text, "html.parser")

    # Sayfadaki tüm alıntı bloklarını bul
    # Her alıntı <div class="quote"> etiketi içinde
    alinti_bloklari = soup.find_all("div", class_="quote")

    # Bu sayfadaki alıntıları toplayacağımız liste
    sayfa_alintilari = []

    for blok in alinti_bloklari:
        # Alıntı metnini çek (<span class="text"> içinde)
        metin = blok.find("span", class_="text").get_text()

        # Yazar adını çek (<small class="author"> içinde)
        yazar = blok.find("small", class_="author").get_text()

        # Etiketleri çek (<a class="tag"> etiketlerinden)
        etiket_elemanlari = blok.find_all("a", class_="tag")
        etiketler = ", ".join([e.get_text() for e in etiket_elemanlari])

        # Sözlük olarak listeye ekle
        sayfa_alintilari.append({
            "metin": metin,
            "yazar": yazar,
            "etiketler": etiketler
        })

    return sayfa_alintilari

# ──────────────────────────────────────────────
# 3. ANA PROGRAM
# ──────────────────────────────────────────────
def main():
    """Ana program: tüm sayfaları gezip alıntıları CSV'ye kaydeder."""

    print("=" * 60)
    print("  WEB SCRAPING — quotes.toscrape.com")
    print("=" * 60)

    # Tüm alıntıları toplayacağımız liste
    tum_alintilar = []

    # Sayfa sayfa gez
    for sayfa_no in range(1, MAX_SAYFA + 1):
        # Her sayfanın URL'si: /page/1, /page/2, ...
        url = f"{BASE_URL}/page/{sayfa_no}/"
        print(f"\n[Sayfa {sayfa_no}] cekiliyor: {url}")

        # Sayfadaki alıntıları çek
        alintilar = sayfa_cek(url)

        # Eğer sayfa boşsa, daha fazla sayfa yok demektir
        if not alintilar:
            print("  Daha fazla sayfa bulunamadı, durduruluyor.")
            break

        # Çekilen alıntıları ana listeye ekle
        tum_alintilar.extend(alintilar)
        print(f"  [OK] {len(alintilar)} alinti cekildi")

    # ──────────────────────────────────────────────
    # 4. CSV DOSYASINA KAYDET
    # ──────────────────────────────────────────────
    print(f"\n[KAYIT] Toplam {len(tum_alintilar)} alinti '{CIKTI_DOSYASI}' dosyasina kaydediliyor...")

    # CSV dosyasını yaz (UTF-8 encoding ile Türkçe karakterler korunsun)
    with open(CIKTI_DOSYASI, "w", newline="", encoding="utf-8") as dosya:
        # CSV yazıcısını oluştur, sütun başlıklarını tanımla
        yazici = csv.DictWriter(dosya, fieldnames=["metin", "yazar", "etiketler"])

        # Başlık satırını yaz
        yazici.writeheader()

        # Tüm alıntıları yaz
        yazici.writerows(tum_alintilar)

    # ──────────────────────────────────────────────
    # 5. ÖZET
    # ──────────────────────────────────────────────
    print("\n" + "=" * 60)
    print(f"  TAMAMLANDI!")
    print(f"  Toplam alinti sayisi: {len(tum_alintilar)}")
    print(f"  Dosya: {CIKTI_DOSYASI}")

    # Benzersiz yazar sayisini hesapla
    yazarlar = set(a["yazar"] for a in tum_alintilar)
    print(f"  Benzersiz yazar sayisi: {len(yazarlar)}")
    print("=" * 60)

    # İlk 3 alıntıyı örnek olarak göster
    print("\nIlk 3 alinti (onizleme):")
    print("-" * 40)
    for i, a in enumerate(tum_alintilar[:3], 1):
        print(f"\n{i}. {a['metin'][:80]}...")
        print(f"   — {a['yazar']}")
        print(f"   Etiketler: {a['etiketler']}")


# Script doğrudan çalıştırıldığında main() fonksiyonunu çağır
if __name__ == "__main__":
    main()
