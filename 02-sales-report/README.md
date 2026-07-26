# Sales Report Generator

A Python script that reads sales data from a CSV file, calculates product-level summaries (total quantity, total revenue, average price), and exports a professional two-sheet Excel report.

## Features

- Calculates total revenue per row (quantity × price)
- Groups data by product with aggregated metrics
- Sorts products by total revenue (descending)
- Generates a two-sheet Excel report:
  - **Sheet 1 — Raw Data**: Original data with calculated totals
  - **Sheet 2 — Summary**: Product-level aggregated report

## Usage

```bash
cd 02-sales-report
python rapor.py
```

## Sample Input (`satis.csv`)

```
urun,adet,fiyat
Kalem,10,5
Defter,5,20
Kalem,7,5
Silgi,15,3
Defter,3,20
Silgi,8,3
Kalem,4,5
```

## Sample Output

```
Ham veri:
     urun  adet  fiyat
0   Kalem    10      5
1  Defter     5     20
2   Kalem     7      5
3   Silgi    15      3
4  Defter     3     20
5   Silgi     8      3
6   Kalem     4      5

Urun Bazli Ozet:
     urun  toplam_adet  toplam_gelir  ortalama_fiyat
0  Defter            8           160            20.0
1   Kalem           21           105             5.0
2   Silgi           23            69             3.0

Rapor kaydedildi: satis_raporu.xlsx
```

The generated Excel file (`satis_raporu.xlsx`) contains two sheets that can be opened in Excel, Google Sheets, or LibreOffice Calc.

## How It Works

1. Reads the sales CSV file using pandas
2. Calculates `total = quantity × price` for each row
3. Groups by product name and aggregates: sum of quantity, sum of revenue, mean price
4. Sorts by total revenue (highest first)
5. Writes both raw data and summary to separate Excel sheets

## Dependencies

- pandas
- openpyxl
