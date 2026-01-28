import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWbMoa28gSihxH5RxhiK_1fIEcbpcFeRk",
  authDomain: "habit-tracker-d1353.firebaseapp.com",
  projectId: "habit-tracker-d1353",
  storageBucket: "habit-tracker-d1353.firebasestorage.app",
  messagingSenderId: "945465791852",
  appId: "1:945465791852:web:ccf1499b0eea75848c0f49"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
