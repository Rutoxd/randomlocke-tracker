import type { PokemonType } from '../types/pokemon.types';

export const TYPE_COLORS: Record<PokemonType, string> = {
  fire:     '#F08030', water:    '#6890F0', grass:    '#78C850',
  electric: '#F8D030', psychic:  '#F85888', ice:      '#98D8D8',
  dragon:   '#7038F8', dark:     '#705848', fairy:    '#EE99AC',
  normal:   '#A8A878', fighting: '#C03028', flying:   '#A890F0',
  poison:   '#A040A0', ground:   '#E0C068', rock:     '#B8A038',
  bug:      '#A8B820', ghost:    '#705898', steel:    '#B8B8D0',
  unknown:  '#68A090',
};

export const TYPE_LABELS: Record<PokemonType, string> = {
  fire:'Fuego', water:'Agua', grass:'Planta', electric:'Eléctrico',
  psychic:'Psíquico', ice:'Hielo', dragon:'Dragón', dark:'Siniestro',
  fairy:'Hada', normal:'Normal', fighting:'Lucha', flying:'Volador',
  poison:'Veneno', ground:'Tierra', rock:'Roca', bug:'Bicho',
  ghost:'Fantasma', steel:'Acero', unknown:'Desconocido',
};

const CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  fire:     { grass:2, ice:2, bug:2, steel:2, water:0.5, fire:0.5, rock:0.5, dragon:0.5 },
  water:    { fire:2, ground:2, rock:2, water:0.5, grass:0.5, dragon:0.5 },
  grass:    { water:2, ground:2, rock:2, fire:0.5, grass:0.5, poison:0.5, flying:0.5, bug:0.5, dragon:0.5, steel:0.5 },
  electric: { water:2, flying:2, ground:0, electric:0.5, grass:0.5, dragon:0.5 },
  psychic:  { fighting:2, poison:2, psychic:0.5, dark:0, steel:0.5 },
  ice:      { grass:2, ground:2, flying:2, dragon:2, fire:0.5, water:0.5, ice:0.5, steel:0.5 },
  dragon:   { dragon:2, steel:0.5, fairy:0 },
  dark:     { psychic:2, ghost:2, fighting:0.5, dark:0.5, fairy:0.5 },
  fairy:    { fighting:2, dragon:2, dark:2, fire:0.5, poison:0.5, steel:0.5 },
  normal:   { ghost:0, rock:0.5, steel:0.5 },
  fighting: { normal:2, ice:2, rock:2, dark:2, steel:2, poison:0.5, bug:0.5, psychic:0.5, flying:0.5, fairy:0.5, ghost:0 },
  flying:   { fighting:2, bug:2, grass:2, electric:0.5, rock:0.5, steel:0.5 },
  poison:   { grass:2, fairy:2, poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0 },
  ground:   { fire:2, electric:2, poison:2, rock:2, steel:2, grass:0.5, bug:0.5, flying:0 },
  rock:     { fire:2, ice:2, flying:2, bug:2, fighting:0.5, ground:0.5, steel:0.5 },
  bug:      { grass:2, psychic:2, dark:2, fire:0.5, fighting:0.5, flying:0.5, ghost:0.5, steel:0.5, fairy:0.5 },
  ghost:    { psychic:2, ghost:2, normal:0, dark:0.5 },
  steel:    { ice:2, rock:2, fairy:2, fire:0.5, water:0.5, electric:0.5, steel:0.5 },
  unknown:  {},
};

export function getOffensiveMatchup(attacker: PokemonType, defender: PokemonType): number {
  return CHART[attacker]?.[defender] ?? 1;
}

export function getDefensiveWeaknesses(types: PokemonType[]): Partial<Record<PokemonType, number>> {
  const allTypes = Object.keys(CHART) as PokemonType[];
  const result: Partial<Record<PokemonType, number>> = {};
  allTypes.forEach(atk => {
    const mult = types.reduce((acc, def) => acc * (CHART[atk]?.[def] ?? 1), 1);
    if (mult !== 1) result[atk] = mult;
  });
  return result;
}