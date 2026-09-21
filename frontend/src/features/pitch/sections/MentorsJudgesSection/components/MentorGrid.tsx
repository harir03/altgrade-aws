import { DesktopMentorCard } from "@/features/pitch/sections/MentorsJudgesSection/components/DesktopMentorCard";
import { MobileMentorCarousel } from "@/features/pitch/sections/MentorsJudgesSection/components/MobileMentorCarousel";
import { JudgeSeal } from "@/features/pitch/sections/MentorsJudgesSection/components/JudgeSeal";

export const MentorGrid = () => {
  return (
    <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline mt-11 md:mt-[60px] w-full">
      <div className="jd-grid-wrap relative w-full max-w-[1376px] mx-auto" data-sealed="true">
        <div className="jd-grid box-border caret-transparent gap-x-3 hidden grid-cols-[repeat(2,minmax(0px,1fr))] outline-[3px] gap-y-3 no-underline w-full md:gap-x-[35.2px] md:grid md:grid-cols-[repeat(3,minmax(0px,1fr))] md:gap-y-[35.2px]">
          <DesktopMentorCard
            ariaLabel="Central Banking & Compliance: seat 1. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-8.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 01"
            title="Central Banking & Compliance"
            status="Sealed"
            category="Regulatory Architecture"
            subtitle="RBI Digital Lending & FLDG"
            groupLabel="Banking governance and compliance"
            description="Supervising adherence to RBI digital lending guidelines, First Loss Default Guarantee guardrails, and systemic capital adequacy."
            firstMetricValue="100%"
            firstMetricLabel="RBI Compliant"
            secondMetricValue="FLDG"
            secondMetricLabel="Safe Limits"
          />

          <DesktopMentorCard
            ariaLabel="Privacy & Cryptography: seat 2. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-10.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 02"
            title="Privacy & Cryptography"
            status="Sealed"
            category="Zero-Knowledge Proofs"
            subtitle="ZK Proofs & Verifiable Claims"
            groupLabel="Mathematical solvency research"
            description="Designing mathematical solvency proofs that verify merchant liquidity thresholds without exposing raw bank accounts or transaction histories."
            firstMetricValue="zk-SNARK"
            firstMetricLabel="Verifiable"
            secondMetricValue="0 Byte"
            secondMetricLabel="Data Leakage"
          />

          <DesktopMentorCard
            ariaLabel="Rural Economic Intelligence: seat 3. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-12.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 03"
            title="Rural Economic Intelligence"
            status="Sealed"
            category="Agri-Fintech Systems"
            subtitle="Crop Cycles & Mandi Settlements"
            groupLabel="Agricultural risk models"
            description="Translating seasonal sowing schedules, monsoon forecasts, APMC mandi trading volumes, and crop perishability into reliable risk models."
            firstMetricValue="18"
            firstMetricLabel="Mandis Calibrated"
            secondMetricValue="Kharif/Rabi"
            secondMetricLabel="Seasonal Index"
          />

          <DesktopMentorCard
            ariaLabel="Acoustic AI & Vernacular NLP: seat 4. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-14.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 04"
            title="Acoustic AI & Vernacular NLP"
            status="Sealed"
            category="Voice Underwriting"
            subtitle="Voice Underwriting: Mitra"
            groupLabel="Conversational credit intelligence"
            description="Building dialect-robust natural language audio agents that speak 14 Indian languages, explaining loan agreements clearly with complete dignity."
            firstMetricValue="14"
            firstMetricLabel="Languages Live"
            secondMetricValue="Audio"
            secondMetricLabel="Native Dialogue"
          />

          <DesktopMentorCard
            ariaLabel="Data Protection & Ethics: seat 5. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-15.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 05"
            title="Data Protection & Ethics"
            status="Sealed"
            category="DPDP Governance"
            subtitle="DPDP Act 2023 Architecture"
            groupLabel="Sovereign consent pipelines"
            description="Architecting ephemeral data pipelines where applicant consent is granular, purpose-bound, and instantly revocable upon underwriting completion."
            firstMetricValue="DPDP"
            firstMetricLabel="Audited Rails"
            secondMetricValue="1-Click"
            secondMetricLabel="Revocation"
          />

          <DesktopMentorCard
            ariaLabel="Institutional Capital: seat 6. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-16.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 06"
            title="Institutional Capital"
            status="Sealed"
            category="NBFC Partnerships"
            subtitle="Syndicated Risk & OCEN Rails"
            groupLabel="Co-lending institutional rails"
            description="Structuring co-lending partnerships between tier-1 NBFCs, private scheduled banks, and grassroots credit societies via open protocols."
            firstMetricValue="4"
            firstMetricLabel="Partner NBFCs"
            secondMetricValue="OCEN"
            secondMetricLabel="Protocol Ready"
          />

          <DesktopMentorCard
            ariaLabel="Algorithmic Fairness: seat 7. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-17.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Seat 07"
            title="Algorithmic Fairness"
            status="Sealed"
            category="Anti-Bias Auditing"
            subtitle="SHAP Explainability & Parity"
            groupLabel="Algorithmic bias prevention"
            description="Continuous statistical verification ensuring scoring models exhibit zero demographic, geographic, or gender bias across marginalized cohorts."
            firstMetricValue="SHAP"
            firstMetricLabel="Attribution"
            secondMetricValue="0%"
            secondMetricLabel="Demographic Bias"
          />

          <DesktopMentorCard
            ariaLabel="Sovereign Infrastructure: seat 8. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-18.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Seat 08"
            title="Sovereign Infrastructure"
            status="Sealed"
            category="Financial Cloud Edge"
            subtitle="Indian Data Residency & AWS"
            groupLabel="Low-latency financial compute"
            description="Deploying high-throughput low-latency inference on AWS Mumbai and Hyderabad zones with strict zero-export sovereignty policies."
            firstMetricValue="AWS"
            firstMetricLabel="Mumbai & Hyd"
            secondMetricValue="< 80ms"
            secondMetricLabel="P99 Edge Latency"
          />

          <DesktopMentorCard
            ariaLabel="Financial Inclusion Impact: seat 9. Locked."
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-19.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Seat 09"
            title="Financial Inclusion Impact"
            status="Sealed"
            category="Merchant Advocacy"
            subtitle="Kirana & Street Advocacy"
            groupLabel="Field welfare & protections"
            description="Ground-level impact measurement across street vendors, artisanal clusters, and nano-enterprises to prevent predatory over-leverage."
            firstMetricValue="120K+"
            firstMetricLabel="Merchants"
            secondMetricValue="0"
            secondMetricLabel="Predatory Terms"
          />
        </div>

        <MobileMentorCarousel />

        <JudgeSeal />
      </div>
    </div>
  );
};