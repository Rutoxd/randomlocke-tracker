export type GameVersion =
  | 'red' | 'blue' | 'yellow'
  | 'gold' | 'silver' | 'crystal'
  | 'ruby' | 'sapphire' | 'emerald'
  | 'firered' | 'leafgreen'
  | 'diamond' | 'pearl' | 'platinum'
  | 'heartgold' | 'soulsilver'
  | 'black' | 'white' | 'black2' | 'white2'
  | 'x' | 'y' | 'omegaruby' | 'alphasapphire'
  | 'sun' | 'moon' | 'ultrasun' | 'ultramoon'
  | 'sword' | 'shield'
  | 'scarlet' | 'violet';

export type AppTheme =
  | 'red' | 'blue' | 'green' | 'gold' | 'silver' | 'black';

export type BadgeRegion =
  | 'kanto' | 'johto' | 'hoenn' | 'sinnoh'
  | 'unova' | 'kalos' | 'alola' | 'galar' | 'paldea';

export interface Badge {
  id: string;
  name: string;
  region: BadgeRegion;
  obtained: boolean;
  obtainedDate?: string;
}

export interface NuzlockeRule {
  id: string;
  label: string;
  enabled: boolean;
}

export interface BagItem {
  id: string;
  name: string;
  category: 'curative' | 'status' | 'ball' | 'tm' | 'evolution' | 'key' | 'held' | 'other';
  quantity: number;
  description?: string;
}

export interface VersusRecord {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  date: string;
  notes: string;
}

export interface GameSettings {
  gameName: string;
  gameVersion: GameVersion;
  theme: AppTheme;
  soundEnabled: boolean;
  darkMode: boolean;
  resurrectionTokens: number;
  wipeCount: number;
}

export interface GameState {
  settings: GameSettings;
  team: import('./pokemon.types').TeamPokemon[];
  pc: import('./pokemon.types').TeamPokemon[];
  cemetery: import('./pokemon.types').DeadPokemon[];
  encounters: import('./pokemon.types').Encounter[];
  badges: Badge[];
  bag: BagItem[];
  versus: VersusRecord[];
  rules: NuzlockeRule[];
}