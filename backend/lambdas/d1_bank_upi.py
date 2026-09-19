import json
from typing import Any
import numpy as np

from app.data_gen import d1_bank_upi
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D1: Bank Inflows & UPI Volatility."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)

    seed = get_worker_seed(user_id, "d1_bank_upi")
    rng = np.random.default_rng(seed)

    features = d1_bank_upi.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "bank_data" in demo_profile:
        bd = demo_profile["bank_data"]
        features["bank_avg_monthly_inflow"] = float(bd.get("monthly_inflow", 15000.0))
        features["bank_min_balance_ratio"] = 0.1 if bd.get("bounce_events", 0) > 2 else 0.6

    return {
        "worker": "d1_bank_upi",
        "user_id": user_id,
        "features": features,
    }
