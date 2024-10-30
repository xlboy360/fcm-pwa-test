import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDW_cHIQZTGQH-jLb10H4jEzoz4rwkPmbA",
    authDomain: "fcm-pwa-test-a9cae.firebaseapp.com",
    projectId: "fcm-pwa-test-a9cae",
    storageBucket: "fcm-pwa-test-a9cae.appspot.com",
    messagingSenderId: "10462038669",
    appId: "1:10462038669:web:a1a508059a086c368470c4"
  };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
