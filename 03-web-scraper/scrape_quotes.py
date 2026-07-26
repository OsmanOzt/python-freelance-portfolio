"""
Web Scraper Script — Quotes Scraper
====================================
This script scrapes quotes, authors, and tags from quotes.toscrape.com
and exports the dataset into a CSV file.

Dependencies:
    pip install requests beautifulsoup4
"""

from pathlib import Path
import requests
from bs4 import BeautifulSoup
import csv

# Configuration Constants
BASE_DIR = Path(__file__).parent
BASE_URL = "https://quotes.toscrape.com"
MAX_PAGES = 5
OUTPUT_FILE = BASE_DIR / "quotes.csv"


def fetch_page_quotes(page_url):
    """
    Downloads a single page and parses quotes, author names, and tags.

    Args:
        page_url (str): The target page URL.

    Returns:
        list[dict]: List of extracted quote records.
    """
    response = requests.get(page_url)

    if response.status_code != 200:
        print(f"  [ERROR] Failed to download page (HTTP {response.status_code})")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    quote_blocks = soup.find_all("div", class_="quote")
    extracted_quotes = []

    for block in quote_blocks:
        text = block.find("span", class_="text").get_text()
        author = block.find("small", class_="author").get_text()
        tag_elements = block.find_all("a", class_="tag")
        tags = ", ".join([tag.get_text() for tag in tag_elements])

        extracted_quotes.append({
            "text": text,
            "author": author,
            "tags": tags
        })

    return extracted_quotes


def main():
    """Main execution workflow: loops pages and saves to CSV."""
    print("=" * 60)
    print("  WEB SCRAPER — quotes.toscrape.com")
    print("=" * 60)

    all_quotes = []

    for page_num in range(1, MAX_PAGES + 1):
        url = f"{BASE_URL}/page/{page_num}/"
        print(f"\n[Page {page_num}] Fetching: {url}")

        quotes = fetch_page_quotes(url)

        if not quotes:
            print("  No more pages found. Stopping scraper.")
            break

        all_quotes.extend(quotes)
        print(f"  [OK] {len(quotes)} quotes extracted")

    # Save data to CSV
    print(f"\n[SAVING] Exporting {len(all_quotes)} quotes to '{OUTPUT_FILE.name}'...")

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=["text", "author", "tags"])
        writer.writeheader()
        writer.writerows(all_quotes)

    # Output Summary
    print("\n" + "=" * 60)
    print("  SCRAPING COMPLETED SUCCESSFULLY!")
    print(f"  Total Quotes: {len(all_quotes)}")
    print(f"  Output File: {OUTPUT_FILE.name}")

    unique_authors = set(quote["author"] for quote in all_quotes)
    print(f"  Unique Authors: {len(unique_authors)}")
    print("=" * 60)

    # Preview first 3 quotes
    print("\nFirst 3 Quotes (Preview):")
    print("-" * 40)
    for index, quote in enumerate(all_quotes[:3], 1):
        print(f"\n{index}. {quote['text'][:80]}...")
        print(f"   — {quote['author']}")
        print(f"   Tags: {quote['tags']}")


if __name__ == "__main__":
    main()
