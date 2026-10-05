"""Scans a shell history file for commands that likely embed a plaintext secret."""

from __future__ import annotations

import re
from dataclasses import dataclass

SECRET_PATTERNS: dict[str, re.Pattern[str]] = {
    "aws_access_key": re.compile(r"AKIA[0-9A-Z]{16}"),
    "generic_api_key_flag": re.compile(r"--(api[-_]?key|token|secret)[=\s]+['\"]?[A-Za-z0-9_\-\.]{12,}"),
    "bearer_token": re.compile(r"Bearer\s+[A-Za-z0-9_\-\.]{12,}"),
    "inline_env_assignment": re.compile(r"\b(?:[A-Z_]*(?:TOKEN|SECRET|KEY|PASSWORD)[A-Z_]*)=[^\s]{8,}"),
    "basic_auth_url": re.compile(r"https?://[^:/\s]+:[^@/\s]{6,}@"),
}


@dataclass
class Finding:
    line_number: int
    pattern_name: str
    line_excerpt: str


def scan_history_text(text: str) -> list[Finding]:
    """Returns one finding per line that matches a known secret-shaped pattern.

    This is a prevention-focused heuristic scanner, not a secret validator:
    it flags *shape*, not confirmed live credentials. Expect some false
    positives; the point is to catch the habit of pasting secrets inline
    before it becomes a stored, unencrypted history entry.
    """
    findings: list[Finding] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        for pattern_name, pattern in SECRET_PATTERNS.items():
            if pattern.search(line):
                excerpt = line if len(line) <= 120 else line[:117] + "..."
                findings.append(Finding(line_number=line_number, pattern_name=pattern_name, line_excerpt=excerpt))
    return findings
