import React, { useState, useEffect } from 'react';
import { SIH_SLIDES, EXTERNAL_AI_PPT_PROMPT } from '../data/presentationSlides';
import { 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Cpu, 
  Database, 
  BrainCircuit, 
  Radio, 
  Compass,
  ArrowRight,
  Download,
  CloudRain,
  Satellite,
  Waves
} from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);

  const currentSlide = SIH_SLIDES[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(SIH_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(EXTERNAL_AI_PPT_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Deck Control Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold">
            SLIDE {currentSlideIndex + 1} OF {SIH_SLIDES.length}
          </span>
          <span className="text-xs text-slate-600 font-medium hidden sm:inline">
            Smart India Hackathon 2026 Pictorial Presentation Deck
          </span>
        </div>

        {/* Slide Selector Buttons */}
        <div className="flex items-center gap-1.5">
          {SIH_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                currentSlideIndex === idx
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-other-ai-prompt"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            title="Copy prompt for Gamma, Canva, or PPT generation AI"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Prompt Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy External AI PPT Prompt</span>
              </>
            )}
          </button>

          <button
            id="btn-view-prompt-modal"
            onClick={() => setShowPromptModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
          >
            View Prompt Text
          </button>

          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
              showSpeakerNotes
                ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            <span>Speaker Notes</span>
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[560px] flex flex-col justify-between">
        {/* Slide Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-blue-700 uppercase">
                FloodSense // SIH26071
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">Team Aqua Sentinel</span>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-medium ${
              currentSlide.implementedStatus === 'Implemented'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              Status: {currentSlide.implementedStatus}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {currentSlide.title}
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1 font-medium">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Visuals */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
          {/* SLIDE 1: Problem Flow Visual */}
          {currentSlide.diagramType === 'problem_flow' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <Satellite className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase">Convective Clouds</h4>
                  <p className="text-[11px] text-slate-600 mt-1">Intense cloud formation over Eastern Himalayas</p>
                </div>

                <div className="flex items-center justify-center text-slate-400 font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase">Rapid Precipitation</h4>
                  <p className="text-[11px] text-slate-600 mt-1">Exceeds 241.6 mm/day in vulnerable basins</p>
                </div>

                <div className="flex items-center justify-center text-slate-400 font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-2">
                    <Waves className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-red-900 uppercase">Severe Inundation</h4>
                  <p className="text-[11px] text-red-700 mt-1">Breached dykes, submerged highways, marooned chars</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Solution Split */}
          {currentSlide.diagramType === 'solution_split' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Satellite className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Sentinel-5P CLOUD</h4>
                <p className="text-xs text-slate-600">Atmospheric microphysics, cloud fraction, optical thickness</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold">
                  + FUSION +
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-slate-900 font-mono">Gated Delta Model</span>
                <span className="text-[10px] text-slate-500">Recurrent State Delta Updates</span>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <CloudRain className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">GPM IMERG 2024</h4>
                <p className="text-xs text-slate-600">Daily ground rainfall truth across 718 spatial grid cells</p>
              </div>
            </div>
          )}

          {/* SLIDE 3: Data Funnel & Big Numbers */}
          {currentSlide.diagramType === 'data_funnel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-black text-slate-900 font-display">1,877,850</div>
                  <span className="text-xs text-slate-700 font-medium block mt-1">Raw Pixels Extracted</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sentinel-5P NetCDF</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-black text-blue-700 font-display">262,788</div>
                  <span className="text-xs text-slate-700 font-medium block mt-1">Rainfall Records</span>
                  <span className="text-[10px] text-slate-500 font-mono">Assam Master Dataset</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-black text-emerald-700 font-display">718</div>
                  <span className="text-xs text-slate-700 font-medium block mt-1">Spatial Grid Cells</span>
                  <span className="text-[10px] text-slate-500 font-mono">0.1° Resolution</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="text-3xl font-black text-amber-700 font-display">366</div>
                  <span className="text-xs text-slate-700 font-medium block mt-1">Annual Days</span>
                  <span className="text-[10px] text-slate-500 font-mono">Jan 1 - Dec 31, 2024</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Neural Gated Delta Architecture */}
          {currentSlide.diagramType === 'neural_gated_delta' && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3 font-mono text-xs">
                <span className="text-slate-800 font-bold">Input Sequence: [x_t1, x_t2, x_t3, x_t4, x_t5] ∈ ℝ¹¹</span>
                <span className="text-blue-700 font-bold">ML Dataset: 5,646 × 11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block mb-1">Update Gate</span>
                  <code className="text-blue-700 font-bold">Γ_u = σ(W_u·x_t + U_u·h_t-1 + b_u)</code>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block mb-1">Gated Delta Update</span>
                  <code className="text-indigo-700 font-bold">Δh_t = Γ_u ⊙ tanh(W_d·x_t + b_d)</code>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[11px] block mb-1">State Increment</span>
                  <code className="text-emerald-700 font-bold">h_t = h_t-1 + Δh_t</code>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Dashboard & Early Warning */}
          {currentSlide.diagramType === 'dashboard_warning' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 space-y-2">
                <div className="text-2xl font-black text-amber-700 font-display">&gt;64.5 mm</div>
                <h4 className="text-xs font-bold text-amber-900 uppercase">Heavy Rainfall Warning</h4>
                <p className="text-[11px] text-amber-800">Urban waterlogging and drainage alerts dispatched to municipal bodies</p>
              </div>

              <div className="bg-red-50 p-5 rounded-xl border border-red-200 space-y-2">
                <div className="text-2xl font-black text-red-600 font-display">&gt;115.5 mm</div>
                <h4 className="text-xs font-bold text-red-900 uppercase">Very Heavy Red Alert</h4>
                <p className="text-[11px] text-red-800">Riverine island (char) evacuations triggered with SDRF & NDRF</p>
              </div>

              <div className="bg-red-100 p-5 rounded-xl border border-red-300 space-y-2">
                <div className="text-2xl font-black text-red-900 font-display">&gt;204.4 mm</div>
                <h4 className="text-xs font-bold text-red-950 uppercase">Catastrophic Peak Alert</h4>
                <p className="text-[11px] text-red-900">Embankment breach alerts dispatched along Beki and Brahmaputra trunks</p>
              </div>
            </div>
          )}

          {/* SLIDE 6: Future Vision & Hydraulic Inundation */}
          {currentSlide.diagramType === 'future_hydraulics' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-xs font-mono text-slate-800 font-bold mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>TRANSPARENT SYSTEM HORIZON & INTEGRATION CHAIN</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-center text-xs">
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Multi-Sensor Inputs</span>
                    <strong className="text-slate-900">Satellite + Radar + AWS + NWP</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Hydraulic Solvers</span>
                    <strong className="text-blue-700">HEC-RAS 2D / LISFLOOD</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Flood Products</span>
                    <strong className="text-rose-600">Depth + Extent + Arrival Time</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Validation</span>
                    <strong className="text-emerald-700">Sentinel-1 C-band SAR</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Bullet Points */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentSlide.bullets.map((bullet, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Presenter Speaker Notes Drawer */}
        {showSpeakerNotes && (
          <div className="p-4 bg-amber-50/70 border-t border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-semibold block mb-0.5">
                Recommended Jury Defense Script:
              </strong>
              <p className="text-amber-950 leading-relaxed font-sans">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          </div>
        )}

        {/* Bottom Slide Navigation Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              currentSlideIndex === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <span className="text-xs font-mono text-slate-500">
            Navigate with Left / Right arrow keys
          </span>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(SIH_SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === SIH_SLIDES.length - 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              currentSlideIndex === SIH_SLIDES.length - 1
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700 shadow-2xs'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal: Full Exact External AI PPT Prompt */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <Copy className="w-4 h-4 text-blue-600" />
                Copyable Prompt for External Presentation AI
              </h3>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-500 hover:text-slate-900 text-xs px-2.5 py-1 rounded bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {EXTERNAL_AI_PPT_PROMPT}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Ready to paste into Gamma.app, Canva Magic Design, or ChatGPT PPT builder.
              </span>
              <button
                onClick={handleCopyPrompt}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
