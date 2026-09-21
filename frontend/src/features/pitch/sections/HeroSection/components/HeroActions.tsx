export const HeroActions = () => {
  return (
    <div className="hero-action-dock-split">
      <div className="devfolio-button-wrapper" style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "44px", height: "44px", width: "220px", maxWidth: "100%" }}>
        <a
          href="/applicant"
          aria-label="Launch Applicant Portal for instant credit evaluation"
          className="hero-dock-btn-primary"
          style={{
            width: "100%",
            height: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            backgroundColor: "#1F4517",
            borderRadius: "6px",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            textDecoration: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(31, 69, 23, 0.4)",
            border: "1px solid rgba(143, 196, 90, 0.5)",
            transition: "background-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
          }}
        >
          <svg className="w-4 h-4 text-[#8FC45A]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
          </svg>
          <span>Applicant Portal</span>
        </a>
      </div>

      <a
        href="/sign-in"
        className="hero-portal-btn"
        aria-label="Launch Loan Officer Decision Portal"
      >
        <span className="hero-portal-pip" />
        <span>Officer Portal</span>
        <span className="hero-portal-arrow">→</span>
      </a>

      <a
        href="#about"
        className="hero-discord-btn"
        aria-label="Read our credit inclusion thesis"
      >
        <svg className="w-4 h-4 text-[#2F5527]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span>Credit Thesis</span>
      </a>

      <style>{`
        .hero-action-dock-split {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-portal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 44px;
          padding: 0 1.15rem;
          border-radius: 6px;
          background: #121A12;
          color: #F4F0E8;
          border: 1px solid rgba(143, 196, 90, 0.35);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(18, 26, 18, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .hero-portal-btn:hover {
          background: #1d2d1d;
          border-color: #8FC45A;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(143, 196, 90, 0.25);
        }

        .hero-portal-btn:active {
          transform: scale(0.98);
        }

        .hero-portal-pip {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8FC45A;
          box-shadow: 0 0 8px #8FC45A;
          flex-shrink: 0;
        }

        .hero-portal-arrow {
          font-size: 1rem;
          line-height: 1;
          color: #8FC45A;
          transition: transform 180ms ease;
        }

        .hero-portal-btn:hover .hero-portal-arrow {
          transform: translateX(2px);
        }

        .hero-discord-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 44px;
          padding: 0 1.05rem;
          border-radius: 6px;
          background: #FFFFFF;
          color: #23272A;
          border: 1px solid rgba(0, 0, 0, 0.12);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .hero-discord-btn:hover {
          background: #F8F9FE;
          color: #5865F2;
          border-color: rgba(88, 101, 242, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(88, 101, 242, 0.18);
        }

        .hero-discord-btn:active {
          transform: scale(0.98);
          background: #ECEFFB;
        }

        .hero-discord-icon {
          color: #5865F2;
          width: 1.15rem;
          height: 1.15rem;
          flex-shrink: 0;
          transition: transform 180ms ease;
        }

        .hero-discord-btn:hover .hero-discord-icon {
          transform: scale(1.06);
        }

        @media (max-width: 720px) {
          .hero-action-dock-split {
            flex-direction: column;
            width: calc(100vw - 2rem);
            max-width: 18rem;
            align-items: stretch;
          }
          .hero-action-dock-split .devfolio-button-wrapper,
          .hero-portal-btn,
          .hero-discord-btn {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};