import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookmarkCheck, 
  Settings, 
  Home as HomeIcon,
  FileText, 
  ChevronLeft,
  ChevronRight,
  Keyboard
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsDrawer } from './settings/SettingsDrawer';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useLayout } from '@/contexts/LayoutContext';
import { motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';

// Brand logo SVG component
const BrandLogoSVG = () => (
  <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
        <stop offset="50%" stopColor="#8b5cf6" /> {/* Violet */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
      </linearGradient>
    </defs>
    <style>
      {`.line { stroke: url(#aiGradient); stroke-width: 12; stroke-linecap: round; }
      .bg { fill: currentColor; opacity: 0.1; }`}
    </style>
    <rect className="bg" width="200" height="200" rx="20"/>
    {/* Diagonal lines */}
    <line className="line" x1="40" y1="160" x2="160" y2="40"/>
    <line className="line" x1="60" y1="160" x2="160" y2="60"/>
    <line className="line" x1="40" y1="40" x2="160" y2="160"/>
    <line className="line" x1="60" y1="40" x2="160" y2="140"/>
  </svg>
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
  shortcut?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  onClick, 
  collapsed,
  shortcut
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className={cn(
            "flex items-center rounded-md transition-all duration-200 ease-in-out",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
            collapsed ? "justify-center p-3" : "p-3 px-4",
            isActive && "bg-accent text-accent-foreground"
          )}
          onClick={onClick}
          aria-current={isActive ? 'page' : undefined}
        >
          <div className={cn("flex items-center", !collapsed && "w-full")}>
            <span className="flex-shrink-0">{icon}</span>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 text-sm font-medium flex-grow"
              >
                {label}
              </motion.span>
            )}
            {!collapsed && shortcut && (
              <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-xs font-medium text-muted-foreground opacity-70">
                {shortcut}
              </kbd>
            )}
          </div>
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
};

export function Sidebar() {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useLayout();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  // Set active item based on current route
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      setActiveItem('dashboard');
    } else if (location.pathname.startsWith('/templates')) {
      setActiveItem('templates');
    }
  }, [location.pathname]);

  // Handle keyboard shortcuts
  useHotkeys('alt+s', () => toggleSidebar(), [toggleSidebar]);
  useHotkeys('alt+d', () => handleItemClick('dashboard'), []);
  useHotkeys('alt+t', () => handleItemClick('templates'), []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '64px' }
  };
  
  return (
    <motion.div 
      className="h-screen flex flex-col border-r bg-background overflow-hidden relative"
      variants={sidebarVariants}
      initial={isSidebarCollapsed ? "collapsed" : "expanded"}
      animate={isSidebarCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className={cn(
        "p-4 flex items-center w-full", 
        isSidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/" className="cursor-pointer flex items-center">
              {isSidebarCollapsed ? (
                <BrandLogoSVG />
              ) : (
                <React.Fragment>
                  <BrandLogoSVG />
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text"
                  >
                    PromptWeave
                  </motion.span>
                </React.Fragment>
              )}
            </Link>
          </TooltipTrigger>
          {isSidebarCollapsed && <TooltipContent side="right">PromptWeave</TooltipContent>}
        </Tooltip>
        
        {!isSidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ml-2 flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 w-full">
        <nav className="py-4 pr-1 pl-1 space-y-1">
          {/* Dashboard/Workspace Link */}
          <NavItem
            to="/dashboard"
            icon={<HomeIcon className="h-5 w-5" />}
            label="Workspace"
            isActive={activeItem === 'dashboard' || location.pathname.startsWith('/dashboard')}
            onClick={() => handleItemClick('dashboard')}
            collapsed={isSidebarCollapsed}
            shortcut="Alt+D"
          />
          
          {/* Templates Link */}
          <NavItem
            to="/templates"
            icon={<FileText className="h-5 w-5" />}
            label="Templates"
            isActive={activeItem === 'templates' || location.pathname.startsWith('/templates')}
            onClick={() => handleItemClick('templates')}
            collapsed={isSidebarCollapsed}
            shortcut="Alt+T"
          />
          
          {/* Additional item template for future expansion */}
          {/* 
          <NavItem
            to="/path"
            icon={<Icon className="h-5 w-5" />}
            label="Label"
            isActive={activeItem === 'item'}
            onClick={() => handleItemClick('item')}
            collapsed={isSidebarCollapsed}
            shortcut="Alt+X"
          />
          */}
        </nav>
      </ScrollArea>
      
      {/* Footer section */}
      <div className="p-2 mt-auto w-full">
        {/* Version indicator */}
        <div className={cn("p-2", isSidebarCollapsed ? "text-center" : "flex justify-between items-center")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-muted-foreground">
                v1.0
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">PromptWeave v1.0</TooltipContent>
          </Tooltip>
        </div>
        
        <Separator className="my-2" />
        
        {/* Settings at the bottom */}
        <div className={cn(
          "flex rounded-md transition-colors",
          !isSidebarCollapsed && "px-1",
          activeItem === 'settings' && "bg-accent text-accent-foreground"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center", 
                isSidebarCollapsed ? "justify-center p-3 w-full" : "p-3 px-3 w-full"
              )}>
                <Settings className="h-5 w-5" />
                
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 text-sm font-medium"
                  >
                    Settings
                  </motion.span>
                )}
                
                <SettingsDrawer />
              </div>
            </TooltipTrigger>
            {isSidebarCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </div>
      </div>
      
      {/* Expand button when collapsed */}
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-11 bg-background hover:bg-accent rounded-full p-1.5 border shadow-sm transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export default Sidebar;
