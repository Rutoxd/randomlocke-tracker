// src/components/PokemonDetailModal.tsx
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS, TYPE_LABELS, getDefensiveWeaknesses } from '../utils/typeMatchups';
import { fetchAllMovesList, searchMovesFromAPI, getMoveDetails, type MoveBasicInfo, type MoveDetail } from '../utils/movesApi';
import type { TeamPokemon, MoveInfo, PokemonType } from '../types/pokemon.types';
import toast from 'react-hot-toast';

const CATEGORY_ICONS: Record<string, string> = {
  physical: '⚔️',
  special:  '✨',
  status:   '💫',
};
const CATEGORY_LABELS: Record<string, string> = {
  physical: 'Físico',
  special:  'Especial',
  status:   'Estado',
};

const WEAKNESS_CONFIG = [
  { mult: 4,    label: 'x4',  bg: 'bg-red-900/60',    border: 'border-red-500/60',    text: 'text-red-300',    title: 'Debilidades x4'    },
  { mult: 2,    label: 'x2',  bg: 'bg-orange-900/60', border: 'border-orange-500/60', text: 'text-orange-300', title: 'Debilidades x2'    },
  { mult: 0.5,  label: 'x½', bg: 'bg-blue-900/60',   border: 'border-blue-500/60',   text: 'text-blue-300',   title: 'Resistencias x½'  },
  { mult: 0.25, label: 'x¼', bg: 'bg-blue-900/80',   border: 'border-blue-400/60',   text: 'text-blue-200',   title: 'Resistencias x¼'  },
  { mult: 0,    label: 'x0',  bg: 'bg-gray-900/60',   border: 'border-gray-500/60',   text: 'text-gray-300',   title: 'Inmunidades'       },
];

// Convierte un MoveDetail de la API a la estructura MoveInfo que usa tu aplicación
function moveDetailToMoveInfo(entry: MoveDetail): MoveInfo {
  return {
    name:     entry.nameEn,
    type:     entry.type as PokemonType,
    category: entry.category as 'physical' | 'special' | 'status',
    power:    entry.power ?? null,
    accuracy: entry.accuracy ?? null,
  };
}

interface Props {
  pokemon: TeamPokemon;
  onClose: () => void;
}

