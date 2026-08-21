import React, { useState } from 'react';
import { 
  Sprout, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Plus, 
  DollarSign, 
  TrendingDown, 
  ArrowRight,
  Receipt,
  Search,
  Package
} from 'lucide-react';
import { FarmerCargoRequest, Vehicle, ProduceCategory, LanguageCode } from '../types';
import { t } from '../services/i18n';
import confetti from 'canvas-confetti';

interface FarmerDealerViewProps {
  farmerRequests: FarmerCargoRequest[];
  vehicles: Vehicle[];
  currentLang: LanguageCode;
  onCreateCargoRequest: (request: Partial<FarmerCargoRequest>) => void;
}

export const FarmerDealerView: React.FC<FarmerDealerViewProps> = ({
  farmerRequests,
  vehicles,
  currentLang,
  onCreateCargoRequest,
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [produceCategory, setProduceCategory] = useState<ProduceCategory>('vegetables');
  const [produceName, setProduceName] = useState('Fresh Organic Country Tomatoes');
  const [quantityTons, setQuantityTons] = useState(1.5);
  const [pickupAddress, setPickupAddress] = useState('Ulundurpet Farmer Cooperative Mandi (NH45)');
  const [dropoffAddress, setDropoffAddress] = useState('Gandhi Market, Tiruchirappalli');
  const [specialNotes, setSpecialNotes] = useState('Carefully stacked in 60 plastic crates with straw protection.');

  // Calculate instant fair price estimate
  const estimatedCost = Math.round(quantityTons * 160 * 10); // approx ₹2,400 for 1.5T over 160km
  const soloTruckCost = Math.round(estimatedCost * 1.6);
  const savingsPercent = 38;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCargoRequest({
      id: `cargo-${Date.now()}`,
      farmerId: 'fmr-01',
      farmerName: 'Arumugam P. (Farmer Mandi)',
      farmerPhone: '+91 94420 55123',
      pickupLocation: {
        lat: 11.7010,
        lng: 79.3120,
        address: pickupAddress,
        highway: 'NH45 Corridor',
      },
      dropoffLocation: {
        lat: 10.7905,
        lng: 78.7047,
        address: dropoffAddress,
        highway: 'NH45 Entry',
      },
      produceCategory,
      produceName,
      quantityTons,
      maxBudgetRs: estimatedCost + 400,
      requiredByDate: 'Today before 6:00 PM',
      status: 'pending',
      estimatedCostRs: estimatedCost,
      savingsVsSoloTruckPercent: savingsPercent,
      specialInstructions: specialNotes,
      createdAt: 'Just now',
    });
    setShowRequestModal(false);
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Farmer Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#138808] flex items-center justify-center border-2 border-[#138808]/40 shadow-md">
            <Sprout className="w-7 h-7 text-[#138808]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">Rural Farmer & Produce Logistics</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#FF9933] text-[#0B1F3A]">
                EMPTY-LOAD SAVER
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Connect directly with passing commercial lorries along NH45 with spare cargo space
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="w-full sm:w-auto bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Request Harvest Transport
        </button>
      </div>

      {/* Value Proposition & Cost Savings Banner with Bold Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-[#138808] shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Farmer Savings</span>
            <div className="text-2xl sm:text-3xl font-black text-[#138808] mb-0.5">35% - 45% OFF</div>
            <p className="text-xs text-slate-500 font-medium">vs hiring an entire solo lorry</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 text-[#FF9933] shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Passing Lorries</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A] mb-0.5">8 ACTIVE</div>
            <p className="text-xs text-slate-500 font-medium">Along NH45 Chennai-Trichy</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Transparent Pricing</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-700 mb-0.5">₹1,600 / TON</div>
            <p className="text-xs text-slate-500 font-medium">Fixed rate with zero middlemen</p>
          </div>
        </div>
      </div>

      {/* Active Harvest Transport Requests */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base text-[#0B1F3A]">My Harvest Transport Shipments</h3>
            <p className="text-xs text-slate-500 font-medium">Track matched trucks, driver details, and delivery milestones</p>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#138808] bg-[#138808]/15 px-3 py-1 rounded-xl border border-[#138808]/30">
            {farmerRequests.length} ACTIVE SHIPMENTS
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {farmerRequests.map((req) => (
            <div key={req.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-base text-[#0B1F3A]">{req.produceName}</span>
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                    {req.quantityTons} TONS
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                    req.status === 'matched' || req.status === 'accepted'
                      ? 'bg-[#FF9933] text-[#0B1F3A]'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#138808] shrink-0" />
                    Pickup: {req.pickupLocation.address}
                  </span>
                  <span className="hidden sm:inline text-slate-300">➔</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B1F3A] shrink-0" />
                    Mandi: {req.dropoffLocation.address}
                  </span>
                </div>

                {req.matchedDriverName && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="font-black text-emerald-900">Matched Lorry: {req.matchedVehicleNumber}</span>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        Driver: {req.matchedDriverName} ({req.matchedDriverPhone}) • Arriving at Ulundurpet Mandi in ~15 mins
                      </p>
                    </div>
                    {req.matchedDriverPhone && (
                      <a
                        href={`tel:${req.matchedDriverPhone}`}
                        className="flex items-center gap-1.5 bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Driver
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="text-right border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5 shrink-0 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Agreed Freight</span>
                  <span className="text-xl font-black text-[#138808]">₹{req.estimatedCostRs}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mt-1 border border-emerald-200">
                  Saved {req.savingsVsSoloTruckPercent}% vs solo truck
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE HARVEST TRANSPORT REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg text-[#0B1F3A] pb-3 border-b border-slate-100 uppercase tracking-tight">
              Request Harvest Transport (Empty-Load Match)
            </h3>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Produce / Goods Category:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'vegetables', label: 'Vegetables' },
                    { id: 'fruits', label: 'Fruits' },
                    { id: 'grains', label: 'Paddy / Grains' },
                    { id: 'agricultural', label: 'Sugarcane / Agri' },
                    { id: 'local_goods', label: 'Coir / Local' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setProduceCategory(cat.id as any)}
                      className={`p-2.5 rounded-xl border font-black text-center transition cursor-pointer ${
                        produceCategory === cat.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Specific Produce Name & Packaging:</label>
                <input
                  type="text"
                  required
                  value={produceName}
                  onChange={(e) => setProduceName(e.target.value)}
                  placeholder="e.g. Country Tomatoes in Crates / Robusta Bananas"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#138808]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Quantity (Tons):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="20"
                    required
                    value={quantityTons}
                    onChange={(e) => setQuantityTons(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-black focus:ring-2 focus:ring-[#138808]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Estimated Fair Freight:</label>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                    <span className="text-base font-black text-[#138808]">₹{estimatedCost}</span>
                    <span className="text-[10px] font-bold text-emerald-800 block">Solo lorry: ~₹{soloTruckCost}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Pickup Farm / Mandi Location:</label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Village, Mandi, Landmark (near Highway)"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#138808]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Destination Wholesale Market / City:</label>
                <input
                  type="text"
                  required
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  placeholder="e.g. Gandhi Market Trichy / Mattuthavani Madurai"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#138808]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1">Loading Notes for Truck Driver:</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 outline-none font-medium focus:ring-2 focus:ring-[#138808]"
                />
              </div>

              <div className="mt-6 flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post Transport Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
