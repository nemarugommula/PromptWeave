
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';

// Define markdown syntax highlighting styles
export const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, fontWeight: 'bold', color: 'var(--primary-color, #5a67d8)' },
  { tag: tags.heading1, fontWeight: 'bold', fontSize: '1.3em', color: 'var(--heading1-color, #4338ca)' },
  { tag: tags.heading2, fontWeight: 'bold', fontSize: '1.1em', color: 'var(--heading2-color, #4f46e5)' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.keyword, color: 'var(--keyword-color, #5a67d8)' },
  { tag: tags.atom, color: 'var(--atom-color, #16a34a)' },
  { tag: tags.comment, color: 'var(--comment-color, #64748b)' },
  { tag: tags.quote, color: 'var(--quote-color, #64748b)', fontStyle: 'italic' },
  { tag: tags.link, color: 'var(--link-color, #2563eb)', textDecoration: 'underline' },
  { tag: tags.variableName, color: 'var(--variable-color, #2563eb)' },
  { tag: tags.list, fontWeight: 'bold', color: 'var(--list-color, #5a67d8)' },
]);

// Set theme variables
const setCssVariables = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  document.documentElement.style.setProperty('--primary-color', 
    isDarkMode ? '#9b87f5' : '#5a67d8');
  document.documentElement.style.setProperty('--heading1-color',
    isDarkMode ? '#a78bfa' : '#4338ca');
  document.documentElement.style.setProperty('--heading2-color',
    isDarkMode ? '#9b87f5' : '#4f46e5');
  document.documentElement.style.setProperty('--keyword-color',
    isDarkMode ? '#9b87f5' : '#5a67d8');
  document.documentElement.style.setProperty('--atom-color',
    isDarkMode ? '#4ade80' : '#16a34a');
  document.documentElement.style.setProperty('--comment-color',
    isDarkMode ? '#94a3b8' : '#64748b');
  document.documentElement.style.setProperty('--quote-color',
    isDarkMode ? '#94a3b8' : '#64748b');
  document.documentElement.style.setProperty('--link-color',
    isDarkMode ? '#60a5fa' : '#2563eb');
  document.documentElement.style.setProperty('--variable-color',
    isDarkMode ? '#60a5fa' : '#2563eb');
  document.documentElement.style.setProperty('--list-color',
    isDarkMode ? '#9b87f5' : '#5a67d8');
  
  document.documentElement.style.setProperty('--editor-active-line-background',
    isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)');
  document.documentElement.style.setProperty('--cursor-color',
    isDarkMode ? 'white' : 'black');
}

// Run initially
setCssVariables();

// Update theme variables when theme changes
const observer = new MutationObserver(() => {
  setCssVariables();
});

// Start observing theme changes if we're in a browser environment
if (typeof document !== 'undefined') {
  observer.observe(document.documentElement, { attributes: true });
}

// Editor theme with improved cursor visibility and styles
export const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '14px',
  },
  '.cm-content': {
    padding: '16px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    caretColor: 'var(--cursor-color, currentColor)', 
  },
  '.cm-line': {
    padding: '0 12px 0 4px',
    lineHeight: '1.6',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    border: 'none',
    borderRight: '1px solid rgba(128, 128, 128, 0.3)',
  },
  '.cm-gutter': {
    minWidth: '2em',
    textAlign: 'right',
    color: 'rgba(128, 128, 128, 0.7)',
    fontSize: '12px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'currentColor',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--editor-active-line-background)',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--cursor-color, currentColor) !important',
    borderLeftWidth: '2px !important',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(90, 103, 216, 0.2) !important',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(90, 103, 216, 0.3)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'rgba(90, 103, 216, 0.4)',
    outline: '1px solid rgba(90, 103, 216, 0.5)',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: 'rgba(90, 103, 216, 0.5)',
  },
  '&.cm-focused': {
    outline: 'none !important',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 4px',
    color: 'rgba(128, 128, 128, 0.7)',
    fontSize: '12px',
  },
  // Placeholder styling
  '.cm-placeholder': {
    color: 'rgba(128, 128, 128, 0.6)',
    fontStyle: 'italic'
  }
});
