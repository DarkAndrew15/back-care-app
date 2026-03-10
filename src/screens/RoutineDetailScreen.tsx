import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routinesData } from '@/data/routines'; // Importamos la nueva base de datos local

const RoutineDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ FIX: Obtenemos el ID desde la URL (ej: /routine/morning-mcgill-big3)
  const { id } = useParams<{ id: string }>(); 
  const startTime = Date.now();

  // Buscar la rutina en nuestra "Base de Datos" JSON local
  const routine = id && routinesData[id as keyof typeof routinesData] 
    ? routinesData[id as keyof typeof routinesData] 
    : null;

  // Si alguien ingresa un ID inválido, mostramos un error elegante
  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF7] p-6 text-center">
        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">error</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Rutina no encontrada</h2>
        <p className="text-gray-500 mb-8">Parece que esta rutina no existe o ha sido movida.</p>
        <button
          onClick={() => navigate('/home')}
          className="bg-[#1CD6A8] text-white px-8 py-3 rounded-full font-bold shadow-lg"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const totalExercises = routine.exercises.length;

  return (
    // Estructura principal
    <div className="flex flex-col min-h-screen bg-[#FFFDF7] text-gray-800 font-sans">
      
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#FFFDF7]/90 backdrop-blur-md">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-gray-700 text-xl">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-900">BackCare Protocol</span>
          <div className="bg-[#E0F2F1] px-2 py-0.5 rounded-md mt-0.5">
             <span className="text-[10px] font-bold text-[#009688] tracking-wider uppercase">
               {routine.category}
             </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
      <main className="flex-1 px-5 pb-10">
        
        {/* HERO CARD WRAPPER */}
        <div className="relative mb-8 group"> 
            <div className="relative w-full h-56 rounded-[32px] overflow-hidden shadow-lg shadow-green-900/10 z-10">
                <div className="absolute inset-0 bg-[#4A7A65]">
                    {/* ✅ Ahora la imagen es dinámica */}
                    <img 
                        src={routine.image} 
                        alt="Cover" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D5A48] via-transparent to-transparent opacity-90"></div>
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="self-start bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-teal-600 text-sm">schedule</span>
                        <span className="text-xs font-bold text-gray-800">{routine.duration} • {totalExercises} ejercicios</span>
                    </div>

                    <div>
                        {/* ✅ Título Dinámico (usamos dangerouslySetInnerHTML solo si necesitas el salto de línea <br/> como tenías, sino lo dejamos en texto plano) */}
                        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                            {routine.title}
                        </h1>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-lg border border-white/30 text-white text-[10px] font-bold tracking-wide backdrop-blur-md">
                                PROTOCOLO
                            </span>
                            <span className="px-3 py-1 rounded-lg border border-white/30 text-white text-[10px] font-bold tracking-wide backdrop-blur-md">
                                RECUPERACIÓN
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-4 -right-2 w-24 h-24 z-20 transform rotate-3 drop-shadow-xl">
                 <img 
                    src="/images/anime/GokuChibiBannerSerio.png" 
                    alt="Chibi Mascot" 
                    className="w-full h-full object-contain" 
                 />
            </div>
        </div>

        {/* WARNING CARD */}
        <div className="bg-[#FFF9E5] border border-[#FFEBB0] rounded-3xl p-5 mb-8 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-amber-500">
                <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Importante - Fase 1 (Primeras 4 semanas)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>NUNCA</strong> busques altura o rango máximo. Busca <strong>control y estabilidad</strong>. Si sientes dolor agudo, detente inmediatamente. La clave es la <strong>calidad del movimiento</strong>, no la cantidad.
                </p>
            </div>
        </div>

        {/* LISTA DE EJERCICIOS */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Secuencia</h2>
            <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {totalExercises} Pasos
            </span>
        </div>

        <div className="space-y-4">
            {routine.exercises.map((exercise, index) => (
                <button 
                    key={exercise.id} 
                    onClick={() => {
                        // Empaquetamos SOLO este ejercicio como si fuera una rutina de 1 paso
                        const singleExerciseData = {
                          id: routine.id, // Mantenemos el ID de la rutina para las estadísticas
                          name: `Práctica: ${exercise.name}`, // Cambiamos el nombre para distinguirlo
                          exercises: [exercise], // PASAMOS SOLO ESTE EJERCICIO
                          currentExerciseIndex: 0,
                          currentSet: 1,
                          startTime: Date.now()
                        };

                        try {
                          const encodedData = btoa(encodeURIComponent(JSON.stringify(singleExerciseData)));
                          navigate(`/exercise/${encodedData}`);
                        } catch (error) {
                          console.error('❌ Error al codificar datos individuales:', error);
                          const encodedData = btoa(JSON.stringify(singleExerciseData));
                          navigate(`/exercise/${encodedData}`);
                        }
                    }}
                    className="w-full text-left bg-white p-3 pr-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-50/50 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer group"
                >
                    <div className="relative shrink-0">
                         <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                             <img src={exercise.avatar} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         </div>
                         <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center shadow-sm z-10">
                             <span className="text-xs font-bold text-gray-800">{index + 1}</span>
                         </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base">{exercise.name}</h3>
                        <p className="text-[10px] font-bold text-[#00E6CC] uppercase mb-1 tracking-wide truncate">{exercise.target}</p>
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap">{exercise.sets} Series</span>
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md truncate">{exercise.repsOrDuration}</span>
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-[#1CD6A8] transition-colors">
                        <span className="material-symbols-outlined text-teal-600 group-hover:text-white text-xl">play_arrow</span>
                    </div>
                </button>
            ))}
        </div>

        {/* Descripción adicional */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            {routine.description}
          </p>
        </div>

        {/* Frase Motivacional */}
        <div className="flex items-center gap-3 mt-6 mb-8 ml-2">
             <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden border border-white">
                <img src="/images/anime/GokuBustoAnimo.png" alt="Coach" />
             </div>
             <div className="bg-white px-4 py-2 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm border border-gray-100">
                 <p className="text-xs font-semibold text-gray-700">¡Tú puedes hacerlo! ✨</p>
             </div>
        </div>

        {/* BOTÓN COMENZAR */}
        <button
          onClick={() => {
              const exerciseData = {
                id: routine.id,
                name: routine.title,
                exercises: routine.exercises,
                currentExerciseIndex: 0,
                currentSet: 1,
                startTime
              };

              try {
                const encodedData = btoa(encodeURIComponent(JSON.stringify(exerciseData)));
                navigate(`/exercise/${encodedData}`);
              } catch (error) {
                console.error('❌ Error al codificar datos:', error);
                const encodedData = btoa(JSON.stringify(exerciseData));
                navigate(`/exercise/${encodedData}`);
              }
          }}
          className="w-full h-14 bg-[#1CD6A8] hover:bg-[#15c296] active:scale-[0.98] transition-all rounded-full flex items-center justify-between px-2 pl-6 shadow-lg shadow-teal-500/30 group mt-4"
        >
          <span className="text-white font-bold text-lg tracking-wide">Estoy listo, comenzar</span>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_forward</span>
          </div>
        </button>

      </main>

    </div>
  );
};

export default RoutineDetailScreen;