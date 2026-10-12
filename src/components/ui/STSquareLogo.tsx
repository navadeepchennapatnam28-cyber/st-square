import React from 'react';

interface STSquareLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  collapsed?: boolean;
  className?: string;
}

export const STSquareLogo: React.FC<STSquareLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  collapsed = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const svgDimensions = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Futuristic ST² Liquid Glass Emblem */}
      <div
        className={`${iconDimensions} relative rounded-xl bg-gradient-to-br from-[#24130D] via-[#1A120E] to-[#100D0B] border border-[rgba(255,122,24,0.35)] shadow-[0_0_20px_rgba(255,122,24,0.25)] flex items-center justify-center shrink-0 group hover:border-[#FF8C32] hover:shadow-[0_0_28px_rgba(255,122,24,0.5)] transition-all duration-300`}
      >
        {/* Subtle ambient orange/amber inner glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7A18]/25 via-transparent to-[#FFB347]/15 pointer-events-none" />

        {/* Minimal Futuristic Geometric S with Exponential Squared ² Node */}
        <svg
          viewBox="0 0 24 24"
          className={`${svgDimensions} relative z-10 transition-transform duration-300 group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Dynamic Geometric S */}
          <path
            d="M17 6H7.5C5.84315 6 4.5 7.34315 4.5 9C4.5 10.6569 5.84315 12 7.5 12H16.5C18.1569 12 19.5 13.3431 19.5 15C19.5 16.6569 18.1569 18 16.5 18H6"
            stroke="url(#stSquareGradOrange)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Exponential Squared Dual Micro-Nodes */}
          <circle cx="18.5" cy="5.5" r="1.5" fill="#FFB347" />
          <path
            d="M17 3.5H19.5V5L17.5 6.5H19.5"
            stroke="#FFF8F0"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <defs>
            <linearGradient id="stSquareGradOrange" x1="4.5" y1="6" x2="19.5" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7A18" />
              <stop offset="0.5" stopColor="#FF8C32" />
              <stop offset="1" stopColor="#FFB347" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography: ST in bold white, superscript ² in glowing orange gradient */}
      {!collapsed && (
        <div className="leading-none">
          <div className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight text-[#FFF8F0] font-display">
              ST
            </span>
            <sup className="text-sm font-black bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] bg-clip-text text-transparent ml-0.5 drop-shadow-[0_0_8px_rgba(255,122,24,0.7)]">
              ²
            </sup>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#FF7A18]/15 text-[#FFB347] border border-[#FF7A18]/30 shadow-sm ml-2">
              HUB
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[9px] text-[#C5B5A8] font-bold tracking-widest mt-1 uppercase">
              STUDENT GROWTH HUB
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Also export alias ST2Logo for modern semantic use
export const ST2Logo = STSquareLogo;
