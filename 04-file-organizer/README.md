# File Organizer

A Python script that automatically organizes files in a directory by sorting them into subfolders based on their file extensions. Includes a built-in test mode that creates sample files so you can safely try it without affecting your real files.

## Features

- Sorts files into categorized subfolders (Images, PDF, Word, Excel, etc.)
- Supports 30+ file extensions out of the box
- Easily extensible — add new extensions by editing the mapping dictionary
- Handles filename conflicts (auto-renames duplicates)
- Includes a safe test mode with sample files
- Provides a detailed summary report after organizing

## Usage

```bash
cd 04-file-organizer
python organize_files.py
```

Running the script creates a `sample_folder/` directory with sample files, then organizes them automatically.

## Sample Output

```
--- File Organizer - Test Mode ---

[TEST ENV] Creating sample files in: ...\sample_folder
----------------------------------------
  [+] Created: report.pdf
  [+] Created: resume.docx
  [+] Created: photo1.jpg
  [+] Created: photo2.png
  ...

--- Organizing Files... ---

  [>] photo1.jpg -> Images/
  [>] photo2.png -> Images/
  [>] report.pdf -> PDF/
  [>] resume.docx -> Word/
  [>] spreadsheet.xlsx -> Excel/
  ...

============================================================
  SUMMARY REPORT
============================================================

  Total Files Moved: 14

  Distribution by Folder:
  ------------------------------
     Archives        -> 1 file(s)
     Audio           -> 1 file(s)
     Data            -> 2 file(s)
     Excel           -> 1 file(s)
     Images          -> 3 file(s)
     Others          -> 1 file(s)
     PDF             -> 1 file(s)
     PowerPoint      -> 1 file(s)
     Python          -> 1 file(s)
     Text            -> 1 file(s)
     Video           -> 1 file(s)
     Word            -> 1 file(s)
============================================================
```

## Supported File Types

| Category | Extensions |
|----------|-----------|
| Images | .jpg, .jpeg, .png, .gif, .bmp, .svg |
| PDF | .pdf |
| Word | .doc, .docx |
| Excel | .xls, .xlsx |
| PowerPoint | .ppt, .pptx |
| Text | .txt |
| Python | .py |
| JavaScript | .js |
| Web | .html, .css |
| Data | .json, .csv |
| Archives | .zip, .rar, .7z |
| Audio | .mp3, .wav |
| Video | .mp4, .avi, .mkv |

Files with unrecognized extensions are moved to an `Others/` folder.

## How It Works

1. Scans all files in the target directory
2. Looks up each file's extension in the mapping dictionary
3. Creates the target subfolder if it doesn't exist
4. Moves the file (handles name conflicts automatically)
5. Prints a summary of all operations

## Customization

To organize your own folders, import the function in Python:

```python
from organize_files import organize_directory
organize_directory("C:\\Users\\your_name\\Downloads")
```

## Dependencies

None — uses only Python standard library modules (`os`, `shutil`, `pathlib`).
