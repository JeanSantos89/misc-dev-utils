"""Organizes loose files in a folder into subfolders by rule, logging every move."""

from __future__ import annotations

import csv
import shutil
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Rule:
    """Files matching any of `extensions` or `keywords` (in the filename) go into `target_subfolder`."""

    target_subfolder: str
    extensions: tuple[str, ...] = ()
    keywords: tuple[str, ...] = ()

    def matches(self, filename: str) -> bool:
        lower = filename.lower()
        if any(lower.endswith(ext) for ext in self.extensions):
            return True
        return any(keyword.lower() in lower for keyword in self.keywords)


DEFAULT_RULES: list[Rule] = [
    Rule("Images", extensions=(".png", ".jpg", ".jpeg", ".gif", ".webp")),
    Rule("Documents", extensions=(".pdf", ".docx", ".txt", ".md")),
    Rule("Spreadsheets", extensions=(".xlsx", ".csv")),
    Rule("Archives", extensions=(".zip", ".rar", ".7z")),
]


def organize(root: Path, rules: list[Rule], dry_run: bool = True) -> list[tuple[Path, Path]]:
    """Moves every loose file in `root` (non-recursive) into a matching rule's subfolder.

    Returns the list of (source, destination) pairs actually moved (or that
    would be moved, when dry_run=True).
    """
    moves: list[tuple[Path, Path]] = []

    for entry in root.iterdir():
        if entry.is_dir():
            continue
        rule = next((r for r in rules if r.matches(entry.name)), None)
        if rule is None:
            continue

        destination_dir = root / rule.target_subfolder
        destination = destination_dir / entry.name
        moves.append((entry, destination))

        if not dry_run:
            destination_dir.mkdir(exist_ok=True)
            shutil.move(str(entry), str(destination))

    return moves


def write_log(moves: list[tuple[Path, Path]], log_path: Path) -> None:
    with open(log_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for source, destination in moves:
            writer.writerow([source, destination])
