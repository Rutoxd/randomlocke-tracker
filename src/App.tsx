// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useUIStore } from './store/settingsStore';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ActiveTeam from './components/ActiveTeam';
import PCBox from './components/PCBox';
import Cemetery from './components/Cemetery';
import Pokedex from './components/Pokedex';
import TeamSimulator from './components/TeamSimulator';
import Bag from './components/Bag';
import { TYPE_COLORS } from './utils/typeMatchups';
import type { PokemonType, TeamPokemon, BaseStat } from './types/pokemon.types';


const TABS = [
  { id: 'dashboard', label: 'Dashboard'  },
  { id: 'team',      label: 'Equipo'     },
  { id: 'pc',        label: 'PC Box'     },
  { id: 'cemetery',  label: 'Cementerio' },
  { id: 'simulator', label: 'Simulador'  },
  { id: 'bag',       label: 'Mochila'    },
];

function calcStat(base: number, level: number, isHp: boolean): number {
  const iv = 15;
  if (isHp) return Math.floor((2 * base + iv) * level / 100) + level + 10;
  return Math.floor((Math.floor((2 * base + iv) * level / 100) + 5));
}

const STAT_LABELS: Record<keyof BaseStat, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  spAtk: 'SpA', spDef: 'SpD', speed: 'SPE',
};

const TYPE_LABELS_ES: Partial<Record<PokemonType, string>> = {
  fire:'Fuego', water:'Agua', grass:'Planta', electric:'Eléctrico',
  psychic:'Psíquico', ice:'Hielo', dragon:'Dragón', dark:'Siniestro',
  fairy:'Hada', normal:'Normal', fighting:'Lucha', flying:'Volador',
  poison:'Veneno', ground:'Tierra', rock:'Roca', bug:'Bicho',
  ghost:'Fantasma', steel:'Acero',
};

