
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ImportIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { importPrompts } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export function ImportDialog({ open, onOpenChange, onImportComplete }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    prompts: number;
    categories: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };
  
  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fileContent = await file.text();
      const result = await importPrompts(fileContent);
      
      setImportResult({
        success: result.prompts > 0,
        prompts: result.prompts,
        categories: result.categories,
        errors: result.errors,
      });
      
      if (result.prompts > 0) {
        toast({
          title: "Import successful",
          description: `Imported ${result.prompts} prompts and ${result.categories} categories`,
        });
        
        // Notify parent component that import is complete
        onImportComplete();
        
        // Close dialog after successful import with a short delay
        if (result.errors.length === 0) {
          setTimeout(() => onOpenChange(false), 1500);
        }
      } else {
        toast({
          title: "Import failed",
          description: "No prompts were imported",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Prompts</DialogTitle>
          <DialogDescription>
            Import your exported prompts from a text file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select file to import</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".txt,.json" 
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Select a text file containing exported prompts
            </p>
          </div>
          
          {importResult && (
            <Alert variant={importResult.success ? "default" : "destructive"}>
              <div className="flex items-start gap-2">
                {importResult.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <div>
                  <AlertTitle>{importResult.success ? "Import successful" : "Import issues"}</AlertTitle>
                  <AlertDescription>
                    {importResult.success && (
                      <p>Successfully imported {importResult.prompts} prompts and {importResult.categories} categories.</p>
                    )}
                    
                    {importResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold">{importResult.errors.length} error(s):</p>
                        <ul className="list-disc pl-5 mt-1 text-sm">
                          {importResult.errors.slice(0, 5).map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                          {importResult.errors.length > 5 && (
                            <li>...and {importResult.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={resetForm} 
            disabled={isLoading || !file}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            onClick={handleImport} 
            disabled={isLoading || !file}
          >
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
