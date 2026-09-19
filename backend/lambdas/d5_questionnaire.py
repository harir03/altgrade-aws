import json
from typing import Any
from collections import Counter
import numpy as np

from app.data_gen import d5_questionnaire
from lambdas._common import get_worker_seed, get_risk_profile, load_demo_profile


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """Lambda handler for Worker D5: Psychometric Financial Discipline."""
    if isinstance(event.get("body"), str):
        payload = json.loads(event["body"])
    else:
        payload = event or {}

    user_id = payload.get("user_id", "anonymous")
    phone = payload.get("phone")
    risk_profile = payload.get("profile") or get_risk_profile(user_id)
    answers = payload.get("answers")
    time_taken_ms = payload.get("time_taken_ms")
    changes_count = payload.get("changes_count")

    seed = get_worker_seed(user_id, "d5_questionnaire")
    rng = np.random.default_rng(seed)

    features = d5_questionnaire.generate(rng, risk_profile)

    demo_profile = load_demo_profile(user_id, phone)
    if demo_profile and "questionnaire_data" in demo_profile:
        qd = demo_profile["questionnaire_data"]
        features["psych_engagement_score"] = float(qd.get("cfpb_score", 60))
        features["psych_straight_line_ratio"] = 1.0 if qd.get("straight_line_detected") else 0.0
        features["psych_consistency"] = 0.9 if qd.get("hesitation_flags", 0) == 0 else 0.6

    if answers:
        try:
            ans_values = [int(v) for v in answers.values()]
            ans_sum = sum(ans_values)
            base_psych = float(max(35, 95 - (ans_sum / 45) * 60))

            time_sec = 120.0
            time_penalty = 0.0
            time_consistency_mod = 0.0
            if time_taken_ms is not None:
                time_sec = float(time_taken_ms) / 1000.0
                if time_sec < 15.0:
                    time_penalty = 40.0
                    time_consistency_mod = -0.5
                elif time_sec < 30.0:
                    time_penalty = 15.0
                    time_consistency_mod = -0.2
                elif 35.0 <= time_sec <= 120.0:
                    time_penalty = -5.0

            straight_line_ratio = 0.0
            if len(ans_values) >= 10:
                counts = Counter(ans_values)
                most_common_count = counts.most_common(1)[0][1]
                straight_line_ratio = float(most_common_count) / len(ans_values)

            straight_line_penalty = 35.0 if straight_line_ratio >= 0.73 else 0.0

            psych_score = float(max(30.0, min(100.0, base_psych - time_penalty - straight_line_penalty)))
            features["psych_engagement_score"] = psych_score
            features["psych_mean_answer"] = float(np.mean(ans_values)) if ans_values else 1.5
            features["psych_std_answer"] = float(np.std(ans_values)) if ans_values else 0.5

            base_consistency = 0.95
            if changes_count is not None:
                if changes_count > 8:
                    base_consistency = 0.50
                elif changes_count > 4:
                    base_consistency = 0.70
                elif changes_count > 2:
                    base_consistency = 0.85

            features["psych_consistency"] = float(max(0.2, min(1.0, base_consistency + time_consistency_mod)))
            features["psych_straight_line_ratio"] = straight_line_ratio
            features["psych_completion_time_sec"] = time_sec
        except Exception:
            pass

    return {
        "worker": "d5_questionnaire",
        "user_id": user_id,
        "features": features,
    }
