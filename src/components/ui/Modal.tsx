import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-[#100D0B]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[rgba(26,18,14,0.92)] backdrop-blur-xl transform-gpu border border-[rgba(255,140,50,0.35)] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(255,122,24,0.25),inset_0_1.5px_1px_rgba(255,255,255,0.3)] overflow-hidden z-10 my-8`}
      >
        {/* Glow header ambient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347]" />
        <div className="absolute inset-x-0 top-1 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-[rgba(255,248,240,0.08)]">
          <div>
            <h3 className="text-xl font-bold text-[#FFF8F0] font-display">{title}</h3>
            {subtitle && <p className="text-xs text-[#C5B5A8] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#C5B5A8] hover:text-[#FF8C32] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
