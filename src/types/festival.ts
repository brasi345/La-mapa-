export type ExperienceState = 'MAP' | 'ENTERING' | 'INTERIOR' | 'EXITING';

export interface HotspotCoordinates {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  radiusX?: number; // percentage width
  radiusY?: number; // percentage height
}

export interface ZoneService {
  title: string;
  description?: string;
  icon?: string;
}

export interface InteriorFeature {
  id: string;
  title: string;
  description: string;
  x: number; // percentage in interior scene
  y: number; // percentage in interior scene
  tag?: string;
}

export interface FestivalZone {
  id: number;
  slug: string;
  numberLabel: string;
  name: string;
  subtitle: string;
  quote: string;
  color: {
    primary: string;
    badgeBg: string;
    badgeBorder: string;
    text: string;
    glow: string;
  };
  coordinates: HotspotCoordinates;
  image: string;
  altText: string;
  services: ZoneService[];
  accessibilityHighlights: string[];
  interactiveFeatures?: InteriorFeature[];
  audioDescriptionText: string;
  corner?: 'bottom-right' | 'bottom-left' | 'top-right';
}
