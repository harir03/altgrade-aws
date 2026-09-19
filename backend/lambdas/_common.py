import hashlib
import json
from pathlib import Path
from typing import Any
import numpy as np

PROFILES = ["low", "medium", "high"]


def get_worker_seed(user_id: str, worker_name: str) -> int:
    """Generate a deterministic 32-bit integer seed using SHA-256 (independent of PYTHONHASHSEED)."""
    digest = hashlib.sha256(f"{user_id}:{worker_name}".encode("utf-8")).hexdigest()
    return int(digest, 16) % (2**32)


def get_risk_profile(user_id: str) -> str:
    """Deterministically assign low/medium/high profile from user_id using SHA-256."""
    seed = int(hashlib.sha256(f"{user_id}:risk_profile".encode("utf-8")).hexdigest(), 16)
    return PROFILES[seed % len(PROFILES)]


def load_demo_profile(user_id: str, phone: str | None = None) -> dict[str, Any] | None:
    """Locate and load demo_data/profiles.json across local dev and SAM Lambda container environments."""
    candidate_paths = [
        Path("/var/task/demo_data/profiles.json"),
        Path(__file__).resolve().parents[1] / "demo_data" / "profiles.json",
        Path(__file__).resolve().parents[2] / "demo_data" / "profiles.json",
        Path.cwd() / "demo_data" / "profiles.json",
        Path.cwd() / "backend" / "demo_data" / "profiles.json",
    ]
    for p in candidate_paths:
        if p.exists():
            try:
                all_profiles = json.loads(p.read_text(encoding="utf-8"))
                email_lower = user_id.lower()
                if email_lower in ("testhari@altgrade.in", "hari@altgrade.in", "hari"):
                    search_id = "hari"
                elif email_lower in ("farmer@altgrade.in", "farmer"):
                    search_id = "farmer"
                elif email_lower in ("msme@altgrade.in", "msme"):
                    search_id = "msme"
                else:
                    search_id = email_lower

                for p_name, p_val in all_profiles.items():
                    if p_name.lower() == search_id or (phone and p_val.get("phone") == phone) or (phone and p_val.get("mobile") == phone):
                        return p_val
            except Exception:
                pass
    return None
