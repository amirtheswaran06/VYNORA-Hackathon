import React, { useState } from 'react';
import { 
  Wrench, 
  Truck, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Fuel, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { SOSRequest, RoadsideService, LanguageCode } from '../types';
import { t } from '../services/i18n';
import { playSOSSiren } from '../services/audioSimulator';
import confetti from 'canvas-confetti';

interface RoadsideProviderViewProps {
  sosRequests: SOSRequest[];
  services: RoadsideService[];
  currentLang: LanguageCode;
  onUpdateSOSStatus: (sosId: string, status: any, providerDetails?: any) => void;
}

export const RoadsideProviderView: React.FC<RoadsideProviderViewProps> = ({
  sosRequests,
  services,
  currentLang,
  onUpdateSOSStatus,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const myService = services.find(s => s.id === 'srv-02') || services[0];

  const pendingIncidents = sosRequests.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
  const pastIncidents = sosRequests.filter(s => s.status === 'completed');

  const handleAcceptSOS = (sos: SOSRequest) => {
    onUpdateSOSStatus(sos.id, 'accepted', {
      providerId: myService.id,
      providerName: myService.name,
      phone: myService.phone,
      serviceType: 'Heavy Hydraulic Towing & Mobile Garage',
      vehicleType: 'Tata 2518 Heavy Crane Unit',
      distanceKm: 4.2,
      etaMinutes: 11,
    });
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleAdvanceStatus = (sos: SOSRequest) => {
    if (sos.status === 'accepted') {
      onUpdateSOSStatus(sos.id, 'en_route');
    } else if (sos.status === 'en_route') {
      onUpdateSOSStatus(sos.id, 'completed');
      confetti({ particleCount: 80, spread: 80 });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Provider Console Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-white font-black flex items-center justify-center border-2 border-sky-500/40 shadow-md">
            <Wrench className="w-7 h-7 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">Kaveri Heavy Highway Recovery</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-sky-100 text-sky-900 border border-sky-300">
                AUTHORIZED TOWING
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Unit: Tata 2518 Crane • NH45 Corridor (KM 140 - KM 220) • {myService.phone}
            </p>
          </div>
        </div>

        {/* 24/7 Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Radar Status:</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              isAvailable
                ? 'bg-[#138808] text-white shadow-md'
                : 'bg-rose-700 text-white'
            }`}
          >
            {isAvailable ? '● ON CALL (ACTIVE)' : 'OFF DUTY'}
          </button>
        </div>
      </div>

      {/* Live SOS Emergency Radar Alert Feed */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#0B1F3A]">LIVE SOS EMERGENCY RADAR</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time breakdown & accident dispatches within your response zone</p>
            </div>
          </div>

          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${
            pendingIncidents.length > 0 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-600'
          }`}>
            {pendingIncidents.length} ACTIVE INCIDENTS
          </span>
        </div>

        {pendingIncidents.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-medium">
            <CheckCircle2 className="w-10 h-10 text-[#138808] mx-auto mb-2 opacity-80" />
            No active breakdown SOS alerts on your NH45 sector. All commercial vehicles in transit are moving safely.
          </div>
        ) : (
          <div className="mt-4 space-y-3.5">
            {pendingIncidents.map((sos) => (
              <div
                key={sos.id}
                className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-lg text-rose-950">{sos.vehicleNumber}</span>
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-rose-600 text-white">
                      {sos.emergencyType}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      (Reported: {sos.timestamp})
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {sos.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-[#0B1F3A]">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      {sos.location.address}
                    </span>
                    <span>Driver: <strong className="text-[#0B1F3A] font-black">{sos.driverName}</strong> ({sos.driverPhone})</span>
                    <span className="text-rose-800 font-black uppercase tracking-wider bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
                      4.2 KM (ETA ~11 MINS)
                    </span>
                  </div>
                </div>

                {/* Dispatch Controls with Bold Typography */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto">
                  <a
                    href={`tel:${sos.driverPhone}`}
                    className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Driver
                  </a>

                  {sos.status === 'requested' || sos.status === 'notified' ? (
                    <button
                      onClick={() => handleAcceptSOS(sos)}
                      className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Accept & Dispatch Crane
                    </button>
                  ) : sos.status === 'accepted' ? (
                    <button
                      onClick={() => handleAdvanceStatus(sos)}
                      className="w-full sm:w-auto bg-[#FF9933] hover:opacity-90 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Mark Unit En Route
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdvanceStatus(sos)}
                      className="w-full sm:w-auto bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved / Repaired
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Station Inventory & Rates */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-black text-base text-[#0B1F3A] pb-3 border-b border-slate-100 uppercase tracking-tight">
          Highway Service Unit Inventory & Standard Rates
        </h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Heavy Crane Towing</span>
            <div className="text-xl font-black text-[#0B1F3A] mb-1">₹2,800 + ₹45/KM</div>
            <p className="text-slate-500 font-medium">Equipped with 20-ton hydraulic winch & tow-bar</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Air Brake System Repair</span>
            <div className="text-xl font-black text-[#0B1F3A] mb-1">₹650 FLAT FEE</div>
            <p className="text-slate-500 font-medium">High-pressure air hose & valve replacements in stock</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Radial Tire Vulcanizing</span>
            <div className="text-xl font-black text-[#0B1F3A] mb-1">₹350 / PUNCTURE</div>
            <p className="text-slate-500 font-medium">295/90 R20 & 10.00 R20 tubeless patch kits available</p>
          </div>
        </div>
      </div>
    </div>
  );
};
