import { create } from 'zustand';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  secondarySidebarOpen: boolean;
  selectedLanguage: 'hi' | 'en';
  loading: boolean;
  activeSidebarTab: 'layers' | 'draw' | 'analysis';
  
  // Department State
  selectedDepartment: string;
  
  // Modal States
  showSettingsModal: boolean;
  showHelpModal: boolean;
  showUserProfileModal: boolean;
  showEditProfileModal: boolean;
  showChangePasswordModal: boolean;
  
  // Drawing State
  activeDrawingTool: string | null;
  
  // Layer State
  selectedLayers: string[];
  expandedNodes: Set<string>;
  
  // Basemap State
  selectedBasemap: string;
  
  // Actions
  toggleSidebar: () => void;
  toggleSecondarySidebar: () => void;
  setLanguage: (lang: 'hi' | 'en') => void;
  setLoading: (loading: boolean) => void;
  setActiveSidebarTab: (tab: 'layers' | 'draw' | 'analysis') => void;
  setActiveDrawingTool: (tool: string | null) => void;
  setSelectedLayers: (layers: string[]) => void;
  toggleLayerSelection: (layerId: string) => void;
  setExpandedNodes: (nodes: Set<string>) => void;
  toggleNodeExpansion: (nodeId: string) => void;
  setSelectedDepartment: (department: string) => void;
  setSelectedBasemap: (basemap: string) => void;
  
  // Modal Actions
  setShowSettingsModal: (show: boolean) => void;
  setShowHelpModal: (show: boolean) => void;
  setShowUserProfileModal: (show: boolean) => void;
  setShowEditProfileModal: (show: boolean) => void;
  setShowChangePasswordModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  sidebarCollapsed: true,
  secondarySidebarOpen: false,
  selectedLanguage: 'en',
  selectedDepartment: 'revenue',
  loading: false,
  activeSidebarTab: 'layers',
  showSettingsModal: false,
  showHelpModal: false,
  showUserProfileModal: false,
  showEditProfileModal: false,
  showChangePasswordModal: false,
  activeDrawingTool: null,
  selectedLayers: ['cg_state_boundary'],
  expandedNodes: new Set(['boundaries', 'administrative', 'land_records']),
  selectedBasemap: 'osm',
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  toggleSecondarySidebar: () => set((state) => ({ secondarySidebarOpen: !state.secondarySidebarOpen })),
  
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  
  setLoading: (loading) => set({ loading }),
  
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  
  setActiveDrawingTool: (tool) => set({ activeDrawingTool: tool }),
  
  setSelectedLayers: (layers) => set({ selectedLayers: layers }),
  
  toggleLayerSelection: (layerId) => set((state) => {
    const isSelected = state.selectedLayers.includes(layerId);
    const newSelection = isSelected
      ? state.selectedLayers.filter(id => id !== layerId)
      : [...state.selectedLayers, layerId];
    return { selectedLayers: newSelection };
  }),
  
  setExpandedNodes: (nodes) => set({ expandedNodes: nodes }),
  
  toggleNodeExpansion: (nodeId) => set((state) => {
    const newExpanded = new Set(state.expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    return { expandedNodes: newExpanded };
  }),
  
  // Department Actions
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  
  // Basemap Actions
  setSelectedBasemap: (basemap) => set({ selectedBasemap: basemap }),
  
  // Modal Actions
  setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  setShowHelpModal: (show) => set({ showHelpModal: show }),
  setShowUserProfileModal: (show) => set({ showUserProfileModal: show }),
  setShowEditProfileModal: (show) => set({ showEditProfileModal: show }),
  setShowChangePasswordModal: (show) => set({ showChangePasswordModal: show }),
}));