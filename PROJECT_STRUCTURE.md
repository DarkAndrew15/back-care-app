# Estructura del Proyecto BackCare

## Descripción General

BackCare es una aplicación móvil desarrollada con React y TypeScript que proporciona un protocolo clínicamente validado para el cuidado de la espalda, específicamente basado en el Protocolo Dr. McGill. La aplicación está diseñada para ayudar a los usuarios a reducir el dolor de espalda mediante rutinas y ejercicios guiados.

El objetivo principal de la aplicación es ofrecer una solución digital accesible para personas que sufren de dolores de espalda, proporcionando un enfoque sistemático y científico para la rehabilitación y prevención. La aplicación sigue el "Protocolo Dr. McGill", un enfoque clínicamente validado desarrollado por el Dr. Stuart McGill, reconocido experto en biomecánica de la columna vertebral.

## Resumen del Proyecto

BackCare representa una solución integral para el manejo del dolor de espalda, combinando ciencia del ejercicio con tecnología moderna. La aplicación guía a los usuarios a través de diferentes fases del protocolo, comenzando con la "Fase 1: Apagar la Alarma (4 semanas)", que se centra en reducir la inflamación y el dolor inicial.

La aplicación incluye características clave como:
- Rutinas personalizadas basadas en el estado físico y necesidades del usuario
- Seguimiento del progreso con métricas visuales
- Ejercicios con instrucciones detalladas y temporizadores
- Diseño centrado en la experiencia del usuario con interfaz intuitiva
- Modo oscuro para mayor comodidad visual
- Integración potencial con inteligencia artificial para personalización avanzada

El proyecto está estructurado siguiendo buenas prácticas de desarrollo frontend moderno, con componentes reutilizables, tipado estático con TypeScript y estilos consistentes con Tailwind CSS.

## Tecnologías Utilizadas

- **React 19.2.4**: Biblioteca JavaScript para construir interfaces de usuario interactivas
- **TypeScript ~5.8.2**: Superset de JavaScript que añade tipado estático para mejorar la calidad del código
- **React Router DOM 7.13.0**: Biblioteca para la gestión de rutas y navegación entre pantallas
- **Tailwind CSS**: Framework de CSS utilitario para estilos rápidos y consistentes
- **PostCSS**: Herramienta para transformar CSS con JavaScript
- **Vite 6.2.0**: Herramienta de construcción rápida para proyectos web modernos con recarga instantánea
- **Firebase**: Plataforma de Google para aplicaciones móviles y web
- **Material Symbols**: Iconos de Google Material Design para una interfaz visualmente coherente
- **Node.js**: Entorno de ejecución para JavaScript en el lado del servidor
- **Import Maps**: Sistema para mapear dependencias sin necesidad de empaquetador

## Estructura de Directorios

```
backcare/
├── .env.local                 # Variables de entorno locales
├── .gitignore                 # Archivos ignorados por Git
├── App.tsx                    # Componente principal de la aplicación con rutas
├── index.html                 # Punto de entrada HTML
├── index.tsx                  # Punto de entrada de la aplicación React
├── metadata.json              # Metadatos del proyecto
├── package.json               # Dependencias y scripts del proyecto
├── pnpm-lock.yaml             # Archivo de bloqueo de dependencias de pnpm
├── postcss.config.js          # Configuración de PostCSS
├── PROJECT_STRUCTURE.md       # Documentación de la estructura del proyecto
├── README.md                  # Documentación básica del proyecto
├── tailwind.config.js         # Configuración de Tailwind CSS
├── tsconfig.json              # Configuración de TypeScript
├── types.ts                   # Tipos extendidos para la UI (incluye why, rest, hold, etc.)
├── vite.config.ts             # Configuración de Vite con alias @/
├── src/                       # Código fuente principal
│   ├── components/            # Componentes reutilizables
│   │   └── BottomNavigation.tsx # Componente de navegación inferior
│   ├── screens/               # Pantallas de la aplicación
│   │   ├── CompletedScreen.tsx # Pantalla de ejercicio completado y registro de dolor
│   │   ├── ExerciseScreen.tsx # Pantalla de ejecución de ejercicio con temporizador circular
│   │   ├── HomeScreen.tsx     # Pantalla principal con dashboard de progreso
│   │   ├── OnboardingScreen.tsx # Pantalla de bienvenida
│   │   ├── ProfileScreen.tsx  # Perfil del usuario
│   │   ├── ProgressScreen.tsx # Seguimiento del progreso
│   │   ├── RestScreen.tsx     # Pantalla de descanso entre series
│   │   └── RoutineDetailScreen.tsx # Detalles de rutina (pasa datos vía Base64 en URL)
    ├───services/              # Servicios y lógica de negocio
    │   ├───firebase.ts        # Configuración y funciones de Firebase
    │   └───storage.ts         # Servicio de persistencia local (localStorage) y lógica de rachas
    ├───firebase.ts            # Configuración de Firebase
│   ├── index.css              # Estilos CSS con Tailwind
│   └── types.ts               # Tipos base para servicios y persistencia
└── public/                    # Assets estáticos
    └── images/                # Imágenes locales (Anime y Ejercicios)
```

