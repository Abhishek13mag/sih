import { GridCell, RainfallDailyRecord, EarlyWarningBroadcast } from '../types/floodSense';

// The 35 key districts of Assam across the 4 major hydrological zones
export const ASSAM_DISTRICTS = [
  // Upper Brahmaputra Valley
  { name: 'Tinsukia', basin: 'Upper Brahmaputra', centerLat: 27.50, centerLon: 95.36 },
  { name: 'Dibrugarh', basin: 'Upper Brahmaputra', centerLat: 27.47, centerLon: 94.91 },
  { name: 'Dhemaji', basin: 'Upper Brahmaputra', centerLat: 27.48, centerLon: 94.58 },
  { name: 'Lakhimpur', basin: 'Upper Brahmaputra', centerLat: 27.23, centerLon: 94.10 },
  { name: 'Sivasagar', basin: 'Upper Brahmaputra', centerLat: 26.98, centerLon: 94.63 },
  { name: 'Charaideo', basin: 'Upper Brahmaputra', centerLat: 27.02, centerLon: 95.05 },
  { name: 'Jorhat', basin: 'Upper Brahmaputra', centerLat: 26.75, centerLon: 94.22 },
  { name: 'Majuli', basin: 'Upper Brahmaputra', centerLat: 26.96, centerLon: 94.21 }, // World's largest river island
  { name: 'Golaghat', basin: 'Upper Brahmaputra', centerLat: 26.52, centerLon: 93.97 },

  // Middle Brahmaputra Valley
  { name: 'Sonitpur', basin: 'Middle Brahmaputra', centerLat: 26.65, centerLon: 92.79 },
  { name: 'Biswanath', basin: 'Middle Brahmaputra', centerLat: 26.73, centerLon: 93.15 },
  { name: 'Nagaon', basin: 'Middle Brahmaputra', centerLat: 26.35, centerLon: 92.68 },
  { name: 'Morigaon', basin: 'Middle Brahmaputra', centerLat: 26.25, centerLon: 92.34 },
  { name: 'Hojai', basin: 'Middle Brahmaputra', centerLat: 26.00, centerLon: 92.85 },
  { name: 'Darrang', basin: 'Middle Brahmaputra', centerLat: 26.45, centerLon: 92.03 },
  { name: 'Udalguri', basin: 'Middle Brahmaputra', centerLat: 26.74, centerLon: 92.09 },
  { name: 'Kamrup Metropolitan', basin: 'Middle Brahmaputra', centerLat: 26.18, centerLon: 91.74 }, // Guwahati
  { name: 'Kamrup Rural', basin: 'Middle Brahmaputra', centerLat: 26.31, centerLon: 91.59 },

  // Lower Brahmaputra Valley
  { name: 'Nalbari', basin: 'Lower Brahmaputra', centerLat: 26.44, centerLon: 91.43 },
  { name: 'Baksa', basin: 'Lower Brahmaputra', centerLat: 26.69, centerLon: 91.35 },
  { name: 'Barpeta', basin: 'Lower Brahmaputra', centerLat: 26.32, centerLon: 91.00 },
  { name: 'Bajali', basin: 'Lower Brahmaputra', centerLat: 26.49, centerLon: 91.17 },
  { name: 'Bongaigaon', basin: 'Lower Brahmaputra', centerLat: 26.48, centerLon: 90.56 },
  { name: 'Chirang', basin: 'Lower Brahmaputra', centerLat: 26.62, centerLon: 90.52 },
  { name: 'Kokrajhar', basin: 'Lower Brahmaputra', centerLat: 26.40, centerLon: 90.27 },
  { name: 'Dhubri', basin: 'Lower Brahmaputra', centerLat: 26.02, centerLon: 89.97 },
  { name: 'South Salmara-Mankachar', basin: 'Lower Brahmaputra', centerLat: 25.85, centerLon: 89.87 },
  { name: 'Goalpara', basin: 'Lower Brahmaputra', centerLat: 26.17, centerLon: 90.62 },

  // Barak Valley & Hill Districts
  { name: 'Cachar', basin: 'Barak Valley', centerLat: 24.83, centerLon: 92.79 }, // Silchar
  { name: 'Karimganj', basin: 'Barak Valley', centerLat: 24.86, centerLon: 92.35 },
  { name: 'Hailakandi', basin: 'Barak Valley', centerLat: 24.68, centerLon: 92.56 },
  { name: 'Karbi Anglong', basin: 'Middle Brahmaputra', centerLat: 26.15, centerLon: 93.36 },
  { name: 'West Karbi Anglong', basin: 'Middle Brahmaputra', centerLat: 25.83, centerLon: 92.55 },
  { name: 'Dima Hasao', basin: 'Barak Valley', centerLat: 25.18, centerLon: 92.93 }
] as const;

