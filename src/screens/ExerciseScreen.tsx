import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Exercise {
  id: string;
  name: string;
  target: string;
  sets: number;
  reps: number | string;
  hold: string;
  repsOrDuration: string;
  description: string;
  image: string;
  avatar: string;
  instructions: string[];
  warnings: string[];
  tips?: string[];
  why: string;
  rest: string;
}

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
  const { data } = useParams<{ data: string }>();

  // ✅ 1. Timer inicia en PAUSA (isActive = false)
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false); // ← CAMBIADO A FALSE
  const totalTime = 10;

  // ✅ 2. Estado para pantalla de descanso
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const restTotalTime = 30;

  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('right');
  const [showExitModal, setShowExitModal] = useState(false);

  // Decodificar datos
  useEffect(() => {
    if (!data) {
      console.error('❌ No hay parámetro data en la URL');
      navigate('/home');
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(atob(data)));
      console.log('✅ Datos decodificados:', decoded);
      
      if (!decoded.exercises || decoded.exercises.length === 0) {
        throw new Error('No hay ejercicios en la rutina');
      }

      setRoutineData(decoded);
      setCurrentExerciseIndex(decoded.currentExerciseIndex || 0);
      setCurrentSet(decoded.currentSet || 1);
    } catch (error: any) {
      console.error('❌ ERROR al decodificar:', error);
      alert('Error al cargar ejercicios: ' + error.message);
      navigate('/home');
    }
  }, [data, navigate]);

  // ✅ Timer para ejercicio
  useEffect(() => {
    if (!isResting) {
      let interval: any = null;
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      } else if (timeLeft === 0 && isActive) {
        clearInterval(interval);
        handleNext();
      }
      return () => clearInterval(interval);
    }
  }, [isActive, timeLeft, isResting]);

  // ✅ Timer para descanso
  useEffect(() => {
    if (isResting) {
      let interval: any = null;
      if (isActive && restTime > 0) {
        interval = setInterval(() => {
          setRestTime(restTime - 1);
        }, 1000);
      } else if (restTime === 0 && isActive) {
        clearInterval(interval);
        finishRest();
      }
      return () => clearInterval(interval);
    }
  }, [isActive, restTime, isResting]);

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
    if (exercise.id === 'side-plank') return 2;
    if (typeof exercise.reps === 'number') return exercise.reps;
    const match = String(exercise.reps).match(/\d+/);
    return match ? parseInt(match[0]) : 5;
  };

  const calculateProgress = () => {
    let completedScreens = 0;
    let totalScreens = 0;

    exercises.forEach((ex, idx) => {
      const repsCount = getRepsCount(ex);
      const exerciseScreens = ex.sets * repsCount;
      totalScreens += exerciseScreens;

      if (idx < currentExerciseIndex) {
        completedScreens += exerciseScreens;
      }
    });

    if (currentExerciseIndex < exercises.length) {
      const currentRepsCount = getRepsCount(currentExercise);
      completedScreens += (currentSet - 1) * currentRepsCount;
      
      if (currentExercise.id === 'side-plank') {
        if (currentSide === 'left') completedScreens += 1;
      } else {
        completedScreens += (currentRep - 1);
      }
    }

    return {
      completed: completedScreens,
      total: totalScreens,
      percentage: totalScreens > 0 ? (completedScreens / totalScreens) * 100 : 0
    };
  };

  // ✅ Función para iniciar descanso
  const startRest = (duration: number) => {
    setIsResting(true);
    setRestTime(duration);
    setIsActive(true); // Auto-iniciar el descanso
  };

  // ✅ Función para terminar descanso
  const finishRest = () => {
    setIsResting(false);
    setIsActive(false); // Pausar para que el usuario dé play
    setTimeLeft(totalTime); // Reset timer del ejercicio
  };

  const handleNext = () => {
    const repsCount = getRepsCount(currentExercise);

    if (currentExercise.id === 'side-plank') {
      if (currentSide === 'right') {
        // Cambiar a lado izquierdo, descanso corto (5s)
        startRest(5);
        setCurrentSide('left');
      } else {
        if (currentSet < currentExercise.sets) {
          // Nueva serie, descanso entre series (30s)
          startRest(30);
          setCurrentSet(currentSet + 1);
          setCurrentSide('right');
        } else {
          // Ejercicio completo, descanso entre ejercicios (45s)
          if (currentExerciseIndex < exercises.length - 1) {
            startRest(45);
            moveToNextExercise();
          } else {
            handleComplete();
          }
        }
      }
    } else if (currentExercise.id === 'bird-dog') {
      if (currentRep < repsCount) {
        // Siguiente repetición, descanso corto (3-5s)
        startRest(5);
        setCurrentRep(currentRep + 1);
        setCurrentSide(currentSide === 'right' ? 'left' : 'right');
      } else {
        if (currentSet < currentExercise.sets) {
          // Nueva serie, descanso entre series (45s)
          startRest(45);
          setCurrentSet(currentSet + 1);
          setCurrentRep(1);
          setCurrentSide('right');
        } else {
          // Ejercicio completo, descanso entre ejercicios (60s)
          if (currentExerciseIndex < exercises.length - 1) {
            startRest(60);
            moveToNextExercise();
          } else {
            handleComplete();
          }
        }
      }
    } else {
      // Curl-Up
      if (currentRep < repsCount) {
        // Siguiente repetición, descanso corto (3-5s)
        startRest(5);
        setCurrentRep(currentRep + 1);
      } else {
        if (currentSet < currentExercise.sets) {
          // Nueva serie, descanso entre series (30s)
          startRest(30);
          setCurrentSet(currentSet + 1);
          setCurrentRep(1);
        } else {
          // Ejercicio completo, descanso entre ejercicios (45s)
          if (currentExerciseIndex < exercises.length - 1) {
            startRest(45);
            moveToNextExercise();
          } else {
            handleComplete();
          }
        }
      }
    }
  };

  const moveToNextExercise = () => {
    setCurrentExerciseIndex(currentExerciseIndex + 1);
    setCurrentSet(1);
    setCurrentRep(1);
    setCurrentSide('right');
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - routineData.startTime) / 1000);
    
    navigate('/completed', {
      state: {
        routineName: routineData.name,
        duration: duration,
        exercises: exercises.length
      }
    });
  };

  const getProgressText = () => {
    const repsCount = getRepsCount(currentExercise);
    
    if (currentExercise.id === 'side-plank') {
      return `Serie ${currentSet}/${currentExercise.sets} • Lado ${currentSide === 'right' ? 'Derecho' : 'Izquierdo'}`;
    } else if (currentExercise.id === 'bird-dog') {
      return `Serie ${currentSet}/${currentExercise.sets} • Rep ${currentRep}/${repsCount} • ${currentSide === 'right' ? 'Derecho' : 'Izquierdo'}`;
    } else {
      return `Serie ${currentSet}/${currentExercise.sets} • Repetición ${currentRep}/${repsCount}`;
    }
  };

  const progress = calculateProgress();
  
  // ✅ Timer progress dinámico (ejercicio o descanso)
  const displayTime = isResting ? restTime : timeLeft;
  const displayTotalTime = isResting ? restTotalTime : totalTime;
  const timerProgress = ((displayTotalTime - displayTime) / displayTotalTime) * 100;
  const strokeDasharray = 276;
  const strokeDashoffset = strokeDasharray - (timerProgress / 100) * strokeDasharray;

  return (
    <div className="bg-[#f8f6f2] text-[#333333] font-display overflow-hidden flex items-center justify-center min-h-screen relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-background-light">
        <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20" style={{ backgroundImage: `url('${currentExercise.image}')`, filter: 'hue-rotate(45deg) brightness(1.5)' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[375px] h-[812px] max-h-screen bg-background-light sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col sm:border-[6px] sm:border-white ring-1 ring-black/5">
        <header className="flex flex-col px-6 pt-8 pb-4 gap-4 bg-background-light/95 backdrop-blur-sm sticky top-0 z-20">
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
              className="size-9 flex items-center justify-center rounded-full bg-white shadow-soft text-gray-500 hover:text-primary hover:scale-105 transition-all border border-white"
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
                <div className="relative aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden shadow-soft border border-white">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${currentExercise.image}')`, filter: 'contrast(0.95) brightness(1.05)' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/50">
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
            <div className="relative w-44 h-44 flex items-center justify-center bg-white rounded-full shadow-soft border border-white ring-4 ring-background-light/50">
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
              <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-soft border border-white z-0">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-light/50 to-transparent rounded-bl-[4rem] -mr-6 -mt-6 z-0"></div>
                <h3 className="text-base font-bold text-[#333333] mb-4 flex items-center gap-2 relative z-10">
                  <div className="p-1.5 bg-purple-light rounded-full text-primary">
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  </div>
                  Técnica Correcta
                </h3>
                <ol className="space-y-4 relative border-l-2 border-dashed border-gray-100 ml-3 pl-5 z-10">
                  {currentExercise.instructions.slice(0, 2).map((instruction, idx) => (
                    <li key={idx} className="relative">
                      <span className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full ${idx === 0 ? 'bg-purple-main' : 'bg-primary'} ring-4 ring-white shadow-sm`}></span>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                <span className="material-symbols-outlined text-rose-400 mt-0.5">warning</span>
                <p className="text-xs text-rose-600 font-semibold leading-relaxed">{currentExercise.warnings[0]}</p>
              </div>
              <div className="h-24"></div>
            </div>
          )}
          
          {/* PERSONAJE MOTIVADOR */}
          <div className="absolute bottom-32 right-5 z-20 flex flex-col items-end animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-white text-[#333333] text-xs font-bold px-4 py-2 rounded-t-2xl rounded-bl-2xl mb-2 shadow-soft border border-white relative max-w-[140px] text-center">
              <span className="bg-gradient-to-r from-purple-main to-primary bg-clip-text text-transparent">
                {isResting ? '¡Respira!' : '¡Tú puedes!'}
              </span>
              <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[0px] border-r-transparent filter drop-shadow-sm"></div>
            </div>
            <div className="size-16 rounded-full border-[3px] border-white bg-gradient-to-br from-[#e0f7fa] to-[#ede7f6] shadow-soft flex items-center justify-center overflow-hidden relative">
              <span className="material-symbols-outlined text-4xl text-[#333333]/80">face_5</span>
            </div>
          </div>
        </main>

        {/* BOTONES INFERIORES */}
        <div className="absolute bottom-0 w-full px-6 pb-8 pt-16 bg-gradient-to-t from-background-light via-background-light/95 to-transparent z-10 flex flex-col items-center pointer-events-none">
          <div className="flex items-center justify-between w-full max-w-[280px] pointer-events-auto">
            <button 
              onClick={handleNext}
              className="flex flex-col items-center justify-center gap-1 group"
            >
              <div className="size-11 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-500 group-hover:text-primary group-hover:scale-110 transition-all border border-white">
                <span className="material-symbols-outlined text-xl">skip_next</span>
              </div>
              <span className="text-[9px] font-bold text-[#333333]/40 uppercase tracking-wide mt-1">Saltar</span>
            </button>
            <button 
                onClick={() => setIsActive(!isActive)}
                className="size-20 -mt-8 rounded-full bg-gradient-to-br from-purple-main to-primary shadow-glow flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-[5px] border-background-light relative z-20 group"
            >
              <span className="material-symbols-outlined text-4xl filled group-hover:animate-pulse">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 group">
              <div className="size-11 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-500 group-hover:text-primary group-hover:scale-110 transition-all border border-white">
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </div>
              <span className="text-[9px] font-bold text-[#333333]/40 uppercase tracking-wide mt-1">Sonido</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-5 font-semibold bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50 shadow-sm pointer-events-auto">
            {isResting ? (
              <span className="text-amber-600">Descansando • {restTime}s restantes</span>
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
          <div className="relative bg-white rounded-3xl p-6 max-w-[320px] w-full shadow-2xl border border-white animate-[scale-in_0.2s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-rose-500">warning</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Salir del ejercicio?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Perderás todo el progreso de esta sesión y tendrás que comenzar de nuevo.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 h-12 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => navigate(`/routine/${routineData.id}`)}
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
