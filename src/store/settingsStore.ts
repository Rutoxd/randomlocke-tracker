import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  activeTab: string;
  searchQuery: string;
  selectedPokemonId: string | null;
  modalOpen: string | null;

  setActiveTab: (tab: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedPokemon: (id: string | null) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      searchQuery: '',
      selectedPokemonId: null,
      modalOpen: null,

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedPokemon: (id) => set({ selectedPokemonId: id }),
      openModal: (name) => set({ modalOpen: name }),
      closeModal: () => set({ modalOpen: null }),
    }),
    {
      name: 'randomlocke-ui',
      partialize: (state) => ({
        activeTab: state.activeTab,
        searchQuery: state.searchQuery,
        selectedPokemonId: state.selectedPokemonId,
      }),
    }
  )
);
