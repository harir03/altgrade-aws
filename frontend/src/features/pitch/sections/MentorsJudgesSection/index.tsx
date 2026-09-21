import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/features/pitch/components/SectionHeader";
import { MentorGrid } from "@/features/pitch/sections/MentorsJudgesSection/components/MentorGrid";
import { MentorsCallToAction } from "@/features/pitch/sections/MentorsJudgesSection/components/MentorsCallsToAction";

gsap.registerPlugin(ScrollTrigger);

export const MentorsJudgesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Stagger entrance on desktop mentor cards
      gsap.from(".jd-grid > *", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".jd-grid",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // Subtle parallax rotation & scale on wax seal emblem
      gsap.to(".jseal-wax", {
        rotation: 4,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="judges"
      ref={sectionRef}
      aria-label="Governance and Risk Advisory Board"
      className="box-border caret-transparent relative w-full pt-[60px] pb-24 px-5 text-center text-lime-50 md:pt-28 md:pb-36 md:px-16 overflow-hidden"
    >
      <div className="max-w-[1376px] mx-auto flex flex-col items-center relative">
        <SectionHeader variant="artifactOnly" title="" />
        <SectionHeader
          variant="mentors"
          eyebrow="Governance & Risk Advisory"
          title="Advisory & Underwriting Board"
          description="Nine institutional disciplines: locked in governance. Our advisory board brings regulatory, cryptographic, and grassroots banking oversight."
        />
        <MentorGrid />
        <MentorsCallToAction />
      </div>
    </section>
  );
};
