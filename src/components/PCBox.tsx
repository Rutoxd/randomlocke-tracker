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

const DEFAULT_STATS: BaseStat = { hp: 45, attack: 45, defense: 45, spAtk: 45, spDef: 45, speed: 45 };

interface PCBoxProps {
  onSelectPokemon?: (pokemon: TeamPokemon | null) => void;
  selectedPokemonId?: string | null;
}

export default function PCBox({ onSelectPokemon, selectedPokemonId }: PCBoxProps) {
  const pc             = useGameStore(s => s.pc);
  const team           = useGameStore(s => s.team);
  const addToPC        = useGameStore(s => s.addToPC);
  const moveToTeam     = useGameStore(s => s.moveToTeam);
  const removeFromPC   = useGameStore(s => s.removeFromPC);
  const sendToCemetery = useGameStore(s => s.sendToCemetery);
  const updatePokemon  = useGameStore(s => s.updatePokemon);
  const { searchPokemon, buildTeamPokemon, loading } = usePokeAPI();
  const { play } = useSound();

  const [search,        setSearch]        = useState('');
  const [showAdd,       setShowAdd]       = useState(false);
  const [showDeath,     setShowDeath]     = useState(false);
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [deathForm,     setDeathForm]     = useState({ cause: '', killedBy: '' });
  const [detailPokemon, setDetailPokemon] = useState<TeamPokemon | null>(null);

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

  const filtered = useMemo(() =>
    pc.filter(p =>
      p.nickname.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    ), [pc, search]);

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
    addToPC({ ...pokemon, level, ability: ability || pokemon.ability, stats: useCustomStats ? customStats : result.stats });
    play('catch');
    toast.success(`${nickname || result.name} añadido a la PC!`);
    setShowAdd(false);
    setSearchQuery(''); setNickname(''); setRoute(''); setLevel(5);
    setAbility(''); setPokemonAbilities([]); setCustomStats(DEFAULT_STATS);
    setUseCustomStats(false); setLoadedStats(null);
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
    updatePokemon(editingId, { nickname: editNick, level: editLevel, ability: editAbility, stats: editStats });
    // Refresh panel if this pokemon is selected
    const updated = pc.find(p => p.id === editingId);
    if (updated && selectedPokemonId === editingId) {
      onSelectPokemon?.({ ...updated, nickname: editNick, level: editLevel, ability: editAbility, stats: editStats });
    }
    setEditingId(null);
    toast.success('Pokémon actualizado');
  };

  const handleSendToCemetery = () => {
    if (!selectedId || !deathForm.cause.trim()) return;
    sendToCemetery(selectedId, deathForm.cause, deathForm.killedBy);
    if (selectedId === selectedPokemonId) onSelectPokemon?.(null);
    play('death');
    toast('💀 Pokémon enviado al cementerio');
    setShowDeath(false); setSelectedId(null); setDeathForm({ cause: '', killedBy: '' });
  };

  const handleEvolve = async (pokemon: TeamPokemon) => {
    const t = toast.loading(`Buscando evolución para ${pokemon.name}...`);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
      const species = await res.json();
      const evoRes = await fetch(species.evolution_chain.url);
      const evoData = await evoRes.json();
      const findNext = (chain: { species: { name: string }; evolves_to: typeof chain[] }): string | null => {
        if (chain.species.name === pokemon.name) return chain.evolves_to[0]?.species.name ?? null;
        for (const next of chain.evolves_to) { const found = findNext(next); if (found) return found; }
        return null;
      };
      const nextEvo = findNext(evoData.chain);
      toast.dismiss(t);
      if (!nextEvo) { toast('Este Pokémon no tiene más evoluciones', { icon: 'ℹ️' }); return; }
      const evoResult = await searchPokemon(nextEvo);
      if (!evoResult) { toast.error('No se pudo cargar la evolución'); return; }
      updatePokemon(pokemon.id, { pokedexId: evoResult.id, name: evoResult.name, types: evoResult.types, sprite: evoResult.sprite, spriteShiny: evoResult.spriteShiny, stats: evoResult.stats });
      toast.success(`¡${pokemon.nickname} evolucionó a ${evoResult.name}!`);
    } catch {
      toast.dismiss(t);
      toast.error('Error al buscar evolución');
    }
  };

  const handleMoveToTeam = (id: string) => {
    if (team.length >= 6) { toast.error('El equipo ya está lleno (6/6)'); return; }
    if (id === selectedPokemonId) onSelectPokemon?.(null);
    moveToTeam(id);
    play('move');
    toast.success('Pokémon movido al equipo');
  };

  const handleExportShowdown = () => {
    const text = pc.map(p => [`${p.nickname} (${p.name.charAt(0).toUpperCase() + p.name.slice(1)})`, `Ability: ${p.ability}`, `Level: ${p.level}`].join('\n')).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('PC copiada en formato Showdown!');
  };

  const handleCardClick = (pokemon: TeamPokemon) => {
    if (selectedPokemonId === pokemon.id) {
      onSelectPokemon?.(null);
    } else {
      onSelectPokemon?.(pokemon);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          💾 PC Box
          <span className="text-white/40 text-sm font-normal">{pc.length} Pokémon</span>
        </h2>
        <div className="flex gap-2">
          {pc.length > 0 && (
            <button onClick={handleExportShowdown}
              className="poke-btn bg-purple-900 hover:bg-purple-800 text-white text-xs px-3 py-2">
              Showdown
            </button>
          )}
          <button onClick={() => setShowAdd(true)}
            className="poke-btn bg-blue-800 hover:bg-blue-700 text-white text-sm px-4 py-2">
            + Agregar a PC
          </button>
        </div>
      </div>

      {/* Buscador */}
      {pc.length > 0 && (
        <input
          className="w-full bg-black/30 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
          placeholder="🔍 Buscar en la PC..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      )}

      {/* Grid estilo PC Pokémon */}
      {filtered.length === 0 ? (
        <div className="text-center text-white/30 py-16">
          <div className="text-5xl mb-3">💾</div>
          <p>{pc.length === 0 ? 'La PC está vacía' : 'Sin resultados'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
          {filtered.map(pokemon => (
            <PCCard
              key={pokemon.id}
              pokemon={pokemon}
              isSelected={selectedPokemonId === pokemon.id}
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
              onMoveToTeam={() => handleMoveToTeam(pokemon.id)}
              onRemove={() => { if (pokemon.id === selectedPokemonId) onSelectPokemon?.(null); removeFromPC(pokemon.id); toast('Pokémon eliminado'); }}
              onSendToCemetery={() => { setSelectedId(pokemon.id); setShowDeath(true); }}
              onToggleShiny={() => updatePokemon(pokemon.id, { isShiny: !pokemon.isShiny })}
              onOpenDetail={() => setDetailPokemon(pokemon)}
              onClick={() => handleCardClick(pokemon)}
            />
          ))}
        </div>
      )}

      {/* Modal Agregar */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl my-4">
            <h3 className="text-white font-bold text-lg mb-4">➕ Agregar a PC</h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs block mb-1">Nombre o Nº Pokédex *</label>
                <PokemonAutocomplete value={searchQuery} onChange={setSearchQuery} onSelect={handlePokemonSelect} placeholder="ej: pikachu / 25" />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Mote</label>
                <input className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="Nombre personalizado" value={nickname} onChange={e => setNickname(e.target.value)} />
              </div>
              <div>
                <label className="text-white/50 text-xs block mb-1">Ruta de captura</label>
                <input className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="ej: Ruta 1" value={route} onChange={e => setRoute(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/50 text-xs block mb-1">Nivel</label>
                  <input type="number" min={1} max={100}
                    className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none text-sm"
                    value={level} onChange={e => setLevel(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-white/50 text-xs block mb-1">Habilidad</label>
                  <AbilityAutocomplete value={ability} onChange={setAbility} options={pokemonAbilities} placeholder="Habilidad..." />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs">Stats del juego</label>
                  <button onClick={() => setUseCustomStats(!useCustomStats)}
                    className={`text-xs px-2 py-0.5 rounded-lg border transition-all ${useCustomStats ? 'bg-blue-900/40 border-blue-600/40 text-blue-300' : 'bg-black/30 border-white/10 text-white/40 hover:text-white/70'}`}>
                    {useCustomStats ? 'Editando' : 'Editar stats'}
                  </button>
                </div>
                {useCustomStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor stats={customStats} onChange={setCustomStats} level={level} />
                  </div>
                ) : loadedStats ? (
                  <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                    <StatsEditor stats={loadedStats} onChange={() => {}} compact level={level} />
                    <p className="text-white/30 text-xs mt-2 text-center">Stats al nivel {level} — activa "Editar stats" para modificar</p>
                  </div>
                ) : (
                  <p className="text-white/20 text-xs text-center py-2">Selecciona un Pokémon para ver sus stats</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50">
                {loading ? 'Buscando...' : '✔ Agregar'}
              </button>
              <button onClick={() => { setShowAdd(false); setSearchQuery(''); setLoadedStats(null); setUseCustomStats(false); setPokemonAbilities([]); }}
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
            <p className="text-white/40 text-sm mb-4">{pc.find(p => p.id === selectedId)?.nickname}</p>
            <div className="space-y-3">
              <input className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                placeholder="Causa de muerte *" value={deathForm.cause} onChange={e => setDeathForm(f => ({ ...f, cause: e.target.value }))} />
              <input className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-red-900/30 outline-none placeholder:text-white/30"
                placeholder="Responsable" value={deathForm.killedBy} onChange={e => setDeathForm(f => ({ ...f, killedBy: e.target.value }))} />
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

      {detailPokemon && (
        <PokemonDetailModal pokemon={detailPokemon} onClose={() => setDetailPokemon(null)} />
      )}
    </div>
  );
}

// ── PC Card ──────────────────────────────────────────────────────
interface PCCardProps {
  pokemon: TeamPokemon;
  isSelected: boolean;
  isEditing: boolean;
  editNick: string; editLevel: number; editAbility: string; editStats: BaseStat;
  onEditNick: (v: string) => void; onEditLevel: (v: number) => void;
  onEditAbility: (v: string) => void; onEditStats: (s: BaseStat) => void;
  onStartEdit: () => void; onSaveEdit: () => void; onCancelEdit: () => void;
  onEvolve: () => void; onMoveToTeam: () => void; onRemove: () => void;
  onSendToCemetery: () => void; onToggleShiny: () => void; onOpenDetail: () => void;
  onClick: () => void;
}

function PCCard({
  pokemon, isSelected, isEditing,
  editNick, editLevel, editAbility, editStats,
  onEditNick, onEditLevel, onEditAbility, onEditStats,
  onStartEdit, onSaveEdit, onCancelEdit, onEvolve,
  onMoveToTeam, onRemove, onSendToCemetery, onToggleShiny, onOpenDetail,
  onClick,
}: PCCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={() => { if (!showMenu) onClick(); }}
      className={`relative flex flex-col items-center gap-1.5 p-2 cursor-pointer transition-all duration-150 select-none
        border-2 rounded-lg
        ${isSelected
          ? 'border-yellow-400/80 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
          : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
        }`}
    >
      {/* Menu button */}
      <button
        onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
        className="absolute top-1.5 right-1.5 text-white/30 hover:text-white text-base z-10 leading-none w-5 h-5 flex items-center justify-center"
      >
        ⋮
      </button>

      {showMenu && (
        <div className="absolute top-7 right-1 z-20 bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-36"
          onClick={e => e.stopPropagation()}>
          <button onClick={() => { onStartEdit(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 text-xs">✏️ Editar</button>
          <button onClick={() => { onEvolve(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-blue-400 hover:bg-blue-900/30 text-xs">🔄 Evolucionar</button>
          <button onClick={() => { onOpenDetail(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 text-xs">📋 Ver detalle</button>
          <button onClick={() => { onToggleShiny(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-yellow-400 hover:bg-yellow-900/20 text-xs">✨ {pokemon.isShiny ? 'Normal' : 'Shiny'}</button>
          <button onClick={() => { onMoveToTeam(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-green-400 hover:bg-green-900/30 text-xs">⚔️ Al equipo</button>
          <button onClick={() => { onSendToCemetery(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-900/30 text-xs">🪦 Cementerio</button>
          <button onClick={() => { onRemove(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-white/30 hover:bg-white/5 text-xs">🗑️ Eliminar</button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-1.5 w-full" onClick={e => e.stopPropagation()}>
          <input className="w-full bg-black/40 text-white text-xs rounded px-2 py-1 border border-white/20 outline-none"
            value={editNick} onChange={e => onEditNick(e.target.value)} placeholder="Mote" />
          <input type="number" min={1} max={100}
            className="w-full bg-black/40 text-white text-xs rounded px-2 py-1 border border-white/20 outline-none"
            value={editLevel} onChange={e => onEditLevel(Number(e.target.value))} />
          <AbilityAutocomplete value={editAbility} onChange={onEditAbility} placeholder="Habilidad..." />
          <div className="bg-black/20 rounded p-2 border border-white/10">
            <StatsEditor stats={editStats} onChange={onEditStats} level={editLevel} />
          </div>
          <div className="flex gap-1">
            <button onClick={onSaveEdit} className="flex-1 py-1 rounded bg-green-800 hover:bg-green-700 text-white text-xs font-bold">✔</button>
            <button onClick={onCancelEdit} className="flex-1 py-1 rounded bg-white/10 hover:bg-white/20 text-white/60 text-xs">✗</button>
          </div>
        </div>
      ) : (
        <>
          {/* Sprite */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <img
              src={pokemon.isShiny ? pokemon.spriteShiny : pokemon.sprite}
              alt={pokemon.name}
              className="w-full h-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            {pokemon.isShiny && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
          </div>

          {/* Nivel */}
          <span className="text-white/50 text-[9px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Lv.{pokemon.level}
          </span>

          {/* Nombre */}
          <div className="text-center w-full">
            <div className="text-white text-[10px] font-bold truncate leading-tight"
              style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {pokemon.nickname}
            </div>
            <div className="text-white/30 text-[8px] capitalize truncate">{pokemon.name}</div>
          </div>

          {/* Tipos */}
          <div className="flex gap-0.5 flex-wrap justify-center">
            {pokemon.types.map(t => (
              <span key={t} className="text-white text-[7px] px-1.5 py-0.5 rounded-sm font-bold uppercase"
                style={{ background: TYPE_COLORS[t as PokemonType] }}>
                {t}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}