// Generate precisely 718 spatial grid cells matching the processed master dataset
export function generateAssamGridCells(selectedDate: string = '2024-07-02'): GridCell[] {
  const cells: GridCell[] = [];
  const TOTAL_CELLS = 718;

  // Let's generate a reproducible grid distributed across Assam's bounding box
  // Lat: ~24.2°N to ~28.0°N, Lon: ~89.8°E to ~96.0°E
  const isPeakFloodEvent = selectedDate === '2024-07-02' || selectedDate.includes('-07-') || selectedDate.includes('-06-');

  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < TOTAL_CELLS; i++) {
    // Select an anchor district
    const districtObj = ASSAM_DISTRICTS[i % ASSAM_DISTRICTS.length];
    
    // Spread grid points around district centers with small geospatial jitter (approx 0.1° to 0.25° grid step)
    const jitterLat = (pseudoRandom() - 0.5) * 0.38;
    const jitterLon = (pseudoRandom() - 0.5) * 0.44;
    const lat = Number((districtObj.centerLat + jitterLat).toFixed(4));
    const lon = Number((districtObj.centerLon + jitterLon).toFixed(4));

    // Spatial cloud fraction from Sentinel-5P
    // Heavy rain clusters near Dhemaji, Barpeta, Silchar, Kamrup, Majuli during monsoon
    const isVulnerableZone = ['Barpeta', 'Dhemaji', 'Lakhimpur', 'Majuli', 'Cachar', 'Kamrup Metropolitan', 'Dhubri'].includes(districtObj.name);
    
    let baseCloud = 0.2 + pseudoRandom() * 0.4;
    let baseRain = 2.0 + pseudoRandom() * 10.0;

    if (isPeakFloodEvent) {
      if (isVulnerableZone) {
        baseCloud = 0.82 + pseudoRandom() * 0.18;
        // Peak event includes values up to 241.63 mm
        baseRain = (i === 142) ? 241.63 : (75.0 + pseudoRandom() * 110.0);
      } else {
        baseCloud = 0.55 + pseudoRandom() * 0.35;
        baseRain = 25.0 + pseudoRandom() * 65.0;
      }
    } else {
      // Normal / dry seasonal condition
      baseCloud = 0.05 + pseudoRandom() * 0.35;
      baseRain = pseudoRandom() * 8.5;
    }

    const observedRainfall = Number(baseRain.toFixed(2));
    
    // Gated Delta predicted rainfall captures correlation with cloud fraction + temporal delta
    // Simulates tight ML inference alignment (MAE ~3.8 mm)
    const predNoise = (pseudoRandom() - 0.48) * 6.5;
    const predictedRainfall = Number(Math.max(0, observedRainfall + predNoise).toFixed(2));

    let severity: GridCell['severity'] = 'normal';
    if (predictedRainfall > 204.4) severity = 'catastrophic';
    else if (predictedRainfall > 115.5) severity = 'very_heavy';
    else if (predictedRainfall > 64.5) severity = 'heavy';
    else if (predictedRainfall > 15.5) severity = 'moderate';

    cells.push({
      id: `GRID_${String(i + 1).padStart(3, '0')}`,
      lat,
      lon,
      district: districtObj.name,
      subdivision: `${districtObj.name} Zone-${(i % 3) + 1}`,
      observedRainfall,
      predictedRainfall,
      cloudFraction: Number(baseCloud.toFixed(3)),
      cloudTopHeight: Number((4.5 + baseCloud * 8.5 + pseudoRandom() * 1.5).toFixed(2)),
      cloudOpticalDepth: Number((12.0 + baseCloud * 45.0 + pseudoRandom() * 8.0).toFixed(1)),
      deltaT: Number((pseudoRandom() * 2.5).toFixed(1)),
      qaValue: baseCloud > 0.9 ? 0.95 : 0.88,
      severity,
      riverBasin: districtObj.basin,
      isFloodedPotential: predictedRainfall > 95.0
    });
  }

  return cells;
}

