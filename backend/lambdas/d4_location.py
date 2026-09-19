import json
from typing import Any
import numpy as np

from app.data_gen import d4_location
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile

METRO_CITIES = {
    "delhi", "mumbai", "bangalore", "bengaluru", "chennai", "kolkata",
    "hyderabad", "pune", "ahmedabad", "jaipur", "lucknow", "surat",
    "kanpur", "nagpur", "indore", "thane", "bhopal", "visakhapatnam",
    "patna", "vadodara", "ghaziabad", "ludhiana", "coimbatore", "kochi",
    "chandigarh", "gurgaon", "gurugram", "noida", "navi mumbai",
}


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D4: Geolocation Stability & Residence Tenure."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)
    location_history = payload.get("location_history")

    seed = get_worker_seed(user_id, "d4_location")
    rng = np.random.default_rng(seed)

    features = d4_location.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "location_data" in demo_profile:
        ld = demo_profile["location_data"]
        features["loc_is_metro"] = 1.0 if ld.get("city") in ["Bengaluru", "Mumbai", "Delhi"] else 0.0
        if user_id.lower() in ("farmer@altgrade.in", "farmer"):
            features["loc_years_at_current"] = 34.0
            features["loc_address_changes_24m"] = 0.0
            features["loc_owns_home"] = 1.0
        else:
            features["loc_years_at_current"] = 5.0
            features["loc_address_changes_24m"] = 0.0

    if location_history and len(location_history) > 0:
        current_year = 2026
        current_entry = location_history[0]
        current_from = current_entry.get("fromYear", current_year)
        years_at_current = max(0, current_year - current_from)
        address_changes = max(0, len(location_history) - 1)

        place_name = current_entry.get("place", "").lower()
        is_metro = any(city in place_name for city in METRO_CITIES)

        features["loc_address_changes_24m"] = min(address_changes, 5)
        features["loc_years_at_current"] = years_at_current
        features["loc_is_metro"] = 1 if is_metro else 0
        features["loc_owns_home"] = 1 if years_at_current >= 5 else 0

    return {
        "worker": "d4_location",
        "user_id": user_id,
        "features": features,
    }
