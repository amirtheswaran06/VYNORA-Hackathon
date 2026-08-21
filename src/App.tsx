import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { DriverView } from './components/DriverView';
import { FleetOwnerView } from './components/FleetOwnerView';
import { FarmerDealerView } from './components/FarmerDealerView';
import { RoadsideProviderView } from './components/RoadsideProviderView';
import { FinancialServicesView } from './components/FinancialServicesView';
import { AdminDashboard } from './components/AdminDashboard';
import { KeypadIVRSimulator } from './components/KeypadIVRSimulator';
import { DemoTourModal } from './components/DemoTourModal';
import { MobileAppShell } from './components/mobile/MobileAppShell';

import { 
  UserRole, 
  LanguageCode, 
  NetworkMode, 
  Driver, 
  Vehicle, 
  SOSRequest, 
  FarmerCargoRequest, 
  RoadsideService, 
  RouteTrafficInfo, 
  DriverMeshMessage, 
  FinancialProduct, 
  FinancialApplication, 
  NotificationItem, 
  OfflineSyncItem,
  IVRCallSim,
  EmergencyType
} from './types';

import { AppDataRepository } from './services/storage';
import { playSOSSiren, playBeepNotification, playTruckHorn } from './services/audioSimulator';
import confetti from 'canvas-confetti';
import { CreditCard, Map as MapIcon, ShieldCheck, Smartphone, LayoutDashboard } from 'lucide-react';

