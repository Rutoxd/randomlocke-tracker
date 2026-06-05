import { useGameStore } from '../store/gameStore';
import { TYPE_COLORS, TYPE_LABELS, getDefensiveWeaknesses, getOffensiveMatchup } from '../utils/typeMatchups';
import type { PokemonType } from '../types/pokemon.types';

const ALL_TYPES: PokemonType[] = [
  'fire','water','grass','electric','psychic','ice','dragon','dark','fairy',
  'normal','fighting','flying','poison','ground','rock','bug','ghost','steel'
];

export default function TeamSimulator() {
  const team = useGameStore(s => s.team);

  if (team.length === 0) {
    return (
      <div className="text-center text-white/30 py-16">
        <div className="text-5xl mb-3">🔬</div>
        <p>Agrega Pokémon al equipo para analizar la cobertura</p>
      </div>
    );
  }

  // Cobertura defensiva — suma de multiplicadores por tipo atacante
  const defensiveSummary: Record<PokemonType, number[]> = {} as Record<PokemonType, number[]>;
  ALL_TYPES.forEach(atk => { defensiveSummary[atk] = []; });

  team.forEach(pokemon => {
    const weaknesses = getDefensiveWeaknesses(pokemon.types);
    ALL_TYPES.forEach(atk => {
      defensiveSummary[atk].push(weaknesses[atk] ?? 1);
    });
  });

  // Cuántos miembros son débiles a cada tipo
  const teamWeaknesses = ALL_TYPES.map(atk => ({
    type: atk,
    weak: defensiveSummary[atk].filter(v => v >= 2).length,
    immune: defensiveSummary[atk].filter(v => v === 0).length,
    resist: defensiveSummary[atk].filter(v => v > 0 && v < 1).length,
  })).sort((a, b) => b.weak - a.weak);

  // Cobertura ofensiva — qué tipos puede atacar efectivamente el equipo
  const offensiveCoverage: Record<PokemonType, number> = {} as Record<PokemonType, number>;
  ALL_TYPES.forEach(def => {
    let best = 0;
    team.forEach(pokemon => {
      pokemon.types.forEach(atkType => {
        const mult = getOffensiveMatchup(atkType, def);
        if (mult > best) best = mult;
      });
    });
    offensiveCoverage[def] = best;
  });

  const uncovered = ALL_TYPES.filter(t => offensiveCoverage[t] < 1);
  const superEffective = ALL_TYPES.filter(t => offensiveCoverage[t] >= 2);

  // Tipos con 3+ miembros débiles = alerta
  const dangers = teamWeaknesses.filter(t => t.weak >= 3);

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">🔬 Simulador de Equipo</h2>

      {/* Equipo actual */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Equipo analizado</div>
        <div className="flex flex-wrap gap-3">
          {team.map(p => (
            <div key={p.id} className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 border border-white/10">
              <img src={p.sprite} alt={p.name} className="w-8 h-8 object-contain" />
              <div>
                <div className="text-white text-xs font-bold">{p.nickname}</div>
                <div className="flex gap-1">
                  {p.types.map(t => (
                    <span key={t} className="type-badge text-white text-xs px-1.5 py-0 rounded-full" style={{ background: TYPE_COLORS[t], fontSize: '10px' }}>
                      {TYPE_LABELS[t]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {dangers.length > 0 && (
        <div className="bg-red-900/20 border border-red-900/40 rounded-2xl p-4">
          <div className="text-red-400 font-bold text-sm mb-2">⚠️ Debilidades compartidas críticas</div>
          <div className="flex flex-wrap gap-2">
            {dangers.map(({ type, weak }) => (
              <div key={type} className="flex items-center gap-1.5 bg-red-900/30 rounded-lg px-3 py-1.5">
                <span className="type-badge text-white text-xs px-2 py-0.5" style={{ background: TYPE_COLORS[type] }}>
                  {TYPE_LABELS[type]}
                </span>
                <span className="text-red-300 text-xs font-bold">{weak}/{team.length} débiles</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cobertura defensiva */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
          <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Cobertura defensiva</div>
          <div className="space-y-1.5">
            {teamWeaknesses.map(({ type, weak, resist, immune }) => (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="type-badge text-white text-xs px-2 py-0.5 w-20 text-center flex-shrink-0"
                  style={{ background: TYPE_COLORS[type] }}
                >
                  {TYPE_LABELS[type]}
                </span>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: team.length }).map((_, i) => {
                    const val = defensiveSummary[type][i] ?? 1;
                    const bg = val >= 4 ? '#ef4444' : val >= 2 ? '#f97316' : val === 0 ? '#3b82f6' : val < 1 ? '#22c55e' : '#374151';
                    const label = val >= 4 ? '4x' : val >= 2 ? '2x' : val === 0 ? '0x' : val < 1 ? '½' : '·';
                    return (
                      <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: bg }}>
                        {label}
                      </div>
                    );
                  })}
                </div>
                <div className="text-white/30 text-xs w-16 text-right">
                  {weak > 0 && <span className="text-red-400">{weak}W </span>}
                  {resist > 0 && <span className="text-green-400">{resist}R </span>}
                  {immune > 0 && <span className="text-blue-400">{immune}I</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cobertura ofensiva */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
          <div>
            <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Cobertura ofensiva</div>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_TYPES.map(def => {
                const mult = offensiveCoverage[def];
                const bg = mult >= 2 ? '#22c55e33' : mult === 0 ? '#ef444433' : '#ffffff11';
                const border = mult >= 2 ? '#22c55e66' : mult === 0 ? '#ef444466' : '#ffffff22';
                const textColor = mult >= 2 ? '#4ade80' : mult === 0 ? '#f87171' : '#ffffff99';
                return (
                  <div key={def} className="rounded-lg p-1.5 text-center border" style={{ background: bg, borderColor: border }}>
                    <div className="text-xs font-bold" style={{ color: textColor }}>
                      {TYPE_LABELS[def]}
                    </div>
                    <div className="text-xs" style={{ color: textColor }}>
                      {mult >= 2 ? `×${mult}` : mult === 0 ? 'sin cobertura' : '×1'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recomendaciones */}
          <div>
            <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Recomendaciones</div>
            <div className="space-y-1.5 text-xs">
              {uncovered.length > 0 && (
                <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-2">
                  <span className="text-red-400 font-bold">Sin cobertura: </span>
                  <span className="text-white/60">{uncovered.map(t => TYPE_LABELS[t]).join(', ')}</span>
                </div>
              )}
              {superEffective.length >= 12 && (
                <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-2">
                  <span className="text-green-400 font-bold">✓ Excelente cobertura ofensiva </span>
                  <span className="text-white/60">({superEffective.length}/18 tipos cubiertos)</span>
                </div>
              )}
              {dangers.length === 0 && (
                <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-2">
                  <span className="text-green-400 font-bold">✓ Sin debilidades críticas compartidas</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}