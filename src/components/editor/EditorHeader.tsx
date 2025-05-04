
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import HeaderTitleEditor from "./header/HeaderTitleEditor";
import HeaderActions from "./header/HeaderActions";
import HeaderMobileMenu from "./header/HeaderMobileMenu";

interface EditorHeaderProps {
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCopy: () => void;
  onNewVersion: () => void;
  saving: boolean;
  toggleTheme: () => void;
  themeMode: string;
  onExecute?: () => void;
  executing?: boolean;
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  name, 
  onNameChange, 
  onSave, 
  onCopy,
  onNewVersion,
  saving,
  toggleTheme,
  themeMode,
  onExecute,
  executing,
  selectedRole,
  onRoleChange,
  selectedModel,
  onModelChange
}) => {
  return (
    <div className="editor-header sticky top-0 z-50 flex items-center px-4 shadow-sm dark:shadow-dark-elevation bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Back to Dashboard
          </TooltipContent>
        </Tooltip>
        
        <HeaderTitleEditor name={name} onNameChange={onNameChange} />
      </div>
      
      {/* Desktop Actions */}
      <HeaderActions 
        onCopy={onCopy}
        onNewVersion={onNewVersion}
        toggleTheme={toggleTheme}
        themeMode={themeMode}
        onSave={onSave}
        saving={saving}
        onExecute={onExecute}
        executing={executing}
        selectedRole={selectedRole}
        onRoleChange={onRoleChange}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
      
      {/* Mobile Menu */}
      <div className="md:hidden">
        <HeaderMobileMenu 
          onCopy={onCopy}
          onNewVersion={onNewVersion}
          onSave={onSave}
          saving={saving}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          onExecute={onExecute}
          executing={executing}
          selectedRole={selectedRole}
          onRoleChange={onRoleChange}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>
    </div>
  );
};

export default EditorHeader;
