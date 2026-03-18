import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { getUserProgress } from '../services/storage';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  // 1. Obtenemos los datos del usuario logueado
  const { userName, logout } = useAuth(); 
  
  // 2. Obtenemos el progreso real almacenado
  const [progress, setProgress] = useState(getUserProgress());

  // Refrescar el progreso si el usuario vuelve a la pestaña
  useEffect(() => {
    const handleFocusChange = () => setProgress(getUserProgress());
    window.addEventListener('focus', handleFocusChange);
    return () => window.removeEventListener('focus', handleFocusChange);
  }, []);

  // 3. Cálculos dinámicos basados en la actividad real
  const level = Math.floor(progress.totalSessions / 28) + 1; // Sube 1 nivel cada 28 sesiones (1 fase completa)
  const achievements = Math.floor(progress.totalSessions / 5); // 1 logro cada 5 sesiones a modo de ejemplo

  // 4. Configuración limpia de los botones del menú
  const menuItems = [
    { 
      icon: 'manage_accounts', 
      label: 'Mis Datos', 
      subtitle: 'Editar perfil, peso y altura',
      bgClass: 'bg-blue-100 dark:bg-blue-900/30',
      textClass: 'text-blue-500 dark:text-blue-400',
      action: () => navigate('/profile/edit') // NAVEGA A LA NUEVA PANTALLA
    },
    { 
      icon: 'notifications', 
      label: 'Recordatorios', 
      subtitle: 'Configurar alertas diarias',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
      textClass: 'text-yellow-500 dark:text-yellow-400',
      action: () => navigate('/profile/reminders') // NAVEGA A LA NUEVA PANTALLA
    },
    { 
      icon: 'support_agent', 
      label: 'Soporte', 
      subtitle: 'Ayuda técnica de la app',
      bgClass: 'bg-green-100 dark:bg-green-900/30',
      textClass: 'text-green-500 dark:text-green-400',
      action: () => alert('El soporte técnico estará disponible muy pronto.') 
    },
    { 
      icon: 'medical_services', 
      label: 'Soporte Médico', 
      subtitle: 'Consulta con especialistas',
      bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
      textClass: 'text-indigo-500 dark:text-indigo-400',
      action: () => alert('El soporte médico estará disponible muy pronto.') 
    },
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28 font-display relative overflow-hidden transition-colors duration-300">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        
        {/* Header con Datos Dinámicos */}
        <div className="pt-12 px-6 pb-8 flex flex-col items-center relative">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl transform scale-110"></div>
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-glow overflow-hidden relative z-10 bg-card-lavender dark:bg-[#2d2438] transition-colors">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXo0viXGbD6zFUWwh7Czo4nqfLbcrqXIRYbO-5BQvjn8rXUPP3UaP2RUBJEAqm_h587rTPLEk5ktkkuqhIlNSSGWgLgYcBFnHCTJBJPJAoQBEjFD5qrfO3GFqKMjldnAVLiNAD41fck4ka1LWW_SjHRARkMHRaksDpyAXBq6n1gHO_vRvivC_M4qYKcDau9qixxa3q7vR7nqRCZ7TgUAAlfjBn1MWWyvGP7FUfUFKW3rmp1SiTiwM-uP79472f4yhdGErbNwiwnQ')" }}></div>
            </div>
            {/* El botoncito de editar de la imagen, ahora también navega a "Mis Datos" */}
            <button onClick={() => navigate('/profile/edit')} className="absolute bottom-1 right-1 bg-accent-mint text-white rounded-full p-1.5 border-2 border-white dark:border-gray-700 shadow-sm z-20 hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[16px] block">edit</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-extrabold text-text-main dark:text-white leading-tight mb-1">
            {userName || 'Usuario'}
          </h1>
          
          <div className="flex items-center gap-1.5 bg-card-lavender dark:bg-[#2d2438] px-3 py-1 rounded-full border border-white/50 dark:border-gray-700 shadow-sm transition-colors">
             <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
             <span className="text-xs font-bold text-primary-dark dark:text-primary-light">
               Nivel {level}: Guerrero de Espalda
             </span>
          </div>
          
          <div className="absolute top-10 right-4 w-16 h-16 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8qpkSRNGtrCJaEGob9A9rFwi-R0l0ouvGiIaTSYtjDCZGEL593ZOooQGaxT4xvQ2zXEA6r2nm8PcD0SYC9ezCtQuryHoWIFRamseTJ7Rt72UZNh-u8lTPDphB91xeS2WyglfPqoq98Ws5aI6xs4-_sTLVpANl0NeEOMb8lz9cOw5BFBrS6SlxrQ0Dhl78jFyeAGXVyjTsy15HAInkeEvMNPEFPm2jzSJXlvaXHypLcaH6qlToGmlrpZoWnLoGb7y5LjS1Wyyksw')", transform: 'scaleX(-1)' }}></div>
          </div>
        </div>

        {/* Stats Grid Dinámico */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24">
               <span className="text-2xl font-extrabold text-primary mb-1">{progress.currentStreak}</span>
               <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Días<br/>Seguidos</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24">
               <span className="text-2xl font-extrabold text-accent-mint mb-1">{achievements}</span>
               <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Logros<br/>Totales</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
               <span className="material-symbols-outlined text-primary text-2xl mb-1">military_tech</span>
               <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Nivel {level}<br/>Actual</span>
            </div>
          </div>
        </div>

        {/* Settings List Interactivo */}
        <div className="px-6 space-y-3">
          {menuItems.map((item, index) => (
            <button 
              key={index} 
              onClick={item.action}
              className="w-full bg-white dark:bg-[#231e33] rounded-[1.5rem] p-4 shadow-sm border border-white/60 dark:border-gray-700 flex items-center gap-4 group hover:shadow-glow-sm transition-all active:scale-[0.98]"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgClass} ${item.textClass} group-hover:scale-110 transition-transform`}>
                 <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <div className="flex-1 text-left">
                 <h4 className="text-sm font-bold text-text-main dark:text-white">{item.label}</h4>
                 <p className="text-[11px] text-gray-500">{item.subtitle}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
            </button>
          ))}

          <button 
            onClick={handleLogout}
            className="w-full mt-2 bg-transparent rounded-[1.5rem] p-3 flex items-center justify-center gap-2 group transition-all opacity-60 hover:opacity-100"
          >
             <span className="material-symbols-outlined text-red-400 text-[18px]">logout</span>
             <span className="text-xs font-bold text-red-400">Cerrar Sesión</span>
          </button>
        </div>
        
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ProfileScreen;
