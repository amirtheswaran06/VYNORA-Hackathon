import React, { useState } from 'react';
import { 
  Home, 
  Sprout, 
  ShieldAlert, 
  Radio, 
  User, 
  Sun, 
  Wifi, 
  WifiOff, 
  Volume2, 
  Languages, 
  Smartphone, 
  Monitor, 
  Layers,
  MapPin,
  Truck,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  Play
} from 'lucide-react';
import { 
  Driver, 
  RouteTrafficInfo, 
  RoadsideService, 
  SOSRequest, 
  FarmerCargoRequest, 
  DriverMeshMessage,
  LanguageCode, 
  NetworkMode,
  UserRole
} from '../../types';
import { OnboardingScreen } from './OnboardingScreen';
import { MobileHomeScreen } from './MobileHomeScreen';
import { MobileLoadMatchScreen } from './MobileLoadMatchScreen';
import { MobileCommunityScreen } from './MobileCommunityScreen';
import { MobileSOSScreen } from './MobileSOSScreen';
import { MobileProfileScreen } from './MobileProfileScreen';
import { playBeepNotification, playTruckHorn } from '../../services/audioSimulator';

export type MobileTab = 'onboarding' | 'home' | 'load_match' | 'community' | 'sos' | 'profile';

interface MobileAppShellProps {
  driver: Driver;
  trafficInfo: RouteTrafficInfo;
  services: RoadsideService[];
  sosRequests: SOSRequest[];
  farmerRequests: FarmerCargoRequest[];
  meshMessages: DriverMeshMessage[];
  currentLang: LanguageCode;
  networkMode: NetworkMode;
  onSelectLang: (lang: LanguageCode) => void;
  onChangeNetworkMode: (mode: NetworkMode) => void;
  onTriggerSOS: (type?: any, desc?: any) => void;
  onResolveSOS: (sosId: string) => void;
  onAcceptBypassRoute: () => void;
  onAcceptCargoLoad: (cargoId?: string) => void;
  onSendMeshMessage: (message: string, category: any) => void;
  onResetData: () => void;
  onOpenIVRSim: () => void;
  onStartDemoTour: () => void;
  onSwitchToFullDesktopView?: () => void;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  driver,
  trafficInfo,
  services,
  sosRequests,
  farmerRequests,
  meshMessages,
  currentLang,
  networkMode,
  onSelectLang,
  onChangeNetworkMode,
  onTriggerSOS,
  onResolveSOS,
  onAcceptBypassRoute,
  onAcceptCargoLoad,
  onSendMeshMessage,
  onResetData,
  onOpenIVRSim,
  onStartDemoTour,
  onSwitchToFullDesktopView,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);
  const [isPhoneFramed, setIsPhoneFramed] = useState<boolean>(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(true);

  const activeSOS = sosRequests.find(s => s.status !== 'completed' && s.status !== 'cancelled');
  const pendingCargoCount = farmerRequests.filter(f => f.status === 'pending' || f.status === 'matched').length;

  const handleTabChange = (tab: MobileTab) => {
    playBeepNotification();
    setActiveTab(tab);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-2 sm:py-6">
      {/* Top Designer & Screen Navigation Bar for Quick Review */}
      <div className="w-full max-w-md mb-4 bg-[#0B1F3A] text-white p-3 rounded-2xl shadow-md border border-white/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black">
              <Truck className="w-4 h-4 text-[#0B1F3A]" />
            </div>
            <span className="font-black text-xs text-white">ROUTELINK MOBILE SUITE</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Phone Frame Container vs Full-Width Mobile */}
            <button
              onClick={() => setIsPhoneFramed(!isPhoneFramed)}
              className={`p-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                isPhoneFramed ? 'bg-white/20 border-white/40 text-white' : 'bg-white/10 border-white/20 text-slate-300'
              }`}
              title="Toggle Smartphone Frame Container"
            >
              {isPhoneFramed ? <Smartphone className="w-3.5 h-3.5 text-[#FF9933]" /> : <Monitor className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPhoneFramed ? 'Framed' : 'Wide'}</span>
            </button>

            {/* Quick Tour Button */}
            <button
              onClick={onStartDemoTour}
              className="bg-[#FF9933] hover:bg-[#E68A2E] text-[#0B1F3A] font-black text-[10px] uppercase px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-[#0B1F3A]" />
              <span>Tour</span>
            </button>

            {/* IVR Hub */}
            <button
              onClick={onOpenIVRSim}
              className="bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase px-2 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 border border-white/10"
              title="Open Keypad 2G IVR Phone Simulator"
            >
              <PhoneCall className="w-3 h-3 text-[#FF9933]" />
              <span>IVR</span>
            </button>
          </div>
        </div>

        {/* 6 Required Screen Fast-Jump Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-white/10 text-[10px] font-black uppercase tracking-wider">
          <button
            onClick={() => handleTabChange('onboarding')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'onboarding' ? 'bg-[#FF9933] text-[#0B1F3A] font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            1. Onboarding
          </button>
          <button
            onClick={() => handleTabChange('home')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'home' ? 'bg-[#FF9933] text-[#0B1F3A] font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            2. Home
          </button>
          <button
            onClick={() => handleTabChange('load_match')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'load_match' ? 'bg-[#FF9933] text-[#0B1F3A] font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            3. Loads ({pendingCargoCount})
          </button>
          <button
            onClick={() => handleTabChange('community')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'community' ? 'bg-[#FF9933] text-[#0B1F3A] font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            4. Community
          </button>
          <button
            onClick={() => handleTabChange('sos')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'sos' ? 'bg-rose-500 text-white font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            5. SOS
          </button>
          <button
            onClick={() => handleTabChange('profile')}
            className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#FF9933] text-[#0B1F3A] font-black' : 'text-slate-300 hover:text-white bg-white/5'
            }`}
          >
            6. Profile
          </button>
        </div>
      </div>

      {/* Main Mobile Screen Container (with optional realistic bezel frame) */}
      <div className={`w-full transition-all duration-300 ${
        isPhoneFramed 
          ? 'max-w-md bg-slate-900 p-3 sm:p-4 rounded-[40px] shadow-2xl border-4 border-slate-700/80 ring-8 ring-slate-900/40' 
          : 'max-w-xl'
      }`}>
        {/* Device Notch & Dynamic Speaker Pill (Visible in Framed Mode) */}
        {isPhoneFramed && (
          <div className="flex items-center justify-between px-6 pb-2 text-[11px] text-slate-300 font-bold">
            <span className="font-mono">09:41</span>
            <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#138808]">4G</span>
              <span className="text-[10px]">100%</span>
            </div>
          </div>
        )}

        {/* Inner Mobile App Surface */}
        <div className={`w-full bg-[#F5F7FA] rounded-[32px] overflow-hidden flex flex-col min-h-[640px] shadow-inner relative ${
          highContrastMode ? 'contrast-125' : ''
        }`}>
          {/* Mobile Top App Bar */}
          <div className="bg-[#0B1F3A] text-white px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black">
                <Truck className="w-4 h-4 text-[#0B1F3A]" />
              </div>
              <div>
                <span className="font-black text-sm tracking-tight text-white block leading-tight">
                  ROUTE<span className="text-[#FF9933]">LINK</span>
                </span>
                <span className="text-[9px] font-bold text-slate-300 block">
                  NH45 Commercial Pilot
                </span>
              </div>
            </div>

            {/* Top Right Quick Controls: Network State & Contrast */}
            <div className="flex items-center gap-2">
              {/* Network State Badge */}
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-[9px] font-bold">
                {networkMode === 'online' && <Wifi className="w-3 h-3 text-[#138808]" />}
                {networkMode === '2g_rural' && <span className="text-[#FF9933] font-black">2G</span>}
                {networkMode === 'offline' && <WifiOff className="w-3 h-3 text-rose-400" />}
                <span className="uppercase">{networkMode === 'online' ? 'Online' : 'Synced 2m ago'}</span>
              </div>

              {/* Outdoor Sunlight Contrast Toggle */}
              <button
                onClick={() => setHighContrastMode(!highContrastMode)}
                className={`p-1.5 rounded-lg border transition cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center ${
                  highContrastMode ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-white/10 text-white border-white/20'
                }`}
                title="Toggle High Contrast Sunlight Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Screen View Body */}
          <div className="flex-1 p-3.5 overflow-y-auto no-scrollbar">
            {activeTab === 'onboarding' && (
              <OnboardingScreen
                currentLang={currentLang}
                onSelectLang={onSelectLang}
                onCompleteLogin={(role, phone) => {
                  setIsOnboardingCompleted(true);
                  handleTabChange('home');
                }}
              />
            )}

            {activeTab === 'home' && (
              <MobileHomeScreen
                driver={driver}
                trafficInfo={trafficInfo}
                services={services}
                sosRequests={sosRequests}
                farmerRequests={farmerRequests}
                currentLang={currentLang}
                highContrastMode={highContrastMode}
                onToggleHighContrast={() => setHighContrastMode(!highContrastMode)}
                onTriggerSOS={() => handleTabChange('sos')}
                onAcceptBypassRoute={onAcceptBypassRoute}
                onNavigateToTab={(tab) => handleTabChange(tab as MobileTab)}
              />
            )}

            {activeTab === 'load_match' && (
              <MobileLoadMatchScreen
                driver={driver}
                farmerRequests={farmerRequests}
                currentLang={currentLang}
                onAcceptLoad={onAcceptCargoLoad}
              />
            )}

            {activeTab === 'community' && (
              <MobileCommunityScreen
                driver={driver}
                meshMessages={meshMessages}
                currentLang={currentLang}
                onSendMessage={onSendMeshMessage}
              />
            )}

            {activeTab === 'sos' && (
              <MobileSOSScreen
                driver={driver}
                sosRequests={sosRequests}
                currentLang={currentLang}
                onTriggerSOS={onTriggerSOS}
                onResolveSOS={onResolveSOS}
              />
            )}

            {activeTab === 'profile' && (
              <MobileProfileScreen
                driver={driver}
                currentLang={currentLang}
                networkMode={networkMode}
                onSelectLang={onSelectLang}
                onResetData={onResetData}
                onLogout={() => handleTabChange('onboarding')}
              />
            )}
          </div>

          {/* Bottom Thumb Navigation Bar (Min 52px Touch Targets) */}
          <nav className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 z-30 shadow-lg">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition cursor-pointer min-h-[48px] ${
                activeTab === 'home' ? 'text-[#0B1F3A] font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#FF9933]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">Home</span>
            </button>

            <button
              onClick={() => handleTabChange('load_match')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition cursor-pointer min-h-[48px] relative ${
                activeTab === 'load_match' ? 'text-[#0B1F3A] font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <Sprout className={`w-5 h-5 ${activeTab === 'load_match' ? 'text-[#138808]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">Loads</span>
              {pendingCargoCount > 0 && (
                <span className="absolute top-0 right-3 w-4 h-4 bg-[#138808] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {pendingCargoCount}
                </span>
              )}
            </button>

            {/* Center Prominent Saffron SOS Button */}
            <button
              onClick={() => handleTabChange('sos')}
              className={`flex flex-col items-center justify-center -mt-5 transition cursor-pointer active:scale-95`}
            >
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center font-black shadow-xl border-2 border-white ${
                activeSOS ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#FF9933] text-[#0B1F3A]'
              }`}>
                <ShieldAlert className="w-7 h-7" />
              </div>
              <span className={`text-[10px] font-black mt-1 ${activeSOS ? 'text-rose-600' : 'text-[#FF9933]'}`}>
                SOS
              </span>
            </button>

            <button
              onClick={() => handleTabChange('community')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition cursor-pointer min-h-[48px] ${
                activeTab === 'community' ? 'text-[#0B1F3A] font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <Radio className={`w-5 h-5 ${activeTab === 'community' ? 'text-[#FF9933]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">Community</span>
            </button>

            <button
              onClick={() => handleTabChange('profile')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition cursor-pointer min-h-[48px] ${
                activeTab === 'profile' ? 'text-[#0B1F3A] font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[#0B1F3A]' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
