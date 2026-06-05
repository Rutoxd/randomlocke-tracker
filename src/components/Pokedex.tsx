import { useState } from 'react';
import { usePokeAPI } from '../hooks/usePokeAPI';
import { TYPE_COLORS, TYPE_LABELS, getDefensiveWeaknesses } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';
import type { PokeSearchResult, PokeVarietyOption } from '../hooks/usePokeAPI';
import PokemonAutocomplete from './PokemonAutocomplete';
import { ALL_ABILITIES } from '../data/abilities';

type PokedexTab = 'pokemon' | 'abilities';

export default function Pokedex() {
  const { searchPokemon, loading } = usePokeAPI();
  const [activeTab, setActiveTab] = useState<PokedexTab>('pokemon');

  // Tab Pokémon
  const [query,         setQuery]         = useState('');
  const [result,        setResult]        = useState<PokeSearchResult | null>(null);
  const [error,         setError]         = useState('');
  const [showShiny,     setShowShiny]     = useState(false);
  const [activeVariety, setActiveVariety] = useState<PokeVarietyOption | null>(null);

  // Tab Habilidades
  const [abilityQuery, setAbilityQuery] = useState('');

  const handleSearch = async (name?: string) => {
    const q = name ?? query;
    if (!q.trim()) return;
    setError('');
    setResult(null);
    setActiveVariety(null);
    const data = await searchPokemon(q);
    if (!data) { setError('Pokémon no encontrado. Verifica el nombre o número.'); return; }
    setResult(data);
    setShowShiny(false);
  };

  const handleVariety = async (variety: PokeVarietyOption) => {
    setActiveVariety(variety);
    setError('');
    const data = await searchPokemon(variety.name);
    if (!data) return;
    setResult({ ...data, varieties: result?.varieties ?? [] });
    setShowShiny(false);
  };

  const weaknesses = result ? getDefensiveWeaknesses(result.types) : {};
  const grouped = {
    '4x':   Object.entries(weaknesses).filter(([, v]) => v === 4).map(([k]) => k as PokemonType),
    '2x':   Object.entries(weaknesses).filter(([, v]) => v === 2).map(([k]) => k as PokemonType),
    '0.5x': Object.entries(weaknesses).filter(([, v]) => v === 0.5).map(([k]) => k as PokemonType),
    '0x':   Object.entries(weaknesses).filter(([, v]) => v === 0).map(([k]) => k as PokemonType),
  };

  const statMax: Record<string, number> = { hp: 255, attack: 190, defense: 230, spAtk: 194, spDef: 230, speed: 200 };
  const statLabels: Record<string, string> = { hp: 'PS', attack: 'Ataque', defense: 'Defensa', spAtk: 'Sp.Atk', spDef: 'Sp.Def', speed: 'Velocidad' };

  const filteredAbilities = abilityQuery.length >= 1
    ? ALL_ABILITIES.filter(a =>
        a.name.toLowerCase().includes(abilityQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(abilityQuery.toLowerCase())
      )
    : ALL_ABILITIES;

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">📖 Pokédex</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('pokemon')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
            activeTab === 'pokemon'
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-black/20 text-white/50 border-white/10 hover:text-white/80'
          }`}
        >
          🐉 Pokémon
        </button>
        <button
          onClick={() => setActiveTab('abilities')}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
            activeTab === 'abilities'
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-black/20 text-white/50 border-white/10 hover:text-white/80'
          }`}
        >
          🔮 Habilidades
        </button>
      </div>

      {/* ── TAB POKÉMON ── */}
      {activeTab === 'pokemon' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <PokemonAutocomplete
              value={query}
              onChange={setQuery}
              onSelect={(name) => handleSearch(name)}
              placeholder="Nombre o número (ej: charizard / 6)"
              className="flex-1 bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/10 outline-none placeholder:text-white/30 text-sm"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="poke-btn px-5 py-2.5 text-white font-bold text-sm disabled:opacity-50"
              style={{ background: 'var(--theme-primary)' }}
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-900/40 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Panel izquierdo */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3">
                {/* Sprite */}
                <div className="relative">
                  <div className="w-40 h-40 flex items-center justify-center bg-black/20 rounded-2xl border border-white/5">
                    <img
                      src={showShiny ? result.spriteShiny : result.sprite}
                      alt={result.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <button
                    onClick={() => setShowShiny(!showShiny)}
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                      showShiny
                        ? 'bg-yellow-400 border-yellow-300 text-yellow-900'
                        : 'bg-black/50 border-white/20 text-white/50 hover:text-white'
                    }`}
                    title="Ver shiny"
                  >✨</button>
                </div>

                {/* Nombre y número */}
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">#{String(result.id).padStart(3, '0')}</div>
                  <div className="text-white font-bold text-2xl capitalize">{result.name}</div>
                </div>

                {/* Tipos */}
                <div className="flex gap-2 flex-wrap justify-center">
                  {result.types.map(t => (
                    <span key={t} className="type-badge text-white text-sm px-3 py-1"
                      style={{ background: TYPE_COLORS[t] }}>
                      {TYPE_LABELS[t] || t}
                    </span>
                  ))}
                </div>

                {/* Formas alternativas */}
                {result.varieties && result.varieties.length > 1 && (
                  <div className="w-full">
                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Formas</div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.varieties.map(v => (
                        <button
                          key={v.name}
                          onClick={() => handleVariety(v)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all capitalize ${
                            (activeVariety?.name ?? result.name) === v.name
                              ? 'bg-white/20 text-white border-white/40'
                              : 'bg-black/20 text-white/50 border-white/10 hover:text-white hover:border-white/30'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info física */}
                <div className="grid grid-cols-3 gap-2 w-full text-center text-xs">
                  <div className="bg-black/20 rounded-lg p-2">
                    <div className="text-white/30">Altura</div>
                    <div className="text-white font-bold">{(result.height / 10).toFixed(1)}m</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2">
                    <div className="text-white/30">Peso</div>
                    <div className="text-white font-bold">{(result.weight / 10).toFixed(1)}kg</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2">
                    <div className="text-white/30">Exp. base</div>
                    <div className="text-white font-bold">{result.baseExp}</div>
                  </div>
                </div>

                {/* Habilidades del Pokémon */}
                <div className="w-full">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Habilidades</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.abilities.map(a => {
                      const info = ALL_ABILITIES.find(ab => ab.name.toLowerCase() === a.toLowerCase());
                      return (
                        <div key={a}
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 group relative cursor-default"
                          title={info?.description ?? ''}
                        >
                          <span className="text-white/70 text-xs capitalize">{a}</span>
                          {info && (
                            <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 w-48 bg-gray-900 border border-white/20 rounded-lg p-2 z-50 shadow-xl">
                              <p className="text-white/80 text-xs">{info.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Panel derecho */}
              <div className="space-y-4">
                {/* Stats */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Estadísticas base</div>
                  <div className="space-y-2">
                    {Object.entries(result.stats).map(([key, val]) => {
                      const max = statMax[key] || 255;
                      const pct = Math.min((val / max) * 100, 100);
                      const color = val >= 100 ? '#4ade80' : val >= 70 ? '#facc15' : val >= 50 ? '#fb923c' : '#f87171';
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-white/40 text-xs w-16 text-right">{statLabels[key]}</span>
                          <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: color }} />
                          </div>
                          <span className="text-white/70 text-xs w-8 text-right font-bold">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs">
                    <span className="text-white/30">Total</span>
                    <span className="text-white font-bold">
                      {Object.values(result.stats).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                {/* Matchups */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Matchups defensivos</div>
                  <div className="space-y-3">
                    {grouped['4x'].length > 0   && <MatchupRow label="x4 Débil"  types={grouped['4x']}   color="text-red-400" />}
                    {grouped['2x'].length > 0   && <MatchupRow label="x2 Débil"  types={grouped['2x']}   color="text-orange-400" />}
                    {grouped['0.5x'].length > 0 && <MatchupRow label="½ Resiste" types={grouped['0.5x']} color="text-green-400" />}
                    {grouped['0x'].length > 0   && <MatchupRow label="Inmune"    types={grouped['0x']}   color="text-blue-400" />}
                    {Object.values(grouped).every(g => g.length === 0) && (
                      <p className="text-white/30 text-sm">Sin debilidades ni resistencias especiales</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="text-center text-white/20 py-16">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-lg">Busca cualquier Pokémon</p>
              <p className="text-sm mt-1">por nombre o número de Pokédex</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB HABILIDADES ── */}
      {activeTab === 'abilities' && (
        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <input
              className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/10 outline-none placeholder:text-white/30 text-sm"
              placeholder="Buscar habilidad por nombre o efecto..."
              value={abilityQuery}
              onChange={e => setAbilityQuery(e.target.value)}
            />
            {abilityQuery && (
              <button
                onClick={() => setAbilityQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >✕</button>
            )}
          </div>

          {/* Contador */}
          <div className="text-white/30 text-xs">
            {filteredAbilities.length} habilidad{filteredAbilities.length !== 1 ? 'es' : ''}
            {abilityQuery && ` para "${abilityQuery}"`}
          </div>

          {/* Lista */}
          {filteredAbilities.length === 0 ? (
            <div className="text-center text-white/20 py-12">
              <div className="text-4xl mb-3">🔮</div>
              <p>No se encontró ninguna habilidad</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredAbilities.map(ability => (
                <div
                  key={ability.name}
                  className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-white font-bold text-sm">{ability.name}</div>
                    <div className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-700/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-300 text-xs">🔮</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed">{ability.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchupRow({ label, types, color }: { label: string; types: PokemonType[]; color: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`text-xs font-bold w-16 flex-shrink-0 pt-0.5 ${color}`}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {types.map(t => (
          <span key={t} className="type-badge text-white text-xs px-2 py-0.5"
            style={{ background: TYPE_COLORS[t] }}>
            {TYPE_LABELS[t] || t}
          </span>
        ))}
      </div>
    </div>
  );
}