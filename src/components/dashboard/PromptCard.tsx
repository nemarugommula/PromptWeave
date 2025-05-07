import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { togglePromptFavorite, togglePromptArchive } from '@/lib/db';
import { cn } from "@/lib/utils";
import { PromptCardContent } from './prompt-card/PromptCardContent';
import { PromptCardFooter } from './prompt-card/PromptCardFooter';
import { motion } from 'framer-motion';
import { Star, Archive, Calendar, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export interface PromptCardProps {
  id: string;
  name: string;
  content: string;
  category_id?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  isArchived?: boolean; // Explicit prop for UI state
  created_at: number;
  updated_at: number;
  categoryName?: string;
  categoryColor?: string;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onArchiveToggle?: (id: string) => void;
  onExport?: (id: string, e: React.MouseEvent) => void;
}

export function PromptCard({
  id,
  name,
  content,
  category_id,
  categoryName,
  categoryColor,
  is_favorite,
  is_archived,
  isArchived, // Use this prop first if available
  created_at,
  updated_at,
  onDelete,
  onClick,
  onFavoriteToggle,
  onArchiveToggle,
  onExport
}: PromptCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use isArchived prop if provided, otherwise use is_archived from the data
  const archived = isArchived !== undefined ? isArchived : is_archived;
  
  // Helper to handle favorite toggle from card UI (for footer buttons)
  const handleCardFavoriteToggle = (id: string, isFavorite: boolean) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(id, isFavorite);
    }
  };
  
  // Helper to handle archive toggle from card UI (for footer buttons)
  const handleCardArchiveToggle = (id: string) => {
    if (onArchiveToggle) {
      onArchiveToggle(id);
    }
  };

  // Function to handle context menu actions
  const handleContextMenuFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(id, !is_favorite);
    }
  };

  const handleContextMenuArchiveToggle = () => {
    if (onArchiveToggle) {
      onArchiveToggle(id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div 
          whileHover={{ 
            y: -4,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
          }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative rounded-lg overflow-hidden"
          )}
        >
          <Card 
            className={cn(
              "overflow-hidden border h-full transition-all duration-200",
              archived && "bg-muted/30 border-dashed",
              isHovered && !archived && "border-primary/50"
            )}
            onClick={() => onClick(id)}
          >
            {/* Favorite indicator */}
            {is_favorite && (
              <div className="absolute top-0 right-0">
                <div className="w-0 h-0 border-t-[24px] border-r-[24px] border-t-amber-500 border-r-transparent transform rotate-90"></div>
                <Star className="absolute top-0.5 right-0.5 h-3 w-3 text-white fill-current" />
              </div>
            )}
            
            <CardContent className="p-0 h-full flex flex-col">
              <PromptCardContent
                name={name}
                content={content}
                categoryName={categoryName}
                categoryColor={categoryColor}
                archived={archived}
              />
              
              <div className="mt-auto">
                <PromptCardFooter
                  id={id}
                  updated_at={updated_at}
                  is_favorite={is_favorite}
                  archived={archived}
                  onDelete={onDelete}
                  onClick={onClick}
                  onFavoriteToggle={handleCardFavoriteToggle}
                  onArchiveToggle={handleCardArchiveToggle}
                  onExport={onExport}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => onClick(id)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={handleContextMenuFavoriteToggle} className="cursor-pointer">
          <Star className="mr-2 h-4 w-4" fill={is_favorite ? "currentColor" : "none"} />
          <span>{is_favorite ? "Remove from Favorites" : "Add to Favorites"}</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={handleContextMenuArchiveToggle} className="cursor-pointer">
          <Archive className="mr-2 h-4 w-4" />
          <span>{archived ? "Unarchive" : "Archive"}</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Prompt Details</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-64">
            <div className="px-2 py-1 text-xs">
              <div className="mb-1">
                <span className="font-medium">Created:</span> {formatDistanceToNow(created_at, { addSuffix: true })}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDistanceToNow(updated_at, { addSuffix: true })}
              </div>
            </div>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        {onExport && (
          <ContextMenuItem 
            onClick={(e: any) => onExport(id, e)}
            className="cursor-pointer"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Export</span>
          </ContextMenuItem>
        )}
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={(e: any) => onDelete(id, e)} 
          className="text-red-600 cursor-pointer focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
