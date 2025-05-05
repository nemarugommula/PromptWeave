import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar'; // Import Sidebar component
import { useLayout } from '@/contexts/LayoutContext'; // Import the LayoutContext
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash, 
  Plus, 
  Copy,
  FileJson,
  FileCode,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Tag,
  Heading1,
  Heading2,
  Hash,
  Quote,
  Cpu,
  User,
  MessageSquare,
  Search,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Snippet } from '@/lib/snippets';
import { SNIPPETS as DEFAULT_SNIPPETS } from '@/lib/snippets';

// Interface for formatter options
interface FormatOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  type: string;
  shortcut?: string;
  template: string;
}

// Default formatters matching the ones in PromptSnippetsSidebar
const DEFAULT_FORMATTERS: FormatOption[] = [
  { id: 'heading1', icon: <Heading1 className="h-4 w-4" />, label: "Heading 1", type: 'heading1', shortcut: "Ctrl+1", template: '\n# Heading 1\n' },
  { id: 'heading2', icon: <Heading2 className="h-4 w-4" />, label: "Heading 2", type: 'heading2', shortcut: "Ctrl+2", template: '\n## Heading 2\n' },
  { id: 'heading3', icon: <Hash className="h-4 w-4" />, label: "Heading 3", type: 'heading3', shortcut: "Ctrl+3", template: '\n### Heading 3\n' },
  { id: 'bold', icon: <Bold className="h-4 w-4" />, label: "Bold", type: 'bold', shortcut: "Ctrl+B", template: '**bold text**' },
  { id: 'italic', icon: <Italic className="h-4 w-4" />, label: "Italic", type: 'italic', shortcut: "Ctrl+I", template: '*italic text*' },
  { id: 'inlineCode', icon: <Code className="h-4 w-4" />, label: "Inline Code", type: 'inlineCode', shortcut: "Ctrl+`", template: '`code`' },
  { id: 'codeBlock', icon: <Code className="h-4 w-4" />, label: "Code Block", type: 'codeBlock', template: '\n```\ncode block\n```\n' },
  { id: 'jsonBlock', icon: <FileJson className="h-4 w-4" />, label: "JSON Block", type: 'jsonBlock', template: '\n```json\n{\n  \n}\n```\n' },
  { id: 'xmlBlock', icon: <FileCode className="h-4 w-4" />, label: "XML Block", type: 'xmlBlock', template: '\n```xml\n<root>\n  \n</root>\n```\n' },
  { id: 'list', icon: <List className="h-4 w-4" />, label: "Bullet List", type: 'list', template: '\n- List item 1\n- List item 2\n' },
  { id: 'numberedList', icon: <ListOrdered className="h-4 w-4" />, label: "Numbered List", type: 'numberedList', template: '\n1. First item\n2. Second item\n' },
  { id: 'quote', icon: <Quote className="h-4 w-4" />, label: "Quote", type: 'quote', template: '\n> quote\n' },
  { id: 'roleSystem', icon: <Cpu className="h-4 w-4" />, label: "Role: System", type: 'roleSystem', template: '\n# System\n' },
  { id: 'roleUser', icon: <User className="h-4 w-4" />, label: "Role: User", type: 'roleUser', template: '\n# User\n' },
  { id: 'roleAssistant', icon: <MessageSquare className="h-4 w-4" />, label: "Role: Assistant", type: 'roleAssistant', template: '\n# Assistant\n' },
  { id: 'tagBlock', icon: <Tag className="h-4 w-4" />, label: "Metadata Tag", type: 'tagBlock', template: '<!-- meta: key=value -->\n' },
];

// Storage keys for localStorage
const FORMATTERS_STORAGE_KEY = 'promptweave-formatters';
const SNIPPETS_STORAGE_KEY = 'promptweave-snippets';

