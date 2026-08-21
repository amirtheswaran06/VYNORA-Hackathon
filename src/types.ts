export type UserRole = 'driver' | 'fleet_owner' | 'farmer_dealer' | 'roadside_provider' | 'admin';

export type PhoneType = 'smartphone' | 'keypad';

export type LanguageCode = 'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te';

export type VehicleType = 
  | 'heavy_truck' 
  | 'medium_lorry' 
  | 'mini_truck' 
  | 'commercial_bus' 
  | 'tempo_traveller' 
  | 'tanker';

export type VehicleStatus = 
  | 'active' 
  | 'moving' 
  | 'stopped' 
  | 'breakdown' 
  | 'offline' 
  | 'available_capacity' 
  | 'trip_completed';

export type EmergencyType = 
  | 'breakdown' 
  | 'accident' 
  | 'medical' 
  | 'security' 
  | 'other';

export type SOSStatus = 
  | 'requested' 
  | 'notified' 
  | 'accepted' 
  | 'en_route' 
  | 'completed' 
  | 'cancelled';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  highway?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  phoneType: PhoneType;
  vehicleNumber: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  currentRoute: {
    origin: string;
    destination: string;
    highway: string;
    distanceKm: number;
    completedKm: number;
    eta: string;
  };
  preferredLanguage: LanguageCode;
  status: 'on_duty' | 'resting' | 'breakdown' | 'emergency';
  availableCapacityTons: number;
  maxCapacityTons: number;
  location: GeoLocation;
  lastActive: string;
  rating: number;
  fleetOwnerId?: string;
  fleetOwnerName?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  type: VehicleType;
  fleetOwnerId: string;
  fleetOwnerName: string;
  assignedDriverId: string;
  assignedDriverName: string;
  driverPhone: string;
  currentRoute: {
    origin: string;
    destination: string;
    viaHighway: string;
    distanceTotalKm: number;
    distanceCoveredKm: number;
    estimatedArrival: string;
  };
  status: VehicleStatus;
  speedKmh: number;
  fuelLevelPercent: number;
  adBlueLevelPercent: number;
  mileageKmPerL: number;
  lastKnownLocation: GeoLocation;
  capacityTotalTons: number;
  capacityAvailableTons: number;
  currentCargo?: string;
  tripStart: string;
  sosAlertActive?: boolean;
}

export interface SOSRequest {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleModel?: string;
  vehicleType: VehicleType;
  location: GeoLocation;
  emergencyType: EmergencyType;
  description: string;
  status: SOSStatus;
  timestamp: string;
  notifiedCount?: number;
  nearbyDriversAlertedCount?: number;
  towingServicesAlertedCount?: number;
  acceptedBy?: {
    providerId: string;
    providerName: string;
    phone: string;
    serviceType: string;
    vehicleType: string;
    distanceKm: number;
    etaMinutes: number;
  };
  resolutionNotes?: string;
  resolvedAt?: string;
}

export type ProduceCategory = 'vegetables' | 'fruits' | 'grains' | 'agricultural' | 'local_goods';

export interface FarmerCargoRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  pickupLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  produceCategory: ProduceCategory;
  produceName: string;
  quantityTons: number;
  maxBudgetRs: number;
  requiredByDate: string;
  status: 'pending' | 'matched' | 'accepted' | 'in_transit' | 'completed';
  matchedDriverId?: string;
  matchedVehicleId?: string;
  matchedDriverName?: string;
  matchedDriverPhone?: string;
  matchedVehicleNumber?: string;
  estimatedCostRs: number;
  savingsVsSoloTruckPercent: number;
  specialInstructions?: string;
  createdAt: string;
}

export type RoadsideServiceType = 
  | 'rest_area' 
  | 'diesel_bunk' 
  | 'adblue_seller' 
  | 'repair_garage' 
  | 'towing_service' 
  | 'emergency_medical';

