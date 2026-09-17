import React from 'react';
import { 
  CloudRain, 
  Satellite, 
  Play, 
  Sparkles, 
  Map, 
  Sliders, 
  Database, 
  Presentation, 
  ShieldAlert, 
  Compass,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers
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
  isAiAdvisorOpen,
}) => {
  const tabs = [
    { id: 'monitoring', label: 'Spatial Grid & Map', icon: Map, badge: '718 Cells' },
    { id: 'gated_delta', label: 'Gated Delta AI Lab', icon: Sliders, badge: 'PyTorch' },
    { id: 'pipeline', label: 'Data Pipeline', icon: Database, badge: '262k Recs' },
    { id: 'presentation', label: 'Presentation Slides', icon: Presentation, badge: '6 Slides' },
    { id: 'early_warning', label: 'Emergency Alerts', icon: ShieldAlert, badge: 'ASDMA/IMD' },
    { id: 'roadmap', label: 'Hydraulic Roadmap', icon: Compass, badge: 'HEC-RAS' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Institutional Metadata Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 sm:px-6 lg:px-8 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50">
              SIH26071
            </span>
            <span className="text-slate-400">Team Aqua Sentinel</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">Assam Hydrological Early Warning System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Operational Telemetry Active
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Sentinel-5P CLOUD + GPM IMERG 2024</span>
          </div>
        </div>
      </div>

      {/* Main App Title & Operational Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & System Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight font-display">
                FloodSense
              </h1>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                v2.4 Production
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              AI-Based Heavy Rainfall Early Warning & Basin Inundation Intelligence
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-run-satellite-pass"
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>Ingesting Sentinel Overpass...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Overpass Inference</span>
              </>
            )}
          </button>

          <button
            id="btn-toggle-ai-advisor"
            onClick={onToggleAiAdvisor}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isAiAdvisorOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Hydro Advisor</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
