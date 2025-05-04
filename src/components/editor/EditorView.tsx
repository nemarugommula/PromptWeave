import React, { useState, useEffect } from 'react';
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

interface EditorViewProps {
  prompt: any;
}

const EditorView: React.FC<EditorViewProps> = ({ prompt: initialPrompt }) => {
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

  // Log whenever showResponseViewer or executionResponse changes
  useEffect(() => {
    console.log('Response viewer state:', { 
      showResponseViewer, 
      hasResponse: !!executionResponse,
      responseContent: executionResponse?.choices?.[0]?.message?.content?.substring(0, 20)
    });
  }, [showResponseViewer, executionResponse]);

  // Apply density mode class to the editor view
  useEffect(() => {
    const editorElement = document.querySelector('.editor-view');
    if (editorElement) {
      if (densityMode === 'compact') {
        editorElement.classList.add('editor-compact-mode');
      } else {
        editorElement.classList.remove('editor-compact-mode');
      }
    }
  }, [densityMode]);

  const { data: versions = [] } = useQuery({
    queryKey: ['versions', prompt.id],
    queryFn: () => getVersionsByPromptId(prompt.id).catch(() => []),
  });

  const { mutate: executePrompt, isPending: executing } = useMutation({
    mutationFn: async (userQuery: string = '') => {
      if (!content.trim()) throw new Error('Prompt content cannot be empty');
      const messages = selectedRole === 'system'
        ? [{ role: 'system', content }, ...(userQuery ? [{ role: 'user', content: userQuery }] : [])]
        : [{ role: selectedRole, content }];
      return callLLM({ model: selectedModel, messages, temperature: 0.7, max_tokens: 2000 });
    },
    onSuccess: (response) => {
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
    },
    onError: (error) => {
      console.error('Execution failed:', error);
      toast({ title: 'Execution Failed', description: error instanceof Error ? error.message : 'Failed to execute prompt', variant: 'destructive' });
      setIsExecutionModalOpen(false);
    },
  });

  const handleVersionSelect = (version: VersionSchema) => {
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
      });
  };

  const handleCompareVersions = (oldV: VersionSchema, newV: VersionSchema) => {
    setDiffVersions({ old: oldV, new: newV });
    setShowDiff(true);
  };

  const toggleTheme = () => setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  const handleExecuteClick = () => {
    if (!content.trim()) return toast({ title: 'Empty Prompt', description: 'Please add content before executing.', variant: 'destructive' });
    selectedRole === 'system' ? setIsExecutionModalOpen(true) : executePrompt('');
  };

  const handleExecuteFromModal = (userQuery: string) => executePrompt(userQuery);

  const handleSaveResponseAsPrompt = (responseContent: string) => {
    const newPromptId = uuidv4();
    const newPrompt = { id: newPromptId, name: `Response to ${name}`, content: responseContent, created_at: Date.now(), updated_at: Date.now() };
    savePrompt(newPrompt)
      .then(() => toast({ title: 'Response Saved', description: 'Saved as new prompt.' }))
      .catch(err => toast({ title: 'Save Failed', description: 'Could not save response.', variant: 'destructive' }));
  };

  return (
    <div className="h-screen flex flex-col w-full editor-view">
      {/* Header above all */}
      <div className="relative z-20">
        <EditorHeader
          name={name}
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
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Prompt Snippets Sidebar with formatting tools */}
        <PromptSnippetsSidebar 
          onInsert={snippet => setContent(curr => curr + snippet)} 
          onFormat={handleFormat}
        />

        {/* Main content area */}
        <div className="relative z-0 flex-1 overflow-hidden transition-all duration-300">
          <EditorMainContent
            content={content}
            onChange={setContent}
            showDiff={showDiff}
            diffVersions={diffVersions}
            onCloseDiff={() => { setShowDiff(false); setDiffVersions(null); }}
          />

          {showResponseViewer && executionResponse && (
            <ResponseViewer
              response={executionResponse}
              onSaveAsPrompt={handleSaveResponseAsPrompt}
              onClose={() => setShowResponseViewer(false)}
              executionDetails={executionDetails}
            />
          )}
        </div>

        {/* Right: Utilities Sidebar */}
        <UtilitiesSidebar
          content={content}
          wordCount={wordCount}
          charCount={charCount}
          selectedModel={selectedModel}
          lastSavedTime={prompt.updated_at}
          onSave={handleSave}
          saving={saving}
          onToggleVersions={() => setShowVersions(prev => !prev)}
          showVersions={showVersions}
          onNavigate={pos => {
            // TODO: scroll to position in editor
            console.log('Navigate to position:', pos);
          }}
        >
          {versions.length > 0 && (
            <VersionList
              versions={versions}
              currentVersionId={currentVersionId}
              onSelectVersion={handleVersionSelect}
              onCompareVersions={handleCompareVersions}
              className="max-h-64 overflow-y-auto"
            />
          )}
        </UtilitiesSidebar>
      </div>

      <PromptExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        systemPrompt={content}
        onExecute={handleExecuteFromModal}
        isLoading={executing}
      />
    </div>
  );
};

export default EditorView;
