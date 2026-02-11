import { db } from '@/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Routine, Session, UserProgress } from '@/types';

// Obtener todas las rutinas
export const getRoutines = async (): Promise<Routine[]> => {
  try {
    const routinesCol = collection(db, 'routines');
    const snapshot = await getDocs(routinesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Routine));
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    return [];
  }
};

// Obtener rutina por ID
export const getRoutineById = async (id: string): Promise<Routine | null> => {
  try {
    const routineDoc = doc(db, 'routines', id);
    const snapshot = await getDoc(routineDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Routine;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener rutina:', error);
    return null;
  }
};

// Guardar sesión completada
export const saveSession = async (session: Omit<Session, 'id'>): Promise<string | null> => {
  try {
    const sessionsCol = collection(db, 'sessions');
    const docRef = await addDoc(sessionsCol, {
      ...session,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar sesión:', error);
    return null;
  }
};

// Obtener sesiones del usuario
export const getUserSessions = async (userId: string): Promise<Session[]> => {
  try {
    const sessionsCol = collection(db, 'sessions');
    const q = query(
      sessionsCol, 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      date: doc.data().date.toDate().toISOString()
    } as Session));
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    return [];
  }
};

// Obtener progreso del usuario
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const progressDoc = doc(db, 'userProgress', userId);
    const snapshot = await getDoc(progressDoc);
    if (snapshot.exists()) {
      return snapshot.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return null;
  }
};