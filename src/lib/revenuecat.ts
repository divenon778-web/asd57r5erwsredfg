import { Purchases, LogLevel } from '@revenuecat/purchases-js';

const API_KEY = 'test_MUVdojwiCkCpdOlJdPvJZEeNCMf';
const ENTITLEMENT_ID = 'Structra Pro';

let isConfigured = false;

const getOrCreateAppUserId = () => {
  let userId = localStorage.getItem('rc_app_user_id');
  if (!userId) {
    userId = 'anon_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('rc_app_user_id', userId);
  }
  return userId;
};

export const initRevenueCat = () => {
  if (isConfigured) return;
  Purchases.setLogLevel(LogLevel.Debug);
  Purchases.configure({ 
    apiKey: API_KEY,
    appUserId: getOrCreateAppUserId()
  });
  isConfigured = true;
};

export const checkProEntitlement = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (e) {
    console.error("Error fetching customer info:", e);
    return false;
  }
};

export const getOfferings = async (): Promise<any | null> => {
  try {
    const offerings = await Purchases.getSharedInstance().getOfferings();
    return offerings.current || null;
  } catch (e) {
    console.error("Error fetching offerings:", e);
    return null;
  }
};

export const purchasePackage = async (rcPackage: any): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.getSharedInstance().purchasePackage(rcPackage);
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (e: any) {
    if (!e.userCancelled) {
      console.error("Error purchasing package:", e);
    }
    throw e;
  }
};

export const getManagementURL = async (): Promise<string | null> => {
  try {
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    return customerInfo.managementURL || null;
  } catch (e) {
    console.error("Error fetching management URL:", e);
    return null;
  }
};
