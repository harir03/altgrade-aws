import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CrowdCanvas } from "@/features/pitch/sections/Footer/components/CrowdCanvas";
import { AltGradeLogo } from "@/components/altgrade-logo";
import { ArrowUpRight, MessageSquare, ShieldCheck, Mail, ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Parallax upward lift on giant footer wordmark
      gsap.from(".footer-wordmark-wrap", {
        y: "14%",
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer-art-zone",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-transparent text-[#142617] overflow-hidden flex flex-col">
      {/* Upper Art Zone: Crowd Canvas + Giant Wordmark */}
      <div className="footer-art-zone relative min-h-[clamp(240px,56vh,640px)] h-[clamp(240px,56vh,640px)] w-full overflow-hidden select-none flex flex-col justify-end">
        {/* Luminous radial glow behind the letters */}
        <div className="footer-aurora" aria-hidden="true" />

        {/* Giant ALTGRADE Wordmark */}
        <div className="footer-wordmark-wrap">
          <span className="sr-only">
            ALTGRADE — AI-Powered Alternate Credit Scoring & Inclusive Banking
          </span>
          <div
            className="warp-text relative w-full max-w-[100vw] h-full pointer-events-auto flex items-end justify-center"
            role="heading"
            aria-level={2}
            aria-label="ALTGRADE"
          >
            <AltGradeLogo variant="footer" />
          </div>
        </div>

        {/* Doodle Army Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <CrowdCanvas
            src="https://www.recursiveacm.in/images/peeps/all-peeps.png"
            rows={15}
            cols={7}
          />
        </div>

        {/* Seamless Blend Fade into Dark Footer Base */}
        <div className="footer-cutout-fade" aria-hidden="true" />
      </div>

      {/* Real Senior Closure Block: Functional Links, Legal, Community, Contact */}
      <div className="relative z-30 bg-[#060D07] border-t border-lime-900/40 text-stone-300 pt-12 pb-16 px-5 md:px-14">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-lime-950/80">
            {/* Col 1 & 2: Mission & Manifesto */}
            <div className="lg:col-span-2 flex flex-col justify-between pr-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-[#8FC45A]" />
                  <span className="font-headingNow font-black text-xl uppercase tracking-wider text-white">
                    ALTGRADE
                  </span>
                </div>
                <p className="font-dm_sans text-stone-300/85 text-sm md:text-base leading-relaxed max-w-md">
                  AI-Powered Hyper-Personalized Alternate Credit for Bharat. Evaluating real everyday cash flow, utility regularity, and UPI consistency to unlock dignified loans with zero bureaucratic gatekeeping.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-geist_mono text-lime-400">
                <ShieldCheck className="w-4 h-4 text-[#8FC45A]" />
                <span>DPDP Act 2023 Compliant · Zero Bureau Inquiries</span>
              </div>
            </div>

            {/* Col 3: Product & Portals */}
            <div className="space-y-3 font-dm_sans text-sm">
              <span className="text-xs font-geist_mono uppercase tracking-widest text-lime-400 font-semibold block mb-4">
                Platforms & Apps
              </span>
              <ul className="space-y-2.5">
                <li>
                  <a href="/sign-in" className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5">
                    <span>Loan Officer Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
                <li>
                  <a href="/sign-in?role=farmer" className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5">
                    <span>Borrower Experience</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
                <li>
                  <a href="/score" className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5">
                    <span>Live Credit Engine</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
                <li>
                  <a href="/advisor" className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5">
                    <span>Mitra Vernacular AI</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Community & Event */}
            <div className="space-y-3 font-dm_sans text-sm">
              <span className="text-xs font-geist_mono uppercase tracking-widest text-lime-400 font-semibold block mb-4">
                Hackathon & Guild
              </span>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://apply.devfolio.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Apply on Devfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/altgrade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-lime-300 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Builder Discord</span>
                    <MessageSquare className="w-3.5 h-3.5 text-lime-400/80" />
                  </a>
                </li>
                <li>
                  <a href="#themes" className="text-stone-300 hover:text-lime-300 transition-colors">
                    Six Problem Tracks
                  </a>
                </li>
                <li>
                  <a href="#venue" className="text-stone-300 hover:text-lime-300 transition-colors">
                    GNIT Kolkata Venue
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Contact & Governance */}
            <div className="space-y-3 font-dm_sans text-sm">
              <span className="text-xs font-geist_mono uppercase tracking-widest text-lime-400 font-semibold block mb-4">
                Get in Touch
              </span>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-stone-300">
                  <Mail className="w-4 h-4 text-lime-400 shrink-0" />
                  <a href="mailto:contact@altgrade.in" className="hover:text-lime-300 transition-colors">
                    contact@altgrade.in
                  </a>
                </li>
                <li className="text-xs text-stone-400 leading-relaxed pt-1">
                  Guru Nanak Institute of Technology, Panihati, Sodepur, Kolkata 700114
                </li>
                <li className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-lime-950/80 text-lime-300 border border-lime-800/40">
                    October 08, 2026
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-geist_mono text-stone-400">
            <p>
              © 2026 AltGrade Inc. &amp; GNIT ACM Student Chapter. Crafted with pride for Bharat.
            </p>

            <div className="flex items-center gap-6">
              <a href="#about" className="hover:text-lime-300 transition-colors">
                Lore
              </a>
              <a href="#faq" className="hover:text-lime-300 transition-colors">
                FAQ
              </a>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#5C8C3A] text-stone-200 hover:text-white transition-all cursor-pointer"
                title="Scroll back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-art-zone {
          margin-top: clamp(2rem, 5vh, 4rem);
        }

        .footer-wordmark-wrap {
          position: absolute;
          inset-inline: 0;
          bottom: clamp(-2.8rem, -4.8vh, -1.5rem);
          height: min(clamp(280px, 56vh, 640px), 92%);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          pointer-events: auto;
          user-select: none;
          padding-inline: clamp(0.2rem, 1.2vw, 1rem);
        }

        @media (max-width: 1024px) {
          .footer-art-zone {
            min-height: clamp(240px, 44vw, 440px);
            height: clamp(240px, 44vw, 440px);
            margin-top: clamp(1.5rem, 3vh, 2.5rem);
          }
          .footer-wordmark-wrap {
            bottom: clamp(-1.8rem, -3.2vh, -0.9rem);
            height: 94%;
            padding-inline: 1vw;
          }
        }

        @media (max-width: 620px) {
          .footer-art-zone {
            min-height: clamp(200px, 54vw, 290px);
            height: clamp(200px, 54vw, 290px);
            margin-top: 1rem;
          }
          .footer-wordmark-wrap {
            bottom: 0;
            height: 96%;
            padding-inline: 0;
          }
        }

        .footer-aurora {
          position: absolute;
          inset: auto 0 0 0;
          height: 75%;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% 88%, rgba(143, 196, 90, 0.22) 0%, rgba(92, 140, 58, 0.06) 55%, transparent 85%),
            radial-gradient(ellipse 50% 40% at 15% 80%, rgba(200, 224, 180, 0.24) 0%, transparent 68%),
            radial-gradient(ellipse 50% 40% at 85% 80%, rgba(180, 215, 170, 0.24) 0%, transparent 68%);
        }

        .footer-cutout-fade {
          position: absolute;
          inset: auto 0 0 0;
          height: clamp(40px, 14%, 85px);
          z-index: 25;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(6, 13, 7, 0) 0%,
            rgba(6, 13, 7, 0.5) 35%,
            rgba(6, 13, 7, 0.92) 75%,
            #060D07 100%
          );
        }
      `}</style>
    </footer>
  );
};