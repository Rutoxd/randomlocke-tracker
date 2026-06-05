import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';

export default function Cemetery() {
  const cemetery = useGameStore(s => s.cemetery);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = cemetery.filter(p =>
    p.nickname.toLowerCase().includes(filter.toLowerCase()) ||
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.killedBy.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          🪦 Cementerio
          <span className="text-white/40 text-sm font-normal">{cemetery.length} caídos</span>
        </h2>
        {cemetery.length > 0 && (
          <input
            className="bg-black/30 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none placeholder:text-white/30 w-44"
            placeholder="Buscar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        )}
      </div>

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
              onClick={() => setSelected(selected === pokemon.id ? null : pokemon.id)}
              className="bg-black/30 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                {/* Sprite en escala de grises */}
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
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold truncate">{pokemon.nickname}</span>
                    <span className="text-white/40 text-xs capitalize">({pokemon.name})</span>
                  </div>

                  <div className="flex gap-1 mt-1 flex-wrap">
                    {pokemon.types.map(t => (
                      <span
                        key={t}
                        className="type-badge text-white text-xs px-1.5 py-0.5"
                        style={{ background: TYPE_COLORS[t as PokemonType] }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="text-white/40 text-xs mt-1">
                    Lv.{pokemon.level} · Capturado en {pokemon.caughtAt || '—'}
                  </div>
                </div>
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
                      <div className="text-white/40 text-xs uppercase tracking-wider mb-1">
                        Responsable
                      </div>
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

                  {/* Stats finales */}
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Panel de estadísticas */}
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
                {cemetery.length > 0
                  ? Math.round(cemetery.reduce((a, p) => a + p.level, 0) / cemetery.length)
                  : 0}
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