
import { useEffect, useState, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { toast } from '@/components/ui/use-toast';
import { markdownHighlightStyle } from '../utils/editor-theme';
import { placeholderExtension } from '../utils/editor-extensions';
import { search, searchKeymap } from '@codemirror/search';

interface UseCodeMirrorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  darkMode?: boolean;
  editorWrapperRef: React.RefObject<HTMLElement>;
}

export const useCodeMirror = ({
  initialValue,
  onChange,
  placeholder = 'Write your content here...',
  readOnly = false,
  darkMode = false,
  editorWrapperRef
}: UseCodeMirrorProps) => {
  const [editor, setEditor] = useState<EditorView | null>(null);
  const [isReady, setIsReady] = useState(false);
  const contentChangeHandled = useRef(false);

  // Create and clean up the editor
  useEffect(() => {
    if (!editorWrapperRef.current) {
      console.log('Editor wrapper ref not available');
      return;
    }

    console.log('Initializing CodeMirror editor');

    // Clean up previous instance if it exists
    let view: EditorView | null = null;
    
    try {
      // Create the editor extensions array
      const extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        syntaxHighlighting(defaultHighlightStyle),
        syntaxHighlighting(markdownHighlightStyle),
        search({ top: true }),
        EditorView.lineWrapping,
        EditorState.allowMultipleSelections.of(true),
        markdown(),
        EditorView.editable.of(!readOnly),
        placeholderExtension(placeholder),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !readOnly && !contentChangeHandled.current) {
            const content = update.state.doc.toString();
            console.log('Content changed from editor, new length:', content.length);
            onChange(content);
          }
        }),
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

      // Create initial state
      const state = EditorState.create({
        doc: initialValue || '',
        extensions
      });

      // Create editor view
      view = new EditorView({
        state,
        parent: editorWrapperRef.current
      });

      // Store the view and mark as ready
      setEditor(view);
      setIsReady(true);

      // Set focus on the editor when it's ready
      setTimeout(() => {
        if (view) {
          view.focus();
          console.log('Editor focused');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error initializing editor:', error);
      toast({
        title: "Editor Error",
        description: "Failed to initialize the editor. Please try refreshing the page.",
        variant: "destructive"
      });
    }

    // Clean up function
    return () => {
      if (view) {
        console.log('Cleaning up editor');
        view.destroy();
      }
    };
  }, [editorWrapperRef.current]); // Only recreate when the DOM element changes

  return {
    editor,
    isReady
  };
};
