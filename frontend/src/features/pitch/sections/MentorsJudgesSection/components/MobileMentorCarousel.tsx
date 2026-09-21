export const MobileMentorCarousel = () => {
  const mentors = [
    {
      seat: "Seat 01",
      title: "Central Banking & Compliance",
      category: "Regulatory Architecture",
    },
    {
      seat: "Seat 02",
      title: "Privacy & Cryptography",
      category: "Zero-Knowledge Proofs",
    },
    {
      seat: "Seat 03",
      title: "Rural Economic Intelligence",
      category: "Agri-Fintech Systems",
    },
    {
      seat: "Seat 04",
      title: "Acoustic AI & Vernacular NLP",
      category: "Voice Underwriting",
    },
    {
      seat: "Seat 05",
      title: "Data Protection & Ethics",
      category: "DPDP Governance",
    },
    {
      seat: "Seat 06",
      title: "Institutional Capital",
      category: "NBFC Partnerships",
    },
    {
      seat: "Seat 07",
      title: "Algorithmic Fairness",
      category: "Anti-Bias Auditing",
    },
    {
      seat: "Seat 08",
      title: "Sovereign Infrastructure",
      category: "Financial Cloud Edge",
    },
    {
      seat: "Seat 09",
      title: "Financial Inclusion Impact",
      category: "Merchant Advocacy",
    },
  ];

  return (
    <div className="block md:hidden w-full overflow-hidden py-4">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 no-scrollbar snap-x snap-mandatory">
        {mentors.map((m, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[240px] aspect-[4/5] rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950 p-5 flex flex-col justify-between border border-lime-900/30 snap-center shadow-lg relative overflow-hidden"
          >
            <div className="flex justify-between items-center text-xs font-geist_mono">
              <span className="text-lime-400 font-semibold">{m.seat}</span>
              <span className="px-2 py-0.5 rounded-full bg-lime-950 text-lime-300/80 text-[10px] border border-lime-800/40 uppercase">
                Sealed
              </span>
            </div>

            <div className="my-auto text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-lime-900/20 border border-lime-700/30 flex items-center justify-center text-lime-300 font-bold text-xl mb-3">
                ?
              </div>
              <span className="text-xs uppercase font-geist_mono tracking-wider text-lime-400/80 block mb-1">
                {m.category}
              </span>
              <h4 className="text-base font-bold font-headingNow text-lime-50 leading-tight">
                {m.title}
              </h4>
            </div>

            <div className="text-[10px] text-stone-500 font-mono text-center">
              LOCKED UNTIL REVEAL
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
