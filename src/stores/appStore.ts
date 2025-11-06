import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notebook, NotebookItem, Table, Note, AppState, PropertyDefinition, PropertyValue } from '../types';

interface AppStore extends AppState {
  // Notebook operations
  createNotebook: (name: string, icon?: string, color?: string) => void;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
  deleteNotebook: (id: string) => void;
  setCurrentNotebook: (id: string | null) => void;

  // Item operations
  createNote: (notebookId: string, title: string) => void;
  createTable: (notebookId: string, name: string, propertyDefinitions: PropertyDefinition[]) => void;
  updateItem: (itemId: string, updates: Partial<NotebookItem>) => void;
  deleteItem: (itemId: string) => void;
  setCurrentItem: (id: string | null) => void;

  // Note operations
  updateNoteContent: (noteId: string, content: string) => void;

  // Table operations
  addTableRecord: (tableId: string, properties: PropertyValue[]) => void;
  updateTableRecord: (tableId: string, recordId: string, properties: PropertyValue[]) => void;
  deleteTableRecord: (tableId: string, recordId: string) => void;
  addPropertyDefinition: (tableId: string, property: PropertyDefinition) => void;
  updatePropertyDefinition: (tableId: string, propertyId: string, updates: Partial<PropertyDefinition>) => void;
  deletePropertyDefinition: (tableId: string, propertyId: string) => void;

  // Tag operations
  addTag: (tag: string) => void;
  addTagToItem: (itemId: string, tag: string) => void;
  removeTagFromItem: (itemId: string, tag: string) => void;

  // Search
  setSearchQuery: (query: string) => void;

