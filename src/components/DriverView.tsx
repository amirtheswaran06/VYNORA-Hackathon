import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Radio, 
  Fuel, 
  Wrench, 
  Coffee, 
  Sprout, 
  Compass, 
  MapPin, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  ShieldAlert,
  Bot,
  Zap,
  Check,
  ChevronRight,
  TrendingUp,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { 
  Driver, 
  RouteTrafficInfo, 
  RoadsideService, 
  SOSRequest, 
  FarmerCargoRequest, 
  DriverMeshMessage,
  EmergencyType,
  LanguageCode
} from '../types';
import { t } from '../services/i18n';
import { playSOSSiren, playTruckHorn, playBeepNotification, speakIVRText } from '../services/audioSimulator';
import confetti from 'canvas-confetti';

interface DriverViewProps {
  driver: Driver;
  trafficInfo: RouteTrafficInfo;
  services: RoadsideService[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  meshMessages: DriverMeshMessage[];
  currentLang: LanguageCode;
  onTriggerSOS: (emergencyType: EmergencyType, description: string) => void;
  onResolveSOS: (sosId: string) => void;
  onAcceptBypassRoute: () => void;
  onAcceptCargoLoad: (requestId: string) => void;
  onSendMeshMessage: (message: string, category: any) => void;
  onOpenIVRSim: () => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  driver,
  trafficInfo,
  services,
  sosRequests,
  farmerRequests,
  meshMessages,
  currentLang,
  onTriggerSOS,
  onResolveSOS,
  onAcceptBypassRoute,
  onAcceptCargoLoad,
  onSendMeshMessage,
  onOpenIVRSim,
}) => {
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType>('breakdown');
  const [emergencyDesc, setEmergencyDesc] = useState('Engine temperature rising and air brake pressure dropping.');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [newMessageText, setNewMessageText] = useState('');
  const [newMsgCategory, setNewMsgCategory] = useState<'traffic_alert' | 'road_hazard' | 'dhaba_recommendation' | 'general_chat'>('traffic_alert');
  
  // AI Highway Assistant state
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Vanakkam Murugan! I am your RouteLink Highway Co-pilot. Vikravandi Toll has 45m traffic delay. Recommend taking Gingee bypass to save 38 minutes.',
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const activeSOS = sosRequests.find(s => s.driverId === driver.id && s.status !== 'completed' && s.status !== 'cancelled');
  const matchedCargo = farmerRequests.find(c => c.status === 'matched' || c.status === 'pending');

  const filteredServices = services.filter(s => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'diesel') return s.type === 'diesel_bunk';
    if (serviceFilter === 'adblue') return s.type === 'adblue_seller' || s.name.includes('AdBlue');
    if (serviceFilter === 'repair') return s.type === 'repair_garage';
    if (serviceFilter === 'towing') return s.type === 'towing_service';
    if (serviceFilter === 'rest') return s.type === 'rest_area';
    return true;
  });

  const handleLaunchSOS = () => {
    playSOSSiren();
    onTriggerSOS(selectedEmergencyType, emergencyDesc);
    setShowSOSModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    onSendMeshMessage(newMessageText.trim(), newMsgCategory);
    setNewMessageText('');
    playBeepNotification();
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userPrompt = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userPrompt }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          language: currentLang,
          role: 'driver',
        })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      // Speak assistant voice reply
      speakIVRText(data.reply, currentLang === 'ta' ? 'ta' : currentLang === 'hi' ? 'hi' : 'en');
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', text: 'Stay alert. Safe driving on NH45.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Driver Interface Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-[#FF9933]">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">{driver.name}</h2>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#138808]/15 text-[#138808] border border-[#138808]/30 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-mono font-bold text-[#0B1F3A] bg-slate-100 px-2 py-0.5 rounded">{driver.vehicleNumber}</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-slate-600">{driver.vehicleModel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center flex-1 sm:flex-initial">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Available Cargo</span>
              <span className="text-lg font-black text-[#138808]">{driver.availableCapacityTons} TONS</span>
            </div>
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center flex-1 sm:flex-initial">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Rating</span>
              <span className="text-lg font-black text-[#FF9933]">★ {driver.rating}</span>
            </div>
          </div>
        </div>

        {/* Quick Driver Meta Sub-Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FLEET:</span>
            <span className="font-bold text-[#0B1F3A]">{driver.fleetOwnerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">TELECOM:</span>
            <span className="font-mono text-slate-700">{driver.phone} ({driver.phoneType})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CORRIDOR:</span>
            <span className="font-bold text-slate-700">NH45 Southbound</span>
          </div>
        </div>
      </div>

      {/* EMERGENCY SOS HIGH-CONTRAST TRIGGER CARD */}
      {!activeSOS ? (
        <div className="bg-[#0B1F3A] rounded-3xl p-6 shadow-xl border-2 border-rose-500 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                  {t('sos_emergency', currentLang)}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-400/40">
                  24x7 RADAR
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                {t('sos_press_sub', currentLang)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSOSModal(true)}
            className="w-full sm:w-auto bg-[#FF9933] hover:opacity-90 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#FF9933]/25 uppercase tracking-widest transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            PRESS SOS NOW
          </button>
        </div>
      ) : (
        /* Active SOS Dispatch Progress Card */
        <div className="bg-[#0B1F3A] rounded-3xl p-6 shadow-2xl border-2 border-[#FF9933] text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600 text-white animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-[#FF9933] uppercase tracking-wider">
                    {t('sos_active_title', currentLang)}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-500/30 text-rose-300">
                    DISPATCH ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Incident #{activeSOS.id} • {activeSOS.location.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => onResolveSOS(activeSOS.id)}
              className="bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t('sos_status_completed', currentLang)}
            </button>
          </div>

          {/* Workflow status timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-[#138808]/60 text-emerald-300">
              <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Step 1: Broadcast</span>
              <span className="font-black">✓ 14 DRIVERS ALERTED</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-[#138808]/60 text-emerald-300">
              <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Step 2: Towing</span>
              <span className="font-black">✓ KAVERI CRANE UNIT</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-[#FF9933] text-[#FF9933]">
              <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Step 3: En Route</span>
              <span className="font-black">ETA: 11 MIN (4.2 KM)</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
              <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 mb-1">Step 4: Fleet Owner</span>
              <span className="font-bold">✓ SMS & PORTAL ALERT</span>
            </div>
          </div>

          {activeSOS.acceptedBy && (
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-black text-sm text-white">{activeSOS.acceptedBy.providerName}</span>
                <p className="text-slate-400 text-xs mt-0.5">{activeSOS.acceptedBy.serviceType} • Vehicle: {activeSOS.acceptedBy.vehicleType}</p>
              </div>
              <a
                href={`tel:${activeSOS.acceptedBy.phone}`}
                className="flex items-center justify-center gap-2 bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition shadow"
              >
                <Phone className="w-4 h-4" />
                Call Driver
              </a>
            </div>
          )}
        </div>
      )}

      {/* Active Route & Real-Time Highway Traffic Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              {t('active_route', currentLang)}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-black text-xl sm:text-2xl text-[#0B1F3A] tracking-tight">
                {driver.currentRoute.origin} <span className="text-[#FF9933]">➔</span> {driver.currentRoute.destination}
              </span>
              <span className="text-xs font-black text-[#0B1F3A] bg-slate-100 px-2.5 py-1 rounded-lg">
                {driver.currentRoute.highway}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">ESTIMATED ARRIVAL</span>
            <span className="text-lg font-black text-[#0B1F3A]">{driver.currentRoute.eta}</span>
          </div>
        </div>

        {/* Highway Distance Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-bold">
            <span>Completed: {driver.currentRoute.completedKm} KM (Villupuram)</span>
            <span>Total: {driver.currentRoute.distanceKm} KM (Madurai)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0B1F3A] via-[#FF9933] to-[#138808] rounded-full transition-all duration-500" 
              style={{ width: `${(driver.currentRoute.completedKm / driver.currentRoute.distanceKm) * 100}%` }}
            />
          </div>
        </div>

        {/* Traffic Congestion Alert & Bypass Reroute Suggestion */}
        <div className="mt-5 p-4 rounded-2xl bg-orange-50 border border-[#FF9933]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#FF9933] text-white">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-[#0B1F3A]">
                  {trafficInfo.trafficAlert}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  +45M DELAY
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {trafficInfo.cause}
              </p>
            </div>
          </div>

          {trafficInfo.alternativeRoute && (
            <button
              onClick={() => {
                onAcceptBypassRoute();
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="w-full sm:w-auto bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              {t('apply_bypass', currentLang)}
            </button>
          )}
        </div>
      </div>

      {/* SMART EMPTY-LOAD / AGRICULTURAL HARVEST MATCH */}
      {matchedCargo && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#138808]/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#138808] text-white font-black shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-black text-base sm:text-lg text-[#0B1F3A]">
                    {t('smart_matching_title', currentLang)}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF9933] text-[#0B1F3A]">
                    {t('match_found', currentLang)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {t('smart_matching_sub', currentLang)}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">EXTRA TRIP REVENUE</span>
              <span className="text-2xl font-black text-[#138808]">₹{matchedCargo.estimatedCostRs}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Farmer / Origin Mandi</span>
              <span className="font-black text-sm text-[#0B1F3A]">{matchedCargo.farmerName}</span>
              <p className="text-slate-500 text-xs mt-0.5">{matchedCargo.pickupLocation.address}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Harvest & Payload</span>
              <span className="font-black text-sm text-[#0B1F3A]">{matchedCargo.produceName}</span>
              <p className="text-slate-500 text-xs mt-0.5">{matchedCargo.quantityTons} Tons (Uses spare capacity)</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Destination Mandi</span>
              <span className="font-black text-sm text-[#0B1F3A]">{matchedCargo.dropoffLocation.address}</span>
              <p className="text-slate-500 text-xs mt-0.5">En route to Trichy / Madurai</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600 font-medium">
              💡 <strong className="text-[#0B1F3A]">Mutual Benefit:</strong> Farmer saves {matchedCargo.savingsVsSoloTruckPercent}% vs hiring a solo mini-truck. You earn ₹{matchedCargo.estimatedCostRs} extra with zero route diversion.
            </p>
            {matchedCargo.status !== 'accepted' ? (
              <button
                onClick={() => {
                  onAcceptCargoLoad(matchedCargo.id);
                  confetti({ particleCount: 70, spread: 70 });
                }}
                className="w-full sm:w-auto bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {t('accept_cargo', currentLang)} (+₹{matchedCargo.estimatedCostRs})
              </button>
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-[#138808] bg-[#138808]/15 px-4 py-2.5 rounded-xl border border-[#138808]/30">
                ✓ Cargo Accepted & Added to Trip Manifest
              </span>
            )}
          </div>
        </div>
      )}

      {/* Local Driver Highway Mesh Network */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1F3A] text-[#FF9933]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#0B1F3A]">
                {t('local_driver_network', currentLang)}
              </h3>
              <p className="text-xs text-slate-500 font-medium">NH45 Corridor Mesh • 4 commercial drivers active within 30 KM</p>
            </div>
          </div>
          <button
            onClick={() => onOpenIVRSim()}
            className="text-xs text-[#0B1F3A] hover:bg-slate-100 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition cursor-pointer"
          >
            Simulate IVR Call
          </button>
        </div>

        {/* Message Broadcast Form */}
        <form onSubmit={handleSendMessage} className="mt-4 flex flex-col sm:flex-row gap-2">
          <select
            value={newMsgCategory}
            onChange={(e: any) => setNewMsgCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 font-bold focus:ring-2 focus:ring-[#0B1F3A] outline-none"
          >
            <option value="traffic_alert">⚠️ Traffic / Toll Alert</option>
            <option value="road_hazard">🚨 Road Hazard / Oil Spill</option>
            <option value="dhaba_recommendation">☕ Dhaba / Fuel Recommendation</option>
            <option value="general_chat">💬 Driver Corridor Chat</option>
          </select>
          <input
            type="text"
            placeholder="Share road update with drivers on NH45 (e.g. Speed cam, Toll lane, Oil spill)..."
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none font-medium focus:ring-2 focus:ring-[#0B1F3A]"
          />
          <button
            type="submit"
            className="bg-[#0B1F3A] hover:bg-[#1A365D] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5 text-[#FF9933]" />
            Broadcast
          </button>
        </form>

        {/* Recent Highway Mesh Feed */}
        <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {meshMessages.map((msg) => (
            <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#0B1F3A]">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">({msg.senderVehicleNumber})</span>
                  {msg.kmMarker && (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black">
                      {msg.kmMarker}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">• {msg.timestamp}</span>
                </div>
                <p className="text-slate-700 mt-1 font-medium">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Roadside Highway Services Directory */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-[#0B1F3A]">
              {t('roadside_services', currentLang)}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Verified Diesel bunks, DEF AdBlue pumps, 24/7 garages, and driver rest areas</p>
          </div>

          {/* Service Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: t('filter_all', currentLang) },
              { id: 'diesel', label: t('filter_diesel', currentLang) },
              { id: 'adblue', label: t('filter_adblue', currentLang) },
              { id: 'repair', label: t('filter_repair', currentLang) },
              { id: 'towing', label: t('filter_towing', currentLang) },
              { id: 'rest', label: t('filter_rest', currentLang) },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setServiceFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  serviceFilter === f.id
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredServices.map((srv) => (
            <div key={srv.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-black text-sm text-[#0B1F3A]">{srv.name}</span>
                  <span className="text-xs font-black text-[#0B1F3A] bg-[#FF9933]/20 text-[#0B1F3A] px-2.5 py-0.5 rounded-md border border-[#FF9933]/40 shrink-0">
                    {srv.distanceKm} KM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">{srv.location.address} • {srv.hours}</p>

                {srv.fuelPrices && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    <span className="bg-sky-50 text-sky-900 font-bold px-2 py-0.5 rounded border border-sky-200">
                      Diesel: ₹{srv.fuelPrices.dieselRsPerL}/L
                    </span>
                    <span className="bg-indigo-50 text-indigo-900 font-bold px-2 py-0.5 rounded border border-indigo-200">
                      DEF AdBlue: ₹{srv.fuelPrices.adblueRsPerL}/L
                    </span>
                  </div>
                )}

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {srv.amenities.slice(0, 3).map((am, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#138808] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {srv.isOpen ? t('open_now', currentLang) : 'Closed'}
                </span>
                <a
                  href={`tel:${srv.phone}`}
                  className="flex items-center gap-1.5 bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t('call_service', currentLang)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Highway Co-pilot / Voice Assistant Widget ("RouteLink Sahay") */}
      <div className="bg-[#0B1F3A] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-[#FF9933] text-[#0B1F3A]">
            <Bot className="w-5 h-5 text-[#0B1F3A]" />
          </div>
          <div>
            <h3 className="font-black text-base text-white">ROUTELINK SAHAY — AI HIGHWAY CO-PILOT</h3>
            <p className="text-xs text-slate-400 font-medium">Ask route advice, toll updates, AdBlue stock, or tractor mechanics in your language</p>
          </div>
        </div>

        <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {aiMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl text-xs ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white ml-8 border border-white/15'
                  : 'bg-white/5 text-slate-200 mr-8 border border-white/10'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9933] block mb-1">
                {msg.role === 'user' ? 'Murugan (Driver)' : 'RouteLink Co-Pilot'}
              </span>
              <p className="leading-relaxed font-medium">{msg.text}</p>
            </div>
          ))}
          {aiLoading && (
            <div className="p-3 rounded-2xl bg-white/5 text-xs text-slate-400 animate-pulse">
              RouteLink AI is checking corridor status...
            </div>
          )}
        </div>

        <form onSubmit={handleAskAI} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ask question (e.g. Is there good veg dhaba before Trichy?)..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 text-white text-xs rounded-xl px-4 py-3 outline-none font-medium focus:ring-2 focus:ring-[#FF9933]"
          />
          <button
            type="submit"
            disabled={aiLoading}
            className="bg-[#FF9933] hover:opacity-90 text-[#0B1F3A] font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </button>
        </form>
      </div>

      {/* SOS EMERGENCY CONFIRMATION MODAL */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-600 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-rose-100">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">CONFIRM HIGHWAY SOS</h3>
                <p className="text-xs text-slate-500 font-semibold">Vehicle: {driver.vehicleNumber} • NH45 KM 165</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">Select Emergency Type:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'breakdown', label: t('emergency_type_breakdown', currentLang) },
                    { id: 'accident', label: t('emergency_type_accident', currentLang) },
                    { id: 'medical', label: t('emergency_type_medical', currentLang) },
                    { id: 'security', label: t('emergency_type_security', currentLang) },
                  ].map(em => (
                    <button
                      key={em.id}
                      type="button"
                      onClick={() => setSelectedEmergencyType(em.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-black transition cursor-pointer ${
                        selectedEmergencyType === em.id
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {em.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">Emergency Details / Mechanical Issue:</label>
                <textarea
                  value={emergencyDesc}
                  onChange={(e) => setEmergencyDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                ⚠️ <strong className="font-black">Automated Multi-Party Dispatch:</strong> Confirming will alert 14 nearby registered drivers on NH45, dispatch the closest heavy crane recovery, and notify fleet owner via SMS.
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSOSModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchSOS}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                BROADCAST SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
