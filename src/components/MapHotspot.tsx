import React from 'react';
import { FestivalZone } from '../types/festival';
import { ChevronRight, Sparkles } from 'lucide-react';

interface MapHotspotProps {
  zone: FestivalZone;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (zone: FestivalZone | null) => void;
  onSelect: (zone: FestivalZone) => void;
  disabled?: boolean;
}

export const MapHotspot: React.FC<MapHotspotProps> = ({
  zone,
  isSelected,
  isHovered,
  onHover,
  onSelect,
  disabled = false,
}) => {
  const { x, y, radiusX = 14, radiusY = 11 } = zone.coordinates;

  return (
    <div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${radiusX * 2}%`,
        height: `${radiusY * 2}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className="absolute pointer-events-auto z-20 flex items-center justify-center group"
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(zone)}
        onMouseEnter={() => onHover(zone)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(zone)}
        onBlur={() => onHover(null)}
        aria-label={`Explorar Zona ${zone.numberLabel}, ${zone.name.toLowerCase()}`}
        className={`relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 flex items-center justify-center outline-none touch-manipulation focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 ${
          isHovered || isSelected ? 'scale-105' : 'scale-100'
        }`}
      >
        {/* Ambient subtle living beacon (invites clicking) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="w-2.5 h-2.5 rounded-full opacity-60 animate-ping"
            style={{ backgroundColor: zone.color.primary }}
          />
        </div>

        {/* Animated aura / theatrical spotlight glow */}
        <div
          className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-300 pointer-events-none ${
            isHovered || isSelected
              ? 'opacity-100 border-2 shadow-2xl scale-105'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            borderColor: zone.color.primary,
            backgroundColor: `${zone.color.primary}22`,
            boxShadow: `0 0 35px ${zone.color.glow}, inset 0 0 20px ${zone.color.glow}`,
          }}
        />

        {/* Outer expanding ripple ring on hover */}
        <div
          className={`absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-300 ${
            isHovered || isSelected ? 'opacity-90 animate-ripple' : 'opacity-0'
          }`}
          style={{
            border: `2px solid ${zone.color.primary}`,
          }}
        />

        {/* Discrete floating indicator tooltip on hover */}
        <div
          className={`absolute -top-10 sm:-top-12 md:-top-14 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 z-30 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-2xl text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap bg-slate-900/95 text-white border border-white/20 backdrop-blur-md max-w-[85vw] ${
            isHovered
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
          <span className="truncate">Explorar {Number(zone.numberLabel) <= 8 ? `Zona ${zone.numberLabel}: ` : ''}{zone.name}</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 shrink-0" />
        </div>

        {/* Center clickable target touch aid */}
        <span className="sr-only">Explorar {zone.name}</span>
      </button>
    </div>
  );
};
