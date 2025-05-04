import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookmarkCheck, Settings, LucideHome, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsDrawer } from './settings/SettingsDrawer';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const location = useLocation();
  
  // Set active item based on current route
  React.useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      setActiveItem('dashboard');
    } else if (location.pathname.startsWith('/templates')) {
      setActiveItem('templates');
    }
  }, [location.pathname]);

  // Handle item focus
  const handleItemFocus = (item: string) => {
    setActiveItem(item);
  };

  const handleItemBlur = () => {
    // Don't reset active item on blur to maintain selection
  };
  
  return (
    <div 
      className="h-screen flex flex-col border-r bg-background items-center overflow-hidden"
      style={{ width: '4rem' }}
    >
      <div className="p-4 flex items-center justify-center w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/" className="cursor-pointer">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
                PW
              </h3>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">PromptWeave</TooltipContent>
        </Tooltip>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 w-full">
        <div className="p-2 space-y-2">
          {/* Dashboard Link */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center justify-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    (activeItem === 'dashboard' || location.pathname.startsWith('/dashboard')) && "bg-accent text-accent-foreground"
                  )}
                  onFocus={() => handleItemFocus('dashboard')}
                  onBlur={handleItemBlur}
                  onClick={() => handleItemFocus('dashboard')}
                >
                  <LucideHome className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Workspace</TooltipContent>
            </Tooltip>
          </div>
          
          {/* Templates Link */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/templates"
                  className={cn(
                    "flex items-center justify-center p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    (activeItem === 'templates' || location.pathname.startsWith('/templates')) && "bg-accent text-accent-foreground"
                  )}
                  onFocus={() => handleItemFocus('templates')}
                  onBlur={handleItemBlur}
                  onClick={() => handleItemFocus('templates')}
                >
                  <FileText className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Templates</TooltipContent>
            </Tooltip>
          </div>
          
          {/* Settings item */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "flex items-center justify-center rounded-md transition-colors",
                    activeItem === 'settings' && "bg-accent text-accent-foreground"
                  )}
                >
                  <SettingsDrawer />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 mt-auto w-full flex flex-col items-center">
        <Separator className="w-full mb-4" />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs text-muted-foreground text-center w-full flex justify-center">
              v1
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">PromptWeave v1.0</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;
