
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, memoryLocalCache } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-4288700189-446d2",
  "appId": "1:951058604429:web:c630bdfb8de3c07ef95dc4",
  "storageBucket": "studio-4288700189-446d2.firebasestorage.app",
  "apiKey": "AIzaSyBlSk6b1Zp1P_gWBnkQne-0DvqjT-NWqy0",
  "authDomain": "studio-4288700189-446d2.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "951058604429"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
const db = initializeFirestore(app, {
  localCache: typeof window === 'undefined' 
    ? memoryLocalCache() 
    : persistentLocalCache({})
});


export { db };
