import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/features/pitch/components/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

interface TrackData {
  id: string;
  num: string;
  name: string;
  seat: string;
  tagline: string;
  summary: string;
  prompts: string[];
}

const tracks: TrackData[] = [
  {
    id: "ai",
    num: "01",
    name: "AI & Intelligent Systems",
    seat: "Seat 01",
    tagline: "Kill the wrapper. Build intelligence that actually thinks, reasons, and executes.",
    summary:
      "Stop building glorified prompt wrappers. Engineer multi-agent swarms, local edge models running with zero latency, autonomous execution loops, and neuro-symbolic engines that solve deep real-world chaos.",
    prompts: [
      "Autonomous agent swarms executing real-world action loops",
      "Sub-second edge AI and zero-cloud local reasoning engines",
      "Neuro-symbolic pipelines that eradicate hallucinations",
    ],
  },
  {
    id: "fintech",
    num: "02",
    name: "FinTech & Digital Innovation",
    seat: "Seat 02",
    tagline: "Reinvent money, transactions, and verifiable value exchange.",
    summary:
      "Build the next frontier of financial primitives, fraud-proof transaction layers, algorithmic risk models, and localized payment infrastructure built for high-throughput resilience.",
    prompts: [
      "Zero-knowledge transaction validation and automated compliance",
      "Micro-lending protocols powered by verifiable real-time cash flow data",
      "Real-time fraud anomaly detectors with sub-5ms inference latency",
    ],
  },
  {
    id: "healthtech",
    num: "03",
    name: "HealthTech & Wellness",
    seat: "Seat 03",
    tagline: "Bridge patient care, clinical diagnostics, and preventative intelligence.",
    summary:
      "Design systems that empower physicians and individuals: medical imaging analytics, remote biometric monitoring, privacy-preserving health data synthesis, and preventative wellness engines.",
    prompts: [
      "On-device diagnostic assistants for low-connectivity clinics",
      "Federated learning frameworks for sensitive patient telemetry",
      "Personalized preventative care routines derived from longitudinal biometric streams",
    ],
  },
  {
    id: "cybersecurity",
    num: "04",
    name: "Cybersecurity & Digital Trust",
    seat: "Seat 04",
    tagline: "Defend against adversarial systems and protect user sovereignty.",
    summary:
      "Harden modern attack surfaces: real-time exploit intelligence, automated binary analysis, post-quantum cryptographic schemes, and resilient zero-trust architecture.",
    prompts: [
      "Autonomous defense honeypots that generate targeted mitigation signatures",
      "Cryptographic proof of personhood and deepfake detection pipelines",
      "Supply chain vulnerability auditing for distributed dependencies",
    ],
  },
  {
    id: "web3",
    num: "05",
    name: "Web3 & Blockchain",
    seat: "Seat 05",
    tagline: "Decentralized state machines, local-first protocols, and self-custody.",
    summary:
      "Construct sovereign tools without middle-men: cross-chain interoperability, decentralized identity protocols, verifiable computation, and decentralized physical infrastructure (DePIN).",
    prompts: [
      "DePIN architectures linking distributed IoT telemetry with smart contracts",
      "Account abstraction UX enabling seamless web2-to-web3 onboarding",
      "Decentralized consensus mechanisms optimized for high latency edge nodes",
    ],
  },
  {
    id: "open",
    num: "06",
    name: "Open Innovation",
    seat: "Seat 06",
    tagline: "Break boundaries. Solve the unsolvable problems.",
    summary:
      "For builders who refuse to be pigeonholed. Build radical climate solutions, urban mobility systems, educational tools, or novel software architectures that defy conventional categorization.",
    prompts: [
      "Hyper-localized community infrastructure and disaster response networks",
      "Creative coding, spatial computing, and accessible sensory interfaces",
      "Radical tools for thought, distributed learning, and cooperative ownership",
    ],
  },
];

const TRACK_DURATION_MS = 5500;

