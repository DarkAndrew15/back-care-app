// src/services/storage.ts
import { Session, UserProgress } from '@/types';

const STORAGE_KEY = 'backcare_progress';

// Obtener progreso del usuario
export const getUserProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migración simple si existen datos antiguos sin userId
      if (!parsed.userId) {
        parsed.userId = 'local-user';
      }
      return parsed as UserProgress;
    }
  } catch (error) {
    console.error('Error reading progress:', error);
  }

  return {
    userId: 'local-user',
    currentPhase: 1,
    startDate: new Date().toISOString(),
    totalSessions: 0,
    totalDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
    sessionsHistory: []
  };
};

// Guardar sesión completada
export const saveWorkoutSession = (session: Session): void => {
  try {
    const progress = getUserProgress();
    
    // Asegurar compatibilidad de tipos
    if (!session.userId) session.userId = progress.userId;

    progress.sessionsHistory.push(session);
    progress.totalSessions += 1;
    progress.totalDuration += session.totalDuration;

    // ✅ FIX: Obtener fecha YYYY-MM-DD basada en la zona horaria LOCAL del usuario
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
      const lastDate = new Date(`${lastWorkout}T00:00:00`);
      const todayDate = new Date(`${today}T00:00:00`);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Mismo día
      } else if (diffDays === 1) {
        progress.currentStreak += 1;
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }
      } else {
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
export const getRecentSessions = (days: number = 30): Session[] => {
  const progress = getUserProgress();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return progress.sessionsHistory.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= cutoffDate;
  });
};

// Obtener sesiones por mes
export const getSessionsByMonth = (year: number, month: number): Session[] => {
  const progress = getUserProgress();
  return progress.sessionsHistory.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate.getFullYear() === year && sessionDate.getMonth() === month;
  });
};

// Sincronizar progreso desde la nube (Firebase) y reconstruir caché local sin perder datos offline
export const syncProgressFromCloud = (cloudSessions: any[]): UserProgress => {
  try {
    // 0. Obtener sesiones locales existentes para no borrarlas
    const currentLocalProgress = getUserProgress();
    const localSessions = currentLocalProgress.sessionsHistory || [];

    // 1. Mapear las sesiones de la nube al formato local Session
    const mappedCloudSessions: Session[] = cloudSessions.map(session => ({
      id: session.id || Date.now().toString(),
      userId: session.userId || 'local-user',
      routineId: session.routineId,
      routineName: session.routineName,
      date: session.date, // Formato ISO
      totalDuration: session.totalDuration || session.duration || 0,
      exercisesCompleted: session.exercisesCompleted || 0,
      totalExercises: session.totalExercises || session.exercisesCompleted || 0, 
      setsCompleted: session.setsCompleted || 0,
      totalSets: session.totalSets || session.setsCompleted || 0,
      painBefore: session.painBefore || session.painLevelBefore,
      painAfter: session.painAfter || session.painLevelAfter,
      completed: true
    }));

    // 2. FUSIONAR (Merge) locales y nube usando un Map para eliminar duplicados por ID
    const sessionsMap = new Map<string, Session>();
    
    // Primero agregamos las locales
    localSessions.forEach(session => {
      if (session.id) sessionsMap.set(session.id, session);
    });
    
    // Luego las de la nube (si coinciden en ID, la nube manda)
    mappedCloudSessions.forEach(session => {
      if (session.id) sessionsMap.set(session.id, session);
    });

    const mergedSessions = Array.from(sessionsMap.values());

    // 3. Ordenar cronológicamente (de la más antigua a la más reciente)
    mergedSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let lastWorkoutDate: string | null = null;
    let totalDuration = 0;

    // 4. Recalcular métricas sobre el historial fusionado
    mergedSessions.forEach(session => {
      totalDuration += session.totalDuration;
      
      const sessionDateObj = new Date(session.date);
      const year = sessionDateObj.getFullYear();
      const month = String(sessionDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(sessionDateObj.getDate()).padStart(2, '0');
      const sessionDayStr = `${year}-${month}-${day}`;

      if (!lastWorkoutDate) {
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const lastDate = new Date(`${lastWorkoutDate}T00:00:00`);
        const currentDate = new Date(`${sessionDayStr}T00:00:00`);
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      lastWorkoutDate = sessionDayStr;
    });

    // Validar racha actual vs el día de hoy
    if (lastWorkoutDate) {
       const today = new Date();
       const tYear = today.getFullYear();
       const tMonth = String(today.getMonth() + 1).padStart(2, '0');
       const tDay = String(today.getDate()).padStart(2, '0');
       const todayStr = `${tYear}-${tMonth}-${tDay}`;
       
       const lastD = new Date(`${lastWorkoutDate}T00:00:00`);
       const todayD = new Date(`${todayStr}T00:00:00`);
       const diffDaysToToday = Math.round((todayD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24));
       
       if (diffDaysToToday > 1) {
           currentStreak = 0;
       }
    }

    // 5. Construir objeto de progreso maestro fusionado
    const newProgress: UserProgress = {
      userId: mergedSessions.length > 0 ? mergedSessions[0].userId : 'local-user',
      currentPhase: 1,
      startDate: mergedSessions.length > 0 ? mergedSessions[0].date : new Date().toISOString(),
      totalSessions: mergedSessions.length,
      totalDuration: totalDuration,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
      lastWorkoutDate: lastWorkoutDate,
      sessionsHistory: mergedSessions.reverse() // Las más recientes arriba
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    
    return newProgress;
  } catch (error) {
    console.error('Error al sincronizar datos de la nube:', error);
    return getUserProgress();
  }
};

// Limpiar datos
export const clearAllProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
