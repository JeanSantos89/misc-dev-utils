# desktop-file-organizer

Sorts loose files in a folder into subfolders (Images, Documents,
Spreadsheets, Archives) by extension or filename keyword, logging every
move to a CSV so it's always reversible.

## Why

Downloads and Desktop folders accumulate hundreds of loose files with no
structure. A small rule-based sort, run on demand, keeps them navigable
without needing a cloud storage product or background daemon — and the
CSV log means any move can be undone or audited later.

## Usage

```bash
python -m src.cli ~/Downloads            # dry run, prints what would move
python -m src.cli ~/Downloads --apply    # actually moves files, logs to _organize-log.csv
```

Rules are a plain list in `organizer.py` — add your own `Rule(target,
extensions=..., keywords=...)` entries as needed.

## Status

Generalization of a personal file-organization habit (sorting local
folders by subject with a CSV move log). Reimplemented from scratch as a
generic, rule-based script, no original folder structure or file names
included.
