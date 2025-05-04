import React, { useRef, useEffect } from 'react';
import { useCodeMirror } from '@/hooks/editor/useCodeMirror';
import { useLayout } from '@/contexts/LayoutContext';
import { EditorView } from '@codemirror/view';

interface MarkdownEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
  readOnly?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  editorRef?: React.MutableRefObject<EditorView | null>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className = '',
  readOnly = false,
  placeholder = '',
  autofocus = true,
  editorRef
}) => {
  const { themeMode } = useLayout();
  const isDarkMode = themeMode === 'dark';
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  // Use our improved CodeMirror hook
  const { isReady, editor } = useCodeMirror({
    initialValue: value,
    onChange,
    placeholder,
    readOnly,
    darkMode: isDarkMode,
    autofocus,
    editorWrapperRef: editorContainerRef
  });

  // Keep the external editorRef updated with the latest editor instance
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

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
