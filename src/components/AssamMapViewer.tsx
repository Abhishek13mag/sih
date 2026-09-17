import React, { useState, useMemo } from 'react';
import { GridCell } from '../types/floodSense';
import { 
  Search, 
  Filter, 
  MapPin, 
  CloudRain, 
  Info, 
  SlidersHorizontal,
  Layers, 
  Calendar,
  AlertTriangle,
  Waves,
  Eye
} from 'lucide-react';
import { RAINFALL_2024_TIMELINE } from '../data/assamDataset';

interface AssamMapViewerProps {
  cells: GridCell[];
  selectedCell: GridCell | null;
  onSelectCell: (cell: GridCell) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const AssamMapViewer: React.FC<AssamMapViewerProps> = ({
  cells,
  selectedCell,
  onSelectCell,
  selectedDate,
  onSelectDate
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showInundationLayer, setShowInundationLayer] = useState<boolean>(false);
  const [showRiverNetwork, setShowRiverNetwork] = useState<boolean>(true);
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);

  // Map coordinates projection for Assam:
  // Lat range: 24.2°N to 28.0°N (span 3.8)
  // Lon range: 89.7°E to 96.0°E (span 6.3)
  const mapWidth = 860;
  const mapHeight = 520;

  const projectCoord = (lat: number, lon: number) => {
    const x = ((lon - 89.6) / (96.2 - 89.6)) * (mapWidth - 60) + 30;
    // Invert Y because SVG coordinates go top-down
    const y = mapHeight - (((lat - 24.1) / (28.2 - 24.1)) * (mapHeight - 60) + 30);
    return { x, y };
  };

  const filteredCells = useMemo(() => {
    return cells.filter(cell => {
      if (districtFilter !== 'ALL' && cell.district !== districtFilter) return false;
      if (severityFilter !== 'ALL' && cell.severity !== severityFilter) return false;
      return true;
    });
  }, [cells, districtFilter, severityFilter]);

  // Distinct districts list for filtering
  const distinctDistricts = useMemo(() => {
    return Array.from(new Set(cells.map(c => c.district))).sort();
  }, [cells]);

  // Color helper based on IMD classification
  const getCellColor = (predictedRain: number) => {
    if (predictedRain > 204.4) return '#ec4899'; // Extreme/Catastrophic pink/crimson
    if (predictedRain > 115.5) return '#ef4444'; // Red alert (>115.5)
    if (predictedRain > 64.5) return '#f97316';  // Heavy orange (>64.5)
    if (predictedRain > 15.5) return '#eab308';  // Moderate yellow (>15.5)
    return '#10b981';                           // Normal green
  };

  // SVG representation of Brahmaputra River through Assam (from East to West)
  const riverBrahmaputraPath = `
    M ${projectCoord(27.85, 95.70).x} ${projectCoord(27.85, 95.70).y}
    Q ${projectCoord(27.50, 95.20).x} ${projectCoord(27.50, 95.20).y}, ${projectCoord(27.35, 94.60).x} ${projectCoord(27.35, 94.60).y}
    T ${projectCoord(26.90, 94.10).x} ${projectCoord(26.90, 94.10).y}
    T ${projectCoord(26.60, 93.40).x} ${projectCoord(26.60, 93.40).y}
    T ${projectCoord(26.60, 92.80).x} ${projectCoord(26.60, 92.80).y}
    T ${projectCoord(26.25, 92.00).x} ${projectCoord(26.25, 92.00).y}
    T ${projectCoord(26.15, 91.70).x} ${projectCoord(26.15, 91.70).y}
    T ${projectCoord(26.10, 91.00).x} ${projectCoord(26.10, 91.00).y}
    T ${projectCoord(26.15, 90.30).x} ${projectCoord(26.15, 90.30).y}
    T ${projectCoord(25.95, 89.85).x} ${projectCoord(25.95, 89.85).y}
  `;

  // Barak River path (Southern Assam)
  const riverBarakPath = `
    M ${projectCoord(24.95, 93.15).x} ${projectCoord(24.95, 93.15).y}
    Q ${projectCoord(24.80, 92.80).x} ${projectCoord(24.80, 92.80).y}, ${projectCoord(24.85, 92.40).x} ${projectCoord(24.85, 92.40).y}
  `;

