
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';

interface DatabaseErrorStateProps {
  error: Error | null;
  onRetry: () => Promise<void>;
}

export const DatabaseErrorState: React.FC<DatabaseErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Your Prompts</h1>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Error</AlertTitle>
        <AlertDescription>
          <p>There was a problem initializing the database. This might be due to browser storage limitations or permissions.</p>
          {error && (
            <p className="mt-2 text-sm opacity-80">{error.message}</p>
          )}
        </AlertDescription>
      </Alert>
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <p className="text-muted-foreground">
          Try these steps to resolve the issue:
        </p>
        <ul className="list-disc text-sm text-muted-foreground mb-6 pl-5">
          <li>Make sure your browser supports IndexedDB</li>
          <li>Check that you haven't disabled storage for this site</li>
          <li>Try clearing your browser cache</li>
          <li>If using private/incognito mode, try regular browsing mode</li>
        </ul>
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry Database Initialization
        </Button>
      </div>
    </div>
  );
};