export interface RoadsideService {
  id: string;
  name: string;
  type: RoadsideServiceType;
  location: GeoLocation;
  phone: string;
  isOpen: boolean;
  hours: string;
  amenities: string[];
  distanceKm: number;
  rating: number;
  verifiedPartner: boolean;
  ratesDescription?: string;
  fuelPrices?: {
    dieselRsPerL: number;
    adblueRsPerL: number;
  };
}

export interface RouteTrafficInfo {
  routeId?: string;
  corridorId?: string;
  corridorName: string;
  highway?: string;
  highwayNumber?: string;
  fromCity?: string;
  toCity?: string;
  distanceKm?: number;
  distanceTotalKm?: number;
  standardDurationMinutes?: number;
  currentDelayMinutes?: number;
  averageSpeedKmh?: number;
  congestionLevel?: 'smooth' | 'moderate' | 'heavy' | 'jammed';
  trafficAlert?: string;
  cause?: string;
  alternativeRoute?: {
    name: string;
    highway?: string;
    distanceKm?: number;
    timeMinutes?: number;
    timeSavedMinutes: number;
    tollEstimateRs?: number;
    roadCondition?: string;
  };
}

export interface DriverMeshMessage {
  id: string;
  senderId?: string;
  senderDriverId?: string;
  senderName: string;
  senderVehicleNumber: string;
  corridor?: string;
  message: string;
  category: 'traffic_alert' | 'road_hazard' | 'police_check' | 'dhaba_recommendation' | 'general_chat' | 'breakdown_alert';
  timestamp: string;
  voiceNoteDurationSec?: number;
  kmMarker?: string;
}

export interface FinancialProduct {
  id: string;
  partnerName?: string;
  partnerBank?: string;
  partnerLogoUrl?: string;
  title: string;
  category?: 'emergency_repair' | 'fuel_fastag_credit' | 'tire_financing' | 'commercial_insurance' | 'working_capital';
  description?: string;
  interestRatePercent?: number;
  disbursalTime?: string;
  tenureOptions?: string;
  eligibility?: string[];
  maxAmountRs: number;
  interestRateStr?: string;
  tenureDisplay?: string;
  instantApproval?: boolean;
  features?: string[];
  eligibilityCriteria?: string;
  approvalSpeed?: string;
}

export interface FinancialApplication {
  id: string;
  applicantId?: string;
  applicantName: string;
  applicantPhone?: string;
  applicantRole?: UserRole;
  phone?: string;
  vehicleNumber: string;
  productId: string;
  productName?: string;
  productTitle?: string;
  requestedAmountRs: number;
  tenureMonths?: number;
  monthlyEmiRs?: number;
  purpose: string;
  status: 'submitted' | 'under_partner_review' | 'approved' | 'disbursed' | string;
  partnerName?: string;
  partnerBank?: string;
  createdAt?: string;
  submittedAt?: string;
  approvalReference?: string;
}

export interface NotificationItem {
  id: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type?: 'sos' | 'traffic' | 'cargo' | 'fleet' | 'financial' | 'system';
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  actionUrl?: string;
}

export interface IVRCallSim {
  id: string;
  callerId?: string;
  driverPhone?: string;
  driverName?: string;
  eventType?: string;
  callType?: 'sos_alert' | 'traffic_warning' | 'cargo_dispatch' | 'towing_arrival' | string;
  promptAudioText?: string;
  scriptPrompt?: string;
  scriptTamil?: string;
  scriptHindi?: string;
  language?: LanguageCode | string;
  dtmfOptions?: { key: string; label: string; action: string }[];
  status?: 'ringing' | 'connected' | 'completed' | string;
  timestamp?: string;
}

export interface OfflineSyncItem {
  id: string;
  actionType: 'create_sos' | 'update_location' | 'cargo_request' | 'accept_load' | 'send_driver_alert' | string;
  payload: any;
  queuedAt: string;
  synced: boolean;
}

export type NetworkMode = 'online' | '2g_rural' | 'offline';
