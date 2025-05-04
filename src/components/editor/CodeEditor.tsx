
import React from 'react';
import MarkdownEditor from './MarkdownEditor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value = '', 
  onChange, 
  className = '',
  placeholder = 'Write your content here...',
  readOnly = false
}) => {
  // Add defensive checks to prevent rendering issues
  const safeValue = typeof value === 'string' ? value : '';
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};
  
  return (
    <div className="h-full w-full">
      <MarkdownEditor
        value={safeValue}
        onChange={safeOnChange}
        className={className}
        placeholder={placeholder}
        readOnly={readOnly}
        autofocus={true}
      />
    </div>
  );
};

export default CodeEditor;
