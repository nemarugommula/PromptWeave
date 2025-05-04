import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Diff, Sun, Moon, Save, Play } from "lucide-react";
import HeaderButton from "./HeaderButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="ml-auto flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2">
        <HeaderButton
          icon={<Copy className="h-4 w-4" />}
          label="Copy to Clipboard"
          onClick={onCopy}
        />
        
        <Button 
          onClick={onSave} 
          disabled={saving} 
          size="sm" 
          variant="outline"
          className="gap-1"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
        
        <HeaderButton
          icon={<Diff className="h-4 w-4" />}
          label="Save New Version"
          onClick={onNewVersion}
        />

        <HeaderButton
          icon={themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          label={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          onClick={toggleTheme}
        />

        {/* Role Selector */}
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="h-9 w-[110px]">
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
        
        {/* Model Selector */}
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="h-9 w-[160px]">
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
      
      <Button 
        onClick={onExecute} 
        disabled={executing} 
        size="sm" 
        variant="default"
        className="gap-1 hidden md:flex"
      >
        <Play className="h-4 w-4" />
        {executing ? "Executing..." : "Execute"}
      </Button>
    </div>
  );
};

export default HeaderActions;
