"""
Automated Staged Git Commits for AltGrade (AWS Build It Track).
Supports:
  1. Live Background Timer Mode (--mode live):
     Commits one feature at a time with a randomized timer (default 1 to 2 hours,
     or configurable with --min-minutes / --max-minutes).
  2. Instant Distributed Timestamps Mode (--mode spread):
     Creates all 65+ commits immediately, with realistic randomized timestamps
     distributed across today using Git author and committer dates.
"""

import argparse
import datetime
import os
import random
import subprocess
import sys
import time

COMMIT_STAGES = [
    # Phase 1: Tooling & Scaffolding
    (["package.json", "package-lock.json", ".gitignore"], "chore: initialize project workspace and package manifests"),
    ([".env.example"], "chore: add environment variables template (.env.example)"),
    (["Dockerfile", "docker-compose.yml"], "build: add root Dockerfile and multi-service docker-compose.yml"),
    (["dev.ps1"], "build: add local developer powershell launcher (dev.ps1)"),
    (["render.yaml", "railway.json", "vercel.json"], "build: add cloud deployment specs (render, railway, vercel)"),
    (["ARCHITECTURE.md"], "docs: add comprehensive system architecture wireframe (ARCHITECTURE.md)"),
    
    # Phase 2: Backend Core & DB
    (["backend/pyproject.toml", "backend/requirements.txt"], "backend: add backend package manifests and dependencies"),
    (["backend/alembic.ini", "backend/migrations/"], "backend: configure database migrations setup (alembic.ini)"),
    (["backend/app/config.py"], "backend: configure pydantic application settings and environment loader"),
    (["backend/app/db.py"], "backend: initialize async SQLAlchemy engine and session factory"),
    (["backend/app/models/"], "backend: define database entity models and Pydantic schemas"),
    
    # Phase 3: Data Generators D1-D6
    (["backend/app/data_gen/__init__.py", "backend/app/data_gen/orchestrator.py"], "data: add synthetic Indian data generator orchestrator"),
    (["backend/app/data_gen/d1_bank_upi.py"], "feat(data_gen): add Worker D1 Bank/UPI cash flow generator"),
    (["backend/app/data_gen/d2_telecom.py"], "feat(data_gen): add Worker D2 Telecom utility & payment history generator"),
    (["backend/app/data_gen/d3_ecommerce.py"], "feat(data_gen): add Worker D3 E-Commerce shopping profile generator"),
    (["backend/app/data_gen/d4_location.py"], "feat(data_gen): add Worker D4 Geolocation stability generator"),
    (["backend/app/data_gen/d5_questionnaire.py"], "feat(data_gen): add Worker D5 Psychometric financial capability generator"),
    (["backend/app/data_gen/d6_merchant_gst.py"], "feat(data_gen): add Worker D6 Merchant and GST compliance generator"),
    
    # Phase 4: Machine Learning Engine
    (["backend/app/ml/features.py"], "feat(ml): define Tier 1 and Tier 2 feature list specifications"),
    (["backend/app/ml/pipeline.py"], "feat(ml): implement calibrated probability scoring pipeline"),
    (["backend/app/ml/consolidator.py"], "feat(ml): implement policy consolidator, hard caps, and signal conflict engine"),
    (["backend/app/ml/explainer.py"], "feat(ml): implement TreeSHAP local point waterfall explainability"),
    (["backend/app/ml/explainability.py"], "feat(ml): implement vernacular explanations generator"),
    (["backend/app/ml/static_profiles.py"], "feat(ml): implement static test applicant persona profiles"),
    (["models/tier1_xgb_v1.json", "models/tier1_calibrated_v1.pkl"], "models: add trained Tier 1 calibrated XGBoost weights"),
    (["models/tier2_xgb_v1.json", "models/tier2_lgbm_v1.txt", "models/tier2_calibrators_v1.pkl"], "models: add trained Tier 2 ensemble weights and calibrators"),
    (["models/metrics_v1.json", "models/shap_conflict_example.json"], "models: add model evaluation metrics and SHAP conflict baselines"),
    
    # Phase 5: RAG Advisor & Demo Data
    (["demo_data/profiles.json", "demo_data/scores_db.json"], "data: add demo applicant profiles and fallback databases"),
    (["demo_data/interview_summaries.json", "demo_data/notifications.json"], "data: add applicant interview summaries and decision audit records"),
    (["data/rag_sources/"], "data: add regulatory RAG policy corpus for RBI Fair Practices and DPDP Act"),
    (["backend/app/rag/ingestion.py"], "feat(rag): implement document chunking and ChromaDB ingestion pipeline"),
    (["backend/app/rag/advisor.py"], "feat(rag): implement grounded loan advisor RAG query client"),
    
    # Phase 6: API Routes
    (["backend/app/routes/consent.py"], "feat(api): implement DPDP Act 2023 granular consent endpoints"),
    (["backend/app/routes/identity.py"], "feat(api): implement multi-source identity verification endpoints"),
    (["backend/app/routes/dashboard.py"], "feat(api): implement loan officer portfolio and stress alerts triage"),
    (["backend/app/routes/chatbot.py"], "feat(api): implement vernacular conversational mascot Mitra"),
    (["backend/app/routes/personalize.py"], "feat(api): implement personalized inclusive banking products hub"),
    (["backend/app/routes/eligibility.py"], "feat(api): implement scheme eligibility check endpoint"),
    (["backend/app/routes/vapi.py"], "feat(api): implement outbound Vapi AI telephony callback webhook"),
    (["backend/app/routes/advisor.py"], "feat(api): implement grounded credit advisor chat endpoint"),
    (["backend/app/routes/score.py"], "feat(api): implement calibrated credit score calculation endpoint"),
    (["backend/app/main.py"], "backend: assemble FastAPI application routers and CORS middleware"),
    
    # Phase 7: Backend Tests
    (["backend/tests/test_data_gen.py"], "test: add data generator unit test suite"),
    (["backend/tests/test_full_system.py"], "test: add end-to-end full system integration test suite"),
    (["backend/train.py", "backend/generate.py"], "scripts: add synthetic data generation and offline model training scripts"),
    (["backend/fairness_audit.py", "backend/shap_analysis.py"], "scripts: add Fairlearn DIR audit and SHAP attribution scripts"),
    
    # Phase 8: Frontend Base & Design System
    (["frontend/package.json", "frontend/vite.config.ts", "frontend/tsconfig.json", "frontend/tsconfig.node.json"], "frontend: initialize Vite, React 18, and TypeScript scaffolding"),
    (["frontend/tailwind.config.js", "frontend/postcss.config.js", "frontend/src/styles/"], "frontend: configure Tailwind CSS typography and design tokens"),
    (["frontend/src/routeTree.gen.ts", "frontend/src/main.tsx", "frontend/src/App.tsx"], "frontend: configure TanStack Router navigation tree and entrypoint"),
    (["frontend/src/components/ui/"], "frontend: add shadcn/ui primitive components (Button, Badge, Card, Dialog, Table)"),
    (["frontend/src/components/"], "frontend: add reusable layout components, navbar, and theme toggles"),
    (["frontend/src/locales/"], "frontend: add vernacular translation dictionaries for English, Hindi, and Gujarati"),
    (["frontend/src/context/", "frontend/src/stores/", "frontend/src/hooks/"], "frontend: implement global application stores and reactive hooks"),
    (["frontend/src/lib/"], "frontend: add frontend utility helpers and formatting tools"),
    
    # Phase 9: Frontend Features & Dashboards
    (["frontend/src/features/consent/"], "frontend: implement DPDP 9-step granular consent onboarding flow"),
    (["frontend/src/features/score/"], "frontend: implement interactive calibrated credit score gauge and SHAP waterfall chart"),
    (["frontend/src/features/dashboard/"], "frontend: implement Loan Officer triage dashboard with early-warning alerts"),
    (["frontend/src/features/advisor/"], "frontend: implement multilingual Mitra AI financial assistant chat drawer"),
    (["frontend/src/features/eligibility/", "frontend/src/features/decisions/"], "frontend: implement loan eligibility and decision history modules"),
    (["frontend/src/features/auth/", "frontend/src/features/errors/", "frontend/src/features/pitch/"], "frontend: implement authentication, error boundaries, and pitch decks"),
    (["frontend/src/routes/"], "frontend: implement application route views and page controllers"),
    
    # Phase 10: AWS SAM Serverless Pipeline (Build It Track)
    (["template.yaml"], "serverless: add AWS SAM template for local D1-D6 emulation (template.yaml)"),
    (["samconfig.toml"], "serverless: add SAM CLI local configuration (samconfig.toml)"),
    (["backend/lambdas/__init__.py", "backend/lambdas/_common.py"], "serverless: add deterministic SHA-256 seed and profile helper (lambdas/_common.py)"),
    (["backend/lambdas/d1_bank_upi.py"], "feat(lambdas): add Worker D1 Bank/UPI serverless Lambda handler"),
    (["backend/lambdas/d2_telecom.py"], "feat(lambdas): add Worker D2 Telecom utility serverless Lambda handler"),
    (["backend/lambdas/d3_ecommerce.py"], "feat(lambdas): add Worker D3 E-Commerce serverless Lambda handler"),
    (["backend/lambdas/d4_location.py"], "feat(lambdas): add Worker D4 Location stability serverless Lambda handler"),
    (["backend/lambdas/d5_questionnaire.py"], "feat(lambdas): add Worker D5 Psychometric questionnaire serverless Lambda handler"),
    (["backend/lambdas/d6_merchant_gst.py"], "feat(lambdas): add Worker D6 Merchant/GST serverless Lambda handler"),
    (["backend/lambdas/pipeline_orchestrator.py"], "feat(lambdas): add API Gateway Coordinator Lambda with strict partial consent"),
    (["backend/tests/test_sam_pipeline.py"], "test: add SAM pipeline Lambda test suite"),
    
    # Phase 11: Docs & Final Polish
    (["docs/"], "docs: add technical documentation, diagrams, and style guides"),
    (["README.md"], "docs: add comprehensive visual walkthrough and project documentation (README.md)"),
]


