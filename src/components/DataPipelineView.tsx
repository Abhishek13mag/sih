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
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DataPipelineView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'records' | 'missing_values'>('funnel');

  return (
    <div className="space-y-4">
      {/* 6 Key Big Numbers Banner */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Sentinel-5P Pixels */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-blue-700 mb-1 flex items-center justify-between">
            <Satellite className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Sentinel-5P</span>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            1,877,850
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Raw Satellite Pixels Extracted
          </p>
        </div>

        {/* 2. Assam Rainfall Records */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-blue-700 mb-1 flex items-center justify-between">
            <CloudRain className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Master CSV</span>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            262,788
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Assam Rainfall Master Records
          </p>
        </div>

        {/* 3. Unique Spatial Grids */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-emerald-700 mb-1 flex items-center justify-between">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Assam Box</span>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            718
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Unique Rainfall Grid Cells
          </p>
        </div>

        {/* 4. Days of 2024 */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-amber-700 mb-1 flex items-center justify-between">
            <Table className="w-4 h-4" />
            <span className="text-[10px] font-mono text-slate-500">Annual 2024</span>
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            366
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Days of 2024 Rainfall Data
          </p>
        </div>

        {/* 5. ML Dataset */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-indigo-700 mb-1 flex items-center justify-between">
            <FileCode2 className="w-4 h-4" />
            <span className="text-[10px] font-mono text-indigo-700 font-semibold">PyTorch ML</span>
          </div>
          <div className="text-2xl font-bold font-display text-indigo-700 tracking-tight">
            5,646 × 11
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Current ML Model Dataset
          </p>
        </div>

        {/* 6. Maximum Rainfall */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-rose-600 mb-1 flex items-center justify-between">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-mono text-rose-700 font-semibold">July 2 Peak</span>
          </div>
          <div className="text-2xl font-bold font-display text-rose-600 tracking-tight">
            241.63
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Maximum Rainfall mm/day
          </p>
        </div>
      </div>

      {/* Sub-Navigation Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'funnel'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Data Processing Pipeline & Flowchart
          </button>
          <button
            onClick={() => setActiveTab('missing_values')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'missing_values'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Sentinel-5P Missing Values Treatment (~270k)
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'records'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Assam Master CSV Schema (262,788 Records)
          </button>
        </div>
      </div>

      {/* Tab 1: Flowchart Diagram */}
      {activeTab === 'funnel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2 font-display">
              <Database className="w-4 h-4 text-blue-600" />
              Dual-Stream Satellite Ingestion & Spatio-Temporal Fusion Pipeline
            </h3>

            {/* Visual Two-Column Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Stream A: Sentinel-5P CLOUD */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5 text-blue-700">
                  <Satellite className="w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Stream 1: Sentinel-5P CLOUD</h4>
                    <span className="text-[11px] text-blue-700 font-mono">Atmospheric Cloud Preconditions</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">NetCDF Sample Product:</span>
                    <span className="text-blue-700 break-all">{DATASET_HEADLINE_STATS.sampleFile}</span>
                  </div>

                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Parsed with Python <code className="text-blue-700 font-mono">xarray</code> & <code className="text-blue-700 font-mono">netCDF4</code></li>
                    <li>Extracted <strong>1,877,850 raw satellite pixels</strong></li>
                    <li>Extracted features: Cloud Fraction, Cloud Top Height, Optical Thickness, Delta Time</li>
                    <li>Screened and resolved <strong>270,264 missing values</strong></li>
                  </ul>
                </div>
              </div>

              {/* Stream B: GPM IMERG */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2.5 text-blue-700">
                  <CloudRain className="w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Stream 2: GPM IMERG</h4>
                    <span className="text-[11px] text-blue-700 font-mono">Ground Precipitation Truth</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Annual 2024 Coverage:</span>
                    <span className="text-slate-900">366 daily NetCDF files (1 failed conversion gracefully recovered)</span>
                  </div>

                  <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Converted daily global precipitation grids into structured CSV tables</li>
                    <li>Clipped precisely to Assam state territory using official <strong>GeoJSON polygon</strong></li>
                    <li>Yielded <strong>262,788 rainfall records</strong> across <strong>718 spatial grid cells</strong></li>
                    <li>Annual metrics: Mean = <strong>6.44 mm/day</strong>, Peak = <strong>241.63 mm/day</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Convergence Node */}
            <div className="flex flex-col items-center my-4">
              <div className="w-0.5 h-5 bg-slate-300"></div>
              <div className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold font-mono shadow-2xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>SPATIO-TEMPORAL FUSION & SAMPLING</span>
              </div>
              <div className="w-0.5 h-5 bg-slate-300"></div>
            </div>

            {/* Bottom Result Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                    <FileCode2 className="w-4 h-4 text-indigo-700" />
                    Target Experimental ML Dataset: 5,646 × 11
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    <strong>Important Distinction for SIH Evaluation:</strong> The 262,788 records represent the full historical rainfall master dataset for Assam in 2024. The 5,646 × 11 dataset is the aligned experimental subset used for training and validating the Gated Delta neural architecture.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Master: 262,788 records
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold">
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
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Sentinel-5P CLOUD Missing Values Treatment (~270,264 missing points)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Optical satellite sensors experience missing observations due to sun glint, orbital swath boundaries, and instrument quality filtering.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
              270,264 Handled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-blue-700 block">1. Quality Assurance Masking</span>
              <p className="text-slate-600 leading-relaxed">
                Applied strict <code className="text-blue-700 font-mono">qa_value &gt; 0.5</code> filtering from Sentinel-5P Level-2 metadata, removing degraded pixel observations impacted by solar interference.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-indigo-700 block">2. Spatio-Temporal Interpolation</span>
              <p className="text-slate-600 leading-relaxed">
                For spatial gaps within the 718 Assam cells, applied inverse distance weighting (IDW) using neighboring valid footprints within a 15 km search radius.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-emerald-700 block">3. Temporal Persistence Imputation</span>
              <p className="text-slate-600 leading-relaxed">
                Persistent missing cloud heights were backfilled using the prior orbital pass delta time vector to maintain physical continuity across subsequent hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Assam Master CSV Schema */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Assam 2024 Master Rainfall Dataset (<code className="text-blue-700 font-mono">assam_2024_rainfall.csv</code>)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dataset scope: 718 spatial grid cells × 366 days (January 1, 2024 → December 31, 2024)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              Mean: 6.44 mm | Max: 241.63 mm
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Latitude (°N)</th>
                  <th className="p-2.5">Longitude (°E)</th>
                  <th className="p-2.5">District / Basin</th>
                  <th className="p-2.5">Rainfall (mm/day)</th>
                  <th className="p-2.5">Status Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 text-blue-700">2024-01-01</td>
                  <td className="p-2.5">26.3214</td>
                  <td className="p-2.5">91.0028</td>
                  <td className="p-2.5">Barpeta (Lower Brahmaputra)</td>
                  <td className="p-2.5 font-bold text-emerald-700">0.42</td>
                  <td className="p-2.5 text-slate-500">Normal</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 text-blue-700">2024-01-01</td>
                  <td className="p-2.5">26.1844</td>
                  <td className="p-2.5">91.7412</td>
                  <td className="p-2.5">Kamrup Metro (Guwahati)</td>
                  <td className="p-2.5 font-bold text-emerald-700">0.18</td>
                  <td className="p-2.5 text-slate-500">Normal</td>
                </tr>
                <tr className="hover:bg-red-50/50 bg-red-50/20">
                  <td className="p-2.5 text-red-700 font-bold">2024-07-02</td>
                  <td className="p-2.5">26.3214</td>
                  <td className="p-2.5">91.0028</td>
                  <td className="p-2.5 font-semibold text-slate-900">Barpeta (Beki Sub-basin)</td>
                  <td className="p-2.5 font-bold text-red-700">241.63 (PEAK)</td>
                  <td className="p-2.5 text-red-700 font-bold">Catastrophic Red Alert</td>
                </tr>
                <tr className="hover:bg-red-50/50 bg-red-50/20">
                  <td className="p-2.5 text-blue-700">2024-07-02</td>
                  <td className="p-2.5">27.4812</td>
                  <td className="p-2.5">94.5821</td>
                  <td className="p-2.5 font-semibold text-slate-900">Dhemaji (Upper Basin)</td>
                  <td className="p-2.5 font-bold text-red-600">188.50</td>
                  <td className="p-2.5 text-red-600 font-bold">Very Heavy Alert</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 text-blue-700">2024-12-31</td>
                  <td className="p-2.5">24.8320</td>
                  <td className="p-2.5">92.7930</td>
                  <td className="p-2.5">Cachar (Silchar)</td>
                  <td className="p-2.5 font-bold text-emerald-700">0.00</td>
                  <td className="p-2.5 text-slate-500">Normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
