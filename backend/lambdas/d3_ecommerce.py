import json
from typing import Any
import numpy as np

from app.data_gen import d3_ecommerce
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D3: E-Commerce Basket & Return Ratios."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)

    seed = get_worker_seed(user_id, "d3_ecommerce")
    rng = np.random.default_rng(seed)

    features = d3_ecommerce.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "ecommerce_data" in demo_profile:
        ed = demo_profile["ecommerce_data"]
        features["ecom_purchase_frequency"] = int(ed.get("order_count_6m", 12))
        features["ecom_return_rate"] = float(ed.get("return_rate", 0.05))
        features["ecom_avg_monthly_spend"] = float(ed.get("total_spend_6m", 12000.0)) / 6.0
        features["ecom_account_age_months"] = int(ed.get("oldest_order_days", 365) / 30.0)
        if user_id.lower() in ("farmer@altgrade.in", "farmer"):
            features["ecom_return_rate"] = 0.0

    return {
        "worker": "d3_ecommerce",
        "user_id": user_id,
        "features": features,
    }
