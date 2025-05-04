
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface HeaderTitleEditorProps {
  name: string;
  onNameChange: (name: string) => void;
}

const HeaderTitleEditor: React.FC<HeaderTitleEditorProps> = ({ name, onNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  return isEditing ? (
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
      className="max-w-md text-sm focus-visible:ring-1 h-8"
    />
  ) : (
    <h1 
      className="text-sm font-medium cursor-pointer hover:text-muted-foreground transition-colors truncate max-w-[120px] sm:max-w-xs" 
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {name || "Untitled Prompt"}
    </h1>
  );
};

export default HeaderTitleEditor;
