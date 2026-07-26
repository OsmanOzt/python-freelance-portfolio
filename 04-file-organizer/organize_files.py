"""
File Organizer — Automatically Sorts Files into Subdirectories
================================================================
This script scans a specified directory and moves files into organized
subfolders based on their file extensions.

Includes a built-in test mode to generate demo files and verify functionality safely.

Standard Library Dependencies (no extra installation needed):
    - os
    - shutil
    - pathlib
"""

import os
import shutil
from pathlib import Path

# Mapping of file extensions to target category folder names
EXTENSION_MAP = {
    # Image files
    ".jpg": "Images",
    ".jpeg": "Images",
    ".png": "Images",
    ".gif": "Images",
    ".bmp": "Images",
    ".svg": "Images",

    # Document files
    ".pdf": "PDF",
    ".docx": "Word",
    ".doc": "Word",
    ".xlsx": "Excel",
    ".xls": "Excel",
    ".pptx": "PowerPoint",
    ".ppt": "PowerPoint",
    ".txt": "Text",

    # Code & Data files
    ".py": "Python",
    ".js": "JavaScript",
    ".html": "Web",
    ".css": "Web",
    ".json": "Data",
    ".csv": "Data",

    # Archives
    ".zip": "Archives",
    ".rar": "Archives",
    ".7z": "Archives",

    # Audio & Video
    ".mp3": "Audio",
    ".wav": "Audio",
    ".mp4": "Video",
    ".avi": "Video",
    ".mkv": "Video",
}

DEFAULT_FOLDER = "Others"


def create_test_environment(target_dir):
    """
    Creates a temporary test folder with sample files for safe testing.

    Args:
        target_dir (str): Path to create the test folder.
    """
    test_path = Path(target_dir)
    test_path.mkdir(exist_ok=True)

    sample_files = [
        "report.pdf",
        "resume.docx",
        "photo1.jpg",
        "photo2.png",
        "wallpaper.jpeg",
        "spreadsheet.xlsx",
        "notes.txt",
        "script.py",
        "dataset.csv",
        "presentation.pptx",
        "music.mp3",
        "video.mp4",
        "archive.zip",
        "unknown_file.xyz",  # Will move to 'Others'
    ]

    print(f"[TEST ENV] Creating sample files in: {test_path}")
    print("-" * 40)

    for filename in sample_files:
        filepath = test_path / filename
        filepath.write_text(f"Sample test content for: {filename}", encoding="utf-8")
        print(f"  [+] Created: {filename}")

    print(f"\nGenerated {len(sample_files)} test files.\n")
    return str(test_path)


def organize_directory(directory_path):
    """
    Moves files in the given directory to categorized subfolders.

    Args:
        directory_path (str): Target directory path.

    Returns:
        dict: Move summary (folder -> count).
    """
    folder = Path(directory_path)

    if not folder.exists() or not folder.is_dir():
        print(f"[ERROR] Directory '{directory_path}' does not exist.")
        return {}

    print("=" * 60)
    print("  FILE ORGANIZER")
    print("=" * 60)
    print(f"\nTarget Directory: {folder}")

    transfer_counter = {}
    total_moved = 0
    skipped_folders = 0

    for item in folder.iterdir():
        if item.is_dir():
            skipped_folders += 1
            continue

        ext = item.suffix.lower()
        target_folder_name = EXTENSION_MAP.get(ext, DEFAULT_FOLDER)
        target_folder = folder / target_folder_name
        target_folder.mkdir(exist_ok=True)

        target_filepath = target_folder / item.name

        # Prevent overwriting if file already exists
        if target_filepath.exists():
            counter = 1
            while target_filepath.exists():
                new_name = f"{item.stem}_{counter}{item.suffix}"
                target_filepath = target_folder / new_name
                counter += 1

        shutil.move(str(item), str(target_filepath))

        transfer_counter[target_folder_name] = transfer_counter.get(target_folder_name, 0) + 1
        total_moved += 1

        print(f"  [>] {item.name} -> {target_folder_name}/")

    # Output Summary
    print("\n" + "=" * 60)
    print("  SUMMARY REPORT")
    print("=" * 60)

    if total_moved == 0:
        print("  No files to organize.")
    else:
        print(f"\n  Total Files Moved: {total_moved}")
        if skipped_folders > 0:
            print(f"  Subdirectories Skipped: {skipped_folders}")
        print(f"\n  Distribution by Folder:")
        print("  " + "-" * 30)
        for folder_name, count in sorted(transfer_counter.items()):
            print(f"     {folder_name:15s} -> {count} file(s)")

    print("\n" + "=" * 60)
    return transfer_counter


def main():
    """Main execution: creates demo environment and runs file organizer."""
    script_dir = Path(__file__).parent
    test_dir = script_dir / "sample_folder"

    print("\n--- File Organizer - Test Mode ---\n")

    test_path = create_test_environment(str(test_dir))

    print("\n--- Organizing Files... ---\n")
    organize_directory(test_path)

    print("\nGenerated Folder Structure:")
    print("-" * 40)
    for item in sorted(Path(test_path).iterdir()):
        if item.is_dir():
            file_count = len(list(item.iterdir()))
            print(f"  [{item.name}/] ({file_count} files)")
            for file in sorted(item.iterdir()):
                print(f"      -- {file.name}")

    print("\nTest completed successfully!")
    print(f"   Review test folder: {test_dir}")
    print("   To use on a real folder:")
    print('   organize_directory("C:\\\\Users\\\\your_username\\\\Downloads")')


if __name__ == "__main__":
    main()
