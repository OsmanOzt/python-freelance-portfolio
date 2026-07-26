import pandas as pd

# 1. CSV dosyasını oku
df = pd.read_csv("veri.csv")

print("Orijinal veri:")
print(df)
print("Satır sayısı:", len(df))

# 2. Sütun isimlerini temizle (baştaki/sondaki boşlukları sil, küçük harfe çevir)
df.columns = df.columns.str.strip().str.lower()

# 3. Metin (string) sütunlardaki fazla boşlukları temizle
for kolon in df.select_dtypes(include=["object", "str"]).columns:
    df[kolon] = df[kolon].str.strip()

# 4. Tamamen boş satırları sil
df = df.dropna(how="all")

# 5. Tekrar eden satırları sil
df = df.drop_duplicates()

# 6. "isim" sütununda eksik veri varsa uyar ve o satırları göster
if "isim" in df.columns:
    eksik_isim = df[df["isim"].isna()]
    if len(eksik_isim) > 0:
        print(f"\nUYARI: {len(eksik_isim)} satırda isim eksik, bu satırlar silinecek:")
        print(eksik_isim)
        df = df.dropna(subset=["isim"])

print("\nTemizlenmiş veri:")
print(df)
print("Satır sayısı:", len(df))

# 7. Yeni dosyaya kaydet
df.to_csv("veri_temiz.csv", index=False)
print("\nTemiz dosya kaydedildi: veri_temiz.csv")