// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamPokemon, DeadPokemon, Encounter } from '../types/pokemon.types';
import type { GameState, Badge, BagItem, VersusRecord, NuzlockeRule, GameSettings } from '../types/game.types';

const DEFAULT_RULES: NuzlockeRule[] = [
  { id: '1', label: 'Solo puedes capturar el primer Pokémon de cada ruta (dos oportunidades)', enabled: true },
  { id: '2', label: 'Si un Pokémon se desmaya, muere permanentemente', enabled: true },
  { id: '3', label: 'Debes ponerle mote a todos tus Pokémon', enabled: true },
  { id: '5', label: 'Randomizer activo', enabled: true },
];

const DEFAULT_SETTINGS: GameSettings = {
  gameName: 'Mi Randomlocke',
  gameVersion: 'emerald',
  theme: 'red',
  soundEnabled: true,
  darkMode: true,
  resurrectionTokens: 0,
  wipeCount: 0,
};

interface GameStore extends GameState {
  // Team
  addToTeam: (pokemon: TeamPokemon) => void;
  removeFromTeam: (id: string) => void;
  moveToPC: (id: string) => void;
  moveToTeam: (id: string) => void;
  sendToCemetery: (id: string, cause: string, killedBy: string) => void;
  updatePokemon: (id: string, data: Partial<TeamPokemon>) => void;
  swapSlots: (id1: string, id2: string) => void;
  // PC
  addToPC: (pokemon: TeamPokemon) => void;
  removeFromPC: (id: string) => void;
  // Encounters
  addEncounter: (encounter: Encounter) => void;
  removeEncounter: (id: string) => void;
  // Badges
  toggleBadge: (id: string) => void;
  setBadges: (badges: Badge[]) => void;
  // Bag
  addToBag: (item: BagItem) => void;
  removeFromBag: (id: string) => void;
  updateBagItem: (id: string, changes: Partial<BagItem>) => void;
  // Versus
  addVersus: (record: VersusRecord) => void;
  removeVersus: (id: string) => void;
  // Rules
  toggleRule: (id: string) => void;
  // Settings
  updateSettings: (settings: Partial<GameSettings>) => void;
  addResurrectionToken: () => void;
  useResurrectionToken: () => void;
  incrementWipe: () => void;
  // Import/Export
  exportGame: () => string;
  importGame: (json: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      team: [],
      pc: [],
      cemetery: [],
      encounters: [],
      badges: [],
      bag: [],
      versus: [],
      rules: DEFAULT_RULES,

      // --- TEAM ---
      addToTeam: (pokemon) => set((s) => {
        if (s.team.length >= 6) return s;
        const slot = [0,1,2,3,4,5].find(n => !s.team.some(p => p.slot === n)) ?? s.team.length;
        return { team: [...s.team, { ...pokemon, status: 'active', slot }] };
      }),

      removeFromTeam: (id) => set((s) => ({
        team: s.team.filter(p => p.id !== id)
      })),

      moveToPC: (id) => set((s) => {
        const pokemon = s.team.find(p => p.id === id);
        if (!pokemon) return s;
        return {
          team: s.team.filter(p => p.id !== id),
          pc: [...s.pc, { ...pokemon, status: 'pc', slot: null }]
        };
      }),

      moveToTeam: (id) => set((s) => {
        if (s.team.length >= 6) return s;
        const pokemon = s.pc.find(p => p.id === id);
        if (!pokemon) return s;
        const slot = [0,1,2,3,4,5].find(n => !s.team.some(p => p.slot === n)) ?? s.team.length;
        return {
          pc: s.pc.filter(p => p.id !== id),
          team: [...s.team, { ...pokemon, status: 'active', slot }]
        };
      }),

      sendToCemetery: (id, cause, killedBy) => set((s) => {
        const pokemon = s.team.find(p => p.id === id) || s.pc.find(p => p.id === id);
        if (!pokemon) return s;
        const dead: DeadPokemon = {
          ...pokemon,
          status: 'dead',
          deathDate: new Date().toLocaleDateString('es-MX'),
          deathCause: cause,
          killedBy,
        };
        return {
          team: s.team.filter(p => p.id !== id),
          pc: s.pc.filter(p => p.id !== id),
          cemetery: [...s.cemetery, dead],
        };
      }),

      updatePokemon: (id, data) => set((s) => ({
        team: s.team.map(p => p.id === id ? { ...p, ...data } : p),
        pc:   s.pc.map(p =>   p.id === id ? { ...p, ...data } : p),
      })),

      swapSlots: (id1, id2) => set((s) => {
        const p1 = s.team.find(p => p.id === id1);
        const p2 = s.team.find(p => p.id === id2);
        if (!p1 || !p2) return s;
        return {
          team: s.team.map(p => {
            if (p.id === id1) return { ...p, slot: p2.slot };
            if (p.id === id2) return { ...p, slot: p1.slot };
            return p;
          })
        };
      }),

      // --- PC ---
      addToPC: (pokemon) => set((s) => ({
        pc: [...s.pc, { ...pokemon, status: 'pc', slot: null }]
      })),

      removeFromPC: (id) => set((s) => ({
        pc: s.pc.filter(p => p.id !== id)
      })),

      // --- ENCOUNTERS ---
      addEncounter: (encounter) => set((s) => ({
        encounters: [encounter, ...s.encounters]
      })),

      removeEncounter: (id) => set((s) => ({
        encounters: s.encounters.filter(e => e.id !== id)
      })),

      // --- BADGES ---
      toggleBadge: (id) => set((s) => {
        const badge = s.badges.find(b => b.id === id);
        if (!badge) return s;
        const wasObtained = badge.obtained;
        const tokenDelta = wasObtained ? -2 : +2;
        return {
          badges: s.badges.map(b =>
            b.id === id
              ? {
                  ...b,
                  obtained: !b.obtained,
                  obtainedDate: !b.obtained
                    ? new Date().toLocaleDateString('es-MX')
                    : undefined,
                }
              : b
          ),
          settings: {
            ...s.settings,
            resurrectionTokens: Math.max(0, s.settings.resurrectionTokens + tokenDelta),
          },
        };
      }),

      setBadges: (badges) => set({ badges }),

      // --- BAG ---
      addToBag: (item) => set((s) => ({
        bag: [...s.bag, item]
      })),

      removeFromBag: (id) => set((s) => ({
        bag: s.bag.filter(i => i.id !== id)
      })),

      updateBagItem: (id, changes) => set((s) => ({
        bag: s.bag.map(i => i.id === id ? { ...i, ...changes } : i)
      })),

      // --- VERSUS ---
      addVersus: (record) => set((s) => ({
        versus: [record, ...s.versus]
      })),

      removeVersus: (id) => set((s) => ({
        versus: s.versus.filter(v => v.id !== id)
      })),

      // --- RULES ---
      toggleRule: (id) => set((s) => ({
        rules: s.rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
      })),

      // --- SETTINGS ---
      updateSettings: (settings) => set((s) => ({
        settings: { ...s.settings, ...settings }
      })),

      addResurrectionToken: () => set((s) => ({
        settings: { ...s.settings, resurrectionTokens: s.settings.resurrectionTokens + 1 }
      })),

      useResurrectionToken: () => set((s) => ({
        settings: {
          ...s.settings,
          resurrectionTokens: Math.max(0, s.settings.resurrectionTokens - 1)
        }
      })),

      incrementWipe: () => set((s) => ({
        settings: { ...s.settings, wipeCount: s.settings.wipeCount + 1 }
      })),

      // --- EXPORT / IMPORT ---
      exportGame: () => JSON.stringify(get(), null, 2),

      importGame: (json) => {
        try {
          const data = JSON.parse(json);
          set(data);
        } catch {
          console.error('Error al importar partida');
        }
      },

      resetGame: () => set({
        settings: DEFAULT_SETTINGS,
        team: [], pc: [], cemetery: [],
        encounters: [], badges: [], bag: [],
        versus: [], rules: DEFAULT_RULES,
      }),
    }),
    {
      name: 'randomlocke-save',
    }
  )
);