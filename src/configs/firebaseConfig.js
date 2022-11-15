// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCkoPCp9nfBwtr_Ocvpsd7F51IZxOvEt-g",
  authDomain: "ats-storage-44e44.firebaseapp.com",
  projectId: "ats-storage-44e44",
  storageBucket: "ats-storage-44e44.appspot.com",
  messagingSenderId: "568976035447",
  appId: "1:568976035447:web:8671bf01d9df2775ae4072",
  measurementId: "G-WCJMKVER8N"
};

export const firebaseNotificationConfig = {
  apiKey: "AIzaSyAev39elSJGC3C5xNZFwwJ8dt3uKeUMdEE",
  authDomain: "ats-notification-30521.firebaseapp.com",
  projectId: "ats-notification-30521",
  storageBucket: "ats-notification-30521.appspot.com",
  messagingSenderId: "969098571970",
  appId: "1:969098571970:web:e672635fe74eb54d1e8b5b",
  measurementId: "G-5JRTX7VD1W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)