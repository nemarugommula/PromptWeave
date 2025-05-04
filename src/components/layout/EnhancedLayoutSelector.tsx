
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Maximize,
  Columns,
  PanelLeft,
  LayoutPanelTop,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useLayout, LayoutMode, ThemeMode, DensityMode } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export const EnhancedLayoutSelector: React.FC = () => {
  const { 
    layoutMode, setLayoutMode, 
    themeMode, setThemeMode,
    densityMode, setDensityMode 
  } = useLayout();

  const layoutOptions = [
    {
      mode: 'focus' as LayoutMode,
      icon: <Maximize className="h-4 w-4" />,
      label: 'Focus Mode',
      description: 'Editor takes full space, sidebar minimized'
    },
    {
      mode: 'split' as LayoutMode,
      icon: <Columns className="h-4 w-4" />,
      label: 'Split View',
      description: 'Balanced view with sidebar and editor'
    },
    {
      mode: 'explorer' as LayoutMode,
      icon: <PanelLeft className="h-4 w-4" />,
      label: 'Explorer Mode',
      description: 'Expanded sidebar for navigating many prompts'
    },
    {
      mode: 'presentation' as LayoutMode,
      icon: <LayoutPanelTop className="h-4 w-4" />,
      label: 'Presentation',
      description: 'Full-screen editor for presenting'
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-3 bg-card rounded-lg border shadow-sm">
      {/* Layout Mode Selector */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Layout</div>
        <Tabs 
          value={layoutMode} 
          onValueChange={(value) => setLayoutMode(value as LayoutMode)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 h-9">
            {layoutOptions.map((option) => (
              <TabsTrigger 
                key={option.mode} 
                value={option.mode} 
                className="flex items-center gap-2 px-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      {option.icon}
                      <span className="sr-only">{option.label}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between">
        {/* Theme Toggle */}
        <div>
          <div className="text-sm font-medium mb-2">Theme</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              >
                {themeMode === 'light' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {themeMode === 'light' ? 'Light' : 'Dark'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Switch to {themeMode === 'light' ? 'dark' : 'light'} mode</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Density Toggle */}
        <div>
          <div className="text-sm font-medium mb-2">Density</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => setDensityMode(densityMode === 'comfort' ? 'compact' : 'comfort')}
              >
                {densityMode === 'comfort' ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {densityMode === 'comfort' ? 'Comfort' : 'Compact'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Switch to {densityMode === 'comfort' ? 'compact' : 'comfortable'} view</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
