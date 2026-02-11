// src/data/routines.ts

export const routinesData = {
  'morning-mcgill-big3': {
    id: 'morning-mcgill-big3',
    title: 'Los "3 Grandes" de McGill',
    subtitle: 'Tu medicina diaria - Protocolo Fase 1',
    category: 'FASE 1 • MATUTINO',
    duration: '10 min',
    description: 'Realízalos todos los días, preferiblemente antes de empezar tu jornada. Estos ejercicios crean una "armadura" protectora para tu columna sin movimiento dañino.',
    image: '/images/anime/GokuBannerEjercicioPiso.png',
    exercises: [
      {
        id: 'curl-up',
        name: 'Curl-Up Modificado',
        target: 'RECTO ABDOMINAL (CORE ANTERIOR)',
        sets: 3,
        reps: 5,
        hold: '10s',
        repsOrDuration: '5 reps × 10s',
        description: 'Crea una "faja" frontal protectora sin doblar la columna vertebral',
        image: '/images/exercises/curl-up.jpg',
        avatar: '/images/exercises/curl-up.jpg',
        instructions: [
          'Túmbate boca arriba. Una pierna estirada, la otra doblada (esto bloquea la pelvis para que no te duela)',
          'Pon tus manos debajo de tu zona lumbar para mantener el arco natural',
          'Levanta solo la cabeza y los hombros unos centímetros del suelo',
          'Aguanta 10 segundos manteniendo la tensión en el abdomen',
          'Baja controladamente y descansa entre repeticiones'
        ],
        warnings: [
          'NO aplastes la espalda contra el suelo - mantén siempre el arco lumbar',
          'El movimiento debe ser mínimo (pocos centímetros) para proteger tu espalda',
          'Si sientes dolor agudo en la zona lumbar, detente inmediatamente'
        ],
        tips: [
          'Imagina que estás endureciendo el abdomen para recibir un golpe',
          'La barbilla debe ir ligeramente hacia el pecho',
          'Respira normalmente durante el aguante, no contengas la respiración'
        ],
        why: 'Crea una "faja" frontal sin doblar la columna. Activa el músculo recto abdominal sin movimiento dañino, proporcionando estabilidad anterior a tu espalda baja y protegiendo el disco lesionado.',
        rest: 'Descansa 3-5 segundos entre cada repetición. Descansa 30-45 segundos entre series.'
      },
      {
        id: 'side-plank',
        name: 'Puente Lateral (Side Plank)',
        target: 'CUADRADO LUMBAR Y OBLICUOS',
        sets: 3,
        reps: 'Por cada lado',
        hold: '10s',
        repsOrDuration: '10s × cada lado',
        description: 'Fortalece el músculo que estabiliza tu zona de dolor pulsátil',
        image: '/images/exercises/side-plank.jpg',
        avatar: '/images/exercises/side-plank.jpg',
        instructions: [
          'Túmbate de lado apoyado en el codo y las rodillas (versión fácil para Fase 1)',
          'Levanta la cadera para que tu cuerpo forme una línea recta',
          'El brazo libre ponlo sobre el hombro contrario',
          'Aguanta 10 segundos manteniendo la estabilidad sin balancearte',
          'Baja controladamente, cambia de lado y repite'
        ],
        warnings: [
          'Mantén el cuerpo en línea recta para evitar compensaciones',
          'NO dejes caer la cadera hacia el suelo',
          'Si es muy difícil, mantén las rodillas apoyadas todo el tiempo',
          'No contengas la respiración - respira normalmente'
        ],
        tips: [
          'Imagina que te empujan desde arriba y resistes con el core',
          'Contrae el abdomen y glúteos para mayor estabilidad',
          'Mira hacia adelante, no hacia abajo',
          'Si sientes temblor es normal - es la activación muscular'
        ],
        why: 'Este ejercicio fortalece el Cuadrado Lumbar, el músculo principal que estabiliza tu zona de dolor (encima de la pelvis) y evita que las vértebras se deslicen. Es VITAL para tu dolor "pulsátil" ya que previene el movimiento lateral no deseado.',
        rest: 'Descansa 5 segundos al cambiar de lado. Descansa 30-45 segundos entre series.'
      },
      {
        id: 'bird-dog',
        name: 'Pájaro-Perro (Bird-Dog)',
        target: 'MULTÍFIDOS Y CADENA POSTERIOR',
        sets: 3,
        reps: 5,
        hold: '8-10s',
        repsOrDuration: '5 reps × 8-10s por lado',
        description: 'Activa músculos profundos de la columna sin carga compresiva',
        image: '/images/exercises/bird-dog.jpg',
        avatar: '/images/exercises/bird-dog.jpg',
        instructions: [
          'Colócate en cuatro patas (posición de cuadrupedia): manos bajo hombros, rodillas bajo caderas',
          'Estira una pierna hacia atrás y el brazo contrario hacia adelante simultáneamente',
          '¡OJO! NO busques altura, busca LONGITUD. Imagina que quieres tocar la pared de enfrente y la de atrás',
          'Mantén la espalda como una mesa completamente inmóvil (sin arquear ni rotar)',
          'Cierra el puño fuerte para activar más músculos de la cadena',
          'Aguanta 8-10 segundos y regresa controladamente',
          'Cambia de lado (pierna contraria y brazo contrario)'
        ],
        warnings: [
          'NO arquees la espalda buscando altura del brazo o pierna',
          'Mantén la columna neutral como una tabla en todo momento',
          'El movimiento debe ser lento y extremadamente controlado',
          'NO permitas rotación de caderas o hombros'
        ],
        tips: [
          'Imagina balancear un vaso de agua en tu espalda baja sin derramarlo',
          'El movimiento debe sentirse como estiramiento, no como elevación',
          'Respira normalmente, no aguantes la respiración',
          'Enfócate en la estabilidad, no en llegar más lejos'
        ],
        why: 'Activa los multífidos (músculos profundos de la columna vertebral) sin poner carga compresiva peligrosa. Enseña a tu espalda a mantenerse estable mientras tus extremidades se mueven, exactamente lo que necesitas hacer en el trabajo de bodega cargando cajas.',
        rest: 'Descansa 3-5 segundos entre cada lado. Descansa 45-60 segundos entre series.'
      }
    ]
  },
  'daytime-hygiene': {
    id: 'daytime-hygiene',
    title: 'Higiene de Columna',
    subtitle: 'Desactivar el Gatillo',
    category: 'FASE 1 • DÍA',
    duration: '5 min',
    description: 'Pausas activas diseñadas para aliviar la presión sobre los discos intervertebrales acumulada por estar sentado. Hazlas cada 45 minutos.',
    image: '/images/anime/NarutoMeditando.png', // Reemplazar por una imagen acorde si lo deseas
    exercises: [
      {
        id: 'micro-breaks',
        name: 'Microroturas de Sedestación',
        target: 'DESCOMPRESIÓN DISCAL',
        sets: 1,
        reps: 5,
        hold: '2s',
        repsOrDuration: '5 reps',
        description: 'Empuja el material del disco hacia su centro',
        image: '/images/exercises/extension.jpg',
        avatar: '/images/exercises/extension.jpg',
        instructions: [
          'Levántate de la silla',
          'Pon las manos en tus riñones (zona baja de la espalda)',
          'Arquea MUY suavemente la espalda hacia atrás (extensión suave)',
          'Repite 5 veces cada 45 minutos de trabajo'
        ],
        warnings: ['El movimiento debe ser suave, sin forzar', 'Si genera dolor punzante, reduce el arco'],
        tips: ['Usa este tiempo para respirar profundo y relajar los hombros'],
        why: 'Esto empuja el material del disco hacia su centro y alivia la presión posterior acumulada por estar sentado (flexión sostenida).',
        rest: 'N/A'
      }
    ]
  },
  'night-ritual': {
    id: 'night-ritual',
    title: 'Ritual Neuro-Bioquímico',
    subtitle: 'Apagar la Alerta en el Cerebro',
    category: 'FASE 1 • NOCTURNO',
    duration: '15 min',
    description: 'Ataquemos la memoria de dolor. Tómate tu Leche Dorada y prepara el cuerpo para el sueño profundo donde ocurre la verdadera regeneración.',
    image: '/images/anime/NarutoMeditando.png',
    exercises: [
      {
        id: 'neurodinamia',
        name: 'Neurodinamia Suave',
        target: 'SISTEMA NERVIOSO',
        sets: 1,
        reps: 15,
        hold: '1s',
        repsOrDuration: '15 bombeos',
        description: 'Deslizamiento del nervio ciático sin estirarlo',
        image: '/images/exercises/neuro.jpg',
        avatar: '/images/exercises/neuro.jpg',
        instructions: [
          'Siéntate al borde de la cama o silla',
          'Estira la pierna con dolor (rodilla recta) y a la vez echa la cabeza hacia atrás mirando al techo',
          'Dobla la rodilla (baja el pie) y a la vez lleva la barbilla al pecho',
          'Realiza el movimiento rítmico como si fuera un bombeo'
        ],
        warnings: ['NUNCA debes sentir dolor agudo, solo tensión suave', 'No mantengas la posición, es un movimiento constante'],
        tips: ['Haz el movimiento fluido y lento', 'Acompaña el ritmo con tu respiración'],
        why: 'Esto no estira el nervio, lo "desliza" dentro de su vaina. Ayuda a oxigenarlo y a decirle al cerebro: "Mira, puedo mover el nervio sin peligro".',
        rest: 'N/A'
      },
      {
        id: 'seguridad-cognitiva',
        name: 'Ejercicio de Seguridad',
        target: 'AMÍGDALA (CEREBRO)',
        sets: 1,
        reps: 1,
        hold: '5 min',
        repsOrDuration: '5 minutos de respiración',
        description: 'Desactivar la hipervigilancia para entrar en fase REM',
        image: '/images/exercises/breathe.jpg',
        avatar: '/images/exercises/breathe.jpg',
        instructions: [
          'Acuéstate en la cama con las luces apagadas',
          'Pon una mano en el pecho y otra en el abdomen',
          'Respira lento inflando el abdomen',
          'Repite mentalmente: "Estoy en mi cama, estoy seguro. Mi espalda sana. No necesito estar alerta"'
        ],
        warnings: ['Si la mente se distrae, suavemente vuelve a la frase'],
        tips: ['Visualiza cómo la tensión sale de tu cuerpo con cada exhalación'],
        why: 'Tu cerebro sigue en modo "cuidador de hospital" (hipervigilancia). Necesitamos desactivar el centro del miedo para que entres en sueño profundo, único momento donde se regeneran tejidos.',
        rest: 'N/A'
      }
    ]
  }
};