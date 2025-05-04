
import React, { useRef } from 'react';
import { useCodeMirror } from '@/hooks/editor/useCodeMirror';
import { useLayout } from '@/contexts/LayoutContext';

interface MarkdownEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
  autofocus?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className = '',
  readOnly = false,
  placeholder = '',
  autofocus = true
}) => {
  const { themeMode } = useLayout();
  const isDarkMode = themeMode === 'dark';
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  // Use our improved CodeMirror hook
  const { isReady } = useCodeMirror({
    initialValue: value,
    onChange,
    placeholder,
    readOnly,
    darkMode: isDarkMode,
    autofocus,
    editorWrapperRef: editorContainerRef
  });

  return (
    <div 
      className={`markdown-editor-container w-full h-full rounded-md overflow-hidden ${className}`}
      data-testid="markdown-editor"
    >
      <div 
        ref={editorContainerRef}
        className="h-full w-full editor-container"
      />
    </div>
  );
};

export default MarkdownEditor;
