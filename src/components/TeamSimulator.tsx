import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS, getDefensiveWeaknesses } from '../utils/typeMatchups';
import type { PokemonType, TeamPokemon } from '../types/pokemon.types';

type MoveData = { name: string; type: PokemonType; category: string; power: number | null };

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
    val === 0    ? '0' :
    val === 0.25 ? '¼' :
    val === 0.5  ? '½' :
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
  const [activeTab, setActiveTab] = useState<'defensive'|'offensive'|'moves'>('defensive');

  const defensiveMatrix = useMemo(() =>
    ALL_TYPES.map(atkType => ({
      type: atkType,
      values: team.map(p => {
        const w = getDefensiveWeaknesses(p.types);
        return w[atkType] ?? 1;
      }),
      summary: (() => {
        const vals = team.map(p => { const w = getDefensiveWeaknesses(p.types); return w[atkType] ?? 1; });
        return {
          weak:  vals.filter(v => v >= 2).length,
          resist:vals.filter(v => v <= 0.5 && v > 0).length,
          immune:vals.filter(v => v === 0).length,
        };
      })(),
    })), [team]);

  const offensiveCoverage = useMemo(() => {
    const coverage: Partial<Record<PokemonType, number>> = {};
    ALL_TYPES.forEach(defType => {
      const best = team.reduce((max, p) => {
        const bestMult = p.types.reduce((m, atkType) => Math.max(m, TYPE_CHART[atkType]?.[defType] ?? 1), 1);
        return Math.max(max, bestMult);
      }, 0);
      coverage[defType] = best;
    });
    return coverage;
  }, [team]);

  // Análisis de movimientos
  const movesCoverage = useMemo(() => {
    const result: Array<{
      pokemon: TeamPokemon;
      moves: MoveData[];
      coverage: Partial<Record<PokemonType, number>>;
    }> = [];

    team.forEach(p => {
      const moves: MoveData[] = ((p as TeamPokemon & { moves?: MoveData[] }).moves ?? []);
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
      result.push({ pokemon: p, moves, coverage });
    });
    return result;
  }, [team]);

  // Cobertura total por movimientos del equipo
  const teamMovesCoverage = useMemo(() => {
    const coverage: Partial<Record<PokemonType, number>> = {};
    ALL_TYPES.forEach(defType => {
      const best = movesCoverage.reduce((max, { coverage: c }) => Math.max(max, c[defType] ?? 0), 0);
      coverage[defType] = best;
    });
    return coverage;
  }, [movesCoverage]);

  const sharedWeaknesses = useMemo(() =>
    defensiveMatrix
      .filter(row => row.summary.weak >= 3)
      .sort((a,b) => b.summary.weak - a.summary.weak),
    [defensiveMatrix]);

  const typesCovered = Object.values(offensiveCoverage).filter(v => (v ?? 0) >= 2).length;
  const moveTypesCovered = Object.values(teamMovesCoverage).filter(v => (v ?? 0) >= 2).length;

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const notCovered = ALL_TYPES.filter(t => (offensiveCoverage[t] ?? 0) < 2);
    if (notCovered.length > 0)
      recs.push(`Sin cobertura ofensiva: ${notCovered.map(t => TYPE_ES[t]).join(', ')}`);
    if (sharedWeaknesses.length >= 2)
      recs.push(`Muchas debilidades compartidas — considera diversificar tipos`);
    const fireCount = team.filter(p => p.types.includes('fire')).length;
    if (fireCount >= 3) recs.push('Demasiados Pokémon de tipo Fuego');
    const moveNotCovered = ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2);
    if (moveNotCovered.length > 4)
      recs.push(`Movimientos no cubren: ${moveNotCovered.map(t=>TYPE_ES[t]).slice(0,4).join(', ')}...`);
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
      <h2 className="text-white font-bold text-lg flex items-center gap-2">
        🔬 Simulador de Equipo
      </h2>

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
                      style={{ background: TYPE_COLORS[t as PokemonType], fontSize: '10px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta debilidades — con pulso si >=3 */}
      {sharedWeaknesses.length > 0 && (
        <div className={`rounded-xl border p-3 ${
          sharedWeaknesses.length >= 3
            ? 'border-red-600/60 bg-red-900/20 animate-pulse'
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
      <div className="flex border-b border-white/10 gap-1">
        {([
          { id: 'defensive', label: '🛡️ Defensiva' },
          { id: 'offensive', label: '⚔️ Ofensiva' },
          { id: 'moves',     label: '⚡ Movimientos' },
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

      {/* Tab: Defensiva */}
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

      {/* Tab: Ofensiva */}
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
                r.startsWith('✓') ? 'bg-green-900/20 text-green-300 border border-green-900/30' : 'bg-yellow-900/20 text-yellow-300 border border-yellow-900/30'
              }`}>{r}</div>
            ))}
            <div className="mt-2 text-white/40 text-xs">
              Tipos cubiertos (×2 o más): <span className="text-white font-bold">{typesCovered}/{ALL_TYPES.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Movimientos */}
      {activeTab === 'moves' && (
        <div className="space-y-4">
          {/* Cobertura total por movimientos */}
          <div className="bg-black/20 rounded-xl border border-white/10 p-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
              Cobertura por Movimientos del equipo
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

          {/* Análisis por Pokémon */}
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
                    {/* Movimientos */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {moves.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 bg-black/30 rounded-lg px-2 py-1.5 border border-white/5">
                          <span className="text-white text-xs px-1.5 py-0.5 rounded-full capitalize"
                            style={{ background: TYPE_COLORS[m.type as PokemonType] || '#666', fontSize: '10px' }}>
                            {m.type}
                          </span>
                          <span className="text-white/80 text-xs font-bold capitalize flex-1 truncate">
                            {m.name.replace(/-/g,' ')}
                          </span>
                          {m.power && (
                            <span className="text-white/30 text-xs">💥{m.power}</span>
                          )}
                        </div>
                      ))}
                      {Array.from({ length: 4 - moves.length }).map((_, i) => (
                        <div key={i} className="border border-dashed border-white/10 rounded-lg px-2 py-1.5 text-white/15 text-xs text-center">
                          Slot vacío
                        </div>
                      ))}
                    </div>

                    {/* Efectividad de movimientos contra todos los tipos */}
                    <div>
                      <p className="text-white/30 text-xs mb-2">Efectividad ofensiva de sus ataques</p>
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
                                {TYPE_ES[defType].slice(0,3)}
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
                    Asigna movimientos en "Ver detalle" para analizar su efectividad
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Huecos en cobertura */}
          {movesCoverage.some(m => m.moves.length > 0) && (
            <div className="bg-black/20 rounded-xl border border-white/10 p-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Tipos sin cobertura ofensiva (×2)</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2).map(t => (
                  <span key={t} className="text-white text-xs px-2 py-0.5 rounded-full opacity-60"
                    style={{ background: TYPE_COLORS[t] }}>{TYPE_ES[t]}</span>
                ))}
                {ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2).length === 0 && (
                  <span className="text-green-400 text-xs">✓ Cobertura completa con movimientos</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}