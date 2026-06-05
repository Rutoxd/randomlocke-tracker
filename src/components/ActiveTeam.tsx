import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePokeAPI } from '../hooks/usePokeAPI';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { BaseStat, PokemonType, TeamPokemon } from '../types/pokemon.types';
import toast from 'react-hot-toast';
import { useSound } from '../hooks/useSound';
import PokemonAutocomplete from './PokemonAutocomplete';
import AbilityAutocomplete from './AbilityAutocomplete';
import StatsEditor from './StatsEditor';
import PokemonDetailModal from './PokemonDetailModal';

const EMPTY_SLOTS = [0, 1, 2, 3, 4, 5];
const DEFAULT_STATS: BaseStat = { hp: 45, attack: 45, defense: 45, spAtk: 45, spDef: 45, speed: 45 };

function calculateActualStats(baseStats: BaseStat, level: number): BaseStat {
  const iv = 15;
  const actualStats: Partial<BaseStat> = {};
  for (const key in baseStats) {
    const statKey = key as keyof BaseStat;
    const base = baseStats[statKey];
    if (statKey === 'hp') {
      actualStats[statKey] = Math.floor((2 * base + iv) * level / 100) + level + 10;
    } else {
      actualStats[statKey] = Math.floor((Math.floor((2 * base + iv) * level / 100) + 5));
    }
  }
  return actualStats as BaseStat;
}

