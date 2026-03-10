import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveWorkoutSession } from '../services/storage';
import { saveSession } from '../services/firebase'; // ✅ IMPORTAMOS FIREBASE

interface DecodedRoutine {
  id: string;
  name: string;
  exercises: any[];
  startTime?: number;
  duration?: number; // ✅ NUEVO: Duración real calculada desde ExerciseScreen
}

const CompletedScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [startPainLevel, setStartPainLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [routineData, setRoutineData] = useState<DecodedRoutine | null>(null);
  const [duration, setDuration] = useState(0);

  // ✅ NUEVO: Estado para saber si estamos guardando en la nube
  const [isSaving, setIsSaving] = useState(false);

  const painEmojis = ['😊', '🙂', '😐', '😕', '😟', '😣', '😖', '😫', '😭', '😱'];
  const painLabels = ['Sin dolor', 'Muy leve', 'Leve', 'Molesto', 'Incómodo', 'Moderado', 'Fuerte', 'Muy fuerte', 'Intenso', 'Insoportable'];

  useEffect(() => {
    try {
      if (id) {
        // ✅ FIX: Decodificación segura y robusta
        let decodedData = '';
        try {
          // Intentamos decodificar asumiendo que viene con encodeURIComponent (La forma segura)
          decodedData = decodeURIComponent(atob(id));
        } catch (e) {
          // Si falla, es porque venía codificado de la forma antigua (solo btoa)
          decodedData = atob(id);
        }
        
        const data: DecodedRoutine = JSON.parse(decodedData);
        setRoutineData(data);

        // Si la pantalla anterior ya calculó la duración (como acabamos de programar), la usamos
        if ((data as any).duration) {
          setDuration((data as any).duration);
        } 
        // Fallbacks de cálculo por si acaso
        else if (data.startTime) {
          const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
          setDuration(elapsed);
        } else {
          const estimatedSeconds = data.exercises.reduce((total, ex) => {
            return total + (ex.sets * 10) + (ex.sets * 30); 
          }, 0);
          setDuration(estimatedSeconds);
        }
      }
    } catch (error) {
      console.error('❌ Error fatal al decodificar la rutina:', error);
      // Solo en caso de error masivo te mandará al Home
      navigate('/home');
    }
  }, [id, navigate]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // ✅ NUEVO: Convertimos la función en asíncrona (async)
  const handleSaveAndFinish = async () => {
    if (routineData && painLevel !== null) {
      setIsSaving(true); // Bloqueamos el botón
      const totalExercises = routineData.exercises.length;
      const totalSets = routineData.exercises.reduce((sum, ex) => sum + ex.sets, 0);

      // 1. Guardado Local (Para la racha y velocidad)
      saveWorkoutSession({
        id: Date.now().toString(),
        routineId: routineData.id,
        routineName: routineData.name,
        // ✅ FIX: Obtenemos el timestamp en formato ISO pero ajustado a la zona horaria LOCAL del dispositivo
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(),
        duration: duration,
        exercisesCompleted: totalExercises,
        totalExercises: totalExercises,
        setsCompleted: totalSets,
        totalSets: totalSets,
        painLevelBefore: startPainLevel,
        painLevelAfter: painLevel
      });

      // 2. Guardado en Firestore (Nube) con Timeout de 5 segundos
      try {
        const firebaseCall = saveSession({
          userId: 'user-admin', 
          routineId: routineData.id,
          routineName: routineData.name,
          totalDuration: duration,
          painBefore: startPainLevel,
          painAfter: painLevel,
          notes: notes,
          completed: true,
          exercisesCompleted: totalExercises,
          setsCompleted: totalSets,
          date: new Date().toISOString()
        });

        // Cronómetro de 5 segundos
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout: Red lenta')), 5000)
        );

        // Ponemos a competir la llamada de Firebase contra el cronómetro
        await Promise.race([firebaseCall, timeout]);
        console.log("✅ Sesión en Firebase completada o en cola");

      } catch (error) {
        console.warn('⚠️ No se pudo sincronizar en la nube a tiempo, pero el progreso local está a salvo:', error);
        // No lanzamos alert() para no asustar al usuario, su racha local ya se guardó.
      }

      setIsSaving(false);
      navigate('/home');
    } else {
      alert('Por favor selecciona tu nivel de dolor actual');
    }
  };

  // ✅ NUEVO: También hacemos asíncrono el salto de feedback
  const handleSkipFeedback = async () => {
    if (routineData) {
      setIsSaving(true);
      const totalExercises = routineData.exercises.length;
      const totalSets = routineData.exercises.reduce((sum, ex) => sum + ex.sets, 0);

      saveWorkoutSession({
        id: Date.now().toString(),
        routineId: routineData.id,
        routineName: routineData.name,
        // ✅ FIX: Obtenemos el timestamp en formato ISO pero ajustado a la zona horaria LOCAL del dispositivo
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(),
        duration: duration,
        exercisesCompleted: totalExercises,
        totalExercises: totalExercises,
        setsCompleted: totalSets,
        totalSets: totalSets
      });

      try {
        const firebaseCall = saveSession({
          userId: 'user-admin',
          routineId: routineData.id,
          routineName: routineData.name,
          totalDuration: duration,
          completed: true,
          exercisesCompleted: totalExercises,
          setsCompleted: totalSets,
          date: new Date().toISOString()
        });

        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout: Red lenta')), 5000)
        );

        await Promise.race([firebaseCall, timeout]);

      } catch (error) {
         console.warn('⚠️ Error o timeout al guardar en Firebase al saltar feedback:', error);
      }
    }
    setIsSaving(false);
    navigate('/home');
  };

  if (!routineData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const totalExercises = routineData.exercises.length;
  const totalSets = routineData.exercises.reduce((sum, ex) => sum + ex.sets, 0);

  return (
    <div className="bg-[#f0f4f8] dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-[480px] bg-background-light dark:bg-[#1a2c27] rounded-3xl shadow-soft overflow-hidden flex flex-col my-8 border border-white/50 dark:border-slate-800 ring-1 ring-slate-900/5">
        
        {/* HEADER (Se mantiene igual) */}
        <div className="relative w-full bg-white/60 dark:bg-[#233631] pt-10 pb-6 px-6 text-center rounded-b-[2.5rem] shadow-sm z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(43, 238, 189, 0.2), transparent 70%)' }}></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2beebd 1px, transparent 1px), radial-gradient(#d8b4fe 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
          
          <div className="absolute top-5 right-5 bg-white dark:bg-[#2f453e] pl-2 pr-3 py-1.5 rounded-full shadow-md border border-orange-100 dark:border-slate-700 flex items-center gap-2 animate-bounce hover:scale-105 transition-transform cursor-pointer z-20" style={{ animationDuration: '3s' }}>
            <img src="/images/anime/GokuBurbuja.png" alt="Goku en burbuja" className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-700 object-cover" />
            <span className="text-xs font-bold text-orange-500 tracking-tight font-cute">+1 racha 🔥</span>
          </div>

          <div className="mx-auto w-44 h-44 mb-2 relative group perspective-1000">
            <div className="absolute inset-4 bg-primary/30 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
            <img src="/images/anime/GokuNarutoCelebrando.png" alt="Goku y Naruto celebrando" className="w-full h-full object-contain relative z-10 drop-shadow-xl transform group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-500" />
            <span className="material-symbols-outlined absolute top-2 right-4 text-yellow-400 text-3xl animate-pulse drop-shadow-md">spark</span>
            <span className="material-symbols-outlined absolute bottom-6 left-2 text-primary text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>star</span>
            <span className="material-symbols-outlined absolute top-1/2 left-0 text-purple-300 text-xl animate-bounce" style={{ animationDelay: '1.2s' }}>favorite</span>
          </div>
          
          <h1 className="text-slate-800 dark:text-white text-2xl font-black tracking-tight mb-1 font-cute">
            ¡Rutina Completada! 🎉
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase opacity-80">{routineData.name}</p>
        </div>

        {/* CONTENIDO ESTADÍSTICAS Y DOLOR (Se mantiene igual) */}
        <div className="px-5 pt-6 pb-32 flex flex-col gap-8 bg-background-light dark:bg-[#1a2c27]">
          {/* Tarjetas de tiempo, ejercicios y series... */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#2f453e] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-card border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary-dark text-xl">timer</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Tiempo</p>
                <p className="text-slate-800 dark:text-white font-black text-sm font-cute">{formatDuration(duration)}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2f453e] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-card border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-400"></div>
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-purple-500 text-xl">fitness_center</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ejercicios</p>
                <p className="text-slate-800 dark:text-white font-black text-sm font-cute">{totalExercises} / {totalExercises}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#2f453e] p-3 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-card border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-pink-400"></div>
              <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-pink-500 text-xl">repeat</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Series</p>
                <p className="text-slate-800 dark:text-white font-black text-sm font-cute">{totalSets} / {totalSets}</p>
              </div>
            </div>
          </div>

          {/* Selector de Dolor Inicial */}
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-end px-1">
                <h2 className="text-slate-800 dark:text-slate-100 font-bold text-base flex items-center gap-2 font-cute">
                   <span className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-100 dark:ring-slate-800"></span> Dolor Inicial
                </h2>
                <span className="text-xs font-bold bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300 px-3 py-1 rounded-full">{painLabels[startPainLevel]}</span>
             </div>
             <div className="bg-white dark:bg-[#2f453e] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
                <div className="flex justify-between items-center gap-2 px-1">
                   {painEmojis.map((emoji, idx) => (
                      <button key={idx} onClick={() => setStartPainLevel(idx)} className={`flex flex-col items-center gap-1 focus:outline-none transition-all ${idx === startPainLevel ? 'transform scale-125' : 'opacity-50 hover:opacity-100'}`}>
                         <span className="text-2xl">{emoji}</span>
                         <span className="text-[10px] font-bold text-slate-400">{idx}</span>
                         {idx === startPainLevel && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Selector de Dolor Actual */}
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-end px-1">
                <h2 className="text-slate-800 dark:text-slate-100 font-bold text-base flex items-center gap-2 font-cute">
                   <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(43,238,189,0.8)] ring-4 ring-primary/20"></span> Dolor Actual
                </h2>
                {painLevel !== null ? (
                  <span className="text-xs font-bold bg-primary/10 text-emerald-600 dark:text-primary px-3 py-1 rounded-full border border-primary/20">{painLabels[painLevel]}</span>
                ) : (
                  <span className="text-xs font-bold bg-primary/10 text-emerald-600 dark:text-primary px-3 py-1 rounded-full border border-primary/20 animate-pulse">Selecciona</span>
                )}
             </div>
             <div className="bg-white dark:bg-[#2f453e] p-4 rounded-2xl shadow-sm border border-primary/30 dark:border-primary/20 overflow-x-auto no-scrollbar ring-2 ring-primary/10">
                <div className="flex justify-between items-center gap-2 px-1">
                   {painEmojis.map((emoji, idx) => (
                      <button key={idx} onClick={() => setPainLevel(idx)} className={`flex flex-col items-center gap-1 focus:outline-none transition-all ${idx === painLevel ? 'transform scale-125' : 'opacity-50 hover:opacity-100'}`}>
                         <span className="text-2xl">{emoji}</span>
                         <span className="text-[10px] font-bold text-slate-400">{idx}</span>
                         {idx === painLevel && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(43,238,189,0.8)]"></div>}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-3">
             <label className="text-sm font-bold text-slate-700 dark:text-slate-300 font-cute px-1">Notas adicionales <span className="text-slate-400 font-normal">(opcional)</span></label>
             <div className="relative group">
                <textarea 
                  className="w-full bg-white dark:bg-[#2f453e] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none transition-all shadow-sm" 
                  placeholder="¿Sentiste alguna molestia específica?" 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <div className="absolute bottom-3 right-3 bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors">
                   <span className="material-symbols-outlined text-lg block">edit_note</span>
                </div>
             </div>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-[#1a2c27]/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-4 z-50 rounded-b-3xl">
           <button 
             onClick={handleSaveAndFinish}
             disabled={isSaving} // Desactivar si está guardando
             className={`w-full bg-gradient-to-r ${isSaving ? 'from-slate-400 to-slate-500 cursor-not-allowed' : 'from-primary to-teal-400 hover:to-teal-500'} text-white font-bold text-lg py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(43,238,189,0.4)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden`}
           >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {/* ✅ TEXTO DINÁMICO */}
              <span className="relative z-10 font-cute">
                {isSaving ? 'Guardando en la nube...' : 'Guardar y finalizar'}
              </span>
              {!isSaving && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform relative z-10">arrow_forward</span>}
           </button>
           
           <button 
             onClick={handleSkipFeedback} 
             disabled={isSaving}
             className="text-center text-sm font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer"
           >
              Saltar feedback
           </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedScreen;