import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';
import toast from 'react-hot-toast';

export default function Cemetery() {
  const cemetery     = useGameStore(s => s.cemetery);
  const settings     = useGameStore(s => s.settings);
  const addToPC      = useGameStore(s => s.addToPC);
  const spendToken = useGameStore(s => s.useResurrectionToken);
  const [filter, setFilter]   = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Remover del cementerio — necesitamos acceder al estado directo
  const removFromCemetery = (id: string) => {
    useGameStore.setState(s => ({
      cemetery: s.cemetery.filter(p => p.id !== id)
    }));
  };

  const filtered = cemetery.filter(p =>
    p.nickname.toLowerCase().includes(filter.toLowerCase()) ||
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.killedBy.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRevive = (pokemonId: string) => {
    if (settings.resurrectionTokens <= 0) {
      toast.error('No tienes tokens de resurrección 🪙');
      return;
    }
    setConfirmId(pokemonId);
  };

  const confirmRevive = () => {
    if (!confirmId) return;
    const pokemon = cemetery.find(p => p.id === confirmId);
    if (!pokemon) return;

    // Usar token
    spendToken();

    // Mover a PC
    addToPC({ ...pokemon, status: 'pc', slot: null });

    // Quitar del cementerio
    removFromCemetery(confirmId);

    toast.success(`¡${pokemon.nickname} ha sido revivido! 🪙 → 💾 PC`, {
      icon: '✨',
      duration: 3000,
    });

    setConfirmId(null);
    setSelected(null);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          🪦 Cementerio
          <span className="text-white/40 text-sm font-normal">{cemetery.length} caídos</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Tokens disponibles */}
          <div className="flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-700/40 rounded-lg px-3 py-1.5">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-yellow-300 font-bold text-sm">{settings.resurrectionTokens}</span>
            <span className="text-yellow-600 text-xs">tokens</span>
          </div>
          {cemetery.length > 0 && (
            <input
              className="bg-black/30 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none placeholder:text-white/30 w-36"
              placeholder="Buscar..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Modal confirmación revivir */}
      {confirmId && (() => {
        const p = cemetery.find(pk => pk.id === confirmId);
        if (!p) return null;
        return (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-yellow-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center mb-4">
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-20 h-20 object-contain mx-auto mb-2"
                  style={{ filter: 'drop-shadow(0 0 12px #ffd700)' }}
                />
                <h3 className="text-yellow-300 font-bold text-lg">¿Revivir a {p.nickname}?</h3>
                <p className="text-white/50 text-sm mt-1 capitalize">{p.name} · Lv.{p.level}</p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-3 mb-4 text-center">
                <p className="text-yellow-400 text-sm">
                  Se usará <span className="font-bold text-yellow-300">1 token 🪙</span>
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Te quedan {settings.resurrectionTokens} token{settings.resurrectionTokens !== 1 ? 's' : ''}
                </p>
                <p className="text-white/40 text-xs mt-2">
                  El Pokémon será enviado a la PC Box
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={confirmRevive}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  style={{ background: '#c9a900', color: '#000' }}
                >
                  ✨ Confirmar
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {cemetery.length === 0 ? (
        <div className="text-center text-white/30 py-16">
          <div className="text-5xl mb-3">🌿</div>
          <p>Nadie ha caído todavía.</p>
          <p className="text-xs mt-1">¡Que siga así!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(pokemon => (
            <div
              key={pokemon.id}
              className="bg-black/30 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/20 transition-all"
              onClick={() => setSelected(selected === pokemon.id ? null : pokemon.id)}
            >
              <div className="flex items-center gap-3">
                {/* Sprite gris */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-16 h-16 object-contain"
                    style={{ filter: 'grayscale(100%) opacity(0.6)' }}
                  />
                  <span className="absolute -top-1 -right-1 text-lg">💀</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold truncate">{pokemon.nickname}</span>
                    <span className="text-white/40 text-xs capitalize">({pokemon.name})</span>
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {pokemon.types.map(t => (
                      <span key={t} className="type-badge text-white text-xs px-1.5 py-0.5"
                        style={{ background: TYPE_COLORS[t as PokemonType] }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    Lv.{pokemon.level} · {pokemon.caughtAt || '—'}
                  </div>
                </div>

                {/* Botón revivir */}
                <button
                  onClick={e => { e.stopPropagation(); handleRevive(pokemon.id); }}
                  disabled={settings.resurrectionTokens <= 0}
                  className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all"
                  style={settings.resurrectionTokens > 0 ? {
                    background: 'rgba(201,169,0,0.15)',
                    borderColor: 'rgba(201,169,0,0.4)',
                    color: '#ffd700',
                  } : {
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'not-allowed',
                  }}
                  title={settings.resurrectionTokens > 0
                    ? `Revivir (cuesta 1 token, tienes ${settings.resurrectionTokens})`
                    : 'No tienes tokens de resurrección'}
                >
                  <span className="text-base">✨</span>
                  <span className="text-xs font-bold">🪙1</span>
                </button>
              </div>

              {/* Detalle expandible */}
              {selected === pokemon.id && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3">
                    <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Causa de muerte
                    </div>
                    <div className="text-white/80 text-sm">{pokemon.deathCause || '—'}</div>
                  </div>

                  {pokemon.killedBy && (
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Responsable</div>
                      <div className="text-white/70 text-sm">{pokemon.killedBy}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">Capturado</div>
                      <div className="text-white/60">{pokemon.caughtDate || '—'}</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">Fallecido</div>
                      <div className="text-white/60">{pokemon.deathDate || '—'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(pokemon.stats).map(([key, val]) => (
                      <div key={key} className="bg-black/20 rounded p-1.5 text-center">
                        <div className="text-white/30 text-xs uppercase">{key}</div>
                        <div className="text-white/60 font-bold text-sm">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-white/30 text-xs text-center">
                    Habilidad: <span className="capitalize">{pokemon.ability}</span>
                  </div>

                  {/* Botón revivir grande dentro del detalle */}
                  <button
                    onClick={e => { e.stopPropagation(); handleRevive(pokemon.id); }}
                    disabled={settings.resurrectionTokens <= 0}
                    className="w-full py-2.5 rounded-xl font-bold text-sm transition-all border"
                    style={settings.resurrectionTokens > 0 ? {
                      background: 'rgba(201,169,0,0.2)',
                      borderColor: 'rgba(201,169,0,0.5)',
                      color: '#ffd700',
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.2)',
                      cursor: 'not-allowed',
                    }}
                  >
                    {settings.resurrectionTokens > 0
                      ? `✨ Revivir y enviar a PC — cuesta 🪙1 token`
                      : '🪙 Sin tokens de resurrección'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      {cemetery.length > 0 && (
        <div className="bg-black/20 border border-white/5 rounded-xl p-4">
          <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">Estadísticas del cementerio</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-red-400">{cemetery.length}</div>
              <div className="text-white/30 text-xs">Total caídos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(cemetery.reduce((a, p) => a + p.level, 0) / cemetery.length)}
              </div>
              <div className="text-white/30 text-xs">Nivel promedio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {cemetery.reduce((max, p) => p.level > max ? p.level : max, 0)}
              </div>
              <div className="text-white/30 text-xs">Nivel más alto</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {new Set(cemetery.map(p => p.killedBy)).size}
              </div>
              <div className="text-white/30 text-xs">Rivales distintos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}