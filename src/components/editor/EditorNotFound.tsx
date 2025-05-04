
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditorNotFoundProps {
  errorMessage: string | null;
}

const EditorNotFound: React.FC<EditorNotFoundProps> = ({ errorMessage }) => {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Prompt Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            {errorMessage || "The prompt you're looking for doesn't exist or has been deleted."}
          </p>
          <Link to="/dashboard">
            <Button className="min-w-[160px]">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorNotFound;
