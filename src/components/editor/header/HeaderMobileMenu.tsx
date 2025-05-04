import React from "react";
import { Menu, Copy, Diff, Sun, Moon, Save, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderMobileMenuProps {
  onCopy: () => void;
  onNewVersion: () => void;
  onSave: () => void;
  saving: boolean;
  themeMode: string;
  toggleTheme: () => void;
  onExecute: () => void;
  executing: boolean;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  onCopy,
  onNewVersion,
  onSave,
  saving,
  themeMode,
  toggleTheme,
  onExecute,
  executing,
  selectedRole,
  onRoleChange,
  selectedModel,
  onModelChange
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Editor Actions</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="font-normal">Role</DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="h-9 w-full">
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
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="font-normal">Model</DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="h-9 w-full">
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
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onExecute} disabled={executing}>
          <Play className="h-4 w-4 mr-2" />
          {executing ? "Executing..." : "Execute Prompt"}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNewVersion}>
          <Diff className="h-4 w-4 mr-2" />
          Save New Version
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={toggleTheme}>
          {themeMode === 'light' ? (
            <>
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 mr-2" />
              Light Mode
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMobileMenu;
