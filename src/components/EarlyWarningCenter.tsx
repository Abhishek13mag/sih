import React, { useState } from 'react';
import { LIVE_EARLY_WARNINGS } from '../data/assamDataset';
import { EarlyWarningBroadcast } from '../types/floodSense';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Users, 
  Waves, 
  Clock, 
  Megaphone,
  Radio,
  FileCheck
} from 'lucide-react';

export const EarlyWarningCenter: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<EarlyWarningBroadcast[]>(LIVE_EARLY_WARNINGS);
  const [activeBroadcastId, setActiveBroadcastId] = useState<string>(LIVE_EARLY_WARNINGS[0].id);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'AS' | 'BN' | 'HI'>('EN');

  const activeAlert = broadcasts.find(b => b.id === activeBroadcastId) || broadcasts[0];

  const handleSimulateDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 4000);
    }, 1200);
  };

  const getLanguageAdvisory = () => {
    if (selectedLanguage === 'AS') {
      return `সতৰ্কবাৰ্তা: ${activeAlert.district} জিলাত কৃত্ৰিম বুদ্ধিমত্তা মডেলে ২৪ ঘণ্টাত ${activeAlert.rainfallForecast} মিমি প্ৰচণ্ড বৰষুণৰ পূৰ্বানুমান কৰিছে। ব্ৰহ্মপুত্ৰ আৰু উপনৈৰ চাপৰি এলেকাৰ বাসিন্দাসকলক তাৎক্ষণিকভাৱে সুৰক্ষিত আশ্ৰয়স্থললৈ যাবলৈ আহ্বান জনোৱা হ'ল।`;
    }
    if (selectedLanguage === 'BN') {
      return `জরুরি সতর্কতা: ${activeAlert.district} জেলায় আগামী ২৪ ঘণ্টায় ${activeAlert.rainfallForecast} মিমি অতি ভারী বৃষ্টির পূর্বাভাস। নদী তীরবর্তী ও চরাঞ্চলের মানুষকে অবিলম্বে নিরাপদ আশ্রয়কেন্দ্রে যাওয়ার নির্দেশ দেওয়া হচ্ছে।`;
    }
    if (selectedLanguage === 'HI') {
      return `आपदा चेतावनी: असम राज्य आपदा प्रबंधन प्राधिकरण (ASDMA) ने ${activeAlert.district} जिले में ${activeAlert.rainfallForecast} मिमी भारी बारिश का रेड अलर्ट जारी किया है। नदी तटीय व निचले इलाकों से तत्काल सुरक्षित स्थानों पर पहुंचें।`;
    }
    return `EMERGENCY TELEMETRY ADVISORY: FloodSense AI has predicted an extreme rainfall event of ${activeAlert.rainfallForecast} mm/day over ${activeAlert.district}. Severe waterlogging and riverbank inundation imminent in low-lying char habitations. NDRF and SDRF rescue assets placed on standby.`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-600 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Disaster Management & Early Warning Dispatch Console
            </h2>
            <p className="text-xs text-slate-400">
              Automated Standard Operating Procedure (SOP) triggers for ASDMA, NDRF, and District Commissioners
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CAP-CP Alert Protocol Ready
          </span>
        </div>
      </div>

      {/* Main Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alerts List on Left */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Active Rainfall Alert Zones</span>
            <span className="font-mono text-cyan-400">{broadcasts.length} Active</span>
          </div>

          {broadcasts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setActiveBroadcastId(alert.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeBroadcastId === alert.id
                  ? 'bg-slate-900 border-rose-500 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-white font-display">{alert.district}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  alert.severity === 'catastrophic'
                    ? 'bg-pink-950 text-pink-300 border border-pink-700'
                    : 'bg-red-950 text-red-300 border border-red-700'
                }`}>
                  {alert.severity}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>Forecast: <strong className="text-white">{alert.rainfallForecast} mm/day</strong></span>
                <span className="text-rose-400 font-semibold">{alert.thresholdExceeded}</span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/80 pt-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Issued: {alert.issuedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Alert Details & Mitigation Actions on Right */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">{activeAlert.id}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{activeAlert.thresholdExceeded}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5 font-display">
                {activeAlert.district} Flood Emergency Directive
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Population at Risk</span>
              <span className="text-lg font-black text-rose-400 font-mono">
                {activeAlert.affectedPopulationEstimate.toLocaleString()} People
              </span>
            </div>
          </div>

          {/* Vulnerable Zones Tag Grid */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              High Inundation Risk Lowlands & Chars:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeAlert.inundationRiskZones.map((zone, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
                >
                  <Waves className="w-3 h-3 text-cyan-400" />
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable SOP Protocol Items */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Automated SOP Emergency Directives:
            </span>
            <div className="space-y-2">
              {activeAlert.recommendedActions.map((action, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/60 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-lingual Public SMS / Siren Broadcast Preview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                Public Disaster Warning Broadcast Broadcast (SMS / Siren)
              </span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {(['EN', 'AS', 'BN', 'HI'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/70 p-3 rounded-lg border border-slate-800/80 italic">
              "{getLanguageAdvisory()}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500">
                Connected to National Emergency Communication Network (NECN)
              </span>

              <button
                onClick={handleSimulateDispatch}
                disabled={isDispatching}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Broadcasting CAP Alert...</span>
                  </>
                ) : dispatchedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Dispatched to ASDMA & DEOC</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Trigger Emergency Telemetry Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
