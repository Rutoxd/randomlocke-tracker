import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS, getDefensiveWeaknesses } from '../utils/typeMatchups';
import type { PokemonType, MoveInfo } from '../types/pokemon.types';

const ALL_TYPES: PokemonType[] = [
  'fire','water','grass','electric','psychic','ice','dragon','dark','fairy',
  'normal','fighting','flying','poison','ground','rock','bug','ghost','steel'
];

const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  fire:     { grass:2, ice:2, bug:2, steel:2, water:0.5, fire:0.5, rock:0.5, dragon:0.5 },
  water:    { fire:2, ground:2, rock:2, water:0.5, grass:0.5, dragon:0.5 },
  grass:    { water:2, ground:2, rock:2, fire:0.5, grass:0.5, poison:0.5, flying:0.5, bug:0.5, dragon:0.5, steel:0.5 },
  electric: { water:2, flying:2, ground:0, electric:0.5, grass:0.5, dragon:0.5 },
  psychic:  { fighting:2, poison:2, psychic:0.5, dark:0, steel:0.5 },
  ice:      { grass:2, ground:2, flying:2, dragon:2, fire:0.5, water:0.5, ice:0.5, steel:0.5 },
  dragon:   { dragon:2, steel:0.5, fairy:0 },
  dark:     { psychic:2, ghost:2, fighting:0.5, dark:0.5, fairy:0.5 },
  fairy:    { fighting:2, dragon:2, dark:2, fire:0.5, poison:0.5, steel:0.5 },
  normal:   { ghost:0, rock:0.5, steel:0.5 },
  fighting: { normal:2, ice:2, rock:2, dark:2, steel:2, poison:0.5, bug:0.5, psychic:0.5, flying:0.5, fairy:0.5, ghost:0 },
  flying:   { fighting:2, bug:2, grass:2, electric:0.5, rock:0.5, steel:0.5 },
  poison:   { grass:2, fairy:2, poison:0.5, ground:0.5, rock:0.5, ghost:0.5, steel:0 },
  ground:   { fire:2, electric:2, poison:2, rock:2, steel:2, grass:0.5, bug:0.5, flying:0 },
  rock:     { fire:2, ice:2, flying:2, bug:2, fighting:0.5, ground:0.5, steel:0.5 },
  bug:      { grass:2, psychic:2, dark:2, fire:0.5, fighting:0.5, flying:0.5, ghost:0.5, steel:0.5, fairy:0.5 },
  ghost:    { psychic:2, ghost:2, normal:0, dark:0.5 },
  steel:    { ice:2, rock:2, fairy:2, fire:0.5, water:0.5, electric:0.5, steel:0.5 },
  unknown:  {},
};

const TYPE_ES: Record<PokemonType, string> = {
  fire:'Fuego', water:'Agua', grass:'Planta', electric:'Eléctrico',
  psychic:'Psíquico', ice:'Hielo', dragon:'Dragón', dark:'Siniestro',
  fairy:'Hada', normal:'Normal', fighting:'Lucha', flying:'Volador',
  poison:'Veneno', ground:'Tierra', rock:'Roca', bug:'Bicho',
  ghost:'Fantasma', steel:'Acero', unknown:'?'
};

function MultCell({ val }: { val: number }) {
  const bg =
    val === 0    ? 'bg-gray-700 text-gray-400' :
    val === 0.25 ? 'bg-teal-900 text-teal-300' :
    val === 0.5  ? 'bg-green-900 text-green-300' :
    val === 2    ? 'bg-orange-900 text-orange-300' :
    val === 4    ? 'bg-red-900 text-red-300' :
                   'bg-gray-800/30 text-gray-500';
  const label =
    val === 0    ? '0'  :
    val === 0.25 ? '¼'  :
    val === 0.5  ? '½'  :
    val === 2    ? '2×' :
    val === 4    ? '4×' : '·';
  return (
    <span className={`inline-flex items-center justify-center w-7 h-6 rounded text-xs font-bold ${bg}`}>
      {label}
    </span>
  );
}