export default function PokemonDetailModal({ pokemon, onClose }: Props) {
  const updatePokemon = useGameStore(s => s.updatePokemon);
  const bag           = useGameStore(s => s.bag);

  const [moves,         setMoves]         = useState<(MoveInfo | null)[]>(
    pokemon.moves?.length === 4 ? pokemon.moves : [null, null, null, null]
  );
  const [heldItem,      setHeldItem]      = useState<string>(pokemon.heldItem ?? '');
  const [moveInputs,    setMoveInputs]    = useState<string[]>(['', '', '', '']);
  const [moveSugg,      setMoveSugg]      = useState<MoveBasicInfo[][]>([[], [], [], []]);
  const [focusedInput,  setFocusedInput]  = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'moves' | 'types' | 'stats'>('moves');
  const [level, setLevel] = useState<number>(pokemon.level || 1);

  // Inicializar la caché de movimientos al abrir el modal
  useEffect(() => {
    fetchAllMovesList();
  }, []);

  const weaknesses = getDefensiveWeaknesses(pokemon.types as PokemonType[]);
  const byMult = (m: number) =>
    Object.entries(weaknesses).filter(([, v]) => v === m).map(([t]) => t as PokemonType);

  // Búsqueda usando la lista de la API en caché
  const handleMoveSearch = (index: number, query: string) => {
    const inputs = [...moveInputs];
    inputs[index] = query;
    setMoveInputs(inputs);

    if (query.length >= 2) {
      const results = searchMovesFromAPI(query).slice(0, 6);
      const sugg = [...moveSugg];
      sugg[index] = results;
      setMoveSugg(sugg);
    } else {
      const sugg = [...moveSugg];
      sugg[index] = [];
      setMoveSugg(sugg);
    }
  };

  // Cuando el usuario selecciona un movimiento del desplegable
  const handleSelectMove = async (index: number, entry: MoveBasicInfo) => {
    // 1. Cerramos el menú sugerido inmediatamente para dar retroalimentación visual
    const sugg = [...moveSugg];
    sugg[index] = [];
    setMoveSugg(sugg);

    // 2. Mostramos el nombre en el input (podrías poner "Cargando..." si quisieras)
    const inputs = [...moveInputs];
    inputs[index] = entry.name;
    setMoveInputs(inputs);

    // 3. Hacemos el fetch de los detalles profundos
    const details = await getMoveDetails(entry.url);
    
    if (details) {
      const newMoves = [...moves];
      newMoves[index] = moveDetailToMoveInfo(details);
      setMoves(newMoves);
    } else {
      toast.error('Error al obtener los detalles del movimiento');
    }
  };

  const handleClearMove = (index: number) => {
    const newMoves = [...moves];
    newMoves[index] = null;
    setMoves(newMoves);

    const inputs = [...moveInputs];
    inputs[index] = '';
    setMoveInputs(inputs);
  };

const handleSave = () => {
    updatePokemon(pokemon.id, { moves, heldItem: heldItem || undefined, level });
    toast.success('Pokemon actualizado');
    onClose();
  };

  const totalStats = Object.values(pokemon.stats).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-2xl shadow-2xl my-4">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite}
              alt={pokemon.name}
              className="w-14 h-14 object-contain drop-shadow-lg"
            />
            <div>
              <div className="text-white font-bold text-lg">{pokemon.nickname}</div>
              <div className="flex items-center gap-1 text-white/40 text-sm capitalize">
                <span>{pokemon.name} · Lv.</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={level}
                  onChange={e => setLevel(Number(e.target.value) || 1)}
                  className="bg-black/30 text-white text-center rounded px-1 py-0.5 w-12 border border-white/20 outline-none focus:border-white/50"
                />
              </div>
              <div className="flex gap-1 mt-1">
                {pokemon.types.map(t => (
                  <span key={t} className="text-white text-xs px-2 py-0.5 rounded-full"
                    style={{ background: TYPE_COLORS[t as PokemonType] }}>
                    {TYPE_LABELS[t as PokemonType] || t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="text-white/40 hover:text-white text-3xl leading-none transition-colors">
            ×
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-white/10">
          {(['moves', 'types', 'stats'] as const).map(sec => (
            <button key={sec} onClick={() => setActiveSection(sec)}
              className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                activeSection === sec
                  ? 'text-white border-b-2 border-white/60'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              {sec === 'moves' ? 'Ataques' : sec === 'types' ? 'Tipos' : 'Stats'}
            </button>
          ))}
        </div>

        <div className="p-4">

          {/* ATAQUES */}
          {activeSection === 'moves' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="bg-black/20 rounded-xl border border-white/10 overflow-visible">
                    {moves[i] ? (
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-bold text-sm capitalize">
                            {moves[i]!.name.replace(/-/g, ' ')}
                          </span>
                          <button onClick={() => handleClearMove(i)}
                            className="text-white/20 hover:text-red-400 text-sm transition-colors">✗</button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-xs px-2 py-0.5 rounded-full"
                            style={{ background: TYPE_COLORS[moves[i]!.type] }}>
                            {TYPE_LABELS[moves[i]!.type] || moves[i]!.type}
                          </span>
                          <span className="text-white/60 text-xs">
                            {CATEGORY_ICONS[moves[i]!.category]} {CATEGORY_LABELS[moves[i]!.category]}
                          </span>
                          {moves[i]!.power && (
                            <span className="text-orange-400 text-xs">Potencia: {moves[i]!.power}</span>
                          )}
                          {moves[i]!.accuracy && (
                            <span className="text-blue-400 text-xs">Precisión: {moves[i]!.accuracy}%</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-2">
                        <input
                          className="w-full bg-black/30 text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/20"
                          placeholder={`Buscar ataque en inglés...`}
                          value={moveInputs[i]}
                          onChange={e => handleMoveSearch(i, e.target.value)}
                          onFocus={() => setFocusedInput(i)}
                          onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
                        />
                        {focusedInput === i && moveSugg[i].length > 0 && (
                          <div className="absolute left-2 right-2 top-full mt-1 z-[999] bg-gray-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                            {moveSugg[i].map(entry => (
                              <button
                                key={entry.name}
                                onMouseDown={e => { e.preventDefault(); handleSelectMove(i, entry); }}
                                className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors flex items-center justify-between"
                              >
                                <span className="text-white/80 text-xs capitalize">
                                  {entry.name.replace(/-/g, ' ')}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Objeto equipado */}
              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <div className="text-white/40 text-xs mb-2">Objeto equipado</div>
                {bag.length === 0 ? (
                  <p className="text-white/30 text-xs">La mochila está vacía — agrega objetos primero</p>
                ) : (
                  <select
                    className="w-full bg-black/40 text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none"
                    value={heldItem}
                    onChange={e => setHeldItem(e.target.value)}
                  >
                    <option value="">Sin objeto</option>
                    {bag.map(item => (
                      <option key={item.id} value={item.name}>
                        {item.name} (x{item.quantity})
                      </option>
                    ))}
                  </select>
                )}
                {heldItem && (
                  <button onClick={() => setHeldItem('')}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                    Quitar objeto
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TIPOS */}
          {activeSection === 'types' && (
            <div className="space-y-4">
              {WEAKNESS_CONFIG.map(({ mult, bg, border, text, title }) => {
                const types = byMult(mult);
                if (types.length === 0) return null;
                return (
                  <div key={mult}>
                    <div className={`text-xs font-bold mb-2 ${text}`}>{title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {types.map(t => (
                        <span key={t}
                          className={`text-white text-xs px-2.5 py-1 rounded-full border ${bg} ${border}`}>
                          <span className="mr-1" style={{ color: TYPE_COLORS[t] }}>●</span>
                          {TYPE_LABELS[t] || t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {Object.keys(weaknesses).length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">Sin datos de tipo</p>
              )}
            </div>
          )}

          {/* STATS */}
          {activeSection === 'stats' && (
            <div className="space-y-3">
              {Object.entries(pokemon.stats).map(([key, base]) => {
                const lv = level; // <--- ¡AQUÍ ESTABA LA CORRECCIÓN CLAVE!
                const iv = 15;
                const calculated = key === 'hp'
                  ? Math.floor((2 * base + iv) * lv / 100) + lv + 10
                  : Math.floor((Math.floor((2 * base + iv) * lv / 100) + 5));
                const maxCalc = key === 'hp'
                  ? Math.floor((2 * 255 + 31) * lv / 100) + lv + 10
                  : Math.floor((Math.floor((2 * 255 + 31) * lv / 100) + 5) * 1.1);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-white/40 text-xs w-14 uppercase font-bold">{key}</span>
                    <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((calculated / maxCalc) * 100, 100)}%`,
                          background: calculated >= 200 ? '#4ade80' : calculated >= 120 ? '#facc15' : calculated >= 70 ? '#fb923c' : '#f87171'
                        }}
                      />
                    </div>
                    <div className="text-right w-16">
                      <span className="text-white font-bold text-sm">{calculated}</span>
                      <span className="text-white/30 text-xs ml-1">({base})</span>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-white/40 text-sm">Total base</span>
                <span className="text-white font-bold">{totalStats}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-white/10">
          <button onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold transition-colors">
            Guardar cambios
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}