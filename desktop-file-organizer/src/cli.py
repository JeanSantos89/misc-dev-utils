import argparse
from pathlib import Path

from .organizer import DEFAULT_RULES, organize, write_log


def main() -> None:
    parser = argparse.ArgumentParser(description="Organize loose files in a folder by extension/keyword rules")
    parser.add_argument("folder", help="Folder to organize (non-recursive)")
    parser.add_argument("--apply", action="store_true", help="Actually move files (default is dry-run)")
    parser.add_argument("--log", default="_organize-log.csv", help="CSV log file name, written inside the folder")
    args = parser.parse_args()

    root = Path(args.folder)
    moves = organize(root, DEFAULT_RULES, dry_run=not args.apply)

    for source, destination in moves:
        print(f"{'MOVED' if args.apply else 'WOULD MOVE'}: {source.name} -> {destination.relative_to(root)}")

    if args.apply and moves:
        write_log(moves, root / args.log)

    print(f"\n{len(moves)} file(s) {'moved' if args.apply else 'would be moved'}.")


if __name__ == "__main__":
    main()
