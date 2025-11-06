import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { formatDate } from '../lib/utils';
import type { Table, PropertyValue, PropertyDefinition } from '../types';

interface TableViewProps {
  table: Table;
}

export function TableView({ table }: TableViewProps) {
  const { addTableRecord, updateTableRecord, deleteTableRecord } = useAppStore();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleAddRecord = () => {
    setIsAddingRecord(true);
    setFormData({});
  };

  const handleSaveRecord = () => {
    const properties: PropertyValue[] = table.propertyDefinitions.map((prop) => ({
      propertyId: prop.id,
      value: formData[prop.id] || getDefaultValue(prop.type),
    }));

    if (editingRecordId) {
      updateTableRecord(table.id, editingRecordId, properties);
      setEditingRecordId(null);
    } else {
      addTableRecord(table.id, properties);
      setIsAddingRecord(false);
    }
    setFormData({});
  };

  const handleEditRecord = (recordId: string) => {
    const record = table.records.find((r) => r.id === recordId);
    if (record) {
      const data: Record<string, any> = {};
      record.properties.forEach((prop) => {
        data[prop.propertyId] = prop.value;
      });
      setFormData(data);
      setEditingRecordId(recordId);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingRecord(false);
    setEditingRecordId(null);
    setFormData({});
  };

  const getDefaultValue = (type: string) => {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      case 'multiselect':
        return [];
      default:
        return '';
    }
  };

  const renderPropertyInput = (prop: PropertyDefinition) => {
    const value = formData[prop.id] ?? getDefaultValue(prop.type);

    switch (prop.type) {
      case 'text':
      case 'url':
      case 'email':
        return (
          <input
            type={prop.type === 'url' ? 'url' : prop.type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: parseFloat(e.target.value) || 0 })}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Select...</option>
            {prop.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData({ ...formData, [prop.id]: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        );
    }
  };

  const renderPropertyValue = (prop: PropertyDefinition, value: any) => {
    switch (prop.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            readOnly
            className="w-5 h-5 text-blue-600 rounded pointer-events-none"
          />
        );
      case 'date':
        return value ? formatDate(new Date(value)) : '-';
      case 'url':
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {value}
          </a>
        ) : '-';
      case 'email':
        return value ? (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
            {value}
          </a>
        ) : '-';
      case 'multiselect':
        return Array.isArray(value) ? value.join(', ') : '-';
      default:
        return value || '-';
    }
  };

  const getPropertyValue = (recordProperties: PropertyValue[], propId: string) => {
    const prop = recordProperties.find((p) => p.propertyId === propId);
    return prop ? prop.value : null;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{table.name}</h1>
          <button
            onClick={handleAddRecord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Record
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {table.propertyDefinitions.map((prop) => (
                  <th
                    key={prop.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  >
                    {prop.name}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Add/Edit Record Form */}
              {(isAddingRecord || editingRecordId) && (
                <tr className="bg-blue-50">
                  {table.propertyDefinitions.map((prop) => (
                    <td key={prop.id} className="px-4 py-3">
                      {renderPropertyInput(prop)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleSaveRecord}
                        className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Records */}
              {table.records.length === 0 && !isAddingRecord ? (
                <tr>
                  <td
                    colSpan={table.propertyDefinitions.length + 1}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No records yet. Click "Add Record" to get started.
                  </td>
                </tr>
              ) : (
                table.records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    {table.propertyDefinitions.map((prop) => (
                      <td key={prop.id} className="px-4 py-3 text-sm text-gray-900">
                        {renderPropertyValue(prop, getPropertyValue(record.properties, prop.id))}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditRecord(record.id)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTableRecord(table.id, record.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
