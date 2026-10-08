import React, { useState, useCallback } from 'react';
import { FestivalZone, InteriorFeature } from '../types/festival';
import { BackToMapButton } from './BackToMapButton';
import {
  Utensils,
  X,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

interface InteriorSceneProps {
  zone: FestivalZone;
  onBackToMap: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

// Accessible menu items for Zone 6 (Restauración)
const RESTAURANT_MENU_ITEMS = [
  {
    name: 'Hamburguesa IncluARTE Clásica',
    tag: '100% Vacuno Gourmet',
    desc: 'Carne jugosa de ternera, queso fundido, lechuga crujiente, tomate fresco y salsa suave especial en pan brioche artesano.',
    allergens: ['Sin gluten disponible', 'Opción sin lactosa'],
    price: '9,50 €',
  },
  {
    name: 'Burger Green Sensorial (Vegana)',
    tag: '100% Plant-Based',
    desc: 'Medallón artesanal de quinoa y setas, aguacate cremoso, canónigos y mayonesa vegana de albahaca en pan rústico.',
    allergens: ['100% Vegana', 'Sin lácteos', 'Sin huevo'],
    price: '9,00 €',
  },
  {
    name: 'Patatas Rústicas con Salsas',
    tag: 'Guarnición Crujiente',
    desc: 'Patatas cortadas a mano con sal marina aromatizada y dos salsas caseras a elegir.',
    allergens: ['Sin gluten', 'Vegano'],
    price: '4,00 €',
  },
  {
    name: 'Bebidas & Refrescos Artesanales',
    tag: 'Frías y sin azúcar',
    desc: 'Agua mineral, limonada casera con menta, kombucha ecológica y refrescos sin azúcar en envase reciclable.',
    allergens: ['Bebidas aptas para todos'],
    price: '2,50 €',
  },
];

export const InteriorScene: React.FC<InteriorSceneProps> = ({
  zone,
  onBackToMap,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<InteriorFeature | null>(null);
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);

  // Mouse parallax motion for dynamic 2.5D presence
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX / width - 0.5) * 16;
    const yPct = (clientY / height - 0.5) * 14;
    setParallaxOffset({ x: -xPct, y: -yPct });
  }, []);

  return (
    <div
      tabIndex={-1}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col justify-between select-none"
      aria-label={`Escena inmersiva de la Zona ${zone.numberLabel}: ${zone.name}`}
    >
      {/* BACKGROUND PHOTOREALISTIC PANORAMA WITH LIVING KEN-BURNS ZOOM & MOUSE DEPTH */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="w-full h-full transform transition-transform duration-500 ease-out animate-ken-burns"
          style={{
            transform: `scale(1.06) translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
          }}
        >
          <img
            src={zone.image}
            alt={zone.altText}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.dataset.triedFallback) return;
              target.dataset.triedFallback = 'true';
              if (zone.image.includes('plataforma_reservada')) {
                target.src = '/fotos/zona_extra_plataforma_reservada.jpg';
              } else if (zone.image.includes('aparcamiento_accesible')) {
                target.src = '/fotos/zona_extra_aparcamiento_accesible.jpg';
              }
            }}
            className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.03] saturate-[1.05]"
          />
        </div>

        {/* REFINED BORDERS & VIGNETTE: Soft smooth edge feathering eliminates harsh borders */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85),inset_0_0_40px_rgba(0,0,0,0.7)]"
        />

        {/* Top and Bottom soft dark gradients for clear contrast with controls and text */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none"
        />

        {/* LIVING AMBIENT SHEEN: Radial glow pulsing gently in zone accent color */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none animate-ambient-glow mix-blend-screen opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${zone.color.primary} 0%, transparent 65%)`,
          }}
        />

        {/* FLOATING AMBIENT FESTIVAL LIGHT PARTICLES */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '15%', bottom: '20%', delay: '0s', size: 'w-2 h-2', color: 'bg-amber-300' },
            { left: '35%', bottom: '15%', delay: '1.8s', size: 'w-1.5 h-1.5', color: 'bg-cyan-300' },
            { left: '55%', bottom: '25%', delay: '3.2s', size: 'w-2 h-2', color: 'bg-pink-300' },
            { left: '72%', bottom: '18%', delay: '1.2s', size: 'w-2.5 h-2.5', color: 'bg-purple-300' },
            { left: '88%', bottom: '22%', delay: '2.5s', size: 'w-1.5 h-1.5', color: 'bg-emerald-300' },
            { left: '25%', bottom: '30%', delay: '4.1s', size: 'w-1.5 h-1.5', color: 'bg-amber-200' },
            { left: '80%', bottom: '35%', delay: '5.0s', size: 'w-2 h-2', color: 'bg-violet-300' },
          ].map((p, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full ${p.color} ${p.size} blur-[0.5px] animate-particle-drift shadow-lg`}
              style={{
                left: p.left,
                bottom: p.bottom,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* ZONE-SPECIFIC ATMOSPHERIC ANIMATIONS */}
        {zone.id === 3 && (
          <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="w-64 h-16 rounded-full border-2 border-violet-400/40 animate-ping opacity-30" style={{ animationDuration: '3s' }} />
            <div className="w-96 h-24 rounded-full border border-cyan-400/30 animate-ping opacity-20 -mt-10" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        )}

        {zone.id === 2 && (
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1/2 pointer-events-none overflow-hidden opacity-35 mix-blend-screen">
            <div className="absolute top-0 left-1/4 w-32 h-96 bg-gradient-to-b from-fuchsia-500/50 via-purple-500/20 to-transparent transform -rotate-12 animate-stage-left" />
            <div className="absolute top-0 right-1/4 w-32 h-96 bg-gradient-to-b from-cyan-400/50 via-blue-500/20 to-transparent transform rotate-12 animate-stage-right" />
          </div>
        )}
      </div>

      {/* TOP BAR: ONLY THE SLEEK BACK BUTTON (FLECHA) */}
      <header className="relative z-30 w-full p-3 sm:p-4 md:p-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <BackToMapButton onClick={onBackToMap} />
        </div>
      </header>

      {/* PUNTOS INTERACTIVOS EN LA ESCENA */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {zone.interactiveFeatures?.map((feature) => (
          <div
            key={feature.id}
            style={{
              left: `${feature.x}%`,
              top: `${feature.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedFeature(feature)}
              aria-label={`Punto interactivo: ${feature.title}`}
              className="group relative flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-slate-900/85 hover:bg-white text-white hover:text-slate-900 border-2 border-white/70 shadow-2xl transition-all duration-300 hover:scale-125 focus-visible:ring-4 focus-visible:ring-purple-400 cursor-pointer touch-manipulation"
            >
              <span
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full"
                style={{ backgroundColor: zone.color.primary }}
              />
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-60"
                style={{ backgroundColor: zone.color.primary }}
              />

              {/* Tooltip con el nombre del punto */}
              <span className="hidden sm:block absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900/95 text-[11px] font-bold text-white whitespace-nowrap shadow-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
                {feature.title}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* INFORMACIÓN DEL PUNTO SELECCIONADO (ÚNICA INFORMACIÓN VISIBLE) */}
      {selectedFeature && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedFeature.title}
          className="fixed inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-6 md:bottom-8 max-w-lg mx-auto z-40 pointer-events-auto animate-fade-in"
        >
          <div className="rounded-2xl sm:rounded-3xl bg-slate-950/95 backdrop-blur-2xl border-2 border-white/20 p-4 sm:p-5 md:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,0,0,0.5)] max-h-[75dvh] overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg border border-white/20"
                  style={{ backgroundColor: zone.color.primary }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-black text-sm sm:text-base md:text-lg text-white leading-tight uppercase truncate sm:whitespace-normal">
                    {selectedFeature.title}
                  </h4>
                  {selectedFeature.tag && (
                    <span className="inline-block mt-0.5 text-[10px] sm:text-[11px] font-bold text-slate-300">
                      #{selectedFeature.tag} · Zona {zone.numberLabel}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0 touch-manipulation"
                aria-label="Cerrar información del punto"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 mt-2.5 sm:mt-3.5 leading-relaxed font-normal">
              {selectedFeature.description}
            </p>

            {/* Acceso a carta si el punto es de gastronomía en Zona 6 */}
            {zone.id === 6 && (selectedFeature.id === 'menu-pantalla' || selectedFeature.id === 'hamburguesas-bandeja') && (
              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Ver Carta Completa y Alérgenos</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ZONE 6 RESTAURANT ACCESSIBLE MENU MODAL */}
      {showMenuModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Carta accesible de la Hamburguesería IncluARTE"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-2xl max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-orange-500/50 p-4 sm:p-6 md:p-8 text-white shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500 flex items-center justify-center text-white shrink-0">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white truncate sm:whitespace-normal">
                    Carta de Restauración IncluARTE
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 line-clamp-1 sm:line-clamp-none">
                    Hamburguesas, comida y bebidas accesibles con indicación clara de alérgenos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMenuModal(false)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer shrink-0 touch-manipulation"
                aria-label="Cerrar carta"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-3.5">
              {RESTAURANT_MENU_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:border-orange-500/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className="font-extrabold text-white text-sm sm:text-base">{item.name}</h4>
                      <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-normal">
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1">
                      {item.allergens.map((al, aIdx) => (
                        <span
                          key={aIdx}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded bg-white/5 text-emerald-400 border border-emerald-500/30"
                        >
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{al}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-base sm:text-lg font-black text-orange-400 sm:text-right shrink-0">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5 sm:gap-3">
              <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Servicio asistido disponible: El personal de sala te acercará el pedido a la mesa adaptada si lo deseas. Sistema de aviso por vibración luminosa para personas sordas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
