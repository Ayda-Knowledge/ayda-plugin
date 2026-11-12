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
# A plain YAML scalar cannot hold ": " or " #", nor start with an indicator.
# Claude Code reads such a line, but the plugin directory's strict parser
# does not, and holds the release for review.
YAML_INDICATORS = tuple("-?:,[]{}#&*!|>'\"%@`")
ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "evals" / "mocks" / "ayda" / "_tools.json"
REVIEWED = Path(__file__).resolve().parent / "skill-vocabulary.txt"
# A skill names tools, arguments and result fields in backticks. Core owns
# those names; the tool list and the mocks are this repository's copies.
CODE = re.compile(r"`([^`\n]+)`")
WORD = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
TAGS = re.compile(r"^tags:\s*\[([^\]]*)\]\s*$", re.MULTILINE)


def plain_scalar_error(value: str) -> str | None:
    if ": " in value or value.endswith(":"):
        return "contains ': '"
    if " #" in value:
        return "contains ' #'"
    if value.startswith(YAML_INDICATORS):
        return f"starts with {value[0]!r}"
    return None


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
        error = plain_scalar_error(value.strip())
        if error:
            raise ValueError(f"frontmatter {key.strip()} is not valid YAML: it {error}; rephrase it")
        fields[key.strip()] = value.strip()
    return fields


def contract_names() -> tuple[set[str], set[str]]:
    """The words the contract copies hold, and the reviewed names."""
    words = set(EXPECTED) | {"ayda"}
    words.update(WORD.findall(TOOLS.read_text(encoding="utf-8")))
    for mock in (ROOT / "evals").glob("**/mocks/ayda/*.md"):
        words.update(WORD.findall(mock.read_text(encoding="utf-8")))
    reviewed = set()
    for line in REVIEWED.read_text(encoding="utf-8").splitlines():
        if line.strip() and not line.startswith("#"):
            reviewed.add(line.split(" # ", 1)[0].strip())
    return words, reviewed


def unknown_names(body: str, words: set[str], reviewed: set[str]) -> list[str]:
    """Backticked names that no contract copy and no reviewed line holds.

    `check.flagged` passes when each part is known, and `project:` when
    `project` is."""
    unknown = []
    for name in sorted(set(CODE.findall(body))):
        if name in reviewed or name in words:
            continue
        parts = [part for part in name.rstrip(":").split(".") if part]
        if parts and all(part in words or part in reviewed for part in parts):
            continue
        unknown.append(name)
    return unknown


def eval_tags() -> set[str]:
    """Every tag that an eval case carries."""
    tags: set[str] = set()
    for prompt in (ROOT / "evals").glob("*/prompt.md"):
        match = TAGS.search(prompt.read_text(encoding="utf-8"))
        if match:
            tags.update(tag.strip() for tag in match.group(1).split(","))
    return tags


def validate(package: Path, words: set[str], reviewed: set[str]) -> list[str]:
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
    body = skill.read_text(encoding="utf-8").split("---\n", 2)[-1]
    for name in unknown_names(body, words, reviewed):
        errors.append(
            f"names `{name}`, which no tool, mock or scripts/skill-vocabulary.txt line holds"
        )
    return errors


def main() -> int:
    root = ROOT / "plugin" / "skills"
    found = {path.name for path in root.iterdir() if path.is_dir()}
    failures: list[str] = []
    if found != EXPECTED:
        failures.append(f"skills/ contains {sorted(found)}, expected {sorted(EXPECTED)}")
    for needed in (TOOLS, REVIEWED):
        if not needed.is_file():
            print(f"missing {needed.relative_to(ROOT)}: the contract check needs it", file=sys.stderr)
            return 1
    words, reviewed = contract_names()
    tags = eval_tags()
    for name in sorted(EXPECTED & found):
        failures.extend(f"{name}: {error}" for error in validate(root / name, words, reviewed))
        if name not in tags:
            failures.append(f"{name}: no eval case under evals/ has the tag {name!r}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print("Portable agent skills passed: " + ", ".join(sorted(EXPECTED)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
