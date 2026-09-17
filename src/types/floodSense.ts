export type AlertSeverity = 'normal' | 'moderate' | 'heavy' | 'very_heavy' | 'catastrophic';

export interface GridCell {
  id: string;
  lat: number;
  lon: number;
  district: string;
  subdivision?: string;
  observedRainfall: number; // mm/day
  predictedRainfall: number; // mm/day
  cloudFraction: number; // 0.0 - 1.0 (Sentinel-5P)
  cloudTopHeight: number; // km
  cloudOpticalDepth: number;
  deltaT: number; // hours
  qaValue: number; // quality assurance flag
  severity: AlertSeverity;
  riverBasin: 'Upper Brahmaputra' | 'Middle Brahmaputra' | 'Lower Brahmaputra' | 'Barak Valley';
  isFloodedPotential?: boolean;
}

export interface RainfallDailyRecord {
  date: string; // YYYY-MM-DD
  dayOfYear: number;
  meanRainfall: number;
  maxRainfall: number;
  minRainfall: number;
  activeCellsExceedingHeavy: number;
  activeCellsExceedingExtreme: number;
  season: 'Winter' | 'Pre-Monsoon' | 'Monsoon' | 'Post-Monsoon';
}

export interface GatedDeltaState {
  hiddenState: number[];
  gateValues: number[];
  deltaCandidates: number[];
  updatedHiddenState: number[];
  predictedRainfall: number;
  heavyRainProbability: number;
  riskScore: number;
}

export interface ModelFeatures {
  cloudFraction: number;
  cloudTopHeight: number;
  opticalThickness: number;
  deltaTime: number;
  latitude: number;
  longitude: number;
  solarZenith: number;
  surfaceAlbedo: number;
  cloudBasePressure: number;
  prior24hRain: number;
  moistureConvergenceProxy: number;
}

export interface PresentationSlide {
  id: number;
  slideNumber: number;
  title: string;
  subtitle: string;
  iconName: string;
  visualConcept: string;
  keyMetrics?: {
    value: string;
    label: string;
    subtext?: string;
  }[];
  bullets: string[];
  diagramType: 'problem_flow' | 'solution_split' | 'data_funnel' | 'neural_gated_delta' | 'dashboard_warning' | 'future_hydraulics';
  speakerNotes: string;
  implementedStatus: 'Implemented' | 'In Progress' | 'Future Extension';
}

export interface EarlyWarningBroadcast {
  id: string;
  district: string;
  severity: AlertSeverity;
  rainfallForecast: number;
  thresholdExceeded: string;
  issuedAt: string;
  validUntil: string;
  affectedPopulationEstimate: number;
  inundationRiskZones: string[];
  recommendedActions: string[];
}
