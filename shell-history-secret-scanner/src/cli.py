import argparse
import sys

from .scanner import scan_history_text


def main() -> None:
    parser = argparse.ArgumentParser(description="Scan a shell history file for plaintext secrets")
    parser.add_argument("history_file", help="Path to a shell history file (bash_history, zsh_history, etc.)")
    args = parser.parse_args()

    with open(args.history_file, encoding="utf-8", errors="ignore") as f:
        text = f.read()

    findings = scan_history_text(text)
    for finding in findings:
        print(f"line {finding.line_number} [{finding.pattern_name}]: {finding.line_excerpt}")

    print(f"\n{len(findings)} suspicious line(s) found.")
    sys.exit(1 if findings else 0)


if __name__ == "__main__":
    main()
