import React, { useState } from 'react';
import { 
  Sprout, 
  CheckCircle2, 
  X, 
  MapPin, 
  Phone, 
  DollarSign, 
  Weight, 
  Clock, 
  Volume2, 
  TrendingUp, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { Driver, FarmerCargoRequest, LanguageCode } from '../../types';
import { playBeepNotification } from '../../services/audioSimulator';
import confetti from 'canvas-confetti';

interface MobileLoadMatchScreenProps {
  driver: Driver;
  farmerRequests: FarmerCargoRequest[];
  currentLang: LanguageCode;
  onAcceptLoad: (cargoId: string) => void;
}

export const MobileLoadMatchScreen: React.FC<MobileLoadMatchScreenProps> = ({
  driver,
  farmerRequests,
  currentLang,
  onAcceptLoad,
}) => {
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const availableLoads = farmerRequests.filter(
    req => !declinedIds.includes(req.id)
  );

  const handleDecline = (id: string) => {
    setDeclinedIds(prev => [...prev, id]);
    playBeepNotification();
  };

  const handleAccept = (id: string) => {
    confetti({ particleCount: 60, spread: 70 });
    onAcceptLoad(id);
  };

  const handlePlayFarmerAudio = (id: string, name: string, produce: string) => {
    setPlayingVoiceId(id);
    const audioText = `வணக்கம் ஐயா, நான் ${name}. என்னிடம் ${produce} உள்ளது. திருச்சி மார்க்கெட்டுக்கு கொண்டு செல்ல வேண்டும். சுங்கச்சாவடி அருகே உள்ளேன்.`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(audioText);
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingVoiceId(null);
      utterance.onerror = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      playBeepNotification();
      setTimeout(() => setPlayingVoiceId(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Available Capacity Gauge Card */}
      <div className="p-4 rounded-3xl bg-[#0B1F3A] text-white shadow-lg space-y-3 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9933]">
              EMPTY-LOAD BACKHAUL ENGINE
            </span>
            <h2 className="text-base font-black text-white">
              {driver.availableCapacityTons} Tons Available Capacity
            </h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#138808] text-white flex items-center justify-center font-black shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Capacity bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-300">
            <span>Used: {(driver.maxCapacityTons - driver.availableCapacityTons).toFixed(1)}T / {driver.maxCapacityTons}T</span>
            <span className="text-[#FF9933] font-black">Monetize Unused Space</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#138808] h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.round(((driver.maxCapacityTons - driver.availableCapacityTons) / driver.maxCapacityTons) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Matching Cargo List along Route */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-sm text-[#0B1F3A] uppercase tracking-tight">
            Matching Loads Along NH45 Corridor ({availableLoads.length})
          </h3>
          <span className="text-[10px] font-black text-[#138808] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ZERO DETOUR
          </span>
        </div>

        {availableLoads.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#138808] mx-auto" />
            <h4 className="font-black text-sm text-[#0B1F3A]">All Active Cargo Accepted!</h4>
            <p className="text-xs text-slate-500">Your truck is optimized for maximum backhaul earnings.</p>
          </div>
        ) : (
          availableLoads.map((load) => {
            const isAccepted = load.status === 'accepted';
            return (
              <div
                key={load.id}
                className={`p-4 rounded-3xl border transition shadow-sm space-y-3.5 ${
                  isAccepted
                    ? 'bg-emerald-50/80 border-2 border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Farmer & Crop info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#FF9933] flex items-center justify-center font-black text-xl shrink-0">
                      🍅
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-[#0B1F3A]">{load.produceName}</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-[#138808]">
                          {load.quantityTons} TONS
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Farmer: {load.farmerName} ({load.farmerPhone})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#138808]">
                      +₹{load.estimatedCostRs.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      DIRECT CASH
                    </span>
                  </div>
                </div>

                {/* Pickup & Drop Details */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
                      <span>Pickup: {load.pickupLocation.address}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">1.2 KM from NH45</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <ArrowRight className="w-3.5 h-3.5 text-[#138808]" />
                      <span>Drop: {load.dropoffLocation.address}</span>
                    </div>
                    <span className="text-[10px] text-[#138808] font-black">Direct Mandi Gate</span>
                  </div>
                </div>

                {/* Audio voice note from farmer */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePlayFarmerAudio(load.id, load.farmerName, load.produceName)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      playingVoiceId === load.id
                        ? 'bg-[#FF9933] text-[#0B1F3A] animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#FF9933]" />
                    <span>Farmer Voice Note (Tamil)</span>
                  </button>

                  <a
                    href={`tel:${load.farmerPhone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Call Farmer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#138808]" />
                  </a>
                </div>

                {/* Actions: Accept or Decline (min 48px tap targets) */}
                {!isAccepted ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleDecline(load.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleAccept(load.id)}
                      className="bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Load (+₹{load.estimatedCostRs})</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#138808]/15 border border-[#138808]/30 flex items-center justify-between text-xs font-black text-[#138808]">
                    <span>✓ LOAD ACCEPTED & ADDED TO MANIFEST</span>
                    <span>Arrive by 14:00</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
