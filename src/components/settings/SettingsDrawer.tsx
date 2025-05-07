import { 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Key } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { AppearanceSettings } from './AppearanceSettings';

export function SettingsDrawer() {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Configure your PromptWeave experience
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="appearance" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Key</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="appearance" className="pt-4">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="api" className="pt-4">
          <ApiKeySettings />
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6">
        <Button>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}