def run_cmd(cmd: list[str], env: dict | None = None) -> str:
    res = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if res.returncode != 0 and "nothing to commit" not in res.stdout:
        print(f"Command failed: {' '.join(cmd)}\nStderr: {res.stderr}")
    return res.stdout.strip()


def init_git():
    if not os.path.exists(".git"):
        print("[*] Initializing local git repository...")
        run_cmd(["git", "init"])
        run_cmd(["git", "config", "user.name", "harir03"])
        run_cmd(["git", "config", "user.email", "harireddy030207@gmail.com"])


def execute_commit(files: list[str], message: str, commit_time: datetime.datetime | None = None):
    # Stage specified files or directories
    for f in files:
        if os.path.exists(f):
            run_cmd(["git", "add", f])
    
    env = os.environ.copy()
    if commit_time:
        time_str = commit_time.strftime("%Y-%m-%d %H:%M:%S")
        env["GIT_AUTHOR_DATE"] = time_str
        env["GIT_COMMITTER_DATE"] = time_str
    
    status = run_cmd(["git", "status", "--porcelain"])
    if status:
        out = run_cmd(["git", "commit", "-m", message], env=env)
        ts_display = commit_time.strftime("%H:%M:%S") if commit_time else datetime.datetime.now().strftime("%H:%M:%S")
        print(f"[{ts_display}] Committed: {message}")
    else:
        print(f"[SKIP] No changes staged for: {message}")


