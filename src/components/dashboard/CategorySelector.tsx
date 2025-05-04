
import React, { useState } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from '@/lib/utils/uuid';
import { saveCategory } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | undefined;
  onCategoryChange: (categoryId: string | undefined) => void;
  onCategoriesChange: () => void;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: number;
  updated_at?: number; // Made optional to match our usage pattern
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  onCategoriesChange
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const { toast } = useToast();

  // Find the selected category from the list
  const selected = selectedCategory 
    ? categories.find((category) => category.id === selectedCategory)
    : undefined;

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const id = uuidv4();
      // Generate a random light color for the category
      const colorOptions = ['#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F1F0FB'];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      
      const now = Date.now();
      await saveCategory({
        id,
        name: newCategory,
        color: randomColor,
        created_at: now,
        updated_at: now
      });
      
      // Reset state and close the popover
      setNewCategory('');
      setCreatingCategory(false);
      onCategoriesChange();
      onCategoryChange(id);
      
      toast({
        title: "Category created",
        description: `Created category "${newCategory}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          {selected ? (
            <div className="flex items-center gap-2 truncate">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: selected.color }}
              />
              <span className="truncate">{selected.name}</span>
            </div>
          ) : (
            "Select category..."
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-full p-0">
        {creatingCategory ? (
          <div className="flex items-center p-2 border-b">
            <input
              className="flex-1 border-none focus:outline-none bg-transparent"
              placeholder="Category name..."
              autoFocus
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCategory();
                if (e.key === 'Escape') setCreatingCategory(false);
              }}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={() => setCreatingCategory(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="ml-2"
              onClick={handleCreateCategory}
              disabled={!newCategory.trim()}
            >
              Create
            </Button>
          </div>
        ) : (
          <div className="p-2 border-b">
            <Button 
              variant="outline" 
              className="w-full flex justify-between"
              onClick={() => setCreatingCategory(true)}
            >
              <span>Create new category</span>
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
        
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="uncategorized"
              value="uncategorized"
              onSelect={() => {
                onCategoryChange(undefined);
                setOpen(false);
              }}
              className="flex items-center justify-between"
            >
              <span>Uncategorized</span>
              {selectedCategory === undefined && <Check className="h-4 w-4" />}
            </CommandItem>
            
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => {
                  onCategoryChange(category.id);
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                {selectedCategory === category.id && <Check className="h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
