export const MobileMentorCarousel = () => {
  const futureScopes = [
    {
      seat: "Scope 01 · Q1 2027",
      title: "Satellite Crop Telemetry",
      category: "Geospatial Earth Observation",
      status: "In R&D",
      metric: "10m Resolution",
      imageSrc: "/images/roadmap/satellite_crop.jpg",
    },
    {
      seat: "Scope 02 · Q2 2027",
      title: "Offline ZK Credit Enclaves",
      category: "Privacy & Cryptography",
      status: "Prototyping",
      metric: "100% Offline",
      imageSrc: "/images/roadmap/zk_enclave.jpg",
    },
    {
      seat: "Scope 03 · Q2 2027",
      title: "ONDC Invoice Factoring",
      category: "Open Commerce Protocols",
      status: "Architected",
      metric: "< 60s Disbursal",
      imageSrc: "/images/roadmap/ondc_invoice.jpg",
    },
    {
      seat: "Scope 04 · Q3 2027",
      title: "Mitra Dialect Audio Agents",
      category: "Acoustic NLP & Legal Tech",
      status: "In Pipeline",
      metric: "22 Regional Dialects",
      imageSrc: "/images/roadmap/dialect_audio.jpg",
    },
    {
      seat: "Scope 05 · Q3 2027",
      title: "Micro-Pension Micro-Sip",
      category: "Social Security Protocols",
      status: "Planned",
      metric: "₹10 Daily Sweep",
      imageSrc: "/images/roadmap/micro_pension.jpg",
    },
    {
      seat: "Scope 06 · Q4 2027",
      title: "Diaspora Inflow Scoring",
      category: "Cross-Border Rails",
      status: "Under Review",
      metric: "6 Global Corridors",
      imageSrc: "/images/roadmap/diaspora_inflow.jpg",
    },
    {
      seat: "Scope 07 · Q4 2027",
      title: "Autonomous Fair-Lending Engine",
      category: "Responsible AI",
      status: "Governance",
      metric: "0.80 Rule Parity",
      imageSrc: "/images/roadmap/fair_lending.jpg",
    },
    {
      seat: "Scope 08 · 2028 Horizon",
      title: "AWS Graviton4 Edge Clusters",
      category: "Sovereign Compute",
      status: "Hardware Spec",
      metric: "< 35ms P99 Latency",
      imageSrc: "/images/roadmap/graviton_edge.jpg",
    },
    {
      seat: "Scope 09 · 2028 Horizon",
      title: "e-NWR Commodity Underwriting",
      category: "Agritech Commodity Finance",
      status: "Planned",
      metric: "1,200+ Warehouses",
      imageSrc: "/images/roadmap/enwr_warehouse.jpg",
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
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={m.imageSrc}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-45 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-950/85 to-stone-950/95" />
            </div>

            <div className="flex justify-between items-center text-xs font-geist_mono relative z-10">
              <span className="text-lime-400 font-semibold">{m.seat}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-500/40 font-semibold uppercase">
                {m.status}
              </span>
            </div>

            <div className="my-auto text-left py-4 relative z-10">
              <span className="text-[10px] uppercase font-geist_mono tracking-wider text-lime-400/80 block mb-1">
                {m.category}
              </span>
              <h4 className="text-base font-bold font-headingNow text-lime-50 leading-tight">
                {m.title}
              </h4>
            </div>

            <div className="text-[11px] text-lime-300 font-geist_mono pt-2 border-t border-white/10 flex items-center justify-between relative z-10">
              <span className="text-stone-400 text-[10px] uppercase">TARGET</span>
              <span className="font-semibold">{m.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
