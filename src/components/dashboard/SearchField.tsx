
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-56">
      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search prompts..."
        className="pl-8 h-8 text-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
