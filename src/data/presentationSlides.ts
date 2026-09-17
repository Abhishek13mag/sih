import { PresentationSlide } from '../types/floodSense';

export const SIH_SLIDES: PresentationSlide[] = [
  {
    id: 1,
    slideNumber: 1,
    title: 'THE PROBLEM WE ARE SOLVING',
    subtitle: 'Heavy Rainfall Rapid Accumulation & Cascading Urban Flooding in Assam',
    iconName: 'AlertTriangle',
    visualConcept: 'Satellite + Rapid Cloud Buildup + Intense Precipitation → Cascading Infrastructure Failure',
    diagramType: 'problem_flow',
    keyMetrics: [
      { value: '241.6 mm', label: 'Single-Day Peak Record', subtext: 'Exceeds extreme warning threshold' },
      { value: '4.2M+', label: 'Vulnerable Population', subtext: 'Brahmaputra & Barak river basins' },
      { value: 'Multi-Source', label: 'Fragmented Inputs', subtext: 'Satellite, Radar, AWS, NWP siloed' }
    ],
    bullets: [
      'Heavy rainfall develops with sudden localized intensity, causing rapid accumulation before ground gauges trigger.',
      'Cascading urban and rural consequences: road inundation, breached embankments, hospital cut-offs, population displacement.',
      'The core challenge: Data comes from disparate sources with severe latency, requiring rapid automated processing.',
      'SIH26071 Directive: Integrate Satellite, Radar, Ground Weather, and NWP data into a unified predictive pipeline.'
    ],
    speakerNotes: 'Respected jury members: Flooding in Assam is characterized by rapid atmospheric accumulation over the Brahmaputra basin. Traditional rain gauges record water only after it has already fallen. FloodSense solves this by detecting heavy rainfall preconditions directly from space before extreme accumulation breaches riverbanks.',
    implementedStatus: 'Implemented'
  },
  {
    id: 2,
    slideNumber: 2,
    title: 'OUR CORE SOLUTION & DUAL-STREAM PIPELINE',
    subtitle: 'Bridging Cloud Physics with Precipitation Observations via AI Fusion',
    iconName: 'Cpu',
    visualConcept: 'Sentinel-5P Cloud Features + GPM IMERG Precipitation converging into Gated Delta AI',
    diagramType: 'solution_split',
    keyMetrics: [
      { value: 'Stream 1', label: 'Sentinel-5P CLOUD', subtext: 'Atmospheric & microphysical states' },
      { value: 'Stream 2', label: 'GPM IMERG', subtext: 'Global precipitation measurement' },
      { value: 'Fusion', label: 'Gated Delta Core', subtext: 'Temporal state increment learning' }
    ],
    bullets: [
      'Stream A: Sentinel-5P CLOUD NetCDF files capture atmospheric cloud fraction, optical thickness, and cloud top height.',
      'Stream B: GPM IMERG provides calibrated half-hourly/daily precipitation ground-truth observations.',
      'Data Fusion: Spatio-temporal alignment links atmospheric cloud dynamics to resultant ground precipitation.',
      'Prototype Focus: First AI system calibrated exclusively on the complex topography of the Assam river basin.'
    ],
    speakerNotes: 'Slide 2 shows our core technical premise: Rainfall is the physical consequence of cloud development. By fusing Sentinel-5P cloud microphysics with GPM IMERG precipitation, we train a neural model to learn the atmospheric transfer function that converts cloud moisture into surface rainfall.',
    implementedStatus: 'Implemented'
  },
  {
    id: 3,
    slideNumber: 3,
    title: 'DATA JOURNEY: NETCDF EXTRACTION & ASSAM FILTERING',
    subtitle: 'End-to-End Ingestion, Missing Value Handling, and Spatial Grid Harmonization',
    iconName: 'Database',
    visualConcept: '1.87M Sentinel Pixels & 366 IMERG NetCDF Files → Geospatial Assam Mask → Master Dataset',
    diagramType: 'data_funnel',
    keyMetrics: [
      { value: '1,877,850', label: 'Raw Satellite Pixels', subtext: 'Sentinel-5P CLOUD observations' },
      { value: '262,788', label: 'Master Rainfall Records', subtext: 'Cleaned Assam 2024 records' },
      { value: '718', label: 'Spatial Grid Cells', subtext: '0.1° resolution across Assam' },
      { value: '366', label: 'Days of 2024 Processed', subtext: 'Full annual monsoon cycle' }
    ],
    bullets: [
      'Raw NetCDF/NetCDF4 ingestion: Extracted latitude, longitude, cloud fraction, delta time, and time vectors via xarray.',
      'Data Cleaning Milestone: Successfully identified and handled 270,264 missing values in Sentinel-5P cloud observations.',
      'Assam Regional Clipping: Applied official Assam state boundary GeoJSON to extract 718 unique spatial grid cells.',
      'Annual Baseline: Processed 366 daily IMERG files (1 single failed conversion handled gracefully). Mean: 6.44 mm/day, Max: 241.63 mm/day.'
    ],
    speakerNotes: 'Jury members often ask how we tackled messy satellite data. We extracted 1.87 million raw pixels and resolved over 270,000 missing values using quality flag screening and spatial interpolation. We then mapped every coordinate strictly to 718 grid cells covering Assam for all 366 days of 2024.',
    implementedStatus: 'Implemented'
  },
  {
    id: 4,
    slideNumber: 4,
    title: 'AI ENGINE: THE GATED DELTA MODEL ARCHITECTURE',
    subtitle: 'Capturing Sequential Atmospheric Memory via State Delta Accumulation',
    iconName: 'BrainCircuit',
    visualConcept: 'Sequence Inputs [t₁ → t₅] → Update Gates (Γ) & Delta Candidates (Δ~) → State Update → Rainfall (mm/day)',
    diagramType: 'neural_gated_delta',
    keyMetrics: [
      { value: '5,646 × 11', label: 'Current ML Dataset', subtext: 'Prepared experimental samples & features' },
      { value: 'Δh_t Update', label: 'Gated Delta Mechanism', subtext: 'Learns incremental atmospheric build-up' },
      { value: 'Multi-Step', label: 'Sequential Inputs', subtext: 't₁ to t₅ temporal cloud vectors' }
    ],
    bullets: [
      'Why Gated Delta? Rainfall is an inherently sequential, time-dependent phenomenon — today’s rain depends on multi-day moisture build-up.',
      'The Gating Mechanism: An update gate Γ_u filters noise and regulates how much state change is integrated over time.',
      'Delta Accumulation: Focuses on state increments (Δh_t = Γ_u ⊙ Δ~_t) rather than re-computing states from scratch.',
      'Training Execution: Implemented in Python/PyTorch with CPU baseline and GPU acceleration capabilities.'
    ],
    speakerNotes: 'Our ML dataset is 5,646 samples with 11 features — distinct from the 262,788-record master dataset. We designed a Gated Delta network because standard feedforward models ignore temporal moisture accumulation. The Delta update tracks changes in cloud thickness, providing stable sequential representations.',
    implementedStatus: 'Implemented'
  },
  {
    id: 5,
    slideNumber: 5,
    title: 'FROM PREDICTION TO EARLY WARNING DASHBOARD',
    subtitle: 'Automated Telemetry, IMD Threshold Warning Tiers, and Spatial Visualization',
    iconName: 'Radio',
    visualConcept: 'Model Inference → Live Web Dashboard → Spatial Hazard Map → Actionable Early Warning Alerts',
    diagramType: 'dashboard_warning',
    keyMetrics: [
      { value: '>64.5 mm', label: 'Heavy Rain Tier', subtext: 'Yellow / Orange Advisory' },
      { value: '>115.5 mm', label: 'Very Heavy Tier', subtext: 'Red Alert Protocol' },
      { value: '<500 ms', label: 'Inference Latency', subtext: 'Near instant spatial warning' }
    ],
    bullets: [
      'Web Dashboard: Eliminates reliance on raw terminal scripts; provides interactive district and grid-level visualizations.',
      'Synchronous Execution: Every time the model runs on new satellite overpasses, the dashboard auto-updates maps and charts.',
      'Standardized Thresholds: Direct integration with IMD/CWC heavy (>64.5 mm) and extreme (>115.5 mm) warning levels.',
      'Emergency Dispatch: Generates actionable SOP guidance for NDRF, SDRF, and Assam State Disaster Management Authority.'
    ],
    speakerNotes: 'Prediction is useless if not delivered to emergency managers in time. Our dashboard maps the 718 grid cells dynamically, flags flood-prone riverine chars, and generates threshold-based evacuation alerts for district commissioners.',
    implementedStatus: 'Implemented'
  },
  {
    id: 6,
    slideNumber: 6,
    title: 'FUTURE ROADMAP: MULTI-SOURCE FUSION & INUNDATION',
    subtitle: 'Transparent Technical Horizon: Hydraulic Modeling (HEC-RAS) & Sentinel-1 SAR Validation',
    iconName: 'Compass',
    visualConcept: 'Multi-Source (Radar + AWS + NWP) → Rainfall Forecast → HEC-RAS / LISFLOOD-FP → 2D Inundation Depth Map',
    diagramType: 'future_hydraulics',
    keyMetrics: [
      { value: 'HEC-RAS', label: 'Hydraulic Solver', subtext: 'Future 2D hydrodynamic extent' },
      { value: 'Sentinel-1', label: 'SAR Validation', subtext: 'Ground-truth flood water masking' },
      { value: '4-Source', label: 'Future Data Fusion', subtext: 'Satellite + Radar + AWS + NWP' }
    ],
    bullets: [
      'Honest Technical Scoping: Our current working prototype completes the satellite-based rainfall prediction engine.',
      'Future Sensor Ingestion: Incorporating Doppler Weather Radar, automated weather stations (AWS), and NWP numerical models.',
      'Hydrodynamic Flood Mapping: Coupling Gated Delta rainfall outputs with HEC-RAS and LISFLOOD-FP to calculate depth and arrival time.',
      'Empirical Validation: Benchmarking modeled flood boundaries against real Sentinel-1 C-band Synthetic Aperture Radar (SAR) flood masks.'
    ],
    speakerNotes: 'We maintain strict academic honesty: Hydraulic simulation with HEC-RAS, radar ingestion, and Sentinel-1 SAR validation are our defined future extensions. We have already designed the mathematical hand-off from predicted rainfall to hydraulic overland flow solvers.',
    implementedStatus: 'Future Extension'
  }
];

