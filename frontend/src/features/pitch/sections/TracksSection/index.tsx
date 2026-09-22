import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    seat: "SEAT 01",
    tagline: "Hack the velocity of money. Code capital that moves at the speed of light.",
    summary:
      "Re-engineer how billions flow. Ingest high-frequency QR transaction streams, separating genuine retail velocity from circular peer-to-peer spikes to construct an accurate, verified liquidity baseline for Bharat.",
    prompts: [
      "Real-time UPI merchant QR inflow velocity and counterparty dispersion",
      "Seasonal peak calibration across agricultural harvest and festival cycles",
      "Algorithmic anomaly filtering against artificial churn and circular loops",
    ],
    themeColor: "#70F35D",
    glowColor: "rgba(112, 243, 93, 0.45)",
  },
  {
    id: "utility",
    num: "02",
    name: "Utility & GST Cadence",
    seat: "SEAT 02",
    tagline: "Continuous operational proof through electricity, rent, telecom, and tax ledgers.",
    summary:
      "A functioning shop never cuts its electricity or lets inventory filings lapse. We synthesize municipal electricity meter consistency, wholesale mandi invoice payments, and telecom top-ups into tamper-proof reliability proof.",
    prompts: [
      "State discom electricity payment consistency and industrial load stability",
      "Quarterly GST filing cadence and B2B vendor purchase order cross-verification",
      "Telecom recharge regularity and operational geographic persistence",
    ],
    themeColor: "#E5B83B",
    glowColor: "rgba(229, 184, 59, 0.45)",
  },
  {
    id: "privacy",
    num: "03",
    name: "Edge Zero-Knowledge",
    seat: "SEAT 03",
    tagline: "Credit underwriting without exposing raw personal bank account statements.",
    summary:
      "Full compliance with the Digital Personal Data Protection Act. Sensitive transaction logs are computed locally on user devices or ephemeral secure enclaves, generating mathematical zero-knowledge proofs of solvency.",
    prompts: [
      "Zero-knowledge cryptographic solvency proofs for lending NBFC partners",
      "On-device feature vector extraction with zero raw statement persistence",
      "Granular time-bounded consent revocation under RBI and DPDP directives",
    ],
    themeColor: "#2DD4BF",
    glowColor: "rgba(45, 212, 191, 0.45)",
  },
  {
    id: "mitra",
    num: "04",
    name: "Vernacular Voice: Mitra",
    seat: "SEAT 04",
    tagline: "Natural conversational underwriting in Hindi, Tamil, Telugu, Bengali, and Gujarati.",
    summary:
      "Complex multi-page PDF loan agreements alienate Bharat. Mitra conducts audio interviews in the borrower's mother tongue, recording crop yields, vendor payment terms, and family balance sheets with dignity and clarity.",
    prompts: [
      "Audio-native vernacular dialogue engines across 14 Indian languages",
      "Acoustic stress and sentiment calibration without invasive profiling",
      "Transparent spoken terms, EMI repayment schedules, and interest breakdowns",
    ],
    themeColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.45)",
  },
  {
    id: "restructure",
    num: "05",
    name: "Dynamic Restructuring",
    seat: "SEAT 05",
    tagline: "Proactive repayment adjustment before defaults happen, not punitive recovery.",
    summary:
      "Monsoons, supply shocks, and health emergencies disrupt rural cashflows. AltGrade continuously detects early macroeconomic distress signals, automatically proposing flexible grace periods and restructured tenure.",
    prompts: [
      "Micro-climate rainfall and mandi yield correlation against farm cashflow",
      "Automated tenure extension and flexible weekly micro-EMI recalculation",
      "Cooperative non-punitive dispute resolution between borrowers and lenders",
    ],
    themeColor: "#C084FC",
    glowColor: "rgba(192, 132, 252, 0.45)",
  },
  {
    id: "fairness",
    num: "06",
    name: "Anti-Bias SHAP Audit",
    seat: "SEAT 06",
    tagline: "Explainable credit recommendations with mathematically verified neutrality.",
    summary:
      "Black-box AI credit scoring risks perpetuating demographic bias. AltGrade computes exact SHAP and counterfactual fairness values for every underwriting decision, allowing human loan officers to inspect every contributing factor.",
    prompts: [
      "Exact feature attribution scoring ensuring zero demographic bias",
      "Counterfactual improvement roadmaps for declined micro-merchants",
      "Audit-ready explainability dossiers formatted for NBFC and RBI compliance",
    ],
    themeColor: "#FB923C",
    glowColor: "rgba(251, 146, 60, 0.45)",
  },
];

