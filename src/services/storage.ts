// src/services/storage.ts

export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  date: string; // ISO format
  duration: number; // en segundos
  exercisesCompleted: number;
  totalExercises: number;
  setsCompleted: number;
  totalSets: number;
  painLevelBefore?: number;
  painLevelAfter?: number;
}

export interface UserProgress {
  totalSessions: number;
  totalDuration: number; // en segundos (ANTES ERA MINUTOS)
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  sessionsHistory: WorkoutSession[];
}

const STORAGE_KEY = 'backcare_progress';

// Obtener progreso del usuario
export const getUserProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading progress:', error);
  }

  return {
    totalSessions: 0,
    totalDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    sessionsHistory: []
  };
};

// Guardar sesión completada
export const saveWorkoutSession = (session: WorkoutSession): void => {
  try {
    const progress = getUserProgress();
    
    progress.sessionsHistory.push(session);
    progress.totalSessions += 1;
    progress.totalDuration += session.duration;

    // ✅ FIX: Obtener fecha YYYY-MM-DD basada en la zona horaria LOCAL del usuario, no en UTC
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    const lastWorkout = progress.lastWorkoutDate;
    
    if (!lastWorkout) {
      progress.currentStreak = 1;
      progress.longestStreak = 1;
    } else {
      // ✅ FIX: Añadimos 'T00:00:00' para evitar que JS intente convertirlo nuevamente a UTC al parsear
      const lastDate = new Date(`${lastWorkout}T00:00:00`);
      const todayDate = new Date(`${today}T00:00:00`);
      // CAMBIO CLAVE: Math.round en lugar de Math.floor para evitar que un día de 23 horas (por DST) cuente como 0 días
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Mismo día, no suma racha extra
      } else if (diffDays === 1) {
        progress.currentStreak += 1;
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }
      } else {
        // Pasó más de un día, racha reiniciada
        progress.currentStreak = 1;
      }
    }
    
    progress.lastWorkoutDate = today;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Obtener sesiones recientes
export const getRecentSessions = (days: number = 30): WorkoutSession[] => {
  const progress = getUserProgress();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return progress.sessionsHistory.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= cutoffDate;
  });
};

// Obtener sesiones por mes
export const getSessionsByMonth = (year: number, month: number): WorkoutSession[] => {
  const progress = getUserProgress();
  return progress.sessionsHistory.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate.getFullYear() === year && sessionDate.getMonth() === month;
  });
};

// Limpiar datos (desarrollo)
export const clearAllProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
