import React from 'react';

export interface Snippet {
  id: string;
  title: string;
  content: string;
  category: string;
  description?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface CategorySnippets {
  [category: string]: Snippet[];
}

export interface Formatter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: string;
  tooltip?: string;
  group?: string;
}

export interface FormatterGroup {
  name: string;
  formatters: Formatter[];
}