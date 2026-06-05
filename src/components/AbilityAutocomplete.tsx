// src/components/AbilityAutocomplete.tsx
import { useState, useRef, useMemo } from 'react';
import { ALL_ABILITIES, ABILITY_NAMES } from '../data/abilities';

interface Props {
  value: string;
  onChange: (val: string) => void;
  options?: string[];
  placeholder?: string;
  className?: string;
  showDescriptions?: boolean;
}

export default function AbilityAutocomplete({
  value, onChange, options, placeholder, className, showDescriptions = false
}: Props) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Si vienen options (habilidades de PokeAPI), úsalas; si no, usa la lista local
  const baseList = (options && options.length > 0) ? options : ABILITY_NAMES;

  const suggestions = useMemo(() => {
    if (!value || value.length < 1) return baseList.slice(0, 8);
    const q = value.toLowerCase();
    return baseList.filter(a => a.toLowerCase().includes(q)).slice(0, 8);
  }, [value, baseList]);

  const getDescription = (name: string) =>
    ALL_ABILITIES.find(a => a.name.toLowerCase() === name.toLowerCase())?.description;

  const open = focused && suggestions.length > 0;

  return (
    <div ref={ref} className="relative w-full">
      <input
        className={className ?? 'w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm'}
        placeholder={placeholder ?? 'Habilidad...'}
        value={value}
        onChange={e => { onChange(e.target.value); setFocused(true); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        autoComplete="off"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
          {suggestions.map(name => {
            const desc = showDescriptions ? getDescription(name) : null;
            return (
              <button
                key={name}
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(name);
                  setFocused(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
              >
                <div className="text-white/90 text-sm capitalize">{name}</div>
                {desc && <div className="text-white/40 text-xs mt-0.5">{desc}</div>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}