/**
 * cloudStorage.js - Firestore Sync Engine for MOMENTUM
 */
import { 
  doc, 
  setDoc, 
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const MOMENTUM_COLLECTION = 'momentum';

// Save entire MOMENTUM state to Cloud Firestore
export const saveMomentumToCloud = async (userId, momentumData) => {
  if (!userId || !momentumData) return;
  try {
    const docRef = doc(db, MOMENTUM_COLLECTION, userId);
    await setDoc(docRef, {
      ...momentumData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving MOMENTUM data to cloud:', error);
  }
};

// Load MOMENTUM state from Cloud Firestore
export const loadMomentumFromCloud = async (userId) => {
  if (!userId) return null;
  try {
    const docRef = doc(db, MOMENTUM_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error loading MOMENTUM data from cloud:', error);
    return null;
  }
};

// Backward compatibility fallbacks
export const saveHabitsToCloud = async (userId, dateString, habits) => {
  if (!userId) return;
  try {
    const cloudData = await loadMomentumFromCloud(userId) || {};
    const dailyRecords = cloudData.dailyRecords || {};
    dailyRecords[dateString] = {
      ...(dailyRecords[dateString] || {}),
      habits,
      updatedAt: new Date().toISOString()
    };
    await saveMomentumToCloud(userId, { ...cloudData, dailyRecords });
  } catch (error) {
    console.error('Error saving habits to cloud:', error);
  }
};

export const loadHabitsFromCloud = async (userId, dateString) => {
  const cloudData = await loadMomentumFromCloud(userId);
  return cloudData?.dailyRecords?.[dateString]?.habits || null;
};
