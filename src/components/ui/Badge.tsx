import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'cyan' | 'green' | 'purple' | 'amber' | 'orange' | 'red' | 'rose' | 'gray' | 'success' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantClasses = {
    orange: 'bg-[#FF7A18]/15 text-[#FF8C32] border border-[rgba(255,122,24,0.30)] shadow-[0_0_12px_rgba(255,122,24,0.20)]',
    amber: 'bg-[#FFB347]/15 text-[#FFB347] border border-[rgba(255,179,71,0.30)] shadow-[0_0_12px_rgba(255,179,71,0.15)]',
    blue: 'bg-[#FF7A18]/15 text-[#FF8C32] border border-[rgba(255,122,24,0.30)]',
    cyan: 'bg-[#FFB347]/15 text-[#FFB347] border border-[rgba(255,179,71,0.30)]',
    purple: 'bg-[#FF8C32]/15 text-[#FFB347] border border-[rgba(255,140,50,0.30)]',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    red: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    gray: 'bg-white/5 text-[#C5B5A8] border border-[rgba(255,248,240,0.12)]',
    neutral: 'bg-white/5 text-[#C5B5A8] border border-[rgba(255,248,240,0.12)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full shrink-0 tracking-wide ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
