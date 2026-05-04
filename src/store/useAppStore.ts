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
  geminiApiKey: string | null;
  toggleTheme: () => void;
  addFile: (file: FileData) => void;
  removeFile: (index: number) => void;
  clearAllFiles: () => void;
  setCurrentFile: (file: FileData | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setGeminiApiKey: (key: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      uploadedFiles: [],
      currentFile: null,
      isAnalyzing: false,
      analysisProgress: 0,
      geminiApiKey: 'AIzaSyANiNmSPWX06AhKAEJ7-6-UYnzU1eh8Fmk',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      addFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),
      removeFile: (index) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
        })),
      clearAllFiles: () =>
        set({
          uploadedFiles: [],
          currentFile: null,
        }),
      setCurrentFile: (file) => set({ currentFile: file }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
    }),
    {
      name: 'analytics-dashboard-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        uploadedFiles: state.uploadedFiles,
        currentFile: state.currentFile,
        geminiApiKey: state.geminiApiKey 
      }),
    }
  )
);