export default function TeamSimulator() {
  const team = useGameStore(s => s.team);
  const [activeTab, setActiveTab] = useState<'defensive'|'offensive'|'moves'|'full'>('defensive');

  const defensiveMatrix = useMemo(() =>
    ALL_TYPES.map(atkType => ({
      type: atkType,
      values: team.map(p => {
        const w = getDefensiveWeaknesses(p.types);
        return w[atkType] ?? 1;
      }),
      summary: (() => {
        const vals = team.map(p => {
          const w = getDefensiveWeaknesses(p.types);
          return w[atkType] ?? 1;
        });
        return {
          weak:   vals.filter(v => v >= 2).length,
          resist: vals.filter(v => v <= 0.5 && v > 0).length,
          immune: vals.filter(v => v === 0).length,
        };
      })(),
    })), [team]);

  const offensiveCoverage = useMemo(() => {
    const coverage: Partial<Record<PokemonType, number>> = {};
    ALL_TYPES.forEach(defType => {
      const best = team.reduce((max, p) => {
        const bestMult = p.types.reduce((m, atkType) =>
          Math.max(m, TYPE_CHART[atkType]?.[defType] ?? 1), 1);
        return Math.max(max, bestMult);
      }, 0);
      coverage[defType] = best;
    });
    return coverage;
  }, [team]);

  const movesCoverage = useMemo(() => {
    return team.map(p => {
      const moves = (p.moves ?? []).filter((m): m is MoveInfo => m !== null);

      const coverage: Partial<Record<PokemonType, number>> = {};
      if (moves.length > 0) {
        ALL_TYPES.forEach(defType => {
          const best = moves.reduce((max, move) => {
            if (!move.power) return max;
            const eff = TYPE_CHART[move.type as PokemonType]?.[defType] ?? 1;
            return Math.max(max, eff);
          }, 0);
          if (best > 0) coverage[defType] = best;
        });
      }
      return { pokemon: p, moves, coverage };
    });
  }, [team]);

  const teamMovesCoverage = useMemo(() => {
    const coverage: Partial<Record<PokemonType, number>> = {};
    ALL_TYPES.forEach(defType => {
      const best = movesCoverage.reduce((max, { coverage: c }) =>
        Math.max(max, c[defType] ?? 0), 0);
      coverage[defType] = best;
    });
    return coverage;
  }, [movesCoverage]);

  const sharedWeaknesses = useMemo(() =>
    defensiveMatrix
      .filter(row => row.summary.weak >= 3)
      .sort((a, b) => b.summary.weak - a.summary.weak),
    [defensiveMatrix]);

  const typesCovered = Object.values(offensiveCoverage).filter(v => (v ?? 0) >= 2).length;
  const moveTypesCovered = Object.values(teamMovesCoverage).filter(v => (v ?? 0) >= 2).length;

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const notCovered = ALL_TYPES.filter(t => (offensiveCoverage[t] ?? 0) < 2);
    if (notCovered.length > 0)
      recs.push(`Sin cobertura ofensiva: ${notCovered.map(t => TYPE_ES[t]).join(', ')}`);
    if (sharedWeaknesses.length >= 2)
      recs.push('Muchas debilidades compartidas — considera diversificar tipos');
    const fireCount = team.filter(p => p.types.includes('fire')).length;
    if (fireCount >= 3) recs.push('Demasiados Pokémon de tipo Fuego');
    const moveNotCovered = ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2);
    if (moveNotCovered.length > 4)
      recs.push(`Movimientos no cubren: ${moveNotCovered.map(t => TYPE_ES[t]).slice(0, 4).join(', ')}...`);
    if (recs.length === 0) recs.push('✓ Excelente cobertura ofensiva y defensiva');
    return recs;
  }, [offensiveCoverage, sharedWeaknesses, team, teamMovesCoverage]);

  const ROW_COLORS = ['bg-transparent', 'bg-white/[0.02]'];

  if (team.length === 0) {
    return (
      <div className="text-center text-white/30 py-16">
        <div className="text-5xl mb-3">🔬</div>
        <p>Agrega Pokémon al equipo para analizar sinergias</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🔬 Simulador de Equipo</h2>

      {/* Equipo analizado */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-3">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Equipo analizado</p>
        <div className="flex flex-wrap gap-3">
          {team.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-black/20 rounded-lg px-2 py-1.5">
              <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain" />
              <div>
                <div className="text-white text-xs font-bold">{p.nickname}</div>
                <div className="flex gap-1">
                  {p.types.map(t => (
                    <span key={t} className="text-white text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: TYPE_COLORS[t as PokemonType], fontSize: '10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta debilidades */}
      {sharedWeaknesses.length > 0 && (
        <div className={`rounded-xl border p-3 ${
          sharedWeaknesses.length >= 3
            ? 'border-red-600/60 bg-red-900/20'
            : 'border-red-800/40 bg-red-900/10'
        }`}>
          <p className="text-red-400 font-bold text-sm mb-2">⚠️ Debilidades compartidas críticas</p>
          <div className="flex flex-wrap gap-2">
            {sharedWeaknesses.map(({ type, summary }) => (
              <span key={type} className="flex items-center gap-1 bg-red-900/30 border border-red-700/40 rounded-lg px-2 py-1">
                <span className="text-white text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: TYPE_COLORS[type] }}>{TYPE_ES[type]}</span>
                <span className="text-red-300 text-xs">{summary.weak}/{team.length} débiles</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-1 flex-wrap">
        {([
          { id: 'defensive', label: '🛡️ Defensiva' },
          { id: 'offensive', label: '⚔️ Ofensiva' },
          { id: 'moves',     label: '⚡ Movimientos' },
          { id: 'full',      label: '📋 Análisis Completo' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white bg-white/5'
                : 'text-white/40 hover:text-white/70'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Defensiva ── */}
      {activeTab === 'defensive' && (
        <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
          <p className="text-white/30 text-xs uppercase tracking-wider p-3 pb-2">Cobertura Defensiva</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-3 py-2 text-white/40 w-24">Tipo atk</th>
                  {team.map(p => (
                    <th key={p.id} className="px-2 py-2 text-center">
                      <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain mx-auto" />
                      <div className="text-white/60 text-xs truncate max-w-16">{p.nickname}</div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-white/40 text-right">Resumen</th>
                </tr>
              </thead>
              <tbody>
                {defensiveMatrix.map((row, i) => (
                  <tr key={row.type} className={`border-b border-white/5 ${ROW_COLORS[i % 2]}`}>
                    <td className="px-3 py-1.5">
                      <span className="text-white text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: TYPE_COLORS[row.type] }}>
                        {TYPE_ES[row.type]}
                      </span>
                    </td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-2 py-1.5 text-center">
                        <MultCell val={val} />
                      </td>
                    ))}
                    <td className="px-3 py-1.5 text-right text-xs">
                      {row.summary.weak > 0 && <span className="text-orange-400">{row.summary.weak}W </span>}
                      {row.summary.resist > 0 && <span className="text-green-400">{row.summary.resist}R </span>}
                      {row.summary.immune > 0 && <span className="text-gray-400">{row.summary.immune}I</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Ofensiva ── */}
      {activeTab === 'offensive' && (
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl border border-white/10 p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Cobertura Ofensiva — por tipos</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ALL_TYPES.map(defType => {
                const eff = offensiveCoverage[defType] ?? 0;
                return (
                  <div key={defType} className={`rounded-lg p-2 text-center border ${
                    eff >= 2 ? 'border-green-700/40 bg-green-900/20' : 'border-white/5 bg-black/20 opacity-40'
                  }`}>
                    <div className="text-white text-xs font-bold px-1 py-0.5 rounded mb-1"
                      style={{ background: TYPE_COLORS[defType] }}>{TYPE_ES[defType]}</div>
                    <div className={`text-sm font-bold ${eff >= 2 ? 'text-green-400' : 'text-white/20'}`}>
                      {eff >= 2 ? `×${eff}` : '–'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-black/20 rounded-xl border border-white/10 p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Recomendaciones</p>
            {recommendations.map((r, i) => (
              <div key={i} className={`text-sm py-1.5 px-3 rounded-lg mb-1 ${
                r.startsWith('✓')
                  ? 'bg-green-900/20 text-green-300 border border-green-900/30'
                  : 'bg-yellow-900/20 text-yellow-300 border border-yellow-900/30'
              }`}>{r}</div>
            ))}
            <div className="mt-2 text-white/40 text-xs">
              Tipos cubiertos (×2 o más): <span className="text-white font-bold">{typesCovered}/{ALL_TYPES.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Movimientos ── */}
      {activeTab === 'moves' && (
        <div className="space-y-4">
          <div className="bg-black/20 rounded-xl border border-white/10 p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
              Cobertura por Movimientos
              <span className="text-white/30 ml-2 font-normal normal-case">
                ({moveTypesCovered}/{ALL_TYPES.length} tipos cubiertos)
              </span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ALL_TYPES.map(defType => {
                const eff = teamMovesCoverage[defType] ?? 0;
                return (
                  <div key={defType} className={`rounded-lg p-2 text-center border ${
                    eff >= 2 ? 'border-blue-700/40 bg-blue-900/20' :
                    eff > 0  ? 'border-white/10 bg-black/20 opacity-60' :
                               'border-white/5 bg-black/10 opacity-30'
                  }`}>
                    <div className="text-white text-xs font-bold px-1 py-0.5 rounded mb-1"
                      style={{ background: TYPE_COLORS[defType], fontSize: '10px' }}>{TYPE_ES[defType]}</div>
                    <div className={`text-sm font-bold ${
                      eff >= 2 ? 'text-blue-400' : eff > 0 ? 'text-white/40' : 'text-white/20'
                    }`}>
                      {eff >= 2 ? `×${eff}` : eff > 0 ? `×${eff}` : '–'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {movesCoverage.map(({ pokemon, moves, coverage }) => (
              <div key={pokemon.id} className="bg-black/20 rounded-xl border border-white/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-10 h-10 object-contain" />
                  <div>
                    <div className="text-white font-bold">{pokemon.nickname}</div>
                    <div className="text-white/40 text-xs capitalize">{pokemon.name}</div>
                  </div>
                  {moves.length === 0 && (
                    <span className="ml-auto text-xs text-yellow-600 bg-yellow-900/20 border border-yellow-900/30 px-2 py-1 rounded-lg">
                      Sin movimientos asignados
                    </span>
                  )}
                </div>

                {moves.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {moves.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 bg-black/30 rounded-lg px-2 py-1.5 border border-white/5">
                          <span className="text-white text-xs px-1.5 py-0.5 rounded-full capitalize"
                            style={{ background: TYPE_COLORS[m.type as PokemonType] || '#666', fontSize: '10px' }}>
                            {m.type}
                          </span>
                          <span className="text-white/80 text-xs font-bold capitalize flex-1 truncate">
                            {m.name}
                          </span>
                          {m.power && <span className="text-white/30 text-xs">💥{m.power}</span>}
                        </div>
                      ))}
                      {Array.from({ length: 4 - moves.length }).map((_, i) => (
                        <div key={i} className="border border-dashed border-white/10 rounded-lg px-2 py-1.5 text-white/15 text-xs text-center">
                          Slot vacío
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-2">Efectividad ofensiva</p>
                      <div className="grid grid-cols-6 gap-1">
                        {ALL_TYPES.map(defType => {
                          const eff = coverage[defType] ?? 0;
                          return (
                            <div key={defType} className={`rounded p-1 text-center ${
                              eff >= 2 ? 'bg-green-900/30 border border-green-700/30' :
                              eff > 0  ? 'bg-black/20 border border-white/5' :
                                         'bg-black/10 border border-white/5 opacity-30'
                            }`}>
                              <div className="text-white rounded mb-0.5"
                                style={{ background: TYPE_COLORS[defType], fontSize: '8px', padding: '1px 3px', borderRadius: '3px' }}>
                                {TYPE_ES[defType].slice(0, 3)}
                              </div>
                              <div className={`text-xs font-bold ${
                                eff >= 2 ? 'text-green-400' : eff > 0 ? 'text-white/30' : 'text-white/10'
                              }`}>
                                {eff >= 2 ? `×${eff}` : eff === 0.5 ? '½' : eff === 0 ? '0' : '·'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-white/20 text-xs text-center py-2">
                    Asigna movimientos para analizar efectividad
                  </p>
                )}
              </div>
            ))}
          </div>

          {movesCoverage.some(m => m.moves.length > 0) && (
            <div className="bg-black/20 rounded-xl border border-white/10 p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Tipos sin cobertura (×2)</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2).map(t => (
                  <span key={t} className="text-white text-xs px-2 py-0.5 rounded-full opacity-60"
                    style={{ background: TYPE_COLORS[t] }}>{TYPE_ES[t]}</span>
                ))}
                {ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2).length === 0 && (
                  <span className="text-green-400 text-xs">✓ Cobertura completa</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Análisis Completo ── */}
      {activeTab === 'full' && (
        <div className="space-y-6">

          {/* Resumen ejecutivo */}
          <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 rounded-2xl p-5">
            <h3 className="text-white font-bold text-base mb-4">📋 Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
                <div className="text-3xl font-bold text-blue-400">{typesCovered}</div>
                <div className="text-white/40 text-xs mt-1">Tipos cubiertos</div>
                <div className="text-white/20 text-xs">por tipo base</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
                <div className="text-3xl font-bold text-purple-400">{moveTypesCovered}</div>
                <div className="text-white/40 text-xs mt-1">Cubiertos movs</div>
                <div className="text-white/20 text-xs">por movimientos</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
                <div className={`text-3xl font-bold ${
                  sharedWeaknesses.length >= 3 ? 'text-red-400' :
                  sharedWeaknesses.length >= 1 ? 'text-orange-400' : 'text-green-400'
                }`}>{sharedWeaknesses.length}</div>
                <div className="text-white/40 text-xs mt-1">Deb. críticas</div>
                <div className="text-white/20 text-xs">≥3 miembros</div>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center border border-white/10">
                <div className={`text-4xl font-bold ${
                  sharedWeaknesses.length === 0 && typesCovered >= 15 ? 'text-green-400' :
                  sharedWeaknesses.length <= 1 && typesCovered >= 12 ? 'text-yellow-400' :
                  sharedWeaknesses.length <= 2 && typesCovered >= 10 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {sharedWeaknesses.length === 0 && typesCovered >= 15 ? 'A' :
                   sharedWeaknesses.length <= 1 && typesCovered >= 12 ? 'B' :
                   sharedWeaknesses.length <= 2 && typesCovered >= 10 ? 'C' : 'D'}
                </div>
                <div className="text-white/40 text-xs mt-1">Calificación</div>
                <div className="text-white/20 text-xs">general</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Cobertura ofensiva (tipos base)', value: typesCovered,     max: ALL_TYPES.length, color: '#3b82f6' },
                { label: 'Cobertura por movimientos',       value: moveTypesCovered, max: ALL_TYPES.length, color: '#a855f7' },
                { label: 'Resistencia defensiva',           value: ALL_TYPES.length - sharedWeaknesses.length, max: ALL_TYPES.length, color: '#22c55e' },
              ].map(bar => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-white/40 text-xs w-48 flex-shrink-0">{bar.label}</span>
                  <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(bar.value / bar.max) * 100}%`, background: bar.color }} />
                  </div>
                  <span className="text-white/60 text-xs w-10 text-right font-bold">
                    {bar.value}/{bar.max}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Debilidades críticas */}
          {sharedWeaknesses.length > 0 && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-4">
              <h3 className="text-red-400 font-bold text-sm mb-3">⚠️ Debilidades Críticas Compartidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sharedWeaknesses.map(({ type, summary }) => {
                  const pct = (summary.weak / team.length) * 100;
                  return (
                    <div key={type} className="bg-black/30 rounded-xl p-3 border border-red-900/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-xs font-bold px-2 py-0.5 rounded"
                          style={{ background: TYPE_COLORS[type] }}>
                          {TYPE_ES[type]}
                        </span>
                        <span className="text-red-300 text-xs font-bold">{summary.weak}/{team.length} débiles</span>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-red-500 transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-xs">
                        {summary.resist > 0 && <span className="text-green-400">{summary.resist} resisten</span>}
                        {summary.immune > 0 && <span className="text-blue-400">{summary.immune} inmunes</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Análisis individual */}
          <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-bold text-sm mb-4">🎯 Análisis Individual</h3>
            <div className="space-y-3">
              {team.map((p, idx) => {
                const weaknesses  = getDefensiveWeaknesses(p.types);
                const critWeak    = Object.entries(weaknesses).filter(([,v]) => v >= 2).map(([k]) => k as PokemonType);
                const immunities  = Object.entries(weaknesses).filter(([,v]) => v === 0).map(([k]) => k as PokemonType);
                const resistances = Object.entries(weaknesses).filter(([,v]) => v > 0 && v < 1).map(([k]) => k as PokemonType);
                const memberMoves = movesCoverage[idx];
                const totalStats  = Object.values(p.stats).reduce((a,b) => a+b, 0);

                return (
                  <div key={p.id} className="bg-black/30 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={p.sprite} alt={p.name} className="w-12 h-12 object-contain" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold">{p.nickname}</span>
                          <span className="text-white/30 text-xs capitalize">({p.name})</span>
                          <span className="text-white/30 text-xs">Lv.{p.level}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {p.types.map(t => (
                            <span key={t} className="text-white text-xs px-2 py-0.5 rounded-full"
                              style={{ background: TYPE_COLORS[t as PokemonType], fontSize: '11px' }}>
                              {TYPE_ES[t as PokemonType]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white/30 text-xs">BST</div>
                        <div className="text-white font-bold text-lg">{totalStats}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-red-400/70 uppercase tracking-wider mb-1.5 font-bold">Débil a</p>
                        <div className="flex flex-wrap gap-1">
                          {critWeak.length > 0 ? critWeak.map(t => (
                            <span key={t} className="text-white px-1.5 py-0.5 rounded"
                              style={{ background: TYPE_COLORS[t], fontSize: '10px' }}>
                              {TYPE_ES[t]}
                            </span>
                          )) : <span className="text-white/20">Ninguna ×2</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-green-400/70 uppercase tracking-wider mb-1.5 font-bold">Resiste</p>
                        <div className="flex flex-wrap gap-1">
                          {resistances.length > 0 ? resistances.map(t => (
                            <span key={t} className="text-white px-1.5 py-0.5 rounded opacity-80"
                              style={{ background: TYPE_COLORS[t], fontSize: '10px' }}>
                              {TYPE_ES[t]}
                            </span>
                          )) : <span className="text-white/20">Ninguna</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-blue-400/70 uppercase tracking-wider mb-1.5 font-bold">Inmune a</p>
                        <div className="flex flex-wrap gap-1">
                          {immunities.length > 0 ? immunities.map(t => (
                            <span key={t} className="text-white px-1.5 py-0.5 rounded"
                              style={{ background: TYPE_COLORS[t], fontSize: '10px' }}>
                              {TYPE_ES[t]}
                            </span>
                          )) : <span className="text-white/20">Ninguna</span>}
                        </div>
                      </div>
                    </div>

                    {memberMoves && memberMoves.moves.length > 0 && (
                      <div className="mb-3 pt-3 border-t border-white/5">
                        <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Movimientos</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {memberMoves.moves.map((m, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-black/20 rounded-lg px-2 py-1 border border-white/5">
                              <span className="text-white px-1.5 py-0.5 rounded-full capitalize flex-shrink-0"
                                style={{ background: TYPE_COLORS[m.type as PokemonType] || '#555', fontSize: '9px' }}>
                                {m.type}
                              </span>
                              <span className="text-white/70 text-xs truncate capitalize">{m.name}</span>
                              {m.power && <span className="text-white/30 text-xs ml-auto">💥{m.power}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/5">
                      <div className="grid grid-cols-6 gap-1">
                        {Object.entries(p.stats).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <div className="text-white/20 text-xs uppercase">
                              {key === 'spAtk' ? 'SpA' : key === 'spDef' ? 'SpD' : key}
                            </div>
                            <div className="h-8 bg-black/30 rounded-sm overflow-hidden flex flex-col-reverse mt-1">
                              <div className="rounded-sm transition-all"
                                style={{
                                  height: `${Math.min((val / 255) * 100, 100)}%`,
                                  background: val >= 100 ? '#4ade80' : val >= 70 ? '#facc15' : '#f87171'
                                }} />
                            </div>
                            <div className="text-white/50 text-xs mt-1 font-bold">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recomendaciones finales */}
          <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-bold text-sm mb-3">💡 Recomendaciones Finales</h3>
            <div className="space-y-2">
              {recommendations.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-xl text-sm border ${
                  r.startsWith('✓')
                    ? 'bg-green-900/20 text-green-300 border-green-900/30'
                    : 'bg-yellow-900/20 text-yellow-300 border-yellow-900/30'
                }`}>
                  <span className="flex-shrink-0 mt-0.5">{r.startsWith('✓') ? '✓' : '⚠'}</span>
                  <span>{r.replace('✓ ', '')}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}