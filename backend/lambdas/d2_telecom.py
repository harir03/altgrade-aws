import json
from typing import Any
import numpy as np

from app.data_gen import d2_telecom
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D2: Telecom Utility & Recharge Cadence."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)

    seed = get_worker_seed(user_id, "d2_telecom")
    rng = np.random.default_rng(seed)

    features = d2_telecom.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "telecom_data" in demo_profile:
        td = demo_profile["telecom_data"]
        features["telecom_ontime_rate"] = float(td.get("ontime_payment_rate", 0.9))
        features["telecom_plan_value"] = float(td.get("monthly_average_spend", 399.0))
        features["telecom_active_months"] = int(td.get("recharge_frequency_days", 28) * 1.5)
        if user_id.lower() in ("farmer@altgrade.in", "farmer"):
            features["telecom_missed_payments"] = 0
            features["telecom_ontime_rate"] = 1.0
        else:
            features["telecom_missed_payments"] = 0 if td.get("ontime_payment_rate", 0.9) > 0.9 else 2

    return {
        "worker": "d2_telecom",
        "user_id": user_id,
        "features": features,
    }
