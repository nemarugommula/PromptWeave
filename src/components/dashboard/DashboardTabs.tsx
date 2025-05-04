
import React from "react";
import { 
  List, 
  Clock, 
  BookmarkCheck, 
  Star,
  Archive
} from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";

export const DashboardTabs: React.FC = () => {
  return (
    <>
      <TabsTrigger value="all" className="flex items-center gap-2">
        <List className="h-4 w-4" /> All Prompts
      </TabsTrigger>
      <TabsTrigger value="recent" className="flex items-center gap-2">
        <Clock className="h-4 w-4" /> Recent
      </TabsTrigger>
      <TabsTrigger value="categories" className="flex items-center gap-2">
        <BookmarkCheck className="h-4 w-4" /> Categories
      </TabsTrigger>
      <TabsTrigger value="favorites" className="flex items-center gap-2">
        <Star className="h-4 w-4" /> Favorites
      </TabsTrigger>
      <TabsTrigger value="archives" className="flex items-center gap-2">
        <Archive className="h-4 w-4" /> Archives
      </TabsTrigger>
    </>
  );
};
