# Python Freelance Portfolio

A collection of Python automation scripts demonstrating practical skills in data processing, web scraping, report generation, and file management.

## Projects

| # | Project | Description | Main Script | Key Libraries |
|---|---------|-------------|-------------|---------------|
| 1 | [CSV Cleaner](./01-csv-cleaner) | Clean and validate CSV data files | `clean_csv.py` | pandas |
| 2 | [Sales Report Generator](./02-sales-report) | Generate Excel reports from sales data | `generate_sales_report.py` | pandas, openpyxl |
| 3 | [Web Scraper](./03-web-scraper) | Scrape quotes from a website into CSV | `scrape_quotes.py` | requests, BeautifulSoup |
| 4 | [File Organizer](./04-file-organizer) | Organize files by extension into folders | `organize_files.py` | os, shutil, pathlib |

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/osmanozt5432-pixel/python-freelance-portfolio.git
cd python-freelance-portfolio

# Install dependencies
pip install -r requirements.txt
```

### Run Any Project

```bash
# Example 1: Run CSV Cleaner
cd 01-csv-cleaner
python clean_csv.py

# Example 2: Run Sales Report Generator
cd ../02-sales-report
python generate_sales_report.py

# Example 3: Run Web Scraper
cd ../03-web-scraper
python scrape_quotes.py

# Example 4: Run File Organizer
cd ../04-file-organizer
python organize_files.py
```

Each project folder contains a dedicated `README.md` with detailed explanations and sample outputs.

## Skills Demonstrated

- **Data Cleaning & Validation** — Missing value handling, duplicate removal, whitespace normalization
- **Data Aggregation & Reporting** — Grouping metrics, multi-sheet Excel report generation
- **Web Scraping** — HTTP requests, HTML parsing, pagination navigation
- **File Automation** — File system traversal, directory creation, automated file routing
- **Clean Code & Professional Standards** — Modular structure, full English documentation, error handling

## Author

**Osman Öztürk**  
Computer Engineering Student | Python Automation & Web Scraping Freelancer

## License

This repository is licensed under the [MIT License](LICENSE).
