import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Diff, Sun, Moon, Save, Play, FileDown, Sparkles, LayersIcon } from "lucide-react";
import HeaderButton from "./HeaderButton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Separator
} from "@/components/ui/separator";

interface HeaderActionsProps {
  onCopy: () => void;
  onNewVersion: () => void;
  toggleTheme: () => void;
  themeMode: string;
  onSave: () => void;
  saving: boolean;
  onExecute: () => void;
  executing: boolean;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  onCopy,
  onNewVersion,
  toggleTheme,
  themeMode,
  onSave,
  saving,
  onExecute,
  executing,
  selectedRole,
  onRoleChange,
  selectedModel,
  onModelChange,
}) => {
  const roles = [
    { value: "system", label: "System" },
    { value: "user", label: "User" },
  ];

  const models = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4.5-preview", label: "GPT-4.5 Preview" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="ml-auto flex items-center">
        {/* Document Actions Group */}
        <div className="hidden sm:flex items-center gap-1 bg-secondary/30 rounded-md p-1 mr-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onSave} 
                disabled={saving} 
                size="icon" 
                variant="ghost"
                className="h-8 w-8"
              >
                <Save className={`h-4 w-4 ${saving ? 'animate-pulse' : ''}`} />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{saving ? "Saving..." : "Save"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewVersion}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <Diff className="h-4 w-4" />
                <span className="sr-only">New Version</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Save New Version</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onCopy}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Copy to Clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Configuration Group */}
        <div className="hidden sm:flex items-center gap-2 mr-2">
          {/* Role Selector with improved styling */}
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="h-8 w-[100px] border-none bg-secondary/30 text-xs font-medium">
              <LayersIcon className="h-3 w-3 mr-1 opacity-70" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Model Selector with improved styling */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="h-8 w-[140px] border-none bg-secondary/30 text-xs font-medium">
              <Sparkles className="h-3 w-3 mr-1 opacity-70" />
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visual Separator */}
        <Separator orientation="vertical" className="hidden sm:block h-6 mx-2" />

        {/* Execute & Theme Group */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleTheme}
                size="icon"
                variant="ghost"
                className="h-8 w-8 hidden sm:flex"
              >
                {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">{themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</p>
            </TooltipContent>
          </Tooltip>

          <Button 
            onClick={onExecute} 
            disabled={executing}
            size="sm"
            variant="default"
            className={`gap-1.5 px-3 ${executing ? 'animate-pulse' : ''}`}
          >
            <Play className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{executing ? "Running..." : "Execute"}</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HeaderActions;
