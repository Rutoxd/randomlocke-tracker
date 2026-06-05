// src/services/movesApi.ts

// Estructura básica que devuelve la lista general de la PokeAPI
export interface MoveBasicInfo {
  name: string;
  url: string;
}

// Estructura detallada que usaremos en tu modal
export interface MoveDetail {
  nameEs: string;
  nameEn: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
}

// Interfaz para tipar correctamente los idiomas en la respuesta de la PokeAPI
export interface PokeAPIName {
  name: string;
  language: {
    name: string;
    url: string;
  };
}

// Variable global para almacenar en caché la lista de movimientos y no saturar la API
let cachedMovesList: MoveBasicInfo[] = [];

/**
 * Obtiene y almacena la lista completa de movimientos.
 * Llama a esta función cuando tu aplicación o componente se cargue por primera vez.
 */
export async function fetchAllMovesList(): Promise<MoveBasicInfo[]> {
  // Si ya tenemos los datos, no volvemos a hacer la petición
  if (cachedMovesList.length > 0) return cachedMovesList;

  try {
    // Obtenemos un límite alto para traer todos los movimientos de golpe
    const response = await fetch('https://pokeapi.co/api/v2/move?limit=10000');
    const data = await response.json();
    cachedMovesList = data.results;
    return cachedMovesList;
  } catch (error) {
    console.error('Error al obtener la lista de movimientos:', error);
    return [];
  }
}

/**
 * Filtra la lista en caché según lo que el usuario escriba.
 * Úsalo para el autocompletado.
 * @param query El texto a buscar (por defecto en inglés)
 */
export function searchMovesFromAPI(query: string): MoveBasicInfo[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  
  return cachedMovesList
    .filter(m => m.name.includes(q))
    .slice(0, 10); // Limitamos a 10 resultados para no sobrecargar la vista
}

/**
 * Obtiene los detalles completos (traducción, potencia, etc.) usando la URL del movimiento.
 * Llama a esta función cuando el usuario haga clic en una opción del autocompletado.
 * @param url La URL específica del movimiento obtenida en searchMovesFromAPI
 */
export async function getMoveDetails(url: string): Promise<MoveDetail | null> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Buscamos la traducción al español en el array 'names' con tipado estricto
    const nameEsObj = data.names.find((n: PokeAPIName) => n.language.name === 'es');
    const nameEs = nameEsObj ? nameEsObj.name : data.name;

    return {
      nameEs: nameEs,
      nameEn: data.name,
      type: data.type.name,
      category: data.damage_class?.name || 'status',
      power: data.power,
      accuracy: data.accuracy,
      pp: data.pp,
    };
  } catch (error) {
    console.error('Error al obtener el detalle del movimiento:', error);
    return null;
  }
}