export function App() {
  // Global State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => AppDataRepository.getActiveRole());
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => AppDataRepository.getActiveLanguage());
  const [networkMode, setNetworkMode] = useState<NetworkMode>(() => AppDataRepository.getNetworkMode());
  const [activeTab, setActiveTab] = useState<'mobile' | 'main' | 'finance' | 'map'>('mobile');

  // Domain Entities
  const [drivers, setDrivers] = useState<Driver[]>(() => AppDataRepository.getDrivers());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => AppDataRepository.getVehicles());
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(() => AppDataRepository.getSOSRequests());
  const [farmerRequests, setFarmerRequests] = useState<FarmerCargoRequest[]>(() => AppDataRepository.getFarmerRequests());
  const [services, setServices] = useState<RoadsideService[]>(() => AppDataRepository.getRoadsideServices());
  const [corridors, setCorridors] = useState<RouteTrafficInfo[]>(() => AppDataRepository.getTrafficCorridors());
  const [meshMessages, setMeshMessages] = useState<DriverMeshMessage[]>(() => AppDataRepository.getMeshMessages());
  const [financialProducts, setFinancialProducts] = useState<FinancialProduct[]>(() => AppDataRepository.getFinancialProducts());
  const [financialApps, setFinancialApps] = useState<FinancialApplication[]>(() => AppDataRepository.getFinancialApplications());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => AppDataRepository.getNotifications());
  const [ivrSims, setIvrSims] = useState<IVRCallSim[]>(() => AppDataRepository.getIVRSims());
  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncItem[]>(() => AppDataRepository.getOfflineQueue());

  // UI Modals
  const [showIVRSim, setShowIVRSim] = useState<boolean>(false);
  const [showDemoTour, setShowDemoTour] = useState<boolean>(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Primary Driver Murugan
  const currentDriver = drivers[0];
  const primaryCorridor = corridors[0];

  // Helper to show transient notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state to local storage when state updates
  useEffect(() => {
    AppDataRepository.saveActiveRole(currentRole);
  }, [currentRole]);

  useEffect(() => {
    AppDataRepository.saveActiveLanguage(currentLang);
  }, [currentLang]);

  useEffect(() => {
    AppDataRepository.saveNetworkMode(networkMode);
  }, [networkMode]);

  // Handle Offline Queue Synchronization
  const handleSyncOfflineQueue = () => {
    const count = AppDataRepository.clearOfflineQueue();
    setOfflineQueue([]);
    playBeepNotification();
    showToast(`✓ Synchronized ${count || 'all'} offline operations with RouteLink cloud servers!`);
    confetti({ particleCount: 50, spread: 60 });
  };

  // Trigger Emergency SOS
  const handleTriggerSOS = (emergencyType: EmergencyType = 'breakdown', description: string = 'Air brake failure and rising engine temperature on NH45 KM 165') => {
    const newSOS: SOSRequest = {
      id: `sos-${Date.now()}`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      driverPhone: currentDriver.phone,
      vehicleNumber: currentDriver.vehicleNumber,
      vehicleModel: currentDriver.vehicleModel,
      vehicleType: currentDriver.vehicleType || 'heavy_truck',
      emergencyType,
      description,
      location: {
        lat: 11.9401,
        lng: 79.4861,
        address: 'NH45 KM 165, Near Villupuram Bypass Shoulder',
        highway: 'NH45 (Chennai-Trichy)',
      },
      status: 'requested',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nearbyDriversAlertedCount: 14,
      towingServicesAlertedCount: 3,
      acceptedBy: {
        providerId: 'srv-02',
        providerName: 'Kaveri Heavy Highway Recovery & Towing',
        phone: '+91 98422 11990',
        serviceType: 'Hydraulic Heavy Crane Unit',
        vehicleType: 'Tata 2518 Heavy Recovery Crane',
        distanceKm: 4.2,
        etaMinutes: 11,
      }
    };

    const updated = [newSOS, ...sosRequests];
    setSosRequests(updated);
    AppDataRepository.saveSOSRequests(updated);

    // Update vehicle status
    const updatedVehicles = vehicles.map(v => v.id === 'veh-01' ? { ...v, status: 'breakdown' as const } : v);
    setVehicles(updatedVehicles);
    AppDataRepository.saveVehicles(updatedVehicles);

    // If offline, queue action
    if (networkMode !== 'online') {
      AppDataRepository.queueAction('TRIGGER_SOS', newSOS);
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    // Add alert notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🚨 Highway SOS Broadcast Sent',
      message: `Emergency SOS dispatched for ${currentDriver.vehicleNumber} on NH45. Kaveri Towing unit alerted.`,
      timestamp: 'Just now',
      priority: 'urgent',
      read: false,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    AppDataRepository.saveNotifications(updatedNotifs);

    playSOSSiren();
    showToast('🚨 SOS Emergency Broadcast active: 14 drivers & Kaveri Recovery alerted!');
  };

  // Resolve Emergency SOS
  const handleResolveSOS = (sosId: string) => {
    const updated = sosRequests.map(s => s.id === sosId ? { ...s, status: 'completed' as const } : s);
    setSosRequests(updated);
    AppDataRepository.saveSOSRequests(updated);

    const updatedVehicles = vehicles.map(v => v.id === 'veh-01' ? { ...v, status: 'moving' as const } : v);
    setVehicles(updatedVehicles);
    AppDataRepository.saveVehicles(updatedVehicles);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('RESOLVE_SOS', { sosId });
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    showToast('✓ SOS incident marked resolved. Vehicle TN-01-AB-4589 back on duty.');
    confetti({ particleCount: 60, spread: 70 });
  };

  // Accept Bypass Route
  const handleAcceptBypassRoute = () => {
    const updatedCorridors = corridors.map(c => {
      if (c.corridorId === 'corridor-01') {
        return {
          ...c,
          trafficAlert: 'Rerouted via SH-09 Gingee Rural Bypass. Congestion avoided.',
          averageSpeedKmh: 68,
        };
      }
      return c;
    });
    setCorridors(updatedCorridors);
    AppDataRepository.saveTrafficCorridors(updatedCorridors);

    // Update driver ETA
    const updatedDrivers = drivers.map(d => {
      if (d.id === 'drv-01') {
        return {
          ...d,
          currentRoute: {
            ...d.currentRoute,
            eta: '20:12 PM (Saved 38 mins)',
            highway: 'SH-09 Rural Bypass',
          }
        };
      }
      return d;
    });
    setDrivers(updatedDrivers);
    AppDataRepository.saveDrivers(updatedDrivers);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('REROUTE_BYPASS', { corridorId: 'corridor-01' });
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    showToast('✓ SH-09 Gingee Rural Bypass active! Saving 38 minutes on NH45 trip.');
  };

  // Accept Farmer Cargo Match
  const handleAcceptCargo = (cargoId: string = 'cargo-101') => {
    const updatedFarmerRequests = farmerRequests.map(c => {
      if (c.id === cargoId || c.id === 'cargo-101') {
        return {
          ...c,
          status: 'accepted' as const,
          matchedDriverId: currentDriver.id,
          matchedDriverName: currentDriver.name,
          matchedDriverPhone: currentDriver.phone,
          matchedVehicleNumber: currentDriver.vehicleNumber,
        };
      }
      return c;
    });
    setFarmerRequests(updatedFarmerRequests);
    AppDataRepository.saveFarmerRequests(updatedFarmerRequests);

    // Update driver available capacity
    const updatedDrivers = drivers.map(d => {
      if (d.id === 'drv-01') {
        return {
          ...d,
          availableCapacityTons: Math.max(0, d.availableCapacityTons - 1.5),
        };
      }
      return d;
    });
    setDrivers(updatedDrivers);
    AppDataRepository.saveDrivers(updatedDrivers);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('ACCEPT_CARGO_MATCH', { cargoId });
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    showToast('✓ 1.5T Fresh Tomatoes loaded! Extra ₹2,400 revenue added to trip manifest.');
  };

  // Post Highway Mesh Message
  const handleSendMeshMessage = (message: string, category: any) => {
    const newMsg: DriverMeshMessage = {
      id: `mesh-${Date.now()}`,
      senderId: currentDriver.id,
      senderName: currentDriver.name,
      senderVehicleNumber: currentDriver.vehicleNumber,
      category,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kmMarker: 'NH45 KM 165',
    };
    const updated = [newMsg, ...meshMessages];
    setMeshMessages(updated);
    AppDataRepository.saveMeshMessages(updated);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('POST_MESH_MESSAGE', newMsg);
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }
  };

  // Create Farmer Request
  const handleCreateFarmerRequest = (newReq: Partial<FarmerCargoRequest>) => {
    const fullReq: FarmerCargoRequest = {
      id: newReq.id || `cargo-${Date.now()}`,
      farmerId: newReq.farmerId || 'fmr-01',
      farmerName: newReq.farmerName || 'Arumugam P.',
      farmerPhone: newReq.farmerPhone || '+91 94420 55123',
      pickupLocation: newReq.pickupLocation || {
        lat: 11.7010,
        lng: 79.3120,
        address: 'Ulundurpet Cooperative Mandi',
        highway: 'NH45',
      },
      dropoffLocation: newReq.dropoffLocation || {
        lat: 10.7905,
        lng: 78.7047,
        address: 'Gandhi Market, Tiruchirappalli',
        highway: 'NH45',
      },
      produceCategory: newReq.produceCategory || 'vegetables',
      produceName: newReq.produceName || 'Fresh Tomatoes',
      quantityTons: newReq.quantityTons || 1.5,
      maxBudgetRs: newReq.maxBudgetRs || 3000,
      requiredByDate: newReq.requiredByDate || 'Today',
      status: 'matched',
      matchedVehicleNumber: 'TN-01-AB-4589',
      matchedDriverName: 'Murugan Shanmugam',
      matchedDriverPhone: '+91 98401 23456',
      estimatedCostRs: newReq.estimatedCostRs || 2400,
      savingsVsSoloTruckPercent: newReq.savingsVsSoloTruckPercent || 38,
      specialInstructions: newReq.specialInstructions || '',
      createdAt: 'Just now',
    };

    const updated = [fullReq, ...farmerRequests];
    setFarmerRequests(updated);
    AppDataRepository.saveFarmerRequests(updated);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('CREATE_FARMER_REQUEST', fullReq);
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    showToast('✓ Agricultural transport request posted & matched with passing lorry TN-01-AB-4589!');
  };

  // Apply for credit
  const handleApplyForCredit = (app: Partial<FinancialApplication>) => {
    const fullApp: FinancialApplication = {
      id: app.id || `app-${Date.now()}`,
      productId: app.productId || 'fin-01',
      productName: app.productName || 'Emergency Repair & Towing Credit',
      applicantName: app.applicantName || 'Murugan Shanmugam',
      applicantPhone: app.applicantPhone || '+91 98401 23456',
      vehicleNumber: app.vehicleNumber || 'TN-01-AB-4589',
      requestedAmountRs: app.requestedAmountRs || 20000,
      tenureMonths: app.tenureMonths || 3,
      monthlyEmiRs: app.monthlyEmiRs || 6800,
      purpose: app.purpose || 'Emergency repair',
      status: 'approved',
      partnerBank: app.partnerBank || 'Cholamandalam Transport Finance',
      createdAt: 'Just now',
    };

    const updated = [fullApp, ...financialApps];
    setFinancialApps(updated);
    AppDataRepository.saveFinancialApplications(updated);

    if (networkMode !== 'online') {
      AppDataRepository.queueAction('APPLY_CREDIT', fullApp);
      setOfflineQueue(AppDataRepository.getOfflineQueue());
    }

    showToast(`✓ Credit facility of ₹${fullApp.requestedAmountRs.toLocaleString()} sanctioned instantly!`);
  };

  // Add new fleet vehicle
  const handleAddNewVehicle = (v: Partial<Vehicle>) => {
    const fullVeh = v as Vehicle;
    const updated = [fullVeh, ...vehicles];
    setVehicles(updated);
    AppDataRepository.saveVehicles(updated);
    showToast(`✓ Vehicle ${fullVeh.vehicleNumber} registered to Sri Balaji Roadlines fleet!`);
  };

  // Roadside status update
  const handleUpdateSOSStatus = (sosId: string, status: any, providerDetails?: any) => {
    const updated = sosRequests.map(s => {
      if (s.id === sosId) {
        return {
          ...s,
          status,
          acceptedBy: providerDetails || s.acceptedBy,
        };
      }
      return s;
    });
    setSosRequests(updated);
    AppDataRepository.saveSOSRequests(updated);

    if (status === 'completed') {
      const updatedVehicles = vehicles.map(v => v.id === 'veh-01' ? { ...v, status: 'moving' as const } : v);
      setVehicles(updatedVehicles);
      AppDataRepository.saveVehicles(updatedVehicles);
    }

    showToast(`✓ SOS Status updated to: ${status.toUpperCase()}`);
  };

  // DTMF action from Keypad simulator
  const handleTriggerActionFromDTMF = (key: string, callType: string) => {
    if (callType === 'traffic_alert' && key === '1') {
      handleAcceptBypassRoute();
    } else if (callType === 'cargo_match' && key === '1') {
      handleAcceptCargo();
    }
  };

  // Reset demo
  const handleResetData = () => {
    AppDataRepository.resetToDemoDefault();
    setDrivers(AppDataRepository.getDrivers());
    setVehicles(AppDataRepository.getVehicles());
    setSosRequests(AppDataRepository.getSOSRequests());
    setFarmerRequests(AppDataRepository.getFarmerRequests());
    setServices(AppDataRepository.getRoadsideServices());
    setCorridors(AppDataRepository.getTrafficCorridors());
    setMeshMessages(AppDataRepository.getMeshMessages());
    setFinancialApps([]);
    setNotifications(AppDataRepository.getNotifications());
    setOfflineQueue([]);
    showToast('✓ Demo environment restored to initial state.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col font-sans antialiased">
      {/* Universal Top Navigation & Role Bar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        networkMode={networkMode}
        onChangeNetworkMode={setNetworkMode}
        pendingSyncCount={offlineQueue.length}
        onSyncOfflineQueue={handleSyncOfflineQueue}
        notifications={notifications}
        onOpenIVRSim={() => setShowIVRSim(true)}
        onStartDemoTour={() => setShowDemoTour(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        {/* Navigation Sub-Tabs: Mobile Driver Suite vs Multi-Role Dashboard vs Highway Radar vs Finance */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                activeTab === 'mobile'
                  ? 'bg-[#0B1F3A] text-[#FF9933] shadow-md border-b-2 border-[#FF9933]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#FF9933]" />
              📱 Mobile App UI (6 Screens)
            </button>

            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                activeTab === 'main'
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {currentRole === 'driver' && '🚛 Driver Console'}
              {currentRole === 'fleet_owner' && '🏢 Fleet Console'}
              {currentRole === 'farmer_dealer' && '🌾 Farmer Portal'}
              {currentRole === 'roadside_provider' && '🛠️ Roadside Towing'}
              {currentRole === 'admin' && '📊 Admin Hub'}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                activeTab === 'map'
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#FF9933]" />
              Highway Radar (NH45)
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                activeTab === 'finance'
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#138808]" />
              Driver & Fleet Micro-Credit
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-bold hidden md:flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">CORRIDOR:</span>
            <span className="bg-slate-200 text-[#0B1F3A] font-black px-2.5 py-0.5 rounded-md">
              NH45 Chennai ➔ Madurai (462 KM)
            </span>
          </div>
        </div>

        {/* Mobile-First Driver Application Suite (Dedicated 6-Screen Architecture) */}
        {activeTab === 'mobile' && (
          <MobileAppShell
            driver={currentDriver}
            trafficInfo={primaryCorridor}
            services={services}
            sosRequests={sosRequests}
            farmerRequests={farmerRequests}
            meshMessages={meshMessages}
            currentLang={currentLang}
            networkMode={networkMode}
            onSelectLang={setCurrentLang}
            onChangeNetworkMode={setNetworkMode}
            onTriggerSOS={handleTriggerSOS}
            onResolveSOS={handleResolveSOS}
            onAcceptBypassRoute={handleAcceptBypassRoute}
            onAcceptCargoLoad={handleAcceptCargo}
            onSendMeshMessage={handleSendMeshMessage}
            onResetData={handleResetData}
            onOpenIVRSim={() => setShowIVRSim(true)}
            onStartDemoTour={() => setShowDemoTour(true)}
          />
        )}

        {/* Live Interactive Map Radar (Always visible on Map tab or as companion overview) */}
        {activeTab === 'map' && (
          <InteractiveMap
            vehicles={vehicles}
            services={services}
            sosRequests={sosRequests}
            farmerRequests={farmerRequests}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(veh) => setSelectedVehicleId(veh.id)}
          />
        )}

        {/* Primary Views depending on Role & Active Subtab */}
        {activeTab === 'main' && (
          <>
            {/* Embedded Mini Radar on driver & fleet views for instant highway context */}
            <InteractiveMap
              vehicles={vehicles}
              services={services}
              sosRequests={sosRequests}
              farmerRequests={farmerRequests}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={(veh) => setSelectedVehicleId(veh.id)}
            />

            {currentRole === 'driver' && (
              <DriverView
                driver={currentDriver}
                trafficInfo={primaryCorridor}
                services={services}
                sosRequests={sosRequests}
                farmerRequests={farmerRequests}
                meshMessages={meshMessages}
                currentLang={currentLang}
                onTriggerSOS={handleTriggerSOS}
                onResolveSOS={handleResolveSOS}
                onAcceptBypassRoute={handleAcceptBypassRoute}
                onAcceptCargoLoad={handleAcceptCargo}
                onSendMeshMessage={handleSendMeshMessage}
                onOpenIVRSim={() => setShowIVRSim(true)}
              />
            )}

            {currentRole === 'fleet_owner' && (
              <FleetOwnerView
                vehicles={vehicles}
                sosRequests={sosRequests}
                farmerRequests={farmerRequests}
                currentLang={currentLang}
                onSelectVehicle={(v) => setSelectedVehicleId(v.id)}
                onAddNewVehicle={handleAddNewVehicle}
              />
            )}

            {currentRole === 'farmer_dealer' && (
              <FarmerDealerView
                farmerRequests={farmerRequests}
                vehicles={vehicles}
                currentLang={currentLang}
                onCreateCargoRequest={handleCreateFarmerRequest}
              />
            )}

            {currentRole === 'roadside_provider' && (
              <RoadsideProviderView
                sosRequests={sosRequests}
                services={services}
                currentLang={currentLang}
                onUpdateSOSStatus={handleUpdateSOSStatus}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                drivers={drivers}
                vehicles={vehicles}
                sosRequests={sosRequests}
                farmerRequests={farmerRequests}
                services={services}
                corridors={corridors}
                offlineQueue={offlineQueue}
                currentLang={currentLang}
                onSyncOfflineQueue={handleSyncOfflineQueue}
                onResetData={handleResetData}
              />
            )}
          </>
        )}

        {activeTab === 'finance' && (
          <FinancialServicesView
            products={financialProducts}
            applications={financialApps}
            currentLang={currentLang}
            onApplyForCredit={handleApplyForCredit}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1F3A] border-t border-white/10 px-4 sm:px-8 py-4 text-[10px] text-white/50 tracking-[0.2em] font-black uppercase shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-white font-black tracking-tightest text-xs">ROUTELINK PLATFORM</span>
            <span className="h-3 w-px bg-white/20 hidden sm:inline" />
            <span className="text-[#138808]">FINANCIAL ASSISTANCE READY</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span>IVR / KEYPAD 2G MODE ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#138808]" />
              <span>DATA SAVER READY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Keypad Phone & DTMF IVR Simulator Modal */}
      <KeypadIVRSimulator
        isOpen={showIVRSim}
        onClose={() => setShowIVRSim(false)}
        ivrSims={ivrSims}
        onTriggerActionFromDTMF={handleTriggerActionFromDTMF}
      />

      {/* 22-Step Guided Demo Tour Modal */}
      <DemoTourModal
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
        onSelectRole={setCurrentRole}
        onSetNetworkMode={setNetworkMode}
        onTriggerSOS={() => handleTriggerSOS()}
        onAcceptBypass={handleAcceptBypassRoute}
        onAcceptCargo={() => handleAcceptCargo()}
        onOpenIVR={() => setShowIVRSim(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B1F3A] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-[#FF9933] animate-slideUp flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
