import { 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';

const HABITS_COLLECTION = 'habits';

// Save habits for a date
export const saveHabitsToCloud = async (userId, dateString, habits) => {
  if (!userId) return;
  try {
    await setDoc(doc(db, HABITS_COLLECTION, `${userId}_${dateString}`), {
      userId,
      date: dateString,
      habits,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving to cloud:', error);
  }
};

// Load habits for a date
export const loadHabitsFromCloud = async (userId, dateString) => {
  if (!userId) return null;
  try {
    const docSnap = await getDoc(doc(db, HABITS_COLLECTION, `${userId}_${dateString}`));
    return docSnap.exists() ? docSnap.data().habits : null;
  } catch (error) {
    console.error('Error loading from cloud:', error);
    return null;
  }
};

// Load all habits for a user (for stats)
export const loadAllUserHabits = async (userId) => {
  if (!userId) return {};
  try {
    const q = query(collection(db, HABITS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const habitsMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      habitsMap[data.date] = data.habits;
    });
    return habitsMap;
  } catch (error) {
    console.error('Error loading all habits:', error);
    return {};
  }
};
