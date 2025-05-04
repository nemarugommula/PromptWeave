
import { useCallback } from 'react';

export function useEditorFormatting(setContent: (content: string | ((prev: string) => string)) => void) {
  // Apply formatting to the editor content
  const handleFormat = useCallback((type: string) => {
    setContent(currentContent => {
      // Formatting options with their markdown syntax
      const formats: Record<string, string> = {
        bold: '**bold text**',
        italic: '*italic text*',
        heading1: '\n# Heading 1\n',
        heading2: '\n## Heading 2\n',
        heading3: '\n### Heading 3\n',
        heading4: '\n#### Heading 4\n',
        heading5: '\n##### Heading 5\n',
        heading6: '\n###### Heading 6\n',
        list: '\n- List item 1\n- List item 2\n',
        numberedList: '\n1. First item\n2. Second item\n',
        code: '`code`',
        inlineCode: '`code`',
        codeBlock: '\n```\ncode block\n```\n',
        jsonBlock: '\n```json\n{\n  \n}\n```\n',
        xmlBlock: '\n```xml\n<root>\n  \n</root>\n```\n',
        quote: '\n> quote\n',
        roleSystem: '\n# System\n',
        roleUser: '\n# User\n',
        roleAssistant: '\n# Assistant\n',
        tagBlock: '<!-- meta: key=value -->\n',
      };
      
      // Get the format text to insert
      const formatText = formats[type as keyof typeof formats] || '';
      
      // Just append to the end for now (in a real implementation we'd insert at cursor)
      return currentContent + formatText;
    });
  }, [setContent]);

  return { handleFormat };
}
