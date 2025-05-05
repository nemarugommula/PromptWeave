import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVersionsByPromptId, savePrompt } from '@/lib/db';
import { VersionSchema } from '@/lib/db/schema';
import { toast } from '@/components/ui/use-toast';
import { useLayout } from '@/contexts/LayoutContext';
import EditorHeader from './EditorHeader';
import VersionList from './VersionList';
import EditorMainContent from './EditorMainContent';
import { useEditorState } from '@/hooks/editor/useEditorState';
import { useEditorFormatting } from '@/hooks/editor/useEditorFormatting';
import PromptSnippetsSidebar from './PromptSnippetsSidebar';
import UtilitiesSidebar from './UtilitiesSidebar';
import { callLLM } from '@/lib/llm-client';
import { v4 as uuidv4 } from '@/lib/utils/uuid';
import PromptExecutionModal from './PromptExecutionModal';
import ResponseViewer from './ResponseViewer';
import { EditorView as CodeMirrorEditorView } from '@codemirror/view';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface EditorViewProps {
  prompt: any;
}

const EditorView: React.FC<EditorViewProps> = ({ prompt: initialPrompt }) => {
  // Safety check for required properties to prevent null reference errors
  useEffect(() => {
    try {
      if (!initialPrompt) {
        console.error('EditorView received null prompt object');
        toast({
          title: 'Error Loading Prompt',
          description: 'The prompt data is missing or invalid. Some features may not work correctly.',
          variant: 'destructive'
        });
        return;
      }

      // Validate that required properties exist
      const requiredProps = ['id', 'name', 'category'];
      const missingProps = requiredProps.filter(prop => !initialPrompt[prop]);
      
      if (missingProps.length > 0) {
        console.warn(`Prompt is missing required properties: ${missingProps.join(', ')}`);
        toast({
          title: 'Warning',
          description: 'The prompt data is incomplete. Some features may be limited.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in EditorView initialization:', error);
    }
  }, [initialPrompt]);

  const {
    prompt,
    name,
    setName,
    content,
    setContent,
    currentVersionId,
    setCurrentVersionId,
    wordCount,
    charCount,
    saving,
    handleSave,
    handleNewVersion,
    handleCopy,
    handleSaveNameOnly,
  } = useEditorState(initialPrompt);

  const { handleFormat } = useEditorFormatting(setContent);
  const [showVersions, setShowVersions] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffVersions, setDiffVersions] = useState<{ old: VersionSchema; new: VersionSchema } | null>(null);

  const [selectedRole, setSelectedRole] = useState('system');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [executionResponse, setExecutionResponse] = useState<any>(null);
  const [showResponseViewer, setShowResponseViewer] = useState(false);
  const [executionDetails, setExecutionDetails] = useState<{
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | undefined>(undefined);

  const { themeMode, setThemeMode, densityMode, setDensityMode } = useLayout();
  const queryClient = useQueryClient();
  const editorRef = useRef<CodeMirrorEditorView | null>(null);

  // Log whenever showResponseViewer or executionResponse changes
  useEffect(() => {
    try {
      console.log('Response viewer state:', { 
        showResponseViewer, 
        hasResponse: !!executionResponse,
        responseContent: executionResponse?.choices?.[0]?.message?.content?.substring(0, 20)
      });
    } catch (error) {
      console.error('Error logging response viewer state:', error);
    }
  }, [showResponseViewer, executionResponse]);

  // Apply density mode class to the editor view
  useEffect(() => {
    try {
      const editorElement = document.querySelector('.editor-view');
      if (editorElement) {
        if (densityMode === 'compact') {
          editorElement.classList.add('editor-compact-mode');
        } else {
          editorElement.classList.remove('editor-compact-mode');
        }
      }
    } catch (error) {
      console.error('Error applying density mode class:', error);
    }
  }, [densityMode]);

  const { data: versions = [] } = useQuery({
    queryKey: ['versions', prompt?.id],
    queryFn: async () => {
      try {
        if (!prompt?.id) {
          console.warn('No prompt ID available for fetching versions');
          return [];
        }
        return await getVersionsByPromptId(prompt.id);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast({
          title: 'Error Loading Versions',
          description: 'Failed to load version history. Please try again.',
          variant: 'destructive'
        });
        return [];
      }
    },
    enabled: !!prompt?.id,
  });

  const { mutate: executePrompt, isPending: executing } = useMutation({
    mutationFn: async (userQuery: string = '') => {
      try {
        if (!content.trim()) throw new Error('Prompt content cannot be empty');
        const messages = selectedRole === 'system'
          ? [{ role: 'system', content }, ...(userQuery ? [{ role: 'user', content: userQuery }] : [])]
          : [{ role: selectedRole, content }];
        return await callLLM({ model: selectedModel, messages, temperature: 0.7, max_tokens: 2000 });
      } catch (error) {
        console.error('Error executing prompt:', error);
        throw error; // Re-throw to be caught by onError
      }
    },
    onSuccess: (response) => {
      try {
        console.log('API response received:', response);
        setExecutionResponse(response);
        
        if (response.usage) {
          setExecutionDetails({
            model: selectedModel,
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          });
        }
        
        // Ensure modal is closed before showing response
        setIsExecutionModalOpen(false);
        
        // Short delay to ensure UI updates properly before showing response
        setTimeout(() => {
          setShowResponseViewer(true);
        }, 100);
      } catch (error) {
        console.error('Error handling successful execution:', error);
        toast({
          title: 'Error Processing Response',
          description: 'An error occurred while processing the response.',
          variant: 'destructive'
        });
      }
    },
    onError: (error) => {
      console.error('Execution failed:', error);
      toast({ 
        title: 'Execution Failed', 
        description: error instanceof Error ? error.message : 'Failed to execute prompt', 
        variant: 'destructive' 
      });
      setIsExecutionModalOpen(false);
    },
  });

  const handleVersionSelect = (version: VersionSchema) => {
    try {
      if (!version.content) return;
      setContent(version.content);
      setCurrentVersionId(version.id);
      
      // Update the prompt with the current version ID
      const updatedPrompt = {
        ...prompt,
        content: version.content,
        current_version_id: version.id,
        updated_at: Date.now()
      };
      
      // Save the prompt with the updated current version ID
      savePrompt(updatedPrompt)
        .then(() => {
          toast({ 
            title: 'Version Loaded', 
            description: `Switched to version from ${new Date(version.created_at).toLocaleString()}` 
          });
          // Refresh the prompt data
          queryClient.invalidateQueries({ queryKey: ['prompt', prompt.id] });
        })
        .catch(err => {
          console.error('Failed to update current version:', err);
          toast({
            title: 'Version Update Failed',
            description: 'Failed to save version selection.',
            variant: 'destructive'
          });
        });
    } catch (error) {
      console.error('Error in handleVersionSelect:', error);
      toast({
        title: 'Error Selecting Version',
        description: 'An error occurred while selecting this version.',
        variant: 'destructive'
      });
    }
  };

  const handleCompareVersions = (oldV: VersionSchema, newV: VersionSchema) => {
    try {
      setDiffVersions({ old: oldV, new: newV });
      setShowDiff(true);
    } catch (error) {
      console.error('Error comparing versions:', error);
      toast({
        title: 'Error Comparing Versions',
        description: 'An error occurred while comparing versions.',
        variant: 'destructive'
      });
    }
  };

  const toggleTheme = () => {
    try {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const handleExecuteClick = () => {
    try {
      if (!content.trim()) {
        return toast({ 
          title: 'Empty Prompt', 
          description: 'Please add content before executing.', 
          variant: 'destructive' 
        });
      }
      selectedRole === 'system' ? setIsExecutionModalOpen(true) : executePrompt('');
    } catch (error) {
      console.error('Error in handleExecuteClick:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute prompt.',
        variant: 'destructive'
      });
    }
  };

  const handleExecuteFromModal = (userQuery: string) => {
    try {
      executePrompt(userQuery);
    } catch (error) {
      console.error('Error in handleExecuteFromModal:', error);
    }
  };

  const handleSaveResponseAsPrompt = (responseContent: string) => {
    try {
      const newPromptId = uuidv4();
      const newPrompt = {
        id: newPromptId,
        name: `Response to ${name || 'Untitled Prompt'}`,
        content: responseContent,
        created_at: Date.now(),
        updated_at: Date.now(),
        category: 'default'
      };
      
      savePrompt(newPrompt)
        .then(() => toast({ title: 'Response Saved', description: 'Saved as new prompt.' }))
        .catch(err => {
          console.error('Error saving response as prompt:', err);
          toast({ 
            title: 'Save Failed', 
            description: 'Could not save response.', 
            variant: 'destructive' 
          });
        });
    } catch (error) {
      console.error('Error in handleSaveResponseAsPrompt:', error);
      toast({
        title: 'Save Failed',
        description: 'An error occurred while saving response as prompt.',
        variant: 'destructive'
      });
    }
  };

  // Safely render sub-components with error boundaries
  const renderWithErrorBoundary = (Component: React.ReactNode, name: string) => (
    <ErrorBoundary fallback={
      <div className="p-4 border border-red-300 bg-red-50 text-red-900 rounded-md">
        <p className="font-semibold">Error rendering {name}</p>
        <p className="text-sm">This component failed to load but the rest of the editor is still functional.</p>
      </div>
    }>
      {Component}
    </ErrorBoundary>
  );

  return (
    <div className="h-screen flex flex-col w-full editor-view">
      {/* Header above all */}
      <div className="relative z-20">
        {renderWithErrorBoundary(
          <EditorHeader
            name={name || 'Untitled'}
            onNameChange={setName}
            onSave={handleSave}
            onSaveNameOnly={handleSaveNameOnly}
            onCopy={handleCopy}
            onNewVersion={handleNewVersion}
            saving={saving}
            toggleTheme={toggleTheme}
            themeMode={themeMode}
            onExecute={handleExecuteClick}
            executing={executing}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />,
          "Editor Header"
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Prompt Snippets Sidebar with formatting tools */}
        {renderWithErrorBoundary(
          <PromptSnippetsSidebar 
            onInsert={snippet => {
              try {
                setContent(curr => curr + snippet);
              } catch (error) {
                console.error('Error inserting snippet:', error);
              }
            }} 
            onFormat={handleFormat}
          />,
          "Snippet Sidebar"
        )}

        {/* Main content area */}
        <div className="relative z-0 flex-1 overflow-hidden transition-all duration-300">
          {renderWithErrorBoundary(
            <EditorMainContent
              content={content || ''}
              onChange={setContent}
              showDiff={showDiff}
              diffVersions={diffVersions}
              onCloseDiff={() => { 
                try {
                  setShowDiff(false); 
                  setDiffVersions(null); 
                } catch (error) {
                  console.error('Error closing diff:', error);
                }
              }}
              editorRef={editorRef}
            />,
            "Editor Content"
          )}

          {showResponseViewer && executionResponse && renderWithErrorBoundary(
            <ResponseViewer
              response={executionResponse}
              onSaveAsPrompt={handleSaveResponseAsPrompt}
              onClose={() => {
                try {
                  setShowResponseViewer(false);
                } catch (error) {
                  console.error('Error closing response viewer:', error);
                }
              }}
              executionDetails={executionDetails}
            />,
            "Response Viewer"
          )}
        </div>

        {/* Right: Utilities Sidebar */}
        {renderWithErrorBoundary(
          <UtilitiesSidebar
            content={content || ''}
            wordCount={wordCount}
            charCount={charCount}
            selectedModel={selectedModel}
            lastSavedTime={prompt?.updated_at}
            onSave={handleSave}
            saving={saving}
            onToggleVersions={() => {
              try {
                setShowVersions(prev => !prev);
              } catch (error) {
                console.error('Error toggling versions panel:', error);
              }
            }}
            showVersions={showVersions}
            onNavigate={pos => {
              try {
                if (editorRef.current) {
                  editorRef.current.dispatch({
                    effects: CodeMirrorEditorView.scrollIntoView(pos, { y: 'center' })
                  });
                }
              } catch (error) {
                console.error('Error navigating to position:', error);
              }
            }}
          >
            {versions.length > 0 && renderWithErrorBoundary(
              <VersionList
                versions={versions}
                currentVersionId={currentVersionId}
                onSelectVersion={handleVersionSelect}
                onCompareVersions={handleCompareVersions}
                className="max-h-64 overflow-y-auto"
              />,
              "Version List"
            )}
          </UtilitiesSidebar>,
          "Utilities Sidebar"
        )}
      </div>

      {renderWithErrorBoundary(
        <PromptExecutionModal
          isOpen={isExecutionModalOpen}
          onClose={() => {
            try {
              setIsExecutionModalOpen(false);
            } catch (error) {
              console.error('Error closing execution modal:', error);
            }
          }}
          systemPrompt={content || ''}
          onExecute={handleExecuteFromModal}
          isLoading={executing}
        />,
        "Execution Modal"
      )}
    </div>
  );
};

export default EditorView;
