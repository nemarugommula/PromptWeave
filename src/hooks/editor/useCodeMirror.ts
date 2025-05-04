
import { useEffect, useState, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, HighlightStyle } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { tags } from '@lezer/highlight';
import { search, searchKeymap } from '@codemirror/search';
import { toast } from '@/components/ui/use-toast';

// Define custom markdown highlighting style
const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, fontWeight: 'bold', color: 'var(--primary)' },
  { tag: tags.heading1, fontSize: '1.2em', color: 'var(--primary)' },
  { tag: tags.heading2, fontSize: '1.1em', color: 'var(--primary)' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.link, color: 'var(--primary)', textDecoration: 'underline' },
  { tag: tags.comment, color: 'var(--muted-foreground)' },
  { tag: tags.quote, color: 'var(--muted-foreground)', fontStyle: 'italic' },
]);

// Create a placeholder extension
const placeholderExtension = (placeholder: string) => {
  return EditorView.theme({
    ".cm-content": {
      "&:after": {
        content: `"${placeholder}"`,
        color: 'var(--muted-foreground)',
        fontStyle: 'italic',
        display: 'block',
        pointerEvents: 'none',
        height: 0
      }
    },
    "&.cm-focused .cm-content:after": {
      display: 'none'
    },
    ".cm-content:not(:empty) + .cm-content:after": {
      display: 'none'
    }
  });
};

interface UseCodeMirrorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  darkMode?: boolean;
  autofocus?: boolean;
  editorWrapperRef: React.RefObject<HTMLDivElement>;
}

export function useCodeMirror({
  initialValue,
  onChange,
  placeholder = 'Write your content here...',
  readOnly = false,
  darkMode = false,
  autofocus = true,
  editorWrapperRef
}: UseCodeMirrorProps) {
  const [editor, setEditor] = useState<EditorView | null>(null);
  const [isReady, setIsReady] = useState(false);
  const valueRef = useRef<string>(initialValue || '');

  // Track external value changes
  useEffect(() => {
    valueRef.current = initialValue || '';
    
    // Update editor content if it exists and differs from external value
    if (editor && editor.state.doc.toString() !== valueRef.current) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: valueRef.current }
      });
    }
  }, [initialValue, editor]);

  // Initialize editor
  useEffect(() => {
    // Wait until we have a DOM element to mount the editor
    if (!editorWrapperRef.current) {
      console.log('Editor wrapper ref not available');
      return;
    }

    console.log('Editor DOM element found, initializing CodeMirror', editorWrapperRef.current);
    
    // Clean up any existing editor
    let view: EditorView | null = null;

    try {
      // Build extensions array
      const extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        markdownHighlightStyle ? syntaxHighlighting(markdownHighlightStyle) : [],
        EditorView.lineWrapping,
        EditorState.allowMultipleSelections.of(true),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        search({ top: true }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !readOnly) {
            const value = update.state.doc.toString();
            valueRef.current = value;
            onChange(value);
          }
        }),
        EditorView.editable.of(!readOnly),
        placeholderExtension(placeholder),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
          ".cm-content": { padding: "10px" },
          ".cm-cursor": { borderLeftWidth: "2px !important" },
          ".cm-activeLine": { backgroundColor: darkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)" }
        })
      ];

      // Add dark theme if needed
      if (darkMode) {
        extensions.push(oneDark);
      }

      console.log('Creating CodeMirror editor state with extensions');
      
      // Create initial state
      const state = EditorState.create({
        doc: valueRef.current,
        extensions: extensions.flat()
      });

      console.log('Creating CodeMirror editor view');
      // Create editor
      view = new EditorView({
        state,
        parent: editorWrapperRef.current
      });

      console.log('CodeMirror editor view created');
      
      // Focus editor if autofocus is enabled
      if (autofocus && view) {
        setTimeout(() => {
          if (view) {
            console.log('Setting focus on editor');
            view.focus();
          }
        }, 100);
      }

      // Store the view
      setEditor(view);
      setIsReady(true);
      console.log('Editor initialization complete');

    } catch (error) {
      console.error('Error initializing editor:', error);
      toast({
        title: "Editor Error",
        description: "Failed to initialize the editor. Please try refreshing the page.",
        variant: "destructive"
      });
    }

    // Cleanup function
    return () => {
      if (view) {
        console.log('Cleaning up editor');
        view.destroy();
        setEditor(null);
      }
    };
  }, [editorWrapperRef.current, readOnly, darkMode, placeholder]); // Don't include onChange to prevent re-creation

  return {
    editor,
    isReady,
  };
}
