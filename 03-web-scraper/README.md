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
python scrape_quotes.py
```

## Sample Output

```
============================================================
  WEB SCRAPER — quotes.toscrape.com
============================================================

[Page 1] Fetching: https://quotes.toscrape.com/page/1/
  [OK] 10 quotes extracted

[Page 2] Fetching: https://quotes.toscrape.com/page/2/
  [OK] 10 quotes extracted

...

[SAVING] Exporting 50 quotes to 'quotes.csv'...

============================================================
  SCRAPING COMPLETED SUCCESSFULLY!
  Total Quotes: 50
  Output File: quotes.csv
  Unique Authors: 28
============================================================

First 3 Quotes (Preview):
----------------------------------------

1. "The world as we have created it is a process of our thinking..."
   — Albert Einstein
   Tags: change, deep-thoughts, thinking, world

2. "It is our choices, Harry, that show what we truly are..."
   — J.K. Rowling
   Tags: abilities, choices
```

## Generated CSV Structure

| Column | Description |
|--------|-------------|
| text | The quote text |
| author | Author name |
| tags | Comma-separated tags |

## How It Works

1. Constructs the URL for each page (`/page/1/`, `/page/2/`, etc.)
2. Sends an HTTP GET request using `requests`
3. Parses the HTML response with `BeautifulSoup`
4. Finds all `<div class="quote">` elements on the page
5. Extracts text, author, and tags from each quote block
6. Repeats for up to 5 pages (configurable via `MAX_PAGES`)
7. Writes all collected data to `quotes.csv`

## Dependencies

- requests
- beautifulsoup4