export const TracksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const currentTrack = tracks[activeIdx];

  // Observe whether the tracks section is in viewport to run timer only when visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Time-based auto-progression loop with requestAnimationFrame for smooth progress bar
  useEffect(() => {
    if (!isIntersecting || isPaused) return;

    let startTime = performance.now() - (progress / 100) * TRACK_DURATION_MS;
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const currentProg = Math.min(100, (elapsed / TRACK_DURATION_MS) * 100);
      setProgress(currentProg);

      if (elapsed >= TRACK_DURATION_MS) {
        setProgress(0);
        setActiveIdx((prev) => (prev + 1) % tracks.length);
        startTime = now;
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [activeIdx, isIntersecting, isPaused]);

  // Entrance animation for section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".tracks-stage-box", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Subtle content crossfade on track switch
  useEffect(() => {
    gsap.fromTo(
      ".track-anim-target",
      { opacity: 0.2, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.03 }
    );
  }, [activeIdx]);

  const handleSelectTrack = (idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
  };

  return (
    <section
      id="themes"
      ref={sectionRef}
      aria-label="The six tracks"
      className="box-border caret-transparent relative w-full pt-16 pb-20 px-5 text-center text-lime-50 scroll-mt-20 md:pt-28 md:pb-28 md:px-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div id="tracks" className="relative -top-14 h-0 pointer-events-none" aria-hidden="true" />
      
      <div className="max-w-[1376px] mx-auto flex flex-col items-center">
        <SectionHeader variant="artifactOnly" title="" />
        
        <SectionHeader
          variant="tracks"
          eyebrow="The six tracks"
          titleLineOne="Six directions"
          titleLineTwo="to build in."
          descriptionWords={[
            "One",
            "seat",
            "at",
            "the",
            "table",
            "for",
            "each.",
            "Pick",
            "the",
            "one",
            "you",
            "cannot",
            "stop",
            "thinking",
            "about",
            "—",
            "every",
            "track",
            "is",
            "judged",
            "on",
            "the",
            "same",
            "four",
            "criteria.",
          ]}
        />

        {/* Stage Container with pause on hover */}
        <div className="w-full mt-10 md:mt-16 text-left">
          <div className="tracks-stage-box grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center bg-stone-950/60 p-6 md:p-10 rounded-3xl border border-lime-900/30 shadow-2xl backdrop-blur-sm">
            {/* Visual Morphing Plate */}
            <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#060B05] border border-lime-900/40 p-6 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between items-center text-xs font-mono text-lime-400">
                <span className="track-anim-target text-3xl md:text-5xl font-bold font-headingNow text-lime-300">
                  {currentTrack.num}
                </span>
                <span className="px-3 py-1 bg-lime-950/80 rounded-full border border-lime-800/40 text-stone-300 uppercase tracking-wider text-[11px]">
                  Featured Track
                </span>
              </div>

              <div className="relative z-10 my-auto py-4">
                <span className="track-anim-target text-xs uppercase font-geist_mono tracking-widest text-lime-400 block mb-2">
                  {currentTrack.seat}
                </span>
                <h4 className="track-anim-target text-2xl md:text-3xl font-bold font-headingNow text-lime-50 leading-tight">
                  {currentTrack.name}
                </h4>
              </div>

              <div className="flex items-center justify-between text-stone-400 text-xs font-geist_mono pt-3 border-t border-lime-950">
                <span>GNIT ACM CHAPTER</span>
                <span>ALTGRADE 2026</span>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Brief / Details */}
            <div className="flex flex-col justify-center space-y-5">
              <div>
                <span className="track-anim-target inline-block text-xs uppercase font-geist_mono text-lime-400 font-semibold tracking-wider">
                  {currentTrack.seat}
                </span>
                <h3 className="track-anim-target text-2xl md:text-4xl font-semibold font-headingNow text-lime-50 mt-1">
                  {currentTrack.name}
                </h3>
              </div>

              <div className="h-px w-full bg-lime-900/30" />

              <p className="track-anim-target text-stone-200 font-medium text-base md:text-lg leading-relaxed font-dm_sans">
                {currentTrack.tagline}
              </p>

              <p className="track-anim-target text-stone-300/80 text-sm md:text-base leading-relaxed font-dm_sans">
                {currentTrack.summary}
              </p>

              <div className="pt-2">
                <span className="text-xs uppercase font-geist_mono text-lime-400/80 font-semibold tracking-wider block mb-3">
                  Inspiration Prompts
                </span>
                <ul className="space-y-2.5">
                  {currentTrack.prompts.map((prompt, i) => (
                    <li key={i} className="track-anim-target flex items-start gap-3 text-sm text-stone-200">
                      <span className="text-lime-400 mt-1 flex-shrink-0">◆</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Timed Segmented Control */}
          <div className="mt-8 flex justify-center w-full px-2" role="tablist" aria-label="Tracks">
            <div className="inline-flex max-w-full overflow-x-auto no-scrollbar items-center p-1.5 rounded-full bg-[#0D180F]/95 border border-lime-800/40 backdrop-blur-md shadow-xl gap-1">
              {tracks.map((track, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={track.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectTrack(idx)}
                    className={`relative overflow-hidden flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-geist_mono transition-colors duration-200 whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? "bg-[#5C8C3A] text-white font-semibold shadow-[0_2px_12px_rgba(92,140,58,0.45)]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {/* Real-time Timed Progress Bar on Active Tab */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 h-[2.5px] bg-lime-200 shadow-[0_0_8px_rgba(190,242,100,0.8)] pointer-events-none rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                    <span className={`relative z-10 text-[11px] font-bold ${isActive ? "text-lime-100" : "text-lime-400/80"}`}>
                      {track.num}
                    </span>
                    <span className="relative z-10 inline">{track.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

