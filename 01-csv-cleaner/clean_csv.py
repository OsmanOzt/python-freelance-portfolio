"""
CSV Cleaner Script — Cleans and Validates CSV Data
===================================================
This script loads a CSV file, normalizes column names and text fields,
removes empty/duplicate rows, flags missing values, and saves clean data.

Dependencies:
    pip install pandas
"""

from pathlib import Path
import pandas as pd

# Script base directory
BASE_DIR = Path(__file__).parent


def clean_csv_data(input_file=BASE_DIR / "data.csv", output_file=BASE_DIR / "cleaned_data.csv"):
    """
    Reads, cleans, and validates CSV data.
    """
    print("=" * 50)
    print("  CSV DATA CLEANER")
    print("=" * 50)

    # 1. Load the CSV dataset
    df = pd.read_csv(input_file)

    print("\nOriginal Data:")
    print(df)
    print(f"Total Rows: {len(df)}")

    # 2. Normalize column names (strip whitespace and convert to lowercase)
    df.columns = df.columns.str.strip().str.lower()

    # 3. Strip whitespace from string/object columns
    for column in df.select_dtypes(include=["object", "string"]).columns:
        df[column] = df[column].str.strip()

    # 4. Drop completely empty rows
    df = df.dropna(how="all")

    # 5. Drop duplicate rows
    df = df.drop_duplicates()

    # 6. Check for missing values in critical columns (e.g., 'name')
    if "name" in df.columns:
        missing_names = df[df["name"].isna()]
        if len(missing_names) > 0:
            print(f"\nWARNING: {len(missing_names)} row(s) missing 'name' field. Dropping these rows:")
            print(missing_names)
            df = df.dropna(subset=["name"])

    print("\nCleaned Data:")
    print(df)
    print(f"Final Row Count: {len(df)}")

    # 7. Export cleaned data to new CSV
    df.to_csv(output_file, index=False)
    print(f"\nClean file saved successfully: {output_file}")
    print("=" * 50)

if __name__ == "__main__":
    clean_csv_data()
