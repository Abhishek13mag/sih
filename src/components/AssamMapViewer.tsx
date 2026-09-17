import React, { useState, useMemo } from 'react';
import { GridCell, AlertSeverity } from '../types/floodSense';
import { ASSAM_DISTRICTS, RAINFALL_2024_TIMELINE } from '../data/assamDataset';
import {
  ASSAM_GEO_BOUNDS,
  ASSAM_OFFICIAL_DISTRICTS,
  BRAHMAPUTRA_RIVER_POINTS,
  BARAK_RIVER_POINTS,
  MAJULI_ISLAND_POLYGON,
  MAJOR_TRIBUTARIES_DATA,
  INUNDATION_HOTSPOTS
} from '../data/assamGeoData';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CloudRain, 
  Waves, 
  Info,
  Compass,
  Eye,
  CheckCircle2
} from 'lucide-react';

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
  onSelectDate,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showInundationLayer, setShowInundationLayer] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState<boolean>(true);
  const [showAnchors, setShowAnchors] = useState<boolean>(true);
  const [showGridPoints, setShowGridPoints] = useState<boolean>(true);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Cartographically calibrated Equirectangular Plate Carrée Projection with cosine scaling
  // Exact bounds derived from official GIS data: Lon [89.65 - 96.08], Lat [24.10 - 28.02]
  const { minLon, maxLon, minLat, maxLat, meanLat } = ASSAM_GEO_BOUNDS;

  const svgWidth = 860;
  const svgHeight = 520;
  const padX = 26;
  const padY = 22;

  const meanLatRad = (meanLat * Math.PI) / 180;
  const cosLat = Math.cos(meanLatRad); // ~0.898 for accurate metric aspect ratio

  const spanLon = (maxLon - minLon) * cosLat;
  const spanLat = maxLat - minLat;

  const availW = svgWidth - 2 * padX;
  const availH = svgHeight - 2 * padY;
  const scale = Math.min(availW / spanLon, availH / spanLat);

  const actualW = spanLon * scale;
  const actualH = spanLat * scale;
  const offsetX = padX + (availW - actualW) / 2;
  const offsetY = padY + (availH - actualH) / 2;

  const projectToSvg = (lat: number, lon: number) => {
    const normX = (lon - minLon) * cosLat;
    const normY = lat - minLat;
    const x = offsetX + normX * scale;
    const y = svgHeight - (offsetY + normY * scale);
    return { x, y };
  };

  // 100 km scale length in SVG pixels (1° latitude ≈ 111.13 km)
  const km100InPixels = (100 / 111.13) * scale;

  // Filter cells based on user criteria
  const filteredCells = useMemo(() => {
    return cells.filter((c) => {
      const matchesDistrict = selectedDistrict === 'ALL' || c.district === selectedDistrict;
      const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
      return matchesDistrict && matchesSeverity;
    });
  }, [cells, selectedDistrict, severityFilter]);

  // Statistics calculation for the current view
  const stats = useMemo(() => {
    const total = cells.length;
    const warningCount = cells.filter(c => c.predictedRainfall >= 64.5).length;
    const peakCell = [...cells].sort((a, b) => b.predictedRainfall - a.predictedRainfall)[0];
    const avgRain = cells.reduce((acc, curr) => acc + curr.predictedRainfall, 0) / (total || 1);
    return {
      total,
      warningCount,
      peakRainfall: peakCell ? peakCell.predictedRainfall : 0,
      peakDistrict: peakCell ? peakCell.district : 'N/A',
      avgRainfall: avgRain.toFixed(2),
    };
  }, [cells]);

  const getSeverityColor = (category: AlertSeverity) => {
    switch (category) {
      case 'catastrophic':
        return '#b91c1c'; // Deep Crimson
      case 'very_heavy':
        return '#dc2626'; // Red
      case 'heavy':
        return '#ea580c'; // Orange
      case 'moderate':
        return '#d97706'; // Amber
      default:
        return '#059669'; // Forest Emerald
    }
  };

  // River geometry strings
  const brahmaputraPath = useMemo(() => {
    return BRAHMAPUTRA_RIVER_POINTS.map((pt, i) => {
      const { x, y } = projectToSvg(pt[1], pt[0]);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [scale, offsetX, offsetY]);

  const barakPath = useMemo(() => {
    return BARAK_RIVER_POINTS.map((pt, i) => {
      const { x, y } = projectToSvg(pt[1], pt[0]);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [scale, offsetX, offsetY]);

  const majuliPath = useMemo(() => {
    return MAJULI_ISLAND_POLYGON.map((pt, i) => {
      const { x, y } = projectToSvg(pt[1], pt[0]);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  }, [scale, offsetX, offsetY]);

  // Major Administrative & Hydrological Anchors
  const CITY_ANCHORS = [
    { name: 'Guwahati', lat: 26.18, lon: 91.74 },
    { name: 'Dibrugarh', lat: 27.47, lon: 94.91 },
    { name: 'Silchar', lat: 24.83, lon: 92.79 },
    { name: 'Tezpur', lat: 26.65, lon: 92.79 },
    { name: 'Jorhat', lat: 26.75, lon: 94.22 },
    { name: 'Dhubri', lat: 26.02, lon: 89.97 },
    { name: 'Dhemaji', lat: 27.48, lon: 94.58 },
    { name: 'Haflong', lat: 25.18, lon: 92.93 },
    { name: 'Kokrajhar', lat: 26.40, lon: 90.27 },
  ];

  // Helper to test if a district shape matches the selected filter
  const isDistrictActive = (districtName: string) => {
    if (selectedDistrict === 'ALL') return false;
    const s = selectedDistrict.toLowerCase();
    const d = districtName.toLowerCase();
    if (d === s) return true;
    if (s.includes('kamrup') && d.includes('kamrup')) return true;
    if (s === 'biswanath' && d === 'sonitpur') return true;
    if (s === 'hojai' && d === 'nagaon') return true;
    if (s === 'south salmara-mankachar' && d === 'dhubri') return true;
    if (s === 'bajali' && d === 'barpeta') return true;
    if (s === 'charaideo' && d === 'sivasagar') return true;
    if (s === 'majuli' && (d === 'jorhat' || d === 'lakhimpur')) return true;
    if (s === 'west karbi anglong' && d === 'karbi anglong') return true;
    if (s === 'morigaon' && d === 'marigaon') return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Telemetry Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">Observation Date:</span>
            <select
              id="select-observation-date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium cursor-pointer"
            >
              {RAINFALL_2024_TIMELINE.map((t) => (
                <option key={t.date} value={t.date}>
                  {t.date} — {t.season} ({t.maxRainfall.toFixed(1)} mm max)
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">District:</span>
            <select
              id="select-district-filter"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Assam Districts ({ASSAM_DISTRICTS.length})</option>
              {ASSAM_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>{d.name} ({d.basin})</option>
              ))}
            </select>
          </div>

          {/* Severity Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">IMD Alert Tier:</span>
            <select
              id="select-severity-filter"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Warning Tiers</option>
              <option value="catastrophic">Catastrophic Peak (&gt;204.4 mm)</option>
              <option value="very_heavy">Very Heavy Red Alert (&gt;115.5 mm)</option>
              <option value="heavy">Heavy Rain Warning (&gt;64.5 mm)</option>
              <option value="moderate">Moderate Showers (15.5 - 64.5 mm)</option>
              <option value="normal">Normal / Light (&lt;15.5 mm)</option>
            </select>
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Rivers &amp; Tributaries</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showInundationLayer}
                onChange={(e) => setShowInundationLayer(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Flood Hotspots</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showDistrictBorders}
                onChange={(e) => setShowDistrictBorders(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Districts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Active Grid Footprint</span>
          <div className="text-2xl font-bold text-slate-900 font-display mt-0.5">
            {filteredCells.length}
            <span className="text-xs font-normal text-slate-500 ml-1">/ 718 cells</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">0.1° (~10 km) resolution</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Cells Exceeding IMD Alert</span>
          <div className="text-2xl font-bold text-red-600 font-display mt-0.5">
            {stats.warningCount}
            <span className="text-xs font-normal text-slate-500 ml-1">cells &gt; 64.5 mm</span>
          </div>
          <span className="text-[11px] text-red-700 font-medium">Flash flood alert triggered</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Basin Max 24h Rainfall</span>
          <div className="text-2xl font-bold text-rose-600 font-display mt-0.5">
            {stats.peakRainfall.toFixed(1)}
            <span className="text-xs font-normal text-slate-500 ml-1">mm/day</span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium">{stats.peakDistrict} District</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Spatial Mean Rainfall</span>
          <div className="text-2xl font-bold text-blue-700 font-display mt-0.5">
            {stats.avgRainfall}
            <span className="text-xs font-normal text-slate-500 ml-1">mm/day</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Assam Basin Average</span>
        </div>
      </div>

      {/* Main Map & Detail Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Assam Map (8 Cols on desktop) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Assam Hydro-Meteorological Spatial Grid (718 Observations)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {hoveredDistrict && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {hoveredDistrict}
                </span>
              )}
              <span className="text-xs text-slate-500 font-mono">
                WGS 84 [24.1°N–28.0°N, 89.7°E–96.1°E]
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full bg-slate-50/70 rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center p-1">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[520px]"
            >
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.65" />
                </pattern>
                
                {/* Subtle drop shadow for selected elements */}
                <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Coordinate Grid */}
              <rect width={svgWidth} height={svgHeight} fill="url(#grid-pattern)" />

              {/* Cartographic Parallels & Meridians (Light graticule lines) */}
              {[25.0, 26.0, 27.0].map((lat) => {
                const { y } = projectToSvg(lat, minLon);
                return (
                  <g key={`lat-${lat}`}>
                    <line x1={padX} y1={y} x2={svgWidth - padX} y2={y} stroke="#e2e8f0" strokeWidth="0.75" strokeDasharray="3 3" />
                    <text x={padX + 4} y={y - 4} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">{lat.toFixed(1)}°N</text>
                  </g>
                );
              })}

              {[90.0, 92.0, 94.0, 95.5].map((lon) => {
                const { x } = projectToSvg(minLat, lon);
                return (
                  <g key={`lon-${lon}`}>
                    <line x1={x} y1={padY} x2={x} y2={svgHeight - padY} stroke="#e2e8f0" strokeWidth="0.75" strokeDasharray="3 3" />
                    <text x={x + 3} y={svgHeight - padY - 6} fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">{lon.toFixed(1)}°E</text>
                  </g>
                );
              })}

              {/* Authentic Official District Boundaries of Assam */}
              <g id="assam-districts-layer">
                {ASSAM_OFFICIAL_DISTRICTS.map((dist) => {
                  const isActive = isDistrictActive(dist.name);
                  const isHovered = hoveredDistrict === dist.name;
                  
                  return (
                    <g key={dist.name}>
                      {dist.rings.map((ring, rIdx) => {
                        const dStr = ring.map((pt, pIdx) => {
                          const { x, y } = projectToSvg(pt[1], pt[0]);
                          return `${pIdx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
                        }).join(' ') + ' Z';

                        return (
                          <path
                            key={`${dist.name}-ring-${rIdx}`}
                            d={dStr}
                            fill={isActive ? '#dbeafe' : isHovered ? '#eff6ff' : '#ffffff'}
                            stroke={isActive ? '#2563eb' : showDistrictBorders ? '#94a3b8' : '#cbd5e1'}
                            strokeWidth={isActive ? 2.2 : showDistrictBorders ? 1.0 : 0.6}
                            strokeLinejoin="round"
                            className="transition-colors duration-150 cursor-pointer"
                            onMouseEnter={() => setHoveredDistrict(dist.name)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            onClick={() => {
                              setSelectedDistrict(dist.name);
                            }}
                          >
                            <title>{dist.name} District</title>
                          </path>
                        );
                      })}
                    </g>
                  );
                })}
              </g>

              {/* Majuli River Island (World's Largest River Island) */}
              <g id="majuli-island-layer">
                <path
                  d={majuliPath}
                  fill="#dcfce7"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all hover:fill-emerald-200"
                  onClick={() => setSelectedDistrict('Majuli')}
                >
                  <title>Majuli Island (River Island District)</title>
                </path>
                {/* Majuli Label */}
                {(() => {
                  const { x, y } = projectToSvg(26.96, 94.21);
                  return (
                    <text
                      x={x}
                      y={y + 3}
                      textAnchor="middle"
                      fill="#15803d"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="Plus Jakarta Sans"
                    >
                      Majuli
                    </text>
                  );
                })()}
              </g>

              {/* Rivers & Tributaries Layer */}
              {showRivers && (
                <g id="hydrographic-network-layer" className="pointer-events-none">
                  {/* Major Northern & Southern Tributaries */}
                  {MAJOR_TRIBUTARIES_DATA.map((trib) => {
                    const tribD = trib.points.map((pt, i) => {
                      const { x, y } = projectToSvg(pt[1], pt[0]);
                      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
                    }).join(' ');

                    return (
                      <g key={trib.name}>
                        <path
                          d={tribD}
                          fill="none"
                          stroke="#7dd3fc"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.85"
                        />
                      </g>
                    );
                  })}

                  {/* Brahmaputra River Trunk */}
                  <path
                    d={brahmaputraPath}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />

                  {/* Barak River Trunk (Southern Valley) */}
                  <path
                    d={barakPath}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />

                  {/* River Annotations along natural watercourses */}
                  {(() => {
                    const bMid = projectToSvg(26.42, 92.42);
                    const barakMid = projectToSvg(24.83, 92.75);
                    return (
                      <>
                        <text
                          x={bMid.x}
                          y={bMid.y - 8}
                          fill="#0284c7"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="Plus Jakarta Sans"
                          className="drop-shadow-xs"
                        >
                          Brahmaputra River Trunk
                        </text>
                        <text
                          x={barakMid.x - 20}
                          y={barakMid.y - 8}
                          fill="#0284c7"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="Plus Jakarta Sans"
                          className="drop-shadow-xs"
                        >
                          Barak River
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Flood Inundation Hotspot Lowlands Overlay */}
              {showInundationLayer && (
                <g id="inundation-hotspots-layer" opacity="0.4">
                  {INUNDATION_HOTSPOTS.map((spot) => {
                    const { x, y } = projectToSvg(spot.center[1], spot.center[0]);
                    return (
                      <g key={spot.name}>
                        <ellipse
                          cx={x}
                          cy={y}
                          rx={spot.rx}
                          ry={spot.ry}
                          fill={spot.dangerLevel === 'Critical' ? '#dc2626' : '#ea580c'}
                          stroke={spot.dangerLevel === 'Critical' ? '#991b1b' : '#c2410c'}
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 718 Spatial Grid Cells */}
              {filteredCells.map((cell) => {
                const { x, y } = projectToSvg(cell.lat, cell.lon);
                const isSelected = selectedCell?.id === cell.id;
                const fillCol = getSeverityColor(cell.severity);
                const radius = isSelected ? 7 : cell.predictedRainfall > 115.5 ? 5 : 3.5;

                return (
                  <g
                    key={cell.id}
                    className="cursor-pointer"
                    onClick={() => onSelectCell(cell)}
                  >
                    {cell.predictedRainfall > 115.5 && (
                      <circle
                        cx={x}
                        cy={y}
                        r={radius + 3}
                        fill="none"
                        stroke={fillCol}
                        strokeWidth="1.5"
                        opacity="0.65"
                      />
                    )}

                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={fillCol}
                      stroke={isSelected ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 0.8}
                      className="transition-all hover:scale-130"
                    />

                    {isSelected && (
                      <g>
                        <circle cx={x} cy={y} r={radius + 6} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
                        <rect
                          x={x + 10}
                          y={y - 24}
                          width={cell.district.length * 7 + 75}
                          height={20}
                          rx={4}
                          fill="#0f172a"
                          opacity="0.9"
                        />
                        <text
                          x={x + 16}
                          y={y - 10}
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono"
                        >
                          {cell.district}: {cell.predictedRainfall.toFixed(1)} mm
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Geographic City/Town Anchor Markers */}
              {CITY_ANCHORS.map((city) => {
                const { x, y } = projectToSvg(city.lat, city.lon);
                return (
                  <g key={city.name} className="pointer-events-none">
                    <circle cx={x} cy={y} r="2.5" fill="#1e293b" />
                    <circle cx={x} cy={y} r="4.5" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.7" />
                    <text
                      x={x + 5}
                      y={y + 3}
                      fill="#334155"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="Plus Jakarta Sans"
                      className="select-none drop-shadow-xs"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}

              {/* Compass Rose (North Arrow) in Top Right */}
              <g transform={`translate(${svgWidth - 65}, 35)`} className="pointer-events-none">
                <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M 0,-12 L 4,0 L 0,3 L -4,0 Z" fill="#2563eb" />
                <path d="M 0,12 L 4,0 L 0,3 L -4,0 Z" fill="#94a3b8" />
                <text x="0" y="-14" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans">N</text>
              </g>

              {/* Authentic Metric Scale Bar in Bottom Right */}
              <g transform={`translate(${svgWidth - 170}, ${svgHeight - 25})`} className="pointer-events-none">
                <rect x="0" y="0" width={km100InPixels / 2} height="4" fill="#1e293b" />
                <rect x={km100InPixels / 2} y="0" width={km100InPixels / 2} height="4" fill="#ffffff" stroke="#1e293b" strokeWidth="0.75" />
                <line x1="0" y1="-2" x2="0" y2="6" stroke="#1e293b" strokeWidth="1" />
                <line x1={km100InPixels / 2} y1="-2" x2={km100InPixels / 2} y2="6" stroke="#1e293b" strokeWidth="1" />
                <line x1={km100InPixels} y1="-2" x2={km100InPixels} y2="6" stroke="#1e293b" strokeWidth="1" />
                <text x="0" y="-5" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">0</text>
                <text x={km100InPixels / 2} y="-5" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">50</text>
                <text x={km100InPixels} y="-5" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="JetBrains Mono">100 km</text>
              </g>
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs rounded-lg border border-slate-200 p-2.5 shadow-xs text-xs space-y-1.5 pointer-events-auto">
              <span className="text-[11px] font-bold text-slate-800 block border-b border-slate-100 pb-1">
                IMD 24h Rainfall Warning Scale
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Normal (&lt;15.5 mm)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>Moderate (15.5-64.5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                  <span>Heavy (64.5-115.5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span>Very Heavy (&gt;115.5)</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-800"></span>
                  <span>Catastrophic Event (&gt;204.4 mm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Grid Cell Telemetry Inspector (4 Cols on desktop) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Spatial Cell Telemetry
              </h3>
            </div>
            {selectedCell && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {selectedCell.id}
              </span>
            )}
          </div>

          {selectedCell ? (
            <div className="space-y-3.5 text-xs">
              {/* District & Location */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Assam District</span>
                    <h4 className="text-base font-bold text-slate-900 font-display">{selectedCell.district}</h4>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedCell.severity === 'catastrophic'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : selectedCell.severity === 'very_heavy'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : selectedCell.severity === 'heavy'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedCell.severity.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-600 flex justify-between border-t border-slate-200/80 pt-1.5">
                  <span>Lat: {selectedCell.lat.toFixed(4)}°N</span>
                  <span>Lon: {selectedCell.lon.toFixed(4)}°E</span>
                </div>
              </div>

              {/* Gated Delta Predicted vs GPM Observed */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-semibold block">Gated Delta Predicted</span>
                  <div className="text-xl font-bold text-blue-900 font-display mt-0.5">
                    {selectedCell.predictedRainfall.toFixed(1)}
                    <span className="text-xs font-normal text-blue-700 ml-1">mm</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono">Neural Model Output</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block">GPM IMERG Observed</span>
                  <div className="text-xl font-bold text-slate-800 font-display mt-0.5">
                    {selectedCell.observedRainfall.toFixed(1)}
                    <span className="text-xs font-normal text-slate-500 ml-1">mm</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Δ: {(selectedCell.predictedRainfall - selectedCell.observedRainfall).toFixed(1)} mm
                  </span>
                </div>
              </div>

              {/* Sentinel-5P Cloud Atmospheric Parameters */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Sentinel-5P CLOUD Input Features (NetCDF)
                </span>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Cloud Fraction (cf):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {(selectedCell.cloudFraction * 100).toFixed(0)}% (QA &gt; 0.5)
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Cloud Top Height (cth):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {selectedCell.cloudTopHeight.toFixed(1)} km
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Cloud Optical Depth:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {selectedCell.cloudOpticalDepth.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Delta Observation Time:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {selectedCell.deltaT.toFixed(1)} hrs elapsed
                    </span>
                  </div>
                </div>
              </div>

              {/* Inundation Risk & Action Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Sub-basin Hydrological Notice</span>
                </div>
                {selectedCell.predictedRainfall >= 64.5
                  ? `High risk of surface flash flooding along river banks and low-lying agrarian fields in ${selectedCell.district}. Action advised: activate local DEOC alerts.`
                  : `Rainfall within normal absorption capacity for ${selectedCell.district}. No immediate waterlogging alert.`}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Click any of the 718 spatial grid points on the Assam map to inspect live telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
