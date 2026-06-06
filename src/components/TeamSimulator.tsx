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

const TYPE_ES_SHORT: Record<PokemonType, string> = {
  fire:'Fue', water:'Agu', grass:'Pla', electric:'Elé',
  psychic:'Psi', ice:'Hie', dragon:'Dra', dark:'Sin',
  fairy:'Had', normal:'Nor', fighting:'Luc', flying:'Vol',
  poison:'Ven', ground:'Tie', rock:'Roc', bug:'Bic',
  ghost:'Fan', steel:'Ace', unknown:'?'
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
    <span className={`inline-flex items-center justify-center w-6 h-5 rounded text-xs font-bold ${bg}`}>
      {label}
    </span>
  );
}

function TypeBadge({ type, short = false }: { type: PokemonType; short?: boolean }) {
  return (
    <span
      className="text-white font-bold rounded px-1 py-0.5"
      style={{ background: TYPE_COLORS[type], fontSize: '9px' }}
    >
      {short ? TYPE_ES_SHORT[type] : TYPE_ES[type]}
    </span>
  );
}

export default function TeamSimulator() {
  const team = useGameStore(s => s.team);
  const [activeTab, setActiveTab] = useState<'defensive'|'offensive'|'moves'|'full'>('defensive');

  const defensiveMatrix = useMemo(() =>
    ALL_TYPES.map(atkType => ({
      type: atkType,
      values: team.map(p => { const w = getDefensiveWeaknesses(p.types); return w[atkType] ?? 1; }),
      summary: (() => {
        const vals = team.map(p => { const w = getDefensiveWeaknesses(p.types); return w[atkType] ?? 1; });
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
      coverage[defType] = team.reduce((max, p) =>
        Math.max(max, p.types.reduce((m, atkType) =>
          Math.max(m, TYPE_CHART[atkType]?.[defType] ?? 1), 1)), 0);
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
            return Math.max(max, TYPE_CHART[move.type as PokemonType]?.[defType] ?? 1);
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
      coverage[defType] = movesCoverage.reduce((max, { coverage: c }) => Math.max(max, c[defType] ?? 0), 0);
    });
    return coverage;
  }, [movesCoverage]);

  const sharedWeaknesses = useMemo(() =>
    defensiveMatrix.filter(row => row.summary.weak >= 3).sort((a,b) => b.summary.weak - a.summary.weak),
    [defensiveMatrix]);

  const typesCovered     = Object.values(offensiveCoverage).filter(v => (v ?? 0) >= 2).length;
  const moveTypesCovered = Object.values(teamMovesCoverage).filter(v => (v ?? 0) >= 2).length;

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const notCovered = ALL_TYPES.filter(t => (offensiveCoverage[t] ?? 0) < 2);
    if (notCovered.length > 0) recs.push(`Sin cobertura: ${notCovered.map(t => TYPE_ES[t]).join(', ')}`);
    if (sharedWeaknesses.length >= 2) recs.push('Diversifica tipos — muchas debilidades compartidas');
    if (team.filter(p => p.types.includes('fire')).length >= 3) recs.push('Demasiados Pokémon Fuego');
    if (ALL_TYPES.filter(t => (teamMovesCoverage[t] ?? 0) < 2).length > 4)
      recs.push(`Movimientos no cubren: ${ALL_TYPES.filter(t => (teamMovesCoverage[t]??0)<2).map(t=>TYPE_ES[t]).slice(0,3).join(', ')}...`);
    if (recs.length === 0) recs.push('✓ Excelente cobertura ofensiva y defensiva');
    return recs;
  }, [offensiveCoverage, sharedWeaknesses, team, teamMovesCoverage]);

  if (team.length === 0) {
    return (
      <div className="text-center text-white/30 py-12">
        <div className="text-4xl mb-2">🔬</div>
        <p className="text-sm">Agrega Pokémon al equipo para analizar sinergias</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* Header compacto con equipo + alertas inline */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-2.5">
        <div className="flex flex-wrap gap-2 items-center">
          {team.map(p => (
            <div key={p.id} className="flex items-center gap-1.5 bg-black/20 rounded-lg px-2 py-1">
              <img src={p.sprite} alt={p.name} className="w-6 h-6 object-contain" />
              <div>
                <div className="text-white text-xs font-bold leading-none">{p.nickname}</div>
                <div className="flex gap-0.5 mt-0.5">
                  {p.types.map(t => <TypeBadge key={t} type={t as PokemonType} short />)}
                </div>
              </div>
            </div>
          ))}
          {sharedWeaknesses.length > 0 && (
            <div className="ml-auto flex gap-1 flex-wrap">
              {sharedWeaknesses.map(({ type, summary }) => (
                <span key={type} className="flex items-center gap-1 bg-red-900/40 border border-red-700/30 rounded px-1.5 py-0.5">
                  <TypeBadge type={type} short />
                  <span className="text-red-300 text-xs">{summary.weak}/{team.length}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs compactos */}
      <div className="flex border-b border-white/10 gap-0.5">
        {([
          { id: 'defensive', label: '🛡️ Defensiva' },
          { id: 'offensive', label: '⚔️ Ofensiva' },
          { id: 'moves',     label: '⚡ Movimientos' },
          { id: 'full',      label: '📋 Completo' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-white bg-white/5'
                : 'text-white/40 hover:text-white/60'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Defensiva ── */}
      {activeTab === 'defensive' && (
        <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: '11px' }}>
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="text-left px-2 py-1.5 text-white/30 w-16">Tipo</th>
                  {team.map(p => (
                    <th key={p.id} className="px-1 py-1 text-center w-12">
                      <img src={p.sprite} alt={p.name} className="w-6 h-6 object-contain mx-auto" />
                      <div className="text-white/40 truncate" style={{ fontSize: '9px', maxWidth: '48px' }}>{p.nickname}</div>
                    </th>
                  ))}
                  <th className="px-2 py-1 text-white/30 text-right w-16">W/R/I</th>
                </tr>
              </thead>
              <tbody>
                {defensiveMatrix.map((row, i) => (
                  <tr key={row.type} className={`border-b border-white/5 ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
                    <td className="px-2 py-1">
                      <TypeBadge type={row.type} short />
                    </td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-1 py-1 text-center">
                        <MultCell val={val} />
                      </td>
                    ))}
                    <td className="px-2 py-1 text-right" style={{ fontSize: '10px' }}>
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
        <div className="space-y-3">
          <div className="bg-black/20 rounded-xl border border-white/10 p-3">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">
              Cobertura Ofensiva — {typesCovered}/{ALL_TYPES.length} tipos cubiertos
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-1">
              {ALL_TYPES.map(defType => {
                const eff = offensiveCoverage[defType] ?? 0;
                return (
                  <div key={defType} className={`rounded p-1 text-center border ${
                    eff >= 2 ? 'border-green-700/40 bg-green-900/20' : 'border-white/5 bg-black/20 opacity-30'
                  }`}>
                    <TypeBadge type={defType} short />
                    <div className={`text-xs font-bold mt-0.5 ${eff >= 2 ? 'text-green-400' : 'text-white/20'}`}>
                      {eff >= 2 ? `×${eff}` : '–'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-black/20 rounded-xl border border-white/10 p-3">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Recomendaciones</p>
            <div className="space-y-1">
              {recommendations.map((r, i) => (
                <div key={i} className={`text-xs py-1 px-2.5 rounded-lg ${
                  r.startsWith('✓')
                    ? 'bg-green-900/20 text-green-300 border border-green-900/30'
                    : 'bg-yellow-900/20 text-yellow-300 border border-yellow-900/30'
                }`}>{r}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Movimientos ── */}
      {activeTab === 'moves' && (
        <div className="space-y-3">
          {/* Cobertura global compacta */}
          <div className="bg-black/20 rounded-xl border border-white/10 p-3">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">
              Cobertura por Movimientos — {moveTypesCovered}/{ALL_TYPES.length} cubiertos
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-1">
              {ALL_TYPES.map(defType => {
                const eff = teamMovesCoverage[defType] ?? 0;
                return (
                  <div key={defType} className={`rounded p-1 text-center border ${
                    eff >= 2 ? 'border-blue-700/40 bg-blue-900/20' :
                    eff > 0  ? 'border-white/10 bg-black/20 opacity-50' :
                               'border-white/5 bg-black/10 opacity-20'
                  }`}>
                    <TypeBadge type={defType} short />
                    <div className={`text-xs font-bold mt-0.5 ${
                      eff >= 2 ? 'text-blue-400' : eff > 0 ? 'text-white/30' : 'text-white/10'
                    }`}>
                      {eff >= 2 ? `×${eff}` : eff > 0 ? `×${eff}` : '–'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Por Pokémon — compacto */}
          <div className="space-y-2">
            {movesCoverage.map(({ pokemon, moves, coverage }) => (
              <div key={pokemon.id} className="bg-black/20 rounded-xl border border-white/10 p-3">
                {/* Header Pokémon */}
                <div className="flex items-center gap-2 mb-2">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <span className="text-white text-xs font-bold">{pokemon.nickname}</span>
                    <span className="text-white/30 text-xs capitalize ml-1">({pokemon.name})</span>
                  </div>
                  {moves.length === 0 && (
                    <span className="text-yellow-600 text-xs bg-yellow-900/20 border border-yellow-900/30 px-1.5 py-0.5 rounded">
                      Sin movs
                    </span>
                  )}
                </div>

                {moves.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Movimientos izquierda */}
                    <div className="space-y-1">
                      {moves.map((m, i) => (
                        <div key={i} className="flex items-center gap-1 bg-black/30 rounded px-1.5 py-1 border border-white/5">
                          <TypeBadge type={m.type as PokemonType} short />
                          <span className="text-white/70 text-xs truncate capitalize flex-1">{m.name}</span>
                          {m.power && <span className="text-white/25 text-xs flex-shrink-0">{m.power}</span>}
                        </div>
                      ))}
                      {Array.from({ length: 4 - moves.length }).map((_, i) => (
                        <div key={i} className="border border-dashed border-white/5 rounded px-1.5 py-1 text-white/10 text-xs text-center">
                          —
                        </div>
                      ))}
                    </div>

                    {/* Efectividad derecha — mini grid */}
                    <div className="grid grid-cols-6 gap-0.5 content-start">
                      {ALL_TYPES.map(defType => {
                        const eff = coverage[defType] ?? 0;
                        return (
                          <div key={defType} className={`rounded text-center py-0.5 ${
                            eff >= 2 ? 'bg-green-900/40' : 'bg-black/20 opacity-30'
                          }`} title={TYPE_ES[defType]}>
                            <div style={{ background: TYPE_COLORS[defType], fontSize: '7px', borderRadius: '2px', padding: '0 2px', color: '#fff', fontWeight: 'bold' }}>
                              {TYPE_ES_SHORT[defType]}
                            </div>
                            <div className={`text-xs font-bold leading-none mt-0.5 ${eff >= 2 ? 'text-green-400' : 'text-white/10'}`}
                              style={{ fontSize: '8px' }}>
                              {eff >= 2 ? `×${eff}` : '·'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-white/20 text-xs text-center py-1">Sin movimientos asignados</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Análisis Completo ── */}
      {activeTab === 'full' && (
        <div className="space-y-3">

          {/* Resumen ejecutivo compacto */}
          <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-white font-bold text-sm">📋 Resumen Ejecutivo</h3>
              <div className={`ml-auto text-3xl font-bold ${
                sharedWeaknesses.length === 0 && typesCovered >= 15 ? 'text-green-400' :
                sharedWeaknesses.length <= 1 && typesCovered >= 12 ? 'text-yellow-400' :
                sharedWeaknesses.length <= 2 && typesCovered >= 10 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {sharedWeaknesses.length === 0 && typesCovered >= 15 ? 'A' :
                 sharedWeaknesses.length <= 1 && typesCovered >= 12 ? 'B' :
                 sharedWeaknesses.length <= 2 && typesCovered >= 10 ? 'C' : 'D'}
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                { label: 'Cobertura ofensiva',   value: typesCovered,     color: '#3b82f6' },
                { label: 'Cobertura movimientos', value: moveTypesCovered, color: '#a855f7' },
                { label: 'Defensa sin críticas',  value: ALL_TYPES.length - sharedWeaknesses.length, color: '#22c55e' },
              ].map(bar => (
                <div key={bar.label} className="flex items-center gap-2">
                  <span className="text-white/40 text-xs w-36 flex-shrink-0">{bar.label}</span>
                  <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${(bar.value / ALL_TYPES.length) * 100}%`, background: bar.color }} />
                  </div>
                  <span className="text-white/50 text-xs w-8 text-right font-bold">
                    {bar.value}/{ALL_TYPES.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Debilidades críticas compactas */}
          {sharedWeaknesses.length > 0 && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-3">
              <p className="text-red-400 font-bold text-xs mb-2">⚠️ Debilidades Críticas</p>
              <div className="flex flex-wrap gap-2">
                {sharedWeaknesses.map(({ type, summary }) => (
                  <div key={type} className="bg-black/30 rounded-lg p-2 border border-red-900/30 flex-1 min-w-28">
                    <div className="flex items-center justify-between mb-1">
                      <TypeBadge type={type} />
                      <span className="text-red-300 text-xs font-bold">{summary.weak}/{team.length}</span>
                    </div>
                    <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-red-500"
                        style={{ width: `${(summary.weak / team.length) * 100}%` }} />
                    </div>
                    <div className="flex gap-2 mt-1 text-xs">
                      {summary.resist > 0 && <span className="text-green-400">{summary.resist}R</span>}
                      {summary.immune > 0 && <span className="text-blue-400">{summary.immune}I</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Análisis individual compacto */}
          <div className="space-y-2">
            {team.map((p, idx) => {
              const weaknesses  = getDefensiveWeaknesses(p.types);
              const critWeak    = Object.entries(weaknesses).filter(([,v]) => v >= 2).map(([k]) => k as PokemonType);
              const immunities  = Object.entries(weaknesses).filter(([,v]) => v === 0).map(([k]) => k as PokemonType);
              const resistances = Object.entries(weaknesses).filter(([,v]) => v > 0 && v < 1).map(([k]) => k as PokemonType);
              const memberMoves = movesCoverage[idx];
              const totalStats  = Object.values(p.stats).reduce((a,b) => a+b, 0);

              return (
                <div key={p.id} className="bg-black/20 rounded-xl border border-white/10 p-3">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <img src={p.sprite} alt={p.name} className="w-10 h-10 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-white font-bold text-sm">{p.nickname}</span>
                        <span className="text-white/30 text-xs capitalize">({p.name})</span>
                        <span className="text-white/20 text-xs">Lv.{p.level}</span>
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {p.types.map(t => <TypeBadge key={t} type={t as PokemonType} />)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white/20 text-xs">BST</div>
                      <div className="text-white font-bold">{totalStats}</div>
                    </div>
                  </div>

                  {/* Debilidades / Resistencias / Inmunidades en una fila */}
                  <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                    <div>
                      <p className="text-red-400/60 text-xs mb-1 font-bold">Débil</p>
                      <div className="flex flex-wrap gap-0.5">
                        {critWeak.length > 0
                          ? critWeak.map(t => <TypeBadge key={t} type={t} short />)
                          : <span className="text-white/15 text-xs">—</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-green-400/60 text-xs mb-1 font-bold">Resiste</p>
                      <div className="flex flex-wrap gap-0.5">
                        {resistances.length > 0
                          ? resistances.map(t => <TypeBadge key={t} type={t} short />)
                          : <span className="text-white/15 text-xs">—</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-400/60 text-xs mb-1 font-bold">Inmune</p>
                      <div className="flex flex-wrap gap-0.5">
                        {immunities.length > 0
                          ? immunities.map(t => <TypeBadge key={t} type={t} short />)
                          : <span className="text-white/15 text-xs">—</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stats mini en una línea */}
                  <div className="flex gap-1 mb-2">
                    {Object.entries(p.stats).map(([key, val]) => (
                      <div key={key} className="flex-1 text-center">
                        <div className="text-white/20 uppercase" style={{ fontSize: '8px' }}>
                          {key === 'spAtk' ? 'SpA' : key === 'spDef' ? 'SpD' : key.slice(0,3)}
                        </div>
                        <div className="h-6 bg-black/30 rounded-sm overflow-hidden flex flex-col-reverse mt-0.5">
                          <div className="rounded-sm"
                            style={{
                              height: `${Math.min((val/255)*100,100)}%`,
                              background: val >= 100 ? '#4ade80' : val >= 70 ? '#facc15' : '#f87171'
                            }} />
                        </div>
                        <div className="text-white/40 font-bold mt-0.5" style={{ fontSize: '9px' }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Movimientos compactos */}
                  {memberMoves && memberMoves.moves.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                      {memberMoves.moves.map((m, i) => (
                        <div key={i} className="flex items-center gap-1 bg-black/30 rounded px-1.5 py-0.5 border border-white/5">
                          <TypeBadge type={m.type as PokemonType} short />
                          <span className="text-white/60 capitalize" style={{ fontSize: '10px' }}>{m.name}</span>
                          {m.power && <span className="text-white/25" style={{ fontSize: '9px' }}>💥{m.power}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recomendaciones finales compactas */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-3">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">💡 Recomendaciones</p>
            <div className="space-y-1">
              {recommendations.map((r, i) => (
                <div key={i} className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
                  r.startsWith('✓')
                    ? 'bg-green-900/20 text-green-300 border-green-900/30'
                    : 'bg-yellow-900/20 text-yellow-300 border-yellow-900/30'
                }`}>
                  <span className="flex-shrink-0">{r.startsWith('✓') ? '✓' : '⚠'}</span>
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