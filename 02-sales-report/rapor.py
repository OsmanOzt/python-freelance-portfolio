import pandas as pd

# 1. Veriyi oku
df = pd.read_csv("satis.csv")

print("Ham veri:")
print(df)

# 2. Her satır için toplam tutarı hesapla (adet * fiyat)
df["toplam"] = df["adet"] * df["fiyat"]

# 3. Ürüne göre grupla: toplam adet, toplam gelir, ortalama fiyat
ozet = df.groupby("urun").agg(
    toplam_adet=("adet", "sum"),
    toplam_gelir=("toplam", "sum"),
    ortalama_fiyat=("fiyat", "mean")
).reset_index()

# 4. Gelire göre büyükten küçüğe sırala
ozet = ozet.sort_values("toplam_gelir", ascending=False)

print("\nÜrün Bazlı Özet:")
print(ozet)

# 5. Excel dosyasına iki ayrı sayfa olarak kaydet
with pd.ExcelWriter("satis_raporu.xlsx", engine="openpyxl") as writer:
    df.to_excel(writer, sheet_name="Ham Veri", index=False)
    ozet.to_excel(writer, sheet_name="Ozet", index=False)

print("\nRapor kaydedildi: satis_raporu.xlsx")