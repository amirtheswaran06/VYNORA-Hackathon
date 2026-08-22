import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Fuel, 
  ShieldAlert, 
  Navigation, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  TrendingDown, 
  Layers, 
  ArrowRight,
  Sun,
  Radio,
  Zap,
  DollarSign
} from 'lucide-react';
import { 
  Driver, 
  RouteTrafficInfo, 
  RoadsideService, 
  SOSRequest, 
  FarmerCargoRequest, 
  LanguageCode 
} from '../../types';
import { t } from '../../services/i18n';
import { playTruckHorn, playBeepNotification } from '../../services/audioSimulator';

interface MobileHomeScreenProps {
  driver: Driver;
  trafficInfo: RouteTrafficInfo;
  services: RoadsideService[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  currentLang: LanguageCode;
  highContrastMode: boolean;
  onToggleHighContrast: () => void;
  onTriggerSOS: () => void;
  onAcceptBypassRoute: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({
  driver,
  trafficInfo,
  services,
  sosRequests,
  farmerRequests,
  currentLang,
  highContrastMode,
  onToggleHighContrast,
  onTriggerSOS,
  onAcceptBypassRoute,
  onNavigateToTab,
}) => {
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [isReadingBriefing, setIsReadingBriefing] = useState(false);

  const activeSOS = sosRequests.find(s => s.status !== 'completed' && s.status !== 'cancelled');
  const hasCompatibleCargo = farmerRequests.some(c => c.status === 'pending' || c.status === 'matched');

  const filteredServices = services.filter(s => {
    if (selectedServiceType === 'all') return true;
    if (selectedServiceType === 'diesel') return s.type === 'diesel_bunk';
    if (selectedServiceType === 'adblue') return s.type === 'adblue_seller';
    if (selectedServiceType === 'repair') return s.type === 'repair_garage' || s.type === 'towing_service';
    if (selectedServiceType === 'rest') return s.type === 'rest_area';
    return true;
  });

  const handlePlayAudioBriefing = () => {
    setIsReadingBriefing(true);
    const audioText = `வணக்கம் ஓட்டுநர் ${driver.name}. உங்கள் வழி NH45 சென்னை முதல் மதுரை வரை. அடுத்து விழுப்புரம் சுங்கச்சாவடி உள்ளது. Gingee புறவழிச்சாலை வழியாக சென்றால் 38 நிமிடங்கள் மிச்சப்படுத்தலாம். வழியில் 2 விவசாய சரக்குகள் உள்ளன.`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(audioText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsReadingBriefing(false);
      utterance.onerror = () => setIsReadingBriefing(false);
      window.speechSynthesis.speak(utterance);
    } else {
      playBeepNotification();
      setTimeout(() => setIsReadingBriefing(false), 2000);
    }
  };

  return (
    <div className={`space-y-4 pb-24 font-sans ${highContrastMode ? 'text-black' : 'text-slate-800'}`}>
      {/* Driver Cockpit Header */}
      <div className={`p-4 rounded-3xl border transition shadow-sm ${
        highContrastMode 
          ? 'bg-white border-4 border-black' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] text-white font-black flex items-center justify-center border-2 border-[#FF9933]/40 shadow-sm shrink-0">
              <Truck className="w-6 h-6 text-[#FF9933]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#0B1F3A] leading-tight">{driver.name}</h2>
                <span className="text-[10px] font-mono font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {driver.vehicleNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {driver.vehicleModel} • {driver.availableCapacityTons}T Empty Space
              </p>
            </div>
          </div>

          {/* High Sunlight Contrast Mode Toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px] ${
              highContrastMode 
                ? 'bg-black text-yellow-300 border-black shadow-md' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle High-Contrast Outdoor Sunlight Mode"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>

        {/* Live Route Progress Card */}
        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">CURRENT CORRIDOR:</span>
            <span className="text-[#0B1F3A] font-bold">{driver.currentRoute.highway}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">ORIGIN</span>
              <span className="text-base font-black text-[#0B1F3A]">{driver.currentRoute.origin}</span>
            </div>
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[10px] font-mono font-black text-[#138808] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {driver.currentRoute.distanceKm - driver.currentRoute.completedKm} KM REMAINING
              </span>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-[#FF9933] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((driver.currentRoute.completedKm / driver.currentRoute.distanceKm) * 100)}%` }} 
                />
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">DESTINATION</span>
              <span className="text-base font-black text-[#0B1F3A]">{driver.currentRoute.destination}</span>
            </div>
          </div>

          {/* Next Milestone & ETA Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF9933] shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">ESTIMATED ARRIVAL</span>
                <span className="font-black text-[#0B1F3A]">{driver.currentRoute.eta}</span>
              </div>
            </div>

            <button
              onClick={handlePlayAudioBriefing}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer min-h-[44px] ${
                isReadingBriefing
                  ? 'bg-[#FF9933] text-[#0B1F3A] animate-pulse'
                  : 'bg-white hover:bg-slate-100 text-[#0B1F3A] border border-slate-200 shadow-2xs'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Voice Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Highway Telemetry Strip */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Speed</span>
          <span className="text-lg font-black text-[#0B1F3A] font-mono">54</span>
          <span className="text-[10px] text-slate-500 font-bold block">km/h</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Diesel</span>
          <span className="text-lg font-black text-[#138808] font-mono">68%</span>
          <span className="text-[10px] text-slate-500 font-bold block">210 L</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">DEF AdBlue</span>
          <span className="text-lg font-black text-indigo-700 font-mono">82%</span>
          <span className="text-[10px] text-slate-500 font-bold block">OK</span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Empty Space</span>
          <span className="text-lg font-black text-[#FF9933] font-mono">3.5T</span>
          <span className="text-[10px] text-[#138808] font-black block">MATCH!</span>
        </div>
      </div>

      {/* Traffic Alert & Bypass Recommendation Card */}
      {trafficInfo.trafficAlert && (
        <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FF9933] text-[#0B1F3A] shrink-0 font-black shadow-xs">
              <AlertTriangle className="w-5 h-5 text-[#0B1F3A]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-amber-950 uppercase tracking-tight">
                  Toll Gate Congestion Ahead (Villupuram)
                </h3>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                  +42 MIN DELAY
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 font-medium leading-relaxed">
                Heavy FASTag queue & road maintenance at KM 158. Recommended SH-09 Gingee Rural Bypass is open and flowing at 68 km/h.
              </p>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={onAcceptBypassRoute}
              className="flex-1 bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider py-3 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Navigation className="w-4 h-4 text-[#FF9933]" />
              <span>Take SH-09 Bypass (Save 38 Mins)</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty-Capacity Harvest Cargo Backhaul Alert */}
      {hasCompatibleCargo && (
        <div 
          onClick={() => onNavigateToTab('load_match')}
          className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-400 shadow-sm cursor-pointer hover:bg-emerald-100/60 transition space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#138808] text-white font-black">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#138808] block">
                  NEW HARVEST LOAD MATCH
                </span>
                <h4 className="font-black text-sm text-emerald-950">1.5T Tomatoes @ Ulundurpet Mandi</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#138808]">+₹2,400</span>
              <span className="text-[10px] text-slate-500 font-bold block">Direct Freight</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold pt-1 border-t border-emerald-200">
            <span>Pickup: 1.2 KM from NH45 exit</span>
            <span className="text-[#138808] font-black flex items-center gap-1">
              View & Accept Load <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* Nearby Highway Services Locator */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-[#0B1F3A] uppercase tracking-tight">
              Nearby Highway Amenities (NH45)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Diesel, DEF AdBlue, 24/7 Dhabas & Mobile Garages</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#138808] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            GPS ACTIVE
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'diesel', label: '⛽ Diesel' },
            { id: 'adblue', label: '💧 DEF AdBlue' },
            { id: 'repair', label: '🔧 Puncture / Repair' },
            { id: 'rest', label: '🍛 Food / Dhaba' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedServiceType(pill.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer min-h-[40px] ${
                selectedServiceType === pill.id
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-2.5 pt-1">
          {filteredServices.slice(0, 4).map((srv) => (
            <div
              key={srv.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-[#0B1F3A]">{srv.name}</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {srv.distanceKm} KM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {srv.location.address}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold">
                  <span>⭐ {srv.rating}</span>
                  <span>•</span>
                  <span className="text-[#138808]">{srv.hours}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${srv.phone}`}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition flex items-center justify-center min-h-[44px] min-w-[44px]"
                  title="Call Amenity Provider"
                >
                  <Phone className="w-4 h-4 text-[#138808]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
