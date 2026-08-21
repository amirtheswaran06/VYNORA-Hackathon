import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  MessageSquare, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Languages,
  RotateCcw
} from 'lucide-react';
import { IVRCallSim, LanguageCode } from '../types';
import { playDTMFTone, speakIVRText, stopSpeaking } from '../services/audioSimulator';

interface KeypadIVRSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  ivrSims: IVRCallSim[];
  onTriggerActionFromDTMF: (key: string, callType: string) => void;
}

export const KeypadIVRSimulator: React.FC<KeypadIVRSimulatorProps> = ({
  isOpen,
  onClose,
  ivrSims,
  onTriggerActionFromDTMF,
}) => {
  const [activeTab, setActiveTab] = useState<'call' | 'sms'>('call');
  const [selectedCall, setSelectedCall] = useState<IVRCallSim>(ivrSims[0]);
  const [callActive, setCallActive] = useState<boolean>(false);
  const [pressedKeyHistory, setPressedKeyHistory] = useState<string[]>([]);
  const [lcdMessage, setLcdMessage] = useState<string>('ROUTELINK IVR READY');

  useEffect(() => {
    if (ivrSims.length > 0) {
      setSelectedCall(ivrSims[0]);
    }
  }, [ivrSims]);

  if (!isOpen) return null;

  const handleStartCall = (sim: IVRCallSim) => {
    setSelectedCall(sim);
    setCallActive(true);
    setPressedKeyHistory([]);
    setLcdMessage(`CALL CONNECTED: ${sim.callerId}`);
    // Play voice audio
    speakIVRText(sim.promptAudioText, sim.language === 'ta' ? 'ta' : sim.language === 'hi' ? 'hi' : 'en');
  };

  const handleEndCall = () => {
    setCallActive(false);
    stopSpeaking();
    setLcdMessage('CALL TERMINATED');
  };

  const handleKeyPress = (key: string) => {
    playDTMFTone(key);
    setPressedKeyHistory(prev => [...prev, key]);
    setLcdMessage(`KEY PRESSED: [ ${key} ]`);

    if (callActive && selectedCall) {
      if (key === '1') {
        setLcdMessage('OPTION 1 ACCEPTED! EXECUTING ACTION...');
        onTriggerActionFromDTMF('1', selectedCall.eventType);
        setTimeout(() => {
          setCallActive(false);
          stopSpeaking();
        }, 1500);
      } else if (key === '2') {
        setLcdMessage('OPTION 2 DECLINED / CONTINUING...');
        setTimeout(() => {
          setCallActive(false);
          stopSpeaking();
        }, 1200);
      } else if (key === '9') {
        setLcdMessage('REPLAYING AUDIO MESSAGE...');
        speakIVRText(selectedCall.promptAudioText, selectedCall.language === 'ta' ? 'ta' : selectedCall.language === 'hi' ? 'hi' : 'en');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-[#08182B] text-slate-100 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-[#1E3A5F] flex flex-col md:flex-row gap-6 max-h-[95vh] overflow-y-auto">
        
        {/* Left: Vintage Keypad Mobile Device Simulation */}
        <div className="w-full md:w-72 bg-[#102035] rounded-3xl p-4 border-4 border-[#1D3557] shadow-2xl flex flex-col items-center select-none">
          {/* Phone Earpiece */}
          <div className="w-16 h-2 rounded-full bg-slate-800 mb-3 border border-slate-700" />

          {/* Monochrome Amber/Green LCD Screen */}
          <div className="w-full h-32 bg-[#4A5D23] rounded-xl p-2.5 border-2 border-[#2C3814] shadow-inner font-mono text-[11px] text-[#142007] flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center border-b border-[#3A4A1C] pb-0.5 text-[9px] font-bold">
              <span>📶 2G BSNL RURAL</span>
              <span>100% 🔋</span>
            </div>

            <div className="my-auto py-1 font-bold text-center leading-tight">
              {lcdMessage}
            </div>

            <div className="border-t border-[#3A4A1C] pt-0.5 text-[9px] flex justify-between">
              <span>{callActive ? '00:14' : 'ROUTELINK'}</span>
              <span>{pressedKeyHistory.length > 0 ? `DTMF: ${pressedKeyHistory.slice(-4).join('')}` : 'IVR / SMS'}</span>
            </div>
          </div>

          {/* Navigation D-Pad */}
          <div className="my-3 flex items-center justify-between w-full px-2">
            <button
              onClick={() => handleStartCall(selectedCall)}
              disabled={callActive}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-90 text-white transition cursor-pointer disabled:opacity-50"
              title="Answer / Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center font-bold text-xs text-slate-300">
              OK
            </div>
            <button
              onClick={handleEndCall}
              disabled={!callActive}
              className="p-2 rounded-xl bg-rose-700 hover:bg-rose-600 active:scale-90 text-white transition cursor-pointer disabled:opacity-50"
              title="End Call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

          {/* 3x4 DTMF Numeric Keypad Matrix */}
          <div className="grid grid-cols-3 gap-2 w-full mt-1">
            {[
              { k: '1', sub: '.,' },
              { k: '2', sub: 'ABC' },
              { k: '3', sub: 'DEF' },
              { k: '4', sub: 'GHI' },
              { k: '5', sub: 'JKL' },
              { k: '6', sub: 'MNO' },
              { k: '7', sub: 'PQRS' },
              { k: '8', sub: 'TUV' },
              { k: '9', sub: 'WXYZ' },
              { k: '*', sub: 'Rpt' },
              { k: '0', sub: ' ' },
              { k: '#', sub: 'End' },
            ].map(btn => (
              <button
                key={btn.k}
                onClick={() => handleKeyPress(btn.k)}
                className="bg-[#1A314D] hover:bg-[#25466E] active:bg-[#0B1A2C] active:scale-90 text-slate-100 p-2 rounded-xl border border-slate-700 flex flex-col items-center justify-center transition cursor-pointer shadow-sm"
              >
                <span className="font-extrabold text-sm">{btn.k}</span>
                <span className="text-[8px] text-slate-400 font-mono uppercase">{btn.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Simulation Controls & Script Visualizer */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-white">Feature Phone IVR & SMS Telecom Hub</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF9933] text-[#0B1F3A]">
                    RURAL TELECOM ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allows non-smartphone commercial lorry drivers to receive highway updates and accept empty-loads via voice & DTMF
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white font-bold text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub Tabs: Voice Calls vs SMS Inbox */}
            <div className="flex gap-2 my-3">
              <button
                onClick={() => setActiveTab('call')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'call'
                    ? 'bg-[#FF9933] text-[#0B1F3A]'
                    : 'bg-[#132A46] text-slate-300 hover:bg-[#1A365D]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Simulate Automated IVR Voice Calls ({ivrSims.length})
              </button>
              <button
                onClick={() => setActiveTab('sms')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'sms'
                    ? 'bg-[#FF9933] text-[#0B1F3A]'
                    : 'bg-[#132A46] text-slate-300 hover:bg-[#1A365D]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                SMS Alert Broadcasts
              </button>
            </div>

            {/* List of Simulated Calls */}
            {activeTab === 'call' ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {ivrSims.map((sim) => (
                  <div
                    key={sim.id}
                    className={`p-3 rounded-xl border transition cursor-pointer text-xs ${
                      selectedCall?.id === sim.id
                        ? 'bg-[#16355C] border-[#FF9933]'
                        : 'bg-[#10243C] border-slate-700 hover:bg-[#142C4B]'
                    }`}
                    onClick={() => handleStartCall(sim)}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#FF9933] flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        {sim.callerId} ({sim.language.toUpperCase()})
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Click to Trigger Call
                      </span>
                    </div>

                    <p className="text-slate-200 mt-1 font-medium">{sim.promptAudioText}</p>

                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Options: <strong>1: Accept / Reroute</strong> • <strong>2: Ignore</strong> • <strong>9: Replay</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                <div className="p-3 rounded-xl bg-[#10243C] border border-slate-700">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>From: VK-ROUTELNK</span>
                    <span className="text-[10px] text-slate-400">14:15 PM</span>
                  </div>
                  <p className="text-slate-200 mt-1">
                    RouteLink Alert: Vikravandi NH45 jam. Take SH-09 Gingee bypass. Save 38m. Free helpline: 1800-425-9900.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#10243C] border border-slate-700">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>From: VK-ROUTELNK</span>
                    <span className="text-[10px] text-slate-400">13:40 PM</span>
                  </div>
                  <p className="text-slate-200 mt-1">
                    Cargo Match: Farmer Arumugam at Ulundurpet has 1.5T Tomatoes for Trichy. Extra Rs.2400. Reply YES to accept.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Web Audio DTMF Synthesizer & SpeechSynthesis Active
            </span>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Done & Close Simulator
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
