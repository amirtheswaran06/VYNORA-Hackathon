import React, { useState } from 'react';
import {
  Home,
  Sprout,
  Radio,
  User,
  Sun,
  WifiOff,
  Smartphone,
  Monitor,
  Truck,
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
  NetworkMode
} from '../../types';

import { OnboardingScreen } from './OnboardingScreen';
import { MobileHomeScreen } from './MobileHomeScreen';
import { MobileLoadMatchScreen } from './MobileLoadMatchScreen';
import { MobileCommunityScreen } from './MobileCommunityScreen';
import { MobileSOSScreen } from './MobileSOSScreen';
import { MobileProfileScreen } from './MobileProfileScreen';

import {
  playBeepNotification
} from '../../services/audioSimulator';

export type MobileTab =
  | 'onboarding'
  | 'home'
  | 'load_match'
  | 'community'
  | 'sos'
  | 'profile';

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

  onSendMeshMessage: (
    message: string,
    category: any
  ) => void;

  onResetData: () => void;

  onOpenIVRSim: () => void;
  onStartDemoTour: () => void;

  onSwitchToFullDesktopView?: () => void;
}

export const MobileAppShell: React.FC<
  MobileAppShellProps
> = ({
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
  const [activeTab, setActiveTab] =
    useState<MobileTab>('home');

  const [highContrastMode, setHighContrastMode] =
    useState<boolean>(false);

  const [isPhoneFramed, setIsPhoneFramed] =
    useState<boolean>(true);

  const pendingCargoCount =
    farmerRequests.filter(
      f =>
        f.status === 'pending' ||
        f.status === 'matched'
    ).length;

  const handleTabChange = (
    tab: MobileTab
  ) => {
    playBeepNotification();
    setActiveTab(tab);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-2 sm:py-6">

      {/* =====================================================
          MOBILE SUITE HEADER
          ===================================================== */}

      <div className="w-full max-w-md mb-4 bg-[#0B1F3A] text-white p-3 rounded-2xl shadow-md border border-white/10">

        <div className="flex items-center justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">

            <div className="w-7 h-7 shrink-0 rounded-lg bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black">
              <Truck className="w-4 h-4" />
            </div>

            <span className="font-black text-xs text-white truncate">
              ROUTELINK MOBILE SUITE
            </span>

          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Phone Frame Toggle */}
            <button
              onClick={() =>
                setIsPhoneFramed(
                  !isPhoneFramed
                )
              }
              className={`p-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all duration-200 active:scale-95 ${
                isPhoneFramed
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-slate-300'
              }`}
              title="Toggle smartphone frame"
              type="button"
            >
              {isPhoneFramed ? (
                <Smartphone className="w-3.5 h-3.5 text-[#FF9933]" />
              ) : (
                <Monitor className="w-3.5 h-3.5" />
              )}

              <span className="hidden sm:inline">
                {isPhoneFramed
                  ? 'Framed'
                  : 'Wide'}
              </span>
            </button>

            {/* Demo Tour */}
            <button
              onClick={onStartDemoTour}
              className="bg-[#FF9933] hover:bg-[#E68A2E] text-[#0B1F3A] font-black text-[10px] uppercase px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-1"
              type="button"
            >
              <Play className="w-3 h-3 fill-[#0B1F3A]" />
              <span>Tour</span>
            </button>

          </div>
        </div>


        {/* =================================================
            SCREEN QUICK NAVIGATION
            ================================================= */}

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-white/10 text-[10px] font-black uppercase tracking-wider">

          <button
            onClick={() =>
              handleTabChange('onboarding')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'onboarding'
                ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            1. Onboarding
          </button>


          <button
            onClick={() =>
              handleTabChange('home')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'home'
                ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            2. Home
          </button>


          <button
            onClick={() =>
              handleTabChange('load_match')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'load_match'
                ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            3. Loads ({pendingCargoCount})
          </button>


          <button
            onClick={() =>
              handleTabChange('community')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'community'
                ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            4. Community
          </button>


          {/* SOS remains available as a screen,
              but NOT as a centered bottom button */}
          <button
            onClick={() =>
              handleTabChange('sos')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'sos'
                ? 'bg-rose-500 text-white font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            5. SOS
          </button>


          <button
            onClick={() =>
              handleTabChange('profile')
            }
            className={`px-2.5 py-1.5 rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                : 'text-slate-300 hover:text-white bg-white/5'
            }`}
            type="button"
          >
            6. Profile
          </button>

        </div>
      </div>


      {/* =====================================================
          MOBILE DEVICE FRAME
          ===================================================== */}

      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFramed
            ? 'max-w-md bg-slate-900 p-3 sm:p-4 rounded-[40px] shadow-2xl border-4 border-slate-700/80 ring-8 ring-slate-900/40'
            : 'max-w-xl'
        }`}
      >

        {/* Device Notch */}
        {isPhoneFramed && (
          <div className="flex items-center justify-between px-6 pb-2 text-[11px] text-slate-300 font-bold">

            <span className="font-mono">
              09:41
            </span>

            <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>

            <div className="flex items-center gap-1.5">

              <span className="text-[10px] text-[#138808]">
                4G
              </span>

              <span className="text-[10px]">
                100%
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            INNER APP
            ================================================= */}

        <div
          className={`w-full bg-[#F5F7FA] rounded-[32px] overflow-hidden flex flex-col min-h-[640px] shadow-inner relative ${
            highContrastMode
              ? 'contrast-125'
              : ''
          }`}
        >

          {/* =================================================
              MOBILE TOP BAR
              ================================================= */}

          <div className="bg-[#0B1F3A] text-white px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">

            <div className="flex items-center gap-2 min-w-0">

              <div className="w-8 h-8 shrink-0 rounded-xl bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black">
                <Truck className="w-4 h-4" />
              </div>

              <div className="min-w-0">

                <span className="font-black text-sm tracking-tight text-white block leading-tight">
                  ROUTE<span className="text-[#FF9933]">LINK</span>
                </span>

                <span className="text-[9px] font-bold text-slate-300 block truncate">
                  NH45 Commercial Pilot
                </span>

              </div>

            </div>


            {/* Only useful controls remain */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Network indicator - NOT a button */}
              <div
                className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-[9px] font-bold"
                title="Current network status"
              >

                {networkMode === 'online' && (
                  <span className="w-2 h-2 rounded-full bg-[#138808]" />
                )}

                {networkMode === '2g_rural' && (
                  <span className="text-[#FF9933] font-black">
                    2G
                  </span>
                )}

                {networkMode === 'offline' && (
                  <WifiOff className="w-3 h-3 text-rose-400" />
                )}

                <span className="uppercase">
                  {networkMode === 'online'
                    ? 'Online'
                    : networkMode === '2g_rural'
                    ? '2G'
                    : 'Offline'}
                </span>

              </div>


              {/* High Contrast */}
              <button
                onClick={() =>
                  setHighContrastMode(
                    !highContrastMode
                  )
                }
                className={`p-1.5 rounded-lg border transition-all duration-200 active:scale-95 min-h-[34px] min-w-[34px] flex items-center justify-center ${
                  highContrastMode
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                    : 'bg-white/10 text-white border-white/20'
                }`}
                title="Toggle high contrast sunlight mode"
                type="button"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>


          {/* =================================================
              ACTIVE SCREEN
              ================================================= */}

          <div className="flex-1 p-3.5 overflow-y-auto no-scrollbar">

            {activeTab === 'onboarding' && (
              <OnboardingScreen
                currentLang={currentLang}
                onSelectLang={onSelectLang}
                onCompleteLogin={(role, phone) => {
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
                onToggleHighContrast={() =>
                  setHighContrastMode(
                    !highContrastMode
                  )
                }
                onTriggerSOS={() =>
                  handleTabChange('sos')
                }
                onAcceptBypassRoute={
                  onAcceptBypassRoute
                }
                onNavigateToTab={(tab) =>
                  handleTabChange(
                    tab as MobileTab
                  )
                }
              />
            )}


            {activeTab === 'load_match' && (
              <MobileLoadMatchScreen
                driver={driver}
                farmerRequests={farmerRequests}
                currentLang={currentLang}
                onAcceptLoad={
                  onAcceptCargoLoad
                }
              />
            )}


            {activeTab === 'community' && (
              <MobileCommunityScreen
                driver={driver}
                meshMessages={meshMessages}
                currentLang={currentLang}
                onSendMessage={
                  onSendMeshMessage
                }
              />
            )}


            {activeTab === 'sos' && (
              <MobileSOSScreen
                driver={driver}
                sosRequests={sosRequests}
                currentLang={currentLang}
                onTriggerSOS={
                  onTriggerSOS
                }
                onResolveSOS={
                  onResolveSOS
                }
              />
            )}


            {activeTab === 'profile' && (
              <MobileProfileScreen
                driver={driver}
                currentLang={currentLang}
                networkMode={networkMode}
                onSelectLang={
                  onSelectLang
                }
                onResetData={
                  onResetData
                }
                onLogout={() =>
                  handleTabChange(
                    'onboarding'
                  )
                }
              />
            )}

          </div>


          {/* =================================================
              BOTTOM NAVIGATION
              NO CENTER SOS BUTTON
              ================================================= */}

          <nav className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 z-30 shadow-lg">

            {/* Home */}
            <button
              onClick={() =>
                handleTabChange('home')
              }
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90 min-h-[48px] ${
                activeTab === 'home'
                  ? 'text-[#0B1F3A] font-black'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
              type="button"
            >

              <Home
                className={`w-5 h-5 ${
                  activeTab === 'home'
                    ? 'text-[#FF9933]'
                    : 'text-slate-400'
                }`}
              />

              <span className="text-[10px] tracking-tight">
                Home
              </span>

            </button>


            {/* Loads */}
            <button
              onClick={() =>
                handleTabChange(
                  'load_match'
                )
              }
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90 min-h-[48px] relative ${
                activeTab === 'load_match'
                  ? 'text-[#0B1F3A] font-black'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
              type="button"
            >

              <Sprout
                className={`w-5 h-5 ${
                  activeTab === 'load_match'
                    ? 'text-[#138808]'
                    : 'text-slate-400'
                }`}
              />

              <span className="text-[10px] tracking-tight">
                Loads
              </span>

              {pendingCargoCount > 0 && (
                <span className="absolute top-0 right-3 w-4 h-4 bg-[#138808] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {pendingCargoCount}
                </span>
              )}

            </button>


            {/* Community */}
            <button
              onClick={() =>
                handleTabChange(
                  'community'
                )
              }
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90 min-h-[48px] ${
                activeTab === 'community'
                  ? 'text-[#0B1F3A] font-black'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
              type="button"
            >

              <Radio
                className={`w-5 h-5 ${
                  activeTab === 'community'
                    ? 'text-[#FF9933]'
                    : 'text-slate-400'
                }`}
              />

              <span className="text-[10px] tracking-tight">
                Community
              </span>

            </button>


            {/* Profile */}
            <button
              onClick={() =>
                handleTabChange(
                  'profile'
                )
              }
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90 min-h-[48px] ${
                activeTab === 'profile'
                  ? 'text-[#0B1F3A] font-black'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
              type="button"
            >

              <User
                className={`w-5 h-5 ${
                  activeTab === 'profile'
                    ? 'text-[#0B1F3A]'
                    : 'text-slate-400'
                }`}
              />

              <span className="text-[10px] tracking-tight">
                Profile
              </span>

            </button>

          </nav>

        </div>
      </div>

    </div>
  );
};