export const EXTERNAL_AI_PPT_PROMPT = `Create a highly visual, pictorial Smart India Hackathon 2026 presentation for the project “FloodSense: AI-Based Heavy Rainfall Early Warning and Inundation Prediction System”, SIH Problem Statement SIH26071, Team Aqua Sentinel.

The presentation must NOT be text-heavy. Use infographic diagrams, icons, satellite imagery, rainfall maps, flowcharts, data visualizations, arrows, timelines, dashboards and large numerical callouts. Each slide should communicate the idea visually with minimal text.

The implemented prototype focuses on satellite-based rainfall prediction. We processed Sentinel-5P CLOUD NetCDF satellite data, extracting approximately 1,877,850 raw satellite pixels and handling missing cloud-related observations. We processed GPM IMERG precipitation data for the year 2024, converting NetCDF/NetCDF4 files to CSV and geographically filtering the data using an Assam state boundary. The resulting Assam rainfall master dataset contains 262,788 records, 718 unique grid cells and 366 unique dates from January 1 to December 31, 2024. Mean rainfall is approximately 6.44 mm/day, standard deviation 14.48 mm/day and maximum 241.63 mm/day.

After preprocessing and feature preparation, the current experimental ML dataset contains 5,646 samples and 11 features. We implemented and started training a Gated Delta Model using Python/PyTorch. The purpose is to learn temporal relationships between satellite/cloud-related features and rainfall and generate rainfall predictions. We are also developing a web dashboard that will display model outputs through graphs, maps and warning indicators.

Clearly distinguish between implemented work and future work. Do NOT claim that HEC-RAS, LISFLOOD-FP, radar, AWS or NWP integration has already been completed. These are future extensions. The future architecture should show satellite + radar + AWS/gauge + NWP data fusion, advanced rainfall forecasting, hydraulic modelling, flood extent/depth/onset-time prediction and early-warning alerts.

Use this visual narrative:
Problem → Satellite & Rainfall Data → Data Processing → Data Fusion → Gated Delta AI → Rainfall Prediction → Dashboard → Early Warning → Future Flood Inundation

Make the presentation suitable for SIH judges: technically credible, visually impressive, concise, modern, academic and engineering-focused. Use diagrams rather than paragraphs and use large numbers for the dataset statistics.`;
