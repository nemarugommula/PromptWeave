import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeaderButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
  active?: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = "ghost",
  size = "icon",
  className = "",
  showLabel = false,
  active = false,
  tooltipSide = "bottom",
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button 
              onClick={onClick} 
              variant={active ? "default" : variant} 
              size={size} 
              className={cn(
                "h-7 w-7 rounded-md transition-all",
                active && "bg-primary text-primary-foreground hover:bg-primary/80",
                showLabel && "flex items-center gap-1.5 w-auto px-2",
                className
              )} 
              disabled={disabled}
            >
              {icon}
              {showLabel && <span className="text-xs font-medium">{label}</span>}
              {!showLabel && <span className="sr-only">{label}</span>}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeaderButton;
