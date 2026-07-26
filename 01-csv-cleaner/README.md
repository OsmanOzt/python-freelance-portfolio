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
python clean_csv.py
```

## Sample Input (`data.csv`)

```csv
name,age,city
John , 25, New York 
Alice,30,London
John , 25, New York 
,,
Sarah,28,Paris
,22,Berlin
```

## Sample Output

```
==================================================
  CSV DATA CLEANER
==================================================

Original Data:
    name   age       city
0  John     25   New York
1  Alice    30     London
2  John     25   New York
3    NaN   NaN        NaN
4  Sarah    28      Paris
5    NaN    22     Berlin
Total Rows: 6

WARNING: 1 row(s) missing 'name' field. Dropping these rows:
   name  age    city
5  NaN    22  Berlin

Cleaned Data:
    name  age      city
0   John   25  New York
1  Alice   30    London
4  Sarah   28     Paris
Final Row Count: 3

Clean file saved successfully: cleaned_data.csv
==================================================
```

## Dependencies

- pandas
