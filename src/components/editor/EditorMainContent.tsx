
import React from 'react';
import MarkdownEditor from './MarkdownEditor';
import DiffViewer from './DiffViewer';
import { VersionSchema } from '@/lib/db/schema';

interface EditorMainContentProps {
  content: string;
  onChange: (content: string) => void;
  showDiff: boolean;
  diffVersions: { old: VersionSchema, new: VersionSchema } | null;
  onCloseDiff: () => void;
}

const EditorMainContent: React.FC<EditorMainContentProps> = ({
  content,
  onChange,
  showDiff,
  diffVersions,
  onCloseDiff,
}) => {
  return (
    <div className="flex-1 h-full overflow-hidden" style={{ minHeight: 0 }}>
      {showDiff && diffVersions ? (
        <div className="h-full p-2 glass-morphism rounded-lg m-2">
          <DiffViewer
            oldVersion={diffVersions.old}
            newVersion={diffVersions.new}
            onClose={onCloseDiff}
            className="h-full"
          />
        </div>
      ) : (
        <div className="h-full w-full p-0 flex flex-col">
          <MarkdownEditor
            value={content}
            onChange={onChange}
            className="flex-1 w-full h-full"
            autofocus={true}
          />
        </div>
      )}
    </div>
  );
};

export default EditorMainContent;