function PCPokemonPanel({ pokemon }: { pokemon: TeamPokemon }) {
  const stats = pokemon.stats;
  const lv    = pokemon.level;
  const totalBase = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="h-full flex flex-col gap-3 p-3 font-['Press_Start_2P'] text-[10px]">
      {/* Sprite + nombre */}
      <div className="bg-black/40 border-2 border-white/20 rounded-lg p-3 flex flex-col items-center gap-2"
        style={{ imageRendering: 'pixelated' }}>
        <img
          src={pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite}
          alt={pokemon.name}
          className="w-24 h-24 object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="text-white text-center leading-relaxed">
          <div className="text-sm mb-1">{pokemon.nickname}</div>
          <div className="text-white/40 text-[9px] capitalize">{pokemon.name}</div>
          <div className="text-white/40 text-[9px] mt-1">Lv.{lv} {pokemon.isShiny ? '✨' : ''}</div>
        </div>
        <div className="flex gap-1 flex-wrap justify-center">
          {pokemon.types.map(t => (
            <span key={t} className="text-white text-[8px] px-2 py-0.5 rounded"
              style={{ background: TYPE_COLORS[t as PokemonType] }}>
              {TYPE_LABELS_ES[t as PokemonType] || t}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-black/40 border-2 border-white/20 rounded-lg p-3 space-y-1">
        <div className="text-white/40 text-[8px] mb-2 uppercase tracking-widest">Info</div>
        <div className="flex justify-between text-white/70">
          <span>Habilidad</span>
          <span className="text-white capitalize truncate max-w-[120px]">{pokemon.ability}</span>
        </div>
        <div className="flex justify-between text-white/70">
          <span>Ruta</span>
          <span className="text-white/50 truncate max-w-[120px]">{pokemon.caughtAt || '???'}</span>
        </div>
        {pokemon.heldItem && (
          <div className="flex justify-between text-white/70">
            <span>Objeto</span>
            <span className="text-white capitalize">{pokemon.heldItem}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-black/40 border-2 border-white/20 rounded-lg p-3">
        <div className="text-white/40 text-[8px] mb-2 uppercase tracking-widest">Stats (Lv.{lv})</div>
        <div className="space-y-1.5">
          {(Object.entries(stats) as [keyof BaseStat, number][]).map(([key, base]) => {
            const val = calcStat(base, lv, key === 'hp');
            const pct = Math.min((val / 400) * 100, 100);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-white/40 w-7">{STAT_LABELS[key]}</span>
                <div className="flex-1 h-2 bg-black/60 rounded-none border border-white/10">
                  <div className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: val >= 150 ? '#4ade80' : val >= 100 ? '#facc15' : val >= 60 ? '#fb923c' : '#f87171',
                    }}
                  />
                </div>
                <span className="text-white w-8 text-right">{val}</span>
                <span className="text-white/30 w-6 text-right">({base})</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/10 text-white/40">
          <span>BST</span>
          <span className="text-white">{totalBase}</span>
        </div>
      </div>

      {/* Movimientos */}
      {pokemon.moves && pokemon.moves.some(m => m !== null) && (
        <div className="bg-black/40 border-2 border-white/20 rounded-lg p-3">
          <div className="text-white/40 text-[8px] mb-2 uppercase tracking-widest">Movimientos</div>
          <div className="grid grid-cols-2 gap-1">
            {pokemon.moves.map((m, i) => m ? (
              <div key={i} className="bg-black/30 border border-white/10 rounded px-2 py-1">
                <span className="text-white/80 capitalize text-[8px] block truncate">
                  {m.name.replace(/-/g, ' ')}
                </span>
                <span className="text-[7px] px-1 rounded mt-0.5 inline-block"
                  style={{ background: TYPE_COLORS[m.type as PokemonType] || '#555', color: 'white' }}>
                  {TYPE_LABELS_ES[m.type as PokemonType] || m.type}
                </span>
                {m.power && <span className="text-orange-400 text-[7px] ml-1">{m.power}</span>}
              </div>
            ) : (
              <div key={i} className="border border-dashed border-white/10 rounded px-2 py-1 text-white/20 text-[8px] text-center">
                —
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const theme     = useGameStore(s => s.settings.theme);
  const activeTab = useUIStore(s => s.activeTab);
  const setTab    = useUIStore(s => s.setActiveTab);

  const [pcSelectedPokemon, setPcSelectedPokemon] = useState<TeamPokemon | null>(null);

  useEffect(() => {
    document.documentElement.className = `theme-${theme} dark`;
  }, [theme]);

  // Reset panel when leaving PC tab
  const prevTabRef = useRef<string>(activeTab);
useEffect(() => {
  if (prevTabRef.current === 'pc' && activeTab !== 'pc') {
    setPcSelectedPokemon(null);
  }
  prevTabRef.current = activeTab;
}, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'team':      return <ActiveTeam />;
      case 'pc':        return <PCBox onSelectPokemon={setPcSelectedPokemon} selectedPokemonId={pcSelectedPokemon?.id ?? null} />;
      case 'cemetery':  return <Cemetery />;
      case 'pokedex':   return <Pokedex />;
      case 'simulator': return <TeamSimulator />;
      case 'bag':       return <Bag />;
      default:          return <Dashboard />;
    }
  };

  const showPCPanel = activeTab === 'pc';

  return (
    <div className={`theme-${theme} min-h-screen bg-gray-950 p-2 md:p-4`}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="pokedex-shell p-3 md:p-4">
          {/* LEDs decorativos */}
          <div className="flex items-center gap-2 mb-3">
            <div className="led led-blue w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/30" />
            </div>
            <div className="led led-red" />
            <div className="led led-yellow" />
            <div className="led led-green" />
          </div>

          <TopBar />

          <div className="pokedex-screen mt-3 p-1">
            <div className="flex flex-col lg:flex-row gap-0 lg:divide-x lg:divide-white/10">

              {/* Columna izquierda */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex flex-wrap gap-1 p-2 bg-black/20">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTab(tab.id)}
                      className={`poke-btn text-xs px-2 py-1 transition-all ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-black/30 text-white/60 border border-transparent hover:text-white/90'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="p-3 min-h-[500px]">
                  <TabContent key={activeTab}>
                    {renderTab()}
                  </TabContent>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="lg:w-[380px] xl:w-[420px] flex-shrink-0 border-t border-white/10 lg:border-t-0 overflow-y-auto max-h-[85vh]">
                {showPCPanel ? (
                  pcSelectedPokemon ? (
                    <TabContent key={pcSelectedPokemon.id}>
                      <PCPokemonPanel pokemon={pcSelectedPokemon} />
                    </TabContent>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4 opacity-40"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      <div className="text-5xl">💾</div>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Selecciona un Pokémon de la PC para ver su info
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-3 h-full">
                    <Pokedex />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Botones decorativos */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10" />
              <div className="w-8 h-3 rounded bg-black/40 border border-white/10 self-center" />
            </div>
            <div className="flex gap-1">
              {['A','B','C','D'].map(l => (
                <div key={l} className="w-6 h-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                  <span className="text-white/30 text-xs">{l}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }}
      />
    </div>
  );
}

function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}