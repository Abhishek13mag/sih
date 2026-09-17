import React from 'react';
import { 
  CloudRain, 
  Satellite, 
  Cpu, 
  Database, 
  Presentation, 
  ShieldAlert, 
  Compass, 
  Play, 
  Activity,
  BotMessageSquare,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulating: boolean;
  onRunSimulation: () => void;
  onToggleAiAdvisor: () => void;
  isAiAdvisorOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSimulating,
  onRunSimulation,
  onToggleAiAdvisor,
  isAiAdvisorOpen
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner with SIH Metadata & Live Telemetry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            SIH Problem: SIH26071
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 font-semibold tracking-wide hidden sm:inline">Team: Aqua Sentinel</span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-emerald-400 hidden md:inline">Theme: Disaster Management</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentinel-5P CLOUD: <strong className="text-cyan-300">NetCDF L2 OFFL</strong></span>
          </div>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>GPM IMERG: <strong className="text-blue-300">2024 Daily 0.1°</strong></span>
          </div>
          <span className="text-slate-700 hidden lg:inline">/</span>
          <div className="items-center gap-1 text-slate-400 hidden lg:flex">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Assam Domain: <strong className="text-emerald-300">718 Grid Cells</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/40">
            <CloudRain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight font-display">
                FloodSense <span className="text-cyan-400 font-normal text-sm ml-1 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/80">AI Early Warning</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Assam Hydrological Heavy Rainfall & Inundation Prediction System
            </p>
          </div>
        </div>

        {/* Global Simulation & AI Advisor Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-run-simulation"
            onClick={onRunSimulation}
            disabled={isSimulating}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs transition-all shadow-md ${
              isSimulating
                ? 'bg-cyan-900/50 text-cyan-200 border border-cyan-700/60 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30 active:scale-95'
            }`}
          >
            {isSimulating ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Inferring Gated Delta...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Overpass Inference</span>
              </>
            )}
          </button>

          <button
            id="btn-ai-advisor-toggle"
            onClick={onToggleAiAdvisor}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              isAiAdvisorOpen
                ? 'bg-purple-950 text-purple-200 border-purple-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Hydro Advisor</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 py-1.5 text-xs font-medium">
          <button
            id="nav-tab-monitoring"
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'monitoring'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Assam Spatial Grid (718 Cells)</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-900/60 text-cyan-300 font-mono">Live</span>
          </button>

          <button
            id="nav-tab-gated-delta"
            onClick={() => setActiveTab('gated_delta')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'gated_delta'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Gated Delta AI Model</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">5,646×11</span>
          </button>

          <button
            id="nav-tab-data-pipeline"
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'pipeline'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Journey & 262k Dataset</span>
          </button>

          <button
            id="nav-tab-presentation"
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'presentation'
                ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-semibold">SIH 6-Slide Pictorial Deck</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 border border-amber-700/50 text-amber-300 font-mono">Infographic</span>
          </button>

          <button
            id="nav-tab-early-warning"
            onClick={() => setActiveTab('early_warning')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'early_warning'
                ? 'bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Early Warning & Mitigation</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-mono">IMD Alert</span>
          </button>

          <button
            id="nav-tab-future-roadmap"
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'roadmap'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Future Flood Inundation</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">HEC-RAS</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
