import React from "react";
import { cn } from "@/lib/utils";

interface HeaderGroupProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

/**
 * HeaderGroup component for grouping related actions in the editor header
 * Provides visual separation between logical groups of controls
 */
const HeaderGroup: React.FC<HeaderGroupProps> = ({ 
  children, 
  className, 
  divider = true 
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        divider && "border-r border-border/40 pr-2 mr-2", 
        className
      )}
    >
      {children}
    </div>
  );
};

export default HeaderGroup;