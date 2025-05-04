import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDatabaseInitialization } from "@/hooks/dashboard/useDatabaseInitialization";
import { DatabaseLoadingState } from "@/components/dashboard/DatabaseLoadingState";
import { DatabaseErrorState } from "@/components/dashboard/DatabaseErrorState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TemplatesConfig from "./pages/TemplatesConfig";
const EditorPage = React.lazy(() => import("./pages/EditorPage"));
import NotFound from "./pages/NotFound";
import { LayoutProvider } from "./contexts/LayoutContext";

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Global database initialization
  const { dbInitializing, dbError, retryInitialization } = useDatabaseInitialization();
  if (dbInitializing) {
    return <DatabaseLoadingState />;
  }
  if (dbError) {
    return <DatabaseErrorState error={dbError} onRetry={retryInitialization} />;
  }
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/templates" element={<TemplatesConfig />} />
                <Route
                  path="/editor/:id"
                  element={
                    <Suspense fallback={<div className="p-4">Loading editor...</div>}>
                      <EditorPage />
                    </Suspense>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LayoutProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