## Descripción de Componentes

### Archivo Principal

- **App.tsx**: Componente principal que gestiona la navegación entre pantallas usando React Router DOM. Define rutas para onboarding, home, rutinas, ejercicios, descanso, completado, progreso y perfil. Utiliza HashRouter para compatibilidad con aplicaciones alojadas estáticamente. **Nota:** Se utiliza un patrón de paso de estado mediante objetos serializados en Base64 dentro de las URLs para mantener la fluidez entre pantallas sin dependencia de un store global.

### Carpetas

#### components/
- **BottomNavigation.tsx**: Componente reutilizable de navegación inferior con tres opciones (Inicio, Progreso, Perfil) que cambia según el tema (púrpura o menta). Utiliza hooks de React Router DOM para determinar la ruta activa y aplicar estilos correspondientes.

#### screens/
- **OnboardingScreen.tsx**: Pantalla de bienvenida que introduce la aplicación y sus beneficios. Presenta características clave como rutinas matutinas, seguimiento de progreso y protocolo clínicamente validado. Incluye un botón para comenzar el protocolo que redirige al usuario a la pantalla principal. La imagen de cabecera ahora utiliza una imagen local en lugar de una URL externa.

- **HomeScreen.tsx**: Pantalla principal que muestra el progreso del usuario con un círculo de porcentaje visual, estadísticas de racha (streak) y rutinas disponibles organizadas en tarjetas. Las rutinas se presentan con imágenes, descripciones y estados (activo, pendiente, bloqueado). **Nota:** Recupera datos de racha y sesiones directamente desde `storage.ts`.

- **RoutineDetailScreen.tsx**: Muestra los detalles de una rutina específica, incluyendo ejercicios incluidos, duración total y objetivos. Permite al usuario iniciar la rutina o ver detalles individuales de cada ejercicio. El botón de retroceso navega explícitamente a '/home' para evitar bucles en el historial de navegación. Al iniciar, captura el `startTime` de la sesión. La pantalla ahora incluye información detallada de la rutina "Los 3 Grandes de McGill" con todos sus ejercicios y descripciones completas.

- **ExerciseScreen.tsx**: Interfaz para realizar un ejercicio específico con temporizador integrado, instrucciones paso a paso, consejos técnicos y advertencias de seguridad. Incluye controles de reproducción/pausa, volumen y opción de saltar ejercicio. Gestiona la transición inteligente a la pantalla de descanso entre series o ejercicios y mantiene el `startTime` para el cálculo final de duración. La pantalla ahora incluye secciones adicionales para mostrar la explicación científica del ejercicio ("¿Por qué este ejercicio?") y las indicaciones de descanso/recovery.

- **CompletedScreen.tsx**: Confirma la finalización exitosa de la rutina. Calcula la duración total de la sesión mediante el `startTime` recibido y permite al usuario registrar sus niveles de dolor (inicial y final) utilizando una escala visual de emojis estándar. Implementa el guardado automático de la sesión en el almacenamiento local a través de `storage.ts`.

