
import React, { createContext, useContext, useState, useEffect } from 'react';

export type LayoutMode = 'focus' | 'split' | 'explorer' | 'presentation';
export type ThemeMode = 'light' | 'dark';
export type DensityMode = 'comfort' | 'compact';
export type ViewMode = 'grid' | 'list' | 'folder';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  densityMode: DensityMode;
  setDensityMode: (mode: DensityMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LAYOUT_STORAGE_KEY = 'promptweave-layout-mode';
export const THEME_STORAGE_KEY = 'promptweave-theme-mode';
export const DENSITY_STORAGE_KEY = 'promptweave-density-mode';
export const VIEW_STORAGE_KEY = 'promptweave-view-mode';

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('explorer'); // Changed default to explorer
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [densityMode, setDensityModeState] = useState<DensityMode>('comfort');
  const [viewMode, setViewModeState] = useState<ViewMode>('grid');

  useEffect(() => {
    // Load saved layout preference from localStorage
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutMode | null;
    if (savedLayout) {
      setLayoutModeState(savedLayout);
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme) {
      setThemeModeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setThemeModeState('dark');
        document.documentElement.classList.add('dark');
      }
    }
    
    // Load saved density preference
    const savedDensity = localStorage.getItem(DENSITY_STORAGE_KEY) as DensityMode | null;
    if (savedDensity) {
      setDensityModeState(savedDensity);
    }
    
    // Load saved view preference
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY) as ViewMode | null;
    if (savedView) {
      setViewModeState(savedView);
    }
    
    // Auto-collapse sidebar based on layout mode
    if (savedLayout === 'focus') {
      setSidebarCollapsed(false); // Not collapsed in focus, but minimized
    } else if (savedLayout === 'presentation') {
      setSidebarCollapsed(true);
    }
  }, []);

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem(LAYOUT_STORAGE_KEY, mode);
    
    // Auto-collapse sidebar in focus and presentation modes
    if (mode === 'presentation') {
      setSidebarCollapsed(true);
    } else if (mode === 'focus') {
      setSidebarCollapsed(false); // Not collapsed but minimized
    } else if (mode === 'explorer') {
      setSidebarCollapsed(false);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    
    // Apply theme
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setDensityMode = (mode: DensityMode) => {
    setDensityModeState(mode);
    localStorage.setItem(DENSITY_STORAGE_KEY, mode);
    
    // Apply density class to body
    if (mode === 'compact') {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{ 
      layoutMode, 
      setLayoutMode, 
      isSidebarCollapsed, 
      setSidebarCollapsed,
      toggleSidebar,
      themeMode,
      setThemeMode,
      densityMode,
      setDensityMode,
      viewMode,
      setViewMode
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
