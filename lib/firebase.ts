import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqNnjDJEO6fDR1yljOQxwiMCGkkwCNCnU",
  authDomain: "wayamba-royal-cms.firebaseapp.com",
  projectId: "wayamba-royal-cms",
  storageBucket: "wayamba-royal-cms.firebasestorage.app",
  messagingSenderId: "1020808011498",
  appId: "1:1020808011498:web:283ee055f6db7fdfab4193",
  measurementId: "G-EWRJQ22LC8",
  databaseURL: "https://wayamba-royal-cms-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);