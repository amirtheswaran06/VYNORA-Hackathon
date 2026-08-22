import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Fuel, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Building2, 
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { FinancialProduct, FinancialApplication, LanguageCode } from '../types';
import { t } from '../services/i18n';
import confetti from 'canvas-confetti';

interface FinancialServicesViewProps {
  products: FinancialProduct[];
  applications: FinancialApplication[];
  currentLang: LanguageCode;
  onApplyForCredit: (app: Partial<FinancialApplication>) => void;
}

export const FinancialServicesView: React.FC<FinancialServicesViewProps> = ({
  products,
  applications,
  currentLang,
  onApplyForCredit,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null);
  const [requestedAmount, setRequestedAmount] = useState<number>(20000);
  const [tenureMonths, setTenureMonths] = useState<number>(3);
  const [applicantName, setApplicantName] = useState('Murugan Shanmugam');
  const [applicantPhone, setApplicantPhone] = useState('+91 98401 23456');
  const [vehicleNumber, setVehicleNumber] = useState('TN-01-AB-4589');
  const [loanPurpose, setLoanPurpose] = useState('Emergency air brake assembly replacement and hydraulic towing fee on NH45');
  const [applicationStage, setApplicationStage] = useState<'form' | 'eligibility'>('form');

  // Instant EMI estimation
  const monthlyRate = 0.01; // 1% per month nominal
  const estimatedEmi = selectedProduct?.interestRatePercent === 0 && tenureMonths <= 1
    ? Math.round(requestedAmount)
    : Math.round((requestedAmount * (1 + (monthlyRate * tenureMonths))) / tenureMonths);

  const checkEligibility = () => {
    setApplicationStage('eligibility');
  };

  const handleApply = () => {
    if (!selectedProduct) return;

    onApplyForCredit({
      id: `app-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.title,
      applicantName,
      applicantPhone,
      vehicleNumber,
      requestedAmountRs: requestedAmount,
      tenureMonths,
      monthlyEmiRs: estimatedEmi,
      purpose: loanPurpose,
      status: 'approved', // instant pre-approval for transport partners in demo
      partnerBank: selectedProduct.partnerBank,
      createdAt: 'Just now',
    });

    setSelectedProduct(null);
    setApplicationStage('form');
    confetti({ particleCount: 75, spread: 70 });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-emerald-400 font-black flex items-center justify-center border-2 border-emerald-500/40 shadow-md">
            <CreditCard className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">Driver & Fleet Financial Services</h2>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                INSTANT TRANSPORT CREDIT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Zero-paperwork emergency repair credit, FASTag fuel lines, and radial tire EMIs powered by RBI-regulated NBFC partners
            </p>
          </div>
        </div>
      </div>

      {/* CREDIT ELIGIBILITY & ACTIVE CREDIT SUMMARY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl bg-[#0B1F3A] text-white p-6 shadow-xl border border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-300">Your Transport Credit</p>
              <h3 className="text-3xl font-black mt-1">₹20,000</h3>
              <p className="text-xs text-slate-300 mt-1">Available pre-qualified limit</p>
            </div>
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <span>Eligibility score</span>
              <span className="text-emerald-300">94 / 100</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[94%] rounded-full bg-[#138808]" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">KYC</span>
              <span className="text-xs font-black text-emerald-300 block mt-1">VERIFIED</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">Credit</span>
              <span className="text-xs font-black block mt-1">₹20K</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">Decision</span>
              <span className="text-xs font-black text-emerald-300 block mt-1">INSTANT</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black block">Partner</span>
              <span className="text-xs font-black block mt-1">NBFC</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#138808]">Active Credit</p>
          {applications.length > 0 ? (
            <div className="mt-3">
              <p className="text-2xl font-black text-[#0B1F3A]">₹{applications[applications.length - 1].requestedAmountRs.toLocaleString()}</p>
              <p className="text-xs text-slate-600 font-semibold mt-1">{applications[applications.length - 1].productName}</p>
              <span className="inline-flex mt-3 text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg bg-[#138808]/15 text-[#138808]">
                ✓ {applications[applications.length - 1].status}
              </span>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-lg font-black text-[#0B1F3A]">No active credit</p>
              <p className="text-xs text-slate-600 mt-1">Choose a transport credit product below to begin.</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {prod.partnerBank}
                  </span>
                  <h3 className="font-black text-lg text-[#0B1F3A] mt-0.5">{prod.title}</h3>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#138808] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                  {prod.interestRatePercent === 0 ? '0% for 15 Days' : `${prod.interestRatePercent}% p.a.`}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 font-medium leading-relaxed">{prod.description}</p>

              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-0.5">Credit Limit</span>
                  <span className="text-base font-black text-[#0B1F3A]">₹{prod.maxAmountRs.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-0.5">Disbursal</span>
                  <span className="text-base font-black text-[#138808]">{prod.disbursalTime}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {prod.eligibility.map((el, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#138808]" />
                    {el}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Tenure: {prod.tenureOptions}</span>
              <button
                onClick={() => {
                  setSelectedProduct(prod);
                  setRequestedAmount(Math.min(25000, prod.maxAmountRs));
                }}
                className="bg-[#0B1F3A] hover:bg-[#1A365D] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Apply Now <ArrowRight className="w-3.5 h-3.5 text-[#FF9933]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Applied Facilities / Active Applications */}
      {applications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-black text-base text-[#0B1F3A] pb-3 border-b border-slate-100 uppercase tracking-tight">
            My Active Financial Facilities & Applications
          </h3>

          <div className="mt-4 space-y-3.5">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-base text-[#0B1F3A]">{app.productName}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                      ✓ {app.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 font-medium">
                    Beneficiary: <strong className="text-[#0B1F3A]">{app.applicantName}</strong> ({app.vehicleNumber}) • Purpose: {app.purpose}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Partner Bank: {app.partnerBank} • Approved on {app.createdAt}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sanctioned Amount</span>
                  <span className="text-lg font-black text-[#138808]">₹{app.requestedAmountRs.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-500 font-bold block">EMI: ₹{app.monthlyEmiRs}/mo ({app.tenureMonths} mos)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREDIT APPLICATION MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedProduct.partnerBank}</span>
                <h3 className="font-black text-lg text-[#0B1F3A]">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => { setSelectedProduct(null); setApplicationStage('form'); }}
                className="text-slate-400 hover:text-slate-600 font-black text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {applicationStage === 'form' && (
              <form onSubmit={(e) => { e.preventDefault(); checkEligibility(); }} className="mt-4 space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between font-black text-slate-700 mb-1.5">
                    <span className="uppercase tracking-wider">Required Credit Amount (₹):</span>
                    <span className="text-lg font-black text-[#138808]">₹{requestedAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max={selectedProduct.maxAmountRs}
                    step="2500"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
                    className="w-full accent-[#0B1F3A] cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                    <span>Min: ₹5,000</span>
                    <span>Max: ₹{selectedProduct.maxAmountRs.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="font-black uppercase tracking-wider text-slate-700 block mb-1.5">Repayment Tenure:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 6, 12].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTenureMonths(m)}
                        className={`p-2.5 rounded-xl border font-black text-center transition cursor-pointer ${
                          tenureMonths === m
                            ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {m} {m === 1 ? 'Month' : 'Months'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated EMI</span>
                    <p className="text-base font-black text-[#0B1F3A]">₹{estimatedEmi.toLocaleString()} / month</p>
                  </div>
                  <span className="text-[#138808] font-black uppercase text-[10px] tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    FASTag / UPI
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-black uppercase tracking-wider text-slate-700 block mb-1">Driver Name</label>
                    <input required value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="font-black uppercase tracking-wider text-slate-700 block mb-1">Mobile</label>
                    <input required value={applicantPhone} onChange={(e) => setApplicantPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-black uppercase tracking-wider text-slate-700 block mb-1">Vehicle Number</label>
                    <input required value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono uppercase font-black" />
                  </div>
                  <div>
                    <label className="font-black uppercase tracking-wider text-slate-700 block mb-1">Purpose</label>
                    <input required value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-medium" />
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => { setSelectedProduct(null); setApplicationStage('form'); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#0B1F3A] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2">
                    Check Eligibility <ArrowRight className="w-4 h-4 text-[#FF9933]" />
                  </button>
                </div>
              </form>
            )}

            {applicationStage === 'eligibility' && (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[#138808] text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#138808] mt-4">Eligibility Check Complete</p>
                  <h4 className="text-2xl font-black text-[#0B1F3A] mt-1">✓ ELIGIBLE</h4>
                  <p className="text-xs text-slate-600 mt-2">
                    You are pre-qualified for ₹{requestedAmount.toLocaleString()} through {selectedProduct.partnerBank}.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Requested</span>
                    <span className="text-lg font-black text-[#0B1F3A] block mt-1">₹{requestedAmount.toLocaleString()}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">EMI</span>
                    <span className="text-lg font-black text-[#138808] block mt-1">₹{estimatedEmi.toLocaleString()}</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Tenure</span>
                    <span className="text-lg font-black text-[#0B1F3A] block mt-1">{tenureMonths} months</span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">Disbursal</span>
                    <span className="text-lg font-black text-[#138808] block mt-1">{selectedProduct.disbursalTime}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs">
                  <div className="flex items-center gap-2 font-black text-[#0B1F3A]">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    KYC verified
                  </div>
                  <div className="flex items-center gap-2 font-black text-[#0B1F3A] mt-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    Transport partner eligible
                  </div>
                  <div className="flex items-center gap-2 font-black text-[#0B1F3A] mt-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    No-paperwork digital application
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setApplicationStage('form')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 bg-[#138808] hover:bg-[#0F6B06] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Credit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
