import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Exercise } from '../types';

interface DecodedRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentSet: number;
  restType: 'between-sets' | 'between-exercises';
  startTime?: number; // ← AGREGAR
}

const RestScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [routineData, setRoutineData] = useState<DecodedRoutine | null>(null);
  
  const totalTime = routineData?.restType === 'between-sets' ? 30 : 60;

  useEffect(() => {
    try {
      if (id) {
        const decodedData = atob(id);
        const data: DecodedRoutine = JSON.parse(decodeURIComponent(decodedData));
        setRoutineData(data);
        setTimeLeft(data.restType === 'between-sets' ? 30 : 60);
      }
    } catch (error) {
      console.error('Error decoding rest data:', error);
      navigate('/home');
    }
  }, [id, navigate]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && routineData) {
      clearInterval(interval);
      
      // Navegar al siguiente ejercicio o serie
      const nextRoutineData = {
        id: routineData.id,
        name: routineData.name,
        exercises: routineData.exercises,
        currentExerciseIndex: routineData.currentExerciseIndex,
        currentSet: routineData.currentSet,
        startTime: routineData.startTime // ← AGREGAR
      };

      const encodedRoutine = btoa(JSON.stringify(nextRoutineData));
      navigate(`/exercise/${encodedRoutine}`, { replace: true });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, routineData, navigate]);

  const handleSkip = () => {
    if (routineData) {
      const nextRoutineData = {
        id: routineData.id,
        name: routineData.name,
        exercises: routineData.exercises,
        currentExerciseIndex: routineData.currentExerciseIndex,
        currentSet: routineData.currentSet,
        startTime: routineData.startTime // ← AGREGAR
      };

      const encodedRoutine = btoa(JSON.stringify(nextRoutineData));
      navigate(`/exercise/${encodedRoutine}`, { replace: true });
    }
  };

  if (!routineData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDasharray = 276;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  const nextExercise = routineData.restType === 'between-exercises' 
    ? routineData.exercises[routineData.currentExerciseIndex]
    : null;

  return (
    <div className="bg-[#f8f6f2] text-[#333333] font-display overflow-hidden flex items-center justify-center min-h-screen relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-background-light">
        <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDJraIvuwFuZFRndDzvk64HiYLxiPlrLAZ6jv8FfF5xrcK0p3pZnvDnRIH71rZPQfw7yWmo3OVjSSI6VrfJu02FfvgPSWBSqNSXUQohsak61tSdUtUdcCUK6ji_641yrXLEd_xln5xY0L7ORlEorBXspH0iMpQxK1JSIMpXes67w2NEMAFUos9lDMDDEPwuS97ry32hERjmGrM9IFDAduMbY8Y-aq0Yki4YurABlToAtVde0QWKoanOKfqdig2DIS_PPD1XjiZOg')", filter: 'hue-rotate(180deg) brightness(1.3)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[375px] h-[812px] max-h-screen bg-background-light sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col sm:border-[6px] sm:border-white ring-1 ring-black/5">
        <header className="flex flex-col px-6 pt-8 pb-4 gap-4 bg-background-light/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 px-2.5 rounded-full bg-cyan-100/50 flex items-center border border-cyan-500/10">
                <span className="text-[11px] font-bold text-cyan-600 tracking-wider uppercase">
                  {routineData.restType === 'between-sets' ? 'Descanso entre Series' : 'Descanso entre Ejercicios'}
                </span>
              </div>
            </div>
            <button onClick={() => navigate(`/routine/${routineData?.id || 'morning'}`)} className="size-9 flex items-center justify-center rounded-full bg-white shadow-soft text-gray-500 hover:text-primary hover:scale-105 transition-all border border-white">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="size-20 rounded-full border-[3px] border-white bg-gradient-to-br from-cyan-100 to-blue-100 shadow-soft flex items-center justify-center overflow-hidden relative">
              <span className="material-symbols-outlined text-5xl text-cyan-600">self_improvement</span>
            </div>
            <div className="bg-white text-[#333333] text-xs font-bold px-4 py-2 rounded-b-2xl rounded-tr-2xl mt-2 shadow-soft border border-white relative max-w-[180px] text-center">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Respira profundo</span>
              <div className="absolute -top-2 left-6 w-0 h-0 border-r-[8px] border-r-transparent border-b-[8px] border-b-white border-l-[0px] border-l-transparent filter drop-shadow-sm"></div>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-2 mb-8 mt-32">
            <div className="absolute w-64 h-64 rounded-full border border-cyan-400/10 animate-pulse bg-cyan-50/20"></div>
            <div className="absolute w-72 h-72 rounded-full border border-blue-400/10 opacity-30"></div>
            <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-full shadow-soft border border-white ring-4 ring-background-light/50">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="44" stroke="#f3f4f6" strokeWidth="3"></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="44"
                  stroke="url(#gradient-rest)"
                  strokeDasharray="276"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="4"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                ></circle>
                <defs>
                  <linearGradient id="gradient-rest" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4"></stop>
                    <stop offset="100%" stopColor="#3b82f6"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-600 leading-none tracking-tighter drop-shadow-sm tabular-nums">
                  {timeLeft}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Segundos</span>
              </div>
            </div>
          </div>

          {nextExercise && (
            <div className="w-full max-w-[300px] bg-white rounded-2xl p-4 shadow-soft border border-white">
              <p className="text-xs text-gray-500 font-semibold mb-2">Siguiente ejercicio:</p>
              <h3 className="text-base font-bold text-[#333333] mb-1">{nextExercise.name}</h3>
              <p className="text-xs text-gray-400">{nextExercise.target} • {nextExercise.hold}</p>
            </div>
          )}

          {!nextExercise && (
            <div className="w-full max-w-[300px] bg-white rounded-2xl p-4 shadow-soft border border-white">
              <p className="text-sm text-gray-500 font-semibold text-center">
                Serie {routineData.currentSet} de {routineData.exercises[routineData.currentExerciseIndex - 1]?.sets || 3}
              </p>
            </div>
          )}
        </main>

        <div className="absolute bottom-0 w-full px-6 pb-8 pt-16 bg-gradient-to-t from-background-light via-background-light/95 to-transparent z-10 flex flex-col items-center pointer-events-none">
          <div className="flex items-center justify-center w-full max-w-[280px] gap-4 pointer-events-auto">
            <button 
              onClick={handleSkip}
              className="flex-1 max-w-[140px] flex flex-col items-center justify-center gap-1 group"
            >
              <div className="w-full h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-500 group-hover:text-cyan-600 group-hover:scale-105 transition-all border border-white">
                <span className="text-sm font-bold">Saltar Descanso</span>
              </div>
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className="size-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-glow flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-[4px] border-background-light relative z-20 group"
            >
              <span className="material-symbols-outlined text-3xl filled">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestScreen;
