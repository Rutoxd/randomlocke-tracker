import type { BaseStat } from '../types/pokemon.types';

interface Props {
  stats: BaseStat;
  onChange: (stats: BaseStat) => void;
  compact?: boolean;
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

export default function StatsEditor({ stats, onChange, compact = false }: Props) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  const handleChange = (key: keyof BaseStat, val: number) => {
    onChange({ ...stats, [key]: Math.max(1, Math.min(255, val || 1)) });
  };

  return (
    <div className="space-y-1.5">
      {(Object.keys(stats) as (keyof BaseStat)[]).map(key => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-white/40 text-xs w-16 text-right flex-shrink-0">
            {STAT_LABELS[key]}
          </span>
          <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min((stats[key] / 255) * 100, 100)}%`,
                background: STAT_COLORS[key],
              }}
            />
          </div>
          {compact ? (
            <span className="text-white/60 text-xs w-8 text-right font-bold">{stats[key]}</span>
          ) : (
            <input
              type="number"
              min={1}
              max={255}
              value={stats[key]}
              onChange={e => handleChange(key, Number(e.target.value))}
              className="w-14 bg-black/40 text-white text-xs rounded px-1.5 py-0.5 border border-white/10 outline-none text-right font-bold"
              style={{ color: STAT_COLORS[key] }}
            />
          )}
        </div>
      ))}
      <div className="flex justify-between pt-1 border-t border-white/5 text-xs">
        <span className="text-white/30">Total</span>
        <span className="text-white/60 font-bold">{total}</span>
      </div>
    </div>
  );
}