
import React from 'react';
import { 
  Maximize,
  Columns,
  PanelLeft,
  LayoutPanelTop,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLayout, LayoutMode } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const LayoutDropdown: React.FC = () => {
  const { layoutMode, setLayoutMode } = useLayout();

  const layouts = [
    {
      mode: 'focus' as LayoutMode,
      icon: <Maximize className="h-4 w-4" />,
      label: 'Focus Mode',
      description: 'Editor takes full space, sidebar minimized'
    },
    {
      mode: 'split' as LayoutMode,
      icon: <Columns className="h-4 w-4" />,
      label: 'Split Mode',
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
      label: 'Presentation Mode',
      description: 'Full-screen editor for presenting'
    }
  ];

  // Find the current layout information
  const currentLayout = layouts.find(l => l.mode === layoutMode) || layouts[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-8">
          {currentLayout.icon}
          <span className="hidden sm:inline-block">{currentLayout.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Layout Mode</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={layoutMode} onValueChange={(value) => setLayoutMode(value as LayoutMode)}>
          {layouts.map((layout) => (
            <DropdownMenuRadioItem 
              key={layout.mode} 
              value={layout.mode}
              className="flex items-center gap-2 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {layout.icon}
                <div>
                  <p className="font-medium">{layout.label}</p>
                  <p className="text-xs text-muted-foreground">{layout.description}</p>
                </div>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
