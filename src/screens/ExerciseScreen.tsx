import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Exercise } from '@/types';
import { useExerciseTimer } from '@/hooks/useExerciseTimer';

// Función helper para calcular repeticiones por serie (Pirámide McGill 5-3-1)
const getTargetRepsForSet = (totalReps: number | string | undefined, currentSet: number) => {
  if (!totalReps) return 0;
  
  // Lógica específica para la Pirámide del protocolo McGill (9 reps totales en 3 series)
  if (totalReps === 9) {
    if (currentSet === 1) return 5;
    if (currentSet === 2) return 3;
    if (currentSet === 3) return 1;
  }
  
  // Para rutinas estándar, asume que 'reps' es por serie
  if (typeof totalReps === 'number') return totalReps;
  const match = String(totalReps).match(/\d+/);
  return match ? parseInt(match[0]) : 5;
};

interface RoutineData {
  id: string;
  name: string;
  exercises: Exercise[];
  currentExerciseIndex?: number;
  currentSet?: number;
  startTime: number;
}

const ExerciseScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { data } = useParams<{ data: string }>(); // Ya no usamos URL params

  // Estados anteriores eliminados por hooks
  const [pendingNextExercise, setPendingNextExercise] = useState(false);

  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('right');
  const [showExitModal, setShowExitModal] = useState(false);

  // Estado derivado para UI: ¿Estamos descansando?
  const [isResting, setIsResting] = useState(false);

  // Refs para lógica compleja (callbacks estables)
  const handleNextRef = useRef<() => void>(() => {});
  const finishRestRef = useRef<() => void>(() => {});

  // Hooks de Timer
  const exerciseTimer = useExerciseTimer(() => handleNextRef.current());
  const restTimer = useExerciseTimer(() => finishRestRef.current());

  // Refs para acceder a los valores más recientes sin causar re-renders
  const routineDataRef = useRef<RoutineData | null>(null);
  const currentExerciseIndexRef = useRef(0);
  const currentSetRef = useRef(1);
  const currentRepRef = useRef(1);
  const currentSideRef = useRef<'left' | 'right'>('right');
  const pendingNextExerciseRef = useRef(false);

  // Actualizar refs cuando cambian los estados
  useEffect(() => {
    routineDataRef.current = routineData;
  }, [routineData]);

  useEffect(() => {
    currentExerciseIndexRef.current = currentExerciseIndex;
  }, [currentExerciseIndex]);

  useEffect(() => {
    currentSetRef.current = currentSet;
  }, [currentSet]);

  useEffect(() => {
    currentRepRef.current = currentRep;
  }, [currentRep]);

  useEffect(() => {
    currentSideRef.current = currentSide;
  }, [currentSide]);

  useEffect(() => {
    pendingNextExerciseRef.current = pendingNextExercise;
  }, [pendingNextExercise]);

  // ✅ Función para iniciar descanso
  const startRest = (duration: number) => {
    setIsResting(true);
    exerciseTimer.pauseTimer(); // Aseguramos que el ejercicio se pause
    restTimer.resetTimer(duration, true); // Usamos el hook: setea el tiempo y auto-inicia
  };

  const handleComplete = useCallback(() => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - routineDataRef.current!.startTime) / 1000);

    // Preparar los mismos datos completos para la pantalla de finalización
    const finalData = {
      ...routineDataRef.current!,
      duration: duration // Añadimos la duración real calculada
    };

    // Navegar a CompletedScreen pasando state
    navigate('/completed', { state: finalData });
  }, [navigate]);

  // ✅ Función para terminar descanso
  const finishRest = useCallback(() => {
    setIsResting(false);
    restTimer.pauseTimer(); // Detenemos el timer de descanso usando el hook

    if (pendingNextExerciseRef.current) {
      // Avanzar al siguiente ejercicio
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setCurrentRep(1);
      setCurrentSide('right');
      setPendingNextExercise(false);
      // El useEffect se encarga de llamar a exerciseTimer.resetTimer
    } else {
      // Reiniciar el tiempo del ejercicio actual
      if (routineDataRef.current && routineDataRef.current.exercises[currentExerciseIndexRef.current]) {
        const exercise = routineDataRef.current.exercises[currentExerciseIndexRef.current];
        const holdTime = typeof exercise.hold === 'number' ? exercise.hold : 10;
        // Usamos el hook de ejercicio para setear el tiempo (false = esperando a que el usuario de play)
        exerciseTimer.resetTimer(holdTime, false);
      }
    }
  }, [exerciseTimer, restTimer]);

  const handleNext = useCallback(() => {
    const exercise = routineDataRef.current?.exercises[currentExerciseIndexRef.current];
    if (!exercise) return;

    const repsCount = getTargetRepsForSet(exercise.reps, currentSetRef.current);

    // ✅ Manejo para McGill Big 3 (mcgill-1, mcgill-2, mcgill-3)
    if (exercise.id.startsWith('mcgill-')) {
      // mcgill-2 (Plancha Lateral) y mcgill-3 (Bird-Dog) tienen lados
      const hasSides = exercise.id === 'mcgill-2' || exercise.id === 'mcgill-3';

      if (hasSides) {
        if (currentSideRef.current === 'right') {
          // --- LADO 1 (Derecho) ---
          if (currentRepRef.current < repsCount) {
            // Siguiente repetición del mismo lado: Micro-pausa de 3s
            startRest(3); 
            setCurrentRep(prev => prev + 1);
          } else {
            // Terminó todas las reps del Lado 1, cambiar a Lado 2
            // "Cambio de lado inmediato" - Damos 3s para darse la vuelta físicamente
            startRest(3); 
            setCurrentSide('left');
            setCurrentRep(1); 
          }
        } else {
          // --- LADO 2 (Izquierdo) ---
          if (currentRepRef.current < repsCount) {
            // Siguiente repetición del mismo lado: Micro-pausa de 3s
            startRest(3);
            setCurrentRep(prev => prev + 1);
          } else {
            // Terminó todas las reps del Lado 2
            if (currentSetRef.current < exercise.sets) {
              // Nueva serie: Descanso de 30s (aplicable a mcgill-2 y mcgill-3)
              startRest(30); 
              setCurrentSet(prev => prev + 1);
              setCurrentSide('right');
              setCurrentRep(1);
            } else {
              // Ejercicio completo (Serie 3 finalizada)
              if (currentExerciseIndexRef.current < routineDataRef.current.exercises.length - 1) {
                // Descanso antes del SIGUIENTE ejercicio de la rutina
                startRest(60); 
                setPendingNextExercise(true);
              } else {
                handleComplete();
              }
            }
          }
        }
      } else {
        // mcgill-1 (Curl-Up) - sin lados
        if (currentRepRef.current < repsCount) {
          // Siguiente repetición, descanso corto (3-5s)
          startRest(5);
          setCurrentRep(prev => prev + 1);
        } else {
          if (currentSetRef.current < exercise.sets) {
            // Nueva serie, descanso entre series (30s)
            startRest(30);
            setCurrentSet(prev => prev + 1);
            setCurrentRep(1);
          } else {
            // Ejercicio completo, descanso entre ejercicios (60s)
            if (currentExerciseIndexRef.current < routineDataRef.current.exercises.length - 1) {
              startRest(60);
              setPendingNextExercise(true);
            } else {
              handleComplete();
            }
          }
        }
      }
    }
    // ✅ Manejo legacy para side-plank (mantener compatibilidad)
    else if (exercise.id === 'side-plank') {
      if (currentSideRef.current === 'right') {
        // Cambiar a lado izquierdo, descanso corto (5s)
        startRest(5);
        setCurrentSide('left');
      } else {
        if (currentSetRef.current < exercise.sets) {
          // Nueva serie, descanso entre series (30s)
          startRest(30);
          setCurrentSet(prev => prev + 1);
          setCurrentSide('right');
        } else {
          // Ejercicio completo, descanso entre ejercicios (45s)
          if (currentExerciseIndexRef.current < routineDataRef.current.exercises.length - 1) {
            startRest(45);
            setPendingNextExercise(true);
          } else {
            handleComplete();
          }
        }
      }
    }
    // ✅ Manejo legacy para bird-dog (mantener compatibilidad)
    else if (exercise.id === 'bird-dog') {
      if (currentRepRef.current < repsCount) {
        // Siguiente repetición, descanso corto (3-5s)
        startRest(5);
        setCurrentRep(prev => prev + 1);
        setCurrentSide(prev => prev === 'right' ? 'left' : 'right');
      } else {
        if (currentSetRef.current < exercise.sets) {
          // Nueva serie, descanso entre series (45s)
          startRest(45);
          setCurrentSet(prev => prev + 1);
          setCurrentRep(1);
          setCurrentSide('right');
        } else {
          // Ejercicio completo, descanso entre ejercicios (60s)
          if (currentExerciseIndexRef.current < routineDataRef.current.exercises.length - 1) {
            startRest(60);
            setPendingNextExercise(true);
          } else {
            handleComplete();
          }
        }
      }
    }
    // ✅ Manejo por defecto (Curl-Up y otros)
    else {
      if (currentRepRef.current < repsCount) {
        // Siguiente repetición, descanso corto (3-5s)
        startRest(5);
        setCurrentRep(prev => prev + 1);
      } else {
        if (currentSetRef.current < exercise.sets) {
          // Nueva serie, descanso entre series (30s)
          startRest(30);
          setCurrentSet(prev => prev + 1);
          setCurrentRep(1);
        } else {
          // Ejercicio completo, descanso entre ejercicios (45s)
          if (currentExerciseIndexRef.current < routineDataRef.current.exercises.length - 1) {
            startRest(45);
            setPendingNextExercise(true);
          } else {
            handleComplete();
          }
        }
      }
    }
  }, []);

  // Cargar datos desde location.state
  useEffect(() => {
    if (location.state) {
      const data = location.state as RoutineData;
      console.log('✅ Datos cargados desde state:', data);
      
      if (!data.exercises || data.exercises.length === 0) {
        console.error('No hay ejercicios en la rutina');
        navigate('/home');
        return;
      }

      setRoutineData(data);
      setCurrentExerciseIndex(data.currentExerciseIndex || 0);
      setCurrentSet(data.currentSet || 1);
    } else {
      console.error('❌ No hay state en la navegación');
      navigate('/home');
    }
  }, [location.state, navigate]);

  // ✅ Actualizar totalTime cuando cambia el ejercicio actual
  useEffect(() => {
    if (routineData && routineData.exercises[currentExerciseIndex]) {
      const exercise = routineData.exercises[currentExerciseIndex];
      const holdTime = typeof exercise.hold === 'number' ? exercise.hold : 10;
      exerciseTimer.resetTimer(holdTime, false);
    }
  }, [currentExerciseIndex, routineData]);

  // Sync refs para hooks
  useEffect(() => { handleNextRef.current = handleNext; }, [handleNext]);
  useEffect(() => { finishRestRef.current = finishRest; }, [finishRest]);


  if (!routineData || !routineData.exercises || routineData.exercises.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f6f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-main"></div>
      </div>
    );
  }

  const exercises = routineData.exercises;
  const currentExercise = exercises[currentExerciseIndex];

  const getRepsCount = (exercise: Exercise): number => {
    // Para McGill Big 3 (mcgill-1, mcgill-2, mcgill-3), usar pirámide 5-3-1
    if (exercise.id.startsWith('mcgill-')) {
      return getTargetRepsForSet(exercise.reps, currentSet);
    }
    // Para side-plank legacy, retornar 2 lados
    if (exercise.id === 'side-plank') return 2;
    // Para rutinas estándar, retornar reps por serie
    if (typeof exercise.reps === 'number') return exercise.reps;
    const match = String(exercise.reps).match(/\d+/);
    return match ? parseInt(match[0]) : 5;
  };

  const calculateProgress = () => {
    let completedScreens = 0;
    let totalScreens = 0;

    // 1. Calcular el total REAL de "pantallas" o repeticiones de toda la rutina
    exercises.forEach((ex, idx) => {
      const hasSides = ex.id === 'mcgill-2' || ex.id === 'mcgill-3' || ex.id === 'side-plank';
      const sidesMultiplier = hasSides ? 2 : 1;
      let exerciseTotalReps = 0;

      if (ex.id.startsWith('mcgill-')) {
        // Para McGill, sabemos exactamente que la pirámide 5-3-1 suma 9 reps por lado
        exerciseTotalReps = 9 * sidesMultiplier;
      } else {
        // Lógica legacy para otros ejercicios genéricos
        const repsPerSet = typeof ex.reps === 'number' ? ex.reps : (String(ex.reps).match(/\d+/) ? parseInt(String(ex.reps).match(/\d+/)![0]) : 5);
        exerciseTotalReps = ex.sets * repsPerSet * sidesMultiplier;
      }

      totalScreens += exerciseTotalReps;

      // 2. Sumar al progreso los ejercicios ANTERIORES ya terminados
      if (idx < currentExerciseIndex) {
        completedScreens += exerciseTotalReps;
      }
    });

    // 3. Sumar el progreso exacto del ejercicio ACTUAL en curso
    if (currentExerciseIndex < exercises.length && currentExercise) {
      const currentHasSides = currentExercise.id.startsWith('mcgill-') &&
                               (currentExercise.id === 'mcgill-2' || currentExercise.id === 'mcgill-3');

      // A. Sumar las series completas anteriores de este ejercicio
      for (let s = 1; s < currentSet; s++) {
        const repsInSet = currentExercise.id.startsWith('mcgill-') ? getTargetRepsForSet(currentExercise.reps, s) : getRepsCount(currentExercise);
        completedScreens += repsInSet * (currentHasSides ? 2 : 1);
      }

      // B. Sumar las repeticiones completadas de la serie actual
      if (currentHasSides) {
        if (currentSide === 'right') {
          // Lado 1 (Derecho): solo sumamos las reps completadas de este lado
          completedScreens += (currentRep - 1);
        } else {
          // Lado 2 (Izquierdo): sumamos TODO el Lado 1 + las reps del Lado 2
          const totalRepsCurrentSet = getTargetRepsForSet(currentExercise.reps, currentSet);
          completedScreens += totalRepsCurrentSet + (currentRep - 1);
        }
      } else {
        // Ejercicio sin lados (Curl-Up)
        completedScreens += (currentRep - 1);
      }
    }

    return {
      completed: completedScreens,
      total: totalScreens,
      percentage: totalScreens > 0 ? (completedScreens / totalScreens) * 100 : 0
    };
  };

  const moveToNextExercise = () => {
    setCurrentExerciseIndex(currentExerciseIndex + 1);
    setCurrentSet(1);
    setCurrentRep(1);
    setCurrentSide('right');
    // El useEffect que escucha currentExerciseIndex actualizará totalTime automáticamente
  };

  const getProgressText = () => {
    const repsCount = getRepsCount(currentExercise);

    // ✅ Manejo para McGill Big 3
    if (currentExercise.id.startsWith('mcgill-')) {
      // mcgill-2 (Plancha Lateral) y mcgill-3 (Bird-Dog) tienen lados
      const hasSides = currentExercise.id === 'mcgill-2' || currentExercise.id === 'mcgill-3';

      if (hasSides) {
        // ✨ NUEVO: Reflejar instrucción de McGill (Lado 1 y Lado 2)
        const ladoTexto = currentSide === 'right' ? '1 (Sin dolor)' : '2 (Más sensible)';
        return `Serie ${currentSet}/${currentExercise.sets} • Rep ${currentRep}/${repsCount} • Lado ${ladoTexto}`;
      } else {
        // mcgill-1 (Curl-Up) - sin lados
        return `Serie ${currentSet}/${currentExercise.sets} • Repetición ${currentRep}/${repsCount}`;
      }
    }
    // ✅ Manejo legacy (manteniendo la misma lógica de lados por si acaso)
    if (currentExercise.id === 'side-plank') {
      const ladoTexto = currentSide === 'right' ? '1 (Sin dolor)' : '2 (Más sensible)';
      return `Serie ${currentSet}/${currentExercise.sets} • Lado ${ladoTexto}`;
    } else if (currentExercise.id === 'bird-dog') {
      const ladoTexto = currentSide === 'right' ? '1 (Sin dolor)' : '2 (Más sensible)';
      return `Serie ${currentSet}/${currentExercise.sets} • Rep ${currentRep}/${repsCount} • Lado ${ladoTexto}`;
    } else {
      return `Serie ${currentSet}/${currentExercise.sets} • Repetición ${currentRep}/${repsCount}`;
    }
  };

  const progress = calculateProgress();
  
  // ✅ Timer progress dinámico (ejercicio o descanso)
  const displayTime = isResting ? restTimer.timeLeft : exerciseTimer.timeLeft;
  const displayTotalTime = isResting ? restTimer.totalTime : exerciseTimer.totalTime;
  const timerProgress = displayTotalTime > 0 ? ((displayTotalTime - displayTime) / displayTotalTime) * 100 : 0;
  const strokeDasharray = 276;
  const strokeDashoffset = strokeDasharray - (timerProgress / 100) * strokeDasharray;

  return (
    <div className="bg-[#f8f6f2] dark:bg-slate-900 text-[#333333] dark:text-white font-display overflow-hidden flex items-center justify-center min-h-screen relative selection:bg-primary selection:text-white transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-background-light dark:bg-slate-950">
        <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20" style={{ backgroundImage: `url('${currentExercise.image}')`, filter: 'hue-rotate(45deg) brightness(1.5)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[375px] h-[812px] max-h-screen bg-background-light dark:bg-[#121826] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col sm:border-[6px] sm:border-white dark:sm:border-slate-800 ring-1 ring-black/5 transition-colors duration-300">
        <header className="flex flex-col px-6 pt-8 pb-4 gap-4 bg-background-light/95 dark:bg-[#121826]/95 backdrop-blur-sm sticky top-0 z-20 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 px-2.5 rounded-full bg-purple-light/50 flex items-center border border-primary/10">
                <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                  Ejercicio {currentExerciseIndex + 1} / {exercises.length}
                </span>
              </div>
            </div>
            {/* ✅ 3. Botón volver a RoutineDetailScreen */}
            <button
              onClick={() => setShowExitModal(true)}
              className="size-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-soft text-gray-500 dark:text-gray-400 hover:text-primary hover:scale-105 transition-all border border-white dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-main to-primary rounded-full shadow-[0_0_10px_rgba(45,212,191,0.4)] transition-all duration-300" 
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 font-semibold text-center -mt-2">
            {isResting ? '⏸️ Descansando...' : getProgressText()}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center pb-24 relative">
          {/* ✅ Mostrar contenido diferente según si está descansando o ejercitando */}
          {isResting ? (
            // PANTALLA DE DESCANSO
            <>
              <div className="w-full px-5 mb-6 relative mt-2 flex items-center justify-center h-64">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-primary animate-pulse mb-4">self_improvement</span>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Descansa</h2>
                  <p className="text-sm text-gray-600">Prepárate para la siguiente repetición</p>
                </div>
              </div>
            </>
          ) : (
            // PANTALLA DE EJERCICIO
            <>
              <div className="w-full px-5 mb-6 relative group mt-2">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-main to-primary rounded-[1.5rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative aspect-[4/3] w-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-soft border border-white dark:border-slate-700 transition-colors">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${currentExercise.image}')`, filter: 'contrast(0.95) brightness(1.05)' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-slate-900/40 to-transparent"></div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg shadow-sm border border-white/50 dark:border-slate-700/50 transition-colors">
                    <span className="text-[10px] font-extrabold text-primary tracking-widest uppercase">{currentExercise.name}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TIMER CIRCULAR */}
          <div className="relative flex items-center justify-center py-2 mb-4">
            <div className="absolute w-48 h-48 rounded-full border border-primary/10 animate-pulse bg-purple-light/20"></div>
            <div className="absolute w-56 h-56 rounded-full border border-purple-main/10 opacity-30"></div>
            <div className="relative w-44 h-44 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-soft border border-white dark:border-slate-700 ring-4 ring-background-light/50 dark:ring-slate-900/50 transition-colors">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="44" stroke="#f3f4f6" strokeWidth="3"></circle>
                <circle 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="44" 
                  stroke={isResting ? "#fbbf24" : "url(#gradient)"} 
                  strokeDasharray="276" 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  strokeWidth="4"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                ></circle>
                <defs>
                  <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#2beebd"></stop> 
                    <stop offset="100%" stopColor="#8b5cf6"></stop> 
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className={`text-7xl font-black ${isResting ? 'text-amber-500' : 'text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-main'} leading-none tracking-tighter drop-shadow-sm tabular-nums`}>
                  {displayTime}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Segundos</span>
              </div>
            </div>
          </div>

          {/* INSTRUCCIONES (solo si NO está descansando) */}
          {!isResting && (
            <div className="w-full px-5 space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-soft border border-white dark:border-slate-700 z-0 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-light/50 dark:from-purple-900/30 to-transparent rounded-bl-[4rem] -mr-6 -mt-6 z-0"></div>
                <h3 className="text-base font-bold text-[#333333] dark:text-white mb-4 flex items-center gap-2 relative z-10 transition-colors">
                  <div className="p-1.5 bg-purple-light dark:bg-purple-900/40 rounded-full text-primary">
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  </div>
                  Técnica Correcta
                </h3>
                <ol className="space-y-4 relative border-l-2 border-dashed border-gray-100 dark:border-slate-600 ml-3 pl-5 z-10">
                  {currentExercise.instructions.slice(0, 2).map((instruction, idx) => (
                    <li key={idx} className="relative">
                      <span className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full ${idx === 0 ? 'bg-purple-main' : 'bg-primary'} ring-4 ring-white dark:ring-slate-800 shadow-sm transition-colors`}></span>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed font-medium transition-colors">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 flex items-start gap-3 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-rose-400 dark:text-rose-500 mt-0.5 shrink-0">warning</span>
                <div className="flex flex-col gap-2">
                  {currentExercise.warnings.map((warning, idx) => (
                    <p key={idx} className="text-xs text-rose-600 dark:text-rose-300 font-semibold leading-relaxed transition-colors">
                      {currentExercise.warnings.length > 1 && <span className="mr-1">•</span>}
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
              <div className="h-24"></div>
            </div>
          )}
          
          {/* PERSONAJE MOTIVADOR */}
          <div className="absolute bottom-32 right-5 z-20 flex flex-col items-end animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-white dark:bg-slate-800 text-[#333333] dark:text-white text-xs font-bold px-4 py-2 rounded-t-2xl rounded-bl-2xl mb-2 shadow-soft border border-white dark:border-slate-700 relative max-w-[140px] text-center transition-colors">
              <span className="bg-gradient-to-r from-purple-main to-primary bg-clip-text text-transparent">
                {isResting ? '¡Respira!' : '¡Tú puedes!'}
              </span>
              {/* Triángulo de la burbuja */}
              <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white dark:border-t-slate-800 border-r-[0px] border-r-transparent filter drop-shadow-sm transition-colors"></div>
            </div>
            <div className="size-16 rounded-full border-[3px] border-white dark:border-slate-700 bg-gradient-to-br from-[#e0f7fa] dark:from-slate-700 to-[#ede7f6] dark:to-slate-800 shadow-soft flex items-center justify-center overflow-hidden relative transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#333333]/80 dark:text-gray-300">face_5</span>
            </div>
          </div>
        </main>

        {/* BOTONES INFERIORES */}
        <div className="absolute bottom-0 w-full px-6 pb-8 pt-16 bg-gradient-to-t from-background-light dark:from-[#121826] via-background-light/95 dark:via-[#121826]/95 to-transparent z-10 flex flex-col items-center pointer-events-none transition-colors">
          <div className="flex items-center justify-between w-full max-w-[280px] pointer-events-auto">
            <button
              onClick={isResting ? finishRest : handleNext}
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <div className="size-11 rounded-full bg-white dark:bg-slate-800 shadow-soft flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all border border-white dark:border-slate-700">
                <span className="material-symbols-outlined text-xl">skip_next</span>
              </div>
              <span className="text-[9px] font-bold text-[#333333]/40 dark:text-gray-400 uppercase tracking-wide mt-1">Saltar</span>
            </button>
            <button
                onClick={() => isResting ? restTimer.setIsActive(!restTimer.isActive) : exerciseTimer.setIsActive(!exerciseTimer.isActive)}
                className="size-20 -mt-8 rounded-full bg-gradient-to-br from-purple-main to-primary shadow-glow flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-[5px] border-background-light relative z-20 group"
            >
              <span className="material-symbols-outlined text-4xl filled group-hover:animate-pulse">
                {(isResting ? restTimer.isActive : exerciseTimer.isActive) ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 group">
              <div className="size-11 rounded-full bg-white dark:bg-slate-800 shadow-soft flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all border border-white dark:border-slate-700">
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </div>
              <span className="text-[9px] font-bold text-[#333333]/40 dark:text-gray-400 uppercase tracking-wide mt-1">Sonido</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-5 font-semibold bg-white/50 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm pointer-events-auto">
            {isResting ? (
              <span className="text-amber-600">Descansando • {restTimer.timeLeft}s restantes</span>
            ) : (
              <>
                {progress.completed} de {progress.total} completados • <span className="text-primary">{currentExercise.rest.split('.')[0]}</span>
              </>
            )}
          </p>
        </div>
      </div>
      {/* MODAL DE CONFIRMACIÓN DE SALIDA */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExitModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-[320px] w-full shadow-2xl border border-white dark:border-slate-700 animate-[scale-in_0.2s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-rose-500 dark:text-rose-400">warning</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Salir del ejercicio?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Perderás todo el progreso de esta sesión y tendrás que comenzar de nuevo.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 h-12 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => routineData && navigate(`/routine/${routineData.id}`)}
                className="flex-1 h-12 rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold hover:from-rose-600 hover:to-red-600 active:scale-95 transition-all shadow-lg shadow-rose-500/30"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseScreen;
