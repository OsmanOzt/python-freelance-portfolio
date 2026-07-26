# Web Scraper

A Python script that scrapes quotes, authors, and tags from [quotes.toscrape.com](https://quotes.toscrape.com) and saves the data to a CSV file. Demonstrates web scraping fundamentals including HTTP requests, HTML parsing, and pagination handling.

## Features

- Fetches web pages using HTTP GET requests
- Parses HTML content with BeautifulSoup
- Extracts structured data: quote text, author name, tags
- Handles multi-page pagination automatically
- Exports all data to a clean CSV file
- Provides a summary with total quotes and unique author count

## Usage

```bash
cd 03-web-scraper
python kaziyici.py
```

## Sample Output

```
============================================================
  WEB SCRAPING - quotes.toscrape.com
============================================================

[Sayfa 1] cekiliyor: https://quotes.toscrape.com/page/1/
  [OK] 10 alinti cekildi

[Sayfa 2] cekiliyor: https://quotes.toscrape.com/page/2/
  [OK] 10 alinti cekildi

...

[KAYIT] Toplam 50 alinti 'alintilar.csv' dosyasina kaydediliyor...

============================================================
  TAMAMLANDI!
  Toplam alinti sayisi: 50
  Dosya: alintilar.csv
  Benzersiz yazar sayisi: 28
============================================================

Ilk 3 alinti (onizleme):
----------------------------------------

1. "The world as we have created it is a process of our thinking..."
   - Albert Einstein
   Etiketler: change, deep-thoughts, thinking, world

2. "It is our choices, Harry, that show what we truly are..."
   - J.K. Rowling
   Etiketler: abilities, choices
```

## Generated CSV Structure

| Column | Description |
|--------|-------------|
| metin | The quote text |
| yazar | Author name |
| etiketler | Comma-separated tags |

## How It Works

1. Constructs the URL for each page (`/page/1/`, `/page/2/`, etc.)
2. Sends an HTTP GET request using `requests`
3. Parses the HTML response with `BeautifulSoup`
4. Finds all `<div class="quote">` elements on the page
5. Extracts text, author, and tags from each quote block
6. Repeats for up to 5 pages (configurable via `MAX_SAYFA`)
7. Writes all collected data to `alintilar.csv`

## Configuration

You can modify these constants at the top of the script:

```python
BASE_URL = "https://quotes.toscrape.com"  # Target website
MAX_SAYFA = 5                              # Number of pages to scrape
CIKTI_DOSYASI = "alintilar.csv"           # Output filename
```

## Dependencies

- requests
- beautifulsoup4
