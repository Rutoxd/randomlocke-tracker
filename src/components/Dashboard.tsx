import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLeagueForGame } from '../utils/leagueData';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const settings       = useGameStore(s => s.settings);
  const rules          = useGameStore(s => s.rules);
  const team           = useGameStore(s => s.team);
  const badges         = useGameStore(s => s.badges);
  const versus         = useGameStore(s => s.versus);
  const toggleRule     = useGameStore(s => s.toggleRule);
  const toggleBadge    = useGameStore(s => s.toggleBadge);
  const setBadges      = useGameStore(s => s.setBadges);
  const addVersus      = useGameStore(s => s.addVersus);
  const removeVersus   = useGameStore(s => s.removeVersus);
  const incrementWipe  = useGameStore(s => s.incrementWipe);

  const league = getLeagueForGame(settings.gameVersion);
  const [showVersusForm, setShowVersusForm] = useState(false);
  const [versusForm, setVersusForm] = useState({ opponent: '', result: 'win' as 'win'|'loss'|'draw', notes: '' });

  // Inicializar medallas si cambia la liga
  const initBadges = () => {
    if (!league) return;
    const newBadges = league.gymLeaders.map((gl, i) => ({
      id: `${settings.gameVersion}-${i}`,
      name: gl.badge,
      region: league.region.toLowerCase() as import('../types/game.types').BadgeRegion,
      obtained: false,
      gymLeader: gl.name,
      type: gl.type,
    }));
    setBadges(newBadges);
    toast.success(`Medallas de ${league.region} cargadas`);
  };

  // MVP del equipo (mayor suma de stats)
  const mvp = team.length > 0
    ? team.reduce((best, p) => {
        const total = Object.values(p.stats).reduce((a, b) => a + b, 0);
        const bestTotal = Object.values(best.stats).reduce((a, b) => a + b, 0);
        return total > bestTotal ? p : best;
      })
    : null;

  // Stats del versus
  const wins   = versus.filter(v => v.result === 'win').length;
  const losses = versus.filter(v => v.result === 'loss').length;
  const draws  = versus.filter(v => v.result === 'draw').length;

  const handleAddVersus = () => {
    if (!versusForm.opponent.trim()) return;
    addVersus({
      id: crypto.randomUUID(),
      opponent: versusForm.opponent,
      result: versusForm.result,
      date: new Date().toLocaleDateString('es-MX'),
      notes: versusForm.notes,
    });
    setVersusForm({ opponent: '', result: 'win', notes: '' });
    setShowVersusForm(false);
    toast.success('Resultado registrado');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      {/* ── Reglas Nuzlocke ── */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>📋</span> Reglas Nuzlocke
        </h2>
        <div className="space-y-2">
          {rules.map(rule => (
            <label key={rule.id} className="flex items-start gap-2 cursor-pointer group">
              <div
                onClick={() => toggleRule(rule.id)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  rule.enabled
                    ? 'bg-green-500 border-green-500'
                    : 'bg-transparent border-white/30'
                }`}
              >
                {rule.enabled && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm transition-colors ${rule.enabled ? 'text-white' : 'text-white/40 line-through'}`}>
                {rule.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Stats generales ── */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>📊</span> Estado de partida
        </h2>
        <div className="grid grid-cols-2 gap-3">
      <div className="bg-black/20 rounded-lg p-3 text-center">
  <div className="text-white/50 text-xs mb-2">🪙 Tokens</div>
  <div className="flex items-center justify-center gap-2">
    <button
      onClick={() => useGameStore.getState().useResurrectionToken()}
      className="w-7 h-7 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-white font-bold text-sm transition-colors"
    >−</button>
    <span className="text-2xl font-bold text-yellow-400 w-8 text-center">
      {settings.resurrectionTokens}
    </span>
    <button
      onClick={() => useGameStore.getState().addResurrectionToken()}
      className="w-7 h-7 rounded-lg bg-green-900/40 hover:bg-green-900/70 text-white font-bold text-sm transition-colors"
    >+</button>
  </div>
  <div className="text-white/30 text-xs mt-1">+2 por medalla</div>
</div>
        </div>

        {/* Wipe rápido */}
        <button
          onClick={() => { if (confirm('¿Registrar un wipe?')) { incrementWipe(); toast('💀 Wipe registrado', { icon: '💀' }); }}}
          className="mt-3 w-full py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-bold border border-red-900/30 transition-colors"
        >
          + Registrar Wipe
        </button>
      </div>

      {/* ── MVP del equipo ── */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>⭐</span> MVP del equipo
        </h2>
        {mvp ? (
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img src={mvp.isShiny ? mvp.spriteShiny : mvp.sprite} alt={mvp.name}
                className="w-24 h-24 object-contain drop-shadow-lg" />
              {mvp.isShiny && <span className="absolute top-0 right-0 text-lg">✨</span>}
            </div>
            <div className="text-white font-bold text-lg">{mvp.nickname}</div>
            <div className="text-white/50 text-sm capitalize">{mvp.name}</div>
            <div className="flex gap-1 mt-1 justify-center flex-wrap">
              {mvp.types.map(t => (
                <span key={t} className="type-badge text-white text-xs"
                  style={{ background: TYPE_COLORS[t as PokemonType] }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 w-full grid grid-cols-3 gap-1 text-xs">
              {Object.entries(mvp.stats).map(([key, val]) => (
                <div key={key} className="bg-black/20 rounded p-1 text-center">
                  <div className="text-white/40 uppercase text-xs">{key}</div>
                  <div className="text-white font-bold">{val}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-white/30 py-8">
            <div className="text-4xl mb-2">🎮</div>
            <p className="text-sm">Agrega Pokémon al equipo<br/>para ver el MVP</p>
          </div>
        )}
      </div>

      {/* ── Medallas ── */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4 md:col-span-2 xl:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold flex items-center gap-2">
            <span>🏅</span> Medallas
            {league && <span className="text-white/40 text-xs font-normal">— {league.region}</span>}
          </h2>
          {league && badges.length === 0 && (
            <button onClick={initBadges}
              className="text-xs px-3 py-1 rounded-lg bg-yellow-900/40 hover:bg-yellow-900/60 text-yellow-300 border border-yellow-900/40 transition-colors">
              Cargar medallas
            </button>
          )}
        </div>

        {badges.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(badges.filter(b => b.obtained).length / badges.length) * 100}%`,
                    background: 'var(--theme-accent, #ff6b6b)'
                  }}
                />
              </div>
              <span className="text-white/60 text-xs">
                {badges.filter(b => b.obtained).length}/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {badges.map(badge => (
                <button
                  key={badge.id}
                  onClick={() => toggleBadge(badge.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    badge.obtained
                      ? 'border-yellow-400/60 bg-yellow-400/10 scale-105'
                      : 'border-white/10 bg-black/20 opacity-40 hover:opacity-70'
                  }`}
                >
                  <span className="text-2xl">{badge.obtained ? '🏅' : '⭕'}</span>
                  <span className="text-white text-xs text-center leading-tight">{badge.name}</span>
                </button>
              ))}
            </div>

            {/* Alto Mando */}
            {league && league.eliteFour.length > 0 && (
              <div className="mt-4">
                <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Alto Mando</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {league.eliteFour.map((e4, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                      <div className="text-white text-sm font-bold">{e4.name}</div>
                      <div className="text-xs mt-0.5"
                        style={{ color: TYPE_COLORS[e4.type.toLowerCase() as PokemonType] || '#888' }}>
                        {e4.type}
                      </div>
                    </div>
                  ))}
                  <div className="bg-yellow-900/20 rounded-lg p-2 text-center border border-yellow-900/30">
                    <div className="text-yellow-300 text-sm font-bold">👑 {league.champion}</div>
                    <div className="text-yellow-600 text-xs mt-0.5">Campeón</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/30 py-6">
            <div className="text-4xl mb-2">🏅</div>
            <p className="text-sm">
              {league
                ? 'Haz clic en "Cargar medallas" para inicializar'
                : 'Selecciona un juego en configuración'}
            </p>
          </div>
        )}
      </div>

      {/* ── Historial Versus ── */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold flex items-center gap-2">
            <span>⚔️</span> Historial Versus
          </h2>
          <button
            onClick={() => setShowVersusForm(!showVersusForm)}
            className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            + Agregar
          </button>
        </div>

        {/* Stats W/L/D */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-green-900/30 rounded-lg p-2 text-center border border-green-900/30">
            <div className="text-green-400 font-bold text-xl">{wins}</div>
            <div className="text-green-600 text-xs">Victorias</div>
          </div>
          <div className="flex-1 bg-red-900/30 rounded-lg p-2 text-center border border-red-900/30">
            <div className="text-red-400 font-bold text-xl">{losses}</div>
            <div className="text-red-600 text-xs">Derrotas</div>
          </div>
          <div className="flex-1 bg-gray-900/30 rounded-lg p-2 text-center border border-gray-700/30">
            <div className="text-gray-400 font-bold text-xl">{draws}</div>
            <div className="text-gray-500 text-xs">Empates</div>
          </div>
        </div>

        {/* Formulario */}
        {showVersusForm && (
          <div className="bg-black/20 rounded-lg p-3 mb-3 border border-white/10 space-y-2">
            <input
              className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none placeholder:text-white/30"
              placeholder="Nombre del rival"
              value={versusForm.opponent}
              onChange={e => setVersusForm(f => ({ ...f, opponent: e.target.value }))}
            />
            <select
              className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none"
              value={versusForm.result}
              onChange={e => setVersusForm(f => ({ ...f, result: e.target.value as 'win'|'loss'|'draw' }))}
            >
              <option value="win">Victoria ✅</option>
              <option value="loss">Derrota ❌</option>
              <option value="draw">Empate 🤝</option>
            </select>
            <input
              className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none placeholder:text-white/30"
              placeholder="Notas (opcional)"
              value={versusForm.notes}
              onChange={e => setVersusForm(f => ({ ...f, notes: e.target.value }))}
            />
            <div className="flex gap-2">
              <button onClick={handleAddVersus}
                className="flex-1 py-1.5 rounded-lg bg-green-900/50 hover:bg-green-900/70 text-green-300 text-sm font-bold transition-colors">
                Guardar
              </button>
              <button onClick={() => setShowVersusForm(false)}
                className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {versus.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">Sin registros</p>
          ) : (
            versus.slice(0, 10).map(v => (
              <div key={v.id} className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
                <span className="text-lg">{v.result === 'win' ? '✅' : v.result === 'loss' ? '❌' : '🤝'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-bold truncate">{v.opponent}</div>
                  <div className="text-white/40 text-xs">{v.date}</div>
                </div>
                <button onClick={() => removeVersus(v.id)}
                  className="text-white/20 hover:text-red-400 transition-colors text-xs">✗</button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}