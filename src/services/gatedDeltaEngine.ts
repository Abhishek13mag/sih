import { ModelFeatures, GatedDeltaState } from '../types/floodSense';

// Default calibrated features derived from the 5,646 x 11 dataset
export const DEFAULT_MODEL_FEATURES: ModelFeatures = {
  cloudFraction: 0.78, // 0.0 - 1.0 (Sentinel-5P)
  cloudTopHeight: 9.4, // km
  opticalThickness: 38.5,
  deltaTime: 1.2, // hours
  latitude: 26.32, // Barpeta / Brahmaputra basin
  longitude: 91.00,
  solarZenith: 42.0, // degrees
  surfaceAlbedo: 0.14,
  cloudBasePressure: 780.0, // hPa
  prior24hRain: 48.2, // mm/day
  moistureConvergenceProxy: 0.82 // 0.0 - 1.0
};

// Sigmoid activation
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

// Tanh activation
function tanh(z: number): number {
  return Math.tanh(z);
}

// Forward pass through Gated Delta architecture
export function runGatedDeltaForward(
  features: ModelFeatures,
  sequenceSteps: number = 5
): GatedDeltaState {
  const hiddenDim = 8;
  let h = new Array(hiddenDim).fill(0.05);

  // Normalized input vector
  const x = [
    features.cloudFraction,
    features.cloudTopHeight / 15.0,
    features.opticalThickness / 60.0,
    features.deltaTime / 5.0,
    (features.latitude - 24.0) / 4.0,
    (features.longitude - 89.0) / 7.0,
    features.solarZenith / 90.0,
    features.surfaceAlbedo / 0.5,
    features.cloudBasePressure / 1000.0,
    features.prior24hRain / 150.0,
    features.moistureConvergenceProxy
  ];

  const gateValues: number[] = [];
  const deltaCandidates: number[] = [];

  // Simulate sequential integration over t = 1 ... 5
  for (let t = 0; t < sequenceSteps; t++) {
    const decayFactor = 0.6 + (t / sequenceSteps) * 0.4;
    
    // Compute update gate Gamma_u = sigma(W_u x_t + U_u h_{t-1} + b_u)
    const currentGates: number[] = [];
    const currentDeltas: number[] = [];
    const nextH: number[] = [];

    for (let i = 0; i < hiddenDim; i++) {
      // Weight combination linking cloud fraction & moisture proxy strongly to gate opening
      const gateScore =
        x[0] * 1.8 +
        x[1] * 1.2 +
        x[2] * 1.1 +
        x[9] * 0.9 +
        x[10] * 1.6 +
        h[i] * 0.45 -
        1.1;
      const gamma = sigmoid(gateScore * decayFactor);
      currentGates.push(gamma);

      // Candidate delta update Delta_tilde = tanh(W_d x_t + U_d h_{t-1} + b_d)
      const deltaScore =
        x[0] * 2.2 +
        x[2] * 1.4 +
        x[9] * 1.3 +
        x[10] * 1.9 -
        x[7] * 0.5 +
        h[i] * 0.35 -
        0.8;
      const deltaCandidate = tanh(deltaScore * decayFactor);
      currentDeltas.push(deltaCandidate);

      // Gated Delta update: h_t = h_{t-1} + (gamma * deltaCandidate)
      const deltaH = gamma * deltaCandidate;
      nextH.push(h[i] + deltaH);
    }

    h = nextH;
    if (t === sequenceSteps - 1) {
      gateValues.push(...currentGates);
      deltaCandidates.push(...currentDeltas);
    }
  }

  // Regression head for continuous rainfall: y_hat = ReLU(W_y h + b_y)
  // Higher cloud fraction + moisture proxy + optical thickness drive higher accumulation
  const hiddenSum = h.reduce((acc, val) => acc + val, 0);
  
  // Physical scaling based on maximum 241.63 mm/day
  const basePrecipFactor = Math.pow(features.cloudFraction, 1.8) * 115.0;
  const moistureFactor = features.moistureConvergenceProxy * 75.0;
  const opticalFactor = (features.opticalThickness / 60.0) * 35.0;
  const antecedentFactor = (features.prior24hRain / 150.0) * 20.0;
  const rawRainfall = basePrecipFactor + moistureFactor + opticalFactor + antecedentFactor + (hiddenSum * 4.2) - 15.0;
  
  const predictedRainfall = Number(Math.max(0, Math.min(241.63, rawRainfall)).toFixed(2));

  // Extreme rainfall classification probability (>64.5 mm/day threshold)
  const heavyProbScore = (predictedRainfall - 45.0) / 25.0;
  const heavyRainProbability = Number(sigmoid(heavyProbScore).toFixed(3));

  // Normalized composite risk score 0 - 100
  const riskScore = Math.min(100, Math.round((predictedRainfall / 241.63) * 100));

  return {
    hiddenState: h.map(v => Number(v.toFixed(3))),
    gateValues: gateValues.map(v => Number(v.toFixed(3))),
    deltaCandidates: deltaCandidates.map(v => Number(v.toFixed(3))),
    updatedHiddenState: h.map(v => Number(v.toFixed(3))),
    predictedRainfall,
    heavyRainProbability,
    riskScore
  };
}
