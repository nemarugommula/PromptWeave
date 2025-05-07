import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Import, ExternalLink, FileText, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useLayout } from "@/contexts/LayoutContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  onCreatePrompt: (categoryId?: string) => Promise<string | null>;
  onImportDialogOpen: () => void;
  onExportAll: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onCreatePrompt,
  onImportDialogOpen,
  onExportAll,
}) => {
  const { densityMode } = useLayout();

  // Staggered animation for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      {/* Top row with title and primary actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2"
        >
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workspace</h1>
            <p className="text-muted-foreground text-sm hidden sm:block">
              Manage and organize your prompts
            </p>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants} 
          className="flex gap-2"
        >
          {/* Actions on desktop */}
          <div className="hidden md:flex gap-2">
            {/* Import Button */}
            <Button 
              variant="outline" 
              onClick={onImportDialogOpen} 
              className="gap-2"
            >
              <Import className="h-4 w-4" /> Import
            </Button>
            
            {/* Export All Button */}
            <Button 
              variant="outline" 
              onClick={onExportAll} 
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" /> Export All
            </Button>
            
            {/* Create Button */}
            <Button onClick={() => onCreatePrompt()} className="gap-2">
              <Plus className="h-4 w-4" /> Create
            </Button>
          </div>
          
          {/* Actions on mobile - dropdown menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> 
                  <span>Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCreatePrompt()}>
                  <Plus className="h-4 w-4 mr-2" /> Create New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImportDialogOpen}>
                  <Import className="h-4 w-4 mr-2" /> Import
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onExportAll}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Export All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp }) => {
  return (
    <div className="bg-background border rounded-lg p-4 flex flex-col">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="flex items-end justify-between mt-1">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <div className={`text-xs px-1.5 py-1 rounded flex items-center ${
            trendUp === null 
              ? "bg-muted text-muted-foreground" 
              : trendUp 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};
