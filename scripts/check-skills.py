#!/usr/bin/env python3
"""Validate the Ayda plugin's separately versioned portable skills."""

from __future__ import annotations

import re
import sys
from pathlib import Path

EXPECTED = {
    "ayda-daily-brief",
    "ayda-decision-trace",
    "ayda-fact-check",
    "ayda-guide",
    "ayda-loop-sweep",
    "ayda-onboarding",
    "ayda-remember",
}
SEMVER = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")


def frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("SKILL.md must start with YAML frontmatter")
    try:
        block = text.split("---\n", 2)[1]
    except IndexError as exc:
        raise ValueError("SKILL.md frontmatter is not closed") from exc
    fields: dict[str, str] = {}
    for line in block.splitlines():
        key, separator, value = line.partition(":")
        if not separator or not value.strip():
            raise ValueError(f"invalid frontmatter line: {line!r}")
        fields[key.strip()] = value.strip()
    return fields


def validate(package: Path) -> list[str]:
    errors: list[str] = []
    skill = package / "SKILL.md"
    version = package / "VERSION"
    if not skill.is_file() or not version.is_file():
        return ["requires SKILL.md and VERSION"]
    try:
        fields = frontmatter(skill.read_text(encoding="utf-8"))
    except ValueError as exc:
        errors.append(str(exc))
        fields = {}
    if set(fields) != {"name", "description"}:
        errors.append("portable frontmatter must contain only name and description")
    if fields.get("name") != package.name:
        errors.append("frontmatter name must match the package directory")
    if len(fields.get("description", "")) > 1024:
        errors.append("description exceeds 1024 characters")
    if not SEMVER.fullmatch(version.read_text(encoding="utf-8").strip()):
        errors.append("VERSION must contain a semantic version")
    text = skill.read_text(encoding="utf-8").casefold()
    forbidden = ("http://", "https://", "bearer ", "api key", "access token")
    for value in forbidden:
        if value in text:
            errors.append(f"must not contain installation or credential value: {value!r}")
    if "configured `ayda` mcp server" not in text:
        errors.append("must use the configured ayda MCP server")
    return errors


def main() -> int:
    root = Path(__file__).resolve().parents[1] / "plugin" / "skills"
    found = {path.name for path in root.iterdir() if path.is_dir()}
    failures: list[str] = []
    if found != EXPECTED:
        failures.append(f"skills/ contains {sorted(found)}, expected {sorted(EXPECTED)}")
    for name in sorted(EXPECTED & found):
        failures.extend(f"{name}: {error}" for error in validate(root / name))
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Portable agent skills passed: " + ", ".join(sorted(EXPECTED)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
