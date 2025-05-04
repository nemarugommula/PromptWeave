
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLayout } from '@/contexts/LayoutContext';
import { ViewMode } from '@/contexts/LayoutContext';

export const ViewToggle: React.FC = () => {
  const { viewMode, setViewMode } = useLayout();
  
  const handleViewChange = (value: string) => {
    if (value) {
      setViewMode(value as ViewMode);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <ToggleGroup type="single" value={viewMode} onValueChange={handleViewChange}>
        <ToggleGroupItem value="grid" aria-label="Grid View" title="Grid View">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List View" title="List View">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
