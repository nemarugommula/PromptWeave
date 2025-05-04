
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EditorErrorProps {
  error: Error;
  onRetry: () => Promise<void> | void;
  message?: string;
}

const EditorError: React.FC<EditorErrorProps> = ({ error, onRetry, message }) => {
  const handleRetry = async () => {
    try {
      await onRetry();
    } catch (error) {
      console.error("Error retrying operation:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {message || "We encountered an error while loading the editor."}
            </p>
          </div>

          <Alert variant="destructive" className="mb-6">
            <AlertTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Error Details
            </AlertTitle>
            <AlertDescription>
              <p className="font-mono text-sm break-all">{error.message}</p>
              <p className="mt-2 text-sm opacity-80">
                This might be due to database connection issues or the prompt may no longer exist.
              </p>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleRetry} className="gap-2 w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/dashboard" className="gap-2 inline-flex items-center justify-center">
                <Home className="h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorError;
