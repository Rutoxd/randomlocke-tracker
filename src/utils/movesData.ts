export interface MoveEntry {
  nameEs: string;
  nameEn: string;
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
  pp: number;
}

export const MOVES_DATA: MoveEntry[] = [
  // ── NORMAL ──────────────────────────────────────────────────
  { nameEs: 'Destructor',        nameEn: 'pound',          type: 'normal',   category: 'physical', power: 40,  accuracy: 100, pp: 35 },
  { nameEs: 'Doble Bofetón',     nameEn: 'double-slap',    type: 'normal',   category: 'physical', power: 15,  accuracy: 85,  pp: 10 },
  { nameEs: 'Puño Cometa',       nameEn: 'comet-punch',    type: 'normal',   category: 'physical', power: 18,  accuracy: 85,  pp: 15 },
  { nameEs: 'Megapuño',          nameEn: 'mega-punch',     type: 'normal',   category: 'physical', power: 80,  accuracy: 85,  pp: 20 },
  { nameEs: 'Día de Pago',       nameEn: 'pay-day',        type: 'normal',   category: 'physical', power: 40,  accuracy: 100, pp: 20 },
  { nameEs: 'Arañazo',           nameEn: 'scratch',        type: 'normal',   category: 'physical', power: 40,  accuracy: 100, pp: 35 },
  { nameEs: 'Guillotina',        nameEn: 'guillotine',     type: 'normal',   category: 'physical', power: null,accuracy: 30,  pp: 5  },
  { nameEs: 'Viento Cortante',   nameEn: 'razor-wind',     type: 'normal',   category: 'special',  power: 80,  accuracy: 100, pp: 10 },
  { nameEs: 'Danza Espada',      nameEn: 'swords-dance',   type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Corte',             nameEn: 'cut',            type: 'normal',   category: 'physical', power: 50,  accuracy: 95,  pp: 30 },
  { nameEs: 'Torbellino',        nameEn: 'whirlwind',      type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Tacleada',          nameEn: 'tackle',         type: 'normal',   category: 'physical', power: 40,  accuracy: 100, pp: 35 },
  { nameEs: 'Golpe Cuerpo',      nameEn: 'body-slam',      type: 'normal',   category: 'physical', power: 85,  accuracy: 100, pp: 15 },
  { nameEs: 'Derribo',           nameEn: 'take-down',      type: 'normal',   category: 'physical', power: 90,  accuracy: 85,  pp: 20 },
  { nameEs: 'Doble Filo',        nameEn: 'double-edge',    type: 'normal',   category: 'physical', power: 120, accuracy: 100, pp: 15 },
  { nameEs: 'Golpe Cabeza',      nameEn: 'headbutt',       type: 'normal',   category: 'physical', power: 70,  accuracy: 100, pp: 15 },
  { nameEs: 'Megapatada',        nameEn: 'mega-kick',      type: 'normal',   category: 'physical', power: 120, accuracy: 75,  pp: 5  },
  { nameEs: 'Golpazo',           nameEn: 'slam',           type: 'normal',   category: 'physical', power: 80,  accuracy: 75,  pp: 20 },
  { nameEs: 'Constricción',      nameEn: 'wrap',           type: 'normal',   category: 'physical', power: 15,  accuracy: 90,  pp: 20 },
  { nameEs: 'Fuerza',            nameEn: 'strength',       type: 'normal',   category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Pisotón',           nameEn: 'stomp',          type: 'normal',   category: 'physical', power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Látigo de Cola',    nameEn: 'tail-whip',      type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 30 },
  { nameEs: 'Gruñido',           nameEn: 'growl',          type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 40 },
  { nameEs: 'Rugido',            nameEn: 'roar',           type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Canto',             nameEn: 'sing',           type: 'normal',   category: 'status',   power: null,accuracy: 55,  pp: 15 },
  { nameEs: 'Supersónico',       nameEn: 'supersonic',     type: 'normal',   category: 'status',   power: null,accuracy: 55,  pp: 20 },
  { nameEs: 'Explosión Sónica',  nameEn: 'sonic-boom',     type: 'normal',   category: 'special',  power: null,accuracy: 90,  pp: 20 },
  { nameEs: 'Anulación',         nameEn: 'disable',        type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Malicioso',         nameEn: 'leer',           type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 30 },
  { nameEs: 'Agilidad',          nameEn: 'agility',        type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 30 },
  { nameEs: 'Rapidez',           nameEn: 'quick-attack',   type: 'normal',   category: 'physical', power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Furia',             nameEn: 'rage',           type: 'normal',   category: 'physical', power: 20,  accuracy: 100, pp: 20 },
  { nameEs: 'Distorsión',        nameEn: 'mimic',          type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Chirrido',          nameEn: 'screech',        type: 'normal',   category: 'status',   power: null,accuracy: 85,  pp: 40 },
  { nameEs: 'Doble Equipo',      nameEn: 'double-team',    type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 15 },
  { nameEs: 'Recuperación',      nameEn: 'recover',        type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Fortaleza',         nameEn: 'harden',         type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 30 },
  { nameEs: 'Minimizar',         nameEn: 'minimize',       type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Cortina de Humo',   nameEn: 'smokescreen',    type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Hipnosis',          nameEn: 'hypnosis',       type: 'psychic',  category: 'status',   power: null,accuracy: 60,  pp: 20 },
  { nameEs: 'Reserva',           nameEn: 'stockpile',      type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Tragar',            nameEn: 'swallow',        type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Escupir',           nameEn: 'spit-up',        type: 'normal',   category: 'special',  power: null,accuracy: 100, pp: 10 },
  { nameEs: 'Normalizar',        nameEn: 'conversion',     type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 30 },
  { nameEs: 'Golpe Bajo',        nameEn: 'seismic-toss',   type: 'fighting', category: 'physical', power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Descanso',          nameEn: 'rest',           type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Golpe',             nameEn: 'swift',          type: 'normal',   category: 'special',  power: 60,  accuracy: null,pp: 20 },
  { nameEs: 'Hiperrayo',         nameEn: 'hyper-beam',     type: 'normal',   category: 'special',  power: 150, accuracy: 90,  pp: 5  },
  { nameEs: 'Maldición',         nameEn: 'curse',          type: 'ghost',    category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Atractivo',         nameEn: 'attract',        type: 'normal',   category: 'status',   power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Retorno',           nameEn: 'return',         type: 'normal',   category: 'physical', power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Frustración',       nameEn: 'frustration',    type: 'normal',   category: 'physical', power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Encanto',           nameEn: 'charm',          type: 'fairy',    category: 'status',   power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Truco',             nameEn: 'trick',          type: 'psychic',  category: 'status',   power: null,accuracy: 100, pp: 10 },
  { nameEs: 'Giro Bola',         nameEn: 'rollout',        type: 'rock',     category: 'physical', power: 30,  accuracy: 90,  pp: 20 },

  // ── FUEGO ───────────────────────────────────────────────────
  { nameEs: 'Puño Fuego',        nameEn: 'fire-punch',     type: 'fire',     category: 'physical', power: 75,  accuracy: 100, pp: 15 },
  { nameEs: 'Brasas',            nameEn: 'ember',          type: 'fire',     category: 'special',  power: 40,  accuracy: 100, pp: 25 },
  { nameEs: 'Lanzallamas',       nameEn: 'flamethrower',   type: 'fire',     category: 'special',  power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Niebla Humo',       nameEn: 'smog',           type: 'poison',   category: 'special',  power: 30,  accuracy: 70,  pp: 20 },
  { nameEs: 'Lanzafuego',        nameEn: 'fire-blast',     type: 'fire',     category: 'special',  power: 110, accuracy: 85,  pp: 5  },
  { nameEs: 'Lanzallamas Solar', nameEn: 'solar-beam',     type: 'grass',    category: 'special',  power: 120, accuracy: 100, pp: 10 },
  { nameEs: 'Llamarada',         nameEn: 'overheat',       type: 'fire',     category: 'special',  power: 130, accuracy: 90,  pp: 5  },
  { nameEs: 'Colmillo Ígneo',    nameEn: 'fire-fang',      type: 'fire',     category: 'physical', power: 65,  accuracy: 95,  pp: 15 },
  { nameEs: 'Rueda de Fuego',    nameEn: 'flame-wheel',    type: 'fire',     category: 'physical', power: 60,  accuracy: 100, pp: 25 },
  { nameEs: 'Carga Ígnea',       nameEn: 'flare-blitz',    type: 'fire',     category: 'physical', power: 120, accuracy: 100, pp: 15 },
  { nameEs: 'Giro Fuego',        nameEn: 'fire-spin',      type: 'fire',     category: 'special',  power: 35,  accuracy: 85,  pp: 15 },
  { nameEs: 'Día Soleado',       nameEn: 'sunny-day',      type: 'fire',     category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Polvo Volcán',      nameEn: 'will-o-wisp',    type: 'fire',     category: 'status',   power: null,accuracy: 85,  pp: 15 },
  { nameEs: 'Calcinación',       nameEn: 'incinerate',     type: 'fire',     category: 'special',  power: 60,  accuracy: 100, pp: 15 },
  { nameEs: 'Vendaval Ígneo',    nameEn: 'heat-wave',      type: 'fire',     category: 'special',  power: 95,  accuracy: 90,  pp: 10 },

  // ── AGUA ────────────────────────────────────────────────────
  { nameEs: 'Chorro de Agua',    nameEn: 'water-gun',      type: 'water',    category: 'special',  power: 40,  accuracy: 100, pp: 25 },
  { nameEs: 'Burbuja',           nameEn: 'bubble',         type: 'water',    category: 'special',  power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Rayo Burbuja',      nameEn: 'bubble-beam',    type: 'water',    category: 'special',  power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Acua Jet',          nameEn: 'aqua-jet',       type: 'water',    category: 'physical', power: 40,  accuracy: 100, pp: 20 },
  { nameEs: 'Acua Cola',         nameEn: 'aqua-tail',      type: 'water',    category: 'physical', power: 90,  accuracy: 90,  pp: 10 },
  { nameEs: 'Surf',              nameEn: 'surf',           type: 'water',    category: 'special',  power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Cascada',           nameEn: 'waterfall',      type: 'water',    category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Hidrobomba',        nameEn: 'hydro-pump',     type: 'water',    category: 'special',  power: 110, accuracy: 80,  pp: 5  },
  { nameEs: 'Hidroariete',       nameEn: 'liquidation',    type: 'water',    category: 'physical', power: 85,  accuracy: 100, pp: 10 },
  { nameEs: 'Colmillo Acuoso',   nameEn: 'waterfall',      type: 'water',    category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Lluvia',            nameEn: 'rain-dance',     type: 'water',    category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Remolino',          nameEn: 'whirlpool',      type: 'water',    category: 'special',  power: 35,  accuracy: 85,  pp: 15 },
  { nameEs: 'Acua Anillo',       nameEn: 'aqua-ring',      type: 'water',    category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Fuerza Acuática',   nameEn: 'water-pulse',    type: 'water',    category: 'special',  power: 60,  accuracy: 100, pp: 20 },

  // ── PLANTA ──────────────────────────────────────────────────
  { nameEs: 'Látigo Cepa',       nameEn: 'vine-whip',      type: 'grass',    category: 'physical', power: 45,  accuracy: 100, pp: 25 },
  { nameEs: 'Polvo Veneno',      nameEn: 'poison-powder',  type: 'poison',   category: 'status',   power: null,accuracy: 75,  pp: 35 },
  { nameEs: 'Drenadoras',        nameEn: 'leech-seed',     type: 'grass',    category: 'status',   power: null,accuracy: 90,  pp: 10 },
  { nameEs: 'Rayo Solar',        nameEn: 'solar-beam',     type: 'grass',    category: 'special',  power: 120, accuracy: 100, pp: 10 },
  { nameEs: 'Polvo Hada',        nameEn: 'stun-spore',     type: 'grass',    category: 'status',   power: null,accuracy: 75,  pp: 30 },
  { nameEs: 'Somnífero',         nameEn: 'sleep-powder',   type: 'grass',    category: 'status',   power: null,accuracy: 75,  pp: 15 },
  { nameEs: 'Hoja Afilada',      nameEn: 'razor-leaf',     type: 'grass',    category: 'physical', power: 55,  accuracy: 95,  pp: 25 },
  { nameEs: 'Megaagotar',        nameEn: 'mega-drain',     type: 'grass',    category: 'special',  power: 40,  accuracy: 100, pp: 15 },
  { nameEs: 'Síntesis',          nameEn: 'synthesis',      type: 'grass',    category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Hoja Sagrada',      nameEn: 'leaf-blade',     type: 'grass',    category: 'physical', power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Tormenta Floral',   nameEn: 'petal-blizzard', type: 'grass',    category: 'physical', power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Energibola',        nameEn: 'energy-ball',    type: 'grass',    category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Tormenta Floral',   nameEn: 'petal-dance',    type: 'grass',    category: 'special',  power: 120, accuracy: 100, pp: 10 },
  { nameEs: 'Hoja Aguda',        nameEn: 'leaf-storm',     type: 'grass',    category: 'special',  power: 130, accuracy: 90,  pp: 5  },
  { nameEs: 'Tumba Rocas',       nameEn: 'wood-hammer',    type: 'grass',    category: 'physical', power: 120, accuracy: 100, pp: 15 },
  { nameEs: 'Absorber',          nameEn: 'absorb',         type: 'grass',    category: 'special',  power: 20,  accuracy: 100, pp: 25 },
  { nameEs: 'Gigaagotar',        nameEn: 'giga-drain',     type: 'grass',    category: 'special',  power: 75,  accuracy: 100, pp: 10 },

  // ── ELÉCTRICO ───────────────────────────────────────────────
  { nameEs: 'Puño Trueno',       nameEn: 'thunder-punch',  type: 'electric', category: 'physical', power: 75,  accuracy: 100, pp: 15 },
  { nameEs: 'Impactrueno',       nameEn: 'thunder-shock',  type: 'electric', category: 'special',  power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Rayo',              nameEn: 'thunderbolt',    type: 'electric', category: 'special',  power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Trueno',            nameEn: 'thunder',        type: 'electric', category: 'special',  power: 110, accuracy: 70,  pp: 10 },
  { nameEs: 'Onda Voltio',       nameEn: 'volt-switch',    type: 'electric', category: 'special',  power: 70,  accuracy: 100, pp: 20 },
  { nameEs: 'Resplandor',        nameEn: 'charge-beam',    type: 'electric', category: 'special',  power: 50,  accuracy: 90,  pp: 10 },
  { nameEs: 'Placaje Eléctrico', nameEn: 'wild-charge',    type: 'electric', category: 'physical', power: 90,  accuracy: 100, pp: 15 },
  { nameEs: 'Electrobola',       nameEn: 'electro-ball',   type: 'electric', category: 'special',  power: null,accuracy: 100, pp: 10 },
  { nameEs: 'Colmillo Rayo',     nameEn: 'thunder-fang',   type: 'electric', category: 'physical', power: 65,  accuracy: 95,  pp: 15 },
  { nameEs: 'Chispa',            nameEn: 'spark',          type: 'electric', category: 'physical', power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Paralizador',       nameEn: 'thunder-wave',   type: 'electric', category: 'status',   power: null,accuracy: 90,  pp: 20 },

  // ── PSÍQUICO ────────────────────────────────────────────────
  { nameEs: 'Confusión',         nameEn: 'confusion',      type: 'psychic',  category: 'special',  power: 50,  accuracy: 100, pp: 25 },
  { nameEs: 'Psíquico',          nameEn: 'psychic',        type: 'psychic',  category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Teletransporte',    nameEn: 'teleport',       type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Levitón',           nameEn: 'psybeam',        type: 'psychic',  category: 'special',  power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Amnesia',           nameEn: 'amnesia',        type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Psicorrayo',        nameEn: 'psywave',        type: 'psychic',  category: 'special',  power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Barrera',           nameEn: 'barrier',        type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Reflejo',           nameEn: 'reflect',        type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Pantalla de Luz',   nameEn: 'light-screen',   type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 30 },
  { nameEs: 'Futuro Ataque',     nameEn: 'future-sight',   type: 'psychic',  category: 'special',  power: 120, accuracy: 100, pp: 10 },
  { nameEs: 'Psicocarga',        nameEn: 'zen-headbutt',   type: 'psychic',  category: 'physical', power: 80,  accuracy: 90,  pp: 15 },
  { nameEs: 'Psicogolpe',        nameEn: 'psycho-cut',     type: 'psychic',  category: 'physical', power: 70,  accuracy: 100, pp: 20 },
  { nameEs: 'Psicochoq',        nameEn: 'psyshock',       type: 'psychic',  category: 'special',  power: 80,  accuracy: 100, pp: 10 },
  { nameEs: 'Expansión',         nameEn: 'extrasensory',   type: 'psychic',  category: 'special',  power: 80,  accuracy: 100, pp: 20 },

  // ── HIELO ───────────────────────────────────────────────────
  { nameEs: 'Puño Hielo',        nameEn: 'ice-punch',      type: 'ice',      category: 'physical', power: 75,  accuracy: 100, pp: 15 },
  { nameEs: 'Neblina',           nameEn: 'mist',           type: 'ice',      category: 'status',   power: null,accuracy: null,pp: 30 },
  { nameEs: 'Ventisca',          nameEn: 'blizzard',       type: 'ice',      category: 'special',  power: 110, accuracy: 70,  pp: 5  },
  { nameEs: 'Rayo Hielo',        nameEn: 'ice-beam',       type: 'ice',      category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Canto Helado',      nameEn: 'powder-snow',    type: 'ice',      category: 'special',  power: 40,  accuracy: 100, pp: 25 },
  { nameEs: 'Granizo',           nameEn: 'hail',           type: 'ice',      category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Colmillo Hielo',    nameEn: 'ice-fang',       type: 'ice',      category: 'physical', power: 65,  accuracy: 95,  pp: 15 },
  { nameEs: 'Viento Hielo',      nameEn: 'icy-wind',       type: 'ice',      category: 'special',  power: 55,  accuracy: 95,  pp: 15 },
  { nameEs: 'Aguanieve',         nameEn: 'aurora-beam',    type: 'ice',      category: 'special',  power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Carámbano',         nameEn: 'icicle-crash',   type: 'ice',      category: 'physical', power: 85,  accuracy: 90,  pp: 10 },
  { nameEs: 'Lanza Hielo',       nameEn: 'icicle-spear',   type: 'ice',      category: 'physical', power: 25,  accuracy: 100, pp: 30 },

  // ── DRAGÓN ──────────────────────────────────────────────────
  { nameEs: 'Garra Dragón',      nameEn: 'dragon-claw',    type: 'dragon',   category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Furia Dragón',      nameEn: 'dragon-rage',    type: 'dragon',   category: 'special',  power: null,accuracy: 100, pp: 10 },
  { nameEs: 'Danza Dragón',      nameEn: 'dragon-dance',   type: 'dragon',   category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Pulso Dragón',      nameEn: 'dragon-pulse',   type: 'dragon',   category: 'special',  power: 85,  accuracy: 100, pp: 10 },
  { nameEs: 'Cola Dragón',       nameEn: 'dragon-tail',    type: 'dragon',   category: 'physical', power: 60,  accuracy: 90,  pp: 10 },
  { nameEs: 'Dragoaliento',      nameEn: 'draco-meteor',   type: 'dragon',   category: 'special',  power: 130, accuracy: 90,  pp: 5  },
  { nameEs: 'Triturar Dragón',   nameEn: 'outrage',        type: 'dragon',   category: 'physical', power: 120, accuracy: 100, pp: 10 },
  { nameEs: 'Cometa Draco',      nameEn: 'draco-meteor',   type: 'dragon',   category: 'special',  power: 130, accuracy: 90,  pp: 5  },
  { nameEs: 'Doble Golpe',       nameEn: 'dual-chop',      type: 'dragon',   category: 'physical', power: 40,  accuracy: 90,  pp: 15 },

  // ── SINIESTRO ───────────────────────────────────────────────
  { nameEs: 'Mordida',           nameEn: 'bite',           type: 'dark',     category: 'physical', power: 60,  accuracy: 100, pp: 25 },
  { nameEs: 'Acoso',             nameEn: 'pursuit',        type: 'dark',     category: 'physical', power: 40,  accuracy: 100, pp: 20 },
  { nameEs: 'Burlarse',          nameEn: 'taunt',          type: 'dark',     category: 'status',   power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Golpe Bajo',        nameEn: 'foul-play',      type: 'dark',     category: 'physical', power: 95,  accuracy: 100, pp: 15 },
  { nameEs: 'Triturar',          nameEn: 'crunch',         type: 'dark',     category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Tinieblas',         nameEn: 'dark-pulse',     type: 'dark',     category: 'special',  power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Vendetta',          nameEn: 'payback',        type: 'dark',     category: 'physical', power: 50,  accuracy: 100, pp: 10 },
  { nameEs: 'Golpe Nocturno',    nameEn: 'night-slash',    type: 'dark',     category: 'physical', power: 70,  accuracy: 100, pp: 15 },
  { nameEs: 'Sombra Vil',        nameEn: 'shadow-ball',    type: 'ghost',    category: 'special',  power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Mal de Ojo',        nameEn: 'snarl',          type: 'dark',     category: 'special',  power: 55,  accuracy: 95,  pp: 15 },
  { nameEs: 'Embargo',           nameEn: 'embargo',        type: 'dark',     category: 'status',   power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Noche Oscura',      nameEn: 'night-daze',     type: 'dark',     category: 'special',  power: 85,  accuracy: 95,  pp: 10 },

  // ── FANTASMA ────────────────────────────────────────────────
  { nameEs: 'Lametazo',          nameEn: 'lick',           type: 'ghost',    category: 'physical', power: 30,  accuracy: 100, pp: 30 },
  { nameEs: 'Polvillo Noche',    nameEn: 'night-shade',    type: 'ghost',    category: 'special',  power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Impresionar',       nameEn: 'confuse-ray',    type: 'ghost',    category: 'status',   power: null,accuracy: 100, pp: 10 },
  { nameEs: 'Bola Sombra',       nameEn: 'shadow-ball',    type: 'ghost',    category: 'special',  power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Garra Umbría',      nameEn: 'shadow-claw',    type: 'ghost',    category: 'physical', power: 70,  accuracy: 100, pp: 15 },
  { nameEs: 'Puño Sombra',       nameEn: 'shadow-punch',   type: 'ghost',    category: 'physical', power: 60,  accuracy: null,pp: 20 },
  { nameEs: 'Golpe Fantasma',    nameEn: 'phantom-force',  type: 'ghost',    category: 'physical', power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Rencor',            nameEn: 'grudge',         type: 'ghost',    category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Maldición',         nameEn: 'hex',            type: 'ghost',    category: 'special',  power: 65,  accuracy: 100, pp: 10 },
  { nameEs: 'Antojo',            nameEn: 'trick-or-treat', type: 'ghost',    category: 'status',   power: null,accuracy: 100, pp: 20 },

  // ── ACERO ───────────────────────────────────────────────────
  { nameEs: 'Garra Metal',       nameEn: 'metal-claw',     type: 'steel',    category: 'physical', power: 50,  accuracy: 95,  pp: 35 },
  { nameEs: 'Cola Férrea',       nameEn: 'iron-tail',      type: 'steel',    category: 'physical', power: 100, accuracy: 75,  pp: 15 },
  { nameEs: 'Cabezazo Hierro',   nameEn: 'iron-head',      type: 'steel',    category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Defensa Férrea',    nameEn: 'iron-defense',   type: 'steel',    category: 'status',   power: null,accuracy: null,pp: 15 },
  { nameEs: 'Giro Metal',        nameEn: 'magnet-rise',    type: 'electric', category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Rayo Espejo',       nameEn: 'mirror-shot',    type: 'steel',    category: 'special',  power: 65,  accuracy: 85,  pp: 10 },
  { nameEs: 'Tornado Metálico',  nameEn: 'meteor-mash',    type: 'steel',    category: 'physical', power: 90,  accuracy: 90,  pp: 10 },
  { nameEs: 'Flash Cañón',       nameEn: 'flash-cannon',   type: 'steel',    category: 'special',  power: 80,  accuracy: 100, pp: 10 },
  { nameEs: 'Guillotina Acero',  nameEn: 'steel-wing',     type: 'steel',    category: 'physical', power: 70,  accuracy: 90,  pp: 25 },
  { nameEs: 'Golpe Certero',     nameEn: 'smart-strike',   type: 'steel',    category: 'physical', power: 70,  accuracy: null,pp: 10 },

  // ── LUCHA ───────────────────────────────────────────────────
  { nameEs: 'Golpe Karate',      nameEn: 'karate-chop',    type: 'fighting', category: 'physical', power: 50,  accuracy: 100, pp: 25 },
  { nameEs: 'Doble Patada',      nameEn: 'double-kick',    type: 'fighting', category: 'physical', power: 30,  accuracy: 100, pp: 30 },
  { nameEs: 'Patada Salto',      nameEn: 'jump-kick',      type: 'fighting', category: 'physical', power: 100, accuracy: 95,  pp: 10 },
  { nameEs: 'Patada Giro',       nameEn: 'rolling-kick',   type: 'fighting', category: 'physical', power: 60,  accuracy: 85,  pp: 15 },
  { nameEs: 'Lanzamiento',       nameEn: 'submission',     type: 'fighting', category: 'physical', power: 80,  accuracy: 80,  pp: 20 },
  { nameEs: 'Puño Dinámico',     nameEn: 'dynamic-punch',  type: 'fighting', category: 'physical', power: 100, accuracy: 50,  pp: 5  },
  { nameEs: 'Puño Mach',         nameEn: 'mach-punch',     type: 'fighting', category: 'physical', power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Golpe Bajo',        nameEn: 'low-kick',       type: 'fighting', category: 'physical', power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Contraataque',      nameEn: 'counter',        type: 'fighting', category: 'physical', power: null,accuracy: 100, pp: 20 },
  { nameEs: 'Sacrificio',        nameEn: 'close-combat',   type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5  },
  { nameEs: 'A Bocajarro',       nameEn: 'focus-blast',    type: 'fighting', category: 'special',  power: 120, accuracy: 70,  pp: 5  },
  { nameEs: 'Patada Baja',       nameEn: 'low-sweep',      type: 'fighting', category: 'physical', power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Palmeo',            nameEn: 'drain-punch',    type: 'fighting', category: 'physical', power: 75,  accuracy: 100, pp: 10 },
  { nameEs: 'Agilidad',          nameEn: 'bulk-up',        type: 'fighting', category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Puño Certero',      nameEn: 'focus-punch',    type: 'fighting', category: 'physical', power: 150, accuracy: 100, pp: 20 },
  { nameEs: 'Superpuño',         nameEn: 'superpower',     type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5  },

  // ── VOLADOR ─────────────────────────────────────────────────
  { nameEs: 'Ráfaga de Aire',    nameEn: 'gust',           type: 'flying',   category: 'special',  power: 40,  accuracy: 100, pp: 35 },
  { nameEs: 'Ataque Ala',        nameEn: 'wing-attack',    type: 'flying',   category: 'physical', power: 60,  accuracy: 100, pp: 35 },
  { nameEs: 'Vuelo',             nameEn: 'fly',            type: 'flying',   category: 'physical', power: 90,  accuracy: 95,  pp: 15 },
  { nameEs: 'Ciclón',            nameEn: 'hurricane',      type: 'flying',   category: 'special',  power: 110, accuracy: 70,  pp: 10 },
  { nameEs: 'Acrobata',          nameEn: 'acrobatics',     type: 'flying',   category: 'physical', power: 55,  accuracy: 100, pp: 15 },
  { nameEs: 'Brisa Alada',       nameEn: 'air-slash',      type: 'flying',   category: 'special',  power: 75,  accuracy: 95,  pp: 15 },
  { nameEs: 'Cuchillada',        nameEn: 'aerial-ace',     type: 'flying',   category: 'physical', power: 60,  accuracy: null,pp: 20 },
  { nameEs: 'Acelerocío',        nameEn: 'tailwind',       type: 'flying',   category: 'status',   power: null,accuracy: null,pp: 15 },
  { nameEs: 'Rizo Defensa',      nameEn: 'feather-dance',  type: 'flying',   category: 'status',   power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Pico Taladrante',   nameEn: 'drill-peck',     type: 'flying',   category: 'physical', power: 80,  accuracy: 100, pp: 20 },
  { nameEs: 'Picotazo',          nameEn: 'peck',           type: 'flying',   category: 'physical', power: 35,  accuracy: 100, pp: 35 },
  { nameEs: 'Espejo Ala',        nameEn: 'mirror-move',    type: 'flying',   category: 'status',   power: null,accuracy: null,pp: 20 },

  // ── VENENO ──────────────────────────────────────────────────
  { nameEs: 'Piquete Venenoso',  nameEn: 'poison-sting',   type: 'poison',   category: 'physical', power: 15,  accuracy: 100, pp: 35 },
  { nameEs: 'Ácido',             nameEn: 'acid',           type: 'poison',   category: 'special',  power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Tóxico',            nameEn: 'toxic',          type: 'poison',   category: 'status',   power: null,accuracy: 90,  pp: 10 },
  { nameEs: 'Gas Venenoso',      nameEn: 'poison-gas',     type: 'poison',   category: 'status',   power: null,accuracy: 90,  pp: 40 },
  { nameEs: 'Veneno X',          nameEn: 'sludge',         type: 'poison',   category: 'special',  power: 65,  accuracy: 100, pp: 20 },
  { nameEs: 'Bomba Lodo',        nameEn: 'sludge-bomb',    type: 'poison',   category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Ola Tóxica',        nameEn: 'sludge-wave',    type: 'poison',   category: 'special',  power: 95,  accuracy: 100, pp: 10 },
  { nameEs: 'Cola Venenosa',     nameEn: 'poison-tail',    type: 'poison',   category: 'physical', power: 50,  accuracy: 100, pp: 25 },
  { nameEs: 'Giro Veneno',       nameEn: 'poison-jab',     type: 'poison',   category: 'physical', power: 80,  accuracy: 100, pp: 20 },
  { nameEs: 'Punzada Venenosa',  nameEn: 'cross-poison',   type: 'poison',   category: 'physical', power: 70,  accuracy: 100, pp: 20 },

  // ── TIERRA ──────────────────────────────────────────────────
  { nameEs: 'Ataque Arena',      nameEn: 'sand-attack',    type: 'ground',   category: 'status',   power: null,accuracy: 100, pp: 15 },
  { nameEs: 'Excavar',           nameEn: 'dig',            type: 'ground',   category: 'physical', power: 80,  accuracy: 100, pp: 10 },
  { nameEs: 'Terremoto',         nameEn: 'earthquake',     type: 'ground',   category: 'physical', power: 100, accuracy: 100, pp: 10 },
  { nameEs: 'Fisura',            nameEn: 'fissure',        type: 'ground',   category: 'physical', power: null,accuracy: 30,  pp: 5  },
  { nameEs: 'Golpe Tierra',      nameEn: 'earth-power',    type: 'ground',   category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Tormenta Arena',    nameEn: 'sandstorm',      type: 'rock',     category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Tumba Rocas',       nameEn: 'mud-slap',       type: 'ground',   category: 'special',  power: 20,  accuracy: 100, pp: 10 },
  { nameEs: 'Golpe Roca',        nameEn: 'mud-bomb',       type: 'ground',   category: 'special',  power: 65,  accuracy: 85,  pp: 10 },
  { nameEs: 'Bofetón Lodo',      nameEn: 'bulldoze',       type: 'ground',   category: 'physical', power: 60,  accuracy: 100, pp: 20 },
  { nameEs: 'Paliza',            nameEn: 'high-horsepower',type: 'ground',   category: 'physical', power: 95,  accuracy: 95,  pp: 10 },

  // ── ROCA ────────────────────────────────────────────────────
  { nameEs: 'Tumba Rocas',       nameEn: 'rock-throw',     type: 'rock',     category: 'physical', power: 50,  accuracy: 90,  pp: 15 },
  { nameEs: 'Alud de Rocas',     nameEn: 'rock-slide',     type: 'rock',     category: 'physical', power: 75,  accuracy: 90,  pp: 10 },
  { nameEs: 'Avalancha',         nameEn: 'avalanche',      type: 'ice',      category: 'physical', power: 60,  accuracy: 100, pp: 10 },
  { nameEs: 'Lanzarrocas',       nameEn: 'rock-blast',     type: 'rock',     category: 'physical', power: 25,  accuracy: 90,  pp: 10 },
  { nameEs: 'Trampa Rocas',      nameEn: 'stealth-rock',   type: 'rock',     category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Punta Roca',        nameEn: 'stone-edge',     type: 'rock',     category: 'physical', power: 100, accuracy: 80,  pp: 5  },
  { nameEs: 'Pulimento',         nameEn: 'rock-polish',    type: 'rock',     category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Golpe Roca',        nameEn: 'smack-down',     type: 'rock',     category: 'physical', power: 50,  accuracy: 100, pp: 15 },
  { nameEs: 'Triturar',          nameEn: 'ancient-power',  type: 'rock',     category: 'special',  power: 60,  accuracy: 100, pp: 5  },
  { nameEs: 'Roca Afilada',      nameEn: 'rock-wrecker',   type: 'rock',     category: 'physical', power: 150, accuracy: 90,  pp: 5  },

  // ── BICHO ───────────────────────────────────────────────────
  { nameEs: 'Doble Aguijón',     nameEn: 'twineedle',      type: 'bug',      category: 'physical', power: 25,  accuracy: 100, pp: 20 },
  { nameEs: 'Misil Aguja',       nameEn: 'pin-missile',    type: 'bug',      category: 'physical', power: 25,  accuracy: 95,  pp: 20 },
  { nameEs: 'Cabeza de Hierro',  nameEn: 'bug-buzz',       type: 'bug',      category: 'special',  power: 90,  accuracy: 100, pp: 10 },
  { nameEs: 'Picadura',          nameEn: 'bug-bite',       type: 'bug',      category: 'physical', power: 60,  accuracy: 100, pp: 20 },
  { nameEs: 'Zumbido',           nameEn: 'signal-beam',    type: 'bug',      category: 'special',  power: 75,  accuracy: 100, pp: 15 },
  { nameEs: 'Pulso Bicho',       nameEn: 'infestation',    type: 'bug',      category: 'special',  power: 20,  accuracy: 100, pp: 20 },
  { nameEs: 'Cuchillada X',      nameEn: 'x-scissor',      type: 'bug',      category: 'physical', power: 80,  accuracy: 100, pp: 15 },
  { nameEs: 'Aguijón Letal',     nameEn: 'fell-stinger',   type: 'bug',      category: 'physical', power: 50,  accuracy: 100, pp: 25 },
  { nameEs: 'Megacuerno',        nameEn: 'megahorn',       type: 'bug',      category: 'physical', power: 120, accuracy: 85,  pp: 10 },

  // ── HADA ────────────────────────────────────────────────────
  { nameEs: 'Voz Cautivadora',   nameEn: 'disarming-voice', type: 'fairy',   category: 'special',  power: 40,  accuracy: null,pp: 15 },
  { nameEs: 'Beso Drenador',     nameEn: 'draining-kiss',  type: 'fairy',    category: 'special',  power: 50,  accuracy: 100, pp: 10 },
  { nameEs: 'Luz de Luna',       nameEn: 'moonblast',      type: 'fairy',    category: 'special',  power: 95,  accuracy: 100, pp: 15 },
  { nameEs: 'Lluvia Feérica',    nameEn: 'dazzling-gleam', type: 'fairy',    category: 'special',  power: 80,  accuracy: 100, pp: 10 },
  { nameEs: 'Polvo Mágico',      nameEn: 'fairy-wind',     type: 'fairy',    category: 'special',  power: 40,  accuracy: 100, pp: 30 },
  { nameEs: 'Jugada Rara',       nameEn: 'strange-steam',  type: 'fairy',    category: 'special',  power: 90,  accuracy: 95,  pp: 10 },
  { nameEs: 'Luz Lunar',         nameEn: 'moonlight',      type: 'fairy',    category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Trampa Dulce',      nameEn: 'sweet-kiss',     type: 'fairy',    category: 'status',   power: null,accuracy: 75,  pp: 10 },
  { nameEs: 'Brillo Mágico',     nameEn: 'misty-terrain',  type: 'fairy',    category: 'status',   power: null,accuracy: null,pp: 10 },

  // ── VARIOS IMPORTANTES ──────────────────────────────────────
  { nameEs: 'Tóxico',            nameEn: 'toxic',          type: 'poison',   category: 'status',   power: null,accuracy: 90,  pp: 10 },
  { nameEs: 'Protección',        nameEn: 'protect',        type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Substituto',        nameEn: 'substitute',     type: 'normal',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Trampas Rocas',     nameEn: 'stealth-rock',   type: 'rock',     category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Cicatriz',          nameEn: 'roost',          type: 'flying',   category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Pulso Cura',        nameEn: 'heal-pulse',     type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 10 },
  { nameEs: 'Encogerse',         nameEn: 'calm-mind',      type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Danza Lluvia',      nameEn: 'rain-dance',     type: 'water',    category: 'status',   power: null,accuracy: null,pp: 5  },
  { nameEs: 'Fortaleza',         nameEn: 'cosmic-power',   type: 'psychic',  category: 'status',   power: null,accuracy: null,pp: 20 },
  { nameEs: 'Fuerza Lunar',      nameEn: 'moongeist-beam', type: 'ghost',    category: 'special',  power: 100, accuracy: 100, pp: 5  },
  { nameEs: 'Rayo Solar',        nameEn: 'solar-blade',    type: 'grass',    category: 'physical', power: 125, accuracy: 100, pp: 10 },
];

// Búsqueda por nombre en español o inglés
export function searchMoves(query: string): MoveEntry[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return MOVES_DATA.filter(m =>
    m.nameEs.toLowerCase().includes(q) ||
    m.nameEn.toLowerCase().includes(q)
  ).slice(0, 10);
}

// Obtener por nombre en inglés exacto (para PokeAPI)
export function getMoveByNameEn(nameEn: string): MoveEntry | undefined {
  return MOVES_DATA.find(m => m.nameEn === nameEn);
}

// Obtener todos los nombres en español para autocompletado
export function getMoveNames(): string[] {
  return MOVES_DATA.map(m => m.nameEs);
}