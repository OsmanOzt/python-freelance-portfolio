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
python duzenle.py
```

Running the script creates a `test_karisik/` folder with sample files, then organizes them automatically.

## Sample Output

```
--- Dosya Duzenleyici - Test Modu ---

[KLASOR] Test klasoru olusturuluyor: ...\test_karisik
----------------------------------------
  [+] Olusturuldu: rapor.pdf
  [+] Olusturuldu: ozgecmis.docx
  [+] Olusturuldu: foto1.jpg
  [+] Olusturuldu: foto2.png
  ...

--- Dosyalar duzenleniyor... ---

  [>] foto1.jpg -> Resimler/
  [>] foto2.png -> Resimler/
  [>] rapor.pdf -> PDF/
  [>] ozgecmis.docx -> Word/
  [>] tablo.xlsx -> Excel/
  ...

============================================================
  OZET RAPOR
============================================================

  Toplam tasinan dosya: 14

  Klasor bazli dagilim:
  ------------------------------
     Arsiv           -> 1 dosya
     Excel           -> 1 dosya
     Metin           -> 1 dosya
     PDF             -> 1 dosya
     Resimler        -> 3 dosya
     Word            -> 1 dosya
     ...
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
| Archive | .zip, .rar, .7z |
| Music | .mp3, .wav |
| Video | .mp4, .avi, .mkv |

Files with unrecognized extensions are moved to a `Diger/` (Other) folder.

## How It Works

1. Scans all files in the target directory
2. Looks up each file's extension in the mapping dictionary
3. Creates the target subfolder if it doesn't exist
4. Moves the file (handles name conflicts automatically)
5. Prints a summary of all operations

## Customization

To organize your own folders, import the function in Python:

```python
from duzenle import dosyalari_duzenle
dosyalari_duzenle("C:\\Users\\your_name\\Downloads")
```

## Dependencies

None — uses only Python standard library modules (`os`, `shutil`, `pathlib`).
