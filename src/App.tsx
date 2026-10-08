import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FestivalZone, ExperienceState } from './types/festival';
import { FESTIVAL_ZONES } from './data/festivalZones';
import { OfficialFestivalMap } from './components/OfficialFestivalMap';
import { CinematicTransition } from './components/CinematicTransition';
import { InteriorScene } from './components/InteriorScene';
import { Ear } from 'lucide-react';
import { playEnterChime, playExitWhoosh, speakText, stopSpeaking } from './utils/audioFeedback';

export default function App() {
  const [experienceState, setExperienceState] = useState<ExperienceState>('MAP');
  const [activeZone, setActiveZone] = useState<FestivalZone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<FestivalZone | null>(null);

  // Accessibility state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Map zoom container ref for hardware-accelerated CSS transform
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Detect user system reduced-motion preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Preload all 8 interior images so transitions are instant and silky smooth
  useEffect(() => {
    FESTIVAL_ZONES.forEach((zone) => {
      const img = new Image();
      img.src = zone.image;
    });
  }, []);

  // Handle entering a zone with cinematic zoom
  const handleSelectZone = useCallback((zone: FestivalZone) => {
    if (experienceState === 'ENTERING' || experienceState === 'EXITING') return;

    setActiveZone(zone);
    setExperienceState('ENTERING');

    if (soundEnabled) {
      playEnterChime(zone.id);
    }
  }, [experienceState, soundEnabled]);

  // Callback when cinematic enter zoom completes
  const handleEnterComplete = useCallback(() => {
    setExperienceState('INTERIOR');
  }, []);

  // Handle returning back to map
  const handleBackToMap = useCallback(() => {
    if (experienceState !== 'INTERIOR' || !activeZone) return;

    stopSpeaking();
    setIsSpeaking(false);
    setExperienceState('EXITING');

    if (soundEnabled) {
      playExitWhoosh();
    }
  }, [experienceState, activeZone, soundEnabled]);

  // Callback when reverse exit zoom completes
  const handleExitComplete = useCallback(() => {
    setExperienceState('MAP');
    setActiveZone(null);
  }, []);

  // Keyboard navigation: 1-8 to visit zones, Esc to go back to map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Return to map on Escape
      if (e.key === 'Escape') {
        if (experienceState === 'INTERIOR') {
          handleBackToMap();
        }
        return;
      }

      // Quick numbers 1 to 9 and 0 when on map
      if (experienceState === 'MAP') {
        const num = parseInt(e.key, 10);
        if (!isNaN(num)) {
          const targetId = num === 0 ? 10 : num;
          const target = FESTIVAL_ZONES.find((z) => z.id === targetId);
          if (target) {
            handleSelectZone(target);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [experienceState, handleBackToMap, handleSelectZone]);

  // Toggle speech narration
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (activeZone) {
      setIsSpeaking(true);
      const textToSpeak = `${activeZone.name}. ${activeZone.quote} Servicios disponibles: ${activeZone.services.map((s) => s.title).join('. ')}`;
      speakText(textToSpeak, () => setIsSpeaking(false));
    }
  };

  // Compute CSS transform for the map container based on state machine
  const getMapTransformStyle = (): React.CSSProperties => {
    if (!activeZone) {
      return {
        transform: 'scale(1)',
        transformOrigin: 'center center',
        filter: 'none',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
      };
    }

    const { x, y } = activeZone.coordinates;
    const origin = `${x}% ${y}%`;

    if (experienceState === 'ENTERING') {
      const scale = prefersReducedMotion ? 1.4 : 4.8;
      const blur = prefersReducedMotion ? 'blur(1px)' : 'blur(5px)';
      return {
        transform: `scale(${scale})`,
        transformOrigin: origin,
        filter: blur,
        transition: prefersReducedMotion
          ? 'transform 0.4s ease-out, filter 0.4s ease-out'
          : 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1), filter 1.5s ease',
      };
    }

    if (experienceState === 'EXITING') {
      return {
        transform: 'scale(1)',
        transformOrigin: origin,
        filter: 'none',
        transition: prefersReducedMotion
          ? 'transform 0.35s ease-out, filter 0.35s ease-out'
          : 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.1s ease',
      };
    }

    if (experienceState === 'INTERIOR') {
      return {
        transform: prefersReducedMotion ? 'scale(1.4)' : 'scale(4.8)',
        transformOrigin: origin,
        filter: 'blur(8px)',
        opacity: 0,
        pointerEvents: 'none',
      };
    }

    return {
      transform: 'scale(1)',
      transformOrigin: 'center center',
      filter: 'none',
    };
  };

  return (
    <div
      className={`h-screen h-[100dvh] w-full max-w-[100vw] overflow-hidden flex flex-col font-sans selection:bg-purple-500 selection:text-white transition-colors duration-500 ${
        experienceState === 'INTERIOR' ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f5f0] text-stone-900'
      }`}
    >
      
      {/* ENCABEZADO PRINCIPAL ELEGANTE EN BLANCO ROTO */}
      {experienceState !== 'INTERIOR' && (
        <header className="relative w-full bg-[#fdfbf7] border-b border-stone-200/90 shrink-0 z-30 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.06)] select-none animate-fade-in transition-all">
          {/* Barra decorativa sutil con la gama de colores inclusiva del festival */}
          <div
            aria-hidden="true"
            className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 via-amber-400 via-emerald-400 to-cyan-400 opacity-90"
          />

          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex flex-row items-center justify-between gap-2 sm:gap-4">
            {/* Grupo de título con detalle gráfico de accesibilidad */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Emblema visual de accesibilidad cultural */}
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-500 p-[1.5px] shadow-sm shadow-purple-500/15 shrink-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-full h-full bg-[#fdfbf7] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                  <Ear className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>

              {/* Título principal y complemento visual */}
              <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 text-left min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 inline-flex items-center gap-1 sm:gap-1.5 leading-none">
                  <span className="text-stone-900">Festival</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-amber-500 to-cyan-500">
                    IncluARTE
                  </span>
                </h1>
                <span className="text-xs sm:text-lg md:text-xl font-bold text-stone-500 tracking-normal truncate">
                  · Recorrido virtual
                </span>
              </div>
            </div>

            {/* Indicador interactivo discreto adaptado a móvil y ordenador */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-stone-100/90 border border-stone-200/90 text-stone-600 text-xs sm:text-sm font-semibold shadow-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Toca o pulsa un número</span>
              <span className="sm:hidden text-[11px]">Explorar</span>
            </div>
          </div>
        </header>
      )}

      {/* MAIN VIEWPORT / CONTENEDOR DEL MAPA */}
      <main className="relative flex-1 w-full h-full flex flex-col items-center justify-center overflow-hidden p-2 sm:p-6 md:p-8 pt-2 sm:pt-6">
        
        {/* CINEMATIC TRANSITION OVERLAY */}
        <CinematicTransition
          state={experienceState}
          activeZone={activeZone}
          onEnterComplete={handleEnterComplete}
          onExitComplete={handleExitComplete}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* MAP VIEW CONTAINER CON TAMAÑO MÁS COMPACTO Y AIREADO */}
        <div
          ref={mapContainerRef}
          style={getMapTransformStyle()}
          className={`w-full h-full flex flex-col items-center justify-center p-1 sm:p-4 transition-opacity duration-300 ${
            experienceState === 'INTERIOR' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Official Map & Hotspot Matrix */}
          <OfficialFestivalMap
            zones={FESTIVAL_ZONES}
            selectedZone={activeZone}
            hoveredZone={hoveredZone}
            onHoverZone={setHoveredZone}
            onSelectZone={handleSelectZone}
            isZooming={experienceState === 'ENTERING' || experienceState === 'EXITING'}
          />
        </div>

        {/* INTERIOR SCENE (Visible when in INTERIOR state) */}
        {experienceState === 'INTERIOR' && activeZone && (
          <div className="absolute inset-0 z-40 w-full h-full animate-fade-in">
            <InteriorScene
              zone={activeZone}
              onBackToMap={handleBackToMap}
              isSpeaking={isSpeaking}
              onToggleSpeech={handleToggleSpeech}
            />
          </div>
        )}

      </main>
    </div>
  );
}
