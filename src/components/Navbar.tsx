import React, { useState } from 'react';
import { 
  Truck, 
  Building2, 
  Sprout, 
  Wrench, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Radio, 
  Languages, 
  Bell, 
  PhoneCall, 
  Volume2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { UserRole, LanguageCode, NetworkMode, NotificationItem } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/i18n';
import { playTruckHorn } from '../services/audioSimulator';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  networkMode: NetworkMode;
  onChangeNetworkMode: (mode: NetworkMode) => void;
  pendingSyncCount: number;
  onSyncOfflineQueue: () => void;
  notifications: NotificationItem[];
  onOpenIVRSim: () => void;
  onStartDemoTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  currentLang,
  onSelectLang,
  networkMode,
  onChangeNetworkMode,
  pendingSyncCount,
  onSyncOfflineQueue,
  notifications,
  onOpenIVRSim,
  onStartDemoTour,
}) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const roles = [
    { id: 'driver' as UserRole, label: t('role_driver', currentLang), icon: Truck, short: 'Driver' },
    { id: 'fleet_owner' as UserRole, label: t('role_fleet', currentLang), icon: Building2, short: 'Fleet' },
    { id: 'farmer_dealer' as UserRole, label: t('role_farmer', currentLang), icon: Sprout, short: 'Farmer' },
    { id: 'roadside_provider' as UserRole, label: t('role_provider', currentLang), icon: Wrench, short: 'Towing' },
    { id: 'admin' as UserRole, label: t('role_admin', currentLang), icon: ShieldAlert, short: 'Admin' },
  ];

  return (
    <header className="bg-[#0B1F3A] text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
      {/* Top Banner & Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF9933] flex items-center justify-center text-[#0B1F3A] font-black shadow-md">
              <Truck className="w-5 h-5 text-[#0B1F3A]" />
            </div>

            <div className="text-xl sm:text-2xl font-black tracking-tighter text-white">
              ROUTE<span className="text-[#FF9933]">LINK</span>
            </div>
          </div>
        </div>

        {/* Global Controls: Language, Network, Tour, IVR, SOS button */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Quick Language Switcher Bar */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold">
            <span className="text-white/40 uppercase tracking-wider text-[10px] font-black">
              LANG:
            </span>

            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectLang(lang.code)}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  currentLang === lang.code
                    ? 'text-white font-black border-b-2 border-[#FF9933]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {/* 22-Step Guided Demo Tour */}
          <button
            onClick={onStartDemoTour}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs px-3 py-2 rounded-xl transition cursor-pointer border border-white/10 active:scale-95 whitespace-nowrap"
            title="Launch 22-Step Complete Journey Demo"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span className="hidden lg:inline uppercase tracking-wider text-[11px]">
              {t('start_demo_tour', currentLang)}
            </span>
            <span className="lg:hidden">TOUR</span>
          </button>

          {/* Keypad IVR Simulator Trigger */}
          <button
            onClick={onOpenIVRSim}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-slate-200 text-xs px-2.5 py-2 rounded-xl border border-white/10 transition cursor-pointer"
            title="Simulate Keypad Phone / Automated IVR Dispatch"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden sm:inline font-bold uppercase tracking-wider text-[10px]">
              IVR HUB
            </span>
          </button>

          {/* Truck Horn Tester */}
          <button
            onClick={() => playTruckHorn()}
            className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition active:scale-90 cursor-pointer hidden sm:block"
            title="Play Indian Commercial Highway Horn"
          >
            <Volume2 className="w-4 h-4 text-white" />
          </button>

          {/* Network Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className={`flex items-center gap-1.5 text-xs font-black px-2.5 py-1.5 rounded-xl border transition cursor-pointer uppercase tracking-wider ${
                networkMode === 'online'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                  : networkMode === '2g_rural'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/80 animate-pulse'
              }`}
            >
              {networkMode === 'online' && (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              )}

              {networkMode === '2g_rural' && (
                <Radio className="w-3.5 h-3.5 text-amber-400" />
              )}

              {networkMode === 'offline' && (
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              )}

              <span className="text-[10px] hidden sm:inline font-black">
                {networkMode === 'online'
                  ? 'Online'
                  : networkMode === '2g_rural'
                  ? '2G Low'
                  : 'Offline'}
              </span>
            </button>

            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B1F3A] border border-white/20 rounded-2xl shadow-2xl p-2.5 z-50 text-xs text-white">

                <div className="text-[10px] font-black text-slate-400 px-2 py-1 uppercase tracking-widest">
                  Network & Bandwidth Engine
                </div>

                <button
                  onClick={() => {
                    onChangeNetworkMode('online');
                    setShowNetworkMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition mt-1 ${
                    networkMode === 'online'
                      ? 'bg-[#1E3A5F] text-emerald-400 font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    Online (Broadband)
                  </span>

                  {networkMode === 'online' && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    onChangeNetworkMode('2g_rural');
                    setShowNetworkMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition mt-1 ${
                    networkMode === '2g_rural'
                      ? 'bg-[#1E3A5F] text-amber-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    2G Rural (Low Bandwidth)
                  </span>

                  {networkMode === '2g_rural' && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    onChangeNetworkMode('offline');
                    setShowNetworkMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition mt-1 ${
                    networkMode === 'offline'
                      ? 'bg-[#1E3A5F] text-rose-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                    Offline (Local Caching)
                  </span>

                  {networkMode === 'offline' && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {pendingSyncCount > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        onSyncOfflineQueue();
                        setShowNetworkMenu(false);
                      }}
                      className="w-full bg-[#138808] hover:bg-[#0F6B06] text-white text-xs font-black uppercase tracking-wider py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Sync {pendingSyncCount} Queued Actions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Language Button */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 bg-white/10 text-white text-xs px-2 py-1.5 rounded-xl border border-white/10"
            >
              <Languages className="w-3.5 h-3.5 text-[#FF9933]" />
              <span className="font-black uppercase text-[10px]">
                {currentLang}
              </span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0B1F3A] border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLang(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition ${
                      currentLang === lang.code
                        ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[9px] uppercase font-bold opacity-75">
                      {lang.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />

              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF9933] text-[#0B1F3A] font-black text-[9px] rounded-full flex items-center justify-center shadow">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0B1F3A] border border-white/20 rounded-2xl shadow-2xl p-3 z-50 text-xs text-slate-200">

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-black text-sm text-white uppercase tracking-wider">
                    Alerts Hub
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    {notifications.length} total
                  </span>
                </div>

                <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border text-left ${
                        notif.priority === 'urgent'
                          ? 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                          : notif.priority === 'high'
                          ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                          : 'bg-white/5 border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-black text-xs">
                        <span>{notif.title}</span>
                        <span className="text-[10px] opacity-75 font-normal">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] opacity-90 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Navigation Switcher Bar */}
      <div className="bg-[#08182D] border-t border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto py-2 gap-2 no-scrollbar">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;

            return (
              <button
                key={r.id}
                onClick={() => onSelectRole(r.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#FF9933] text-[#0B1F3A] shadow-lg shadow-[#FF9933]/20 scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#0B1F3A]' : 'text-white/40'
                  }`}
                />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Low-Network / Offline Warning Banner if applicable */}
      {networkMode !== 'online' && (
        <div
          className={`px-4 py-2 text-xs text-center font-bold flex items-center justify-center gap-2 ${
            networkMode === '2g_rural'
              ? 'bg-amber-500/20 text-amber-200 border-b border-amber-500/30'
              : 'bg-rose-600/30 text-rose-200 border-b border-rose-500/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-[#FF9933]" />

          <span className="tracking-wide">
            {networkMode === '2g_rural'
              ? 'LOW-NETWORK 2G MODE ACTIVE: Compressed payloads & lightweight telemetry enabled.'
              : t('offline_notice', currentLang)}
          </span>

          {pendingSyncCount > 0 && (
            <span
              className="font-black underline cursor-pointer ml-1 text-[#FF9933]"
              onClick={onSyncOfflineQueue}
            >
              [{pendingSyncCount} queued sync operations]
            </span>
          )}
        </div>
      )}
    </header>
  );
};