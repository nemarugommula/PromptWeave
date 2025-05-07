import React, { useMemo, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, Code, Quote, AlignLeft, ArrowRight 
} from 'lucide-react';
import { Formatter, FormatterGroup } from '../types';

export const useFormatters = (
  onInsert: (content: string) => void,
  onFormat: (type: string) => void
) => {
  const formatters: Formatter[] = useMemo(() => [
    {
      id: 'bold',
      label: 'Bold',
      icon: React.createElement(Bold, { className: "h-4 w-4" }),
      shortcut: 'Ctrl+B',
      action: 'bold',
      tooltip: 'Make text bold',
      group: 'text'
    },
    {
      id: 'italic',
      label: 'Italic',
      icon: React.createElement(Italic, { className: "h-4 w-4" }),
      shortcut: 'Ctrl+I',
      action: 'italic',
      tooltip: 'Make text italic',
      group: 'text'
    },
    {
      id: 'heading1',
      label: 'H1',
      icon: React.createElement(Heading1, { className: "h-4 w-4" }),
      action: 'heading1',
      tooltip: 'Heading 1',
      group: 'headings'
    },
    {
      id: 'heading2',
      label: 'H2',
      icon: React.createElement(Heading2, { className: "h-4 w-4" }),
      action: 'heading2',
      tooltip: 'Heading 2',
      group: 'headings'
    },
    {
      id: 'heading3',
      label: 'H3',
      icon: React.createElement(Heading3, { className: "h-4 w-4" }),
      action: 'heading3',
      tooltip: 'Heading 3',
      group: 'headings'
    },
    {
      id: 'bullet-list',
      label: 'List',
      icon: React.createElement(List, { className: "h-4 w-4" }),
      action: 'bullet-list',
      tooltip: 'Bullet list',
      group: 'lists'
    },
    {
      id: 'ordered-list',
      label: 'Numbered',
      icon: React.createElement(ListOrdered, { className: "h-4 w-4" }),
      action: 'ordered-list',
      tooltip: 'Ordered list',
      group: 'lists'
    },
    {
      id: 'code',
      label: 'Code',
      icon: React.createElement(Code, { className: "h-4 w-4" }),
      action: 'code',
      tooltip: 'Code snippet',
      group: 'special'
    },
    {
      id: 'blockquote',
      label: 'Quote',
      icon: React.createElement(Quote, { className: "h-4 w-4" }),
      action: 'blockquote',
      tooltip: 'Blockquote',
      group: 'special'
    }
  ], []);

  // Group formatters by their group property
  const formatterGroups = useMemo(() => {
    const groups: Record<string, Formatter[]> = {};
    
    formatters.forEach(formatter => {
      const group = formatter.group || 'other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(formatter);
    });
    
    return Object.entries(groups).map(([name, formatters]) => ({
      name,
      formatters
    }));
  }, [formatters]);

  const handleFormatClick = useCallback((formatter: Formatter) => {
    onFormat(formatter.action);
  }, [onFormat]);

  return {
    formatters,
    formatterGroups,
    handleFormatClick
  };
};