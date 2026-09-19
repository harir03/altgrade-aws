import json
import pytest
from lambdas import (
    d1_bank_upi,
    d2_telecom,
    d3_ecommerce,
    d4_location,
    d5_questionnaire,
    d6_merchant_gst,
    pipeline_orchestrator,
)


def test_individual_lambda_handlers():
    """Verify each individual Lambda returns its designated worker features."""
    user_id = "farmer@altgrade.in"
    event = {"user_id": user_id}

    r1 = d1_bank_upi.handler(event, None)
    assert r1["worker"] == "d1_bank_upi"
    assert "bank_avg_monthly_inflow" in r1["features"]

    r2 = d2_telecom.handler(event, None)
    assert r2["worker"] == "d2_telecom"
    assert "telecom_ontime_rate" in r2["features"]

    r3 = d3_ecommerce.handler(event, None)
    assert r3["worker"] == "d3_ecommerce"
    assert "ecom_purchase_frequency" in r3["features"]

    r4 = d4_location.handler(event, None)
    assert r4["worker"] == "d4_location"
    assert "loc_years_at_current" in r4["features"]

    r5 = d5_questionnaire.handler(event, None)
    assert r5["worker"] == "d5_questionnaire"
    assert "psych_engagement_score" in r5["features"]

    r6 = d6_merchant_gst.handler(event, None)
    assert r6["worker"] == "d6_merchant_gst"
    assert "merchant_filing_regularity" in r6["features"]


def test_seed_determinism():
    """Verify deterministic SHA-256 seeding yields identical outputs."""
    event = {"user_id": "seed_test_applicant_123"}
    out1 = d1_bank_upi.handler(event, None)
    out2 = d1_bank_upi.handler(event, None)
    assert out1["features"] == out2["features"]


def test_partial_consent_omission():
    """Verify partial consent (3 of 6) strictly excludes unconsented features."""
    event = {
        "body": json.dumps({
            "user_id": "farmer@altgrade.in",
            "consented_sources": ["d1_bank", "d2_telecom", "d4_location"]
        })
    }
    resp = pipeline_orchestrator.handler(event, None)
    assert resp["statusCode"] == 200

    data = json.loads(resp["body"])
    assert data["invoked_workers"] == ["d1_bank", "d2_telecom", "d4_location"]
    features = data["features"]

    # Consented feature prefixes must be present
    assert any(k.startswith("bank_") for k in features)
    assert any(k.startswith("telecom_") for k in features)
    assert any(k.startswith("loc_") for k in features)

    # Unconsented feature prefixes must be completely absent
    assert not any(k.startswith("ecom_") for k in features)
    assert not any(k.startswith("psych_") for k in features)
    assert not any(k.startswith("merchant_") for k in features)


def test_dict_ordering_user_id_override():
    """Verify {**body, 'user_id': user_id} ensures explicit user_id wins."""
    event = {
        "body": json.dumps({
            "user_id": "  explicit_clean_user  ",
            "consented_sources": ["d1_bank"]
        })
    }
    resp = pipeline_orchestrator.handler(event, None)
    data = json.loads(resp["body"])
    assert data["user_id"] == "explicit_clean_user"