- **ProgressScreen.tsx**: Visualización detallada del progreso del usuario a lo largo del tiempo, mostrando gráficos, estadísticas semanales y hitos alcanzados basándose en los datos persistidos localmente.

- **RestScreen.tsx**: Pantalla de descanso entre series (30s) o ejercicios (60s). Incluye un temporizador, consejos de respiración y previsualización del siguiente ejercicio. Asegura la persistencia del `startTime` durante las transiciones de vuelta a los ejercicios.

- **ProfileScreen.tsx**: Sección de perfil del usuario donde se puede acceder a la información personal, configuración de la cuenta, preferencias y datos de salud relacionados con el programa de cuidado de espalda.

### Otros Archivos Importantes

- **types.ts (Raíz)**: Define interfaces para Rutina (`Routine`) y Ejercicio (`Exercise`), y un enum para temas de navegación (`NavTheme`). La interfaz de Ejercicio ahora incluye propiedades adicionales como `duration`, `sets`, `reps`, `hold`, `repsOrDuration`, `instructions`, `warnings`, `tips`, `description`, `why` y `rest`. Se considera la referencia principal para la interfaz de usuario.
- **src/types.ts**: Versión simplificada de los tipos con interfaces enfocadas en `Firebase`, `Session` y `WorkoutSession`.
- **index.html**: Punto de entrada HTML que configura Tailwind CSS, fuentes de Google (Plus Jakarta Sans, Manrope, Quicksand, Dancing Script), Material Symbols y estilos básicos. Incluye una configuración de Tailwind personalizada con colores específicos para la aplicación y estilos optimizados para dispositivos móviles. Se han eliminado scripts de Tailwind CDN y configuración de Tailwind inline para usar la configuración correcta de PostCSS.
- **src/index.css**: Archivo de estilos que incluye las directivas de Tailwind y estilos personalizados para los iconos Material Symbols.
- **vite.config.ts**: Configuración del servidor de desarrollo de Vite, incluyendo puerto (3000), host (0.0.0.0), plugin de React, alias `@/` y definición de variables de entorno para la API de Gemini.
- **tailwind.config.js**: Configuración de Tailwind CSS con colores personalizados, tipografías y sombras específicas para la aplicación.
- **postcss.config.js**: Configuración de PostCSS con plugins de Tailwind CSS y Autoprefixer. Se ha corregido la configuración para usar `tailwindcss` y `autoprefixer` en lugar de `@tailwindcss/postcss`.
- **package.json**: Define dependencias del proyecto (React, React DOM, React Router DOM) y scripts de desarrollo.
- **index.tsx**: Punto de entrada principal de la aplicación React que monta el componente App en el elemento raíz del DOM. Incluye manejo de errores para asegurar que el elemento raíz exista antes de montar la aplicación.
- **src/firebase.ts**: Configuración de la aplicación Firebase con credenciales desde variables de entorno.
- **src/services/firebase.ts**: Funciones para interactuar con Firestore, incluyendo operaciones CRUD para rutinas, sesiones y progreso del usuario.
- **src/services/storage.ts**: Sistema de persistencia local que gestiona el historial de entrenamientos, cálculo automático de rachas (streaks) diarias y estadísticas mensuales sin necesidad de conexión.

## Características Principales

1. **Protocolo Dr. McGill**: Basado en el protocolo clínicamente validado del Dr. Stuart McGill para el cuidado de la espalda.
2. **Rutinas Guiadas**: Diferentes rutinas organizadas por categorías (mañana, pausas activas, recuperación nocturna).
3. **Seguimiento de Progreso**: Visualización del progreso con círculos de porcentaje y estadísticas de racha.
4. **Ejercicios Interactivos**: Temporizador, instrucciones paso a paso y consejos técnicos durante los ejercicios.
5. **Diseño Responsivo**: Optimizado para dispositivos móviles con vistas que se adaptan a diferentes tamaños de pantalla.
6. **Modo Oscuro**: Soporte para modo oscuro en toda la aplicación.
7. **Navegación Intuitiva**: Sistema de navegación inferior con acceso rápido a las secciones principales.
8. **Explicaciones Científicas**: Cada ejercicio incluye una explicación del porqué es beneficioso para la espalda.
9. **Indicaciones de Descanso**: Información específica sobre tiempos y técnicas de descanso entre ejercicios y series.

