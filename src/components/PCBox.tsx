import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePokeAPI } from '../hooks/usePokeAPI';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { BaseStat, PokemonType, TeamPokemon } from '../types/pokemon.types';
import { useSound } from '../hooks/useSound';
import toast from 'react-hot-toast';
import PokemonAutocomplete from './PokemonAutocomplete';
import AbilityAutocomplete from './AbilityAutocomplete';
import StatsEditor from './StatsEditor';

const DEFAULT_STATS: BaseStat = { hp: 45, attack: 45, defense: 45, spAtk: 45, spDef: 45, speed: 45 };

export default function PCBox() {
  const pc             = useGameStore(s => s.pc);
  const team           = useGameStore(s => s.team);
  const moveToTeam     = useGameStore(s => s.moveToTeam);
  const removeFromPC   = useGameStore(s => s.removeFromPC);
  const sendToCemetery = useGameStore(s => s.sendToCemetery);
  const addToPC        = useGameStore(s => s.addToPC);
  const { searchPokemon, buildTeamPokemon, loading } = usePokeAPI();
  const { play } = useSound();

  const [showAdd,    setShowAdd]    = useState(false);
  const [showDeath,  setShowDeath]  = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter,     setFilter]     = useState('');
  const [deathForm,  setDeathForm]  = useState({ cause: '', killedBy: '' });

  // Formulario agregar
  const [search,           setSearch]           = useState('');
  const [nickname,         setNickname]         = useState('');
  const [route,            setRoute]            = useState('');
  const [level,            setLevel]            = useState(5);
  const [ability,          setAbility]          = useState('');
  const [pokemonAbilities, setPokemonAbilities] = useState<string[]>([]);
  const [customStats,      setCustomStats]      = useState<BaseStat>(DEFAULT_STATS);
  const [useCustomStats,   setUseCustomStats]   = useState(false);
  const [loadedStats,      setLoadedStats]      = useState<BaseStat | null>(null);

  const filtered = pc.filter(p =>
    p.nickname.toLowerCase().includes(filter.toLowerCase()) ||
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

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
    if (!search.trim()) return;
    const result = await searchPokemon(search);
    if (!result) { toast.error('Pokémon no encontrado'); return; }
    const pokemon = buildTeamPokemon(result, nickname, route);
    addToPC({
      ...pokemon,
      level,
      ability: ability || pokemon.ability,
      stats: useCustomStats ? customStats : result.stats,
    });
    play('catch');
    toast.success(`${nickname || result.name} guardado en la PC`);
    setShowAdd(false);
    setSearch(''); setNickname(''); setRoute(''); setLevel(5);
    setAbility(''); setPokemonAbilities([]); setCustomStats(DEFAULT_STATS);
    setUseCustomStats(false); setLoadedStats(null);
  };

  const handleMoveToTeam = (id: string) => {
    if (team.length >= 6) { toast.error('El equipo está lleno (máx. 6)'); return; }
    moveToTeam(id); play('move'); toast.success('Movido al equipo activo');
  };

  const handleSendToCemetery = () => {
    if (!selectedId || !deathForm.cause.trim()) return;
    sendToCemetery(selectedId, deathForm.cause, deathForm.killedBy);
    play('death');
    toast('🪦 Enviado al cementerio', { icon: '💀' });
    setShowDeath(false); setSelectedId(null); setDeathForm({ cause: '', killedBy: '' });
  };

  const resetForm = () => {
    setShowAdd(false); setSearch(''); setLoadedStats(null);
    setUseCustomStats(false); setPokemonAbilities([]); setAbility('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          💾 PC Box
          <span className="text-white/40 text-sm font-normal">{pc.length} Pokémon</span>
        </h2>
        <div className="flex gap-2">
          <input
            className="bg-black/30 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none placeholder:text-white/30 w-40"
            placeholder="Filtrar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="poke-btn bg-blue-800 hover:bg-blue-700 text-white text-sm px-4 py-2"
          >
            + Guardar en PC
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-white/30 py-16">
          <div className="text-5xl mb-3">💾</div>
          <p>{pc.length === 0 ? 'La PC está vacía' : 'No hay resultados'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(pokemon => (
            <PCCard
              key={pokemon.id}
              pokemon={pokemon}
              canAddToTeam={team.length < 6}
              onMoveToTeam={() => handleMoveToTeam(pokemon.id)}
              onRemove={() => { removeFromPC(pokemon.id); toast('🗑 Pokémon eliminado'); }}
              onSendToCemetery={() => { setSelectedId(pokemon.id); setShowDeath(true); }}
            />
          ))}
        </div>
      )}

      {/* Modal — Agregar a PC */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl my-4">
            <h3 className="text-white font-bold text-lg mb-4">💾 Guardar en PC</h3>
            <div className="space-y-3">

              <div>
                <label className="text-white/50 text-xs block mb-1">Nombre o N.º Pokédex *</label>
                <PokemonAutocomplete
                  value={search}
                  onChange={setSearch}
                  onSelect={handlePokemonSelect}
                  placeholder="ej: eevee / 133"
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
                  placeholder="ej: Ruta 3"
                  value={route}
                  onChange={e => setRoute(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/50 text-xs block mb-1">Nivel</label>
                  <input
                    type="number" min={1} max={100}
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
                    placeholder="Selecciona habilidad..."
                  />
                </div>
              </div>

              {/* Stats editables */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs">Stats del juego</label>
                  <button
                    onClick={() => setUseCustomStats(!useCustomStats)}
                    className={`text-xs px-2 py-0.5 rounded-lg border transition-all ${
                      useCustomStats
                        ? 'bg-blue-900/40 border-blue-600/40 text-blue-300'
                        : 'bg-black/30 border-white/10 text-white/40 hover:text-white/70'
                    }`}
                  >
                    {useCustomStats ? '✏️ Editando' : '📊 Editar stats'}
                  </button>
                </div>
                {useCustomStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor stats={customStats} onChange={setCustomStats} />
                  </div>
                ) : loadedStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor stats={loadedStats} onChange={() => {}} compact />
                    <p className="text-white/30 text-xs mt-2 text-center">
                      Stats base — activa "Editar stats" para personalizar
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
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Buscando...' : '✓ Guardar'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal — Muerte */}
      {showDeath && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-red-400 font-bold text-lg mb-1">🪦 Registrar muerte</h3>
            <p className="text-white/40 text-sm mb-4">
              {pc.find(p => p.id === selectedId)?.nickname}
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs block mb-1">Causa de muerte *</label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                  placeholder="ej: Ataque sorpresa"
                  value={deathForm.cause}
                  onChange={e => setDeathForm(f => ({ ...f, cause: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Responsable</label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                  placeholder="ej: Entrenador rival"
                  value={deathForm.killedBy}
                  onChange={e => setDeathForm(f => ({ ...f, killedBy: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSendToCemetery}
                className="flex-1 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold transition-colors"
              >
                🪦 Confirmar
              </button>
              <button
                onClick={() => { setShowDeath(false); setSelectedId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PC Card ──
interface PCCardProps {
  pokemon: TeamPokemon;
  canAddToTeam: boolean;
  onMoveToTeam: () => void;
  onRemove: () => void;
  onSendToCemetery: () => void;
}

function PCCard({ pokemon, canAddToTeam, onMoveToTeam, onRemove, onSendToCemetery }: PCCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="pokemon-slot occupied p-3 flex flex-col items-center gap-2 relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors z-10"
      >⋮</button>
      {showMenu && (
        <div className="absolute top-8 right-2 z-20 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-36">
          <button onClick={() => { onMoveToTeam(); setShowMenu(false); }} disabled={!canAddToTeam} className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed">⚔️ Al equipo</button>
          <button onClick={() => { onSendToCemetery(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 text-sm transition-colors">🪦 Cementerio</button>
          <button onClick={() => { onRemove(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-white/40 hover:bg-white/5 text-sm transition-colors">🗑 Eliminar</button>
        </div>
      )}
      <img
        src={pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite}
        alt={pokemon.name}
        className="w-16 h-16 object-contain drop-shadow-lg"
      />
      {pokemon.isShiny && <span className="absolute top-2 left-2 text-sm">✨</span>}
      <div className="text-center w-full">
        <div className="text-white font-bold text-sm truncate">{pokemon.nickname}</div>
        <div className="text-white/40 text-xs capitalize">{pokemon.name}</div>
        <div className="text-white/30 text-xs">Lv.{pokemon.level}</div>
      </div>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map(t => (
          <span key={t} className="type-badge text-white text-xs px-1.5 py-0.5"
            style={{ background: TYPE_COLORS[t as PokemonType] }}>
            {t}
          </span>
        ))}
      </div>
      <div className="text-white/30 text-xs truncate w-full text-center">
        📍 {pokemon.caughtAt || '—'}
      </div>
    </div>
  );
}