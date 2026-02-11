/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ CORREGIDO: Primary ahora es MINT (era morado antes)
        'primary': '#2beebd',           // Mint vibrante
        'primary-dark': '#20b28d',      // Mint oscuro
        'primary-light': '#6EE7B7',     // Mint claro
        
        // Colores Purple (secundarios)
        'purple-main': '#9F7AEA',
        'purple-light': '#E9D8FD',
        'purple-dark': '#805AD5',       // ✅ Corregido de #6B46C1
        
        // Colores Mint adicionales
        'accent-mint': '#6EE7B7',
        'mint': '#6EE7B7',
        'mint-light': '#9FF2DC',
        'mint-dark': '#2BEEBB',
        
        // Backgrounds
        'background-light': '#FFFDF5',
        'background-dark': '#191121',   // ✅ Corregido de #1A1625
        
        // Cards
        'card-lavender': '#F3E8FF',
        'card-subtle': '#FAF5FF',       // ✅ Corregido de #F8F6F2
        
        // Text
        'text-main': '#2D2438',
        'text-secondary': '#6b7280',
        
        // Accents
        'accent-pink': '#f4dee8',       // ✅ AGREGADO (faltaba)
        'accent-yellow': '#FFF9E6',     // ✅ Corregido de #FDE68A
        'accent-yellow-border': '#FFEBB0',
        'accent-blue': '#DBEAFE',
        'accent-green': '#D1FAE5',
        'accent-rose': '#FCE7F3',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      boxShadow: {
        'card': '0 8px 24px -4px rgba(159, 122, 234, 0.12)',
        'soft': '0 4px 12px -2px rgba(159, 122, 234, 0.08)',
        'glow': '0 8px 32px -4px rgba(159, 122, 234, 0.3)',
        'float': '0 12px 48px -8px rgba(159, 122, 234, 0.2)',
      },
      backgroundImage: {
        // ✅ Corregido: gradient usa #2beebd en vez de #6EE7B7
        'mint-gradient': 'linear-gradient(135deg, #2beebd 0%, #20b28d 100%)',
        'purple-gradient': 'linear-gradient(135deg, #9F7AEA 0%, #6B46C1 100%)',
        'gradient-ring': 'linear-gradient(90deg, #9F7AEA 0%, #6EE7B7 100%)',
      },
      borderRadius: {
        '2rem': '2rem',
      },
    },
  },
  plugins: [],
};
