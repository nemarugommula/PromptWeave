import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderTitleEditorProps {
  name: string;
  onNameChange: (name: string) => void;
  onSave?: () => void;
  className?: string;
}

const HeaderTitleEditor: React.FC<HeaderTitleEditorProps> = ({ 
  name, 
  onNameChange, 
  onSave,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditComplete = () => {
    setIsEditing(false);
    
    // Auto-save when editing is complete
    if (onSave) {
      onSave();
    }
  };

  return (
    <div 
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={handleEditComplete}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditComplete();
                }
              }}
              className="text-sm focus-visible:ring-1 h-7 w-[170px] md:w-[280px] font-medium"
              placeholder="Untitled Prompt"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="title"
            className="flex items-center group cursor-pointer"
            onClick={() => setIsEditing(true)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <h1 
              className="text-sm font-medium truncate max-w-[140px] sm:max-w-[220px] md:max-w-[300px]" 
              title="Click to edit"
            >
              {name || "Untitled Prompt"}
            </h1>
            
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="ml-2 text-muted-foreground"
                >
                  <Pencil className="h-3 w-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderTitleEditor;
