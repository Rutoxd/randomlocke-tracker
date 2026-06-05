import { useState, useCallback } from 'react';
import type { TeamPokemon, PokemonType, BaseStat } from '../types/pokemon.types';

const BASE = 'https://pokeapi.co/api/v2';
const cache = new Map<string, PokeRawData>();
const speciesCache = new Map<string, PokeSpeciesData>();

interface PokeRawType     { type: { name: string } }
interface PokeRawStat     { base_stat: number }
interface PokeRawAbility  { ability: { name: string } }
interface PokeRawSprites  { front_default: string | null; front_shiny: string | null }
interface PokeRawData {
  id: number; name: string;
  types: PokeRawType[]; stats: PokeRawStat[];
  abilities: PokeRawAbility[]; sprites: PokeRawSprites;
  height: number; weight: number; base_experience: number;
}

interface PokeVariety { is_default: boolean; pokemon: { name: string; url: string } }
interface PokeSpeciesData {
  varieties: PokeVariety[];
  names: { name: string; language: { name: string } }[];
}

async function fetchCached(url: string): Promise<PokeRawData> {
  if (cache.has(url)) return cache.get(url)!;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`);
  const data: PokeRawData = await res.json();
  cache.set(url, data);
  return data;
}

async function fetchSpecies(nameOrId: string | number): Promise<PokeSpeciesData | null> {
  const url = `${BASE}/pokemon-species/${nameOrId}`;
  if (speciesCache.has(url)) return speciesCache.get(url)!;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: PokeSpeciesData = await res.json();
    speciesCache.set(url, data);
    return data;
  } catch { return null; }
}

export interface PokeVarietyOption {
  name: string;
  label: string;
}

export interface PokeSearchResult {
  id: number; name: string;
  types: PokemonType[]; sprite: string; spriteShiny: string;
  stats: BaseStat; abilities: string[];
  height: number; weight: number; baseExp: number;
  varieties: PokeVarietyOption[];
}

export function usePokeAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const searchPokemon = useCallback(async (query: string): Promise<PokeSearchResult | null> => {
    if (!query.trim()) return null;
    setLoading(true); setError(null);
    try {
      const data = await fetchCached(`${BASE}/pokemon/${query.toLowerCase().trim()}`);
      const species = await fetchSpecies(data.id);
      return parsePokemon(data, species);
    } catch {
      setError('Pokémon no encontrado'); return null;
    } finally { setLoading(false); }
  }, []);

  const getPokemonById = useCallback(async (id: number): Promise<PokeSearchResult | null> => {
    setLoading(true); setError(null);
    try {
      const data = await fetchCached(`${BASE}/pokemon/${id}`);
      const species = await fetchSpecies(data.id);
      return parsePokemon(data, species);
    } catch {
      setError('Error al cargar Pokémon'); return null;
    } finally { setLoading(false); }
  }, []);

  const getRandomPokemon = useCallback(async (max = 898): Promise<PokeSearchResult | null> => {
    const id = Math.floor(Math.random() * max) + 1;
    return getPokemonById(id);
  }, [getPokemonById]);

  const buildTeamPokemon = useCallback((
  result: PokeSearchResult,
  nickname: string,
  route: string
): TeamPokemon => ({
  id: crypto.randomUUID(),
  pokedexId: result.id,
  name: result.name,
  nickname: nickname || result.name,
  types: result.types,
  ability: result.abilities[0] || 'desconocida',
  stats: result.stats,
  sprite: result.sprite,
  spriteShiny: result.spriteShiny,
  isShiny: false,
  status: 'active',
  level: 5,
  caughtAt: route,
  caughtDate: new Date().toLocaleDateString('es-MX'),
  slot: null,
  moves: [null, null, null, null],
  heldItem: null,
}), []);

  return { searchPokemon, getPokemonById, getRandomPokemon, buildTeamPokemon, loading, error };
}

function formatVarietyLabel(name: string): string {
  return name
    .replace(/-mega(-[xy])?$/, ' (Mega$1)')
    .replace(/-gmax$/, ' (Gigamax)')
    .replace(/-alola$/, ' (Alola)')
    .replace(/-galar$/, ' (Galar)')
    .replace(/-hisui$/, ' (Hisui)')
    .replace(/-paldea$/, ' (Paldea)')
    .replace(/-/g, ' ');
}

function parsePokemon(data: PokeRawData, species: PokeSpeciesData | null): PokeSearchResult {
  const varieties: PokeVarietyOption[] = species
    ? species.varieties.map(v => ({
        name: v.pokemon.name,
        label: formatVarietyLabel(v.pokemon.name),
      }))
    : [];

  return {
    id: data.id, name: data.name,
    types: data.types.map(t => t.type.name as PokemonType),
    sprite: data.sprites.front_default ?? '',
    spriteShiny: data.sprites.front_shiny ?? '',
    stats: {
      hp:      data.stats[0].base_stat,
      attack:  data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      spAtk:   data.stats[3].base_stat,
      spDef:   data.stats[4].base_stat,
      speed:   data.stats[5].base_stat,
    },
    abilities: data.abilities.map(a => a.ability.name),
    height: data.height, weight: data.weight,
    baseExp: data.base_experience,
    varieties,
  };
}