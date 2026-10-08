import React, { useEffect, useState } from 'react';
import { FestivalZone, ExperienceState } from '../types/festival';

interface CinematicTransitionProps {
  state: ExperienceState;
  activeZone: FestivalZone | null;
  onEnterComplete: () => void;
  onExitComplete: () => void;
  prefersReducedMotion?: boolean;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  state,
  activeZone,
  onEnterComplete,
  onExitComplete,
  prefersReducedMotion = false,
}) => {
  const [stageProgress, setStageProgress] = useState<number>(0);

  useEffect(() => {
    if (state === 'ENTERING') {
      setStageProgress(0);
      const duration = prefersReducedMotion ? 400 : 1500;
      
      const startTime = performance.now();
      let animId: number;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        setStageProgress(p);

        if (p < 1) {
          animId = requestAnimationFrame(step);
        } else {
          onEnterComplete();
        }
      };

      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    } else if (state === 'EXITING') {
      setStageProgress(1);
      const duration = prefersReducedMotion ? 350 : 1100;
      
      const startTime = performance.now();
      let animId: number;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.max(0, 1 - elapsed / duration);
        setStageProgress(p);

        if (p > 0) {
          animId = requestAnimationFrame(step);
        } else {
          onExitComplete();
        }
      };

      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    }
  }, [state, activeZone, prefersReducedMotion, onEnterComplete, onExitComplete]);

  if (state === 'MAP' || state === 'INTERIOR' || !activeZone) {
    return null;
  }

  const { x, y } = activeZone.coordinates;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden transition-colors"
      style={{
        backgroundColor: `rgba(15, 23, 42, ${stageProgress * 0.7})`,
      }}
    >
      {/* Radial Zoom Tunnel Centered at Target Hotspot */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          background: `radial-gradient(circle at ${x}% ${y}%, transparent 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.95) 100%)`,
          opacity: stageProgress,
        }}
      />

      {/* Light Flash / Warp Flare when approaching maximum zoom */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: Math.max(0, (stageProgress - 0.7) * 3.3),
          background: `radial-gradient(circle at ${x}% ${y}%, ${activeZone.color.primary}33 0%, #0f172a 75%)`,
        }}
      />

      {/* Cinematic Speed Rings */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen"
          style={{
            transformOrigin: `${x}% ${y}%`,
            transform: `scale(${1 + stageProgress * 2.5})`,
          }}
        >
          <div
            className="w-96 h-96 rounded-full border-4 border-dashed"
            style={{
              borderColor: activeZone.color.primary,
              animation: 'spin 4s linear infinite',
            }}
          />
        </div>
      )}

      {/* Status HUD indicator during transition */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/90 border border-white/20 text-white backdrop-blur-md shadow-2xl max-w-[90vw] min-w-0">
        <span
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-ping shrink-0"
          style={{ backgroundColor: activeZone.color.primary }}
        />
        <span className="text-xs sm:text-sm font-medium tracking-wide truncate">
          {state === 'ENTERING'
            ? `Entrando en Zona ${activeZone.numberLabel}: ${activeZone.name}...`
            : `Regresando al mapa del festival...`}
        </span>
      </div>
    </div>
  );
};