def run_live_mode(min_minutes: float, max_minutes: float):
    init_git()
    total = len(COMMIT_STAGES)
    print(f"[*] Starting LIVE COMMIT RUNNER ({total} total stages).")
    print(f"[*] Randomized delay between commits: {min_minutes} to {max_minutes} minutes.\n")

    for idx, (files, message) in enumerate(COMMIT_STAGES, 1):
        print(f"\n--- Stage {idx}/{total} ---")
        execute_commit(files, message)
        
        if idx < total:
            delay_sec = random.uniform(min_minutes * 60, max_minutes * 60)
            next_time = datetime.datetime.now() + datetime.timedelta(seconds=delay_sec)
            print(f"Sleeping for {delay_sec / 60:.1f} minutes. Next commit at {next_time.strftime('%H:%M:%S')}...")
            time.sleep(delay_sec)

    # Catch any remaining unstaged files in final commit
    run_cmd(["git", "add", "."])
    status = run_cmd(["git", "status", "--porcelain"])
    if status:
        execute_commit(["."], "chore: complete project file tracking and final artifacts")
    print("\n[SUCCESS] All staged commits successfully created!")


def run_spread_mode():
    init_git()
    total = len(COMMIT_STAGES)
    print(f"[*] Generating {total} distributed commits across today with randomized intervals...")

    # Start today at 08:30 AM
    now = datetime.datetime.now()
    start_time = datetime.datetime(now.year, now.month, now.day, 8, 30, 0)
    current_time = start_time

    for idx, (files, message) in enumerate(COMMIT_STAGES, 1):
        # Add random 8 to 22 minutes
        random_gap = random.randint(8, 22) * 60 + random.randint(0, 59)
        current_time += datetime.timedelta(seconds=random_gap)
        execute_commit(files, message, commit_time=current_time)

    # Catch any remaining files
    run_cmd(["git", "add", "."])
    status = run_cmd(["git", "status", "--porcelain"])
    if status:
        current_time += datetime.timedelta(minutes=15)
        execute_commit(["."], "chore: complete project file tracking and final artifacts", commit_time=current_time)

    print("\n[SUCCESS] Staged commits complete! Run 'git log --oneline' to view.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AltGrade Staged Git Commit Automation")
    parser.add_argument("--mode", choices=["live", "spread"], default="spread",
                        help="Execution mode: 'live' (real-time background timer) or 'spread' (instant distributed timestamps)")
    parser.add_argument("--min-minutes", type=float, default=60.0,
                        help="Minimum delay in minutes for live mode (default: 60)")
    parser.add_argument("--max-minutes", type=float, default=120.0,
                        help="Maximum delay in minutes for live mode (default: 120)")
    args = parser.parse_args()

    if args.mode == "live":
        run_live_mode(args.min_minutes, args.max_minutes)
    else:
        run_spread_mode()
