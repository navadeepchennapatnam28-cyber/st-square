import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'cyan' | 'orange' | 'subtle';
  hoverEffect?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 relative overflow-hidden';
  
  const variantClasses = {
    default: 'glass-panel text-[#FFF8F0]',
    orange: 'glass-panel-orange text-[#FFF8F0]',
    amber: 'bg-gradient-to-br from-[#FFB347]/10 via-[#1A120E]/90 to-[#100D0B]/95 border border-[rgba(255,179,71,0.30)] text-[#FFF8F0] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8)]',
    blue: 'glass-panel text-[#FFF8F0]',
    cyan: 'glass-panel-orange text-[#FFF8F0]',
    subtle: 'glass-panel-subtle text-[#FFF8F0]',
  };

  const hoverClasses = hoverEffect
    ? 'hover:-translate-y-1 hover:border-[#FF7A18]/50 hover:shadow-[0_16px_36px_rgba(255,122,24,0.20)] cursor-pointer transform-gpu'
    : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {/* 1. Subtle overall liquid glass sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-[#FF7A18]/[0.02] pointer-events-none" />

      {/* 2. Top crisp specular reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.45)] to-transparent pointer-events-none" />

      {/* 3. Top-left liquid corner glint (Zero filter overhead, pure radial gradient) */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12)_0%,rgba(255,224,163,0.04)_40%,transparent_70%)] pointer-events-none" />

      {/* 4. Bottom amber refraction rim */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF7A18]/25 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
