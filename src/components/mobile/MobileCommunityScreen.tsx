import React, { useState } from 'react';
import { 
  Radio, 
  Mic, 
  Volume2, 
  AlertTriangle, 
  ShieldCheck, 
  Utensils, 
  Send, 
  Truck, 
  MapPin, 
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Driver, DriverMeshMessage, LanguageCode } from '../../types';
import { playBeepNotification, playTruckHorn } from '../../services/audioSimulator';
import confetti from 'canvas-confetti';

interface MobileCommunityScreenProps {
  driver: Driver;
  meshMessages: DriverMeshMessage[];
  currentLang: LanguageCode;
  onSendMessage: (message: string, category: any) => void;
}

export const MobileCommunityScreen: React.FC<MobileCommunityScreenProps> = ({
  driver,
  meshMessages,
  currentLang,
  onSendMessage,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('traffic_alert');
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const quickAlertPresets = [
    { label: '🚨 Police Checking @ KM 180', category: 'police_check' as const, text: 'RTO & Police checking active near Ulundurpet toll KM 180. Keep documents ready.' },
    { label: '🚧 Single Lane Road Work', category: 'road_hazard' as const, text: 'Bridge repair work on NH45 KM 172. Left lane blocked, expect 10 min slowdown.' },
    { label: '🍲 Sri Murugan Dhaba Good Food', category: 'dhaba_recommendation' as const, text: 'Sri Murugan Dhaba at KM 155 has hot fresh meals, clean washrooms and heavy truck parking.' },
    { label: '⚠️ Stalled Lorry on Shoulder', category: 'road_hazard' as const, text: 'Loaded 14-wheeler stationary on bridge approach shoulder near KM 162. Drive safely.' },
  ];

  const nearbyTruckers = [
    { name: 'K. Selvam', vehicle: 'TN-28-BQ-9012', model: 'Tata Signa 4825', distance: '1.8 KM ahead', speed: '58 km/h' },
    { name: 'R. Veerappan', vehicle: 'TN-45-AK-1104', model: 'BharatBenz 2823', distance: '3.4 KM behind', speed: '52 km/h' },
    { name: 'G. Natarajan', vehicle: 'TN-07-CF-6540', model: 'Eicher Pro 6028', distance: '6.1 KM ahead', speed: '62 km/h' },
  ];

  const handleSendQuickTag = (preset: typeof quickAlertPresets[0]) => {
    playBeepNotification();
    onSendMessage(preset.text, preset.category);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleCustomSend = () => {
    if (!inputMessage.trim()) return;
    playBeepNotification();
    onSendMessage(inputMessage, selectedTag as any);
    setInputMessage('');
  };

  const handlePlayVoiceMessage = (id: string, text: string) => {
    setPlayingMessageId(id);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      playBeepNotification();
      setTimeout(() => setPlayingMessageId(null), 2000);
    }
  };

  const handleSimulatePTT = () => {
    setIsRecording(true);
    playTruckHorn();
    setTimeout(() => {
      setIsRecording(false);
      onSendMessage('Voice broadcast from Murugan: Road is clear past Villupuram bypass, traffic moving smoothly.', 'traffic_alert');
      confetti({ particleCount: 30, spread: 45 });
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Corridor Walkie-Talkie Header */}
      <div className="p-4 rounded-3xl bg-[#0B1F3A] text-white shadow-lg space-y-3 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black shadow-md">
              <Radio className="w-5 h-5 text-[#0B1F3A]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] block">
                CORRIDOR WALKIE-TALKIE
              </span>
              <h2 className="text-base font-black text-white">NH45 Highway Mesh</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#138808] px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>28 DRIVERS LIVE</span>
          </div>
        </div>

        {/* Big Push-To-Talk Button */}
        <button
          onClick={handleSimulatePTT}
          className={`w-full py-4 px-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 cursor-pointer min-h-[56px] shadow-md ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse border-2 border-white'
              : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
          }`}
        >
          <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-[#FF9933]'}`} />
          <span>{isRecording ? 'RECORDING VOICE NOTE (BROADCASTING)...' : 'HOLD TO TALK / WALKIE-TALKIE'}</span>
        </button>
      </div>

      {/* Quick 1-Tap Hazard Alerts */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs text-[#0B1F3A] uppercase tracking-wider">
            1-Tap Highway Road Alerts
          </h3>
          <span className="text-[9px] font-bold text-slate-400">TAP TO BROADCAST</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickAlertPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuickTag(preset)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 text-left transition cursor-pointer flex flex-col justify-between min-h-[70px]"
            >
              <span className="font-black text-xs text-[#0B1F3A] leading-tight">{preset.label}</span>
              <span className="text-[9px] font-bold text-[#FF9933] uppercase mt-1">Broadcast to 28 Drivers</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Driver Feed on NH45 */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-black text-xs text-[#0B1F3A] uppercase tracking-wider">
          Nearby Truckers on NH45 (Within 10 KM)
        </h3>

        <div className="space-y-2">
          {nearbyTruckers.map((trucker, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black">
                  <Truck className="w-4 h-4 text-[#0B1F3A]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#0B1F3A]">{trucker.name}</span>
                    <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {trucker.vehicle}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{trucker.model} • {trucker.speed}</span>
                </div>
              </div>

              <span className="text-[10px] font-black text-[#138808] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                {trucker.distance}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mesh Message Feed */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-black text-xs text-[#0B1F3A] uppercase tracking-wider">
          Recent Highway Voice & Text Notes
        </h3>

        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {meshMessages.slice(0, 5).map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#0B1F3A]">{msg.senderName}</span>
                  <span className="text-[9px] font-mono text-slate-500">{msg.senderVehicleNumber}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold">{msg.timestamp}</span>
              </div>

              <p className="text-slate-700 font-medium">{msg.message}</p>

              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => handlePlayVoiceMessage(msg.id, msg.message)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    playingMessageId === msg.id
                      ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Volume2 className="w-3 h-3 text-[#FF9933]" />
                  <span>Listen Voice Note</span>
                </button>

                <span className="text-[9px] font-black uppercase text-slate-400">
                  {msg.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
