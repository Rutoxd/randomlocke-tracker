export type PokemonType =
  | 'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'ice'
  | 'dragon' | 'dark' | 'fairy' | 'normal' | 'fighting' | 'flying'
  | 'poison' | 'ground' | 'rock' | 'bug' | 'ghost' | 'steel'
  | 'unknown';

export type PokemonStatus = 'active' | 'pc' | 'dead' | 'released';

export interface BaseStat {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface MoveInfo {
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
}

export interface TeamPokemon {
  id: string;
  pokedexId: number;
  name: string;
  nickname: string;
  types: PokemonType[];
  ability: string;
  stats: BaseStat;
  sprite: string;
  spriteShiny: string;
  isShiny: boolean;
  status: PokemonStatus;
  level: number;
  caughtAt: string;
  caughtDate: string;
  slot: number | null;
  moves: (MoveInfo | null)[];
  heldItem: string | null;
}

export interface DeadPokemon extends TeamPokemon {
  deathDate: string;
  deathCause: string;
  killedBy: string;
}

export interface Encounter {
  id: string;
  route: string;
  pokemonName: string;
  pokedexId: number;
  sprite: string;
  result: 'caught' | 'failed' | 'fled' | 'fainted' | 'duplicate';
  date: string;
  notes: string;
}