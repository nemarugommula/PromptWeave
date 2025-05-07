import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Code, 
  History, 
  FileText, 
  GitMerge, 
  Github, 
  Twitter, 
  Star, 
  ArrowDownToLine, 
  Rocket, 
  Layers, 
  Sparkles,
  Globe,
  Shield,
  Eye,
  ExternalLink,
  ChevronRight,
  Users,
  CloudCog,
  LineChart
} from "lucide-react";
import { useDatabaseInitialization } from "@/hooks/dashboard/useDatabaseInitialization";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for scroll reveal
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1
    }
  }
};

const ScaleInOut = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1]
    } 
  }
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1]
    } 
  }
};

// Intersection Observer Hook for animations
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return { ref, isInView };
};

// Custom scroll-linked parallax effect hook
const useParallax = (value: any, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, content, index }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      custom={index}
    >
      <Card className="h-full transition-all duration-500 hover:shadow-xl border-t-4 border-t-primary/80 overflow-hidden group hover:-translate-y-1">
        <CardHeader className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-indigo-400/10 transition-all duration-700"
          />
          <CardTitle className="flex items-center gap-2 z-10">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ScreenshotProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}

const Screenshot: React.FC<ScreenshotProps> = ({ src, alt, className, delay = 0 }) => {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useParallax(scrollYProgress, 30);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const imgSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const scaleSpring = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative", className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={ScaleInOut}
      transition={{ delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-500/20 rounded-xl blur-xl" />
      <div ref={ref} className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 dark:border-black/20 h-full transform-gpu">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-80"
          style={{ 
            scaleY: scaleSpring,
            scaleX: scaleSpring,
          }}
        />
        <motion.img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain bg-card" /* Changed object-cover to object-contain to prevent cropping */
          style={{ 
            y: imgSpring,
            scale: scaleSpring
          }}
        />
        
        {/* Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 dark:to-white/5 pointer-events-none" />
        
        {/* Screen glare effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 pointer-events-none"
          initial={{ opacity: 0, left: "-100%" }}
          animate={{ opacity: [0, 0.5, 0], left: ["0%", "100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 8 }}
        />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 shadow-inner pointer-events-none border border-white/20 dark:border-white/5 rounded-xl" />
      </div>
    </motion.div>
  );
};

const MarqueeAnnouncement = () => (
  <div className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 text-white shadow-md overflow-hidden py-2">
    <div className="whitespace-nowrap animate-marquee text-sm px-4 flex items-center justify-center">
      <Sparkles className="h-4 w-4 mr-2 inline-block animate-pulse" />
      <span>PromptWeaver 1.0 is live — Craft the perfect AI prompts with visual editing, version control, and more!</span>
      <span className="mx-12">•</span>
      <Sparkles className="h-4 w-4 mr-2 inline-block animate-pulse" />
      <span>100% client-side with zero server storage - Your data stays with you</span>
      <span className="mx-12">•</span>
      <Sparkles className="h-4 w-4 mr-2 inline-block animate-pulse" />
      <span>PromptWeaver 1.0 is live — Craft the perfect AI prompts with visual editing, version control, and more!</span>
    </div>
  </div>
);

interface ScreenshotData {
  image: string;
  title: string;
  description: string;
}

interface ScreenshotsDataMap {
  [key: string]: ScreenshotData;
}

interface StatisticProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const Statistic: React.FC<StatisticProps> = ({ value, label, icon }) => {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });
  
  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-2 p-3 rounded-full bg-primary/20 text-primary">
        {icon}
      </div>
      <motion.p 
        className="text-3xl md:text-4xl font-bold"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {value}
      </motion.p>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

const BrandLogo = () => (
  <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
        <stop offset="50%" stopColor="#8b5cf6" /> {/* Violet */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
      </linearGradient>
    </defs>
    <style>
      {`.line { stroke: url(#aiGradient); stroke-width: 12; stroke-linecap: round; }
      .bg { fill: currentColor; opacity: 0.1; }`}
    </style>
    <rect className="bg" width="200" height="200" rx="20"/>
    {/* Diagonal lines */}
    <line className="line" x1="40" y1="160" x2="160" y2="40"/>
    <line className="line" x1="60" y1="160" x2="160" y2="60"/>
    <line className="line" x1="40" y1="40" x2="160" y2="160"/>
    <line className="line" x1="60" y1="40" x2="160" y2="140"/>
  </svg>
);

const Index = () => {
  const { dbInitializing, dbInitialized } = useDatabaseInitialization();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
        "Create snapshots of your prompts, compare different versions side-by-side with diff view, and roll back to previous iterations when needed.",
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
      icon: <Globe className="h-5 w-5" />,
      content:
        "PromptWeave runs entirely in your browser with IndexedDB storage, keeping your data private and accessible from any device.",
    },
    {
      title: "Data Privacy",
      description: "Your data never leaves your device",
      icon: <Shield className="h-5 w-5" />,
      content:
        "All data is stored locally in your browser's IndexedDB. Your prompts and API keys never touch our servers.",
    },
    {
      title: "Prompt Templates",
      description: "Jumpstart your prompt engineering",
      icon: <Layers className="h-5 w-5" />,
      content:
        "Access common paradigms like CoT, ReAct, and more. Save time with reusable snippets and custom formatters.",
    },
  ];

  // Mapping of tabs to screenshots
  const screenshotsData: ScreenshotsDataMap = {
    dashboard: {
      image: "/dashboard_page.png",
      title: "Organize Your Prompts",
      description: "Manage your prompt collection with custom categories, search, filtering, and multiple view options."
    },
    editor: {
      image: "/editor_page_with_prompt_entered.png",
      title: "Craft Perfect Prompts",
      description: "Write and edit prompts with our specialized editor featuring syntax highlighting and markdown support."
    },
    versions: {
      image: "/editor_page_with_comparing_two_prompt_versions.png",
      title: "Track All Changes",
      description: "Compare different versions side-by-side to see what's changed and roll back when needed."
    },
    execution: {
      image: "/editor_page_executing_system_prompt_model.png",
      title: "Test Your Prompts",
      description: "Execute prompts directly with OpenAI models and analyze the responses."
    },
    templates: {
      image: "/snippets_formatters_configuration_page.png",
      title: "Create Templates & Snippets",
      description: "Define custom formatting tools and reusable prompt patterns to speed up your workflow."
    }
  };

  const { ref: heroRef, isInView: heroInView } = useInView({ triggerOnce: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden relative">
      {/* Progress bar at top of the page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" 
        style={{ scaleX }} 
      />

      <MarqueeAnnouncement />

      {/* Hero Section with Animated Elements */}
      <motion.div 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="container max-w-6xl mx-auto px-4 py-12 md:py-24 lg:py-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div variants={slideFromLeft} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="flex items-center mb-3"
            >
              <div className="mr-3">
                <BrandLogo />
              </div>
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
                PromptWeave
              </span>
            </motion.div>

      

            <div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                >
                  Craft Perfect <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">AI Prompts</span> with Precision
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-[600px] text-lg md:text-xl text-muted-foreground"
                >
                  An advanced editor for AI practitioners with version control, visual analysis, and intelligent tools for building robust system prompts.
                </motion.p>
              </div>
              
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button size="lg" asChild className="gap-2 group text-base h-12">
                <Link to="/dashboard">
                Launch App <Rocket className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 text-base h-12">
                <a
                  href="https://github.com/nemarugommula/PromptWeave/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the Docs <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp} 
              className="flex items-center gap-2 text-muted-foreground text-sm pt-2"
            >
              <Shield className="h-4 w-4" />
              <span>100% private - all data stored locally on your device</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={slideFromRight}
            className="relative hidden lg:block perspective-1000"
          >
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 0.7, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -right-12 -bottom-12 w-52 h-52 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 0.7, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute -left-12 -top-12 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl"
            />
            
            {/* Main hero image with 3D effect */}
            <div className="relative z-10 perspective-1000">
              <motion.div 
                initial={{ 
                  rotateX: -10, 
                  rotateY: 15, 
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{ 
                  rotateX: 0, 
                  rotateY: 0, 
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
                whileHover={{ 
                  rotateY: 5, 
                  rotateX: -3,
                  scale: 1.03,
                  transition: { duration: 0.5 }
                }}
                className="transform-gpu will-change-transform"
              >
                <div className="rounded-xl overflow-hidden border-8 border-card shadow-2xl">
                  <img 
                    src="/editor_page_with_prompt_entered.png" 
                    alt="PromptWeave Editor" 
                    className="w-full h-auto rounded-sm" 
                  />
                </div>
                
                {/* Shadow below the image */}
                <div className="absolute -bottom-10 inset-x-0 h-20 bg-gradient-to-t from-primary/10 to-transparent blur-xl rounded-full mx-auto w-4/5" />
              </motion.div>
              
              {/* Floating UI elements */}
              <motion.div 
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: -70, y: 55 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="absolute -left-5 top-1/4 z-20"
              >
                <div className="bg-card px-4 py-3 rounded-lg shadow-xl border border-border/50 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Effective Prompt Writing Tools</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 40, y: -20 }}
                animate={{ opacity: 1, x: 60, y: -60 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="absolute -right-5 top-1/4 z-20"
              >
                <div className="bg-card px-4 py-3 rounded-lg shadow-xl border border-border/50 flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Prompt Analysis</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Interactive Feature Showcase */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="text-center mb-16 md:mb-24"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Meet the{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
              Future
            </span>{" "}
            of Prompt Engineering
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore how PromptWeave transforms the way you create, manage, and optimize your AI prompts
          </motion.p>
        </motion.div>

        <div className="mb-16 md:mb-32">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-12">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="execution">Execution</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {Object.entries(screenshotsData).map(([key, data]) => (
                  activeTab === key && (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-4 order-2 lg:order-1 px-4">
                          <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-4"
                          >
                            <motion.h3 
                              variants={fadeInUp}
                              className="text-2xl md:text-3xl font-bold"
                            >
                              {data.title}
                            </motion.h3>
                            <motion.p 
                              variants={fadeInUp}
                              className="text-muted-foreground text-lg"
                            >
                              {data.description}
                            </motion.p>
                            <motion.div variants={fadeInUp}>
                              <Button size="lg" asChild className="mt-6 gap-1 group">
                                <Link to="/dashboard">
                                  Try it now <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                        <div className="lg:col-span-8 order-1 lg:order-2 p-4 md:p-8">
                          <Screenshot 
                            src={data.image} 
                            alt={data.title}
                            className="w-full aspect-[16/9] px-0 md:px-4" /* Changed aspect ratio and added padding */
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
                Perfect Prompts
              </span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Powerful tools to help you create, manage and optimize your AI prompts
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                content={feature.content}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Apple-style scrolling showcase */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text">
                Enterprise-Grade
              </span>{" "}
              Technology
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Built by engineers for engineers, with cutting-edge features
            </motion.p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="relative h-[500px] md:h-[700px]">
              {/* Pinned scrolling sections - Apple style */}
              <motion.div className="sticky top-1/3 h-[500px] perspective-1000">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold">Powerful Editing Tools</h3>
                      <p className="text-muted-foreground text-lg">
                        Our specialized editor provides syntax highlighting, folding, and intelligent sectioning tools for even the most complex prompts.
                      </p>
                      <div className="flex items-center gap-2 text-primary">
                        <LineChart className="h-5 w-5" />
                        <span className="font-medium">Drive better results with better prompts</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <Screenshot 
                    src="/editor_page_with_prompt_entered.png" 
                    alt="PromptWeave Editor"
                    className="w-full px-4" 
                    delay={0.3}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-indigo-400/20 rounded-3xl blur-xl"></div>
            <motion.div 
              variants={ScaleInOut}
              className="relative bg-card rounded-3xl p-8 md:p-12 border shadow-lg"
            >
              <div className="flex flex-col items-center space-y-6 md:space-y-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100, 
                    delay: 0.1,
                    duration: 0.8
                  }}
                >
                  <div className="flex flex-col items-center">
                    <BrandLogo />
                    <h3 className="mt-3 text-xl bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 text-transparent bg-clip-text font-bold">
                      PromptWeave
                    </h3>
                  </div>
                </motion.div>
                
                <motion.h2 
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold"
                >
                  Ready to Start Crafting?
                </motion.h2>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-xl text-muted-foreground max-w-2xl"
                >
                  Join engineers and AI enthusiasts who are creating better prompts with PromptWeave
                </motion.p>
                
                <motion.div 
                  variants={fadeInUp}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mt-4"
                >
                  <Button size="lg" asChild className="gap-2 h-12 text-base">
                    <Link to="/dashboard">
                      Launch App <Rocket className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="gap-2 h-12 text-base">
                    <a
                      href="https://github.com/nemarugommula/PromptWeave"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Star on GitHub <Star className="h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUp}
                  className="pt-8 border-t border-muted-foreground/10 w-full text-sm text-muted-foreground"
                >
                  <p className="mb-3">
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
                  
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                    <a 
                      href="https://x.com/Nemarugommulav1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" /> @Nemarugommulav1
                    </a>
                    <span className="text-muted-foreground/50 hidden sm:inline">•</span>
                    <a 
                      href="https://github.com/nemarugommula/PromptWeave" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
