import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  MapPin, 
  Fuel, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Plus, 
  Activity, 
  ShieldAlert,
  Search,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { Vehicle, SOSRequest, FarmerCargoRequest, LanguageCode } from '../types';
import { t } from '../services/i18n';

interface FleetOwnerViewProps {
  vehicles: Vehicle[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  currentLang: LanguageCode;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAddNewVehicle: (vehicle: Partial<Vehicle>) => void;
}

export const FleetOwnerView: React.FC<FleetOwnerViewProps> = ({
  vehicles,
  sosRequests,
  farmerRequests,
  currentLang,
  onSelectVehicle,
  onAddNewVehicle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehNum, setNewVehNum] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [selectedDriverVehicle, setSelectedDriverVehicle] = useState<Vehicle | null>(null);

  const activeVehicles = vehicles.filter(v => v.status === 'active' || v.status === 'moving').length;
  const idleVehicles = vehicles.filter(v => v.status === 'available_capacity' || v.status === 'stopped').length;
  const breakdownVehicles = vehicles.filter(v => v.status === 'breakdown' || sosRequests.some(s => s.vehicleNumber === v.vehicleNumber && s.status !== 'completed')).length;

  const totalCapacity = vehicles.reduce((acc, v) => acc + v.capacityTotalTons, 0);
  const availableCapacity = vehicles.reduce((acc, v) => acc + v.capacityAvailableTons, 0);
  const utilizationRate = Math.round(((totalCapacity - availableCapacity) / totalCapacity) * 100);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.assignedDriverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'moving') return v.status === 'moving' || v.status === 'active';
    if (statusFilter === 'available') return v.status === 'available_capacity';
    if (statusFilter === 'breakdown') return v.status === 'breakdown' || breakdownVehicles > 0;
    return true;
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehNum.trim()) return;
    onAddNewVehicle({
      id: `veh-${Date.now()}`,
      vehicleNumber: newVehNum.trim().toUpperCase(),
      model: newModel.trim() || 'Ashok Leyland 2820 HG',
      type: 'heavy_truck',
      fleetOwnerId: 'fleet-01',
      fleetOwnerName: 'Sri Balaji Roadlines Chennai',
      assignedDriverId: `drv-${Date.now()}`,
      assignedDriverName: newDriverName.trim() || 'New Commercial Driver',
      driverPhone: newDriverPhone.trim() || '+91 98400 00000',
      currentRoute: {
        origin: 'Chennai',
        destination: 'Madurai',
        viaHighway: 'NH45',
        distanceTotalKm: 462,
        distanceCoveredKm: 0,
        estimatedArrival: 'Ready for Dispatch',
      },
      status: 'available_capacity',
      speedKmh: 0,
      fuelLevelPercent: 100,
      adBlueLevelPercent: 100,
      mileageKmPerL: 4.5,
      lastKnownLocation: {
        lat: 13.0827,
        lng: 80.2707,
        address: 'Madhavaram Transport Yard, Chennai',
        highway: 'NH45 Origin',
      },
      capacityTotalTons: 20,
      capacityAvailableTons: 20,
      tripStart: 'Today',
    });
    setShowAddModal(false);
    setNewVehNum('');
    setNewModel('');
    setNewDriverName('');
    setNewDriverPhone('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Fleet Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#FF9933] flex items-center justify-center border-2 border-[#FF9933]/30 shadow-md">
            <Building2 className="w-7 h-7 text-[#FF9933]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">Sri Balaji Roadlines Chennai</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                VERIFIED OPERATOR
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">Fleet Reg #TN-BALAJI-4491 • Commercial Carrier License</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FF9933]" />
          Register New Vehicle
        </button>
      </div>

      {/* Fleet Telemetry Metric Cards with Bold Typography */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Active Vehicles</span>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#0B1F3A] mb-1">
              {activeVehicles} <span className="text-sm text-slate-400 font-bold">/ {vehicles.length}</span>
            </div>
            <span className="text-[11px] text-[#138808] font-bold block uppercase tracking-wide">In Transit on NH45</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Capacity Utilization</span>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#138808] mb-1">
              {utilizationRate}%
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">{totalCapacity - availableCapacity}T / {totalCapacity}T in Use</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Average Mileage</span>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF9933] mb-1">
              4.4
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">KM / Litre (BS6 Avg)</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Emergency Alerts</span>
          <div>
            <div className={`text-3xl sm:text-4xl font-black mb-1 ${breakdownVehicles > 0 ? 'text-rose-600' : 'text-[#0B1F3A]'}`}>
              {breakdownVehicles}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">
              {breakdownVehicles > 0 ? 'Active Towing on NH45' : 'All Systems Green'}
            </span>
          </div>
        </div>
      </div>

      {/* FLEET FINANCIAL OVERVIEW — OWNER ONLY */}
      <section className="rounded-3xl bg-[#0B1F3A] text-white p-6 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FF9933]">Fleet Finance</p>
            <h3 className="text-xl font-black mt-1">Fleet Financial Overview</h3>
            <p className="text-xs text-slate-400 mt-1">Owner-level revenue, driver payouts and operating profit.</p>
          </div>
          <button
            type="button"
            onClick={() => window.alert('Fleet financial report is ready for review.')}
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            View Financial Report
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Fleet Revenue</span>
            <span className="text-2xl font-black mt-1 block">₹8.42 L</span>
            <span className="text-[10px] text-emerald-300 font-bold">+12.4% this month</span>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Driver Payout</span>
            <span className="text-2xl font-black mt-1 block">₹3.18 L</span>
            <span className="text-[10px] text-slate-400 font-bold">126 trips</span>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Operating Cost</span>
            <span className="text-2xl font-black mt-1 block">₹2.50 L</span>
            <span className="text-[10px] text-slate-400 font-bold">Fuel + maintenance</span>
          </div>
          <div className="rounded-2xl bg-[#138808]/20 border border-[#138808]/30 p-4">
            <span className="text-[10px] uppercase tracking-widest font-black text-emerald-300 block">Net Profit</span>
            <span className="text-2xl font-black mt-1 block">₹2.74 L</span>
            <span className="text-[10px] text-emerald-300 font-bold">32.5% margin</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Revenue Target</span>
              <span className="text-xs font-black">84%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[84%] rounded-full bg-[#FF9933] transition-all duration-700" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Driver Payment Status</span>
              <span className="text-xs font-black text-emerald-300">ON TRACK</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              ₹2.74 L expected payout cycle • 3 drivers pending settlement
            </p>
          </div>
        </div>
      </section>

      {/* DRIVER MANAGEMENT — OWNER ONLY */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FF9933]">Fleet Operations</p>
            <h3 className="text-xl font-black text-[#0B1F3A] mt-1">Driver Management</h3>
            <p className="text-xs text-slate-500 mt-1">Monitor drivers, assignments and performance from one place.</p>
          </div>
          <button
            type="button"
            onClick={() => window.alert('Add Driver workflow can be connected to your backend next.')}
            className="bg-[#0B1F3A] hover:bg-[#1A365D] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            + Add Driver
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {vehicles.slice(0, 6).map((veh) => (
            <div key={`driver-${veh.id}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:bg-white hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-black">
                    {veh.assignedDriverName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-[#0B1F3A] truncate">{veh.assignedDriverName}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{veh.vehicleNumber} • {veh.model}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                  veh.status === 'moving' || veh.status === 'active'
                    ? 'bg-emerald-50 text-[#138808] border border-emerald-200'
                    : veh.status === 'breakdown'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {veh.status === 'moving' || veh.status === 'active' ? 'ON DUTY' : veh.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Rating</span>
                  <span className="text-sm font-black text-[#FF9933] block mt-1">★ 4.8</span>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Safety</span>
                  <span className="text-sm font-black text-[#138808] block mt-1">94%</span>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Trips</span>
                  <span className="text-sm font-black text-[#0B1F3A] block mt-1">126</span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDriverVehicle(veh)}
                  className="flex-1 bg-[#0B1F3A] text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl hover:bg-[#1A365D] transition cursor-pointer"
                >
                  View Profile
                </button>
                <a
                  href={`tel:${veh.driverPhone}`}
                  className="flex-1 bg-white border border-slate-200 text-[#0B1F3A] text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl hover:bg-slate-50 transition text-center"
                >
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capacity Monetization & Empty Load Backhauls Panel */}
      <div className="bg-[#0B1F3A] text-white rounded-3xl p-6 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#FF9933] text-[#0B1F3A] font-black shrink-0 shadow-md">
              <DollarSign className="w-6 h-6 text-[#0B1F3A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  EMPTY-LOAD REVENUE MATCHING
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#138808] text-white">
                  PROFIT BOOST
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Your fleet has <strong className="text-[#FF9933] font-black">{availableCapacity} Tons of spare capacity</strong> along active highway routes. We have matched farmer harvest loads for backhaul pickup!
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">ESTIMATED EXTRA PROFIT</span>
            <span className="text-2xl font-black text-[#138808]">₹8,900 / Week</span>
          </div>
        </div>
      </div>

      {/* Fleet Vehicles Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vehicle number or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-10 pr-3 py-2.5 outline-none font-medium focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Fleet' },
              { id: 'moving', label: 'In Transit' },
              { id: 'available', label: 'Unused Space' },
              { id: 'breakdown', label: 'SOS / Alerts' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-[#0B1F3A] text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredVehicles.map((veh) => {
            const hasSOS = sosRequests.some(s => s.vehicleNumber === veh.vehicleNumber && s.status !== 'completed');
            return (
              <div
                key={veh.id}
                onClick={() => onSelectVehicle(veh)}
                className={`p-4 rounded-2xl border transition cursor-pointer hover:shadow-md ${
                  hasSOS
                    ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-[#0B1F3A]">{veh.vehicleNumber}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        hasSOS
                          ? 'bg-rose-600 text-white animate-pulse'
                          : veh.status === 'moving'
                          ? 'bg-[#138808]/15 text-[#138808]'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {hasSOS ? 'SOS ALERT' : veh.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{veh.model}</p>
                  </div>

                  <span className="text-xs font-mono font-black text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                    {veh.speedKmh} km/h
                  </span>
                </div>

                {/* Route & Driver */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span>{veh.currentRoute.origin} ➔ {veh.currentRoute.destination}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{veh.currentRoute.estimatedArrival}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Driver: <strong className="text-[#0B1F3A]">{veh.assignedDriverName}</strong> ({veh.driverPhone})
                  </p>
                </div>

                {/* Telemetry Fuel, AdBlue, Available Space */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-100/80 p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Fuel</span>
                    <span className="font-black text-slate-900">{veh.fuelLevelPercent}%</span>
                  </div>
                  <div className="bg-slate-100/80 p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">DEF AdBlue</span>
                    <span className="font-black text-indigo-800">{veh.adBlueLevelPercent}%</span>
                  </div>
                  <div className="bg-slate-100/80 p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Free Space</span>
                    <span className="font-black text-[#138808]">{veh.capacityAvailableTons}T</span>
                  </div>
                </div>

                {/* Last Known GPS Location */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5 truncate font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                    {veh.lastKnownLocation.address}
                  </span>
                  <span className="font-black text-[#0B1F3A] flex items-center gap-0.5 shrink-0 uppercase tracking-wider text-[10px]">
                    Track <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRIVER MANAGEMENT PROFILE MODAL */}
      {selectedDriverVehicle && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-[#0B1F3A] text-white p-6 rounded-t-3xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#0B1F3A] flex items-center justify-center font-black text-lg border-2 border-[#FF9933]">
                    {selectedDriverVehicle.assignedDriverName
                      .split(' ')
                      .map(n => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FF9933]">
                      Fleet Driver Profile
                    </p>
                    <h3 className="text-2xl font-black mt-1">
                      {selectedDriverVehicle.assignedDriverName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {selectedDriverVehicle.vehicleNumber} • {selectedDriverVehicle.model}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDriverVehicle(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black transition cursor-pointer"
                  aria-label="Close driver profile"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Driver Status</p>
                  <p className="text-lg font-black text-[#138808] mt-1">
                    {selectedDriverVehicle.status === 'moving' || selectedDriverVehicle.status === 'active'
                      ? '● ON DUTY'
                      : selectedDriverVehicle.status.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                <Activity className="w-6 h-6 text-[#138808]" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Rating</span>
                  <span className="text-xl font-black text-[#FF9933] block mt-1">★ 4.8</span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Safety</span>
                  <span className="text-xl font-black text-[#138808] block mt-1">94%</span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Trips</span>
                  <span className="text-xl font-black text-[#0B1F3A] block mt-1">126</span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Capacity</span>
                  <span className="text-xl font-black text-[#0B1F3A] block mt-1">{selectedDriverVehicle.capacityAvailableTons}T</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Phone</span>
                  <p className="font-black text-[#0B1F3A] mt-1">{selectedDriverVehicle.driverPhone}</p>
                  <a
                    href={`tel:${selectedDriverVehicle.driverPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#138808] mt-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Driver
                  </a>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Current Route</span>
                  <p className="font-black text-[#0B1F3A] mt-1">
                    {selectedDriverVehicle.currentRoute.origin} → {selectedDriverVehicle.currentRoute.destination}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedDriverVehicle.currentRoute.viaHighway} • ETA {selectedDriverVehicle.currentRoute.estimatedArrival}
                  </p>
                </div>
              </div>

              {/* Assign / Reassign Vehicle */}
              <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF9933]" />
                  <h4 className="text-sm font-black text-[#0B1F3A]">Assign / Reassign Vehicle</h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Select another vehicle to update this driver's assignment.
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <select
                    defaultValue={selectedDriverVehicle.id}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.vehicleNumber} — {v.model}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => window.alert(`Vehicle assignment saved for ${selectedDriverVehicle.assignedDriverName}.`)}
                    className="bg-[#0B1F3A] hover:bg-[#1A365D] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                  >
                    Save Assignment
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.alert(`Driver ${selectedDriverVehicle.assignedDriverName} marked for performance review.`)}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
                >
                  Performance Review
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDriverVehicle(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="font-black text-lg text-[#0B1F3A] pb-3 border-b border-slate-100 uppercase tracking-tight">
              Register Commercial Fleet Vehicle
            </h3>

            <form onSubmit={handleCreateVehicle} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Vehicle Registration Number:</label>
                <input
                  type="text"
                  required
                  placeholder="TN-01-AB-9988"
                  value={newVehNum}
                  onChange={(e) => setNewVehNum(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 uppercase font-mono font-black outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Truck Model & Chassis Type:</label>
                <input
                  type="text"
                  required
                  placeholder="Tata Signa 4825.T / Ashok Leyland 2820"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Assigned Driver Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Karuppiah"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Driver Mobile Phone:</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98401 XXXXX"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div className="mt-6 flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  Add to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};