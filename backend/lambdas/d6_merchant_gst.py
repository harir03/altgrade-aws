import json
from typing import Any
import numpy as np

from app.data_gen import d6_merchant_gst
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D6: GST Merchant Filings & Footprint."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)

    seed = get_worker_seed(user_id, "d6_merchant_gst")
    rng = np.random.default_rng(seed)

    features = d6_merchant_gst.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "gst_data" in demo_profile:
        gd = demo_profile["gst_data"]
        features["merchant_has_gst"] = 1 if gd.get("gstin_valid") else 0
        features["merchant_filing_regularity"] = float(gd.get("filing_promptness_rate", 0.9))
        features["merchant_months_operating"] = int(gd.get("operating_months", 24))
        features["merchant_annual_turnover"] = 1500000.0 if gd.get("gstin_valid") else 0.0

    return {
        "worker": "d6_merchant_gst",
        "user_id": user_id,
        "features": features,
    }
