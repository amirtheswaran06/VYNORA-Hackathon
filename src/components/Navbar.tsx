import React, { useState } from 'react';
import {
  Truck,
  Building2,
  Sprout,
  Wrench,
  ShieldAlert,
  Languages,
  Bell,
} from 'lucide-react';

import {
  UserRole,
  LanguageCode,
  NetworkMode,
  NotificationItem,
} from '../types';

import { SUPPORTED_LANGUAGES, t } from '../services/i18n';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;

  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;

  notifications: NotificationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  currentLang,
  onSelectLang,
  notifications,
}) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const roles = [
    {
      id: 'driver' as UserRole,
      label: t('role_driver', currentLang),
      icon: Truck,
    },
    {
      id: 'fleet_owner' as UserRole,
      label: t('role_fleet', currentLang),
      icon: Building2,
    },
    {
      id: 'farmer_dealer' as UserRole,
      label: t('role_farmer', currentLang),
      icon: Sprout,
    },
    {
      id: 'roadside_provider' as UserRole,
      label: t('role_provider', currentLang),
      icon: Wrench,
    },
    {
      id: 'admin' as UserRole,
      label: t('role_admin', currentLang),
      icon: ShieldAlert,
    },
  ];

  return (
    <header className="bg-[#0B1F3A] text-white sticky top-0 z-50 shadow-xl border-b border-white/10">

      {/* Main Navbar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#FF9933] flex items-center justify-center shadow-md">
            <Truck className="w-5 h-5 text-[#0B1F3A]" />
          </div>

          <div className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter text-white truncate">
            ROUTE<span className="text-[#FF9933]">LINK</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white transition-all duration-200 active:scale-95"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />

              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#FF9933] text-[#0B1F3A] font-black text-[9px] rounded-full flex items-center justify-center shadow">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-80 bg-[#0B1F3A] border border-white/20 rounded-2xl shadow-2xl p-3 z-50 text-xs text-slate-200">

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-black text-sm text-white uppercase tracking-wider">
                    Alerts Hub
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    {notifications.length} total
                  </span>
                </div>

                <div className="mt-2 max-h-64 overflow-y-auto space-y-2">

                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
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
                        <div className="flex items-center justify-between gap-2 font-black text-xs">
                          <span className="truncate">
                            {notif.title}
                          </span>

                          <span className="text-[10px] opacity-75 font-normal whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] opacity-90 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 sm:py-2.5 rounded-xl border border-white/10 transition-all duration-200 active:scale-95"
              aria-label="Change language"
              title="Change language"
            >
              <Languages className="w-3.5 h-3.5 text-[#FF9933]" />

              <span className="font-black uppercase text-[10px]">
                {currentLang}
              </span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0B1F3A] border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50">

                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLang(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'bg-[#FF9933] text-[#0B1F3A] font-black'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.nativeName}</span>

                    <span className="text-[9px] uppercase font-bold opacity-70">
                      {lang.code}
                    </span>
                  </button>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Role Navigation */}
      <div className="bg-[#08182D] border-t border-white/10 px-2 sm:px-4 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto py-2 gap-1.5 sm:gap-2 no-scrollbar">

          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#FF9933] text-[#0B1F3A] shadow-lg shadow-[#FF9933]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-[#0B1F3A]'
                      : 'text-white/40'
                  }`}
                />

                <span>{role.label}</span>
              </button>
            );
          })}

        </div>
      </div>
    </header>
  );
};