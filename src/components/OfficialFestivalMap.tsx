import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FestivalZone } from '../types/festival';
import { MapHotspot } from './MapHotspot';
import { Upload } from 'lucide-react';
import officialMapImage from '../assets/images/mapa_oficial_festival_incluarte_v2.jpg';

interface OfficialFestivalMapProps {
  zones: FestivalZone[];
  selectedZone: FestivalZone | null;
  hoveredZone: FestivalZone | null;
  onHoverZone: (zone: FestivalZone | null) => void;
  onSelectZone: (zone: FestivalZone) => void;
  isZooming: boolean;
}

export const OfficialFestivalMap: React.FC<OfficialFestivalMapProps> = ({
  zones,
  selectedZone,
  hoveredZone,
  onHoverZone,
  onSelectZone,
  isZooming,
}) => {
  // Map image source state
  const [mapSrc, setMapSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('incluarte_custom_map_image');
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return officialMapImage;
  });

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive mouse parallax tilt
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Process and permanently persist an uploaded map file
  const processMapFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    // 1. Instant local visual update
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setMapSrc(dataUrl);
        try {
          localStorage.setItem('incluarte_custom_map_image', dataUrl);
        } catch {
          // ignore storage limits
        }
      }
    };
    reader.readAsDataURL(file);

    // 2. Persist directly to project disk via dev server middleware
    fetch('/__upload_official_map', {
      method: 'POST',
      body: file,
    }).catch(() => {
      // ignore network errors if offline
    });
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isZooming) {
      setIsDragOver(true);
    }
  }, [isZooming]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processMapFile(file);
    }
  }, [processMapFile]);

  // Paste handler (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processMapFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processMapFile]);

  // Mouse parallax motion handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isZooming) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;

    // Gentle subtle tilt angle (max 2.5 degrees)
    setParallax({
      x: xRel * 3.5,
      y: yRel * -3.5,
    });
  }, [isZooming]);

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[min(100%,920px,calc((100dvh-100px)*1.413))] mx-auto flex flex-col items-center select-none transition-all ${
        isDragOver ? 'ring-4 ring-purple-500 rounded-3xl scale-[1.01]' : ''
      }`}
    >
      {/* Hidden file input for file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            processMapFile(file);
          }
        }}
      />

      {/* AMBIENT FESTIVAL BACKLIGHT (Soft glowing aura behind the map) */}
      <div
        aria-hidden="true"
        className="absolute -inset-2 sm:-inset-5 rounded-2xl sm:rounded-[36px] bg-gradient-to-tr from-purple-400/20 via-pink-400/15 to-cyan-400/20 blur-xl sm:blur-2xl opacity-70 pointer-events-none transition-opacity duration-700"
      />

      {/* OUTER MAP CONTAINER WITH REFINED BORDERS & SHADOW */}
      <div
        className="relative w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-[#fcf9f2] border border-stone-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] md:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300"
        style={{
          perspective: 1200,
        }}
      >
        {/* Responsive aspect ratio container: 1060 / 750 ≈ 70.75% height */}
        <div
          className="relative w-full"
          style={{ paddingBottom: '70.75%' }}
        >
          
          {/* CAMERA MOVEMENT LAYER: Integrates mouse parallax and gentle breathing (fixed 1:1 scale) */}
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${
              !isZooming ? 'animate-map-breathe' : ''
            }`}
            style={{
              transform: `rotateX(${parallax.y}deg) rotateY(${parallax.x}deg)`,
              transformOrigin: 'center center',
            }}
          >
            
            {/* Única imagen oficial del mapa principal */}
            <img
              src={mapSrc}
              alt="Mapa oficial interactivo del Festival IncluARTE con 8 zonas accesibles numeradas"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = '/fotos/mapa_oficial_festival_incluarte_v2.jpg';
                }
              }}
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Drag & drop visual overlay */}
            {isDragOver && (
              <div className="absolute inset-0 z-30 bg-purple-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none animate-fade-in">
                <Upload className="w-12 h-12 text-purple-300 animate-bounce mb-2" />
                <span className="text-lg font-bold">Suelta tu imagen aquí para establecer el mapa oficial</span>
              </div>
            )}

            {/* TRANSPARENT INTERACTIVE HOTSPOTS LAYER */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
              {zones.map((zone) => (
                <MapHotspot
                  key={zone.id}
                  zone={zone}
                  isSelected={selectedZone?.id === zone.id}
                  isHovered={hoveredZone?.id === zone.id}
                  onHover={onHoverZone}
                  onSelect={onSelectZone}
                  disabled={isZooming}
                />
              ))}
            </div>

          </div>

          {/* INNER VIGNETTE HIGHLIGHT FOR SEAMLESS BORDER BLENDING */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.7)]"
          />
        </div>
      </div>
    </div>
  );
};
