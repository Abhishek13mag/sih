import React, { useState } from 'react';
import { DATASET_HEADLINE_STATS, RAINFALL_2024_TIMELINE } from '../data/assamDataset';
import { 
  Database, 
  Satellite, 
  CloudRain, 
  Filter, 
  ArrowDown, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  FileCode2,
  Table,
  Layers,
  Sparkles
} from 'lucide-react';

export const DataPipelineView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'records' | 'missing_values'>('funnel');

  return (
    <div className="space-y-6">
      {/* 6 Key Big Numbers Banner (as requested in Section 23 of the prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Sentinel-5P Pixels */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-cyan-400 mb-1 flex items-center justify-between">
            <Satellite className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Sentinel-5P</span>
          </div>
          <div className="text-2xl font-black font-display text-white tracking-tight">
            1,877,850
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Raw Satellite Pixels Extracted
          </p>
        </div>

        {/* 2. Assam Rainfall Records */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-blue-400 mb-1 flex items-center justify-between">
            <CloudRain className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Master CSV</span>
          </div>
          <div className="text-2xl font-black font-display text-white tracking-tight">
            262,788
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Assam Rainfall Master Records
          </p>
        </div>

        {/* 3. Unique Spatial Grids */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-emerald-400 mb-1 flex items-center justify-between">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Assam Box</span>
          </div>
          <div className="text-2xl font-black font-display text-white tracking-tight">
            718
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Unique Rainfall Grid Cells
          </p>
        </div>

        {/* 4. Days of 2024 */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-amber-400 mb-1 flex items-center justify-between">
            <Table className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Annual 2024</span>
          </div>
          <div className="text-2xl font-black font-display text-white tracking-tight">
            366
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Days of 2024 Rainfall Data
          </p>
        </div>

        {/* 5. ML Dataset */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-purple-400 mb-1 flex items-center justify-between">
            <FileCode2 className="w-4 h-4" />
            <span className="text-[10px] font-mono text-purple-400/80">PyTorch ML</span>
          </div>
          <div className="text-2xl font-black font-display text-white tracking-tight">
            5,646 × 11
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Current ML Model Dataset
          </p>
        </div>

        {/* 6. Maximum Rainfall */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 shadow-lg relative overflow-hidden">
          <div className="text-pink-400 mb-1 flex items-center justify-between">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-mono text-pink-400/80">July 2 Record</span>
          </div>
          <div className="text-2xl font-black font-display text-pink-400 tracking-tight">
            241.63
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
            Maximum Rainfall mm/day
          </p>
        </div>
      </div>

      {/* Sub-Navigation Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('funnel')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'funnel'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Data Processing Pipeline & Flowchart
        </button>
        <button
          onClick={() => setActiveTab('missing_values')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'missing_values'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Sentinel-5P Missing Values Treatment (~270k)
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'records'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Assam Master CSV Schema (262,788 Records)
        </button>
      </div>

      {/* Tab 1: Flowchart Diagram matching Section 3, 4, 5, 10 */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              End-to-End Dual Stream Ingestion & Fusion Pipeline
            </h3>

            {/* Visual Two-Column Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Stream A: Sentinel-5P CLOUD */}
              <div className="bg-slate-950 p-5 rounded-xl border border-cyan-900/50 space-y-4">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Satellite className="w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Stream 1: Sentinel-5P CLOUD</h4>
                    <span className="text-[10px] text-cyan-300 font-mono">Atmospheric Cloud Preconditions</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Sample NetCDF File:</span>
                    <span className="text-cyan-300 break-all">{DATASET_HEADLINE_STATS.sampleFile}</span>
                  </div>

                  <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                    <li>Opened via Python <code className="text-cyan-300 font-mono">xarray</code> and <code className="text-cyan-300 font-mono">netCDF4</code></li>
                    <li>Extracted <strong>1,877,850 raw satellite pixels</strong></li>
                    <li>Extracted: Latitude, Longitude, Cloud Fraction, Delta Time, Optical Thickness</li>
                    <li>Addressed <strong>270,264 missing values</strong> in cloud observations</li>
                  </ul>
                </div>
              </div>

              {/* Stream B: GPM IMERG */}
              <div className="bg-slate-950 p-5 rounded-xl border border-blue-900/50 space-y-4">
                <div className="flex items-center gap-2.5 text-blue-400">
                  <CloudRain className="w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Stream 2: GPM IMERG</h4>
                    <span className="text-[10px] text-blue-300 font-mono">Precipitation Ground Truth</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Full Year Coverage:</span>
                    <span className="text-blue-300">366 daily NetCDF files (1 failed conversion gracefully recovered)</span>
                  </div>

                  <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                    <li>Converted daily satellite grids into structured CSV tables</li>
                    <li>Clipped to Assam state boundary using official <strong>GeoJSON polygon</strong></li>
                    <li>Yielded <strong>262,788 rainfall records</strong> across <strong>718 spatial grid cells</strong></li>
                    <li>Baseline statistics: Mean = <strong>6.44 mm/day</strong>, Max = <strong>241.63 mm/day</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Convergence Node: Data Fusion */}
            <div className="flex flex-col items-center my-4">
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
              <div className="px-4 py-2 rounded-full bg-purple-950 border border-purple-600 text-purple-200 text-xs font-bold font-mono shadow-lg flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>SPATIO-TEMPORAL DATA FUSION & SAMPLING</span>
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            </div>

            {/* Bottom Result Box: ML Training Dataset vs Master Dataset */}
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-950 to-pink-950/40 p-5 rounded-xl border border-purple-800/80">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-pink-400" />
                    Target Experimental ML Dataset: 5,646 × 11
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    <strong>Crucial Jury Distinction:</strong> The 262,788 records represent the complete processed rainfall master dataset for Assam 2024. The 5,646 × 11 dataset is the aligned experimental dataset used for Gated Delta model training.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                    Master: 262,788 records
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-pink-950 border border-pink-700 text-pink-300 font-bold">
                    ML: 5,646 × 11
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Missing Values Treatment */}
      {activeTab === 'missing_values' && (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Sentinel-5P CLOUD Missing Values Treatment (~270,264 missing points)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Satellite optical instruments routinely encounter missing observations due to sun glint, orbital swath boundaries, and sensor flags.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 border border-amber-700/60 text-amber-300">
              270,264 Handled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 block">1. Quality Assurance Masking</span>
              <p className="text-slate-400 leading-relaxed">
                Applied strict <code className="text-cyan-300 font-mono">qa_value &gt; 0.5</code> filtering from Sentinel-5P Level-2 metadata, stripping degraded pixel measurements impacted by instrument artifacts.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 block">2. Spatio-Temporal Interpolation</span>
              <p className="text-slate-400 leading-relaxed">
                For gaps inside the 718 Assam grid domain, applied inverse distance weighting (IDW) using neighboring valid satellite footprint points within a 15 km search radius.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block">3. Temporal Persistence Imputation</span>
              <p className="text-slate-400 leading-relaxed">
                Persistent missing cloud heights were backfilled using the prior orbital track delta time vector to maintain physical continuity across subsequent hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Assam Master CSV Schema */}
      {activeTab === 'records' && (
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                Assam 2024 Master Rainfall Dataset (<code className="text-cyan-300 font-mono">assam_2024_rainfall.csv</code>)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Representing 718 spatial grid cells × 366 days (January 1, 2024 → December 31, 2024)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Mean: 6.44 mm | Max: 241.63 mm
            </span>
          </div>

          {/* Sample Table representation matching Section 8 */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Latitude (°N)</th>
                  <th className="p-2.5">Longitude (°E)</th>
                  <th className="p-2.5">District / Basin</th>
                  <th className="p-2.5">Rainfall (mm/day)</th>
                  <th className="p-2.5">Status Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-300">2024-01-01</td>
                  <td className="p-2.5">26.3214</td>
                  <td className="p-2.5">91.0028</td>
                  <td className="p-2.5">Barpeta (Lower Brahmaputra)</td>
                  <td className="p-2.5 font-bold text-emerald-400">0.42</td>
                  <td className="p-2.5 text-slate-400">Normal</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-300">2024-01-01</td>
                  <td className="p-2.5">26.1844</td>
                  <td className="p-2.5">91.7412</td>
                  <td className="p-2.5">Kamrup Metro (Guwahati)</td>
                  <td className="p-2.5 font-bold text-emerald-400">0.18</td>
                  <td className="p-2.5 text-slate-400">Normal</td>
                </tr>
                <tr className="hover:bg-slate-900/40 bg-pink-950/20">
                  <td className="p-2.5 text-pink-300 font-bold">2024-07-02</td>
                  <td className="p-2.5">26.3214</td>
                  <td className="p-2.5">91.0028</td>
                  <td className="p-2.5 text-white">Barpeta (Beki Sub-basin)</td>
                  <td className="p-2.5 font-bold text-pink-400">241.63 (PEAK)</td>
                  <td className="p-2.5 text-pink-400 font-bold">Catastrophic Red Alert</td>
                </tr>
                <tr className="hover:bg-slate-900/40 bg-red-950/20">
                  <td className="p-2.5 text-cyan-300">2024-07-02</td>
                  <td className="p-2.5">27.4812</td>
                  <td className="p-2.5">94.5821</td>
                  <td className="p-2.5 text-white">Dhemaji (Upper Basin)</td>
                  <td className="p-2.5 font-bold text-red-400">188.50</td>
                  <td className="p-2.5 text-red-400 font-bold">Very Heavy Alert</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-2.5 text-cyan-300">2024-12-31</td>
                  <td className="p-2.5">24.8320</td>
                  <td className="p-2.5">92.7930</td>
                  <td className="p-2.5">Cachar (Silchar)</td>
                  <td className="p-2.5 font-bold text-emerald-400">0.00</td>
                  <td className="p-2.5 text-slate-400">Normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
