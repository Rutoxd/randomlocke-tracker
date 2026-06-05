import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLeagueForGame } from '../utils/leagueData';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const settings      = useGameStore(s => s.settings);
  const rules         = useGameStore(s => s.rules);
  const team          = useGameStore(s => s.team);
  const cemetery      = useGameStore(s => s.cemetery);
  const badges        = useGameStore(s => s.badges);
  const versus        = useGameStore(s => s.versus);
  const toggleRule    = useGameStore(s => s.toggleRule);
  const toggleBadge   = useGameStore(s => s.toggleBadge);
  const setBadges     = useGameStore(s => s.setBadges);
  const addVersus     = useGameStore(s => s.addVersus);
  const removeVersus  = useGameStore(s => s.removeVersus);
  const incrementWipe = useGameStore(s => s.incrementWipe);

  const league = getLeagueForGame(settings.gameVersion);
  const [showVersusForm, setShowVersusForm] = useState(false);
  const [showRules,      setShowRules]      = useState(false);
  const [versusForm, setVersusForm] = useState({ opponent: '', result: 'win' as 'win'|'loss'|'draw', notes: '' });

  const initBadges = () => {
    if (!league) return;
    const newBadges = league.gymLeaders.map((gl, i) => ({
      id: `${settings.gameVersion}-${i}`,
      name: gl.badge,
      region: league.region.toLowerCase() as import('../types/game.types').BadgeRegion,
      obtained: false,
    }));
    setBadges(newBadges);
    toast.success(`Medallas de ${league.region} cargadas`);
  };

  const mvp = team.length > 0
    ? team.reduce((best, p) => {
        const t = Object.values(p.stats).reduce((a,b) => a+b, 0);
        const b = Object.values(best.stats).reduce((a,b) => a+b, 0);
        return t > b ? p : best;
      })
    : null;

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
    <div className="space-y-4">

      {/* ── Fila 1: Estado (destacado) + MVP ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Estado de partida — tarjeta destacada */}
        <div className="md:col-span-1 rounded-xl border border-blue-500/30 bg-blue-950/40 p-4 shadow-lg shadow-blue-900/20">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span>📊</span> Estado de Partida
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-black/30 rounded-lg p-2 text-center border border-white/5">
              <div className="text-2xl font-bold text-green-400">{team.length}</div>
              <div className="text-white/40 text-xs mt-0.5">En equipo</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center border border-white/5">
              <div className="text-2xl font-bold text-red-400">{cemetery.length}</div>
              <div className="text-white/40 text-xs mt-0.5">Caídos</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center border border-yellow-900/30">
              <div className="text-2xl font-bold text-yellow-400">{settings.resurrectionTokens}</div>
              <div className="text-white/40 text-xs mt-0.5">🪙 Tokens</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center border border-red-900/30">
              <div className="text-2xl font-bold text-red-600">{settings.wipeCount}</div>
              <div className="text-white/40 text-xs mt-0.5">💀 Wipes</div>
            </div>
          </div>
          <button
            onClick={() => { if (confirm('¿Registrar un wipe?')) { incrementWipe(); toast('💀 Wipe registrado'); }}}
            className="w-full py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-bold border border-red-900/30 transition-colors">
            + Registrar Wipe
          </button>
        </div>

        {/* MVP del equipo */}
        <div className="md:col-span-1 bg-black/20 rounded-xl border border-white/10 p-4">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span>⭐</span> MVP
          </h2>
          {mvp ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img src={mvp.isShiny ? mvp.spriteShiny : mvp.sprite} alt={mvp.name}
                  className="w-20 h-20 object-contain drop-shadow-lg" />
                {mvp.isShiny && <span className="absolute top-0 right-0 text-sm">✨</span>}
              </div>
              <div className="text-white font-bold">{mvp.nickname}</div>
              <div className="text-white/40 text-xs capitalize">{mvp.name}</div>
              <div className="flex gap-1 mt-1 justify-center flex-wrap">
                {mvp.types.map(t => (
                  <span key={t} className="type-badge text-white text-xs px-2 py-0.5 rounded-full"
                    style={{ background: TYPE_COLORS[t as PokemonType] }}>{t}</span>
                ))}
              </div>
              <div className="mt-2 text-white/40 text-xs capitalize">🔮 {mvp.ability}</div>
              <div className="mt-1 text-white/30 text-xs">
                Total: <span className="text-white/60 font-bold">
                  {Object.values(mvp.stats).reduce((a,b)=>a+b,0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/20 py-6">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-xs">Agrega Pokémon al equipo</p>
            </div>
          )}
        </div>

        {/* Reglas — compactas y colapsables */}
        <div className="md:col-span-1 bg-black/20 rounded-xl border border-white/10 p-4">
          <button
            onClick={() => setShowRules(!showRules)}
            className="w-full flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span>📋</span> Reglas Nuzlocke
            </h2>
            <span className="text-white/30 text-xs">{showRules ? '▲' : '▼'}</span>
          </button>
          <div className="flex gap-1 flex-wrap mb-2">
            {rules.filter(r => r.enabled).map(r => (
              <span key={r.id} className="text-xs bg-green-900/30 text-green-300 border border-green-900/40 px-2 py-0.5 rounded-full">
                ✓
              </span>
            ))}
            <span className="text-white/30 text-xs self-center ml-1">
              {rules.filter(r=>r.enabled).length}/{rules.length} activas
            </span>
          </div>
          {showRules && (
            <div className="space-y-1.5 mt-2">
              {rules.map(rule => (
                <label key={rule.id} className="flex items-start gap-2 cursor-pointer">
                  <div onClick={() => toggleRule(rule.id)}
                    className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      rule.enabled ? 'bg-green-500 border-green-500' : 'bg-transparent border-white/20'
                    }`}>
                    {rule.enabled && <span className="text-white text-xs leading-none">✓</span>}
                  </div>
                  <span className={`text-xs transition-colors leading-relaxed ${
                    rule.enabled ? 'text-white/70' : 'text-white/25 line-through'
                  }`}>{rule.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Fila 2: Medallas ── */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
            <span>🏅</span> Medallas
            {league && <span className="text-white/30 text-xs font-normal normal-case">— {league.region}</span>}
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
              <div className="h-2 flex-1 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(badges.filter(b=>b.obtained).length / badges.length)*100}%`,
                    background: 'var(--theme-accent, #ff6b6b)'
                  }} />
              </div>
              <span className="text-white/50 text-xs font-bold">
                {badges.filter(b=>b.obtained).length}/{badges.length}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {badges.map(badge => (
                <button key={badge.id} onClick={() => toggleBadge(badge.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    badge.obtained
                      ? 'border-yellow-400/60 bg-yellow-400/10 scale-105'
                      : 'border-white/10 bg-black/20 opacity-40 hover:opacity-70'
                  }`}>
                  <span className="text-xl">{badge.obtained ? '🏅' : '⭕'}</span>
                  <span className="text-white text-xs text-center leading-tight">{badge.name}</span>
                </button>
              ))}
            </div>
            {league && league.eliteFour.length > 0 && (
              <div className="mt-4">
                <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">Alto Mando</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {league.eliteFour.map((e4, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                      <div className="text-white text-xs font-bold">{e4.name}</div>
                      <div className="text-xs mt-0.5"
                        style={{ color: TYPE_COLORS[e4.type.toLowerCase() as PokemonType] || '#888' }}>
                        {e4.type}
                      </div>
                    </div>
                  ))}
                  <div className="bg-yellow-900/20 rounded-lg p-2 text-center border border-yellow-900/30">
                    <div className="text-yellow-300 text-xs font-bold">👑 {league.champion}</div>
                    <div className="text-yellow-600 text-xs">Campeón</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/20 py-4">
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-xs">{league ? 'Haz clic en "Cargar medallas"' : 'Selecciona un juego en configuración'}</p>
          </div>
        )}
      </div>

      {/* ── Fila 3: Versus ── */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
            <span>⚔️</span> Historial Versus
          </h2>
          <button onClick={() => setShowVersusForm(!showVersusForm)}
            className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            + Agregar
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-green-900/20 rounded-lg p-2 text-center border border-green-900/30">
            <div className="text-green-400 font-bold text-xl">{wins}</div>
            <div className="text-green-600 text-xs">Victorias</div>
          </div>
          <div className="flex-1 bg-red-900/20 rounded-lg p-2 text-center border border-red-900/30">
            <div className="text-red-400 font-bold text-xl">{losses}</div>
            <div className="text-red-600 text-xs">Derrotas</div>
          </div>
          <div className="flex-1 bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/30">
            <div className="text-gray-400 font-bold text-xl">{draws}</div>
            <div className="text-gray-500 text-xs">Empates</div>
          </div>
        </div>
        {showVersusForm && (
          <div className="bg-black/20 rounded-lg p-3 mb-3 border border-white/10 space-y-2">
            <input className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none placeholder:text-white/30"
              placeholder="Nombre del rival" value={versusForm.opponent}
              onChange={e => setVersusForm(f => ({ ...f, opponent: e.target.value }))} />
            <select className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none"
              value={versusForm.result}
              onChange={e => setVersusForm(f => ({ ...f, result: e.target.value as 'win'|'loss'|'draw' }))}>
              <option value="win">Victoria ✅</option>
              <option value="loss">Derrota ❌</option>
              <option value="draw">Empate 🤝</option>
            </select>
            <input className="w-full bg-black/40 text-white text-sm rounded px-3 py-2 border border-white/10 outline-none placeholder:text-white/30"
              placeholder="Notas (opcional)" value={versusForm.notes}
              onChange={e => setVersusForm(f => ({ ...f, notes: e.target.value }))} />
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
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {versus.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-3">Sin registros aún</p>
          ) : (
            versus.slice(0,10).map(v => (
              <div key={v.id} className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
                <span className="text-lg">{v.result==='win'?'✅':v.result==='loss'?'❌':'🤝'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-bold truncate">{v.opponent}</div>
                  <div className="text-white/50 text-xs">{v.date}</div>
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