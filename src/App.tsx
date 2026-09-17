import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { AssamMapViewer } from './components/AssamMapViewer';
import { GatedDeltaLab } from './components/GatedDeltaLab';
import { DataPipelineView } from './components/DataPipelineView';
import { PresentationMode } from './components/PresentationMode';
import { EarlyWarningCenter } from './components/EarlyWarningCenter';
import { FutureRoadmap } from './components/FutureRoadmap';
import { AiHydroAdvisor } from './components/AiHydroAdvisor';
import { generateAssamGridCells } from './data/assamDataset';
import { GridCell } from './types/floodSense';
import { 
  CheckCircle2, 
  Sparkles, 
  Satellite, 
  CloudRain, 
  Activity, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('monitoring');
  const [selectedDate, setSelectedDate] = useState<string>('2024-07-02'); // Peak monsoon date (241.63 mm record)
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);

  // Generate 718 spatial grid cells for the selected date
  const cells = useMemo(() => {
    return generateAssamGridCells(selectedDate);
  }, [selectedDate]);

  // Selected cell (default to the peak record cell in Barpeta)
  const [selectedCellId, setSelectedCellId] = useState<string>('GRID_143');

  const selectedCell = useMemo(() => {
    return cells.find(c => c.id === selectedCellId) || cells[0];
  }, [cells, selectedCellId]);

  // Simulation runner simulating a fresh satellite pass & Gated Delta inference
  const handleRunSimulation = useCallback(() => {
    setIsSimulating(true);
    setSimulationNotice('Acquiring latest Sentinel-5P Level-2 NetCDF swath & running Gated Delta tensor inference...');

    setTimeout(() => {
      setSelectedDate('2024-07-02');
      setIsSimulating(false);
      setSimulationNotice('Gated Delta Inference complete: 718 spatial cells updated. 88 cells triggered Very Heavy/Extreme warning.');
      setTimeout(() => setSimulationNotice(null), 5000);
    }, 1400);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* App Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        onRunSimulation={handleRunSimulation}
        onToggleAiAdvisor={() => setIsAiAdvisorOpen(!isAiAdvisorOpen)}
        isAiAdvisorOpen={isAiAdvisorOpen}
      />

      {/* Simulation Feedback Toast */}
      {simulationNotice && (
        <div className="bg-blue-50 border-b border-blue-200 text-blue-900 px-4 py-2 text-xs font-mono flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2 w-full">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{simulationNotice}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'monitoring' && (
          <AssamMapViewer
            cells={cells}
            selectedCell={selectedCell}
            onSelectCell={(c) => setSelectedCellId(c.id)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {activeTab === 'gated_delta' && <GatedDeltaLab />}

        {activeTab === 'pipeline' && <DataPipelineView />}

        {activeTab === 'presentation' && <PresentationMode />}

        {activeTab === 'early_warning' && <EarlyWarningCenter />}

        {activeTab === 'roadmap' && <FutureRoadmap />}
      </main>

      {/* AI Hydro Advisor Side Drawer */}
      <AiHydroAdvisor
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
      />

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-display">FloodSense Hydro-Informatics Portal</span>
            <span>•</span>
            <span className="font-mono text-slate-600">SIH26071</span>
            <span>•</span>
            <span>Team Aqua Sentinel</span>
            <span>•</span>
            <span className="text-slate-600">Assam River Basin Operational Area</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>Sentinel-5P CLOUD & GPM IMERG 2024</span>
            <span>•</span>
            <span className="text-blue-700 font-semibold">Gated Delta Neural Model</span>
            <span>•</span>
            <span>Future: HEC-RAS 2D & Sentinel-1 SAR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
