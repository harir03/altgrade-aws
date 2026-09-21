export const MobileMentorCarousel = () => {
  const futureScopes = [
    {
      seat: "Scope 01 · Q1 2027",
      title: "Satellite Crop Telemetry",
      category: "Geospatial Earth Observation",
      status: "In R&D",
      metric: "10m Resolution",
    },
    {
      seat: "Scope 02 · Q2 2027",
      title: "Offline ZK Credit Enclaves",
      category: "Privacy & Cryptography",
      status: "Prototyping",
      metric: "100% Offline",
    },
    {
      seat: "Scope 03 · Q2 2027",
      title: "ONDC Invoice Factoring",
      category: "Open Commerce Protocols",
      status: "Architected",
      metric: "< 60s Disbursal",
    },
    {
      seat: "Scope 04 · Q3 2027",
      title: "Mitra Dialect Audio Agents",
      category: "Acoustic NLP & Legal Tech",
      status: "In Pipeline",
      metric: "22 Regional Dialects",
    },
    {
      seat: "Scope 05 · Q3 2027",
      title: "Micro-Pension Micro-Sip",
      category: "Social Security Protocols",
      status: "Planned",
      metric: "₹10 Daily Sweep",
    },
    {
      seat: "Scope 06 · Q4 2027",
      title: "Diaspora Inflow Scoring",
      category: "Cross-Border Rails",
      status: "Under Review",
      metric: "6 Global Corridors",
    },
    {
      seat: "Scope 07 · Q4 2027",
      title: "Autonomous Fair-Lending Engine",
      category: "Responsible AI",
      status: "Governance",
      metric: "0.80 Rule Parity",
    },
    {
      seat: "Scope 08 · 2028 Horizon",
      title: "AWS Graviton4 Edge Clusters",
      category: "Sovereign Compute",
      status: "Hardware Spec",
      metric: "< 35ms P99 Latency",
    },
    {
      seat: "Scope 09 · 2028 Horizon",
      title: "e-NWR Commodity Underwriting",
      category: "Agritech Commodity Finance",
      status: "Planned",
      metric: "1,200+ Warehouses",
    },
  ];

  return (
    <div className="block md:hidden w-full overflow-hidden py-4">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 no-scrollbar snap-x snap-mandatory">
        {futureScopes.map((m, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[240px] aspect-[4/5] rounded-2xl bg-gradient-to-b from-stone-900/95 to-stone-950 p-5 flex flex-col justify-between border border-lime-900/40 snap-center shadow-lg relative overflow-hidden text-left"
          >
            <div className="flex justify-between items-center text-xs font-geist_mono">
              <span className="text-lime-400 font-semibold">{m.seat}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-500/40 font-semibold uppercase">
                {m.status}
              </span>
            </div>

            <div className="my-auto text-left py-4">
              <span className="text-[10px] uppercase font-geist_mono tracking-wider text-lime-400/80 block mb-1">
                {m.category}
              </span>
              <h4 className="text-base font-bold font-headingNow text-lime-50 leading-tight">
                {m.title}
              </h4>
            </div>

            <div className="text-[11px] text-lime-300 font-geist_mono pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-stone-400 text-[10px] uppercase">TARGET</span>
              <span className="font-semibold">{m.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
