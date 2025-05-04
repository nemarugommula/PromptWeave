import { Moon, Sun, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLayout } from '@/contexts/LayoutContext';

export function AppearanceSettings() {
  const { themeMode, setThemeMode, densityMode, setDensityMode } = useLayout();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how PromptWeave looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <div className="flex gap-4">
            <Button
              variant={themeMode === 'light' ? "default" : "outline"}
              className="flex-1 justify-start gap-2"
              onClick={() => setThemeMode('light')}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </Button>
            <Button
              variant={themeMode === 'dark' ? "default" : "outline"}
              className="flex-1 justify-start gap-2"
              onClick={() => setThemeMode('dark')}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Density</Label>
          <div className="flex gap-4">
            <Button
              variant={densityMode === 'comfort' ? "default" : "outline"}
              className="flex-1 justify-start gap-2"
              onClick={() => setDensityMode('comfort')}
            >
              <Maximize2 className="h-4 w-4" />
              <span>Comfort</span>
            </Button>
            <Button
              variant={densityMode === 'compact' ? "default" : "outline"}
              className="flex-1 justify-start gap-2"
              onClick={() => setDensityMode('compact')}
            >
              <Minimize2 className="h-4 w-4" />
              <span>Compact</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}