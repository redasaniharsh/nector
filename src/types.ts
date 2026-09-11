/**
 * NÉCTAR Luxury Fruit Confection
 * Type definitions
 */

export interface ProductSpec {
  headline: string;
  subheading: string;
  description: string;
  weight: string;
  weightUnit: string;
  bulletPoints: string[];
}

export interface IngredientFeature {
  id: string;
  name: string;
  value: string;
  detail: string;
  accent?: string;
}

export interface CircularBadge {
  id: string;
  label: string;
  angleDeg: number; // Angle in degrees for trigonometric placement
  accentText?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  detail: string;
}

export interface SequenceConfig {
  frameCount: number;
  width: number;
  height: number;
  framePathPattern: string; // e.g. "/frames/frame_%03d.webp"
}
