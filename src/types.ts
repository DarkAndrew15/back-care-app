export enum NavTheme {
  Purple = 'Purple',
  Mint = 'Mint'
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  target: string; // De raíz
  sets: number;
  repsOrDuration: string;
  reps?: number | string; // Unificado para permitir string "5-3-1"
  durationSeconds?: number; // De src
  hold?: string | number; // De raíz y src unificados (number en routines.ts)
  instructions: string[];
  warnings: string[];
  tips?: string[]; // De raíz
  videoUrl?: string; // De src
  image?: string; // De raíz
  avatar?: string; // De raíz
  why?: string; // De raíz
  rest?: string; // De raíz
}

export interface Routine {
  id: string;
  name: string; // Mantengo name para compatibilidad con backend/storage
  title?: string; // Alias para compatibilidad con UI
  phase?: number; // De src
  timeOfDay?: 'morning' | 'daytime' | 'night'; // De src
  category?: string; // De routines.ts
  duration?: string; // De raíz (string "10 min")
  estimatedDuration?: number; // De src (number)
  description?: string; // De raíz
  image?: string; // De raíz
  locked?: boolean; // De raíz
  exercises: Exercise[];
  subtitle?: string; // De routines.ts
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  setsCompleted: number;
  painLevel?: number;
  notes?: string;
}

export interface Session {
  id?: string;
  userId: string;
  routineId: string;
  routineName: string;
  date: string;
  completed: boolean;
  exercises?: ExerciseProgress[];
  totalDuration: number; // en segundos
  painBefore?: number;
  painAfter?: number;
  notes?: string;
  exercisesCompleted: number;
  setsCompleted: number;
  totalExercises?: number;
  totalSets?: number;
}

export interface UserProgress {
  userId: string;
  currentPhase: number;
  startDate: string;
  streak: number;
  totalSessions: number;
  totalDuration: number; // Agregado para compatibilidad con storage.ts
  lastWorkoutDate: string | null; // Agregado para compatibilidad con storage.ts
  longestStreak: number; // Agregado para compatibilidad con storage.ts
  sessionsHistory: Session[]; // Agregado para compatibilidad con storage.ts
  lastCompletedRoutine?: string;
}
