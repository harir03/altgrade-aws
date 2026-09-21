import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/features/pitch/components/SectionHeader";
import { getLenis } from "@/features/pitch/utils/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface TrackData {
  id: string;
  num: string;
  name: string;
  seat: string;
  tagline: string;
  summary: string;
  prompts: string[];
  themeColor: string;
  glowColor: string;
}

const tracks: TrackData[] = [
  {
    id: "upi",
    num: "01",
    name: "UPI Cashflow Engine",
    seat: "PILLAR 01",
    tagline: "Decode daily QR velocity, supplier settlement cadence, and ticket consistency.",
    summary:
      "Traditional credit checks demand years of tax returns and collateral. AltGrade ingests high-frequency QR transaction streams, separating genuine retail velocity from circular peer-to-peer spikes to construct an accurate liquidity baseline.",
    prompts: [
      "Real-time UPI merchant QR inflow velocity and counterparty dispersion",
      "Seasonal peak calibration across agricultural harvest and festival inventory cycles",
      "Algorithmic anomaly filtering against artificial churn and circular loops",
    ],
    themeColor: "#8FC45A",
    glowColor: "rgba(143, 196, 90, 0.4)",
  },
  {
    id: "utility",
    num: "02",
    name: "Utility & GST Cadence",
    seat: "PILLAR 02",
    tagline: "Continuous operational proof through electricity, rent, telecom, and tax ledgers.",
    summary:
      "A functioning shop never cuts its electricity or lets inventory filings lapse. We synthesize municipal electricity meter consistency, wholesale mandi invoice payments, and telecom top-ups into tamper-proof reliability proof.",
    prompts: [
      "State discom electricity payment consistency and industrial load stability",
      "Quarterly GST filing cadence and B2B vendor purchase order cross-verification",
      "Telecom recharge regularity and operational geographic persistence",
    ],
    themeColor: "#E5B83B",
    glowColor: "rgba(229, 184, 59, 0.4)",
  },
  {
    id: "privacy",
    num: "03",
    name: "Edge Zero-Knowledge",
    seat: "PILLAR 03",
    tagline: "Credit underwriting without exposing raw personal bank account statements.",
    summary:
      "Full compliance with the Digital Personal Data Protection Act. Sensitive transaction logs are computed locally on user devices or ephemeral secure enclaves, generating mathematical zero-knowledge proofs of solvency.",
    prompts: [
      "Zero-knowledge cryptographic solvency proofs for lending NBFC partners",
      "On-device feature vector extraction with zero raw statement persistence",
      "Granular time-bounded consent revocation under RBI and DPDP directives",
    ],
    themeColor: "#2DD4BF",
    glowColor: "rgba(45, 212, 191, 0.4)",
  },
  {
    id: "mitra",
    num: "04",
    name: "Vernacular Voice: Mitra",
    seat: "PILLAR 04",
    tagline: "Natural conversational underwriting in Hindi, Tamil, Telugu, Bengali, and Marathi.",
    summary:
      "Complex multi-page PDF loan agreements alienate Bharat. Mitra conducts audio interviews in the borrower's mother tongue, recording crop yields, vendor payment terms, and family balance sheets with dignity and clarity.",
    prompts: [
      "Audio-native vernacular dialogue engines across 14 Indian languages",
      "Acoustic stress and sentiment calibration without invasive profiling",
      "Transparent spoken terms, EMI repayment schedules, and interest breakdowns",
    ],
    themeColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.4)",
  },
  {
    id: "restructure",
    num: "05",
    name: "Dynamic Restructuring",
    seat: "PILLAR 05",
    tagline: "Proactive repayment adjustment before defaults happen, not punitive recovery.",
    summary:
      "Monsoons, supply shocks, and health emergencies disrupt rural cashflows. AltGrade continuously detects early macroeconomic distress signals, automatically proposing flexible grace periods and restructured tenure.",
    prompts: [
      "Micro-climate rainfall and mandi yield correlation against farm cashflow",
      "Automated tenure extension and flexible weekly micro-EMI recalculation",
      "Cooperative non-punitive dispute resolution between borrowers and lenders",
    ],
    themeColor: "#C084FC",
    glowColor: "rgba(192, 132, 252, 0.4)",
  },
  {
    id: "fairness",
    num: "06",
    name: "Anti-Bias SHAP Audit",
    seat: "PILLAR 06",
    tagline: "Explainable credit recommendations with mathematically verified neutrality.",
    summary:
      "Black-box AI credit scoring risks perpetuating demographic bias. AltGrade computes exact SHAP and counterfactual fairness values for every underwriting decision, allowing human loan officers to inspect every contributing factor.",
    prompts: [
      "Exact feature attribution scoring ensuring zero demographic bias",
      "Counterfactual improvement roadmaps for declined micro-merchants",
      "Audit-ready explainability dossiers formatted for NBFC and RBI compliance",
    ],
    themeColor: "#FB923C",
    glowColor: "rgba(251, 146, 60, 0.4)",
  },
];

