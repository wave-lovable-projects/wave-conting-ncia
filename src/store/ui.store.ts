import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'GESTOR' | 'AUXILIAR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  squadId: string | null;
}

interface UIState {
  user: User | null;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  setUser: (user: User | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  user: null,
  sidebarCollapsed: false,
  activeModal: null,
  setUser: (user) => set({ user }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setActiveModal: (activeModal) => set({ activeModal }),
}));