// Track Visual Plate Icons
const TrackVisualIcon = ({ id, color }: { id: string; color: string }) => {
  if (id === "upi") {
    return (
      <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
        {/* Rising growth chart curve and arrow */}
        <path
          d="M28 108C48 92 72 70 102 48L110 54M102 48H122V68"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 3 Bar chart columns */}
        <rect x="28" y="118" width="16" height="24" rx="4" fill={color} />
        <rect x="52" y="96" width="16" height="46" rx="4" fill={color} />
        <rect x="76" y="76" width="16" height="66" rx="4" fill={color} />
        {/* Coin Stack on right */}
        <ellipse cx="118" cy="98" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="118" cy="110" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="118" cy="122" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <ellipse cx="118" cy="134" rx="18" ry="7" fill="none" stroke={color} strokeWidth="3.5" />
        <path d="M100 98V134M136 98V134" stroke={color} strokeWidth="3.5" />
      </svg>
    );
  }

  if (id === "utility") {
    return (
      <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
        {/* Lightbulb and energy grid */}
        <path
          d="M80 30C58 30 40 48 40 70C40 82 48 94 58 102V114C58 117 61 120 64 120H96C99 120 102 117 102 114V102C112 94 120 82 120 70C120 48 102 30 80 30Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M66 78L74 62H86L94 78" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M64 126H96M68 132H92M74 138H86" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 14V20M26 70H32M128 70H134M42 38L48 44M118 38L112 44" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "privacy") {
    return (
      <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
        {/* Shield */}
        <path
          d="M80 24L124 42V82C124 114 104 138 80 146C56 138 36 114 36 82V42L80 24Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Padlock */}
        <rect x="64" y="78" width="32" height="28" rx="5" fill="none" stroke={color} strokeWidth="4" />
        <path d="M70 78V66C70 60 74 56 80 56C86 56 90 60 90 66V78" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="90" r="3" fill={color} />
        <path d="M80 93V97" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "mitra") {
    return (
      <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
        {/* Head profile silhouette */}
        <path
          d="M68 28C92 28 112 48 112 72C112 84 107 95 99 102V116C99 122 94 126 88 126H78V134H58V126H54C42 126 32 116 32 104V88C32 82 36 78 40 78C42 78 44 79 45 80C46 51 56 28 68 28Z"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sound wave inside */}
        <path d="M68 66V82M75 58V90M82 52V96M89 58V90M96 66V82" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "restructure") {
    return (
      <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
        {/* Dynamic heart and cycle curve */}
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
          d="M40 76H58L66 54L76 96L84 66L92 84L98 76H120"
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
    <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-28 md:h-28 transition-transform duration-500" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
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
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Drag-to-morph state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

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

  const handleAdvance = useCallback(() => {
    setDirection("next");
    if (activeIdx < tracks.length - 1) {
      setActiveIdx((prev) => prev + 1);
      setDwellKey((k) => k + 1);
    } else {
      // Transition to next section
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
  }, [activeIdx]);

  const handlePrev = useCallback(() => {
    setDirection("prev");
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
    setDwellKey((k) => k + 1);
  }, []);

  // 6-Second Auto progression
  useEffect(() => {
    if (!isIntersecting || isDragging) return;

    const timer = setTimeout(() => {
      handleAdvance();
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeIdx, dwellKey, isIntersecting, isDragging, handleAdvance]);

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
        duration: 0.8,
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
        duration: 0.7,
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

  const handleSelectTrack = (idx: number) => {
    if (idx === activeIdx) return;
    setDirection(idx > activeIdx ? "next" : "prev");
    setActiveIdx(idx);
    setDwellKey((k) => k + 1);
  };

  // Pointer drag gestures for 3D Drag to Morph
  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startXRef.current;
    setDragX(dx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (dragX < -40) {
      handleAdvance();
    } else if (dragX > 40) {
      handlePrev();
    }
    setDragX(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragX(0);
  };

  return (
    <section
      id="themes"
      ref={sectionRef}
      aria-label="The six alternate credit intelligence pillars"
      className="th box-border caret-transparent relative w-full pt-20 pb-20 px-4 text-center text-lime-50 scroll-mt-24 md:pt-28 md:pb-24 md:px-8"
    >
      <div id="tracks" className="relative -top-20 h-0 pointer-events-none" aria-hidden="true" />

      {/* Tightly framed container matching reference size */}
      <div className="max-w-[1140px] mx-auto flex flex-col items-center">
        {/* Header matching reference screenshot */}
        <div className="text-center space-y-2 mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.22em] text-[#70F35D] uppercase bg-[#70F35D]/10 border border-[#70F35D]/25">
            THE SIX PILLARS
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white tracking-tight leading-[1.15]">
            Six directions <br className="hidden sm:inline" />
            <span className="text-white/95">to underwrite in.</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-[620px] mx-auto leading-relaxed pt-1">
            One seat at the table for each. Pick the one you cannot stop thinking about — every pillar is evaluated on real-world honesty.
          </p>
        </div>

        {/* The Stage: Left Plate & Right Brief */}
        <div className="th-stage-reveal w-full">
          <div className="th-stage">
            {/* Left: Morphing Visual Plate (Compact & Balanced) */}
            <div
              className="th-plate cursor-grab active:cursor-grabbing group select-none"
              onClick={handleAdvance}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{
                transform: isDragging
                  ? `translate3d(${dragX * 0.35}px, 0, 0) rotateY(${dragX * 0.08}deg) scale(0.98)`
                  : "none",
                transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              title="Click or drag to morph"
              role="button"
              tabIndex={0}
            >
              {/* Dynamic Animated Card Content keyed by track ID */}
              <div
                key={currentTrack.id}
                className={`th-plate-inner ${direction === "next" ? "animate-card-in-right" : "animate-card-in-left"}`}
              >
                {/* Outlined Track Number in Top-Left */}
                <span className="th-plate-index font-mono" aria-hidden="true">
                  {currentTrack.num}
                </span>

                {/* Concentric Radar Rings & Glowing Graphic */}
                <div className="th-plate-content relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Radar Circles */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35" viewBox="0 0 400 260">
                    <circle cx="200" cy="130" r="42" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="200" cy="130" r="82" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" opacity="0.6" />
                    <circle cx="200" cy="130" r="126" fill="none" stroke={currentTrack.themeColor} strokeWidth="1" strokeDasharray="4 6" opacity="0.35" />
                    <circle cx="200" cy="130" r="170" fill="none" stroke={currentTrack.themeColor} strokeWidth="0.75" opacity="0.2" />
                    <line x1="0" y1="130" x2="400" y2="130" stroke={currentTrack.themeColor} strokeWidth="0.5" opacity="0.15" />
                    <line x1="200" y1="0" x2="200" y2="260" stroke={currentTrack.themeColor} strokeWidth="0.5" opacity="0.15" />
                  </svg>

                  {/* Ambient Radial Color Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${currentTrack.glowColor} 0%, rgba(7, 13, 7, 0) 70%)`,
                    }}
                  />

                  {/* Center Glowing Icon with Pop Animation */}
                  <div className="relative z-10 th-plate-icon">
                    <TrackVisualIcon id={currentTrack.id} color={currentTrack.themeColor} />
                  </div>
                </div>

                {/* Bottom-Right "DRAG TO MORPH" */}
                <span className="th-plate-hint flex items-center gap-1">
                  <span>DRAG TO MORPH</span>
                  <svg className="w-2.5 h-2.5 opacity-60" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Right: The Brief */}
            <div className="th-brief">
              <span className="th-brief-seat">{currentTrack.seat}</span>

              {/* Title with Masked Slide-Up */}
              <h3 className="th-brief-title" key={`title-${currentTrack.id}`}>
                <span className="th-mask-line">
                  <span className="th-mask-inner">{currentTrack.name}</span>
                </span>
              </h3>

              <span className="th-brief-rule" aria-hidden="true">
                <i />
              </span>

              {/* Tagline */}
              <p className="th-brief-line" key={`tagline-${currentTrack.id}`}>
                {currentTrack.tagline}
              </p>

              {/* Summary */}
              <p className="th-brief-summary" key={`summary-${currentTrack.id}`}>
                {currentTrack.summary}
              </p>

              {/* Prompts Checklist */}
              <ul className="th-prompts" key={`prompts-${currentTrack.id}`}>
                {currentTrack.prompts.map((prompt, i) => (
                  <li key={`${currentTrack.id}-${i}`} className="th-prompt-item" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className="th-check-badge" style={{ color: currentTrack.themeColor, backgroundColor: `${currentTrack.themeColor}18` }}>
                      <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                      </svg>
                    </span>
                    <span className="text-white/80 leading-snug">{prompt}</span>
                  </li>
                ))}
              </ul>

              {/* Quick-advance action row */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all bg-[#70F35D]/15 hover:bg-[#70F35D]/25 text-[#E0F8D9] border border-[#70F35D]/30 hover:border-[#70F35D]/50 cursor-pointer"
                >
                  <span>{activeIdx < tracks.length - 1 ? `Next: ${tracks[activeIdx + 1].name}` : "Explore Future Scope"}</span>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="text-xs text-[#70F35D]/60 font-mono">
                  0{activeIdx + 1} / 0{tracks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rail with 6 Horizontal Dwell Tabs */}
        <div className="th-rail-reveal w-full mt-10 md:mt-14">
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
          display: flex;
          justify-content: center;
        }

        /* ── Two-Column Grid: Proportional & Tightly Contained ── */
        .th-stage {
          display: grid;
          grid-template-columns: minmax(0, 520px) minmax(0, 540px);
          gap: clamp(2rem, 4.5vw, 3.5rem);
          align-items: center;
          justify-content: center;
          width: 100%;
          text-align: left;
        }

        /* ── Left: The Morphing Plate (Fixed proportional aspect ratio) ── */
        .th-plate {
          position: relative;
          width: 100%;
          max-width: 520px;
          height: clamp(310px, 36vw, 360px);
          aspect-ratio: 16 / 10.5;
          border-radius: 20px;
          overflow: hidden;
          background: #070D07;
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            0 24px 60px -20px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(112, 243, 93, 0.08);
          perspective: 1000px;
        }

        .th-plate-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* ── Smooth Morphing Card In Animation ── */
        @keyframes cardInRight {
          0% {
            transform: translate3d(32px, 0, 0) scale(0.93) rotateY(-5deg);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes cardInLeft {
          0% {
            transform: translate3d(-32px, 0, 0) scale(0.93) rotateY(5deg);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }

        .animate-card-in-right {
          animation: cardInRight 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-card-in-left {
          animation: cardInLeft 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Icon pop entrance */
        @keyframes iconPop {
          0% {
            transform: scale(0.72);
            opacity: 0;
          }
          60% {
            transform: scale(1.04);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .th-plate-icon {
          animation: iconPop 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Outlined Index Number */
        .th-plate-index {
          position: absolute;
          left: clamp(1rem, 2vw, 1.5rem);
          top: clamp(0.7rem, 1.5vw, 1rem);
          z-index: 4;
          font-size: clamp(3.2rem, 6vw, 4.5rem);
          line-height: 1;
          letter-spacing: 0.02em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(240, 250, 230, 0.35);
          pointer-events: none;
          animation: indexSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes indexSlideIn {
          0% {
            transform: translateY(-14px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .th-plate-hint {
          position: absolute;
          right: clamp(1rem, 2vw, 1.4rem);
          bottom: clamp(0.8rem, 1.6vw, 1.2rem);
          z-index: 4;
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240, 250, 230, 0.42);
          pointer-events: none;
        }

        /* ── Right: The Brief ── */
        .th-brief {
          display: flex;
          flex-direction: column;
          max-width: 540px;
        }

        .th-brief-seat {
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #70F35D;
        }

        .th-brief-title {
          margin: 0.5rem 0 0;
          font-family: var(--font-headingNow), var(--font-dm_sans), sans-serif;
          font-size: clamp(1.5rem, 14px + 1.8vw, 2.35rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.028em;
          color: #F1F7E9;
          text-wrap: balance;
        }

        .th-mask-line {
          display: block;
          overflow: hidden;
        }
        .th-mask-inner {
          display: block;
          animation: maskSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes maskSlideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .th-brief-rule {
          display: block;
          width: 100%;
          height: 1px;
          margin-block: clamp(0.75rem, 1.5vw, 1.1rem);
        }
        .th-brief-rule i {
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.12);
        }

        .th-brief-line {
          font-family: var(--font-headingNow), var(--font-dm_sans), sans-serif;
          font-size: clamp(0.95rem, 1.35vw, 1.12rem);
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.016em;
          color: rgba(235, 246, 226, 0.95);
          text-wrap: pretty;
          animation: briefFadeIn 0.4s ease-out forwards;
        }

        .th-brief-summary {
          margin-top: 0.65rem;
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.82rem, 1.05vw, 0.92rem);
          line-height: 1.6;
          color: rgba(214, 230, 203, 0.65);
          text-wrap: pretty;
          animation: briefFadeIn 0.45s ease-out 0.05s forwards;
        }

        @keyframes briefFadeIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        .th-prompts {
          list-style: none;
          margin: clamp(0.85rem, 1.8vw, 1.25rem) 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .th-prompt-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.8rem, 0.98vw, 0.88rem);
          line-height: 1.4;
          animation: promptSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes promptSlideIn {
          0% {
            opacity: 0;
            transform: translateX(12px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .th-check-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 9999px;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* ── Bottom Tabs Rail ── */
        .th-rail-reveal {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .th-rail {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: clamp(0.6rem, 1.2vw, 1rem);
          width: 100%;
          max-width: 1100px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: clamp(0.9rem, 1.8vw, 1.3rem);
        }

        .th-tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;
          padding: 0.35rem 0 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: opacity 200ms ease;
        }

        .th-tab-num {
          font-family: var(--font-geist_mono), monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: rgba(190, 224, 168, 0.45);
          transition: color 200ms ease;
        }

        .th-tab-name {
          font-family: var(--font-dm_sans), sans-serif;
          font-size: clamp(0.75rem, 0.95vw, 0.86rem);
          font-weight: 500;
          letter-spacing: -0.012em;
          line-height: 1.22;
          color: rgba(226, 240, 216, 0.48);
          transition: color 200ms ease;
          text-wrap: balance;
        }

        .th-tab:hover .th-tab-name {
          color: rgba(226, 240, 216, 0.88);
        }

        .th-tab.is-active .th-tab-num {
          color: #70F35D;
          font-weight: 700;
        }
        .th-tab.is-active .th-tab-name {
          color: #FFFFFF;
          font-weight: 700;
        }

        .th-tab-bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        /* Timed progress dwell bar over 6s */
        .th-tab-bar i {
          display: block;
          height: 100%;
          width: 100%;
          background: #70F35D;
          box-shadow: 0 0 8px #70F35D;
          transform-origin: left center;
          animation: th-dwell 6s linear forwards;
        }

        .th-tab-bar i.is-completed {
          display: block;
          height: 100%;
          width: 100%;
          background: rgba(112, 243, 93, 0.35);
          box-shadow: none;
          animation: none;
          transform: scaleX(1);
        }

        .th-plate:hover .th-plate-hint {
          color: rgba(240, 250, 230, 0.85);
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
          outline: 2px solid #70F35D;
          outline-offset: 4px;
          border-radius: 4px;
        }

        @media (max-width: 960px) {
          .th-stage {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
            justify-items: center;
          }
          .th-plate {
            max-width: 480px;
            height: clamp(280px, 50vw, 320px);
          }
          .th-brief {
            max-width: 480px;
          }
          .th-rail {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 1rem;
          }
        }

        @media (max-width: 600px) {
          .th-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-card-in-right,
          .animate-card-in-left,
          .th-plate-icon,
          .th-mask-inner,
          .th-brief-line,
          .th-brief-summary,
          .th-prompt-item {
            animation: none !important;
            transform: none !important;
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
