// src/components/StatsEditor.tsx
import type { BaseStat } from '../types/pokemon.types';

interface Props {
  stats: BaseStat;
  onChange: (stats: BaseStat) => void;
  compact?: boolean;
  level?: number; // <-- ¡NUEVO: Ahora acepta el nivel!
}

const STAT_LABELS: Record<keyof BaseStat, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  spAtk: 'Sp.Atk',
  spDef: 'Sp.Def',
  speed: 'Velocidad',
};

const STAT_COLORS: Record<keyof BaseStat, string> = {
  hp: '#f87171',
  attack: '#fb923c',
  defense: '#facc15',
  spAtk: '#60a5fa',
  spDef: '#818cf8',
  speed: '#34d399',
};

export default function StatsEditor({ stats, onChange, compact = false, level }: Props) {
  const totalBase = Object.values(stats).reduce((a, b) => a + b, 0);

  const handleChange = (key: keyof BaseStat, val: number) => {
    onChange({ ...stats, [key]: Math.max(1, Math.min(255, val || 1)) });
  };

  // Función interna para calcular las stats reales al vuelo
  const getCalculated = (key: keyof BaseStat, base: number) => {
    if (!level) return base;
    const iv = 15;
    if (key === 'hp') return Math.floor((2 * base + iv) * level / 100) + level + 10;
    return Math.floor((Math.floor((2 * base + iv) * level / 100) + 5));
  };

  return (
    <div className="space-y-1.5">
      {(Object.keys(stats) as (keyof BaseStat)[]).map(key => {
        const base = stats[key];
        const actual = getCalculated(key, base);
        // Calculamos el máximo posible de esa stat a ese nivel para que la barra se vea perfecta
        const maxAtLevel = level ? getCalculated(key, 255) : 255;

        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-white/40 text-xs w-16 text-right flex-shrink-0">
              {STAT_LABELS[key]}
            </span>
            <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((level ? actual : base) / maxAtLevel) * 100, 100)}%`,
                  background: STAT_COLORS[key],
                }}
              />
            </div>
            {compact ? (
              <div className="flex items-center justify-end w-16 gap-1 text-right">
                <span className="text-white font-bold text-xs">{level ? actual : base}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={255}
                  value={base}
                  onChange={e => handleChange(key, Number(e.target.value))}
                  className="w-10 bg-black/40 text-white text-xs rounded px-1 py-0.5 border border-white/10 outline-none text-right font-bold"
                  style={{ color: STAT_COLORS[key] }}
                  title="Stat Base"
                />
                {level && <span className="text-white/50 text-[10px] w-6">→ {actual}</span>}
              </div>
            )}
          </div>
        );
      })}
      <div className="flex justify-between pt-1 border-t border-white/5 text-xs">
        <span className="text-white/30">Total Base</span>
        <span className="text-white/60 font-bold">{totalBase}</span>
      </div>
    </div>
  );
}