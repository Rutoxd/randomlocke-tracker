export interface GymLeader {
  name: string;
  type: string;
  badge: string;
}

export interface EliteFour {
  name: string;
  type: string;
}

export interface LeagueData {
  region: string;
  games: string[];
  gymLeaders: GymLeader[];
  eliteFour: EliteFour[];
  champion: string;
  hasGyms: boolean;
  specialNote?: string;
}

export const LEAGUES: Record<string, LeagueData> = {
  kanto: {
    region: 'Kanto',
    games: ['red','blue','yellow','firered','leafgreen'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Brock',    type: 'Roca',     badge: 'Roca' },
      { name: 'Misty',    type: 'Agua',     badge: 'Cascada' },
      { name: 'Lt. Surge',type: 'Eléctrico',badge: 'Trueno' },
      { name: 'Erika',    type: 'Planta',   badge: 'Arcoíris' },
      { name: 'Koga',     type: 'Veneno',   badge: 'Alma' },
      { name: 'Sabrina',  type: 'Psíquico', badge: 'Pantano' },
      { name: 'Blaine',   type: 'Fuego',    badge: 'Volcán' },
      { name: 'Giovanni', type: 'Tierra',   badge: 'Tierra' },
    ],
    eliteFour: [
      { name: 'Lorelei', type: 'Hielo' },
      { name: 'Bruno',   type: 'Lucha' },
      { name: 'Agatha',  type: 'Fantasma' },
      { name: 'Lance',   type: 'Dragón' },
    ],
    champion: 'Azul',
  },
  johto: {
    region: 'Johto',
    games: ['gold','silver','crystal','heartgold','soulsilver'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Pegaso',  type: 'Normal',   badge: 'Céfiro' },
      { name: 'Antón',   type: 'Bicho',    badge: 'Colmena' },
      { name: 'Blanca',  type: 'Normal',   badge: 'Planicie' },
      { name: 'Morti',   type: 'Fantasma', badge: 'Niebla' },
      { name: 'Aníbal',  type: 'Lucha',    badge: 'Tormenta' },
      { name: 'Yasmina', type: 'Acero',    badge: 'Mineral' },
      { name: 'Fredo',   type: 'Hielo',    badge: 'Glaciar' },
      { name: 'Débora',  type: 'Dragón',   badge: 'Dragón' },
    ],
    eliteFour: [
      { name: 'Mento', type: 'Psíquico' },
      { name: 'Koga',  type: 'Veneno' },
      { name: 'Bruno', type: 'Lucha' },
      { name: 'Karen', type: 'Siniestro' },
    ],
    champion: 'Lance',
  },
  hoenn: {
    region: 'Hoenn',
    games: ['ruby','sapphire','emerald','omegaruby','alphasapphire'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Petra',   type: 'Roca',      badge: 'Piedra' },
      { name: 'Marcial', type: 'Lucha',     badge: 'Puño' },
      { name: 'Erico',   type: 'Eléctrico', badge: 'Dinamo' },
      { name: 'Candela', type: 'Fuego',     badge: 'Calor' },
      { name: 'Norman',  type: 'Normal',    badge: 'Equilibrio' },
      { name: 'Alana',   type: 'Volador',   badge: 'Pluma' },
      { name: 'Vito/Leti',type: 'Psíquico', badge: 'Mente' },
      { name: 'Plubio',  type: 'Agua',      badge: 'Lluvia' },
    ],
    eliteFour: [
      { name: 'Sixto',  type: 'Siniestro' },
      { name: 'Fátima', type: 'Fantasma' },
      { name: 'Nívea',  type: 'Hielo' },
      { name: 'Dracón', type: 'Dragón' },
    ],
    champion: 'Máximo Peñas',
  },
  sinnoh: {
    region: 'Sinnoh',
    games: ['diamond','pearl','platinum'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Roco',    type: 'Roca',      badge: 'Lignito' },
      { name: 'Gardenia',type: 'Planta',    badge: 'Bosque' },
      { name: 'Brega',   type: 'Lucha',     badge: 'Adoquín' },
      { name: 'Mananti', type: 'Agua',      badge: 'Ciénaga' },
      { name: 'Fantina', type: 'Fantasma',  badge: 'Reliquia' },
      { name: 'Acerón',  type: 'Acero',     badge: 'Mina' },
      { name: 'Inverna', type: 'Hielo',     badge: 'Carámbano' },
      { name: 'Lectro',  type: 'Eléctrico', badge: 'Faro' },
    ],
    eliteFour: [
      { name: 'Alecrán', type: 'Bicho' },
      { name: 'Gaia',    type: 'Tierra' },
      { name: 'Fausto',  type: 'Fuego' },
      { name: 'Delos',   type: 'Psíquico' },
    ],
    champion: 'Cintia',
  },
  unova: {
    region: 'Teselia',
    games: ['black','white','black2','white2'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Millo/Zeo/Maíz', type: 'Planta',    badge: 'Trío' },
      { name: 'Aloe',           type: 'Normal',    badge: 'Base' },
      { name: 'Camus',          type: 'Bicho',     badge: 'Élitro' },
      { name: 'Camila',         type: 'Eléctrico', badge: 'Voltio' },
      { name: 'Yakón',          type: 'Tierra',    badge: 'Temblor' },
      { name: 'Gerania',        type: 'Hielo',     badge: 'Jet' },
      { name: 'Junco',          type: 'Fuego',     badge: 'Candelizo' },
      { name: 'Lirio/Iris',     type: 'Dragón',    badge: 'Leyenda' },
    ],
    eliteFour: [
      { name: 'Anís',    type: 'Fantasma' },
      { name: 'Aza',     type: 'Siniestro' },
      { name: 'Catleya', type: 'Psíquico' },
      { name: 'Loto',    type: 'Lucha' },
    ],
    champion: 'Mirto / Iris',
  },
  kalos: {
    region: 'Kalos',
    games: ['x','y'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Violeta', type: 'Bicho',     badge: 'Bicho' },
      { name: 'Lino',    type: 'Roca',      badge: 'Muro' },
      { name: 'Corelia', type: 'Eléctrico', badge: 'Lid' },
      { name: 'Amaro',   type: 'Planta',    badge: 'Planta' },
      { name: 'Lem',     type: 'Eléctrico', badge: 'Voltaje' },
      { name: 'Valeria', type: 'Hada',      badge: 'Hada' },
      { name: 'Ástrid',  type: 'Psíquico',  badge: 'Psique' },
      { name: 'Édel',    type: 'Hielo',     badge: 'Iceberg' },
    ],
    eliteFour: [
      { name: 'Tileo',   type: 'Acero' },
      { name: 'Malva',   type: 'Fuego' },
      { name: 'Drácena', type: 'Dragón' },
      { name: 'Narciso', type: 'Agua' },
    ],
    champion: 'Dianta',
  },
  alola: {
    region: 'Alola',
    games: ['sun','moon','ultrasun','ultramoon'],
    hasGyms: false,
    specialNote: 'Recorrido Insular — Pruebas de Capitanes y Kahunas',
    gymLeaders: [
      { name: 'Ilima',   type: 'Normal',    badge: 'Prueba Normal' },
      { name: 'Lana',    type: 'Agua',      badge: 'Prueba Agua' },
      { name: 'Kiawe',   type: 'Fuego',     badge: 'Prueba Fuego' },
      { name: 'Mallow',  type: 'Planta',    badge: 'Prueba Planta' },
      { name: 'Sophocles',type:'Eléctrico', badge: 'Prueba Eléctrico' },
      { name: 'Acerola', type: 'Fantasma',  badge: 'Prueba Fantasma' },
      { name: 'Mina',    type: 'Hada',      badge: 'Prueba Hada' },
      { name: 'Hapu',    type: 'Tierra',    badge: 'Kahuna Tierra' },
    ],
    eliteFour: [
      { name: 'Kaudan/Lario', type: 'Lucha/Acero' },
      { name: 'Mayla',        type: 'Roca' },
      { name: 'Zarala',       type: 'Fantasma' },
      { name: 'Kahili',       type: 'Volador' },
    ],
    champion: 'Kukui / Tilo',
  },
  galar_sword: {
  region: 'Galar',
  games: ['sword'],
  hasGyms: true,
  specialNote: 'Copa de Campeones — torneo de líderes antes del final',
  gymLeaders: [
    { name: 'Percy',   type: 'Planta',    badge: 'Planta'    },
    { name: 'Cáti',    type: 'Agua',      badge: 'Agua'      },
    { name: 'Nabo',    type: 'Fuego',     badge: 'Fuego'     },
    { name: 'Judith',  type: 'Lucha',     badge: 'Lucha'     },
    { name: 'Sally',   type: 'Hada',      badge: 'Hada'      },
    { name: 'Macu',    type: 'Roca',      badge: 'Roca'      },
    { name: 'Nerio',   type: 'Siniestro', badge: 'Siniestro' },
    { name: 'Roy',     type: 'Dragón',    badge: 'Dragón'    },
  ],
  eliteFour: [
    { name: 'Berto', type: 'Agua'      },
    { name: 'Roxy',  type: 'Lucha'     },
    { name: 'Nerio', type: 'Siniestro' },
    { name: 'Roy',   type: 'Dragón'    },
  ],
  champion: 'Lionel',
},
galar_shield: {
  region: 'Galar',
  games: ['shield'],
  hasGyms: true,
  specialNote: 'Copa de Campeones — torneo de líderes antes del final',
  gymLeaders: [
    { name: 'Percy',    type: 'Planta',    badge: 'Planta'    },
    { name: 'Cáti',     type: 'Agua',      badge: 'Agua'      },
    { name: 'Nabo',     type: 'Fuego',     badge: 'Fuego'     },
    { name: 'Alistair', type: 'Fantasma',  badge: 'Fantasma'  },
    { name: 'Sally',    type: 'Hada',      badge: 'Hada'      },
    { name: 'Mel',      type: 'Hielo',     badge: 'Hielo'     },
    { name: 'Nerio',    type: 'Siniestro', badge: 'Siniestro' },
    { name: 'Roy',      type: 'Dragón',    badge: 'Dragón'    },
  ],
  eliteFour: [
    { name: 'Berto', type: 'Agua'      },
    { name: 'Roxy',  type: 'Lucha'     },
    { name: 'Nerio', type: 'Siniestro' },
    { name: 'Roy',   type: 'Dragón'    },
  ],
  champion: 'Lionel',
},
  paldea: {
    region: 'Paldea',
    games: ['scarlet','violet'],
    hasGyms: true,
    gymLeaders: [
      { name: 'Araceli',  type: 'Bicho',     badge: 'Bicho' },
      { name: 'Brais',    type: 'Planta',    badge: 'Planta' },
      { name: 'e-Nigma',  type: 'Eléctrico', badge: 'Eléctrico' },
      { name: 'Fuco',     type: 'Agua',      badge: 'Agua' },
      { name: 'Laureano', type: 'Normal',    badge: 'Normal' },
      { name: 'Lima',     type: 'Fantasma',  badge: 'Fantasma' },
      { name: 'Tuli',     type: 'Psíquico',  badge: 'Psíquico' },
      { name: 'Grusha',   type: 'Hielo',     badge: 'Hielo' },
    ],
    eliteFour: [
      { name: 'Cayena',   type: 'Tierra' },
      { name: 'Pola',     type: 'Acero' },
      { name: 'Brais',    type: 'Volador' },
      { name: 'Hesperio', type: 'Dragón' },
    ],
    champion: 'Ságita',
  },
};

export function getLeagueForGame(gameVersion: string): LeagueData | null {
  return Object.values(LEAGUES).find(l => l.games.includes(gameVersion)) ?? null;
}