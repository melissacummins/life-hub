import { useState } from 'react';
import { X, FileText, Table2, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { PropertyDefinition, PropertyType } from '../types';

interface CreateItemModalProps {
  notebookId: string;
  onClose: () => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
];

export function CreateItemModal({ notebookId, onClose }: CreateItemModalProps) {
  const { createNote, createTable } = useAppStore();
  const [itemType, setItemType] = useState<'note' | 'table'>('note');
  const [name, setName] = useState('');

  // For table creation
  const [properties, setProperties] = useState<PropertyDefinition[]>([
    { id: '1', name: 'Name', type: 'text', required: true },
  ]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const addProperty = () => {
    setProperties([
      ...properties,
      { id: generateId(), name: '', type: 'text' },
    ]);
  };

  const updateProperty = (id: string, updates: Partial<PropertyDefinition>) => {
    setProperties(properties.map((prop) =>
      prop.id === id ? { ...prop, ...updates } : prop
    ));
  };

  const removeProperty = (id: string) => {
    setProperties(properties.filter((prop) => prop.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (itemType === 'note') {
      createNote(notebookId, name.trim());
    } else {
      // Validate properties
      const validProperties = properties.filter((prop) => prop.name.trim());
      if (validProperties.length === 0) return;
      createTable(notebookId, name.trim(), validProperties);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Item</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemType('note')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  itemType === 'note'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText size={24} />
                <div className="text-left">
                  <div className="font-medium">Note</div>
                  <div className="text-xs text-gray-500">Rich text document</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setItemType('table')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  itemType === 'table'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Table2 size={24} />
                <div className="text-left">
                  <div className="font-medium">Table</div>
                  <div className="text-xs text-gray-500">Structured data</div>
                </div>
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {itemType === 'note' ? 'Note Title' : 'Table Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={itemType === 'note' ? 'e.g., Meeting Notes' : 'e.g., Task List'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          {/* Table Properties */}
          {itemType === 'table' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Properties</label>
                <button
                  type="button"
                  onClick={addProperty}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Property
                </button>
              </div>

              <div className="space-y-2">
                {properties.map((prop) => (
                  <div key={prop.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prop.name}
                      onChange={(e) => updateProperty(prop.id, { name: e.target.value })}
                      placeholder="Property name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <select
                      value={prop.type}
                      onChange={(e) => updateProperty(prop.id, { type: e.target.value as PropertyType })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProperty(prop.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
