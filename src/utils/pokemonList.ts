// Lista que se carga una vez desde PokeAPI y se cachea en memoria
let cachedList: { name: string; url: string }[] = [];

export async function getPokemonList(): Promise<{ name: string; url: string }[]> {
  if (cachedList.length > 0) return cachedList;
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    const data = await res.json();
    cachedList = data.results;
    return cachedList;
  } catch {
    return [];
  }
}

export function filterPokemon(list: { name: string }[], query: string, max = 8) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return list
    .filter(p => p.name.startsWith(q))
    .slice(0, max);
}