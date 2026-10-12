import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#FF8500] shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    info: 'border-[#FF6A00]/40',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl bg-[#0A0A0A]/95 backdrop-blur-xl border ${borderMap[toast.type]} shadow-[0_15px_35px_rgba(0,0,0,0.85)] text-white`}
      >
        {iconMap[toast.type]}
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-white">{toast.title}</h4>
          {toast.message && <p className="text-xs text-[#A3A3A3] mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={hideToast}
          className="text-[#A3A3A3] hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
