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
        id: 'mcgill-1',
        name: 'Curl-Up (Abdominal Modificado)',
        target: 'Núcleo',
        duration: 300,
        sets: 3,
        reps: 9,
        hold: 10,
        repsOrDuration: 'Pirámide 5-3-1',
        description: 'Protege la columna mientras fortalece la pared abdominal anterior.',
        image: '/images/exercises/curl-up.jpg',
        avatar: '/images/exercises/curl-up.jpg',
        instructions: [
          'Acuéstate boca arriba, flexiona una rodilla y estira la otra pierna.',
          'Coloca tus manos debajo de la zona lumbar para mantener su curva natural.',
          'Levanta ligeramente la cabeza y los hombros como un bloque rígido.',
          'Aplica la pirámide descendente: Serie 1 (5 reps), Serie 2 (3 reps), Serie 3 (1 rep).',
          'Mantén cada repetición rígida por 10 segundos y luego baja lentamente.'
        ],
        warnings: [
          'DOBLA LA RODILLA DEL LADO MÁS SENSIBLE (si tienes dolor de un solo lado). Si no, altérnalas en cada serie.',
          'No flexiones el cuello ni empujes la barbilla hacia el pecho.',
          'El movimiento debe ser mínimo, no es un "crunch" tradicional.'
        ],
        tips: [
          'Imagina que tu cabeza y hombros están sobre una báscula y solo quieres quitarles el peso.'
        ],
        why: 'A diferencia de los abdominales tradicionales que aplastan los discos lumbares, el Curl-Up activa el recto abdominal sin flexionar la columna.',
        rest: 'Micro-pausas de 3s. 30s de descanso entre series.'
      },
      {
        id: 'mcgill-2',
        name: 'Plancha Lateral (Side Plank)',
        target: 'Oblicuos',
        duration: 300,
        sets: 3,
        reps: 9, // Mantenemos 9 para la lógica 5-3-1
        hold: 10,
        repsOrDuration: 'Pirámide 5-3-1',
        description: 'El mejor ejercicio para los oblicuos y el cuadrado lumbar, esenciales para la estabilidad lateral.',
        image: '/images/exercises/side-plank.jpg',
        avatar: '/images/exercises/side-plank.jpg',
        instructions: [
          'Acuéstate de lado apoyándote sobre tu antebrazo y rodillas (o pies).',
          'Eleva las caderas hasta formar una línea recta desde la cabeza hasta las rodillas/pies.',
          'Aplica la pirámide por CADA LADO: Serie 1 (5 reps), Serie 2 (3 reps), Serie 3 (1 rep).',
          'Mantén la postura rígida por 10 segundos en cada repetición.'
        ],
        warnings: [
          'EMPIEZA SIEMPRE POR TU LADO SIN DOLOR. Luego pasa al lado más sensible.',
          'No dejes que las caderas caigan hacia el suelo.',
          'Evita rotar el torso; mantén el pecho mirando hacia adelante.'
        ],
        tips: [
          'Aprieta los glúteos y el abdomen como si fueras a recibir un golpe.'
        ],
        why: 'Crea una "faja" muscular natural que previene que la columna se doble hacia los lados bajo carga, protegiendo los nervios espinales.',
        rest: 'Micro-pausas de 3s. 30s de descanso entre series.'
      },
      {
        id: 'mcgill-3',
        name: 'Bird-Dog (Perro-Pájaro)',
        target: 'Espalda Baja',
        duration: 300,
        sets: 3,
        reps: 9,
        hold: 10,
        repsOrDuration: 'Pirámide 5-3-1',
        description: 'Desarrolla la musculatura extensora de la espalda de forma segura.',
        image: '/images/exercises/bird-dog.jpg',
        avatar: '/images/exercises/bird-dog.jpg',
        instructions: [
          'Ponte en cuadrupedia (manos debajo de los hombros, rodillas debajo de las caderas).',
          'Extiende simultáneamente el brazo derecho y la pierna izquierda.',
          'Aplica la pirámide por CADA LADO: Serie 1 (5 reps), Serie 2 (3 reps), Serie 3 (1 rep).',
          'Mantén la postura por 10 segundos, sintiendo la contracción en la espalda baja y glúteos.'
        ],
        warnings: [
          'EMPIEZA SIEMPRE POR TU LADO SIN DOLOR. Luego pasa al lado más sensible.',
          'No levantes la pierna más arriba de la cadera para evitar arquear la zona lumbar.',
          'No permitas que tu torso se tambalee de lado a lado.'
        ],
        tips: [
          'Imagina que tienes un vaso de agua en la espalda baja y no puedes derramarlo.',
          'Empuja el suelo con la mano de apoyo para estabilizar el hombro.'
        ],
        why: 'Activa los multífidos y erectores espinales (músculos de la espalda baja) con una compresión mínima sobre la columna vertebral.',
        rest: 'Micro-pausas de 3s. 30s de descanso entre series.'
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