  // Helpers
  getCurrentNotebook: () => Notebook | null;
  getCurrentItem: () => NotebookItem | null;
  searchItems: (query: string) => NotebookItem[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      notebooks: [],
      currentNotebookId: null,
      currentItemId: null,
      searchQuery: '',
      tags: [],

      createNotebook: (name, icon, color) => {
        const notebook: Notebook = {
          id: generateId(),
          name,
          icon,
          color,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          notebooks: [...state.notebooks, notebook],
          currentNotebookId: notebook.id,
        }));
      },

      updateNotebook: (id, updates) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === id ? { ...nb, ...updates, updatedAt: new Date() } : nb
          ),
        }));
      },

      deleteNotebook: (id) => {
        set((state) => ({
          notebooks: state.notebooks.filter((nb) => nb.id !== id),
          currentNotebookId: state.currentNotebookId === id ? null : state.currentNotebookId,
        }));
      },

      setCurrentNotebook: (id) => {
        set({ currentNotebookId: id, currentItemId: null });
      },

      createNote: (notebookId, title) => {
        const note: Note = {
          id: generateId(),
          notebookId,
          title,
          content: '',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const item: NotebookItem = {
          id: generateId(),
          type: 'note',
          name: title,
          notebookId,
          data: note,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? { ...nb, items: [...nb.items, item], updatedAt: new Date() }
              : nb
          ),
          currentItemId: item.id,
        }));
      },

      createTable: (notebookId, name, propertyDefinitions) => {
        const table: Table = {
          id: generateId(),
          notebookId,
          name,
          propertyDefinitions,
          records: [],
          views: [
            {
              id: generateId(),
              name: 'All Records',
              type: 'table',
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const item: NotebookItem = {
          id: generateId(),
          type: 'table',
          name,
          notebookId,
          data: table,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? { ...nb, items: [...nb.items, item], updatedAt: new Date() }
              : nb
          ),
          currentItemId: item.id,
        }));
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) =>
              item.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item
            ),
          })),
        }));
      },

      deleteItem: (itemId) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.filter((item) => item.id !== itemId),
          })),
          currentItemId: state.currentItemId === itemId ? null : state.currentItemId,
        }));
      },

      setCurrentItem: (id) => {
        set({ currentItemId: id });
      },

      updateNoteContent: (noteId, content) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'note' && item.data.id === noteId) {
                return {
                  ...item,
                  data: { ...item.data, content, updatedAt: new Date() },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      addTableRecord: (tableId, properties) => {
        const record = {
          id: generateId(),
          tableId,
          properties,
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    records: [...table.records, record],
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      updateTableRecord: (tableId, recordId, properties) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    records: table.records.map((record) =>
                      record.id === recordId
                        ? { ...record, properties, updatedAt: new Date() }
                        : record
                    ),
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      deleteTableRecord: (tableId, recordId) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    records: table.records.filter((record) => record.id !== recordId),
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      addPropertyDefinition: (tableId, property) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    propertyDefinitions: [...table.propertyDefinitions, property],
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      updatePropertyDefinition: (tableId, propertyId, updates) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    propertyDefinitions: table.propertyDefinitions.map((prop) =>
                      prop.id === propertyId ? { ...prop, ...updates } : prop
                    ),
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      deletePropertyDefinition: (tableId, propertyId) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.type === 'table' && item.data.id === tableId) {
                const table = item.data as Table;
                return {
                  ...item,
                  data: {
                    ...table,
                    propertyDefinitions: table.propertyDefinitions.filter(
                      (prop) => prop.id !== propertyId
                    ),
                    records: table.records.map((record) => ({
                      ...record,
                      properties: record.properties.filter((p) => p.propertyId !== propertyId),
                    })),
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      addTag: (tag) => {
        set((state) => ({
          tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
        }));
      },

      addTagToItem: (itemId, tag) => {
        get().addTag(tag);
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.id === itemId) {
                if (item.type === 'note') {
                  const note = item.data as Note;
                  return {
                    ...item,
                    data: {
                      ...note,
                      tags: note.tags.includes(tag) ? note.tags : [...note.tags, tag],
                      updatedAt: new Date(),
                    },
                    updatedAt: new Date(),
                  };
                } else if (item.type === 'table') {
                  // For tables, we don't add tags directly to the table itself
                  // Tags are managed at the record level
                  return item;
                }
              }
              return item;
            }),
          })),
        }));
      },

      removeTagFromItem: (itemId, tag) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) => ({
            ...nb,
            items: nb.items.map((item) => {
              if (item.id === itemId && item.type === 'note') {
                const note = item.data as Note;
                return {
                  ...item,
                  data: {
                    ...note,
                    tags: note.tags.filter((t) => t !== tag),
                    updatedAt: new Date(),
                  },
                  updatedAt: new Date(),
                };
              }
              return item;
            }),
          })),
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      getCurrentNotebook: () => {
        const state = get();
        return state.notebooks.find((nb) => nb.id === state.currentNotebookId) || null;
      },

      getCurrentItem: () => {
        const state = get();
        for (const notebook of state.notebooks) {
          const item = notebook.items.find((item) => item.id === state.currentItemId);
          if (item) return item;
        }
        return null;
      },

      searchItems: (query) => {
        const state = get();
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase();
        const results: NotebookItem[] = [];

        for (const notebook of state.notebooks) {
          for (const item of notebook.items) {
            // Search in item name
            if (item.name.toLowerCase().includes(lowerQuery)) {
              results.push(item);
              continue;
            }

            // Search in note content
            if (item.type === 'note') {
              const note = item.data as Note;
              if (
                note.title.toLowerCase().includes(lowerQuery) ||
                note.content.toLowerCase().includes(lowerQuery) ||
                note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
              ) {
                results.push(item);
              }
            }

            // Search in table records
            if (item.type === 'table') {
              const table = item.data as Table;
              const hasMatch = table.records.some((record) =>
                record.properties.some((prop) =>
                  String(prop.value).toLowerCase().includes(lowerQuery)
                )
              );
              if (hasMatch) {
                results.push(item);
              }
            }
          }
        }

        return results;
      },
    }),
    {
      name: 'life-hub-storage',
    }
  )
);