  // Summary counts
  const heavyCount = filteredCells.filter(c => c.predictedRainfall > 64.5).length;
  const extremeCount = filteredCells.filter(c => c.predictedRainfall > 115.5).length;
  const peakRainCell = filteredCells.reduce((max, c) => c.predictedRainfall > (max?.predictedRainfall || 0) ? c : max, filteredCells[0]);

  return (
    <div className="space-y-4">
      {/* Top Filter & Control Panel */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector Timeline */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <label className="text-xs font-semibold text-slate-300">Monsoon Event Date:</label>
          <select
            id="select-monsoon-date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          >
            {RAINFALL_2024_TIMELINE.map((item) => (
              <option key={item.date} value={item.date}>
                {item.date} — {item.season} (Max: {item.maxRainfall} mm/day)
              </option>
            ))}
          </select>
        </div>

        {/* District & Severity Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-district"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Districts ({cells.length} cells)</option>
              {distinctDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Warning Tiers</option>
              <option value="catastrophic">Catastrophic (&gt;204.4 mm)</option>
              <option value="very_heavy">Very Heavy Red Alert (&gt;115.5 mm)</option>
              <option value="heavy">Heavy Warning (&gt;64.5 mm)</option>
              <option value="moderate">Moderate (&gt;15.5 mm)</option>
              <option value="normal">Normal (&lt;15.5 mm)</option>
            </select>
          </div>

          {/* Toggle Layers */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <button
              id="btn-toggle-inundation"
              onClick={() => setShowInundationLayer(!showInundationLayer)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showInundationLayer
                  ? 'bg-blue-950 border-blue-600 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Hydraulic Inundation Layer</span>
            </button>

            <button
              id="btn-toggle-river"
              onClick={() => setShowRiverNetwork(!showRiverNetwork)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showRiverNetwork
                  ? 'bg-cyan-950 border-cyan-600 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Brahmaputra Channel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Map Canvas & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Map Container */}
        <div className="lg:col-span-3 bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-xl relative overflow-hidden flex flex-col">
          {/* Header info overlay */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <h2 className="text-sm font-semibold text-white">Assam Regional Spatial Grid (718 Observations × Date)</h2>
              <span className="text-xs font-mono text-slate-400">
                Filtered: <strong className="text-cyan-300">{filteredCells.length}</strong> / 718 cells
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Peak Cell: <strong className="text-pink-400">{peakRainCell?.predictedRainfall || 0} mm/day</strong></span>
              <span className="text-slate-400">Red Alert Cells: <strong className="text-red-400">{extremeCount}</strong></span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full aspect-[16/9] bg-slate-950/90 rounded-lg border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
            <svg 
              viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
              className="w-full h-full select-none"
            >
              <defs>
                {/* Glow filter for severe cells */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* River water pattern */}
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Background Assam Geographic Basin Outline Approximate Boundary */}
              <path
                d={`
                  M ${projectCoord(27.95, 95.80).x} ${projectCoord(27.95, 95.80).y}
                  L ${projectCoord(27.90, 94.40).x} ${projectCoord(27.90, 94.40).y}
                  L ${projectCoord(27.10, 93.50).x} ${projectCoord(27.10, 93.50).y}
                  L ${projectCoord(26.90, 92.10).x} ${projectCoord(26.90, 92.10).y}
                  L ${projectCoord(26.85, 90.10).x} ${projectCoord(26.85, 90.10).y}
                  L ${projectCoord(26.10, 89.80).x} ${projectCoord(26.10, 89.80).y}
                  L ${projectCoord(25.75, 90.00).x} ${projectCoord(25.75, 90.00).y}
                  L ${projectCoord(25.90, 91.20).x} ${projectCoord(25.90, 91.20).y}
                  L ${projectCoord(25.80, 92.30).x} ${projectCoord(25.80, 92.30).y}
                  L ${projectCoord(24.40, 92.50).x} ${projectCoord(24.40, 92.50).y}
                  L ${projectCoord(24.50, 93.10).x} ${projectCoord(24.50, 93.10).y}
                  L ${projectCoord(25.40, 93.20).x} ${projectCoord(25.40, 93.20).y}
                  L ${projectCoord(26.10, 93.60).x} ${projectCoord(26.10, 93.60).y}
                  L ${projectCoord(26.60, 94.50).x} ${projectCoord(26.60, 94.50).y}
                  L ${projectCoord(27.30, 95.60).x} ${projectCoord(27.30, 95.60).y}
                  Z
                `}
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Brahmaputra & Barak River Channels */}
              {showRiverNetwork && (
                <g>
                  {/* Main Brahmaputra flow */}
                  <path
                    d={riverBrahmaputraPath}
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  <path
                    d={riverBrahmaputraPath}
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                  <text
                    x={projectCoord(26.50, 92.50).x}
                    y={projectCoord(26.50, 92.50).y - 12}
                    fill="#38bdf8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="opacity-70"
                  >
                    Brahmaputra River Basin
                  </text>

                  {/* Barak Valley River */}
                  <path
                    d={riverBarakPath}
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  <text
                    x={projectCoord(24.80, 92.80).x - 40}
                    y={projectCoord(24.80, 92.80).y - 8}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="opacity-60"
                  >
                    Barak River
                  </text>
                </g>
              )}

              {/* Simulated Inundation Hazard Zones (When toggled) */}
              {showInundationLayer && (
                <g className="animate-pulse opacity-40">
                  {/* Kaziranga / Majuli overflow */}
                  <ellipse
                    cx={projectCoord(26.96, 94.21).x}
                    cy={projectCoord(26.96, 94.21).y}
                    rx="32"
                    ry="20"
                    fill="#38bdf8"
                  />
                  {/* Barpeta / Beki overflow */}
                  <ellipse
                    cx={projectCoord(26.32, 91.00).x}
                    cy={projectCoord(26.32, 91.00).y}
                    rx="28"
                    ry="18"
                    fill="#38bdf8"
                  />
                  {/* Silchar / Cachar urban submergence */}
                  <ellipse
                    cx={projectCoord(24.83, 92.79).x}
                    cy={projectCoord(24.83, 92.79).y}
                    rx="25"
                    ry="16"
                    fill="#38bdf8"
                  />
                </g>
              )}

              {/* The 718 Spatial Grid Cells */}
              {filteredCells.map((cell) => {
                const { x, y } = projectCoord(cell.lat, cell.lon);
                const isSelected = selectedCell?.id === cell.id;
                const isHovered = hoveredCell?.id === cell.id;
                const isHighRisk = cell.predictedRainfall > 115.5;
                const color = getCellColor(cell.predictedRainfall);

                return (
                  <g key={cell.id}>
                    {/* Pulsing ring for severe warnings */}
                    {isHighRisk && (
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        className="animate-ping opacity-60 pointer-events-none"
                      />
                    )}

                    {/* Interactive Grid Cell circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6.5 : isHovered ? 5.5 : 3.8}
                      fill={color}
                      stroke={isSelected ? '#ffffff' : '#090d16'}
                      strokeWidth={isSelected ? 2 : 1}
                      filter={isHighRisk ? 'url(#glow)' : undefined}
                      className="cursor-pointer transition-all duration-150 hover:opacity-100"
                      onClick={() => onSelectCell(cell)}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  </g>
                );
              })}

              {/* Geographic Label Anchors */}
              <g className="pointer-events-none">
                <text x={projectCoord(26.18, 91.74).x} y={projectCoord(26.18, 91.74).y + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">Guwahati</text>
                <text x={projectCoord(27.47, 94.91).x} y={projectCoord(27.47, 94.91).y + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">Dibrugarh</text>
                <text x={projectCoord(26.32, 91.00).x} y={projectCoord(26.32, 91.00).y + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">Barpeta</text>
                <text x={projectCoord(26.02, 89.97).x} y={projectCoord(26.02, 89.97).y + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">Dhubri</text>
                <text x={projectCoord(24.83, 92.79).x} y={projectCoord(24.83, 92.79).y + 14} fill="#94a3b8" fontSize="10" fontWeight="bold">Silchar (Cachar)</text>
                <text x={projectCoord(26.96, 94.21).x} y={projectCoord(26.96, 94.21).y - 8} fill="#38bdf8" fontSize="9">Majuli Island</text>
              </g>
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredCell && (
              <div 
                className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-2xl text-xs font-mono backdrop-blur-md"
                style={{
                  top: '12px',
                  right: '12px'
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 mb-1.5">
                  <span className="font-bold text-white">{hoveredCell.id}</span>
                  <span className="text-cyan-400">{hoveredCell.district}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-200">{hoveredCell.lat}°N, {hoveredCell.lon}°E</span>
                  <span className="text-slate-400">Gated Delta Pred:</span>
                  <span className="font-bold text-pink-400">{hoveredCell.predictedRainfall} mm/day</span>
                  <span className="text-slate-400">GPM Observed:</span>
                  <span className="text-blue-300">{hoveredCell.observedRainfall} mm/day</span>
                  <span className="text-slate-400">Cloud Fraction:</span>
                  <span className="text-cyan-300">{hoveredCell.cloudFraction}</span>
                </div>
              </div>
            )}
          </div>

          {/* Color Scale Legend according to IMD / CWC Specifications */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">IMD Warning Tiers:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Normal (&lt;15.5 mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="text-slate-300">Moderate (15.6 - 64.4)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="text-slate-300">Heavy (&gt;64.5 mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-slate-300 font-semibold">Very Heavy Red Alert (&gt;115.5)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50"></span>
                <span className="text-pink-300 font-bold">Extremely Heavy (&gt;204.4 mm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Cell Inspector Sidebar */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">Grid Cell Telemetry</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedCell ? selectedCell.id : 'GRID_142'}
              </span>
            </div>

            {selectedCell ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Location & Catchment</span>
                  <div className="text-base font-semibold text-white mt-0.5">
                    {selectedCell.district}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Basin: <strong className="text-cyan-300">{selectedCell.riverBasin}</strong>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                    Lat: {selectedCell.lat}°N | Lon: {selectedCell.lon}°E
                  </div>
                </div>

                {/* Rainfall Comparison Card */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Gated Delta Pred:</span>
                    <span className="text-base font-bold font-mono text-pink-400">
                      {selectedCell.predictedRainfall} mm/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">GPM IMERG Observed:</span>
                    <span className="font-mono text-blue-300">
                      {selectedCell.observedRainfall} mm/day
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] border-t border-slate-800/60 pt-1.5 text-slate-400">
                    <span>Model Delta Error:</span>
                    <span className="font-mono text-emerald-400">
                      {Math.abs(selectedCell.predictedRainfall - selectedCell.observedRainfall).toFixed(2)} mm (MAE ~3.8)
                    </span>
                  </div>
                </div>

                {/* Satellite Cloud Features (Sentinel-5P CLOUD NetCDF) */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-medium block text-[11px] flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                    Sentinel-5P Observations
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Cloud Fraction</span>
                      <span className="text-cyan-300 font-bold">{selectedCell.cloudFraction}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Top Height</span>
                      <span className="text-cyan-300 font-bold">{selectedCell.cloudTopHeight} km</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Optical Depth</span>
                      <span className="text-cyan-300 font-bold">{selectedCell.cloudOpticalDepth}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Delta T</span>
                      <span className="text-cyan-300 font-bold">{selectedCell.deltaT} hrs</span>
                    </div>
                  </div>
                </div>

                {/* Warning Status & Advisory */}
                <div className={`p-3 rounded-lg border text-[11px] ${
                  selectedCell.predictedRainfall > 115.5
                    ? 'bg-red-950/50 border-red-800 text-red-200'
                    : selectedCell.predictedRainfall > 64.5
                    ? 'bg-orange-950/50 border-orange-800 text-orange-200'
                    : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {selectedCell.predictedRainfall > 115.5
                        ? 'CRITICAL RED ALERT'
                        : selectedCell.predictedRainfall > 64.5
                        ? 'HEAVY RAINFALL WARNING'
                        : 'NORMAL MONITORING'}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-90">
                    {selectedCell.predictedRainfall > 115.5
                      ? 'Immediate river embankment watch and flood shelter pre-activation required for vulnerable lowlands.'
                      : selectedCell.predictedRainfall > 64.5
                      ? 'High soil saturation expected. Waterlogging alerts dispatched to urban municipal authorities.'
                      : 'Atmospheric stability within standard parameters. Continuous satellite observation active.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                Click any of the 718 spatial grid points on the Assam map to inspect satellite telemetry and model predictions.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Grid Resolution: 0.1° (~11km)</span>
            <span className="font-mono text-cyan-400">Assam GeoJSON</span>
          </div>
        </div>
      </div>
    </div>
  );
};
