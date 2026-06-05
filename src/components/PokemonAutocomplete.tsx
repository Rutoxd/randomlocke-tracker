import { useState, useEffect, useRef, useMemo } from 'react';
import { getPokemonList, filterPokemon } from '../utils/pokemonList';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (name: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PokemonAutocomplete({ value, onChange, onSelect, placeholder, className }: Props) {
  const [list, setList] = useState<{ name: string }[]>([]);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPokemonList().then(setList);
  }, []);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    return filterPokemon(list, value).map(r => r.name);
  }, [value, list]);

  const open = focused && suggestions.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <input
        className={className ?? 'w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm'}
        placeholder={placeholder ?? 'Buscar Pokémon...'}
        value={value}
        onChange={e => { onChange(e.target.value); setFocused(true); }}
        onFocus={() => setFocused(true)}
        autoComplete="off"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-gray-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map(name => (
            <button
              key={name}
              onMouseDown={e => {
                e.preventDefault();
                onChange(name);
                setFocused(false);
                onSelect?.(name);
              }}
              className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 text-sm capitalize transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}