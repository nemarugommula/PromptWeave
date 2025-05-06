import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Code, History, FileText, GitMerge, Github, Twitter } from "lucide-react";
import { useDatabaseInitialization } from "@/hooks/dashboard/useDatabaseInitialization";

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}> = ({ title, description, icon, content }) => (
  <Card className="bg-card shadow-lg border-t-4 border-t-primary">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const { dbInitializing, dbInitialized } = useDatabaseInitialization();

  const featuresData = [
    {
      title: "Powerful Editor",
      description: "Edit massive system prompts with ease",
      icon: <Code className="h-5 w-5" />,
      content:
        "Our specialized editor provides syntax highlighting, folding, and intelligent sectioning tools for even the most complex prompts.",
    },
    {
      title: "Version Control",
      description: "Track changes with built-in versioning",
      icon: <History className="h-5 w-5" />,
      content:
        "Create snapshots of your prompts, compare different versions, and roll back to previous iterations when needed.",
    },
    {
      title: "Visual Analysis",
      description: "Understand complex prompt structures",
      icon: <GitMerge className="h-5 w-5" />,
      content:
        "Visualize your prompts with heat maps, mind maps, and dependency graphs to optimize and refine your AI instructions.",
    },
    {
      title: "Browser-Based",
      description: "Work anywhere with local storage",
      icon: <FileText className="h-5 w-5" />,
      content:
        "PromptWeave runs entirely in your browser with IndexedDB storage, keeping your data private and accessible from any device.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 text-white shadow-md overflow-hidden">
        <div className="whitespace-nowrap animate-marquee font-medium text-sm px-2">
          ✨ PromptWeaver 1.0 is live — Craft the perfect AI prompts with visual
          editing, version control, and more! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ✨ PromptWeaver 1.0 is live — Craft the perfect AI prompts with visual
         
        </div>
      </div>

      <div className="container mx-auto p-4 ">
        <div className="max-w-5xl mx-auto py-8 text-center">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
              PromptWeave
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            The AI-powered prompt editor for crafting perfect system prompts
          </p>
          
          <div className="mb-8 flex justify-center">
            <a 
              href="https://github.com/nemarugommula/PromptWeave" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-muted-foreground/30 bg-background/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:border-primary/50">
                <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">
                  <span className="text-muted-foreground">100% Open Source on </span>
                  <span className="text-primary group-hover:underline">GitHub</span>
                </span>
                <span className="ml-1 text-yellow-500">★</span>
              </div>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" asChild className="gap-2">
              <Link to="/dashboard">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/prompt-weave/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              content={feature.content}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="p-4 rounded-lg bg-muted">
            <p className="mb-2">
              Local database status:{" "}
              <span
                className={`font-medium ${
                  dbInitialized ? "text-green-500" : "text-amber-500"
                }`}
              >
                {dbInitialized
                  ? "Ready"
                  : dbInitializing
                  ? "Initializing..."
                  : "Error"}
              </span>
            </p>
            <Button asChild className="mb-4">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            
            <div className="mt-8 pt-4 border-t border-muted-foreground/20 text-sm text-muted-foreground">
              <a 
                href="https://x.com/Nemarugommulav1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" /> Follow the developer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
