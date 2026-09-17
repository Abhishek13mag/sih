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
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Disaster Mitigation & Early Warning Dispatch Console
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 font-bold uppercase">
                ASDMA / DEOC Level
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automated Standard Operating Procedure (SOP) dispatch triggers for District Emergency Operation Centers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            CAP-CP Alert Protocol Ready
          </span>
        </div>
      </div>

      {/* Main Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Alerts List on Left */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span>High Risk Inundation Basins</span>
            <span className="font-mono text-blue-700">{broadcasts.length} Active Directives</span>
          </div>

          {broadcasts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setActiveBroadcastId(alert.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                activeBroadcastId === alert.id
                  ? 'bg-red-50/50 border-red-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-900 font-display">{alert.district}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  alert.severity === 'catastrophic'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-orange-100 text-orange-800 border border-orange-300'
                }`}>
                  {alert.severity}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-mono">
                <span>Forecast: <strong className="text-slate-900">{alert.rainfallForecast} mm/day</strong></span>
                <span className="text-red-700 font-semibold">{alert.thresholdExceeded}</span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-100 pt-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Issued: {alert.issuedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Alert Details on Right */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-700 font-semibold">{activeAlert.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{activeAlert.thresholdExceeded}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5 font-display">
                {activeAlert.district} District Flood Directive
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-medium uppercase">Est. Exposed Population</span>
              <span className="text-xl font-extrabold text-red-600 font-mono">
                {activeAlert.affectedPopulationEstimate.toLocaleString()} Residents
              </span>
            </div>
          </div>

          {/* Vulnerable Zones */}
          <div>
            <span className="text-xs font-bold text-slate-800 block mb-2">
              Critical Lowland Chars & Embankment Zones:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeAlert.inundationRiskZones.map((zone, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5"
                >
                  <Waves className="w-3 h-3 text-blue-600" />
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable SOP Protocol Items */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Standard Operating Procedures (SOP) Action Matrix:
            </span>
            <div className="space-y-2">
              {activeAlert.recommendedActions.map((action, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-lingual Public SMS / Siren Broadcast Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-blue-700" />
                Public Broadcast Preview (SMS & Siren Push)
              </span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {(['EN', 'AS', 'BN', 'HI'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200 italic">
              "{getLanguageAdvisory()}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Connected to National Emergency Communication Network (NECN)
              </span>

              <button
                onClick={handleSimulateDispatch}
                disabled={isDispatching}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
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
                    <span>Trigger Telemetry Emergency Push</span>
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
