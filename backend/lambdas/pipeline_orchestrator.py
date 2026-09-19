import json
from typing import Any

from lambdas import (
    d1_bank_upi,
    d2_telecom,
    d3_ecommerce,
    d4_location,
    d5_questionnaire,
    d6_merchant_gst,
)

WORKER_MAP = {
    "d1_bank": d1_bank_upi.handler,
    "d2_telecom": d2_telecom.handler,
    "d3_ecommerce": d3_ecommerce.handler,
    "d4_location": d4_location.handler,
    "d5_questionnaire": d5_questionnaire.handler,
    "d6_merchant_gst": d6_merchant_gst.handler,
}


def handler(event: dict[str, Any], context: Any = None) -> dict[str, Any]:
    """
    API Gateway Coordinator Lambda for SAM Local.
    Fans out execution strictly across consented D1-D6 workers and merges features.
    """
    if isinstance(event.get("body"), str):
        try:
            body = json.loads(event["body"])
        except Exception:
            body = {}
    elif isinstance(event.get("body"), dict):
        body = event["body"]
    else:
        body = event or {}

    user_id = str(body.get("user_id") or "anonymous").strip()
    consented_sources = body.get("consented_sources") or []

    # Prepare worker payload ensuring explicit sanitized user_id overrides any stale value
    worker_payload = {**body, "user_id": user_id}

    consolidated_features: dict[str, Any] = {}
    invoked_workers: list[str] = []

    # Strictly fan out ONLY to consented worker Lambdas.
    # Unconsented workers are never called and their features remain absent.
    for source in consented_sources:
        if source in WORKER_MAP:
            worker_fn = WORKER_MAP[source]
            worker_output = worker_fn(worker_payload, context)
            if isinstance(worker_output, dict) and "features" in worker_output:
                consolidated_features.update(worker_output["features"])
                invoked_workers.append(source)

    response_payload = {
        "status": "success",
        "user_id": user_id,
        "consented_sources": consented_sources,
        "invoked_workers": invoked_workers,
        "features": consolidated_features,
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(response_payload),
    }
