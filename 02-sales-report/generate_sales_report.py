"""
Sales Report Generator — Aggregates Data & Generates Excel Reports
===================================================================
This script reads sales data from a CSV file, calculates row-level totals,
aggregates metrics per product, and exports a clean two-sheet Excel report.

Dependencies:
    pip install pandas openpyxl
"""

from pathlib import Path
import pandas as pd

# Script base directory
BASE_DIR = Path(__file__).parent


def generate_report(input_file=BASE_DIR / "sales_data.csv", output_file=BASE_DIR / "sales_report.xlsx"):
    """
    Generates product-level aggregated sales report.
    """
    print("=" * 50)
    print("  SALES REPORT GENERATOR")
    print("=" * 50)

    # 1. Read input sales dataset
    df = pd.read_csv(input_file)

    print("\nRaw Sales Data:")
    print(df)

    # 2. Calculate row total revenue (quantity * unit price)
    df["total_revenue"] = df["quantity"] * df["unit_price"]

    # 3. Aggregate data per product: total quantity, total revenue, average price
    summary = df.groupby("product").agg(
        total_quantity=("quantity", "sum"),
        total_revenue=("total_revenue", "sum"),
        average_price=("unit_price", "mean")
    ).reset_index()

    # 4. Sort summary by total revenue descending
    summary = summary.sort_values("total_revenue", ascending=False)

    print("\nProduct Summary Report:")
    print(summary)

    # 5. Export to Excel with separate Raw Data and Summary sheets
    with pd.ExcelWriter(output_file, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Raw Data", index=False)
        summary.to_excel(writer, sheet_name="Summary", index=False)

    print(f"\nReport exported successfully: {output_file}")
    print("=" * 50)

if __name__ == "__main__":
    generate_report()
