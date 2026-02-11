export interface Exercise {
  id: string;
  name: string;
  duration?: string;
  sets?: number;
  reps?: number | string;
  hold?: string;              // NUEVO: Para '10s', '8-10s'
  repsOrDuration?: string;    // NUEVO: Para '5 reps × 10s'
  target: string;
  image?: string;
  avatar?: string;
  instructions?: string[];
  warnings?: string[];
  tips?: string[];
  description?: string;
  why?: string;               // NUEVO: Explicación científica del ejercicio
  rest?: string;              // NUEVO: Indicaciones de descanso
}

export interface Routine {
  id: string;
  title: string;
  duration: string;
  exercises: Exercise[];
  description: string;
  image?: string;
  locked?: boolean;
}

export enum NavTheme {
  PURPLE = 'purple',
  MINT = 'mint',
}