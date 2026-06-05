// src/components/Bag.tsx
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { BagItem } from '../types/game.types';
import toast from 'react-hot-toast';
import { ALL_ITEMS, ITEMS_BY_CATEGORY } from '../data/items';

// ── Categorías ──
const CATEGORIES = [
  { id: 'all',       label: 'Todo',           icon: '🎒' },
  { id: 'curative',  label: 'Curativos',      icon: '💊' },
  { id: 'berry',     label: 'Bayas',          icon: '🍓' },
  { id: 'ball',      label: 'Poké Balls',     icon: '🔴' },
  { id: 'held',      label: 'Para Equipar',   icon: '⚔️' },
  { id: 'evolution', label: 'Evolutivos',     icon: '🌙' },
  { id: 'tm',        label: 'MT/MO',          icon: '💿' },
  { id: 'key',       label: 'Objetos Clave',  icon: '🗝️' },
  { id: 'other',     label: 'Otros',          icon: '📦' },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

export default function Bag() {
  const bag           = useGameStore(s => s.bag);
  const team          = useGameStore(s => s.team);
  const pc            = useGameStore(s => s.pc);
  const addToBag      = useGameStore(s => s.addToBag);
  const removeFromBag = useGameStore(s => s.removeFromBag);
  const updateBagItem = useGameStore(s => s.updateBagItem);

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [showAdd,        setShowAdd]         = useState(false);
  const [filter,         setFilter]          = useState('');

  // Formulario nuevo objeto
  const [newName,     setNewName]     = useState('');
  const [newCategory, setNewCategory] = useState<Exclude<CategoryId, 'all'>>('curative');
  const [newQty,      setNewQty]      = useState(1);
  const [newDesc,     setNewDesc]     = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg,    setShowSugg]    = useState(false);

  // Edición inline de cantidad
  const [editingQtyId,  setEditingQtyId]  = useState<string | null>(null);
  const [editingQtyVal, setEditingQtyVal] = useState(1);

  // ── Filtrado ──
  const displayed = bag.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchTxt = item.name.toLowerCase().includes(filter.toLowerCase());
    return matchCat && matchTxt;
  });

  // ── Quién lleva equipado cada objeto ──
  const equippedBy = (itemName: string): string[] => {
    return [...team, ...pc]
      .filter(p => p.heldItem === itemName)
      .map(p => p.nickname);
  };

  // ── Autocompletado ──
  const handleNameChange = (val: string) => {
  setNewName(val);
  if (val.length >= 1) {
    const q = val.toLowerCase();
    const catItems = ITEMS_BY_CATEGORY[newCategory] ?? ALL_ITEMS;
    const filtered = catItems
      .filter(i => i.name.toLowerCase().includes(q))
      .slice(0, 7);
    setSuggestions(filtered.length ? filtered.map(i => i.name) : []);
    setShowSugg(true);
  } else {
    const catItems = ITEMS_BY_CATEGORY[newCategory] ?? [];
    setSuggestions(catItems.slice(0, 7).map(i => i.name));
    setShowSugg(true);
  }
};

  const handleSelectSugg = (name: string) => {
    setNewName(name);
    setShowSugg(false);
    // Auto-rellenar descripción si existe en el catálogo
    const found = ALL_ITEMS.find(i => i.name === name);
    if (found) setNewDesc(found.description);
  };

  // ── Agregar objeto ──
  const handleAdd = () => {
    if (!newName.trim()) { toast.error('Escribe el nombre del objeto'); return; }
    const existing = bag.find(i => i.name.toLowerCase() === newName.trim().toLowerCase());
    if (existing) {
      updateBagItem(existing.id, { quantity: existing.quantity + newQty });
      toast.success(`+${newQty} ${existing.name} añadidos`);
    } else {
      const found = ALL_ITEMS.find(i => i.name.toLowerCase() === newName.trim().toLowerCase());
      addToBag({
        id: crypto.randomUUID(),
        name: newName.trim(),
        category: found?.category ?? newCategory,
        quantity: newQty,
        description: newDesc.trim() || found?.description || '',
      } as BagItem);
      toast.success(`${newName.trim()} añadido a la mochila`);
    }
    setShowAdd(false);
    setNewName(''); setNewCategory('curative'); setNewQty(1); setNewDesc('');
    setSuggestions([]); setShowSugg(false);
  };

  // ── Cambiar cantidad inline ──
  const handleQtySave = (id: string) => {
    if (editingQtyVal <= 0) {
      removeFromBag(id);
      toast('🗑 Objeto eliminado');
    } else {
      updateBagItem(id, { quantity: editingQtyVal });
    }
    setEditingQtyId(null);
  };

  const totalItems = bag.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          🎒 Mochila
          <span className="text-white/40 text-sm font-normal">
            {bag.length} tipos · {totalItems} objetos
          </span>
        </h2>
        <div className="flex gap-2">
          <input
            className="bg-black/30 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none placeholder:text-white/30 w-36"
            placeholder="Buscar..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="poke-btn bg-yellow-700 hover:bg-yellow-600 text-white text-sm px-4 py-2"
          >
            + Añadir objeto
          </button>
        </div>
      </div>

      {/* Tabs de categoría */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
              activeCategory === cat.id
                ? 'bg-yellow-700/60 border-yellow-600/60 text-yellow-200'
                : 'bg-black/20 border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {cat.icon} {cat.label}
            {cat.id !== 'all' && (
              <span className="ml-1 text-white/30">
                ({bag.filter(i => i.category === cat.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de objetos */}
      {displayed.length === 0 ? (
        <div className="text-center text-white/30 py-16">
          <div className="text-5xl mb-3">🎒</div>
          <p>{bag.length === 0 ? 'La mochila está vacía' : 'No hay objetos en esta categoría'}</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
          >
            + Añadir primer objeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {displayed.map(item => {
            const holders = equippedBy(item.name);
            const catInfo = CATEGORIES.find(c => c.id === item.category);
            return (
              <div
                key={item.id}
                className="bg-black/20 border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-white/20 transition-all"
              >
                {/* Icono categoría */}
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-black/20 rounded-lg shrink-0">
                  {catInfo?.icon ?? '📦'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-white/30 text-xs truncate">{item.description}</div>
                  )}
                  <div className="text-white/30 text-xs">{catInfo?.label}</div>

                  {/* Indicador "Equipado por" */}
                  {holders.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {holders.map(nick => (
                        <span key={nick} className="text-xs bg-yellow-900/40 border border-yellow-600/30 text-yellow-300 px-1.5 py-0.5 rounded-full">
                          ⚔️ {nick}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cantidad + acciones */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {editingQtyId === item.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min={0}
                        className="w-14 bg-black/40 text-white text-sm rounded px-2 py-1 border border-white/20 outline-none text-center"
                        value={editingQtyVal}
                        onChange={e => setEditingQtyVal(Number(e.target.value))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleQtySave(item.id);
                          if (e.key === 'Escape') setEditingQtyId(null);
                        }}
                        autoFocus
                      />
                      <button onClick={() => handleQtySave(item.id)} className="text-green-400 hover:text-green-300 text-sm">✓</button>
                      <button onClick={() => setEditingQtyId(null)} className="text-white/30 hover:text-white/60 text-sm">✗</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingQtyId(item.id); setEditingQtyVal(item.quantity); }}
                      className="text-white font-bold text-lg hover:text-yellow-300 transition-colors min-w-8 text-center"
                      title="Click para editar cantidad"
                    >
                      x{item.quantity}
                    </button>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateBagItem(item.id, { quantity: item.quantity + 1 })}
                      className="text-white/30 hover:text-green-400 text-sm transition-colors px-1"
                      title="Añadir uno"
                    >+</button>
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) { removeFromBag(item.id); toast('🗑 Objeto eliminado'); }
                        else updateBagItem(item.id, { quantity: item.quantity - 1 });
                      }}
                      className="text-white/30 hover:text-red-400 text-sm transition-colors px-1"
                      title="Quitar uno"
                    >−</button>
                    <button
                      onClick={() => { removeFromBag(item.id); toast('🗑 Objeto eliminado'); }}
                      className="text-white/20 hover:text-red-500 text-xs transition-colors px-1"
                      title="Eliminar objeto"
                    >🗑</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal — Añadir objeto */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl my-4">
            <h3 className="text-white font-bold text-lg mb-4">🎒 Añadir objeto</h3>
            <div className="space-y-3">

              {/* Categoría */}
              <div>
                <label className="text-white/50 text-xs block mb-1">Categoría</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setNewCategory(cat.id as Exclude<CategoryId, 'all'>);
                        setNewName('');
                        setSuggestions([]);
                        setShowSugg(false);
                      }}
                      className={`text-xs py-1.5 px-2 rounded-lg border transition-all ${
                        newCategory === cat.id
                          ? 'bg-yellow-700/60 border-yellow-600/60 text-yellow-200'
                          : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre con autocompletado */}
              <div className="relative">
                <label className="text-white/50 text-xs block mb-1">Nombre del objeto *</label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="ej: Poción, Baya Sitrus..."
                  value={newName}
                  onChange={e => handleNameChange(e.target.value)}
                  onFocus={() => {
  if (newName.length === 0) {
    const catItems = ITEMS_BY_CATEGORY[newCategory] ?? [];
    setSuggestions(catItems.slice(0, 7).map(i => i.name));
  }
  setShowSugg(true);
}}
                  onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                />
                {showSugg && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-gray-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                    {suggestions.map(s => {
                      const itemData = ALL_ITEMS.find(i => i.name === s);
                      return (
                        <button
                          key={s}
                          onMouseDown={e => { e.preventDefault(); handleSelectSugg(s); }}
                          className="w-full text-left px-3 py-2 hover:bg-white/10 text-sm transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="text-white/80">{s}</div>
                          {itemData && (
                            <div className="text-white/30 text-xs mt-0.5">{itemData.description}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cantidad */}
              <div>
                <label className="text-white/50 text-xs block mb-1">Cantidad</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNewQty(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-black/30 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >−</button>
                  <input
                    type="number" min={1}
                    className="flex-1 bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none text-sm text-center"
                    value={newQty}
                    onChange={e => setNewQty(Math.max(1, Number(e.target.value)))}
                  />
                  <button
                    onClick={() => setNewQty(q => q + 1)}
                    className="w-8 h-8 rounded-lg bg-black/30 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >+</button>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-white/50 text-xs block mb-1">
                  Descripción <span className="text-white/20">(opcional)</span>
                </label>
                <input
                  className="w-full bg-black/40 text-white rounded-lg px-3 py-2 border border-white/10 outline-none placeholder:text-white/30 text-sm"
                  placeholder="ej: Recupera 20 PS"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-white font-bold transition-colors"
              >
                ✓ Añadir
              </button>
              <button
                onClick={() => {
                  setShowAdd(false);
                  setNewName(''); setNewQty(1); setNewDesc('');
                  setSuggestions([]); setShowSugg(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}