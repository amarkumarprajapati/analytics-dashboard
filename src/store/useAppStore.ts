import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FileData {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  data?: any;
}

interface AppState {
  theme: 'light' | 'dark';
  uploadedFiles: FileData[];
  currentFile: FileData | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  toggleTheme: () => void;
  addFile: (file: FileData) => void;
  setCurrentFile: (file: FileData | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      uploadedFiles: [],
      currentFile: null,
      isAnalyzing: false,
      analysisProgress: 0,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      addFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),
      setCurrentFile: (file) => set({ currentFile: file }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
    }),
    {
      name: 'analytics-dashboard-storage',
      partialize: (state) => ({ theme: state.theme, uploadedFiles: state.uploadedFiles }),
    }
  )
);
