import React from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-full min-h-screen flex flex-col bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Hero Image - ALTURA REDUCIDA */}
      <div className="relative h-[280px] w-full overflow-hidden bg-primary-light/30">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: 'url(/images/anime/NarutoMeditando.png)'
          }}
        />
        {/* Gradiente para fade hacia el contenido */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col px-8 pb-8 pt-4">
        <div className="text-center mb-8">
          <h1 className="text-purple-dark dark:text-purple-light text-[32px] font-extrabold tracking-tight leading-tight font-display">
            BackCare
          </h1>
          <p className="font-script text-2xl text-gray-600 dark:text-gray-300 mt-1">
            Tu camino hacia una espalda sin dolor
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-purple-light/60 dark:bg-[#2d2438] border border-transparent hover:border-purple-dark/20 shadow-sm transition-all">
            <div className="flex items-center justify-center shrink-0 size-12 rounded-full bg-white dark:bg-[#3d314a] text-purple-dark shadow-sm">
              <span className="material-symbols-outlined text-[24px]">wb_twilight</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-text-main dark:text-white text-base font-bold leading-tight font-display">Rutinas matutinas</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-display">Sesiones de 10 minutos</p>
            </div>
          </div>
          
          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-primary-light/40 dark:bg-[#233333] border border-transparent hover:border-primary/20 shadow-sm transition-all">
            <div className="flex items-center justify-center shrink-0 size-12 rounded-full bg-white dark:bg-[#2f4242] text-primary-dark shadow-sm">
              <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-text-main dark:text-white text-base font-bold leading-tight font-display">Progreso diario</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-display">Seguimiento inteligente</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-purple-light/60 dark:bg-[#38242a] border border-transparent hover:border-purple-dark/20 shadow-sm transition-all">
            <div className="flex items-center justify-center shrink-0 size-12 rounded-full bg-white dark:bg-[#4a3138] text-purple-dark shadow-sm">
              <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-text-main dark:text-white text-base font-bold leading-tight font-display">Clínicamente validado</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-display">Protocolo Dr. McGill</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => navigate('/home')}
            className="relative w-full overflow-hidden rounded-full py-4 bg-gradient-to-r from-primary-light to-primary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform active:scale-95 group"
          >
            <span className="relative z-10 text-lg font-bold tracking-wide text-white drop-shadow-sm font-display">
              Comenzar mi Protocolo
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider font-display">
            Fase 1: Apagar la Alarma (4 semanas)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
