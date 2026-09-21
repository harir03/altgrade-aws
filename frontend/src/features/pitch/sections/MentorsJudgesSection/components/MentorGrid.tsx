import { DesktopMentorCard } from "@/features/pitch/sections/MentorsJudgesSection/components/DesktopMentorCard";
import { MobileMentorCarousel } from "@/features/pitch/sections/MentorsJudgesSection/components/MobileMentorCarousel";
import { JudgeSeal } from "@/features/pitch/sections/MentorsJudgesSection/components/JudgeSeal";

export const MentorGrid = () => {
  return (
    <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline mt-11 md:mt-[60px] w-full">
      <div className="jd-grid-wrap relative w-full max-w-[1376px] mx-auto" data-sealed="true">
        <div className="jd-grid box-border caret-transparent gap-x-3 hidden grid-cols-[repeat(2,minmax(0px,1fr))] outline-[3px] gap-y-3 no-underline w-full md:gap-x-[35.2px] md:grid md:grid-cols-[repeat(3,minmax(0px,1fr))] md:gap-y-[35.2px]">
          <DesktopMentorCard
            ariaLabel="Scope 01: Satellite Crop Telemetry"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-8.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Scope 01 · Q1 2027"
            title="Satellite Crop Telemetry"
            status="In R&D"
            category="Geospatial Earth Observation"
            subtitle="ISRO & Sentinel-2 Spectral Indices"
            groupLabel="Hyperlocal vegetative risk calibration"
            description="Integrating multi-spectral NDVI and SAR soil moisture indices from ISRO and Sentinel-2 to predict agricultural yield stress before mandi harvest cycles."
            firstMetricValue="10m"
            firstMetricLabel="Resolution"
            secondMetricValue="4-Day"
            secondMetricLabel="Revisit Cycle"
            imageSrc="/images/roadmap/satellite_crop.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 02: Offline ZK Credit Enclaves"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-10.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Scope 02 · Q2 2027"
            title="Offline ZK Credit Enclaves"
            status="Prototyping"
            category="Privacy & Edge Cryptography"
            subtitle="SnarkJS & SIM-Card Micro-Proofs"
            groupLabel="Zero-connectivity credit verification"
            description="Enabling rural borrowers in remote connectivity dead-zones to compute cryptographic zero-knowledge liquidity proofs directly on device SIM hardware."
            firstMetricValue="0 KB"
            firstMetricLabel="Data Transit"
            secondMetricValue="100%"
            secondMetricLabel="Offline"
            imageSrc="/images/roadmap/zk_enclave.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 03: ONDC Invoice Factoring"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-12.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Scope 03 · Q2 2027"
            title="ONDC Invoice Factoring"
            status="Architected"
            category="Open Commerce Protocols"
            subtitle="Automated Merchant Escrow Settlement"
            groupLabel="Real-time inventory trade finance"
            description="Real-time programmatic factoring for Kirana inventory restocking against verified ONDC purchase orders with sub-second escrow release."
            firstMetricValue="< 60s"
            firstMetricLabel="Disbursal"
            secondMetricValue="0%"
            secondMetricLabel="Pre-Payment"
            imageSrc="/images/roadmap/ondc_invoice.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 04: Mitra Dialect Audio Agents"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-14.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Scope 04 · Q3 2027"
            title="Mitra Dialect Audio Agents"
            status="In Pipeline"
            category="Acoustic NLP & Legal Tech"
            subtitle="22 Scheduled Languages & Dialects"
            groupLabel="Empathetic audio consent contracts"
            description="Deploying low-latency on-device voice agents that read, explain, and answer questions on key lending terms in 22 regional dialects with complete dignity."
            firstMetricValue="22"
            firstMetricLabel="Dialects"
            secondMetricValue="Native"
            secondMetricLabel="Audio KFS"
            imageSrc="/images/roadmap/dialect_audio.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 05: Micro-Pension Micro-Sip"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-15.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Scope 05 · Q3 2027"
            title="Micro-Pension Micro-Sip"
            status="Planned"
            category="Social Security Protocols"
            subtitle="NPS-Lite & Mandi Daily Sweeps"
            groupLabel="Long-term informal sector safety nets"
            description="Automated round-up micropayments from daily UPI QR merchant sales directed into sovereign NPS-Lite and government accident cover."
            firstMetricValue="₹10"
            firstMetricLabel="Daily Sweep"
            secondMetricValue="Gilt"
            secondMetricLabel="Sovereign Backed"
            imageSrc="/images/roadmap/micro_pension.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 06: Diaspora Inflow Scoring"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-16.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Scope 06 · Q4 2027"
            title="Diaspora Inflow Scoring"
            status="Under Review"
            category="Cross-Border Financial Rails"
            subtitle="UPI-PayNow & GCC Inward Ingestion"
            groupLabel="Corridor risk assessment"
            description="Underwriting rural household loans backed by recurring remittance flows across UAE, Singapore, and Saudi bilateral payment gateways."
            firstMetricValue="6"
            firstMetricLabel="Key Corridors"
            secondMetricValue="UPI"
            secondMetricLabel="Global Rails"
            imageSrc="/images/roadmap/diaspora_inflow.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 07: Autonomous Fair-Lending Engine"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-17.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-9.svg"
            seatLabel="Scope 07 · Q4 2027"
            title="Autonomous Fair-Lending Engine"
            status="Governance"
            category="Responsible AI & Auditability"
            subtitle="Automated Disparate Impact Detection"
            groupLabel="Real-time regulatory compliance"
            description="Continuous mathematical fairness sentinel checking live loan approvals for statistical parity across gender, caste, and geographic sub-districts."
            firstMetricValue="0.80 Rule"
            firstMetricLabel="Compliance"
            secondMetricValue="Real-Time"
            secondMetricLabel="Automated Audit"
            imageSrc="/images/roadmap/fair_lending.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 08: AWS Graviton4 Edge Clusters"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-18.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-11.svg"
            seatLabel="Scope 08 · 2028 Horizon"
            title="AWS Graviton4 Edge Clusters"
            status="Hardware Spec"
            category="Sovereign Compute & Enclaves"
            subtitle="Nitro Enclaves & Indian Tier-3 PoPs"
            groupLabel="Extreme low-latency decisioning"
            description="Deploying custom quantized credit neural networks on AWS Graviton4 hardware with Nitro Enclaves in tier-2/3 Indian edge aggregation points."
            firstMetricValue="< 35ms"
            firstMetricLabel="P99 Latency"
            secondMetricValue="Nitro"
            secondMetricLabel="Hardware HSM"
            imageSrc="/images/roadmap/graviton_edge.jpg"
          />

          <DesktopMentorCard
            ariaLabel="Scope 09: e-NWR Commodity Underwriting"
            primaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-19.svg"
            secondaryIconSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-13.svg"
            seatLabel="Scope 09 · 2028 Horizon"
            title="e-NWR Commodity Underwriting"
            status="Planned"
            category="Agritech Commodity Finance"
            subtitle="WDRA Accredited Godown Registry"
            groupLabel="Collateralized post-harvest liquidity"
            description="Direct integration with WDRA electronic negotiable warehouse receipts to extend instant harvest-backed credit against stored grains."
            firstMetricValue="1,200+"
            firstMetricLabel="Warehouses"
            secondMetricValue="WDRA"
            secondMetricLabel="Accredited"
            imageSrc="/images/roadmap/enwr_warehouse.jpg"
          />
        </div>

        <MobileMentorCarousel />

        <JudgeSeal />
      </div>
    </div>
  );
};