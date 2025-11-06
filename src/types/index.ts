// Core data types for the note-taking app

export type PropertyType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'file';

export interface PropertyDefinition {
  id: string;
  name: string;
  type: PropertyType;
  options?: string[]; // For select and multiselect
  required?: boolean;
}

export interface PropertyValue {
  propertyId: string;
  value: any;
}

export interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string; // Rich text JSON
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TableRecord {
  id: string;
  tableId: string;
  properties: PropertyValue[];
  notes?: string; // Optional rich text notes for this record
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  notebookId: string;
  name: string;
  propertyDefinitions: PropertyDefinition[];
  records: TableRecord[];
  views: TableView[];
  createdAt: Date;
  updatedAt: Date;
}

export type ViewType = 'table' | 'card' | 'list';

export interface SortConfig {
  propertyId: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  propertyId: string;
  operator: 'equals' | 'contains' | 'isEmpty' | 'isNotEmpty' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface GroupConfig {
  propertyId: string;
}

export interface TableView {
  id: string;
  name: string;
  type: ViewType;
  sort?: SortConfig[];
  filters?: FilterConfig[];
  groupBy?: GroupConfig;
  visibleProperties?: string[]; // Property IDs to show
}

export type ItemType = 'note' | 'table';

export interface NotebookItem {
  id: string;
  type: ItemType;
  name: string;
  notebookId: string;
  data: Note | Table;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notebook {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  items: NotebookItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  notebooks: Notebook[];
  currentNotebookId: string | null;
  currentItemId: string | null;
  searchQuery: string;
  tags: string[]; // All tags across the app
}
