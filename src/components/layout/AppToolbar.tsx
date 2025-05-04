
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useLayout } from '@/contexts/LayoutContext';
import { EnhancedLayoutSelector } from './EnhancedLayoutSelector';

export const AppToolbar: React.FC = () => {
  const { layoutMode, themeMode, densityMode } = useLayout();

  return (
    <div className="flex items-center justify-between border-b p-2 bg-background">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center gap-2">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">PromptWeave</h2>
        </Link>
      </div>
      
      <div className="flex items-center">
        <LayoutOptionsMenu />
      </div>
    </div>
  );
};

// Separated the layout options menu into its own component
const LayoutOptionsMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Settings className="h-4 w-4 mr-2" />
          Layout Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <div className="p-2">
          <EnhancedLayoutSelector />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
