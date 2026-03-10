export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  repsOrDuration: string;
  reps?: number;
  durationSeconds?: number;
  instructions: string[];
  warnings: string[];
  videoUrl?: string;
}

export interface Routine {
  id: string;
  name: string;
  phase: number;
  timeOfDay: 'morning' | 'daytime' | 'night';
  exercises: Exercise[];
  estimatedDuration: number; // en minutos
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
  routineName: string; // Faltaba en tu interfaz original
  date: string;
  completed: boolean;
  exercises?: ExerciseProgress[]; // Lo hacemos opcional por ahora
  totalDuration: number; // en segundos
  painBefore?: number; // Opcional, para cuando usan "Saltar feedback"
  painAfter?: number; // Opcional
  notes?: string;
  exercisesCompleted: number; // Faltaba
  setsCompleted: number; // Faltaba
}

export interface UserProgress {
  userId: string;
  currentPhase: number;
  startDate: string;
  streak: number;
  totalSessions: number;
  lastCompletedRoutine?: string;
}

export enum NavTheme {
  Purple = 'Purple',
  Mint = 'Mint'
}