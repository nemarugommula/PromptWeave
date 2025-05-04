import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Save, FileJson } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface ResponseViewerProps {
  response: any;
  onSaveAsPrompt: (content: string) => void;
  onClose: () => void;
  executionDetails?: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  onSaveAsPrompt,
  onClose,
  executionDetails
}) => {
  const responseText = response?.choices?.[0]?.message?.content || "No response content";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard."
    });
  };
  
  const handleSaveAsPrompt = () => {
    onSaveAsPrompt(responseText);
  };
  
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "response.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Response exported",
      description: "The response has been exported as JSON."
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center overflow-auto bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AI Response</CardTitle>
            <div className="flex gap-2">
              {executionDetails && (
                <Badge variant="outline" className="ml-2">
                  {executionDetails.model}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="whitespace-pre-wrap font-serif response-content">
              {responseText}
            </div>
          </ScrollArea>
          
          {executionDetails && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between text-xs text-muted-foreground token-usage">
                <div>Prompt tokens: {executionDetails.promptTokens}</div>
                <div>Completion tokens: {executionDetails.completionTokens}</div>
                <div>Total tokens: {executionDetails.totalTokens}</div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <FileJson className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleSaveAsPrompt} className="gap-2">
              <Save className="h-4 w-4" />
              Save as Prompt
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResponseViewer;
