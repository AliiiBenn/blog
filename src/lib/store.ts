import { create } from 'zustand'

interface AppState {
  // Mobile menu state
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void

  // Search state
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  toggleSearch: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}))
