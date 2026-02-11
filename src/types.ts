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
  date: string;
  completed: boolean;
  exercises: ExerciseProgress[];
  totalDuration: number; // en segundos
  painBefore: number;
  painAfter: number;
  notes?: string;
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