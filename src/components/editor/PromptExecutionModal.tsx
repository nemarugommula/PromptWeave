
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onExecute: (userQuery: string) => void;
  isLoading: boolean;
}

const PromptExecutionModal: React.FC<PromptExecutionModalProps> = ({
  isOpen,
  onClose,
  systemPrompt,
  onExecute,
  isLoading
}) => {
  const [userQuery, setUserQuery] = useState('');

  const handleExecute = () => {
    onExecute(userQuery);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Execute System Prompt</DialogTitle>
          <DialogDescription>
            Enter a user query to execute along with your system prompt. This is optional but recommended for testing your system prompt.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="system-prompt">System Prompt:</Label>
            <div className="bg-secondary/20 p-3 rounded-md text-sm max-h-[150px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs">{systemPrompt}</pre>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="user-query">User Query (Optional):</Label>
            <Textarea
              id="user-query"
              placeholder="Enter a user query to test your system prompt..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleExecute} disabled={isLoading}>
            {isLoading ? "Executing..." : "Execute"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptExecutionModal;
