import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';

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
export const dbService = getFirestore(app);
export const storageService = getStorage(app);

// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: any) => setCurrentUser(user));
    return unsub;
  }, []);
  return currentUser;
}

// Storage
export async function upload(file: any, currentUser: any, setLoading: any) {
  const fileRef = ref(storageService, currentUser.uid + '.png');

  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);
  const photoURL: any = await getDownloadURL(fileRef);

  updateProfile(currentUser, { photoURL });

  setLoading(false);
  alert('Uploaded file!');
}