export default function ActiveTeam() {
  const team           = useGameStore(s => s.team);
  const addToTeam      = useGameStore(s => s.addToTeam);
  const moveToPC       = useGameStore(s => s.moveToPC);
  const removeFromTeam = useGameStore(s => s.removeFromTeam);
  const sendToCemetery = useGameStore(s => s.sendToCemetery);
  const updatePokemon  = useGameStore(s => s.updatePokemon);
  const { searchPokemon, buildTeamPokemon, loading } = usePokeAPI();
  const { play } = useSound();

  const [showAdd,         setShowAdd]       = useState(false);
  const [showDeath,       setShowDeath]     = useState(false);
  const [selectedId,      setSelectedId]    = useState<string | null>(null);
  const [editingId,       setEditingId]     = useState<string | null>(null);
  const [deathForm,       setDeathForm]     = useState({ cause: '', killedBy: '' });
  const [detailPokemon,   setDetailPokemon] = useState<TeamPokemon | null>(null);

  const [searchQuery,      setSearchQuery]      = useState('');
  const [nickname,         setNickname]         = useState('');
  const [route,            setRoute]            = useState('');
  const [level,            setLevel]            = useState(5);
  const [ability,          setAbility]          = useState('');
  const [pokemonAbilities, setPokemonAbilities] = useState<string[]>([]);
  const [customStats,      setCustomStats]      = useState<BaseStat>(DEFAULT_STATS);
  const [useCustomStats,   setUseCustomStats]   = useState(false);
  const [loadedStats,      setLoadedStats]      = useState<BaseStat | null>(null);

  const [editNick,    setEditNick]    = useState('');
  const [editLevel,   setEditLevel]   = useState(5);
  const [editAbility, setEditAbility] = useState('');
  const [editStats,   setEditStats]   = useState<BaseStat>(DEFAULT_STATS);

  const getSlotPokemon = (slot: number) => team.find(p => p.slot === slot) ?? null;

  const handlePokemonSelect = async (name: string) => {
    const result = await searchPokemon(name);
    if (result) {
      setLoadedStats(result.stats);
      setCustomStats(result.stats);
      setPokemonAbilities(result.abilities);
      setAbility(result.abilities[0] ?? '');
    }
  };

  const handleAdd = async () => {
    if (!searchQuery.trim()) return;
    const result = await searchPokemon(searchQuery);
    if (!result) { toast.error('Pokémon no encontrado'); return; }
    const pokemon = buildTeamPokemon(result, nickname, route);
    addToTeam({
      ...pokemon,
      level,
      ability: ability || pokemon.ability,
      stats: useCustomStats ? customStats : result.stats,
    });
    play('catch');
    toast.success(`¡${nickname || result.name} añadido al equipo!`);
    setShowAdd(false);
    setSearchQuery(''); setNickname(''); setRoute(''); setLevel(5);
    setAbility(''); setPokemonAbilities([]); setCustomStats(DEFAULT_STATS);
    setUseCustomStats(false); setLoadedStats(null);
  };

  const handleSendToCemetery = () => {
    if (!selectedId || !deathForm.cause.trim()) return;
    sendToCemetery(selectedId, deathForm.cause, deathForm.killedBy);
    play('death');
    toast('💀 Pokémon enviado al cementerio');
    setShowDeath(false); setSelectedId(null); setDeathForm({ cause: '', killedBy: '' });
  };

  const handleStartEdit = (p: TeamPokemon) => {
    setEditingId(p.id);
    setEditNick(p.nickname);
    setEditLevel(p.level);
    setEditAbility(p.ability);
    setEditStats(p.stats);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updatePokemon(editingId, {
      nickname: editNick,
      level: editLevel,
      ability: editAbility,
      stats: editStats,
    });
    setEditingId(null);
    toast.success('Pokémon actualizado');
  };

  const handleEvolve = async (pokemon: TeamPokemon) => {
    const t = toast.loading(`Buscando evolución para ${pokemon.name}...`);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
      if (!res.ok) throw new Error();
      const species = await res.json();
      const evoRes = await fetch(species.evolution_chain.url);
      const evoData = await evoRes.json();

      const findNext = (
        chain: { species: { name: string }; evolves_to: typeof chain[] }
      ): string | null => {
        if (chain.species.name === pokemon.name) {
          return chain.evolves_to[0]?.species.name ?? null;
        }
        for (const next of chain.evolves_to) {
          const found = findNext(next);
          if (found) return found;
        }
        return null;
      };

      const nextEvo = findNext(evoData.chain);
      toast.dismiss(t);

      if (!nextEvo) {
        toast('Este Pokémon no tiene más evoluciones', { icon: 'ℹ️' });
        return;
      }

      const evoResult = await searchPokemon(nextEvo);
      if (!evoResult) { toast.error('No se pudo cargar la evolución'); return; }

      updatePokemon(pokemon.id, {
        pokedexId: evoResult.id,
        name:      evoResult.name,
        types:     evoResult.types,
        sprite:    evoResult.sprite,
        spriteShiny: evoResult.spriteShiny,
        stats:     evoResult.stats,
      });
      toast.success(`¡${pokemon.nickname} evolucionó a ${evoResult.name}!`);
    } catch {
      toast.dismiss(t);
      toast.error('Error al buscar evolución');
    }
  };

  const handleExportShowdown = () => {
    const text = team.map(p => [
      `${p.nickname} (${p.name.charAt(0).toUpperCase() + p.name.slice(1)})`,
      `Ability: ${p.ability}`,
      `Level: ${p.level}`,
    ].join('\n')).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('¡Copiado en formato Showdown!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          ⚔️ Equipo Activo
          <span className="text-white/40 text-sm font-normal">{team.length}/6</span>
        </h2>
        <div className="flex gap-2">
          {team.length > 0 && (
            <button onClick={handleExportShowdown}
              className="poke-btn bg-purple-900 hover:bg-purple-800 text-white text-xs px-3 py-2">
              📋 Showdown
            </button>
          )}
          {team.length < 6 && (
            <button onClick={() => setShowAdd(true)}
              className="poke-btn bg-green-800 hover:bg-green-700 text-white text-sm px-4 py-2">
              + Agregar Pokémon
            </button>
          )}
        </div>
      </div>

      {/* Grid slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EMPTY_SLOTS.map(slot => {
          const pokemon = getSlotPokemon(slot);
          return pokemon
            ? <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isEditing={editingId === pokemon.id}
                editNick={editNick}
                editLevel={editLevel}
                editAbility={editAbility}
                editStats={editStats}
                onEditNick={setEditNick}
                onEditLevel={setEditLevel}
                onEditAbility={setEditAbility}
                onEditStats={setEditStats}
                onStartEdit={() => handleStartEdit(pokemon)}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingId(null)}
                onEvolve={() => handleEvolve(pokemon)}
                onMoveToPC={() => { moveToPC(pokemon.id); play('move'); toast('📦 Enviado a la PC'); }}
                onRemove={() => { removeFromTeam(pokemon.id); toast('Pokémon eliminado'); }}
                onSendToCemetery={() => { setSelectedId(pokemon.id); setShowDeath(true); }}
                onToggleShiny={() => updatePokemon(pokemon.id, { isShiny: !pokemon.isShiny })}
                onOpenDetail={() => setDetailPokemon(pokemon)}
              />
            : <EmptySlot key={slot} slot={slot} onClick={() => setShowAdd(true)} />;
        })}
      </div>

      {/* Modal Agregar */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl my-4">
            <h3 className="text-white font-bold text-lg mb-4">➕ Agregar Pokémon</h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs block mb-1">Nombre o N.º Pokédex *</label>
                <PokemonAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handlePokemonSelect}
                  placeholder="ej: pikachu / 25"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Mote</label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="Nombre personalizado"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Ruta de captura</label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="ej: Ruta 1"
                  value={route}
                  onChange={e => setRoute(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/50 text-xs block mb-1">Nivel</label>
                  <input type="number" min={1} max={100}
                    className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none text-sm"
                    value={level}
                    onChange={e => setLevel(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs block mb-1">Habilidad</label>
                  <AbilityAutocomplete
                    value={ability}
                    onChange={setAbility}
                    options={pokemonAbilities}
                    placeholder="Habilidad..."
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs">Stats del juego</label>
                  <button
                    onClick={() => setUseCustomStats(!useCustomStats)}
                    className={`text-xs px-2 py-0.5 rounded-lg border transition-all ${
                      useCustomStats
                        ? 'bg-blue-900/40 border-blue-600/40 text-blue-300'
                        : 'bg-black/30 border-white/10 text-white/40 hover:text-white/70'
                    }`}>
                    {useCustomStats ? 'Editando' : 'Editar stats'}
                  </button>
                </div>
                {useCustomStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor
                      stats={customStats}
                      onChange={(newStats) => { setCustomStats(newStats); }}
                      level={level}
                    />
                  </div>
                ) : loadedStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor stats={loadedStats} onChange={() => {}} compact level={level} />
                    <p className="text-white/30 text-xs mt-2 text-center">
                      Stats al nivel {level} — activa "Editar stats" para modificar
                    </p>
                  </div>
                ) : (
                  <p className="text-white/20 text-xs text-center py-2">
                    Selecciona un Pokémon para ver sus stats
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold transition-colors disabled:opacity-50">
                {loading ? '⏳ Buscando...' : '✓ Agregar'}
              </button>
              <button
                onClick={() => {
                  setShowAdd(false); setSearchQuery(''); setLoadedStats(null);
                  setUseCustomStats(false); setPokemonAbilities([]);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Muerte */}
      {showDeath && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-red-400 font-bold text-lg mb-1">🪦 Registrar muerte</h3>
            <p className="text-white/40 text-sm mb-4">
              {team.find(p => p.id === selectedId)?.nickname}
            </p>
            <div className="space-y-3">
              <input
                className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                placeholder="Causa de muerte *"
                value={deathForm.cause}
                onChange={e => setDeathForm(f => ({ ...f, cause: e.target.value }))}
              />
              <input
                className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                placeholder="Responsable"
                value={deathForm.killedBy}
                onChange={e => setDeathForm(f => ({ ...f, killedBy: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSendToCemetery}
                className="flex-1 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold transition-colors">
                🪦 Confirmar
              </button>
              <button onClick={() => { setShowDeath(false); setSelectedId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detailPokemon && (
        <PokemonDetailModal
          pokemon={detailPokemon}
          onClose={() => setDetailPokemon(null)}
        />
      )}
    </div>
  );
}

// ── Empty Slot ────────────────────────────────────────────────
function EmptySlot({ slot, onClick }: { slot: number; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="pokemon-slot empty h-48 flex flex-col items-center justify-center gap-2 hover:opacity-60 transition-opacity">
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
        <span className="text-white/30 text-xl">+</span>
      </div>
      <span className="text-white/30 text-xs">Slot {slot + 1}</span>
    </button>
  );
}

// ── Pokemon Card ──────────────────────────────────────────────
interface PokemonCardProps {
  pokemon: TeamPokemon;
  isEditing: boolean;
  editNick: string;
  editLevel: number;
  editAbility: string;
  editStats: BaseStat;
  onEditNick: (v: string) => void;
  onEditLevel: (v: number) => void;
  onEditAbility: (v: string) => void;
  onEditStats: (s: BaseStat) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEvolve: () => void;
  onMoveToPC: () => void;
  onRemove: () => void;
  onSendToCemetery: () => void;
  onToggleShiny: () => void;
  onOpenDetail: () => void;
}

function PokemonCard({
  pokemon, isEditing,
  editNick, editLevel, editAbility, editStats,
  onEditNick, onEditLevel, onEditAbility, onEditStats,
  onStartEdit, onSaveEdit, onCancelEdit, onEvolve,
  onMoveToPC, onRemove, onSendToCemetery, onToggleShiny, onOpenDetail,
}: PokemonCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const actualStats = useMemo(() =>
    calculateActualStats(pokemon.stats, pokemon.level),
    [pokemon.stats, pokemon.level]
  );
  const totalStats = Object.values(actualStats).reduce((a, b) => a + b, 0);

  return (
    <div className="pokemon-slot occupied p-3 flex flex-col gap-2 relative">
      <button onClick={() => setShowMenu(!showMenu)}
        className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors text-lg z-10">
        ⋮
      </button>

      {showMenu && (
        <div className="absolute top-8 right-2 z-20 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-40">
          <button onClick={() => { onStartEdit(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 text-sm transition-colors">
            ✏️ Editar
          </button>
          <button onClick={() => { onEvolve(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-900/30 text-sm transition-colors">
            🔄 Evolucionar
          </button>
          <button onClick={() => { onOpenDetail(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 text-sm transition-colors">
            🔍 Ver detalle
          </button>
          <button onClick={() => { onToggleShiny(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-yellow-900/20 text-sm transition-colors">
            ✨ {pokemon.isShiny ? 'Normal' : 'Shiny'}
          </button>
          <button onClick={() => { onMoveToPC(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 text-sm transition-colors">
            💾 Mover a PC
          </button>
          <button onClick={() => { onSendToCemetery(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 text-sm transition-colors">
            🪦 Cementerio
          </button>
          <button onClick={() => { onRemove(); setShowMenu(false); }}
            className="w-full text-left px-4 py-2 text-white/30 hover:bg-white/5 text-sm transition-colors">
            🗑️ Eliminar
          </button>
        </div>
      )}

      {/* Sprite */}
      <div className="flex justify-center relative">
        <div className="w-20 h-20 flex items-center justify-center">
          <img
            src={pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite}
            alt={pokemon.name}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        {pokemon.isShiny && <span className="absolute top-0 right-4 text-sm">✨</span>}
        <span className="absolute bottom-0 right-4 bg-black/50 text-white/70 text-xs px-1.5 rounded-full">
          Lv.{pokemon.level}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-1.5">
          <input
            className="w-full bg-black/40 text-white text-sm rounded px-2 py-1 border border-white/20 outline-none"
            value={editNick} onChange={e => onEditNick(e.target.value)} placeholder="Mote"
          />
          <input type="number" min={1} max={100}
            className="w-full bg-black/40 text-white text-sm rounded px-2 py-1 border border-white/20 outline-none"
            value={editLevel} onChange={e => onEditLevel(Number(e.target.value))}
          />
          <AbilityAutocomplete
            value={editAbility}
            onChange={onEditAbility}
            placeholder="Habilidad..."
          />
          <div className="bg-black/20 rounded-lg p-2 border border-white/10">
            <p className="text-white/30 text-xs mb-1.5">Stats base</p>
            <StatsEditor stats={editStats} onChange={onEditStats} level={editLevel} />
          </div>
          <div className="flex gap-1">
            <button onClick={onSaveEdit}
              className="flex-1 py-1 rounded bg-green-800 hover:bg-green-700 text-white text-xs font-bold">
              ✓ Guardar
            </button>
            <button onClick={onCancelEdit}
              className="flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-white/60 text-xs">
              ✗ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <div className="text-white font-bold text-sm truncate">{pokemon.nickname}</div>
            <div className="text-white/40 text-xs capitalize">{pokemon.name}</div>
          </div>
          <div className="flex gap-1 justify-center flex-wrap">
            {pokemon.types.map(t => (
              <span key={t} className="type-badge text-white text-xs px-2 py-0.5"
                style={{ background: TYPE_COLORS[t as PokemonType] }}>{t}</span>
            ))}
          </div>
          <div className="text-white/40 text-xs text-center truncate capitalize">
            🔮 {pokemon.ability}
          </div>
          <div className="space-y-0.5">
            {Object.entries(actualStats).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="text-white/30 text-xs w-8 uppercase">{key}</span>
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((val / 255) * 100, 100)}%`,
                      background: val >= 100 ? '#4ade80' : val >= 70 ? '#facc15' : '#f87171'
                    }}
                  />
                </div>
                <span className="text-white/50 text-xs w-7 text-right">{val}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-white/30 text-xs">
            Total: <span className="text-white/60 font-bold">{totalStats}</span>
          </div>
          <div className="text-white/30 text-xs text-center truncate">
            📍 {pokemon.caughtAt || 'Ruta desconocida'}
          </div>
        </>
      )}
    </div>
  );
}