const TemplatesConfig: React.FC = () => {
  // State for formatters and snippets
  const [formatters, setFormatters] = useState<FormatOption[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [activeTab, setActiveTab] = useState('formatters');
  
  // State for the currently edited item
  const [editingFormatter, setEditingFormatter] = useState<FormatOption | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSnippetDialogOpen, setIsSnippetDialogOpen] = useState(false);

  // Form state for new/editing formatters
  const [formatterId, setFormatterId] = useState('');
  const [formatterLabel, setFormatterLabel] = useState('');
  const [formatterType, setFormatterType] = useState('');
  const [formatterShortcut, setFormatterShortcut] = useState('');
  const [formatterTemplate, setFormatterTemplate] = useState('');

  // Form state for new/editing snippets
  const [snippetId, setSnippetId] = useState('');
  const [snippetCategory, setSnippetCategory] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [snippetContent, setSnippetContent] = useState('');

  const { densityMode } = useLayout(); // Get densityMode from layout context

  // Get unique categories from snippets - with null check
  const categories = Array.from(new Set(
    snippets.filter(s => s && s.category)
           .map(s => s.category)
  ));

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadFormatters = () => {
      const storedFormatters = localStorage.getItem(FORMATTERS_STORAGE_KEY);
      if (storedFormatters) {
        try {
          const parsedFormatters = JSON.parse(storedFormatters);
          const formattersWithIcons = parsedFormatters.map((f: Omit<FormatOption, 'icon'>) => ({
            ...f,
            icon: getIconForType(f.type)
          }));
          setFormatters(formattersWithIcons);
        } catch (e) {
          console.error('Error parsing stored formatters:', e);
          setFormatters(DEFAULT_FORMATTERS);
        }
      } else {
        setFormatters(DEFAULT_FORMATTERS);
      }
    };

    const loadSnippets = () => {
      const storedSnippets = localStorage.getItem(SNIPPETS_STORAGE_KEY);
      if (storedSnippets) {
        try {
          setSnippets(JSON.parse(storedSnippets));
        } catch (e) {
          console.error('Error parsing stored snippets:', e);
          setSnippets(DEFAULT_SNIPPETS);
        }
      } else {
        setSnippets(DEFAULT_SNIPPETS);
      }
    };

    loadFormatters();
    loadSnippets();
  }, []);

  // Save formatters to localStorage
  const saveFormatters = (updatedFormatters: FormatOption[]) => {
    const formattersWithoutIcons = updatedFormatters.map(({ icon, ...rest }) => rest);
    localStorage.setItem(FORMATTERS_STORAGE_KEY, JSON.stringify(formattersWithoutIcons));
    setFormatters(updatedFormatters);
  };

  // Save snippets to localStorage
  const saveSnippets = (updatedSnippets: Snippet[]) => {
    // Filter out any null or invalid snippets before saving
    const validSnippets = updatedSnippets.filter(s => s && s.category && s.title && s.content);
    localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(validSnippets));
    setSnippets(validSnippets);
  };

  // Reset formatters to defaults
  const resetFormattersToDefault = () => {
    if (window.confirm('Are you sure you want to reset all formatters to default? This cannot be undone.')) {
      saveFormatters(DEFAULT_FORMATTERS);
      toast({
        title: 'Formatters Reset',
        description: 'All formatters have been reset to their default values.',
      });
    }
  };

  // Reset snippets to defaults
  const resetSnippetsToDefault = () => {
    if (window.confirm('Are you sure you want to reset all snippets to default? This cannot be undone.')) {
      saveSnippets(DEFAULT_SNIPPETS);
      toast({
        title: 'Snippets Reset',
        description: 'All snippets have been reset to their default values.',
      });
    }
  };

  // Open formatter edit dialog
  const openFormatterEditDialog = (formatter?: FormatOption) => {
    if (formatter) {
      setEditingFormatter(formatter);
      setFormatterId(formatter.id);
      setFormatterLabel(formatter.label);
      setFormatterType(formatter.type);
      setFormatterShortcut(formatter.shortcut || '');
      setFormatterTemplate(formatter.template);
    } else {
      setEditingFormatter(null);
      setFormatterId(`formatter-${Date.now()}`);
      setFormatterLabel('');
      setFormatterType('');
      setFormatterShortcut('');
      setFormatterTemplate('');
    }
    setIsEditDialogOpen(true);
  };

  // Open snippet edit dialog
  const openSnippetEditDialog = (snippet?: Snippet) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setSnippetId(snippet.id);
      setSnippetCategory(snippet.category);
      setSnippetTitle(snippet.title);
      setSnippetDescription(snippet.description || '');
      setSnippetContent(snippet.content);
    } else {
      setEditingSnippet(null);
      setSnippetId(`snippet-${Date.now()}`);
      setSnippetCategory(categories.length > 0 ? categories[0] : 'General');
      setSnippetTitle('');
      setSnippetDescription('');
      setSnippetContent('');
    }
    setIsSnippetDialogOpen(true);
  };

  // Save formatter changes
  const saveFormatterChanges = () => {
    if (!formatterLabel || !formatterType || !formatterTemplate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const updatedFormatter: Omit<FormatOption, 'icon'> & { icon?: React.ReactNode } = {
      id: formatterId,
      // Remove icon from what gets saved to localStorage
      label: formatterLabel,
      type: formatterType,
      shortcut: formatterShortcut || undefined,
      template: formatterTemplate
    };

    let updatedFormatters: (Omit<FormatOption, 'icon'> & { icon?: React.ReactNode })[];
    if (editingFormatter) {
      updatedFormatters = formatters.map(f => 
        f.id === editingFormatter.id ? updatedFormatter : { 
          id: f.id, 
          label: f.label, 
          type: f.type, 
          shortcut: f.shortcut, 
          template: f.template 
        }
      );
    } else {
      updatedFormatters = [...formatters.map(f => ({ 
        id: f.id, 
        label: f.label, 
        type: f.type, 
        shortcut: f.shortcut, 
        template: f.template 
      })), updatedFormatter];
    }

    // Save only serializable data without React elements
    localStorage.setItem(FORMATTERS_STORAGE_KEY, JSON.stringify(updatedFormatters));
    
    // For display in UI, add back the icons
    const formattersWithIcons = updatedFormatters.map(f => ({
      ...f,
      icon: getIconForType(f.type)
    }));
    
    setFormatters(formattersWithIcons as FormatOption[]);
    setIsEditDialogOpen(false);
    toast({
      title: editingFormatter ? 'Formatter Updated' : 'Formatter Created',
      description: `The formatter has been ${editingFormatter ? 'updated' : 'created'} successfully.`,
    });
  };

  // Save snippet changes
  const saveSnippetChanges = () => {
    if (!snippetCategory || !snippetTitle || !snippetContent) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const updatedSnippet: Snippet = {
      id: snippetId,
      category: snippetCategory,
      title: snippetTitle,
      description: snippetDescription || undefined,
      content: snippetContent
    };

    let updatedSnippets: Snippet[];
    if (editingSnippet) {
      updatedSnippets = snippets.map(s => 
        s.id === editingSnippet.id ? updatedSnippet : s
      );
    } else {
      updatedSnippets = [...snippets, updatedSnippet];
    }

    saveSnippets(updatedSnippets);
    setIsSnippetDialogOpen(false);
    toast({
      title: editingSnippet ? 'Snippet Updated' : 'Snippet Created',
      description: `The snippet has been ${editingSnippet ? 'updated' : 'created'} successfully.`,
    });
  };

  // Delete a formatter
  const deleteFormatter = (formatterId: string) => {
    if (window.confirm('Are you sure you want to delete this formatter?')) {
      const updatedFormatters = formatters.filter(f => f.id !== formatterId);
      saveFormatters(updatedFormatters);
      toast({
        title: 'Formatter Deleted',
        description: 'The formatter has been deleted successfully.',
      });
    }
  };

  // Delete a snippet
  const deleteSnippet = (snippetId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      const updatedSnippets = snippets.filter(s => s.id !== snippetId);
      saveSnippets(updatedSnippets);
      toast({
        title: 'Snippet Deleted',
        description: 'The snippet has been deleted successfully.',
      });
    }
  };

  // Move formatter up or down in the list
  const moveFormatter = (formatterId: string, direction: 'up' | 'down') => {
    const index = formatters.findIndex(f => f.id === formatterId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formatters.length - 1)
    ) {
      return;
    }

    const updatedFormatters = [...formatters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedFormatters[index], updatedFormatters[targetIndex]] = 
      [updatedFormatters[targetIndex], updatedFormatters[index]];
    
    saveFormatters(updatedFormatters);
  };

  // Export formatters and snippets
  const exportData = () => {
    const data = {
      formatters,
      snippets
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'promptweave-templates.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Export Successful',
      description: 'Your formatters and snippets have been exported successfully.',
    });
  };

  // Import formatters and snippets
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.formatters) {
          const formattersWithIcons = data.formatters.map((f: Omit<FormatOption, 'icon'>) => ({
            ...f,
            icon: getIconForType(f.type)
          }));
          saveFormatters(formattersWithIcons);
        }
        
        if (data.snippets) {
          saveSnippets(data.snippets);
        }
        
        toast({
          title: 'Import Successful',
          description: 'Your formatters and snippets have been imported successfully.',
        });
      } catch (error) {
        console.error('Error importing data:', error);
        toast({
          title: 'Import Failed',
          description: 'There was an error importing your data. Please check the file format.',
          variant: 'destructive'
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the input so the same file can be imported again if needed
    event.target.value = '';
  };

  // Get icon component based on formatter type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'heading1': return <Heading1 className="h-4 w-4" />;
      case 'heading2': return <Heading2 className="h-4 w-4" />;
      case 'heading3': return <Hash className="h-4 w-4" />;
      case 'bold': return <Bold className="h-4 w-4" />;
      case 'italic': return <Italic className="h-4 w-4" />;
      case 'inlineCode': 
      case 'codeBlock': return <Code className="h-4 w-4" />;
      case 'jsonBlock': return <FileJson className="h-4 w-4" />;
      case 'xmlBlock': return <FileCode className="h-4 w-4" />;
      case 'list': return <List className="h-4 w-4" />;
      case 'numberedList': return <ListOrdered className="h-4 w-4" />;
      case 'quote': return <Quote className="h-4 w-4" />;
      case 'roleSystem': return <Cpu className="h-4 w-4" />;
      case 'roleUser': return <User className="h-4 w-4" />;
      case 'roleAssistant': return <MessageSquare className="h-4 w-4" />;
      case 'tagBlock': return <Tag className="h-4 w-4" />;
      case 'search': return <Search className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const containerClass = densityMode === 'compact' 
    ? 'container mx-auto p-2 max-w-7xl' 
    : 'container mx-auto p-4 max-w-7xl';

  return (
    <div className="h-full flex w-full"> 
      {/* Left side nav - Sidebar */}
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-grow h-full overflow-y-auto">
        <div className={containerClass}>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold">Template Configuration</h1>
              <p className="text-muted-foreground">
                Configure formatting options and prompt snippets that appear in the editor sidebar.
              </p>
            </div>

            <div className="flex justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="formatters">Formatters</TabsTrigger>
                  <TabsTrigger value="snippets">Prompt Snippets</TabsTrigger>
                </TabsList>
                
                <div className="flex justify-between mt-4 mb-2">
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => activeTab === 'formatters' ? openFormatterEditDialog() : openSnippetEditDialog()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {activeTab === 'formatters' ? 'Formatter' : 'Snippet'}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportData}>
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Export
                    </Button>

                    <div className="relative">
                      <input
                        type="file"
                        id="import-file"
                        className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        accept=".json"
                        onChange={importData}
                      />
                      <Button variant="outline">
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      onClick={activeTab === 'formatters' ? resetFormattersToDefault : resetSnippetsToDefault}
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>

                <TabsContent value="formatters" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Format Options</CardTitle>
                      <CardDescription>
                        These formatters appear in the Tools & Snippets sidebar when editing prompts.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                              <TableHead className="w-12">Icon</TableHead>
                              <TableHead>Label</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Shortcut</TableHead>
                              <TableHead>Template</TableHead>
                              <TableHead className="w-28">Order</TableHead>
                              <TableHead className="text-right w-28">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {formatters.map((formatter, index) => (
                              <TableRow key={formatter.id}>
                                <TableCell>{getIconForType(formatter.type)}</TableCell>
                                <TableCell className="font-medium">{formatter.label}</TableCell>
                                <TableCell>{formatter.type}</TableCell>
                                <TableCell>{formatter.shortcut || '—'}</TableCell>
                                <TableCell className="font-mono text-xs">
                                  {formatter.template.length > 20 
                                    ? `${formatter.template.substring(0, 20)}...` 
                                    : formatter.template}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => moveFormatter(formatter.id, 'up')}
                                      disabled={index === 0}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => moveFormatter(formatter.id, 'down')}
                                      disabled={index === formatters.length - 1}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openFormatterEditDialog(formatter)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteFormatter(formatter.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="snippets" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prompt Snippets</CardTitle>
                      <CardDescription>
                        These snippets appear in the Tools & Snippets sidebar when editing prompts.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-[60vh] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Preview</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {snippets.map((snippet) => (
                              <TableRow key={snippet.id}>
                                <TableCell>{snippet.category}</TableCell>
                                <TableCell className="font-medium">{snippet.title}</TableCell>
                                <TableCell>{snippet.description || '—'}</TableCell>
                                <TableCell>
                                  <span className="font-mono text-xs">
                                    {snippet.content.length > 40
                                      ? `${snippet.content.substring(0, 40).replace(/\n/g, '⏎')}...`
                                      : snippet.content.replace(/\n/g, '⏎')}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(snippet.content);
                                        toast({
                                          title: 'Copied',
                                          description: 'Snippet content copied to clipboard.',
                                        });
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openSnippetEditDialog(snippet)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteSnippet(snippet.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Formatter Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFormatter ? 'Edit Formatter' : 'Add Formatter'}</DialogTitle>
                <DialogDescription>
                  {editingFormatter 
                    ? 'Edit the formatter details below.'
                    : 'Create a new formatter by filling out the information below.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formatter-label" className="text-right">Label</Label>
                  <Input
                    id="formatter-label"
                    value={formatterLabel}
                    onChange={(e) => setFormatterLabel(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Bold Text"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formatter-type" className="text-right">Type</Label>
                  <Input
                    id="formatter-type"
                    value={formatterType}
                    onChange={(e) => setFormatterType(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., bold"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formatter-shortcut" className="text-right">Shortcut</Label>
                  <Input
                    id="formatter-shortcut"
                    value={formatterShortcut}
                    onChange={(e) => setFormatterShortcut(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Ctrl+B (optional)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="formatter-template" className="text-right">Template</Label>
                  <Textarea
                    id="formatter-template"
                    value={formatterTemplate}
                    onChange={(e) => setFormatterTemplate(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., **bold text**"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveFormatterChanges}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Snippet Edit Dialog */}
          <Dialog open={isSnippetDialogOpen} onOpenChange={setIsSnippetDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSnippet ? 'Edit Snippet' : 'Add Snippet'}</DialogTitle>
                <DialogDescription>
                  {editingSnippet 
                    ? 'Edit the snippet details below.'
                    : 'Create a new snippet by filling out the information below.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="snippet-category" className="text-right">Category</Label>
                  <div className="col-span-3">
                    <Select 
                      value={snippetCategory}
                      onValueChange={setSnippetCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                    {snippetCategory === 'new' && (
                      <Input
                        className="mt-2"
                        placeholder="New category name"
                        value={snippetCategory === 'new' ? '' : snippetCategory}
                        onChange={(e) => setSnippetCategory(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="snippet-title" className="text-right">Title</Label>
                  <Input
                    id="snippet-title"
                    value={snippetTitle}
                    onChange={(e) => setSnippetTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Chain-of-Thought Template"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="snippet-description" className="text-right">Description</Label>
                  <Input
                    id="snippet-description"
                    value={snippetDescription}
                    onChange={(e) => setSnippetDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Brief description (optional)"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="snippet-content" className="text-right pt-2">Content</Label>
                  <Textarea
                    id="snippet-content"
                    value={snippetContent}
                    onChange={(e) => setSnippetContent(e.target.value)}
                    className="col-span-3 min-h-[200px] font-mono"
                    placeholder="Snippet content here..."
                    rows={8}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSnippetDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveSnippetChanges}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TemplatesConfig;