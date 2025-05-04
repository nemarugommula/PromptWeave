
import { Table } from 'dexie';

export interface PromptSchema {
  id: string;
  name: string;
  content: string;
  category_id?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  created_at: number;
  updated_at: number;
}

export interface CategorySchema {
  id: string;
  name: string;
  color: string;
  created_at: number;
  updated_at: number;
}

export interface SettingsSchema {
  id: string;
  name: string;
  value: string;
  created_at: number;
  updated_at: number;
}

export interface VersionSchema {
  id: string;
  prompt_id: string;
  content: string;
  summary?: string;
  metadata?: Record<string, any>;
  created_at: number;
}

// Export the schema structure as needed by the db modules
export type PromptData = PromptSchema;
export type CategoryData = CategorySchema;
export type VersionData = VersionSchema;

export interface PromptWeaveDB {
  prompts: Table<PromptSchema, string>;
  categories: Table<CategorySchema, string>;
  settings: Table<SettingsSchema, string>;
  versions: Table<VersionSchema, string>;
}

export type DBSchema = {
  prompts: {
    key: string;
    value: PromptSchema;
    indexes: {
      'by-updated': number;
      'by-category': string;
      'by-archived': boolean;
    };
  };
  categories: {
    key: string;
    value: CategorySchema;
  };
  settings: {
    key: string;
    value: SettingsSchema;
  };
  versions: {
    key: string;
    value: VersionSchema;
    indexes: {
      'by-prompt': string;
    };
  };
};

export type DBSchemaKey = keyof DBSchema;

// This type is used for the string index signature
export type DBSchemaValue = {
  key: string;
  value: any;
  indexes?: Record<string, any>;
};

// Define the schema for the database
export const schema: Record<DBSchemaKey, DBSchemaValue> = {
  prompts: {
    key: 'id',
    value: {} as PromptSchema,
    indexes: {
      'by-updated': 'updated_at',
      'by-category': 'category_id',
      'by-archived': 'is_archived'
    }
  },
  categories: {
    key: 'id',
    value: {} as CategorySchema
  },
  settings: {
    key: 'id',
    value: {} as SettingsSchema
  },
  versions: {
    key: 'id',
    value: {} as VersionSchema,
    indexes: {
      'by-prompt': 'prompt_id'
    }
  }
};

export type DBTables = {
  [key in DBSchemaKey]: Table<DBSchema[key]['value'], DBSchema[key]['value']['id']>;
};
