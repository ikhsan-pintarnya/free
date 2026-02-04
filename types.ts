
export enum AppStep {
  UPLOAD = 0,
  FEATURES = 1,
  GENERATION = 2,
  EDITOR = 3,
  LIBRARY = 4,
}

export interface HeadshotFeatures {
  // vibe property removed
  pose: string;
  attire: string;
  attireImage?: string; // Base64 of custom attire
  attireImageMimeType?: string;
  background: string;
  grooming: string;
  expression: string;
  cameraAngle: string;
  lensDepth: string;
  colorGrade: string;
}

export interface GeneratedImage {
  id: string;
  base64: string;
  promptUsed: string;
  mimeType: string;
}

export interface SavedProject {
  id: string;
  name: string;
  timestamp: number;
  sourceImage: { base64: string; mimeType: string };
  features: HeadshotFeatures;
  generatedImages: GeneratedImage[];
}

export const NANO_BANANA_MODEL = 'gemini-2.5-flash-image';
