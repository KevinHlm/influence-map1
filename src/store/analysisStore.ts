import create from 'zustand';
import { Node } from '../components/features/influence-mapping/types';

interface AnalysisStore {
  currentInfluenceMap: Node[];
  setCurrentInfluenceMap: (map: Node[]) => void;
  saveInfluenceMap: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  currentInfluenceMap: [],
  setCurrentInfluenceMap: (map) => set({ currentInfluenceMap: map }),
  saveInfluenceMap: async () => {
    // In a real app, this would save to a backend
    // For now, we'll just save to localStorage
    try {
      const map = useAnalysisStore.getState().currentInfluenceMap;
      localStorage.setItem('influenceMap', JSON.stringify(map));
    } catch (error) {
      console.error('Error saving influence map:', error);
    }
  },
}));
