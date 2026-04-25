import { create } from 'zustand'

export const useAppStore = create((set) => ({
    activeApp: 'dashboard',
    theme: 'dark',
    setActiveApp: (appId) => set({ activeApp: appId }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}))
