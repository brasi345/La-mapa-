import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackToMapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const BackToMapButton: React.FC<BackToMapButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Volver al mapa"
      title="Volver al mapa"
      className="group relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-slate-900/85 hover:bg-slate-900 text-white border-2 border-white/30 hover:border-white shadow-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer touch-manipulation hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:outline-none"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-purple-600/85 group-hover:bg-purple-500 flex items-center justify-center transition-colors shadow-inner">
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white transition-transform group-hover:-translate-x-1" />
      </div>
    </button>
  );
};
