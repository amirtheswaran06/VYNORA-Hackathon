import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Sprout, 
  Wrench, 
  ShieldAlert, 
  PhoneCall, 
  WifiOff, 
  CreditCard,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { UserRole, NetworkMode } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onSetNetworkMode: (mode: NetworkMode) => void;
  onTriggerSOS: () => void;
  onAcceptBypass: () => void;
  onAcceptCargo: () => void;
  onOpenIVR: () => void;
}

export const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Commercial Driver Registration & Route Profile',
    role: 'driver' as UserRole,
    description: 'Driver Murugan Shanmugam starts his Chennai to Madurai trip (462 KM) driving Ashok Leyland 2820 HG (TN-01-AB-4589). Current language set to Tamil/English.',
    actionLabel: 'Go to Driver Dashboard',
    category: 'driver',
  },
  {
    step: 2,
    title: '2. Real-Time Traffic & Toll Congestion Alert',
    role: 'driver' as UserRole,
    description: 'Near Vikravandi Toll Plaza (KM 152), the system detects a 45-minute severe toll congestion and alerts the driver.',
    actionLabel: 'Inspect Traffic Alert',
    category: 'traffic',
  },
  {
    step: 3,
    title: '3. Smart Alternative Bypass Rerouting',
    role: 'driver' as UserRole,
    description: 'RouteLink suggests the Villupuram Rural Bypass via Gingee SH-09, saving 38 minutes and ₹110 in idling diesel.',
    actionLabel: 'Apply Bypass Route',
    category: 'traffic',
  },
  {
    step: 4,
    title: '4. Highway Driver Mesh & Walkie-Talkie',
    role: 'driver' as UserRole,
    description: 'Driver connects with 4 other commercial lorries on the NH45 corridor. Driver Rakesh broadcasts an alert about an oil spill 15 KM ahead.',
    actionLabel: 'View Highway Mesh',
    category: 'driver',
  },
  {
    step: 5,
    title: '5. Mechanical Breakdown on Highway KM 165',
    role: 'driver' as UserRole,
    description: 'Driver experiences rising engine temperature and air brake pressure failure on the highway shoulder.',
    actionLabel: 'Simulate Breakdown',
    category: 'sos',
  },
  {
    step: 6,
    title: '6. Press Giant 1-Touch SOS Emergency Button',
    role: 'driver' as UserRole,
    description: 'Driver triggers the high-contrast SOS button with authentic audio siren. Exact GPS coordinates (NH45 KM 165) and vehicle details captured.',
    actionLabel: 'Trigger Emergency SOS',
    category: 'sos',
  },
  {
    step: 7,
    title: '7. Multi-Party Automated Emergency Broadcast',
    role: 'driver' as UserRole,
    description: '14 nearby truck drivers, 3 registered towing cranes, and the Fleet Owner in Chennai are immediately notified via SMS and push alerts.',
    actionLabel: 'View Broadcast Dispatch',
    category: 'sos',
  },
  {
    step: 8,
    title: '8. Roadside Recovery Partner Accepts Incident',
    role: 'roadside_provider' as UserRole,
    description: 'Kaveri Heavy Highway Recovery receives radar alert and dispatches Tata 2518 Heavy Crane Unit (ETA: 11 minutes).',
    actionLabel: 'Switch to Roadside Provider View',
    category: 'provider',
  },
  {
    step: 9,
    title: '9. Fleet Owner Real-Time Incident Tracking',
    role: 'fleet_owner' as UserRole,
    description: 'Sri Balaji Roadlines fleet manager receives the breakdown notification and monitors the live towing arrival on their fleet dashboard.',
    actionLabel: 'Switch to Fleet Owner Console',
    category: 'fleet',
  },
  {
    step: 10,
    title: '10. Mechanical Repair Completed & Back on Duty',
    role: 'roadside_provider' as UserRole,
    description: 'Air brake valve replaced, cooling system flushed, and lorry marked safe and operational on NH45.',
    actionLabel: 'Mark Incident Resolved',
    category: 'provider',
  },
  {
    step: 11,
    title: '11. Empty Cargo Space Detection (2.5 Tons Spare)',
    role: 'driver' as UserRole,
    description: 'The driver continues toward Trichy with 2.5 Tons of unused backhaul cargo space.',
    actionLabel: 'Check Available Capacity',
    category: 'driver',
  },
  {
    step: 12,
    title: '12. Rural Farmer Agricultural Request (Ulundurpet)',
    role: 'farmer_dealer' as UserRole,
    description: 'Farmer Arumugam posts 1.5 Tons of fresh country tomatoes needing urgent transport from Ulundurpet to Gandhi Market Trichy.',
    actionLabel: 'View Farmer Harvest Portal',
    category: 'farmer',
  },
  {
    step: 13,
    title: '13. Smart Freight Match & Revenue Generation',
    role: 'driver' as UserRole,
    description: 'RouteLink matches Farmer Arumugam with Driver Murugan. Driver earns ₹2,400 extra freight revenue with 0 KM diversion!',
    actionLabel: 'Accept Harvest Load (+₹2,400)',
    category: 'cargo',
  },
  {
    step: 14,
    title: '14. Farmer Cost Savings & Transparent Mandi Freight',
    role: 'farmer_dealer' as UserRole,
    description: 'Farmer saves 38% (paying ₹2,400 instead of ₹4,200 for a solo truck) and tracks live GPS transit to the wholesale market.',
    actionLabel: 'Inspect Farmer Savings Receipt',
    category: 'farmer',
  },
  {
    step: 15,
    title: '15. Emergency Repair Micro-Credit & FASTag Line',
    role: 'driver' as UserRole,
    description: 'Driver accesses ₹20,000 instant 0% repair credit and FASTag working capital line from partner NBFC.',
    actionLabel: 'Open Financial Services View',
    category: 'finance',
  },
  {
    step: 16,
    title: '16. Feature Phone Keypad IVR Telecom Simulation',
    role: 'driver' as UserRole,
    description: 'A non-smartphone driver receives an automated voice call in Tamil: "Press 1 to take Gingee Bypass". Driver presses 1 on the DTMF keypad.',
    actionLabel: 'Open Keypad IVR Simulator',
    category: 'ivr',
  },
  {
    step: 17,
    title: '17. Low-Network & Offline Simulation Mode',
    role: 'driver' as UserRole,
    description: 'Network drops in a rural ghat section. The app seamlessly transitions to offline-first mode, caching all mutations in LocalStorage.',
    actionLabel: 'Simulate Offline Mode',
    category: 'network',
  },
  {
    step: 18,
    title: '18. Offline Action Queuing',
    role: 'driver' as UserRole,
    description: 'Driver posts hazard updates and updates delivery milestones offline; actions are securely queued in the local sync buffer.',
    actionLabel: 'View Queued Mutations',
    category: 'network',
  },
  {
    step: 19,
    title: '19. Automatic Reconnection & Cloud Synchronization',
    role: 'driver' as UserRole,
    description: 'Network connectivity restores; all queued items are synchronized to the server automatically.',
    actionLabel: 'Restore Online & Sync',
    category: 'network',
  },
  {
    step: 20,
    title: '20. Fleet Utilization & Eco-Mileage Analytics',
    role: 'fleet_owner' as UserRole,
    description: 'Fleet owner reviews comprehensive capacity utilization (85%), fuel economy (4.4 km/L), and driver safety ratings.',
    actionLabel: 'Review Fleet Analytics',
    category: 'fleet',
  },
  {
    step: 21,
    title: '21. Platform Master Admin Operations Center',
    role: 'admin' as UserRole,
    description: 'Operations manager monitors active commercial vehicles, highway corridors, SOS response times, and farmer savings metrics.',
    actionLabel: 'View Admin Operations Center',
    category: 'admin',
  },
  {
    step: 22,
    title: '22. Complete Logistics Loop Successfully Executed',
    role: 'driver' as UserRole,
    description: 'All commercial stakeholders connected: safety ensured, roadside assistance mobilized, rural farm freight optimized, and backhaul empty space monetized!',
    actionLabel: 'Restart Demo / Continue Exploring',
    category: 'complete',
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onSetNetworkMode,
  onTriggerSOS,
  onAcceptBypass,
  onAcceptCargo,
  onOpenIVR,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleExecuteStep = (stepIdx: number) => {
    const stepObj = DEMO_STEPS[stepIdx];
    onSelectRole(stepObj.role);

    if (stepObj.step === 3) {
      onAcceptBypass();
    } else if (stepObj.step === 6) {
      onTriggerSOS();
    } else if (stepObj.step === 13) {
      onAcceptCargo();
    } else if (stepObj.step === 16) {
      onOpenIVR();
    } else if (stepObj.step === 17) {
      onSetNetworkMode('offline');
    } else if (stepObj.step === 19) {
      onSetNetworkMode('online');
    }
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      handleExecuteStep(nextIdx);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      handleExecuteStep(prevIdx);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    handleExecuteStep(idx);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#0B1F3A] text-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#1E3A5F] flex flex-col justify-between max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#138808] via-[#FF9933] to-[#FF9933] text-[#0B1F3A] font-extrabold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">RouteLink 22-Step End-to-End Demo Journey</h3>
              <p className="text-xs text-slate-400">Interactive walkthrough of all commercial driver, fleet, farmer & roadside workflows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Step Highlight Box */}
        <div className="my-4 p-4 rounded-2xl bg-[#132A46] border-2 border-[#FF9933] shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF9933] text-[#0B1F3A] uppercase tracking-wider">
              Step {currentStep.step} of 22
            </span>
            <span className="text-xs font-bold text-slate-300 capitalize bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Role: {currentStep.role.replace('_', ' ')}
            </span>
          </div>

          <h4 className="font-extrabold text-base sm:text-lg text-white mt-2">
            {currentStep.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
            <button
              onClick={() => handleExecuteStep(currentStepIdx)}
              className="bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              {currentStep.actionLabel}
            </button>
            <span className="text-[11px] text-slate-400">Click Next Step to advance app view</span>
          </div>
        </div>

        {/* Progress Bar & Jump-To Selector Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Journey Progress</span>
            <span>{Math.round(((currentStepIdx + 1) / DEMO_STEPS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#138808] via-[#FF9933] to-[#FF9933] transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIdx + 1) / DEMO_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Mini Step Pills Grid */}
          <div className="grid grid-cols-11 gap-1 pt-2">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleJumpToStep(idx)}
                className={`py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                  currentStepIdx === idx
                    ? 'bg-[#FF9933] text-[#0B1F3A] scale-110 shadow'
                    : idx < currentStepIdx
                    ? 'bg-emerald-800/80 text-emerald-200'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
                title={s.title}
              >
                {s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-5 pt-3 border-t border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            Exit Tour
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#E67E00] text-[#0B1F3A] text-xs font-extrabold px-5 py-2 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
          >
            <span>{currentStepIdx === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
