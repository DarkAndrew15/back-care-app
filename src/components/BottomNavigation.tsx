import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavTheme } from '../types';

interface BottomNavigationProps {
  theme?: NavTheme;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ theme = NavTheme.Purple }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeColor = theme === NavTheme.Mint ? 'text-primary' : 'text-purple-main';
  const inactiveColor = 'text-gray-300 dark:text-gray-400';

  const navItems = [
    { icon: 'home', label: 'Inicio', path: '/home' },
    { icon: 'bar_chart', label: 'Progreso', path: '/progress' },
    { icon: 'person', label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] z-50">
      <div className="glass-nav dark:bg-[#231e33] dark:backdrop-blur-xl rounded-[2rem] shadow-2xl p-2 flex justify-between items-center border border-white/50 dark:border-gray-700 transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 group relative transition-all duration-300`}
            >
              {isActive ? (
                <div className="relative">
                   <div className={`absolute inset-0 ${theme === NavTheme.Mint ? 'bg-primary/30' : 'bg-purple-main/30'} blur-md rounded-full transform scale-125`}></div>
                   <span className={`relative material-symbols-outlined ${activeColor} text-[28px]`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                     {item.icon}
                   </span>
                </div>
              ) : (
                <span className={`material-symbols-outlined ${inactiveColor} group-hover:${activeColor} transition-colors text-[28px]`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 500" }}>
                  {item.icon}
                </span>
              )}
              
              {isActive && (
                <span className={`text-[10px] font-bold ${activeColor}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;