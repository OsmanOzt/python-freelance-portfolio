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
python generate_sales_report.py
```

## Sample Input (`sales_data.csv`)

```csv
product,quantity,unit_price
Pen,10,5
Notebook,5,20
Pen,7,5
Eraser,15,3
Notebook,3,20
Eraser,8,3
Pen,4,5
```

## Sample Output

```
==================================================
  SALES REPORT GENERATOR
==================================================

Raw Sales Data:
    product  quantity  unit_price
0       Pen        10           5
1  Notebook         5          20
2       Pen         7           5
3    Eraser        15           3
4  Notebook         3          20
5    Eraser         8           3
6       Pen         4           5

Product Summary Report:
    product  total_quantity  total_revenue  average_price
0  Notebook               8            160           20.0
1       Pen              21            105            5.0
2    Eraser              23             69            3.0

Report exported successfully: sales_report.xlsx
==================================================
```

The generated Excel file (`sales_report.xlsx`) contains two sheets that can be opened in Excel, Google Sheets, or LibreOffice Calc.

## Dependencies

- pandas
- openpyxl
