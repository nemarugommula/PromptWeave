
import React, { useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Sidebar from "@/components/Sidebar";
import { useLayout } from "@/contexts/LayoutContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPresentationMode } from '@/hooks/editor/useLayoutTypeGuards';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

const DynamicLayout: React.FC<DynamicLayoutProps> = ({ children }) => {
  const { 
    layoutMode, 
    isSidebarCollapsed, 
    toggleSidebar, 
    setSidebarCollapsed, 
    densityMode, 
    setLayoutMode 
  } = useLayout();

  // Define panel size percentages based on layout mode
  const getSidebarSize = () => {
    if (isSidebarCollapsed) return 0;
    
    switch (layoutMode) {
      case 'explorer': return 35;
      case 'split': return 20;
      case 'focus': return 5;
      case 'presentation': return 0;
      default: return 20;
    }
  };
  
  const getEditorSize = () => {
    return 100 - getSidebarSize();
  };

  // Determine spacing based on density mode
  const getSpacingClass = () => {
    return densityMode === 'compact' ? 'space-y-2' : 'space-y-4';
  };
  
  // Update sidebar collapsed state when layout mode changes
  useEffect(() => {
    if (layoutMode === 'focus') {
      setSidebarCollapsed(false); // Not collapsed but minimized
    } else if (layoutMode === 'presentation') {
      setSidebarCollapsed(true);
    } else if (layoutMode === 'explorer') {
      setSidebarCollapsed(false);
    }
  }, [layoutMode, setSidebarCollapsed]);

  // Exit presentation mode button
  const ExitPresentationButton = () => (
    <Button 
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
      size="sm"
      onClick={() => setLayoutMode('explorer')}
    >
      <X className="h-4 w-4 mr-2" />
      Exit Presentation
    </Button>
  );

  // Check if we're in presentation mode using the type guard
  if (isPresentationMode(layoutMode)) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col">
        <ExitPresentationButton />
        <main className="flex-1 p-0 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-screen flex transition-all duration-300",
      densityMode === 'compact' ? 'compact-mode' : 'comfort-mode',
    )}>
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel 
          defaultSize={getSidebarSize()} 
          minSize={layoutMode === 'focus' ? 5 : 0}
          maxSize={layoutMode === 'focus' ? 5 : 50}
          collapsible={true}
          collapsedSize={0}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
          className={cn(
            `transition-all duration-300 ease-in-out`,
            isSidebarCollapsed ? 'hidden' : 'block',
            layoutMode === 'focus' ? 'sidebar-minimized' : ''
          )}
        >
          <Sidebar />
        </ResizablePanel>
        
        {!isSidebarCollapsed && (
          <ResizableHandle withHandle />
        )}
        
        <ResizablePanel 
          defaultSize={getEditorSize()} 
          minSize={50}
          className="transition-all duration-300 ease-in-out"
        >
          <main className={cn(
            "h-full overflow-y-auto",
            layoutMode === 'presentation' ? 'p-0' : 'p-4',
            getSpacingClass()
          )}>
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DynamicLayout;
