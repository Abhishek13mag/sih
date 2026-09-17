import React from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  Waves, 
  Satellite, 
  Radio, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const FutureRoadmap: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-600 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              System Horizon: Current Prototype vs. Future Inundation Extensions
            </h2>
            <p className="text-xs text-slate-400">
              Clear academic demarcation between implemented satellite rainfall models and upcoming 2D hydraulic flood solvers
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In strict accordance with SIH academic integrity guidelines, our team explicitly separates the completed satellite AI rainfall prediction engine from future hydraulic simulation and radar/AWS/NWP integration.
        </p>
      </div>

      {/* Two Columns: Implemented Now vs Future Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Implemented Now */}
        <div className="bg-slate-900/90 rounded-xl border border-emerald-900/60 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>CURRENTLY IMPLEMENTED PROTOTYPE</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
              Validated
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">1. Satellite & Precipitation Ingestion</span>
              <ul className="text-slate-400 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Sentinel-5P CLOUD NetCDF files ingested and variables inspected</li>
                <li>1,877,850 raw satellite pixels extracted</li>
                <li>270,264 missing observations identified and imputed</li>
                <li>366 days of GPM IMERG 2024 daily precipitation converted to CSV</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">2. Assam Regional Harmonization</span>
              <ul className="text-slate-400 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Assam state boundary GeoJSON clipping completed</li>
                <li>Created master dataset <code className="text-cyan-300 font-mono">assam_2024_rainfall.csv</code></li>
                <li>262,788 master rainfall records mapped across 718 spatial cells</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">3. Gated Delta AI Architecture</span>
              <ul className="text-slate-400 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Target experimental ML dataset created (5,646 samples × 11 features)</li>
                <li>Gated Delta neural architecture implemented in PyTorch</li>
                <li>Model forward training loop and inference calibrated</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-white block">4. Interactive Web Dashboard</span>
              <ul className="text-slate-400 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Spatial grid visualization across all 718 Assam cells</li>
                <li>Dynamic rainfall prediction and IMD threshold warning tiers</li>
                <li>Disaster mitigation protocol dispatch triggers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Future Extension */}
        <div className="bg-slate-900/90 rounded-xl border border-amber-900/60 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-5 h-5" />
              <span>FUTURE WORK & EXTENSIONS (ROADMAP)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
              Planned
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-amber-300 block">1. 2D Hydrodynamic Hydraulic Modeling</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Feed AI-predicted rainfall spatial grids into <strong>HEC-RAS 2D</strong> and <strong>LISFLOOD-FP</strong> hydrodynamic overland flow solvers to calculate exact flood water depth (meters), lateral flood extent boundaries, and wave onset arrival times.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-amber-300 block">2. Multi-Source Sensor Ingestion</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Expand beyond satellite-only inputs by assimilating <strong>Doppler Weather Radar (DWR)</strong> reflectivity, automated ground weather stations (AWS rain gauges), and <strong>Numerical Weather Prediction (NWP)</strong> model forecasts (e.g. WRF / NCMRWF).
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-amber-300 block">3. Empirical Validation with Sentinel-1 SAR</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Utilize <strong>Sentinel-1 C-band Synthetic Aperture Radar (SAR)</strong> backscatter imagery to extract ground-truth water polygons during Assam flood events, computing Intersection-over-Union (IoU) scores against modeled flood extents.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-amber-300 block">4. Digital Elevation Model (DEM) Coupling</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ingest high-resolution 12.5m ALOS PALSAR and Copernicus DEMs to simulate breach dynamics in Brahmaputra embankments across Majuli island and lower Assam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hydraulic Inundation Flow Diagram matching Section 19 & 20 */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          The Future Hydraulic Inundation & SAR Validation Chain
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-cyan-400 block text-[10px]">Step 1 (Implemented)</span>
            <strong className="text-white">Gated Delta Rainfall</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Spatial mm/day grids</span>
          </div>

          <div className="flex items-center justify-center text-slate-600 font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/60 bg-amber-950/10">
            <span className="text-amber-400 block text-[10px]">Step 2 (Future)</span>
            <strong className="text-amber-300">HEC-RAS 2D / LISFLOOD</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Overland hydraulic solver</span>
          </div>

          <div className="flex items-center justify-center text-slate-600 font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/10">
            <span className="text-emerald-400 block text-[10px]">Step 3 (Future)</span>
            <strong className="text-emerald-300">Sentinel-1 SAR Validation</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Ground truth extent compare</span>
          </div>
        </div>
      </div>
    </div>
  );
};
