import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { getUserProgress, syncProgressFromCloud } from '../services/storage';
import { getUserSessions } from '../services/firebase';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userId, userName } = useAuth();
  
  // Carga inicial ultrarrápida (Offline-first)
  const [progress, setProgress] = useState(getUserProgress());
  const [isSyncing, setIsSyncing] = useState(false);

  // Función asíncrona que hace la magia por detrás
  const syncWithCloud = async () => {
    if (!userId) return; // Esperar a tener userId

    try {
      setIsSyncing(true);
      // Traemos las sesiones guardadas bajo tu ID único en Firebase
      const cloudSessions = await getUserSessions(userId);
      
      if (cloudSessions && cloudSessions.length > 0) {
        // Reconstruimos la data local y actualizamos el estado de la UI
        const syncedProgress = syncProgressFromCloud(cloudSessions);
        setProgress(syncedProgress);
      }
    } catch (error) {
      console.error("Error silencioso al sincronizar con Firebase:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // 1. Ejecutar sincronización al montar la pantalla si hay userId
    if (userId) syncWithCloud();

    const handleFocusChange = () => {
      // 2. Ejecutar cuando volvemos a la pestaña/app
      setProgress(getUserProgress()); // Rápido desde caché
      if (userId) syncWithCloud(); // Silencioso desde la nube
    };

    window.addEventListener('focus', handleFocusChange);

    return () => {
      window.removeEventListener('focus', handleFocusChange);
    };
  }, [userId]); // Dependencia de userId para re-sincronizar cuando cargue

  const completionPercentage = useMemo(() => {
    // Asumiendo una meta de 28 sesiones para la Fase 1 (4 semanas)
    return Math.min(100, Math.round((progress.totalSessions / 28) * 100));
  }, [progress.totalSessions]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28 font-display relative overflow-hidden transition-colors duration-300">
       {/* Header */}
       <header className="flex items-center justify-between px-6 pt-10 pb-4 z-10 relative">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] text-purple-main uppercase mb-1">Protocolo BackCare</span>
          <h1 className="text-2xl font-extrabold text-text-main dark:text-white leading-none">¡Hola, Hiro!</h1>
        </div>
        <div className="flex items-center">
          
          {/* Indicador de Sincronización */}
          {isSyncing && (
            <div className="flex items-center mr-3 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-purple-main animate-spin">sync</span>
              <span className="text-[10px] text-purple-main font-bold ml-1 tracking-wider uppercase">Sync...</span>
            </div>
          )}

          <button 
            onClick={toggleTheme}
            className="relative flex items-center justify-center size-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-gray-100 dark:border-gray-700 text-text-main hover:bg-gray-50 transition-colors mr-2"
          >
            <span className="material-symbols-outlined text-[20px] text-purple-main">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="relative flex items-center justify-center size-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-gray-100 dark:border-gray-700 text-text-main hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-[20px] text-purple-main">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-primary-light rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6 scroll-smooth">
        {/* Progress Circle */}
        <div className="px-6 pt-2 pb-8 relative text-center">
          <div className="relative w-56 h-56 mx-auto mb-4">
            <div className="absolute inset-0 bg-purple-main/20 rounded-full blur-3xl transform scale-75"></div>
            <svg className="block mx-auto max-w-full max-h-[250px]" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="gradient-ring" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#9F7AEA"></stop> 
                  <stop offset="100%" stopColor="#6EE7B7"></stop> 
                </linearGradient>
              </defs>
              <path className="fill-none stroke-purple-light stroke-[2.5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <path className="fill-none stroke-[2.5] stroke-linecap-round" stroke="url(#gradient-ring)" strokeDasharray={`${completionPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
              <text className="fill-text-main dark:fill-white font-bold text-[0.45em]" textAnchor="middle" x="18" y="20">{completionPercentage}%</text>
              <text className="fill-purple-main font-bold text-[0.18em] tracking-widest uppercase" textAnchor="middle" x="18" y="13">Fase 1</text>
            </svg>
            <div className="absolute bottom-1 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1.5 px-3 rounded-full shadow-lg flex items-center gap-1 border border-purple-main/20">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-purple-main to-primary-light text-[18px]">bolt</span>
              <span className="text-xs font-bold text-text-main dark:text-white">Racha: {progress.currentStreak}</span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-text-main dark:text-white mb-1">Movilidad Total</h2>
          <div className="flex justify-center gap-6 mb-2">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-purple-main">calendar_today</span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{progress.totalSessions} Sesiones</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-purple-main">timer</span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{Math.round(progress.totalDuration / 60)}m Total</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">¡Sigue así, tu espalda está sanando!</p>
        </div>

        {/* Routines Grid */}
        <div className="px-6 flex flex-col gap-5">
          {/* Main Card */}
          <div className="relative group w-full cursor-pointer" onClick={() => navigate('/routine/morning-mcgill-big3')}>
            <div className="absolute -top-12 -right-6 z-20 w-36 h-36 pointer-events-none transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/anime/ChibiNarutoSaludando.png"
                alt="Rutina matutina"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <div className="bg-card-lavender dark:bg-[#2D2438] rounded-[2rem] p-6 shadow-card border border-white/50 dark:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
              <div className="relative z-10 w-2/3">
                <span className="inline-block bg-white/60 dark:bg-white/10 text-purple-dark dark:text-purple-main text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm backdrop-blur-sm">Mañana</span>
                <h3 className="text-xl font-extrabold text-text-main dark:text-white mb-1">Rutina de Mañana</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 font-medium">10 Min • Estiramientos</p>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-main to-purple-dark hover:from-purple-dark hover:to-purple-main text-white px-6 py-3 rounded-full text-sm font-bold shadow-glow transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  Comenzar
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Card 1 */}
          <div className="relative group w-full cursor-pointer" onClick={() => navigate('/routine/daytime-hygiene')}>
            <div className="absolute -top-8 -right-2 z-20 w-24 h-24 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src="/images/anime/ChibiNarutoPausaActiva.png"
                alt="Micro-pausa activa"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="bg-card-subtle dark:bg-[#231e33] rounded-[2rem] p-5 shadow-sm border border-white/60 dark:border-gray-700 flex items-center justify-between">
              <div className="relative z-10 max-w-[65%]">
                <h3 className="text-base font-bold text-text-main dark:text-white mb-1">Micro-pausa Activa</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  5 Min • Oficina
                </div>
                <button className="bg-gradient-to-r from-purple-main to-purple-dark text-white border border-transparent px-4 py-1.5 rounded-full text-xs font-bold hover:from-purple-dark hover:to-purple-main transition-all">
                  Comenzar
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Card 2 */}
          <div className="relative group w-full pb-6 cursor-pointer" onClick={() => navigate('/routine/night-ritual')}>
            <div className="absolute -top-8 -right-4 z-20 w-28 h-28 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
              <img
                src="/images/anime/ChibiNarutoDurmiendo.png"
                alt="Recuperación Nocturna"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="bg-card-subtle dark:bg-[#231e33] rounded-[2rem] p-5 shadow-sm border border-white/60 dark:border-gray-700 flex items-center justify-between">
              <div className="relative z-10 max-w-[65%]">
                <h3 className="text-base font-bold text-text-main dark:text-white mb-1">Recuperación Nocturna</h3>
                <div className="flex items-center gap-2 text-xs text-purple-main mb-3 font-medium">
                  <span className="material-symbols-outlined text-[14px]">bedtime</span>
                  15 Min • Relajación
                </div>
                <button className="bg-gradient-to-r from-purple-main to-purple-dark text-white border border-transparent px-4 py-1.5 rounded-full text-xs font-bold hover:from-purple-dark hover:to-purple-main transition-all">
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomeScreen;