#!/usr/bin/env python3
"""Copy the Ayda MCP server's tool contract into evals/mocks/ayda/_tools.json.

Core owns the tool names, descriptions and input schemas. This script builds
core's MCP runtime with no company name, lists its tools, and writes the graph
tools to the mock. It leaves out the store tools (Shopify, WooCommerce and the
store query tools): an installation lists them only when it connects a store,
and the fictional eval company has none.

Run it with the Python of a core backend environment, from that backend
directory, because it imports core:

    cd <ayda-core>/backend
    REQUIRE_SECURE_SECRETS=false .venv/bin/python <plugin>/scripts/refresh-tools-mock.py
    REQUIRE_SECURE_SECRETS=false .venv/bin/python <plugin>/scripts/refresh-tools-mock.py --check

`--check` writes nothing. It prints each difference and exits 1 when the mock
does not equal the server.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

MOCK = Path(__file__).resolve().parent.parent / "evals" / "mocks" / "ayda" / "_tools.json"
# A fixed test key: the runtime needs one to start, and no secret is read.
TOKEN_KEY = "MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA="


async def server_tools() -> list[dict]:
    sys.path.insert(0, os.getcwd())
    for name in ("MCP_COMPANY_NAME", "MCP_COMPANY_ALIASES"):
        os.environ.pop(name, None)
    from app.config import Settings
    from app.core import live_tools, query_maps
    from app.mcp.server import build_runtime

    settings = Settings(
        _env_file=None,
        VAULT_URL="http://localhost:3000",
        PUBLIC_API_URL="http://localhost:8000",
        ACCESS_CONTROL_MODE="enforce",
        INTEGRATION_TOKEN_KEY=TOKEN_KEY,
        MCP_ENABLED=True,
        REQUIRE_SECURE_SECRETS=False,
    )
    runtime = build_runtime(settings)
    store = {enabled.tool.name for enabled in live_tools.enabled()}
    store |= {qm.tool for qm in query_maps.maps().values()}
    store.add(query_maps.DESCRIBE_TOOL)
    return [
        {"name": tool.name, "description": tool.description, "inputSchema": tool.input_schema}
        for tool in await runtime.server.list_tools()
        if tool.name not in store
    ]


def differences(mock: list[dict], live: list[dict]) -> list[str]:
    old = {tool["name"]: tool for tool in mock}
    new = {tool["name"]: tool for tool in live}
    found = [f"missing from the mock: {name}" for name in new if name not in old]
    found += [f"not on the server: {name}" for name in old if name not in new]
    for name in sorted(old.keys() & new.keys()):
        for field in ("description", "inputSchema"):
            if old[name][field] != new[name][field]:
                found.append(f"{name}: {field} differs")
    return found


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="compare only; write nothing")
    args = parser.parse_args()
    live = asyncio.run(server_tools())
    if args.check:
        found = differences(json.loads(MOCK.read_text())["tools"], live)
        for line in found:
            print(line)
        print(f"{len(live)} server tools; {len(found)} differences")
        return 1 if found else 0
    MOCK.write_text(json.dumps({"tools": live}, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {len(live)} tools to {MOCK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
