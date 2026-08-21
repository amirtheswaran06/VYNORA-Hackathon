import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Share2, 
  Volume2,
  Navigation,
  RefreshCw,
  X
} from 'lucide-react';
import { SOSRequest, Driver, EmergencyType, LanguageCode } from '../../types';
import { playSOSSiren, playBeepNotification } from '../../services/audioSimulator';
import confetti from 'canvas-confetti';

interface MobileSOSScreenProps {
  driver: Driver;
  sosRequests: SOSRequest[];
  currentLang: LanguageCode;
  onTriggerSOS: (type: EmergencyType, desc: string) => void;
  onResolveSOS: (sosId: string) => void;
}

export const MobileSOSScreen: React.FC<MobileSOSScreenProps> = ({
  driver,
  sosRequests,
  currentLang,
  onTriggerSOS,
  onResolveSOS,
}) => {
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType>('breakdown');
  const [customNotes, setCustomNotes] = useState('Air brake pipe leak & high coolant temperature');
  const [isCallingHotline, setIsCallingHotline] = useState<string | null>(null);

  const activeSOS = sosRequests.find(s => s.status !== 'completed' && s.status !== 'cancelled');

  const emergencyTypes = [
    { id: 'breakdown' as EmergencyType, label: 'Engine / Brake Fault', icon: Wrench, color: 'border-orange-400 bg-orange-50' },
    { id: 'accident' as EmergencyType, label: 'Collision / Accident', icon: AlertTriangle, color: 'border-rose-400 bg-rose-50' },
    { id: 'medical' as EmergencyType, label: 'Medical Emergency', icon: ShieldAlert, color: 'border-red-400 bg-red-50' },
    { id: 'security' as EmergencyType, label: 'Highway Theft / Hazard', icon: Radio, color: 'border-purple-400 bg-purple-50' },
  ];

  const handleBroadcastSOS = () => {
    playSOSSiren();
    onTriggerSOS(selectedEmergencyType, customNotes);
  };

  const handleSimulateHotline = (name: string, number: string) => {
    setIsCallingHotline(name);
    playBeepNotification();
    setTimeout(() => {
      setIsCallingHotline(null);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Top GPS Anchor Bar */}
      <div className="p-4 rounded-3xl bg-[#0B1F3A] text-white shadow-lg space-y-2 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9933]">
              LIVE HIGHWAY SOS RADAR
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-slate-200">
            GPS FIX: ±3.8m
          </span>
        </div>

        <div>
          <h2 className="text-base font-black text-white leading-tight">
            NH45 KM 165, Near Villupuram Bypass
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Vehicle: {driver.vehicleNumber} ({driver.vehicleModel})
          </p>
        </div>
      </div>

      {/* If Active SOS is in progress */}
      {activeSOS ? (
        <div className="p-4 rounded-3xl bg-rose-50 border-3 border-rose-500 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black animate-pulse shadow-md">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 block">
                  EMERGENCY RESCUE ACTIVE
                </span>
                <h3 className="text-base font-black text-rose-950">
                  Kaveri Recovery Crane Dispatched
                </h3>
              </div>
            </div>
          </div>

          {/* Rescue ETA & Details */}
          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-black text-slate-800">
                  ETA: 11 Minutes (4.2 KM Away)
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-[#138808]">
                EN ROUTE
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100 font-medium">
              <p><strong>Provider:</strong> Kaveri Heavy Highway Recovery & Towing</p>
              <p><strong>Equipment:</strong> Tata 2518 Heavy Hydraulic Crane</p>
              <p><strong>Assigned Captain:</strong> S. Ramalingam (+91 98422 11990)</p>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="tel:9842211990"
                className="flex-1 bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Towing Driver</span>
              </a>
            </div>
          </div>

          {/* Broadcast Status */}
          <div className="p-3 rounded-2xl bg-white/80 border border-rose-200 text-xs text-slate-700 font-medium space-y-1">
            <div className="flex items-center gap-2 text-[#138808] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>14 Nearby Truck Drivers alerted to clear lane</span>
            </div>
            <div className="flex items-center gap-2 text-[#138808] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fleet Owner notified with live GPS coordinates</span>
            </div>
          </div>

          {/* Resolve / Cancel Button */}
          <button
            onClick={() => onResolveSOS(activeSOS.id)}
            className="w-full bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#138808]" />
            <span>Mark Breakdown Resolved & Resume Trip</span>
          </button>
        </div>
      ) : (
        /* Emergency Trigger Form */
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-[#0B1F3A]">
              1. Select Emergency Nature
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tap the icon that matches your situation on the highway
            </p>
          </div>

          {/* 4 Large Touch Target Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {emergencyTypes.map((et) => {
              const isSelected = selectedEmergencyType === et.id;
              return (
                <button
                  key={et.id}
                  onClick={() => {
                    playBeepNotification();
                    setSelectedEmergencyType(et.id);
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center gap-2 min-h-[100px] justify-center ${
                    isSelected
                      ? 'border-[#FF9933] bg-orange-50 shadow-md ring-2 ring-[#FF9933]/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <et.icon className={`w-6 h-6 ${isSelected ? 'text-[#FF9933]' : 'text-slate-600'}`} />
                  <span className="font-black text-xs text-[#0B1F3A]">{et.label}</span>
                </button>
              );
            })}
          </div>

          {/* Notes input */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Brief Problem Description (or Voice Speak):
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-xs text-[#0B1F3A] outline-none"
            />
          </div>

          {/* Big High-Impact SOS Button */}
          <div className="pt-2">
            <button
              onClick={handleBroadcastSOS}
              className="w-full bg-[#FF9933] hover:bg-[#E68A2E] text-[#0B1F3A] font-black text-base uppercase tracking-wider py-4 rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-3 border-2 border-white/80 cursor-pointer min-h-[60px]"
            >
              <ShieldAlert className="w-6 h-6 text-[#0B1F3A]" />
              <span>DISPATCH EMERGENCY RESCUE</span>
            </button>
          </div>
        </div>
      )}

      {/* Emergency Hotlines Strip (NHAI 1033, Police 112, Ambulance 108) */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
          24/7 DIRECT NATIONAL HIGHWAY HOTLINES
        </span>

        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'NHAI Highway', number: '1033', label: '1033 Rescue' },
            { name: 'National Police', number: '112', label: '112 Police' },
            { name: 'Ambulance', number: '108', label: '108 Medical' },
          ].map((h) => (
            <button
              key={h.number}
              onClick={() => handleSimulateHotline(h.name, h.number)}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 text-center transition cursor-pointer shadow-2xs min-h-[52px] flex flex-col items-center justify-center"
            >
              <span className="text-xs font-black text-[#0B1F3A]">{h.label}</span>
              <span className="text-[9px] text-[#138808] font-bold">TOLL FREE</span>
            </button>
          ))}
        </div>

        {isCallingHotline && (
          <div className="p-2.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold text-center animate-pulse">
            Connecting to {isCallingHotline} Highway Dispatch...
          </div>
        )}
      </div>
    </div>
  );
};
