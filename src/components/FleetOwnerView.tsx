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
