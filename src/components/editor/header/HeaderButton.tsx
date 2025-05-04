
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger
} from "@/components/ui/tooltip";

interface HeaderButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = "ghost",
  size = "icon",
  className = "h-8 w-8",
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} variant={variant} size={size} className={className} disabled={disabled}>
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default HeaderButton;
