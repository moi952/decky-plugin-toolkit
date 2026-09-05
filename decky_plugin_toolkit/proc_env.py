"""proc_env.py — subprocess environment for plain outbound HTTP calls
(curl, via http_json.py).

Decky's own backend process runs with LD_LIBRARY_PATH pointed at its
bundled libs; that leaks into every subprocess a plugin spawns and makes
system binaries (curl included) load the wrong shared libs, silently
failing. Stripping it before exec is the fix — see decky-nvidia-update's
plugin.py, which hits (and fixes) the exact same issue.

This is intentionally narrow: just enough to run curl reliably. A plugin
that also shells out to flatpak/gearlever/etc. and needs to run as the
deck user, borrow its session D-Bus/XDG env, or drop root privileges
needs its own, more specific process-env module — that's plugin-specific
plumbing, not something every consumer of this toolkit needs.
"""
import asyncio
import os
from typing import List, Optional, Tuple

import decky


def clean_env() -> dict:
    env = os.environ.copy()
    env.pop("LD_LIBRARY_PATH", None)
    return env


async def run(
    args: List[str],
    log_prefix: str,
    timeout: Optional[float] = 60,
) -> Tuple[int, str, str]:
    """Run a subprocess with a clean env, logging the command and any
    failure. Returns (returncode, stdout, stderr); returncode is -1 on
    timeout or on failure to even spawn."""
    decky.logger.info(f"[{log_prefix}] $ {' '.join(args)}")
    try:
        proc = await asyncio.create_subprocess_exec(
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=clean_env(),
        )
        out, err = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        decky.logger.error(f"[{log_prefix}] timed out after {timeout}s: {' '.join(args)}")
        try:
            proc.kill()
            await proc.wait()
        except ProcessLookupError:
            pass
        return -1, "", "timed out"
    except Exception as e:
        decky.logger.error(f"[{log_prefix}] failed to spawn: {e}")
        return -1, "", str(e)

    stdout = out.decode(errors="replace")
    stderr = err.decode(errors="replace")
    if proc.returncode != 0:
        detail = stderr.strip() or stdout.strip()
        decky.logger.error(f"[{log_prefix}] exit {proc.returncode}: {detail[:4000]}")
    return proc.returncode or 0, stdout, stderr
