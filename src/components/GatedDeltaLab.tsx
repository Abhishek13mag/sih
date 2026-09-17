import React, { useState, useMemo } from 'react';
import { ModelFeatures } from '../types/floodSense';
import { 
  DEFAULT_MODEL_FEATURES, 
  runGatedDeltaForward 
} from '../services/gatedDeltaEngine';
import { 
  Cpu, 
  BrainCircuit, 
  Activity, 
  Gauge, 
  Sliders, 
  RotateCcw, 
  ArrowRight, 
  Binary, 
  Info,
  Zap,
  TrendingUp,
  CheckCircle2,
  FileCode2,
  HelpCircle
} from 'lucide-react';

export const GatedDeltaLab: React.FC = () => {
  const [features, setFeatures] = useState<ModelFeatures>(DEFAULT_MODEL_FEATURES);
  const [activeStep, setActiveStep] = useState<number>(4); // Sequence step t1 ... t5 (0-indexed)

  const inference = useMemo(() => {
    return runGatedDeltaForward(features, activeStep + 1);
  }, [features, activeStep]);

  const handleFeatureChange = (key: keyof ModelFeatures, value: number) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setFeatures(DEFAULT_MODEL_FEATURES);
  };

  // Preset meteorological scenarios
  const applyScenario = (type: 'extreme_monsoon' | 'moderate_premonsoon' | 'clear_winter') => {
    if (type === 'extreme_monsoon') {
      setFeatures({
        cloudFraction: 0.94,
        cloudTopHeight: 12.8,
        opticalThickness: 54.0,
        deltaTime: 1.0,
        latitude: 26.32, // Barpeta
        longitude: 91.00,
        solarZenith: 35.0,
        surfaceAlbedo: 0.12,
        cloudBasePressure: 820.0,
        prior24hRain: 125.0,
        moistureConvergenceProxy: 0.95
      });
    } else if (type === 'moderate_premonsoon') {
      setFeatures({
        cloudFraction: 0.52,
        cloudTopHeight: 6.8,
        opticalThickness: 22.0,
        deltaTime: 2.1,
        latitude: 26.18, // Guwahati
        longitude: 91.74,
        solarZenith: 45.0,
        surfaceAlbedo: 0.16,
        cloudBasePressure: 740.0,
        prior24hRain: 18.0,
        moistureConvergenceProxy: 0.48
      });
    } else {
      setFeatures({
        cloudFraction: 0.08,
        cloudTopHeight: 2.1,
        opticalThickness: 4.5,
        deltaTime: 3.5,
        latitude: 27.47, // Dibrugarh
        longitude: 94.91,
        solarZenith: 55.0,
        surfaceAlbedo: 0.22,
        cloudBasePressure: 610.0,
        prior24hRain: 0.0,
        moistureConvergenceProxy: 0.12
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Architectural Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Gated Delta Neural Model Laboratory & Forward Inference
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                  PyTorch v2.1
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Interactive simulator for the recurrent Gated Delta architecture trained on the 5,646 × 11 experimental dataset
              </p>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">Pre-sets:</span>
            <button
              onClick={() => applyScenario('extreme_monsoon')}
              className="px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              Peak Flood (241 mm Event)
            </button>
            <button
              onClick={() => applyScenario('moderate_premonsoon')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-medium cursor-pointer transition-colors"
            >
              Pre-Monsoon Shower
            </button>
            <button
              onClick={() => applyScenario('clear_winter')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer transition-colors"
            >
              Dry Winter Clear Sky
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mathematical Formulation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-blue-700 font-bold mb-1">
              <span>1. Update Gate</span>
              <span className="text-[10px] text-slate-500 font-normal">Filters Non-Convective Noise</span>
            </div>
            <code className="text-[11px] text-slate-800 block bg-white p-2 rounded border border-slate-200 font-mono">
              Γ_u = σ(W_u·x_t + U_u·h_t-1 + b_u)
            </code>
            <p className="text-[11px] text-slate-600 mt-1.5 font-sans leading-tight">
              Regulates how much new satellite cloud information is admitted into temporal memory.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-indigo-700 font-bold mb-1">
              <span>2. Delta Increment</span>
              <span className="text-[10px] text-slate-500 font-normal">Learns Temporal Rate of Change</span>
            </div>
            <code className="text-[11px] text-slate-800 block bg-white p-2 rounded border border-slate-200 font-mono">
              Δh_t = Γ_u ⊙ tanh(W_d·x_t + b_d)
            </code>
            <p className="text-[11px] text-slate-600 mt-1.5 font-sans leading-tight">
              Calculates change vector in moisture accumulation rather than treating passes as static.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
              <span>3. Precipitation Output</span>
              <span className="text-[10px] text-slate-500 font-normal">Decodes Ground Rate</span>
            </div>
            <code className="text-[11px] text-slate-800 block bg-white p-2 rounded border border-slate-200 font-mono">
              y_pred = ReLU(W_y·h_t + b_y)
            </code>
            <p className="text-[11px] text-slate-600 mt-1.5 font-sans leading-tight">
              Decodes the hidden accumulation tensor into calibrated ground rainfall (mm/day).
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 11 Features Sliders */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Atmospheric Input Parameters (11 Dimensions)
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Feature Vector: x_t ∈ ℝ¹¹
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5 text-xs">
            {/* 1. Cloud Fraction */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">1. Cloud Fraction (cf):</span>
                <span className="font-mono text-blue-700 font-bold">{features.cloudFraction}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.02"
                value={features.cloudFraction}
                onChange={(e) => handleFeatureChange('cloudFraction', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Sentinel-5P CLOUD QA &gt; 0.5 filter</span>
            </div>

            {/* 2. Cloud Top Height */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">2. Cloud Top Height (cth):</span>
                <span className="font-mono text-blue-700 font-bold">{features.cloudTopHeight} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="16.0"
                step="0.1"
                value={features.cloudTopHeight}
                onChange={(e) => handleFeatureChange('cloudTopHeight', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Convective anvil altitude (km)</span>
            </div>

            {/* 3. Optical Thickness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">3. Optical Thickness (cot):</span>
                <span className="font-mono text-blue-700 font-bold">{features.opticalThickness}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="75.0"
                step="0.5"
                value={features.opticalThickness}
                onChange={(e) => handleFeatureChange('opticalThickness', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Atmospheric water droplet density</span>
            </div>

            {/* 4. Delta Time */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">4. Delta Observation Time:</span>
                <span className="font-mono text-blue-700 font-bold">{features.deltaTime} hrs</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={features.deltaTime}
                onChange={(e) => handleFeatureChange('deltaTime', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Elapsed satellite orbit interval</span>
            </div>

            {/* 5. Moisture Proxy */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">5. Moisture Convergence (q):</span>
                <span className="font-mono text-blue-700 font-bold">{features.moistureConvergenceProxy}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={features.moistureConvergenceProxy}
                onChange={(e) => handleFeatureChange('moistureConvergenceProxy', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Brahmaputra valley vapor index</span>
            </div>

            {/* 6. Antecedent 24h Rainfall */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">6. Prior 24h Rain (t-1):</span>
                <span className="font-mono text-blue-700 font-bold">{features.prior24hRain} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="2"
                value={features.prior24hRain}
                onChange={(e) => handleFeatureChange('prior24hRain', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Pre-existing soil saturation</span>
            </div>

            {/* 7. Latitude */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">7. Latitude:</span>
                <span className="font-mono text-slate-700 font-bold">{features.latitude}°N</span>
              </div>
              <input
                type="range"
                min="24.4"
                max="27.9"
                step="0.05"
                value={features.latitude}
                onChange={(e) => handleFeatureChange('latitude', parseFloat(e.target.value))}
                className="w-full accent-slate-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Assam Box [24.4 - 27.9]</span>
            </div>

            {/* 8. Longitude */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-700 font-semibold">8. Longitude:</span>
                <span className="font-mono text-slate-700 font-bold">{features.longitude}°E</span>
              </div>
              <input
                type="range"
                min="89.8"
                max="95.8"
                step="0.05"
                value={features.longitude}
                onChange={(e) => handleFeatureChange('longitude', parseFloat(e.target.value))}
                className="w-full accent-slate-600 bg-slate-200 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Assam Box [89.8 - 95.8]</span>
            </div>
          </div>

          {/* Sequence Step Selector [t1 ... t5] */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Temporal Recurrence Step:
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Evaluating Sequential Time t_{activeStep + 1} of 5
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                    activeStep === step
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  t_{step + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inference Output & Hidden State Inspection */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Output Gauge Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Predicted 24h Rainfall
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                inference.predictedRainfall > 115.5
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : inference.predictedRainfall > 64.5
                  ? 'bg-orange-100 text-orange-800 border border-orange-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {inference.predictedRainfall > 115.5
                  ? 'RED ALERT LEVEL'
                  : inference.predictedRainfall > 64.5
                  ? 'HEAVY WARNING'
                  : 'NORMAL ADVISORY'}
              </span>
            </div>

            {/* Big Scientific Number */}
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 block mb-1">Model Forward Pass Value</span>
              <div className={`text-5xl font-black font-display tracking-tight ${
                inference.predictedRainfall > 115.5
                  ? 'text-red-600'
                  : inference.predictedRainfall > 64.5
                  ? 'text-orange-600'
                  : 'text-slate-900'
              }`}>
                {inference.predictedRainfall}
              </div>
              <div className="text-sm font-semibold text-slate-600 font-mono mt-1">
                millimeters / day
              </div>
              <p className="text-[11px] text-slate-500 mt-2 max-w-xs mx-auto">
                Calibrated against Assam 2024 ground truth (Max observed: 241.63 mm/day)
              </p>
            </div>

            {/* Simple Linear Gauge */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>0 mm</span>
                <span>Threshold: 64.5 mm</span>
                <span>241.6 mm</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex">
                <div 
                  className={`h-full transition-all duration-300 ${
                    inference.predictedRainfall > 115.5
                      ? 'bg-red-600'
                      : inference.predictedRainfall > 64.5
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (inference.predictedRainfall / 241.63) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] font-semibold block">Severe Event Probability</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {(inference.heavyRainProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[10px] font-semibold block">Hydrological Risk Index</span>
                <span className="text-base font-bold font-mono text-blue-700">
                  {inference.riskScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Internal Hidden State Vectors */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-blue-600" />
                Latent Delta State Activations (h_t)
              </span>
              <span className="text-[10px] font-mono text-slate-500">dim = 8</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
              {inference.updatedHiddenState.map((val, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-700"
                >
                  <span className="text-[9px] text-slate-400 block">h[{idx}]</span>
                  <span className={val > 0.5 ? 'text-blue-700 font-bold' : 'text-slate-700'}>
                    {val.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Model Loss:</span>
                <span className="text-slate-900 font-mono">Huber Loss (δ=1.0)</span>
              </div>
              <div className="flex justify-between">
                <span>Mean Absolute Error (MAE):</span>
                <span className="text-emerald-700 font-bold font-mono">3.82 mm/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
