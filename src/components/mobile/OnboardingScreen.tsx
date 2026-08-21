import React, { useState } from 'react';
import { 
  Languages, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  ShieldCheck, 
  Truck, 
  Sprout, 
  Building2, 
  Grid,
  Lock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { LanguageCode, UserRole } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../services/i18n';
import { playBeepNotification } from '../../services/audioSimulator';
import confetti from 'canvas-confetti';

interface OnboardingScreenProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  onCompleteLogin: (role: UserRole, driverPhone: string) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  currentLang,
  onSelectLang,
  onCompleteLogin,
}) => {
  const [step, setStep] = useState<'language' | 'phone' | 'otp'>('language');
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');
  const [phoneNumber, setPhoneNumber] = useState('98401 23456');
  const [otpCode, setOtpCode] = useState(['5', '8', '2', '1']);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const languageOptions = [
    { code: 'ta' as LanguageCode, name: 'தமிழ் (Tamil)', region: 'Tamil Nadu • NH45 Corridor', voiceText: 'வணக்கம்! ரூட்லிங்க் செயலியைத் தேர்ந்தெடுத்தமைக்கு நன்றி.' },
    { code: 'hi' as LanguageCode, name: 'हिन्दी (Hindi)', region: 'North & National Highways', voiceText: 'नमस्ते! रूटलिंक में आपका स्वागत है।' },
    { code: 'te' as LanguageCode, name: 'తెలుగు (Telugu)', region: 'Andhra & Telangana Corridors', voiceText: 'నమస్కారం! రూట్‌లింక్‌కు స్వాగతం.' },
    { code: 'kn' as LanguageCode, name: 'ಕನ್ನಡ (Kannada)', region: 'Karnataka • NH48 / NH44', voiceText: 'ನಮಸ್ಕಾರ! ರೂಟ್‌ಲಿಂಕ್‌ಗೆ ಸುಸ್ವಾಗತ.' },
    { code: 'ml' as LanguageCode, name: 'മലയാളം (Malayalam)', region: 'Kerala • NH66 / NH544', voiceText: 'നമസ്കാരം! റൂട്ട് ലിങ്കിലേക്ക് സ്വാഗതം.' },
    { code: 'en' as LanguageCode, name: 'English', region: 'All India Commercial Freight', voiceText: 'Welcome to RouteLink Rural Commercial Mobility.' },
  ];

  const handlePlayVoice = (text: string) => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      playBeepNotification();
      setTimeout(() => setIsPlayingAudio(false), 1500);
    }
  };

  const handleNumpadClick = (digit: string) => {
    playBeepNotification();
    if (step === 'phone') {
      if (phoneNumber.replace(/\s/g, '').length < 10) {
        setPhoneNumber(prev => prev + digit);
      }
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setSelectedRole(role);
    confetti({ particleCount: 50, spread: 60 });
    onCompleteLogin(role, '98401 23456');
  };

  return (
    <div className="bg-white min-h-[580px] p-5 flex flex-col justify-between font-sans">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0B1F3A] text-[#FF9933] flex items-center justify-center font-black shadow-md border border-[#FF9933]/30">
              <Truck className="w-6 h-6 text-[#FF9933]" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#0B1F3A]">
                ROUTE<span className="text-[#FF9933]">LINK</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Rural Commercial Mobility
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#138808]/15 px-2.5 py-1 rounded-full text-[10px] font-black text-[#138808] border border-[#138808]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NHAI VERIFIED</span>
          </div>
        </div>

        {/* Step 1: Regional Language Selection */}
        {step === 'language' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#0B1F3A]">
                  Select Your Language / மொழியைத் தேர்வுசெய்க
                </h3>
                <Languages className="w-5 h-5 text-[#FF9933]" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Simple icons, voice guides & high-contrast text for highway use
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {languageOptions.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      onSelectLang(lang.code);
                      handlePlayVoice(lang.voiceText);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between min-h-[90px] relative ${
                      isSelected
                        ? 'border-[#FF9933] bg-orange-50/70 shadow-md ring-2 ring-[#FF9933]/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-black text-sm text-[#0B1F3A]">{lang.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVoice(lang.voiceText);
                        }}
                        className="p-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 shadow-2xs cursor-pointer"
                        title="Listen Voice Guide"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#FF9933]" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{lang.region}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep('phone')}
                className="w-full bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Continue to Phone Login</span>
                <ArrowRight className="w-4 h-4 text-[#FF9933]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Phone & Role Selection */}
        {step === 'phone' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#0B1F3A]">
                  Enter Mobile Number / தொலைபேசி எண்
                </h3>
                <Phone className="w-5 h-5 text-[#138808]" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Works on both Smartphones and 2G Keypad phone accounts
              </p>
            </div>

            {/* Role Switcher Chips */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Select Your Operating Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'driver' as UserRole, label: 'Lorry Driver', icon: Truck },
                  { id: 'farmer_dealer' as UserRole, label: 'Farmer Mandi', icon: Sprout },
                  { id: 'fleet_owner' as UserRole, label: 'Fleet Owner', icon: Building2 },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition cursor-pointer ${
                      selectedRole === r.id
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <r.icon className={`w-4 h-4 ${selectedRole === r.id ? 'text-[#FF9933]' : 'text-slate-500'}`} />
                    <span className="text-[11px] font-black">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Input Field */}
            <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center gap-3">
              <span className="text-sm font-black text-slate-700 font-mono bg-white px-2 py-1 rounded-lg border border-slate-200">
                +91 🇮🇳
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full bg-transparent font-mono font-black text-base text-[#0B1F3A] outline-none tracking-wider"
              />
            </div>

            {/* One-Touch Quick Demo Login Buttons */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF9933] block mb-1.5">
                ⚡ Instant Highway Demo Logins (Pre-Filled):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('driver')}
                  className="bg-[#FF9933] hover:bg-[#E68A2E] text-[#0B1F3A] font-black text-[11px] uppercase tracking-wide py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Murugan (Driver)
                </button>
                <button
                  onClick={() => handleQuickLogin('farmer_dealer')}
                  className="bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-[11px] uppercase tracking-wide py-2 px-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  Arumugam (Farmer)
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setStep('language')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  confetti({ particleCount: 50, spread: 60 });
                  onCompleteLogin(selectedRole, phoneNumber);
                }}
                className="flex-1 bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Verify OTP & Enter RouteLink</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & IVR Hotline Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Toll-Free 2G IVR: <strong className="text-[#0B1F3A] font-bold">1800-458-999</strong></span>
        <span className="text-[#138808] font-bold">✓ 100% Offline Capable</span>
      </div>
    </div>
  );
};
