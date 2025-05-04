
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutPanelLeft, Columns, PanelLeft, Maximize } from 'lucide-react';
import { useLayout, LayoutMode } from '@/contexts/LayoutContext';

export const LayoutSelector: React.FC = () => {
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
      icon: <LayoutPanelLeft className="h-4 w-4" />,
      label: 'Explorer Mode',
      description: 'Expanded sidebar for navigating many prompts'
    },
    {
      mode: 'presentation' as LayoutMode,
      icon: <PanelLeft className="h-4 w-4" />,
      label: 'Presentation Mode',
      description: 'Full-screen editor for presenting'
    }
  ];

  return (
    <ToggleGroup
      type="single"
      value={layoutMode}
      onValueChange={(value) => {
        if (value) setLayoutMode(value as LayoutMode);
      }}
      className="flex"
    >
      {layouts.map((layout) => (
        <Tooltip key={layout.mode}>
          <TooltipTrigger asChild>
            <ToggleGroupItem 
              value={layout.mode} 
              aria-label={layout.label}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {layout.icon}
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{layout.label}</p>
            <p className="text-xs text-muted-foreground">{layout.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
};
