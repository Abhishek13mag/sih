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
    <div className="space-y-6">
      {/* Top Deck Control Toolbar */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 border border-amber-700/60 text-amber-300 font-bold">
            SLIDE {currentSlideIndex + 1} OF {SIH_SLIDES.length}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Smart India Hackathon 2026 Pictorial Presentation
          </span>
        </div>

        {/* Slide Selector Dots */}
        <div className="flex items-center gap-1.5">
          {SIH_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-mono transition-all ${
                currentSlideIndex === idx
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Buttons: Copy Prompt for other AI & Toggle Notes */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-other-ai-prompt"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            title="Copy prompt for Gamma, Canva, or PPT generation AI"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
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
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs"
          >
            View Prompt Text
          </button>

          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              showSpeakerNotes
                ? 'bg-purple-950 border-purple-700 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            <span>Jury Notes</span>
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative min-h-[580px] flex flex-col justify-between">
        {/* Slide Header */}
        <div className="p-6 md:p-8 border-b border-slate-900 bg-gradient-to-b from-slate-900/60 to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                FloodSense // SIH26071
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">Team Aqua Sentinel</span>
            </div>

            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
              currentSlide.implementedStatus === 'Implemented'
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                : 'bg-amber-950/80 border-amber-700 text-amber-300'
            }`}>
              Status: {currentSlide.implementedStatus}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
            {currentSlide.title}
          </h2>
          <p className="text-sm md:text-base text-slate-300 mt-1 font-medium">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body: Infographic Diagrams & Visuals */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
          {/* SLIDE 1: Problem Flow Visual */}
          {currentSlide.diagramType === 'problem_flow' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-2">
                    <Satellite className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-white uppercase">Heavy Rainfall</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Convective cloud formation over Himalayas</p>
                </div>

                <div className="flex items-center justify-center text-slate-600 font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mb-2">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-white uppercase">Rapid Accumulation</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Surpasses 241.6 mm/day in vulnerable zones</p>
                </div>

                <div className="flex items-center justify-center text-slate-600 font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-red-900/60 bg-red-950/20">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-red-950 text-red-400 flex items-center justify-center mb-2">
                    <Waves className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-red-300 uppercase">Urban & River Flooding</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Submerged roads, breached dykes, cut-off hospitals</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Solution Split */}
          {currentSlide.diagramType === 'solution_split' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="bg-slate-900/90 p-5 rounded-xl border border-cyan-800/80 space-y-2 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-2">
                  <Satellite className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-cyan-300">Sentinel-5P CLOUD</h4>
                <p className="text-xs text-slate-400">Atmospheric microphysics, cloud fraction, optical thickness</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div className="px-3 py-1 rounded-full bg-purple-950 border border-purple-600 text-purple-300 text-xs font-mono font-bold">
                  + FUSION +
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-950/80">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-white font-mono">Gated Delta Model</span>
                <span className="text-[10px] text-slate-400">Sequential State Delta Updates</span>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-xl border border-blue-800/80 space-y-2 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mb-2">
                  <CloudRain className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-blue-300">GPM IMERG 2024</h4>
                <p className="text-xs text-slate-400">Ground precipitation measurements across 718 Assam cells</p>
              </div>
            </div>
          )}

          {/* SLIDE 3: Data Funnel & Big Numbers */}
          {currentSlide.diagramType === 'data_funnel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-3xl font-black text-cyan-400 font-display">1,877,850</div>
                  <span className="text-xs text-slate-300 font-medium block mt-1">Raw Pixels Extracted</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sentinel-5P NetCDF</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-3xl font-black text-blue-400 font-display">262,788</div>
                  <span className="text-xs text-slate-300 font-medium block mt-1">Rainfall Records</span>
                  <span className="text-[10px] text-slate-500 font-mono">Assam Master Dataset</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-3xl font-black text-emerald-400 font-display">718</div>
                  <span className="text-xs text-slate-300 font-medium block mt-1">Spatial Grid Cells</span>
                  <span className="text-[10px] text-slate-500 font-mono">0.1° Resolution</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-3xl font-black text-amber-400 font-display">366</div>
                  <span className="text-xs text-slate-300 font-medium block mt-1">Annual Days</span>
                  <span className="text-[10px] text-slate-500 font-mono">Jan 1 - Dec 31, 2024</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Neural Gated Delta Architecture */}
          {currentSlide.diagramType === 'neural_gated_delta' && (
            <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono text-xs">
                <span className="text-cyan-400 font-bold">Input Sequence: [x_t1, x_t2, x_t3, x_t4, x_t5] ∈ ℝ¹¹</span>
                <span className="text-purple-300 font-bold">ML Dataset: 5,646 × 11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block mb-1">Update Gate</span>
                  <code className="text-cyan-300">Γ_u = σ(W_u·x_t + U_u·h_t-1 + b_u)</code>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block mb-1">Gated Delta Update</span>
                  <code className="text-purple-300">Δh_t = Γ_u ⊙ tanh(W_d·x_t + b_d)</code>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block mb-1">State Increment</span>
                  <code className="text-pink-300">h_t = h_t-1 + Δh_t</code>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Dashboard & Early Warning */}
          {currentSlide.diagramType === 'dashboard_warning' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
                <div className="text-2xl font-black text-yellow-400 font-display">&gt;64.5 mm</div>
                <h4 className="text-xs font-bold text-white uppercase">Heavy Rainfall Advisory</h4>
                <p className="text-[11px] text-slate-400">Urban waterlogging and drainage alerts dispatched to GMDA</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-red-900/60 bg-red-950/20 space-y-2">
                <div className="text-2xl font-black text-red-400 font-display">&gt;115.5 mm</div>
                <h4 className="text-xs font-bold text-red-300 uppercase">Very Heavy Red Alert</h4>
                <p className="text-[11px] text-slate-400">Riverine island (char) evacuations triggered with SDRF & NDRF</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-pink-900/60 bg-pink-950/20 space-y-2">
                <div className="text-2xl font-black text-pink-400 font-display">&gt;204.4 mm</div>
                <h4 className="text-xs font-bold text-pink-300 uppercase">Catastrophic Peak Alert</h4>
                <p className="text-[11px] text-slate-400">Critical embankment breach warning along Beki and Brahmaputra</p>
              </div>
            </div>
          )}

          {/* SLIDE 6: Future Vision & Hydraulic Inundation */}
          {currentSlide.diagramType === 'future_hydraulics' && (
            <div className="space-y-4">
              <div className="bg-slate-900/90 p-5 rounded-xl border border-cyan-800/60">
                <div className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>TRANSPARENT FUTURE EXTENSION ARCHITECTURE</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-center text-xs">
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Multi-Source Fusion</span>
                    <strong className="text-white">Satellite + Radar + AWS + NWP</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:inline" />
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Hydraulic Solvers</span>
                    <strong className="text-cyan-300">HEC-RAS 2D / LISFLOOD-FP</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:inline" />
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Flood Products</span>
                    <strong className="text-pink-300">Extent + Depth + Arrival Time</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:inline" />
                  <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Validation</span>
                    <strong className="text-emerald-300">Sentinel-1 C-band SAR</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Bullet Points for this slide */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentSlide.bullets.map((bullet, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Presenter Speaker Notes Drawer */}
        {showSpeakerNotes && (
          <div className="p-4 bg-purple-950/40 border-t border-purple-800/60 text-xs text-purple-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-300 font-semibold block mb-0.5">
                Recommended Speaking Script for SIH Judges:
              </strong>
              <p className="text-slate-300 leading-relaxed">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          </div>
        )}

        {/* Bottom Slide Navigation Controls */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentSlideIndex === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <span className="text-xs font-mono text-slate-500">
            Use Left / Right arrow keys or spacebar
          </span>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(SIH_SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === SIH_SLIDES.length - 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              currentSlideIndex === SIH_SLIDES.length - 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-900/40'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal: Full Exact External AI PPT Prompt */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-cyan-400" />
                Copyable Prompt for External Presentation AI
              </h3>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {EXTERNAL_AI_PPT_PROMPT}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Ready to paste into Gamma.app, Canva Magic, or ChatGPT PPT builder.
              </span>
              <button
                onClick={handleCopyPrompt}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
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
