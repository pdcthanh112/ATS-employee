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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)