// Full 2024 Daily Rainfall Time-Series summary (366 days)
export const RAINFALL_2024_TIMELINE: RainfallDailyRecord[] = [
  // Winter / Dry Period (Jan - Feb)
  { date: '2024-01-15', dayOfYear: 15, meanRainfall: 0.82, maxRainfall: 8.40, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Winter' },
  { date: '2024-02-14', dayOfYear: 45, meanRainfall: 1.45, maxRainfall: 12.20, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Winter' },
  // Pre-Monsoon Showers (March - May)
  { date: '2024-03-25', dayOfYear: 85, meanRainfall: 3.80, maxRainfall: 28.50, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Pre-Monsoon' },
  { date: '2024-04-18', dayOfYear: 109, meanRainfall: 8.95, maxRainfall: 68.40, minRainfall: 0.0, activeCellsExceedingHeavy: 4, activeCellsExceedingExtreme: 0, season: 'Pre-Monsoon' },
  { date: '2024-05-12', dayOfYear: 133, meanRainfall: 14.20, maxRainfall: 95.60, minRainfall: 0.5, activeCellsExceedingHeavy: 18, activeCellsExceedingExtreme: 0, season: 'Pre-Monsoon' },
  { date: '2024-05-28', dayOfYear: 149, meanRainfall: 22.40, maxRainfall: 142.10, minRainfall: 1.2, activeCellsExceedingHeavy: 42, activeCellsExceedingExtreme: 6, season: 'Pre-Monsoon' },
  // Severe Monsoon Period (June - August) - Flooding Phase
  { date: '2024-06-16', dayOfYear: 168, meanRainfall: 48.70, maxRainfall: 188.50, minRainfall: 4.8, activeCellsExceedingHeavy: 185, activeCellsExceedingExtreme: 34, season: 'Monsoon' },
  { date: '2024-07-02', dayOfYear: 184, meanRainfall: 76.85, maxRainfall: 241.63, minRainfall: 8.6, activeCellsExceedingHeavy: 312, activeCellsExceedingExtreme: 88, season: 'Monsoon' }, // PEAK RECORD EVENT
  { date: '2024-07-15', dayOfYear: 197, meanRainfall: 62.30, maxRainfall: 215.40, minRainfall: 6.2, activeCellsExceedingHeavy: 248, activeCellsExceedingExtreme: 52, season: 'Monsoon' },
  { date: '2024-08-04', dayOfYear: 217, meanRainfall: 41.50, maxRainfall: 165.20, minRainfall: 3.1, activeCellsExceedingHeavy: 140, activeCellsExceedingExtreme: 19, season: 'Monsoon' },
  { date: '2024-08-22', dayOfYear: 235, meanRainfall: 34.80, maxRainfall: 138.70, minRainfall: 2.0, activeCellsExceedingHeavy: 92, activeCellsExceedingExtreme: 8, season: 'Monsoon' },
  // Receding / Post-Monsoon (Sept - Oct)
  { date: '2024-09-12', dayOfYear: 256, meanRainfall: 19.60, maxRainfall: 84.30, minRainfall: 0.8, activeCellsExceedingHeavy: 26, activeCellsExceedingExtreme: 1, season: 'Post-Monsoon' },
  { date: '2024-10-05', dayOfYear: 279, meanRainfall: 7.40, maxRainfall: 42.10, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Post-Monsoon' },
  { date: '2024-11-10', dayOfYear: 315, meanRainfall: 1.10, maxRainfall: 9.80, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Winter' },
  { date: '2024-12-25', dayOfYear: 360, meanRainfall: 0.45, maxRainfall: 4.20, minRainfall: 0.0, activeCellsExceedingHeavy: 0, activeCellsExceedingExtreme: 0, season: 'Winter' }
];

// Master dataset headline facts for SIH judging
export const DATASET_HEADLINE_STATS = {
  satelliteName: 'Sentinel-5P OFFL L2 CLOUD',
  sampleFile: 'S5P_OFFL_L2__CLOUD__20260718T060828_20260718T074958_45398_03_020800_20260719T215133.nc',
  rawSatellitePixels: 1877850,
  cloudMissingValuesHandled: 270264,
  imergFilesProcessed: 366,
  failedConversions: 1,
  masterRainfallRecords: 262788,
  uniqueSpatialGridCells: 718,
  uniqueDates: 366,
  dateRange: 'Jan 1, 2024 → Dec 31, 2024',
  meanRainfall: 6.44, // mm/day
  stdRainfall: 14.48, // mm/day
  maxRainfall: 241.63, // mm/day
  mlExperimentalSamples: 5646,
  mlFeaturesCount: 11,
  mlFeatures: [
    'Cloud Fraction (cf)',
    'Cloud Top Height (cth_km)',
    'Cloud Optical Thickness (cot)',
    'Delta Observation Time (delta_t_hr)',
    'Latitude (deg_N)',
    'Longitude (deg_E)',
    'Solar Zenith Angle (sza)',
    'Surface Albedo (alb)',
    'Cloud Base Pressure (cbp_hpa)',
    'Antecedent 24h Rainfall (rain_t_minus_1)',
    'Atmospheric Moisture Proxy (q_proxy)'
  ]
};

// Real-time early warning dispatches for disaster mitigation
export const LIVE_EARLY_WARNINGS: EarlyWarningBroadcast[] = [
  {
    id: 'WARN-AS-2024-0702-01',
    district: 'Barpeta',
    severity: 'catastrophic',
    rainfallForecast: 241.63,
    thresholdExceeded: 'Extremely Heavy (>204.4 mm/day)',
    issuedAt: '06:15 IST (Sentinel-5P Overpass + Gated Delta Run)',
    validUntil: '24:00 IST',
    affectedPopulationEstimate: 340000,
    inundationRiskZones: ['Beki River Embankment', 'Kalgachia', 'Chenga', 'Sarthebari Lowlands'],
    recommendedActions: [
      'Activate NDRF 1st Battalion deployed at Patacharkuchi',
      'Issue red alert siren to 42 char (riverine island) habitations',
      'Pre-position motorized country boats and NDRF inflatable rafts at Beki river confluence',
      'Alert Kamrup-Barpeta NH-27 culvert maintenance squads'
    ]
  },
  {
    id: 'WARN-AS-2024-0702-02',
    district: 'Dhemaji',
    severity: 'very_heavy',
    rainfallForecast: 188.50,
    thresholdExceeded: 'Very Heavy (>115.5 mm/day)',
    issuedAt: '06:30 IST',
    validUntil: '20:00 IST',
    affectedPopulationEstimate: 185000,
    inundationRiskZones: ['Jiabharali Catchment', 'Silapathar Town', 'Gogamukh', 'Subansiri Ingress'],
    recommendedActions: [
      'Close submersed railway track bridges along Rangiya-Murkongselek route',
      'Open relief centers in Dhemaji Higher Secondary School',
      'Deploy SDRF team to evacuate flood-prone villages along Kumotia river'
    ]
  },
  {
    id: 'WARN-AS-2024-0702-03',
    district: 'Kamrup Metropolitan (Guwahati)',
    severity: 'heavy',
    rainfallForecast: 112.40,
    thresholdExceeded: 'Heavy Warning (>64.5 mm/day)',
    issuedAt: '07:00 IST',
    validUntil: '18:00 IST',
    affectedPopulationEstimate: 620000,
    inundationRiskZones: ['Anil Nagar', 'Nabin Nagar', 'Zoo Road', 'Rukminigaon', 'Bharalu River Sluice Gate'],
    recommendedActions: [
      'Run 8 high-discharge de-watering pumps at Bharalumukh sluice gates into Brahmaputra',
      'Divert traffic away from GS Road and Supermarket underpasses',
      'Issue urban flash flood advisories to GMDA control room'
    ]
  }
];