// Helper to render words with blur animation slots
const Words = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={`th-words ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="th-word-slot">
          <span className="th-word">{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
};

// Track Visual Plate Icons
const TrackVisualIcon = ({ id, color }: { id: string; color: string }) => {
  if (id === "upi") {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(143,196,90,0.5)]">
        {/* Rising growth chart curve and arrow */}
        <path
          d="M32 108C50 94 72 74 100 52L108 58M100 52H120V72"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 3 Bar chart columns */}
        <rect x="32" y="118" width="16" height="24" rx="4" fill={color} />
        <rect x="54" y="98" width="16" height="44" rx="4" fill={color} />
        <rect x="76" y="80" width="16" height="62" rx="4" fill={color} />
        {/* Coin Stack on right */}
        <ellipse cx="116" cy="98" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="116" cy="110" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="116" cy="122" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="116" cy="134" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <path d="M98 98V134M134 98V134" stroke={color} strokeWidth="3.5" />
      </svg>
    );
  }

  if (id === "utility") {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(229,184,59,0.5)]">
        {/* Lightbulb and energy grid */}
        <path
          d="M80 32C60 32 44 48 44 68C44 80 50 90 60 98V110C60 113 63 116 66 116H94C97 116 100 113 100 110V98C110 90 116 80 116 68C116 48 100 32 80 32Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Filament / meter mark */}
        <path d="M68 76L74 62H86L92 76" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M66 122H94M70 128H90M74 134H86" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 16V22M32 68H38M122 68H128M46 38L52 44M114 38L108 44" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "privacy") {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(45,212,191,0.5)]">
        {/* Shield */}
        <path
          d="M80 26L124 44V82C124 112 104 136 80 144C56 136 36 112 36 82V44L80 26Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Padlock */}
        <rect x="64" y="80" width="32" height="26" rx="5" fill="none" stroke={color} strokeWidth="4" />
        <path d="M70 80V68C70 62 74 58 80 58C86 58 90 62 90 68V80" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="92" r="3" fill={color} />
        <path d="M80 95V99" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "mitra") {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(96,165,250,0.5)]">
        {/* Head profile silhouette */}
        <path
          d="M68 28C92 28 112 48 112 72C112 84 107 95 99 102V116C99 122 94 126 88 126H78V134H58V126H54C42 126 32 116 32 104V88C32 82 36 78 40 78C42 78 44 79 45 80C46 51 56 28 68 28Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sound wave / voice mic inside */}
        <path d="M70 66V82M76 60V88M82 54V94M88 60V88M94 66V82" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "restructure") {
    return (
      <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(192,132,252,0.5)]">
        {/* Dynamic resilience curve and heart / cycle */}
        <path
          d="M80 134C80 134 30 102 30 64C30 46 44 32 62 32C72 32 80 38 80 38C80 38 88 32 98 32C116 32 130 46 130 64C130 102 80 134 80 134Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Pulse line inside */}
        <path
          d="M40 76H60L68 56L76 96L84 68L92 84L98 76H120"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Anti-Bias SHAP Audit
  return (
    <svg viewBox="0 0 160 160" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_24px_rgba(251,146,60,0.5)]">
      {/* Central Isometric Cube */}
      <path d="M80 34L114 54V94L80 114L46 94V54L80 34Z" fill="none" stroke={color} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M80 34V114M114 54L80 74L46 54" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      {/* Satellite nodes */}
      <circle cx="28" cy="46" r="6" fill={color} />
      <circle cx="132" cy="46" r="6" fill={color} />
      <circle cx="80" cy="136" r="6" fill={color} />
      <path d="M46 54L28 46M114 54L132 46M80 114L80 136" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
    </svg>
  );
};

export const TracksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dwellKey, setDwellKey] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const currentTrack = tracks[activeIdx];

  // Pause progression when off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleAdvance = () => {
    if (activeIdx < tracks.length - 1) {
      setActiveIdx((prev) => prev + 1);
      setDwellKey((k) => k + 1);
    } else {
      // Completed all 6 scoring pillars: smoothly transition to next section (Future Scope)
      const nextSec = document.getElementById("judges");
      if (nextSec) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(nextSec, { offset: -20, duration: 1.4 });
        } else {
          nextSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      setActiveIdx(0);
      setDwellKey((k) => k + 1);
    }
  };

  // 6-Second Auto progression: auto-advances cards and moves to next section
  useEffect(() => {
    if (!isIntersecting) return;

    const timer = setTimeout(() => {
      handleAdvance();
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeIdx, dwellKey, isIntersecting]);

  // Entrance animation for section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".th-stage-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".th-rail-reveal", {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Animate text blur and mask reveal on track change
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".th-mask-inner",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, force3D: true, ease: "power3.out", duration: 0.6 }
      );
      gsap.fromTo(
        ".th-brief-line .th-word",
        { opacity: 0, y: 8, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", force3D: true, ease: "power2.out", duration: 0.45, stagger: 0.015, delay: 0.03 }
      );
      gsap.fromTo(
        ".th-brief-summary .th-word",
        { opacity: 0, y: 6, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", force3D: true, ease: "power2.out", duration: 0.5, stagger: 0.012, delay: 0.06 }
      );
    }, el);

    return () => ctx.revert();
  }, [activeIdx]);

  const handleSelectTrack = (idx: number) => {
    setActiveIdx(idx);
    setDwellKey((k) => k + 1);
  };

  return (
    <section
      id="themes"
      ref={sectionRef}
      aria-label="The six alternate credit intelligence pillars"
      className="th box-border caret-transparent relative w-full pt-28 pb-20 px-5 text-center text-lime-50 scroll-mt-28 md:pt-36 md:pb-28 md:px-14"
    >
      <div id="tracks" className="relative -top-20 h-0 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1376px] mx-auto flex flex-col items-center">
        <SectionHeader variant="artifactOnly" title="" />

        <SectionHeader
          variant="tracks"
          eyebrow="Alternate Credit Intelligence"
          titleLineOne="Six Pillars of"
          titleLineTwo="Alternate Underwriting."
          descriptionWords={[
            "Traditional", "bureau", "scores", "exclude", "400", "million", "Indians.",
            "AltGrade", "analyzes", "real-time", "UPI", "cashflows,", "verified", "utility", "cadence,",
            "and", "vernacular", "voice", "signals", "with", "zero-knowledge", "privacy."
          ]}
        />

        {/* The Stage: Left Plate & Right Brief */}
        <div className="th-stage-reveal w-full mt-10 md:mt-16">
          <div className="th-stage">
            {/* Left: Morphing Visual Plate */}
            <div
              className="th-plate cursor-pointer group"
              onClick={handleAdvance}
              title={activeIdx < tracks.length - 1 ? `Advance to ${tracks[activeIdx + 1].name}` : "Proceed to Future Scope"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleAdvance();
                }
              }}
            >
              {/* Giant Outline Number in Top Left */}
              <span className="th-plate-index" aria-hidden="true">
                {currentTrack.num}
              </span>

              {/* Dynamic Concentric Radar Rings & Glowing Graphic */}
              <div className="th-plate-content relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Sonar / Radar Rings */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 400 275">
                  <circle cx="200" cy="137" r="45" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="200" cy="137" r="85" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" opacity="0.6" />
                  <circle cx="200" cy="137" r="130" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" strokeDasharray="4 6" opacity="0.35" />
                  <circle cx="200" cy="137" r="175" fill="none" stroke={currentTrack.themeColor} strokeWidth="0.75" opacity="0.2" />
                  <line x1="0" y1="137" x2="400" y2="137" stroke={currentTrack.themeColor} strokeWidth="0.5" opacity="0.15" />
                  <line x1="200" y1="0" x2="200" y2="275" stroke={currentTrack.themeColor} strokeWidth="0.5" opacity="0.15" />
                </svg>

                {/* Ambient Radial Color Glow */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${currentTrack.glowColor} 0%, transparent 68%)`,
                  }}
                />

                {/* Center Glowing Icon */}
                <div className="relative z-10">
                  <TrackVisualIcon id={currentTrack.id} color={currentTrack.themeColor} />
                </div>
              </div>

              {/* Bottom Right Advance Hint */}
              <span className="th-plate-hint">
                {activeIdx < tracks.length - 1 ? `Next Pillar (${tracks[activeIdx + 1].num}) →` : "Next Section →"}
              </span>
            </div>

            {/* Right: The Brief */}
            <div className="th-brief">
              <span className="th-brief-seat">{currentTrack.seat}</span>

              <h3 className="th-brief-title">
                <span className="th-mask-line">
                  <span className="th-mask-inner">{currentTrack.name}</span>
                </span>
              </h3>

              <span className="th-brief-rule" aria-hidden="true">
                <i />
              </span>

              <p className="th-brief-line">
                <Words text={currentTrack.tagline} />
              </p>

              <p className="th-brief-summary">
                <Words text={currentTrack.summary} />
              </p>

              <ul className="th-prompts">
                {currentTrack.prompts.map((prompt, i) => (
                  <li key={`${currentTrack.id}-${i}`}>
                    <svg viewBox="0 0 12 14" aria-hidden="true" className="w-3.5 h-3.5 text-[#8FC45A] mt-1 shrink-0">
                      <path d="M6 13.4V4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M6.2 7.6C10 7 11.4 4 11.6 0.4C7.8 0.6 6 4 6.2 7.6Z" fill="currentColor" />
                      <path d="M5.6 10.6C2.4 10.2 1 8 0.6 5C3.8 5.2 5.4 7.6 5.6 10.6Z" fill="currentColor" />
                    </svg>
                    <Words text={prompt} />
                  </li>
                ))}
              </ul>

              {/* Quick-advance action row */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all bg-[#8FC45A]/15 hover:bg-[#8FC45A]/25 text-[#D2E8B8] border border-[#8FC45A]/30 hover:border-[#8FC45A]/50 cursor-pointer"
                >
                  <span>{activeIdx < tracks.length - 1 ? `Next: ${tracks[activeIdx + 1].name}` : "Explore Future Scope"}</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="text-xs text-[#8FC45A]/60 font-mono">
                  0{activeIdx + 1} / 0{tracks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rail with 6 Horizontal Dwell Tabs */}
        <div className="th-rail-reveal w-full mt-12 md:mt-20">
          <div className="th-rail" role="tablist" aria-label="Tracks">
            {tracks.map((track, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectTrack(idx)}
                  className={`th-tab ${isActive ? "is-active" : ""}`}
                >
                  <span className="th-tab-num">{track.num}</span>
                  <span className="th-tab-name">{track.name}</span>
                  <span className="th-tab-bar" aria-hidden="true">
                    {isActive && <i key={`${track.id}-${dwellKey}`} />}
                    {idx < activeIdx && <i className="is-completed" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .th {
          position: relative;
          width: 100%;
          background: transparent;
          color: #EEF5E6;
          overflow: hidden;
          z-index: 10;
        }

        .th-stage-reveal {
          width: 100%;
          margin-top: clamp(2.75rem, 6vh, 4.5rem);
        }

        .th-stage {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(0, 1fr);
          gap: clamp(1.75rem, 4vw, 3.25rem);
          align-items: center;
          text-align: left;
        }

        /* ── Left: the morphing plate ── */
        .th-plate {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          border-radius: 20px;
          overflow: hidden;
          background: #060B05;
          box-shadow:
            0 30px 70px -34px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(190, 224, 168, 0.12);
        }

        .th-plate-index {
          position: absolute;
          left: clamp(1rem, 2vw, 1.6rem);
          top: clamp(0.4rem, 1vw, 0.9rem);
          z-index: 4;
          font-family: var(--font-bebasNeue), var(--font-headingNow), sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: transparent;
          -webkit-text-stroke: 1.2px rgba(240, 250, 230, 0.42);
          pointer-events: none;
        }

        .th-plate-hint {
          position: absolute;
          right: clamp(1rem, 2vw, 1.5rem);
          bottom: clamp(0.9rem, 1.8vw, 1.3rem);
          z-index: 4;
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240, 250, 230, 0.42);
          pointer-events: none;
        }

        /* ── Right: the brief ── */
        .th-brief {
          display: flex;
          flex-direction: column;
        }

        .th-mask-line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.09em;
          margin-bottom: -0.09em;
        }
        .th-mask-inner {
          display: block;
        }

        .th-brief-seat {
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8FC45A;
        }

        .th-brief-title {
          margin: 0.75rem 0 0;
          font-family: var(--font-headingNow), var(--font-dm_sans), sans-serif;
          font-size: clamp(1.4rem, 13.11px + 1.913vw, 2.45rem);
          font-weight: 700;
          line-height: 1.14;
          letter-spacing: -0.026em;
          color: #F1F7E9;
          text-wrap: balance;
        }

        .th-brief-rule {
          display: block;
          width: 100%;
          height: 1px;
          margin-block: clamp(1rem, 2vw, 1.4rem);
        }
        .th-brief-rule i {
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(143, 196, 90, 0.34);
          transform-origin: left center;
        }

        .th-words {
          display: inline;
        }

        .th-word-slot {
          display: inline;
        }

        .th-word {
          display: inline-block;
          will-change: opacity, transform, filter;
        }

        .th-brief-line {
          font-family: var(--font-headingNow), var(--font-dm_sans), sans-serif;
          font-size: clamp(1.02rem, 1.55vw, 1.25rem);
          font-weight: 600;
          line-height: 1.42;
          letter-spacing: -0.018em;
          color: rgba(233, 244, 224, 0.95);
          text-wrap: pretty;
        }

        .th-brief-summary {
          margin-top: 0.85rem;
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.92rem, 1.2vw, 1.02rem);
          line-height: 1.66;
          color: rgba(214, 230, 203, 0.72);
          text-wrap: pretty;
        }

        .th-prompts {
          list-style: none;
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.62rem;
        }

        .th-prompts li {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.85rem, 1.05vw, 0.94rem);
          line-height: 1.45;
          color: rgba(226, 240, 216, 0.9);
        }

        /* ── Rail (Bottom Tabs) ── */
        .th-rail-reveal {
          width: 100%;
          margin-top: clamp(2.5rem, 5vh, 4rem);
        }

        .th-rail {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: clamp(0.5rem, 1.2vw, 1rem);
          width: 100%;
          border-top: 1px solid rgba(190, 224, 168, 0.14);
          padding-top: clamp(1rem, 2vw, 1.5rem);
        }

        .th-tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.4rem;
          padding: 0.35rem 0 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: opacity 240ms ease;
        }

        .th-tab-num {
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: rgba(190, 224, 168, 0.45);
          transition: color 240ms ease;
        }

        .th-tab-name {
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.78rem, 1.05vw, 0.92rem);
          font-weight: 500;
          letter-spacing: -0.012em;
          line-height: 1.25;
          color: rgba(226, 240, 216, 0.48);
          transition: color 240ms ease;
          text-wrap: balance;
        }

        .th-tab:hover .th-tab-name {
          color: rgba(226, 240, 216, 0.85);
        }

        .th-tab.is-active .th-tab-num {
          color: #8FC45A;
        }
        .th-tab.is-active .th-tab-name {
          color: #F1F7E9;
          font-weight: 700;
        }

        .th-tab-bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: rgba(190, 224, 168, 0.12);
          overflow: hidden;
        }

        /* The dwell bar: fills up over 6 seconds */
        .th-tab-bar i {
          display: block;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #5C8C3A, #B8DE8C);
          transform-origin: left center;
          animation: th-dwell 6s linear forwards;
        }

        .th-tab-bar i.is-completed {
          display: block;
          height: 100%;
          width: 100%;
          background: rgba(143, 196, 90, 0.45);
          animation: none;
          transform: scaleX(1);
        }

        .th-plate:hover .th-plate-hint {
          color: rgba(240, 250, 230, 0.9);
        }

        @keyframes th-dwell {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .th-tab:focus-visible {
          outline: 2px solid rgba(143, 196, 90, 0.7);
          outline-offset: 4px;
          border-radius: 4px;
        }

        @media (max-width: 1060px) {
          .th-rail {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 1.1rem;
          }
        }

        @media (max-width: 900px) {
          .th-stage {
            grid-template-columns: minmax(0, 1fr);
            gap: clamp(1.5rem, 5vw, 2.25rem);
          }
          .th-plate {
            aspect-ratio: 4 / 3;
          }
        }

        @media (max-width: 600px) {
          .th-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 420px) {
          .th-rail {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .th-mask-inner {
            transform: none;
          }
          .th-tab-bar i {
            animation: none;
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
};
