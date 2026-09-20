import React from 'react';

export interface AltGradeLogoProps {
  variant?: 'hero' | 'nav' | 'footer' | 'badge';
  theme?: 'dark' | 'light' | 'forest';
  className?: string;
  showSublabel?: boolean;
  sublabelText?: string;
}

/**
 * Creative ALTGRADE Logo Component
 * Modeled after the high-impact condensed brutalist aesthetic with signature 4-point star cutout
 * inside the letterform and spaced geometric sub-label.
 */
export const AltGradeLogo: React.FC<AltGradeLogoProps> = ({
  variant = 'nav',
  theme = 'light',
  className = '',
  showSublabel = true,
  sublabelText = 'ALTERNATE CREDIT FOR ALL',
}) => {
  const isDark = theme === 'dark' || theme === 'forest';

  const navTextColor = isDark ? 'text-[#F4F0E8]' : 'text-[#121A12]';
  const navStarColor = isDark ? 'text-[#8FC45A]' : 'text-[#121A12]';
  const navSubColor = isDark ? 'text-[#8FC45A]' : 'text-[#2F5527]';

  if (variant === 'nav') {
    return (
      <div className={`inline-flex flex-col items-start select-none ${className}`}>
        <div className="flex items-center">
          {/* Condensed Typography with 4-Point Star Notch */}
          <span className={`font-headingNow font-black text-[20px] md:text-[24px] tracking-[-0.04em] uppercase ${navTextColor} leading-none inline-flex items-center`}>
            <span>ALT</span>
            {/* 4-Point Star Sparkle in center like the 'U' in the reference image */}
            <svg
              className={`w-3.5 h-3.5 ${navStarColor} mx-0.5 animate-pulse`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
            </svg>
            <span>GRADE</span>
          </span>
        </div>
        {showSublabel && (
          <span className={`text-[7px] font-mono uppercase tracking-[0.24em] ${navSubColor} font-semibold mt-0.5`}>
            {sublabelText}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    const heroGradient = isDark
      ? 'linear-gradient(180deg, #FFFFFF 0%, #E8EFE2 45%, #C2E29B 75%, #8FC45A 100%)'
      : 'linear-gradient(180deg, #070e08 0%, #122014 42%, #1b331f 76%, #2d5232 100%)';
    const heroStarColor = isDark ? 'text-[#8FC45A]' : 'text-[#070e08]';
    const heroSubColor = isDark ? 'text-[#8FC45A]' : 'text-[#2F5527]';
    const heroRuleColor = isDark ? 'bg-[#8FC45A]/40' : 'bg-[#2F5527]/30';

    return (
      <div className={`flex flex-col items-center justify-center select-none w-full max-w-full ${className}`}>
        <div className="relative inline-flex items-center justify-center">
          {/* Main Giant Condensed Wordmark with 4-point star negative-space/glyph */}
          <div
            className="font-headingNow font-black text-[clamp(4.2rem,16vw,12.5rem)] tracking-[-0.045em] leading-[0.84] uppercase select-none text-center flex items-center justify-center"
            style={{
              background: heroGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: isDark
                ? 'drop-shadow(0 8px 32px rgba(143,196,90,0.3))'
                : 'drop-shadow(0 8px 28px rgba(0,0,0,0.22))',
            }}
          >
            <span>ALT</span>
            {/* Center Star Notch */}
            <span className="relative inline-flex items-center justify-center mx-[0.03em]">
              <svg
                className={`w-[0.52em] h-[0.52em] ${heroStarColor}`}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{
                  filter: isDark
                    ? 'drop-shadow(0 4px 14px rgba(143,196,90,0.5))'
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
                }}
              >
                <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
              </svg>
            </span>
            <span>GRADE</span>
          </div>
        </div>

        {showSublabel && (
          <div className="mt-3 md:mt-4 flex items-center justify-center gap-3">
            <span className={`h-px w-6 md:w-12 ${heroRuleColor}`} />
            <span className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.32em] ${heroSubColor} font-semibold text-center`}>
              {sublabelText}
            </span>
            <span className={`h-px w-6 md:w-12 ${heroRuleColor}`} />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    const footerGradient = isDark
      ? 'linear-gradient(180deg, #FFFFFF 0%, #E8EFE2 36%, #8FC45A 100%)'
      : 'linear-gradient(180deg, #070e08 0%, #0f1c12 36%, #1a301e 72%, #2c4e30 100%)';
    const footerStarColor = isDark ? 'text-[#8FC45A]' : 'text-[#070e08]';

    return (
      <div className={`flex flex-col items-center justify-center select-none w-full ${className}`}>
        <div
          className="font-headingNow font-black text-[min(clamp(7.5rem,34vw,42rem),60vh)] tracking-[-0.045em] leading-[0.80] uppercase select-none flex items-center justify-center"
          style={{
            background: footerGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <span>ALT</span>
          <span className="relative inline-flex items-center justify-center mx-[0.03em]">
            <svg
              className={`w-[0.48em] h-[0.48em] ${footerStarColor}`}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
            </svg>
          </span>
          <span>GRADE</span>
        </div>
      </div>
    );
  }

  // Badge / Compact
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 shadow-xs ${
        isDark
          ? 'border-[#8fc45a]/40 bg-[#121A12] text-[#F4F0E8]'
          : 'border-[#8fc45a]/30 bg-[#e8efe2]/90 text-[#121A12]'
      } ${className}`}
    >
      <svg
        className={`w-3 h-3 ${isDark ? 'text-[#8fc45a]' : 'text-[#121A12]'}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
      </svg>
      <span className="font-headingNow font-bold text-sm tracking-tight uppercase">
        ALTGRADE
      </span>
    </div>
  );
};
