import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  // appId: process.env.REACT_APP_APP_ID,
  apiKey: 'AIzaSyA7urirbxoXBsC8h7DHN1LDxa1IDoei4MM',
  authDomain: 'fir-dd60a.firebaseapp.com',
  projectId: 'fir-dd60a',
  storageBucket: 'fir-dd60a.appspot.com',
  messagingSenderId: '487503040464',
  appId: '1:487503040464:web:c2de2dc22f763be3bbb3d5',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbService = getFirestore();
export const storageService = getStorage();
