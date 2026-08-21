import React, { useState } from 'react';
import { 
  Navigation, 
  AlertTriangle, 
  Fuel, 
  Wrench, 
  Coffee, 
  Sprout, 
  Truck, 
  MapPin, 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Phone,
  ArrowUpRight
} from 'lucide-react';
import { Vehicle, RoadsideService, SOSRequest, FarmerCargoRequest } from '../types';

interface InteractiveMapProps {
  vehicles: Vehicle[];
  services: RoadsideService[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  showAlternativeRoute?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  vehicles,
  services,
  sosRequests,
  farmerRequests,
  selectedVehicleId,
  onSelectVehicle,
  showAlternativeRoute = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'vehicles' | 'traffic' | 'sos' | 'services' | 'cargo'>('all');
  const [activeItem, setActiveItem] = useState<{ type: string; data: any } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Highway Waypoints scaled for responsive SVG coordinate space (0..800 x 0..420)
  const WAYPOINTS = [
    { name: 'Chennai (Origin)', km: 'KM 0', x: 700, y: 50, hub: true },
    { name: 'Tindivanam', km: 'KM 120', x: 580, y: 110, hub: false },
    { name: 'Vikravandi Toll Plaza', km: 'KM 152', x: 500, y: 155, hub: false, traffic: 'heavy' },
    { name: 'Villupuram Hub', km: 'KM 165', x: 440, y: 190, hub: true },
    { name: 'Ulundurpet Junction', km: 'KM 205', x: 370, y: 235, hub: false },
    { name: 'Samayapuram Toll', km: 'KM 310', x: 280, y: 285, hub: false },
    { name: 'Tiruchirappalli (Trichy)', km: 'KM 330', x: 230, y: 310, hub: true },
    { name: 'Dindigul Bypass', km: 'KM 410', x: 140, y: 350, hub: false },
    { name: 'Madurai (Mattuthavani)', km: 'KM 462', x: 70, y: 380, hub: true },
  ];

  // NH45 Highway polyline points
  const nh45Path = "M 700 50 L 580 110 L 500 155 L 440 190 L 370 235 L 280 285 L 230 310 L 140 350 L 70 380";
  
  // SH-09 Bypass path (Tindivanam -> Gingee -> Thirukovilur -> Ulundurpet)
  const bypassPath = "M 580 110 Q 520 80 430 115 Q 360 160 370 235";

  // Coordinates mapping helper for entities
  const getEntityCoords = (id: string, type: string) => {
    switch (id) {
      case 'veh-01': return { x: 445, y: 188, label: 'TN-01-AB-4589 (Murugan)' };
      case 'veh-02': return { x: 620, y: 88, label: 'TN-02-CC-8812 (In Transit)' };
      case 'veh-03': return { x: 190, y: 330, label: 'TN-09-BK-1102 (Salem Tanker)' };
      case 'veh-04': return { x: 435, y: 195, label: 'TN-04-XY-9090 (Empty Lorry)' };
      case 'srv-01': return { x: 490, y: 145, label: 'HPCL Diesel & AdBlue' };
      case 'srv-02': return { x: 430, y: 180, label: 'Kaveri Heavy Towing' };
      case 'srv-03': return { x: 410, y: 210, label: 'Grand Highway Dhaba' };
      case 'srv-04': return { x: 360, y: 245, label: 'Ulundurpet Garage' };
      case 'cargo-101': return { x: 385, y: 220, label: 'Arumugam (1.5T Tomatoes)' };
      case 'cargo-102': return { x: 270, y: 275, label: 'Chinnasamy (2.0T Bananas)' };
      case 'sos-9901': return { x: 445, y: 188, label: 'SOS Breakdown (Lorry 4589)' };
      default: return { x: 400, y: 200, label: id };
    }
  };

  const hasActiveSOS = sosRequests.some(s => s.status !== 'completed' && s.status !== 'cancelled');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Map Header & Filter Chips */}
      <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#0B1F3A] border border-slate-700 text-[#FF9933]">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">Live Highway Corridor Radar</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                NH45 / NH38 LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Chennai — Villupuram — Tiruchirappalli — Madurai (462 KM)</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Layers', icon: Layers },
            { id: 'traffic', label: 'Traffic & Bypass', icon: AlertTriangle },
            { id: 'vehicles', label: 'Fleet Lorries', icon: Truck },
            { id: 'sos', label: 'SOS Emergency', icon: Wrench },
            { id: 'services', label: 'Fuel/AdBlue', icon: Fuel },
            { id: 'cargo', label: 'Farmer Harvest', icon: Sprout },
          ].map(btn => {
            const Icon = btn.icon;
            const active = filter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-[#FF9933] text-[#0B1F3A] shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Canvas Map Surface */}
      <div className="relative bg-[#0A192F] w-full aspect-[16/9] sm:aspect-[21/9] max-h-[460px] overflow-hidden select-none">
        <svg 
          viewBox="0 0 800 420" 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Radial glow for traffic zone */}
            <radialGradient id="trafficGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            {/* Radial glow for SOS breakdown */}
            <radialGradient id="sosGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid & State Terrain Contour */}
          <rect width="800" height="420" fill="#0A192F" />
          <rect width="800" height="420" fill="url(#grid)" />

          {/* Highway Corridor Backbone Lines */}
          {/* Main NH45 Route */}
          <path
            d={nh45Path}
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={nh45Path}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Alternative Bypass Route (Green) */}
          {(filter === 'all' || filter === 'traffic') && showAlternativeRoute && (
            <>
              <path
                d={bypassPath}
                fill="none"
                stroke="#138808"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
              <path
                d={bypassPath}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              {/* Bypass Route Label */}
              <text x="460" y="85" fill="#4ADE80" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                ✓ SH-09 Bypass (Save 38 min)
              </text>
            </>
          )}

          {/* Vikravandi Traffic Congestion Hotspot */}
          {(filter === 'all' || filter === 'traffic') && (
            <g>
              <circle cx="500" cy="155" r="28" fill="url(#trafficGlow)" className="animate-ping-slow" />
              <circle cx="500" cy="155" r="14" fill="#EF4444" fillOpacity="0.7" stroke="#F87171" strokeWidth="2" />
              <text x="500" y="159" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">⚠</text>
              <text x="500" y="180" textAnchor="middle" fill="#FCA5A5" fontSize="9" fontWeight="bold">
                Toll Jam (45m delay)
              </text>
            </g>
          )}

          {/* Waypoint Nodes along NH45 */}
          {WAYPOINTS.map((wp, idx) => (
            <g key={idx}>
              <circle
                cx={wp.x}
                cy={wp.y}
                r={wp.hub ? 6 : 4}
                fill={wp.hub ? '#FF9933' : '#94A3B8'}
                stroke="#0B1F3A"
                strokeWidth="2"
              />
              <text
                x={wp.x}
                y={wp.y - 10}
                textAnchor="middle"
                fill={wp.hub ? '#FFFFFF' : '#CBD5E1'}
                fontSize={wp.hub ? "11" : "9"}
                fontWeight={wp.hub ? "bold" : "normal"}
              >
                {wp.name}
              </text>
              <text
                x={wp.x}
                y={wp.y + 16}
                textAnchor="middle"
                fill="#64748B"
                fontSize="8"
              >
                {wp.km}
              </text>
            </g>
          ))}

          {/* Roadside Services Pins */}
          {(filter === 'all' || filter === 'services') && services.map((srv) => {
            const coords = getEntityCoords(srv.id, 'service');
            return (
              <g 
                key={srv.id} 
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActiveItem({ type: 'service', data: srv })}
              >
                <circle cx={coords.x} cy={coords.y} r="10" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.5" />
                {srv.type === 'diesel_bunk' && (
                  <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">⛽</text>
                )}
                {srv.type === 'towing_service' && (
                  <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">🏗️</text>
                )}
                {srv.type === 'rest_area' && (
                  <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">☕</text>
                )}
                {srv.type === 'repair_garage' && (
                  <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">🔧</text>
                )}
              </g>
            );
          })}

          {/* Farmer Harvest Cargo Pins */}
          {(filter === 'all' || filter === 'cargo') && farmerRequests.map((cargo) => {
            const coords = getEntityCoords(cargo.id, 'cargo');
            return (
              <g 
                key={cargo.id} 
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActiveItem({ type: 'cargo', data: cargo })}
              >
                <circle cx={coords.x} cy={coords.y} r="11" fill="#138808" stroke="#86EFAC" strokeWidth="2" />
                <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">🌾</text>
                <text x={coords.x} y={coords.y - 13} textAnchor="middle" fill="#86EFAC" fontSize="8" fontWeight="bold">
                  {cargo.quantityTons}T {cargo.produceName.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Active Vehicles Pins */}
          {(filter === 'all' || filter === 'vehicles') && vehicles.map((veh) => {
            const coords = getEntityCoords(veh.id, 'vehicle');
            const isSelected = selectedVehicleId === veh.id;
            return (
              <g 
                key={veh.id} 
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => {
                  setActiveItem({ type: 'vehicle', data: veh });
                  if (onSelectVehicle) onSelectVehicle(veh);
                }}
              >
                {/* Ping ring for moving vehicle */}
                {veh.status === 'moving' && (
                  <circle cx={coords.x} cy={coords.y} r="14" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-ping-slow" />
                )}
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r="12" 
                  fill={isSelected ? '#FF9933' : '#1E40AF'} 
                  stroke={isSelected ? '#FFFFFF' : '#93C5FD'} 
                  strokeWidth="2" 
                />
                <text x={coords.x} y={coords.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9">🚛</text>
                <rect x={coords.x - 28} y={coords.y + 14} width="56" height="12" rx="3" fill="#0F172A" fillOpacity="0.8" />
                <text x={coords.x} y={coords.y + 23} textAnchor="middle" fill="#E2E8F0" fontSize="7.5" fontWeight="bold">
                  {veh.vehicleNumber.split('-')[1]}-{veh.vehicleNumber.split('-')[3]} ({veh.speedKmh}k)
                </text>
              </g>
            );
          })}

          {/* SOS Emergency Breakdown Ping */}
          {(filter === 'all' || filter === 'sos') && hasActiveSOS && (
            <g 
              className="cursor-pointer"
              onClick={() => setActiveItem({ type: 'sos', data: sosRequests[0] })}
            >
              <circle cx="445" cy="188" r="34" fill="url(#sosGlow)" className="animate-ping-slow" />
              <circle cx="445" cy="188" r="14" fill="#DC2626" stroke="#FCA5A5" strokeWidth="2.5" />
              <text x="445" y="192" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="extrabold">SOS</text>
              <rect x="390" y="152" width="110" height="16" rx="4" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" />
              <text x="445" y="163" textAnchor="middle" fill="#FEE2E2" fontSize="8" fontWeight="bold">
                🚨 Breakdown: Lorry 4589
              </text>
            </g>
          )}
        </svg>

        {/* Map Overlays: Legend & Zoom Controls */}
        <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1 hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span>NH45 Grand Southern Trunk (Main)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
            <span>SH-09 Rural Bypass (Recommended)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
            <span>Toll Congestion (Vikravandi)</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#0B1F3A]/90 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.8))}
            className="p-1 text-slate-200 hover:text-white bg-slate-800 rounded transition cursor-pointer"
            title="Zoom In"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
            className="p-1 text-slate-200 hover:text-white bg-slate-800 rounded transition cursor-pointer"
            title="Zoom Out"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setZoomLevel(1)}
            className="px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 rounded transition cursor-pointer"
            title="Reset Zoom"
          >
            1x
          </button>
        </div>
      </div>

      {/* Selected Entity Popup Drawer */}
      {activeItem && (
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1F3A] text-white">
              {activeItem.type === 'vehicle' && <Truck className="w-5 h-5 text-[#FF9933]" />}
              {activeItem.type === 'service' && <Fuel className="w-5 h-5 text-sky-400" />}
              {activeItem.type === 'cargo' && <Sprout className="w-5 h-5 text-emerald-400" />}
              {activeItem.type === 'sos' && <Wrench className="w-5 h-5 text-rose-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-[#0B1F3A]">
                  {activeItem.type === 'vehicle' && activeItem.data.model}
                  {activeItem.type === 'service' && activeItem.data.name}
                  {activeItem.type === 'cargo' && `${activeItem.data.produceName} (${activeItem.data.quantityTons} Tons)`}
                  {activeItem.type === 'sos' && `SOS: ${activeItem.data.vehicleNumber} (${activeItem.data.driverName})`}
                </h4>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {activeItem.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {activeItem.type === 'vehicle' && `Driver: ${activeItem.data.assignedDriverName} | Speed: ${activeItem.data.speedKmh} km/h | Fuel: ${activeItem.data.fuelLevelPercent}%`}
                {activeItem.type === 'service' && `${activeItem.data.location.address} • ${activeItem.data.hours}`}
                {activeItem.type === 'cargo' && `Farmer: ${activeItem.data.farmerName} • Pickup: ${activeItem.data.pickupLocation.address} (Fair Freight: ₹${activeItem.data.estimatedCostRs})`}
                {activeItem.type === 'sos' && `${activeItem.data.description} • Responding: Kaveri Towing (ETA: 11 mins)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {activeItem.type === 'service' && (
              <a
                href={`tel:${activeItem.data.phone}`}
                className="flex items-center gap-1.5 bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Partner
              </a>
            )}
            {activeItem.type === 'cargo' && (
              <button
                onClick={() => alert(`Connecting with Farmer ${activeItem.data.farmerName} on ${activeItem.data.farmerPhone}`)}
                className="flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#E67E00] text-[#0B1F3A] text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept Extra Load
              </button>
            )}
            <button
              onClick={() => setActiveItem(null)}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-2 py-1 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
