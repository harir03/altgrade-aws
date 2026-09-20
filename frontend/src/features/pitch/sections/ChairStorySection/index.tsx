import { RevealWords } from "@/features/pitch/components/RevealWords";

export const ChairStorySection = () => {
  const storyParagraph =
    "The plastic chair is an everyday staple across Kolkata, scattered on college terraces, roadside tea stalls, and neighborhood corners where people gather to talk for hours. For this hackathon, four of these chairs sit together on the hill as an open table for your team. You arrive with people you know or team up in the morning, claim your spot, and spend eight focused hours turning an idea into working software before the day ends.";

  return (
    <section
      id="about"
      aria-label="About the Chair"
      className="ab relative w-full bg-transparent text-[#111a12] pt-[clamp(6rem,13vh,10rem)] pb-[clamp(3.5rem,8vh,6.5rem)] overflow-hidden z-[1]"
    >
      <div className="ab-inner relative max-w-[96rem] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
        {/* Top Ornament */}
        <div className="ab-ornament-wrap flex justify-center mb-[clamp(1.2rem,2.2vh,1.8rem)]">
          <img
            src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png"
            alt=""
            aria-hidden="true"
            draggable="false"
            className="orn orn-light ab-crown block w-[clamp(114px,56.87px+15.87vw,260px)] h-auto max-w-full object-contain select-none pointer-events-none opacity-[0.88]"
          />
        </div>

        {/* Heading */}
        <div className="ab-head-wrap w-full text-center">
          <h2 className="rh ab-heading font-headingNow font-medium text-[clamp(2.6rem,5.8vw,4.6rem)] leading-[1.1] tracking-[-0.035em] text-[#111a12] text-center">
            <span className="rh-line flex justify-center">
              <span className="rh-inner">The Story of the Chair</span>
            </span>
          </h2>
        </div>

        {/* Story Text with Word-by-Word Scroll Glow Reveal */}
        <div className="ab-story-wrap mt-[clamp(2.75rem,6vh,4.5rem)] w-full max-w-[88rem]">
          <RevealWords
            paragraphs={[storyParagraph]}
            className="ab-story flex flex-col items-center text-center font-dm_sans text-[clamp(1.0rem,11.93px+1.13vw,1.65rem)] font-normal leading-[1.68] tracking-[-0.012em] text-[#18261A]"
          />
        </div>

        {/* Why We Built AltGrade Problem & Solution Card */}
        <div className="ab-altgrade-mission mt-[clamp(3.5rem,7vh,5.5rem)] w-full max-w-[78rem] p-7 md:p-12 rounded-3xl bg-white/75 border border-[#2F5527]/15 shadow-[0_12px_44px_rgba(20,40,22,0.06)] backdrop-blur-sm text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#2F5527]/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8FC45A] animate-pulse" />
              <span className="text-xs uppercase font-semibold font-geist_mono tracking-widest text-[#2F5527]">
                WHY WE BUILT ALTGRADE · THE ZERO-CIBIL PARADOX
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-geist_mono font-medium bg-[#8FC45A]/15 text-[#21421b] border border-[#8FC45A]/30">
              Financial Dignity for Bharat
            </span>
          </div>

          <h3 className="mt-6 text-2xl md:text-4xl font-semibold font-headingNow text-[#121A12] leading-[1.2] tracking-tight">
            Good banking history, but no traditional CIBIL? You shouldn't be credit-invisible.
          </h3>

          <p className="mt-5 font-dm_sans text-base md:text-xl text-[#18261A]/90 font-normal leading-relaxed text-pretty">
            Millions of hardworking Indians manage steady cash flow, run thriving local businesses, and pay utility bills on time every single month—yet traditional banks still turn them away with a blunt rejection simply because they don't carry a legacy CIBIL score. Traditional credit bureaus penalize people who don't already have old debt. We built <strong className="font-semibold text-[#1F4517]">AltGrade</strong> to permanently fix this divide. By analyzing high-frequency alternate signals like recurring UPI merchant flows, utility bill regularity, GST filings, and verified behavioral consistency, AltGrade creates an instant, equitable score that turns real-world honesty into approved credit—with full DPDP privacy and zero bureaucratic gatekeeping.
          </p>

          <div className="mt-8 pt-6 border-t border-[#2F5527]/10 flex flex-wrap items-center gap-2.5 md:gap-4 text-xs md:text-sm font-geist_mono text-[#244626]">
            <span className="px-3.5 py-1.5 rounded-full bg-[#182a14]/5 border border-[#5C8C3A]/20">
              ⚡ High-Velocity UPI Scoring
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#182a14]/5 border border-[#5C8C3A]/20">
              🛡️ Zero-Knowledge Edge AI
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#182a14]/5 border border-[#5C8C3A]/20">
              🌱 No Prior Debt Required
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#182a14]/5 border border-[#5C8C3A]/20">
              🇮🇳 Tailored for Bharat's Real Economy
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ab-story .rw-word {
          text-shadow: 0 0 14px rgba(92, 140, 58, 0.45);
        }
        .ab-story .rw-para {
          text-wrap: pretty;
        }
      `}</style>
    </section>
  );
};