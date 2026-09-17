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
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              System Horizon: Completed Satellite AI vs. Future Hydraulic Inundation
            </h2>
            <p className="text-xs text-slate-500">
              Clear academic demarcation between implemented rainfall prediction and planned 2D hydrodynamic simulation
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In strict accordance with SIH evaluation principles, our team maintains a transparent separation between the completed satellite rainfall prediction engine and the future hydraulic simulation and radar/AWS/NWP assimilation extensions.
        </p>
      </div>

      {/* Two Columns: Implemented Now vs Future Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Implemented Now */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>CURRENTLY IMPLEMENTED PROTOTYPE</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Validated
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block">1. Satellite & Rainfall Data Ingestion</span>
              <ul className="text-slate-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Sentinel-5P CLOUD NetCDF files ingested and variables inspected</li>
                <li>1,877,850 raw satellite pixels extracted</li>
                <li>270,264 missing observations identified and imputed</li>
                <li>366 days of GPM IMERG 2024 precipitation converted to CSV tables</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block">2. Assam Regional Harmonization</span>
              <ul className="text-slate-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Assam state boundary GeoJSON clipping completed</li>
                <li>Created master dataset <code className="text-blue-700 font-mono">assam_2024_rainfall.csv</code></li>
                <li>262,788 master rainfall records mapped across 718 spatial grid cells</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block">3. Gated Delta AI Architecture</span>
              <ul className="text-slate-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Target experimental ML dataset created (5,646 samples × 11 features)</li>
                <li>Gated Delta neural architecture implemented in PyTorch</li>
                <li>Model forward training loop and inference calibrated (MAE: 3.82 mm)</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-slate-900 block">4. Operational Web Dashboard</span>
              <ul className="text-slate-600 space-y-0.5 list-disc list-inside text-[11px]">
                <li>Interactive spatial grid visualization across all 718 Assam cells</li>
                <li>Dynamic rainfall prediction and IMD threshold warning tiers</li>
                <li>Disaster mitigation protocol dispatch triggers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Future Extension */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>FUTURE WORK & EXTENSIONS (ROADMAP)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              Planned
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-amber-900 block">1. 2D Hydrodynamic Hydraulic Modeling</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Feed AI-predicted rainfall spatial grids into <strong>HEC-RAS 2D</strong> and <strong>LISFLOOD-FP</strong> hydrodynamic overland flow solvers to calculate exact flood water depth (meters), lateral flood extent boundaries, and wave onset arrival times.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-amber-900 block">2. Multi-Source Sensor Ingestion</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Expand beyond satellite-only inputs by assimilating <strong>Doppler Weather Radar (DWR)</strong> reflectivity, automated ground weather stations (AWS rain gauges), and <strong>Numerical Weather Prediction (NWP)</strong> model forecasts (e.g. WRF / NCMRWF).
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-amber-900 block">3. Empirical Validation with Sentinel-1 SAR</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Utilize <strong>Sentinel-1 C-band Synthetic Aperture Radar (SAR)</strong> backscatter imagery to extract ground-truth water polygons during Assam flood events, computing Intersection-over-Union (IoU) scores against modeled flood extents.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-semibold text-amber-900 block">4. Digital Elevation Model (DEM) Coupling</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Ingest high-resolution 12.5m ALOS PALSAR and Copernicus DEMs to simulate breach dynamics in Brahmaputra embankments across Majuli island and lower Assam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hydraulic Inundation Flow Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
          <Waves className="w-4 h-4 text-blue-600" />
          The Future Hydraulic Inundation & SAR Validation Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-blue-700 font-semibold block text-[10px]">Step 1 (Implemented)</span>
            <strong className="text-slate-900">Gated Delta Rainfall</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Spatial mm/day grids</span>
          </div>

          <div className="flex items-center justify-center text-slate-400 font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200">
            <span className="text-amber-800 font-semibold block text-[10px]">Step 2 (Future)</span>
            <strong className="text-amber-900">HEC-RAS 2D / LISFLOOD</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Hydrodynamic 2D flow</span>
          </div>

          <div className="flex items-center justify-center text-slate-400 font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
            <span className="text-emerald-800 font-semibold block text-[10px]">Step 3 (Future)</span>
            <strong className="text-emerald-900">Sentinel-1 SAR Validation</strong>
            <span className="text-[10px] text-slate-500 block mt-1">Observed vs modeled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
