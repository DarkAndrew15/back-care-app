import React, { useState, useEffect, useMemo } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { NavTheme } from '../types';
import { getUserProgress, getSessionsByMonth } from '../services/storage';

const ProgressScreen: React.FC = () => {
  const [progress, setProgress] = useState(getUserProgress());
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  useEffect(() => {
    const handleFocusChange = () => {
      setProgress(getUserProgress());
    };

    // ✅ FIX: Eliminamos el evento 'storage' inútil en SPA y dejamos solo 'focus' 
    // para actualizar cuando el usuario vuelve a la app desde otra aplicación del celular.
    window.addEventListener('focus', handleFocusChange);

    return () => {
      window.removeEventListener('focus', handleFocusChange);
    };
  }, []);

  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Sesiones del mes actual
    const monthSessions = getSessionsByMonth(year, month);
    const sessionDays = new Set(monthSessions.map(s => new Date(s.date).getDate()));
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();
    
    const data = [];
    
    // Días vacíos al inicio (relleno)
    for (let i = 0; i < firstDayOfMonth; i++) {
      data.push({ day: null, status: null });
    }
    
    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      let status = 'none';
      if (sessionDays.has(d)) {
        status = 'checked';
      } else if (d === today) {
        status = 'today';
      }
      data.push({ day: d, status });
    }
    
    return data;
  }, [progress.sessionsHistory]);

  const currentMonthName = useMemo(() => {
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date());
  }, []);

  return (
    <div className="bg-gray-50 font-display flex items-center justify-center min-h-screen py-8 px-4" style={{ backgroundImage: 'radial-gradient(#dcd6f7 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="relative w-full max-w-[375px] bg-background-light dark:bg-background-dark h-[812px] rounded-3xl shadow-2xl overflow-hidden border-4 border-white ring-1 ring-black/5 flex flex-col">
        {/* Status Bar Mockup */}
        <div className="h-6 w-full flex justify-between items-center px-6 pt-3 pb-1 z-20">
          <span className="text-[10px] font-bold text-gray-400">9:41</span>
          <div className="flex gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-gray-200"></span>
            <span className="block h-2.5 w-2.5 rounded-full bg-gray-200"></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bienvenido</p>
              <h1 className="text-[#111816] dark:text-white text-3xl font-extrabold leading-tight tracking-tight">Mi Progreso</h1>
              <div className="mt-1 inline-flex items-center gap-2 bg-purple-main/20 px-3 py-1 rounded-full w-fit border border-purple-main/30">
                <span className="material-symbols-outlined text-purple-400 text-[16px]">verified</span>
                <p className="text-purple-600 text-xs font-bold">Fase 1 - Semana {Math.max(1, Math.ceil(progress.totalSessions / 7))}</p>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full p-[2px] shadow-sm bg-gradient-to-tr from-primary to-purple-main">
              <div className="h-full w-full rounded-full bg-white p-[2px]">
                <img alt="User profile picture" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8vxDyntLQBx2oaeFcbClnSHxMMB6f1fuUvtD_h5sdShL0FeLIuo-lKAlJ3RL0f31Nj6FMVGrpFk05C09XSou6SETeus7Ul2WluUc3QgbkpkFr8e_gc4pLA_H546nHqRTMsJxJNZTmL3PBkahnVSrN_Z9Rep5q33gxJ4IQtmYYNp8zE14sSsoArKuClwCfzxlKCDdXrrAZft9458qxdLOxzKmka-aKqcB_f8nT9E3iEG9j9yryGZ_xvAHhl8JqXoHPjqePGqux3Q"/>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="bg-pink-100 dark:bg-pink-900/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-red-400 text-3xl">local_fire_department</span>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white text-xl font-bold">{progress.currentStreak} días</p>
                  <p className="text-gray-400 text-xs font-medium">Racha actual</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="bg-primary/20 dark:bg-green-900/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary-dark text-3xl">check_circle</span>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white text-xl font-bold">{progress.totalSessions}</p>
                  <p className="text-gray-400 text-xs font-medium">Sesiones</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="bg-purple-main/30 dark:bg-blue-900/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-purple-400 text-3xl">timer</span>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white text-xl font-bold">{Math.round(progress.totalDuration / 60)}m</p>
                  <p className="text-gray-400 text-xs font-medium">Tiempo total</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="relative size-14">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ringGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#2beebd"></stop>
                        <stop offset="100%" stopColor="#dcd6f7"></stop>
                      </linearGradient>
                    </defs>
                    <circle className="stroke-gray-100 dark:stroke-gray-700" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                    <circle cx="18" cy="18" fill="none" r="16" stroke="url(#ringGradient)" strokeDasharray="100" strokeDashoffset={100 - Math.min(100, (progress.totalSessions / 28) * 100)} strokeLinecap="round" strokeWidth="3"></circle>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-900 dark:text-white">
                     {Math.min(100, Math.round((progress.totalSessions / 28) * 100))}%
                  </div>
                </div>
                <div className="text-center z-10">
                  <p className="text-gray-400 text-xs font-medium">Fase Actual</p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-tr from-primary/20 to-purple-main/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="px-5 py-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <h2 className="text-[#111816] dark:text-white text-base font-bold capitalize">{currentMonthName}</h2>
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-y-3 mb-2">
                {days.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                {calendarData.map((d, i) => (
                  <div key={i} className="flex items-center justify-center h-8">
                    {d.day && (
                      <>
                        {d.status === 'none' && <div className="text-sm text-gray-400">{d.day}</div>}
                        {d.status === 'today' && <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border-2 border-primary/50">{d.day}</div>}
                        {d.status === 'checked' && <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary-dark"><span className="material-symbols-outlined text-[18px]">check</span></div>}
                        {d.status === 'active' && <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-purple-main text-[#111816] shadow-md shadow-primary/30"><span className="material-symbols-outlined text-[18px]">check</span></div>}
                        {d.status === 'missed' && <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-400"><span className="material-symbols-outlined text-[18px]">close</span></div>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pain Chart */}
          <div className="px-5 py-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-soft border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-[#111816] dark:text-white text-base font-bold">Nivel de Dolor</h2>
                  <p className="text-xs text-gray-400 mt-1">Comparativa semanal</p>
                </div>
                <div className="flex gap-3 text-[10px] font-medium">
                  <div className="flex items-center gap-1 text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-red-300"></div> Antes
                  </div>
                  <div className="flex items-center gap-1 text-primary-dark">
                    <div className="w-2 h-2 rounded-full bg-primary"></div> Ahora
                  </div>
                </div>
              </div>
              <div className="relative h-40 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                   <line stroke="#f0f0f0" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="10" y2="10"></line>
                   <line stroke="#f0f0f0" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25"></line>
                   <line stroke="#f0f0f0" strokeDasharray="2" strokeWidth="0.5" x1="0" x2="100" y1="40" y2="40"></line>
                   <path d="M0,15 Q20,12 40,20 T80,18 T100,25" fill="none" opacity="0.6" stroke="#fca5a5" strokeLinecap="round" strokeWidth="2"></path>
                   <defs>
                     <linearGradient id="gradient-chart" x1="0" x2="0" y1="0" y2="1">
                       <stop offset="0%" stopColor="#2beebd" stopOpacity="0.2"></stop>
                       <stop offset="100%" stopColor="#2beebd" stopOpacity="0"></stop>
                     </linearGradient>
                   </defs>
                   <path d="M0,15 Q20,25 40,35 T80,42 T100,45" fill="url(#gradient-chart)" stroke="none"></path>
                   <path d="M0,15 Q20,25 40,35 T80,42 T100,45" fill="none" stroke="#2beebd" strokeLinecap="round" strokeWidth="3"></path>
                   <circle cx="0" cy="15" fill="white" r="1.5" stroke="#2beebd" strokeWidth="1.5"></circle>
                   <circle cx="40" cy="35" fill="white" r="1.5" stroke="#2beebd" strokeWidth="1.5"></circle>
                   <circle cx="80" cy="42" fill="white" r="1.5" stroke="#2beebd" strokeWidth="1.5"></circle>
                   <circle cx="100" cy="45" fill="white" r="1.5" stroke="#2beebd" strokeWidth="1.5"></circle>
                </svg>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 z-10 pointer-events-none">
                  <img alt="Mascot character" className="w-full h-full object-contain drop-shadow-lg transform scale-x-[-1]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwWgrISlrwTFc7jmRvUKHhWqfEXme0byWlD4beyks0eo3XSf1o6b9NV283nIm1O-Wb-4FuWVlikEtVu8BhrfqREoUdEA-gK8n-bQkv2uxaCWHGuBdIrcexuyxYG1hxb1CpMKVrRowcKSVwCZjvpWqDCXe9NmJzZnbIVddt5W0Cl_m06twfAgqgryYCCK0Zgyuu7cSFvkrHT6i8uK_m7oXTfjX_fksq6cmPLZv83yKDg8mse6fxtObhEsMd2Gw5Njwv9WoLUuuJCQ"/>
                </div>
                <div className="absolute top-8 right-2 bg-white dark:bg-gray-700 p-2 rounded-xl rounded-br-none shadow-md border border-gray-100 dark:border-gray-600 max-w-[100px] z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <p className="text-[9px] font-bold text-gray-600 dark:text-gray-200 leading-tight">¡Genial! El dolor bajó 15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <button className="bg-gradient-to-tr from-primary to-purple-main text-[#111816] rounded-full p-3 shadow-lg shadow-primary/30 border-4 border-white dark:border-gray-900 transform transition-transform active:scale-95 group">
                <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
            </button>
        </div>
        
        <BottomNavigation theme={NavTheme.Mint} />
      </div>
    </div>
  );
};

export default ProgressScreen;