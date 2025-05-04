
import React from 'react';
import CodeEditor from './CodeEditor';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PresentationModeEditorProps {
  content: string;
  onChange: (content: string) => void;
  onExitPresentationMode: () => void;
}

const PresentationModeEditor: React.FC<PresentationModeEditorProps> = ({
  content,
  onChange,
  onExitPresentationMode,
}) => {
  return (
    <div className="h-screen w-full bg-background dark:bg-card/20 text-foreground flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-background/0 to-background/10 dark:from-card/0 dark:to-card/10 z-0"></div>
      
      <Button 
        className="fixed top-4 right-4 z-50 glass-morphism shadow-sm"
        size="sm"
        onClick={onExitPresentationMode}
      >
        <X className="h-4 w-4 mr-2" />
        Exit Presentation
      </Button>
      
      <div className="flex-1 overflow-hidden p-4 relative z-10 max-w-4xl mx-auto w-full">
        <div className="h-full glass-morphism rounded-lg p-4 shadow-md">
          <CodeEditor
            value={content}
            onChange={onChange}
            className="h-full presentation-mode"
          />
        </div>
      </div>
    </div>
  );
};

export default PresentationModeEditor;
