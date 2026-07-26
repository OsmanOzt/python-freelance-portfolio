# CSV Cleaner

A Python script that cleans and validates CSV data files by removing empty rows, duplicate entries, extra whitespace, and flagging missing values.

## Features

- Strips leading/trailing whitespace from column names and text fields
- Removes completely empty rows
- Removes duplicate rows
- Detects and removes rows with missing critical fields (e.g., name)
- Saves the cleaned data to a new CSV file

## Usage

```bash
cd 01-csv-cleaner
python temizle.py
```

## Sample Input (`veri.csv`)

```
Isim ,yas,sehir
Ahmet , 25, Istanbul
Mehmet,30,Ankara
Ahmet , 25, Istanbul
,,
Zeynep,28,Izmir
,22,Bursa
```

## Sample Output

```
Orijinal veri:
    Isim   yas      sehir
0  Ahmet    25   Istanbul
1  Mehmet   30     Ankara
2  Ahmet    25   Istanbul
3    NaN   NaN        NaN
4  Zeynep   28      Izmir
5    NaN    22      Bursa
Satir sayisi: 6

UYARI: 1 satirda isim eksik, bu satirlar silinecek

Temizlenmis veri:
     isim  yas     sehir
0   Ahmet   25  Istanbul
1  Mehmet   30    Ankara
2  Zeynep   28     Izmir
Satir sayisi: 3

Temiz dosya kaydedildi: veri_temiz.csv
```

## How It Works

1. Reads the CSV file using pandas
2. Normalizes column names (lowercase, stripped)
3. Strips whitespace from all text columns
4. Drops completely empty rows
5. Drops duplicate rows
6. Warns about and removes rows with missing critical fields
7. Saves the cleaned data to `veri_temiz.csv`

## Dependencies

- pandas
