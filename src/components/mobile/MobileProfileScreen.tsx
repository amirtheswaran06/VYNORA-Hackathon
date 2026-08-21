import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  FileText, 
  CreditCard, 
  Languages, 
  RefreshCw, 
  LogOut, 
  Phone, 
  Star, 
  CheckCircle2,
  Lock,
  WifiOff
} from 'lucide-react';
import { Driver, LanguageCode, NetworkMode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';
import { playBeepNotification } from '../../services/audioSimulator';
import confetti from 'canvas-confetti';

interface MobileProfileScreenProps {
  driver: Driver;
  currentLang: LanguageCode;
  networkMode: NetworkMode;
  onSelectLang: (lang: LanguageCode) => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const MobileProfileScreen: React.FC<MobileProfileScreenProps> = ({
  driver,
  currentLang,
  networkMode,
  onSelectLang,
  onResetData,
  onLogout,
}) => {
  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Driver Identity & DigiLocker Card */}
      <div className="p-4 rounded-3xl bg-[#0B1F3A] text-white shadow-lg space-y-3 border border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FF9933] text-[#0B1F3A] flex items-center justify-center font-black text-2xl shadow-md border-2 border-white">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white leading-tight">{driver.name}</h2>
                <div className="flex items-center gap-1 bg-[#138808] px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-white">
                  <ShieldCheck className="w-3 h-3" />
                  <span>VERIFIED</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                {driver.phone} • Heavy Transport Commercial (HTV)
              </p>
            </div>
          </div>
        </div>

        {/* Rating & Trust Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15">
          <div className="text-center p-2 rounded-xl bg-white/10">
            <span className="text-[9px] font-black uppercase text-slate-300 block">Trust Score</span>
            <span className="text-base font-black text-[#FF9933] flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FF9933] text-[#FF9933]" />
              {driver.rating}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-white/10">
            <span className="text-[9px] font-black uppercase text-slate-300 block">Completed</span>
            <span className="text-base font-black text-white">142 Trips</span>
          </div>

          <div className="text-center p-2 rounded-xl bg-white/10">
            <span className="text-[9px] font-black uppercase text-slate-300 block">Safety</span>
            <span className="text-base font-black text-[#138808]">100% Intact</span>
          </div>
        </div>
      </div>

      {/* Commercial Vehicle & FASTag Information */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0B1F3A]" />
            <h3 className="font-black text-sm text-[#0B1F3A] uppercase tracking-tight">
              Assigned Commercial Vehicle
            </h3>
          </div>
          <span className="text-[10px] font-mono font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            {driver.vehicleNumber}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Chassis / Model:</span>
            <span className="font-black text-[#0B1F3A]">{driver.vehicleModel} (10 Wheels)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Fleet Owner:</span>
            <span className="font-black text-[#0B1F3A]">{driver.fleetOwnerName || 'Selvam Transport Logistics'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">FASTag Balance:</span>
            <span className="font-black text-[#138808]">₹1,450 (Active • NH45 Toll Ready)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">National Fitness Cert:</span>
            <span className="font-bold text-[#138808]">Valid till Dec 2027</span>
          </div>
        </div>
      </div>

      {/* Language Preference Switcher */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-[#FF9933]" />
            <h3 className="font-black text-sm text-[#0B1F3A] uppercase tracking-tight">
              Preferred App & Voice Language
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLang(lang.code)}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer min-h-[44px] flex flex-col items-center justify-center ${
                currentLang === lang.code
                  ? 'border-[#FF9933] bg-orange-50 text-[#0B1F3A] font-black shadow-xs ring-1 ring-[#FF9933]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-xs font-black">{lang.nativeName}</span>
              <span className="text-[9px] text-slate-400 font-bold">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offline & Cache Controls */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="font-black text-xs text-[#0B1F3A] uppercase tracking-wider">
          System & Highway Data Controls
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => {
              playBeepNotification();
              onResetData();
            }}
            className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-2xl border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl border border-rose-200 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
