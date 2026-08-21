import React from 'react';
import { 
  ShieldAlert, 
  Truck, 
  Building2, 
  Sprout, 
  Wrench, 
  Activity, 
  RefreshCw, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  Database,
  Radio
} from 'lucide-react';
import { 
  Driver, 
  Vehicle, 
  SOSRequest, 
  FarmerCargoRequest, 
  RoadsideService, 
  RouteTrafficInfo, 
  OfflineSyncItem,
  LanguageCode
} from '../types';

interface AdminDashboardProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  services: RoadsideService[];
  corridors: RouteTrafficInfo[];
  offlineQueue: OfflineSyncItem[];
  currentLang: LanguageCode;
  onSyncOfflineQueue: () => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  drivers,
  vehicles,
  sosRequests,
  farmerRequests,
  services,
  corridors,
  offlineQueue,
  currentLang,
  onSyncOfflineQueue,
  onResetData,
}) => {
  const activeSOSCount = sosRequests.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length;
  const totalMatchedCargo = farmerRequests.filter(c => c.status === 'matched' || c.status === 'accepted').length;
  const totalFarmerSavings = farmerRequests.reduce((acc, c) => acc + Math.round((c.estimatedCostRs * 0.45)), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Admin Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-indigo-400 font-black flex items-center justify-center border-2 border-indigo-500/40 shadow-md">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">Master Operations Center</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                SYSTEM ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Live highway telemetry, rural logistics matching, emergency SOS dispatch, and offline synchronization monitor
            </p>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-2xl font-black uppercase tracking-wider transition border border-slate-200 cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>

      {/* High-Level Platform KPIs with Bold Typography */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span>Lorries Online</span>
            <Truck className="w-4 h-4 text-[#0B1F3A]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-[#0B1F3A] mb-1">{vehicles.length}</div>
            <span className="text-[11px] text-[#138808] font-bold block uppercase tracking-wider">{drivers.length} Drivers Active</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span>SOS Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className={`text-3xl sm:text-4xl font-black mb-1 ${activeSOSCount > 0 ? 'text-rose-600' : 'text-[#0B1F3A]'}`}>
              {activeSOSCount}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">Avg Response: 11 Mins</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span>Empty-Load Matches</span>
            <Sprout className="w-4 h-4 text-[#138808]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-[#138808] mb-1">{totalMatchedCargo}</div>
            <span className="text-[11px] text-slate-500 font-semibold block">3.5 Tons Harvest Moved</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <span>Freight Saved</span>
            <DollarSign className="w-4 h-4 text-[#FF9933]" />
          </div>
          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-[#FF9933] mb-1">₹{totalFarmerSavings.toLocaleString()}</div>
            <span className="text-[11px] text-[#138808] font-bold block">Direct Rural Farmer Savings</span>
          </div>
        </div>
      </div>

      {/* Active Corridors Status */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-black text-base text-[#0B1F3A] pb-3 border-b border-slate-100 uppercase tracking-tight">
          Highway Corridors Live Congestion Monitor
        </h3>

        <div className="mt-4 space-y-3.5">
          {corridors.map((c) => (
            <div key={c.corridorId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-base text-[#0B1F3A]">{c.corridorName}</span>
                  <span className="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded font-mono font-black">
                    {c.highwayNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                    c.trafficAlert ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.trafficAlert ? 'Heavy Toll Congestion' : 'Smooth Flow'}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{c.trafficAlert || 'Clear transit flow throughout corridor'} • {c.cause}</p>
                {c.alternativeRoute && (
                  <p className="text-[#138808] font-bold">
                    ✓ Recommended Bypass: {c.alternativeRoute.name} (Saves {c.alternativeRoute.timeSavedMinutes} mins)
                  </p>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Total Distance</span>
                <span className="font-black text-slate-900 text-base">{c.distanceTotalKm} KM</span>
                <span className="text-[11px] text-slate-500 font-bold block">Avg Speed: {c.averageSpeedKmh} km/h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Sync Queue Inspector */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#0B1F3A]">OFFLINE-FIRST SYNCHRONIZATION ENGINE</h3>
              <p className="text-xs text-slate-500 font-medium">Queued transactions waiting for server sync during low/no-network rural zones</p>
            </div>
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={onSyncOfflineQueue}
              className="bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Force Replay Sync Queue ({offlineQueue.length})
            </button>
          )}
        </div>

        {offlineQueue.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-medium">
            <CheckCircle2 className="w-8 h-8 text-[#138808] mx-auto mb-2 opacity-80" />
            Offline synchronization queue is completely clear. All local state mutations are synchronized with cloud server.
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {offlineQueue.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-black text-amber-950 uppercase tracking-wider">{item.actionType.replace('_', ' ')}</span>
                  <span className="text-slate-500 ml-2 font-mono text-[11px] font-medium">(Queued at {item.queuedAt})</span>
                  <p className="text-slate-600 text-[11px] font-mono mt-1 truncate max-w-md">
                    {JSON.stringify(item.payload)}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-200 text-amber-900">
                  Pending Network Reconnect
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
