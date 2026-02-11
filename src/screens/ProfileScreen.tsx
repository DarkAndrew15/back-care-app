import React from 'react';
import BottomNavigation from '../components/BottomNavigation';

const ProfileScreen: React.FC = () => {
  const menuItems = [
    { icon: 'manage_accounts', label: 'My Data', color: 'bg-blue-100 text-blue-500' },
    { icon: 'notifications', label: 'Reminders', color: 'bg-yellow-100 text-yellow-500' },
    { icon: 'support_agent', label: 'Support', color: 'bg-green-100 text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-darkbg pb-24">
      {/* Header */}
      <div className="pt-12 px-6 pb-8 flex flex-col items-center relative">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl transform scale-110"></div>
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-glow overflow-hidden relative z-10 bg-card-lavender">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXo0viXGbD6zFUWwh7Czo4nqfLbcrqXIRYbO-5BQvjn8rXUPP3UaP2RUBJEAqm_h587rTPLEk5ktkkuqhIlNSSGWgLgYcBFnHCTJBJPJAoQBEjFD5qrfO3GFqKMjldnAVLiNAD41fck4ka1LWW_SjHRARkMHRaksDpyAXBq6n1gHO_vRvivC_M4qYKcDau9qixxa3q7vR7nqRCZ7TgUAAlfjBn1MWWyvGP7FUfUFKW3rmp1SiTiwM-uP79472f4yhdGErbNwiwnQ')" }}></div>
          </div>
          <div className="absolute bottom-1 right-1 bg-accent-mint text-white rounded-full p-1.5 border-2 border-white shadow-sm z-20">
            <span className="material-symbols-outlined text-[16px] block">edit</span>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-text-main dark:text-white leading-tight mb-1">Hiro</h1>
        <div className="flex items-center gap-1.5 bg-card-lavender px-3 py-1 rounded-full border border-white/50 shadow-sm">
           <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
           <span className="text-xs font-bold text-primary-dark">Nivel 5: Guerrero de Espalda</span>
        </div>
        <div className="absolute top-10 right-4 w-16 h-16 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8qpkSRNGtrCJaEGob9A9rFwi-R0l0ouvGiIaTSYtjDCZGEL593ZOooQGaxT4xvQ2zXEA6r2nm8PcD0SYC9ezCtQuryHoWIFRamseTJ7Rt72UZNh-u8lTPDphB91xeS2WyglfPqoq98Ws5aI6xs4-_sTLVpANl0NeEOMb8lz9cOw5BFBrS6SlxrQ0Dhl78jFyeAGXVyjTsy15HAInkeEvMNPEFPm2jzSJXlvaXHypLcaH6qlToGmlrpZoWnLoGb7y5LjS1Wyyksw')", transform: 'scaleX(-1)' }}></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24">
             <span className="text-2xl font-extrabold text-primary mb-1">28</span>
             <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Días<br/>Seguidos</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24">
             <span className="text-2xl font-extrabold text-accent-mint mb-1">12</span>
             <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Logros<br/>Totales</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-card text-center border border-gray-50 dark:border-gray-700 h-24 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
             <span className="material-symbols-outlined text-primary text-2xl mb-1">military_tech</span>
             <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight">Nivel 5<br/>Actual</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 space-y-3">
        {menuItems.map((item, index) => (
          <button key={index} className="w-full bg-white dark:bg-[#231e33] rounded-[1.5rem] p-4 shadow-sm border border-white/60 dark:border-gray-700 flex items-center gap-4 group hover:shadow-glow-sm transition-all active:scale-[0.98]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color.includes('bg-') ? '' : 'bg-gray-100'} ${item.color.split(' ')[0]} text-white group-hover:scale-110 transition-transform`}>
               {/* Fixed color classes since item.color contains full tailwind classes */}
               <div className={`w-full h-full rounded-full flex items-center justify-center ${item.color.includes('blue') ? 'bg-blue-100 text-blue-500' : item.color.includes('yellow') ? 'bg-yellow-100 text-yellow-500' : 'bg-green-100 text-green-500'}`}>
                   <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
               </div>
            </div>
            <div className="flex-1 text-left">
               <h4 className="text-sm font-bold text-text-main dark:text-white">{item.label}</h4>
               <p className="text-[11px] text-gray-500">
                 {item.label === 'My Data' ? 'Editar perfil, peso y altura' : item.label === 'Reminders' ? 'Configurar alertas diarias' : 'Consulta con especialistas'}
               </p>
            </div>
            <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
          </button>
        ))}

        <button className="w-full bg-white dark:bg-[#231e33] rounded-[1.5rem] p-4 shadow-sm border border-white/60 dark:border-gray-700 flex items-center gap-4 group hover:shadow-glow-sm transition-all active:scale-[0.98]">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">medical_services</span>
            </div>
            <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-text-main dark:text-white">Soporte Médico</h4>
            <p className="text-[11px] text-gray-500">Consulta con especialistas</p>
            </div>
            <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
        </button>

        <button className="w-full mt-2 bg-transparent rounded-[1.5rem] p-3 flex items-center justify-center gap-2 group transition-all opacity-60 hover:opacity-100">
           <span className="material-symbols-outlined text-red-400 text-[18px]">logout</span>
           <span className="text-xs font-bold text-red-400">Cerrar Sesión</span>
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfileScreen;