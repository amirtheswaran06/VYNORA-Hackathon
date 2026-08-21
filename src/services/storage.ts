import { 
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
  NetworkMode,
  UserRole,
  LanguageCode
} from '../types';

import {
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_TRAFFIC_CORRIDORS,
  INITIAL_SOS_REQUESTS,
  INITIAL_FARMER_REQUESTS,
  INITIAL_ROADSIDE_SERVICES,
  INITIAL_MESH_MESSAGES,
  INITIAL_FINANCIAL_PRODUCTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_IVR_SIMS
} from '../data/mockData';

const STORAGE_KEYS = {
  DRIVERS: 'routelink_drivers',
  VEHICLES: 'routelink_vehicles',
  SOS_REQUESTS: 'routelink_sos_requests',
  FARMER_REQUESTS: 'routelink_farmer_requests',
  ROADSIDE_SERVICES: 'routelink_roadside_services',
  TRAFFIC_CORRIDORS: 'routelink_traffic_corridors',
  MESH_MESSAGES: 'routelink_mesh_messages',
  FINANCIAL_PRODUCTS: 'routelink_financial_products',
  FINANCIAL_APPS: 'routelink_financial_apps',
  NOTIFICATIONS: 'routelink_notifications',
  IVR_SIMS: 'routelink_ivr_sims',
  OFFLINE_QUEUE: 'routelink_offline_queue',
  ACTIVE_ROLE: 'routelink_active_role',
  ACTIVE_LANG: 'routelink_active_lang',
  NETWORK_MODE: 'routelink_network_mode',
  DATA_SAVER: 'routelink_data_saver',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage quota exceeded or error', e);
  }
}

export class AppDataRepository {
  // State getters
  static getDrivers(): Driver[] {
    return getStored<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  }

  static saveDrivers(drivers: Driver[]): void {
    setStored(STORAGE_KEYS.DRIVERS, drivers);
  }

  static getVehicles(): Vehicle[] {
    return getStored<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  static saveVehicles(vehicles: Vehicle[]): void {
    setStored(STORAGE_KEYS.VEHICLES, vehicles);
  }

  static getSOSRequests(): SOSRequest[] {
    return getStored<SOSRequest[]>(STORAGE_KEYS.SOS_REQUESTS, INITIAL_SOS_REQUESTS);
  }

  static saveSOSRequests(requests: SOSRequest[]): void {
    setStored(STORAGE_KEYS.SOS_REQUESTS, requests);
  }

  static getFarmerRequests(): FarmerCargoRequest[] {
    return getStored<FarmerCargoRequest[]>(STORAGE_KEYS.FARMER_REQUESTS, INITIAL_FARMER_REQUESTS);
  }

  static saveFarmerRequests(requests: FarmerCargoRequest[]): void {
    setStored(STORAGE_KEYS.FARMER_REQUESTS, requests);
  }

  static getRoadsideServices(): RoadsideService[] {
    return getStored<RoadsideService[]>(STORAGE_KEYS.ROADSIDE_SERVICES, INITIAL_ROADSIDE_SERVICES);
  }

  static saveRoadsideServices(services: RoadsideService[]): void {
    setStored(STORAGE_KEYS.ROADSIDE_SERVICES, services);
  }

  static getTrafficCorridors(): RouteTrafficInfo[] {
    return getStored<RouteTrafficInfo[]>(STORAGE_KEYS.TRAFFIC_CORRIDORS, INITIAL_TRAFFIC_CORRIDORS);
  }

  static saveTrafficCorridors(corridors: RouteTrafficInfo[]): void {
    setStored(STORAGE_KEYS.TRAFFIC_CORRIDORS, corridors);
  }

  static getMeshMessages(): DriverMeshMessage[] {
    return getStored<DriverMeshMessage[]>(STORAGE_KEYS.MESH_MESSAGES, INITIAL_MESH_MESSAGES);
  }

  static saveMeshMessages(messages: DriverMeshMessage[]): void {
    setStored(STORAGE_KEYS.MESH_MESSAGES, messages);
  }

  static getFinancialProducts(): FinancialProduct[] {
    return getStored<FinancialProduct[]>(STORAGE_KEYS.FINANCIAL_PRODUCTS, INITIAL_FINANCIAL_PRODUCTS);
  }

  static getFinancialApplications(): FinancialApplication[] {
    return getStored<FinancialApplication[]>(STORAGE_KEYS.FINANCIAL_APPS, []);
  }

  static saveFinancialApplications(apps: FinancialApplication[]): void {
    setStored(STORAGE_KEYS.FINANCIAL_APPS, apps);
  }

  static getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static saveNotifications(notifications: NotificationItem[]): void {
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  static getIVRSims(): IVRCallSim[] {
    return getStored<IVRCallSim[]>(STORAGE_KEYS.IVR_SIMS, INITIAL_IVR_SIMS);
  }

  static saveIVRSims(sims: IVRCallSim[]): void {
    setStored(STORAGE_KEYS.IVR_SIMS, sims);
  }

  static getOfflineQueue(): OfflineSyncItem[] {
    return getStored<OfflineSyncItem[]>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  static saveOfflineQueue(queue: OfflineSyncItem[]): void {
    setStored(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  }

  static getActiveRole(): UserRole {
    return getStored<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'driver');
  }

  static saveActiveRole(role: UserRole): void {
    setStored(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  static getActiveLanguage(): LanguageCode {
    return getStored<LanguageCode>(STORAGE_KEYS.ACTIVE_LANG, 'en');
  }

  static saveActiveLanguage(lang: LanguageCode): void {
    setStored(STORAGE_KEYS.ACTIVE_LANG, lang);
  }

  static getNetworkMode(): NetworkMode {
    return getStored<NetworkMode>(STORAGE_KEYS.NETWORK_MODE, 'online');
  }

  static saveNetworkMode(mode: NetworkMode): void {
    setStored(STORAGE_KEYS.NETWORK_MODE, mode);
  }

  static isDataSaverActive(): boolean {
    return getStored<boolean>(STORAGE_KEYS.DATA_SAVER, false);
  }

  static saveDataSaver(active: boolean): void {
    setStored(STORAGE_KEYS.DATA_SAVER, active);
  }

  // Action helpers with automatic offline queuing
  static queueAction(actionType: OfflineSyncItem['actionType'], payload: any): void {
    const queue = this.getOfflineQueue();
    const item: OfflineSyncItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actionType,
      payload,
      queuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      synced: false,
    };
    queue.push(item);
    this.saveOfflineQueue(queue);
  }

  static clearOfflineQueue(): number {
    const queue = this.getOfflineQueue();
    const count = queue.length;
    this.saveOfflineQueue([]);
    return count;
  }

  static resetToDemoDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.DRIVERS);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.SOS_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.FARMER_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.ROADSIDE_SERVICES);
    localStorage.removeItem(STORAGE_KEYS.TRAFFIC_CORRIDORS);
    localStorage.removeItem(STORAGE_KEYS.MESH_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.FINANCIAL_APPS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.IVR_SIMS);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }
}