## Variables de Entorno

- `GEMINI_API_KEY`: Clave de API para servicios de inteligencia artificial de Gemini (definida en `.env.local`).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Crea una versión optimizada para producción
- `npm run preview`: Previsualiza la versión de producción localmente

## Cambios Recientes

Durante la última sesión de desarrollo, se realizaron los siguientes cambios importantes:

1. **Corrección de configuración de Tailwind CSS**: Se actualizó `postcss.config.js` para usar la configuración correcta de `tailwindcss` y `autoprefixer` en lugar del plugin incorrecto `@tailwindcss/postcss`.

2. **Actualización de la pantalla de Onboarding**: Se cambió la imagen de cabecera de una URL externa a una imagen local (`/images/anime/NarutoMeditando.png`).

3. **Actualización de la interfaz de tipos**: Se amplió la interfaz `Exercise` en `types.ts` para incluir propiedades adicionales como `duration`, `sets`, `reps`, `hold`, `repsOrDuration`, `instructions`, `warnings`, `tips`, `description`, `why` y `rest`.

4. **Mejora de la pantalla de detalle de rutina**: Se actualizó `RoutineDetailScreen.tsx` con la información completa de la rutina "Los 3 Grandes de McGill" con todos sus ejercicios y descripciones detalladas.

5. **Mejora de la pantalla de ejercicio**: Se añadieron secciones adicionales en `ExerciseScreen.tsx` para mostrar la explicación científica del ejercicio ("¿Por qué este ejercicio?") y las indicaciones de descanso/recovery.

6. **Corrección de la estructura de index.html**: Se eliminaron scripts de Tailwind CDN y configuración de Tailwind inline para permitir que funcione correctamente con la configuración de PostCSS.

7. **Implementación de Estado en URL**: Se adoptó el uso de Base64 para pasar objetos de rutina completos entre pantallas, reduciendo la necesidad de un store global complejo para el flujo de ejercicios.

8. **Refinamiento de Persistencia Local**: Se actualizó `storage.ts` para incluir la lógica de cálculo de rachas diarias y almacenamiento de sesiones completas con métricas de dolor.

9. **Consolidación de Assets**: Migración de imágenes a la carpeta `/public/images/` para asegurar la disponibilidad offline y mejorar la estética con personajes de anime.

10. **Dualidad de Tipos Identificada**: Se documentó la existencia de dos archivos `types.ts` y su uso diferenciado entre la UI (raíz) y los servicios (src).

11. **Actualización de imágenes en RoutineDetailScreen**: Se cambió la imagen de portada a `/images/anime/GokuBannerEjercicioPiso.png`, se agregó un sticker chibi con la imagen `/images/anime/GokuChibiBannerSerio.png` y se actualizó la imagen del coach motivacional a `/images/anime/GokuBustoAnimo.png`.

12. **Ajuste de tamaño de imagen del coach**: Se aumentó el tamaño del contenedor de la imagen del coach de 32x32px a 60x60px en `RoutineDetailScreen.tsx`.

13. **Reestructuración del HERO CARD**: Se reestructuró el componente HERO CARD en `RoutineDetailScreen.tsx` para incluir un contenedor principal con posición relativa que permite el posicionamiento absoluto del sticker chibi.

14. **Implementación de modal de confirmación de salida**: Se agregó un estado `showExitModal` en `ExerciseScreen.tsx` y se implementó un modal de confirmación personalizado para la salida del ejercicio, reemplazando el uso de `window.confirm`.

15. **Actualización de imágenes en todas las pantallas**: Se actualizaron las imágenes de personajes animados en varias pantallas (`CompletedScreen.tsx`, `HomeScreen.tsx`, `OnboardingScreen.tsx`, `ProfileScreen.tsx`, `ProgressScreen.tsx`) para usar personajes de anime como Goku y Naruto en lugar de imágenes anteriores.

16. **Mejora de la UX con personajes animados**: Se incorporaron personajes animados de anime en múltiples pantallas para mejorar la experiencia del usuario y hacer la aplicación más atractiva visualmente.