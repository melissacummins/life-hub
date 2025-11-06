import { useState, useEffect } from 'react';
import { Search, FileText, Table2, X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { NotebookItem } from '../types';

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const { searchItems, setCurrentItem, notebooks } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NotebookItem[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchItems(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, searchItems]);

  const handleSelectItem = (itemId: string) => {
    setCurrentItem(itemId);
    onClose();
  };

  const getNotebookName = (notebookId: string) => {
    const notebook = notebooks.find((nb) => nb.id === notebookId);
    return notebook ? notebook.name : 'Unknown';
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for notes, tables, or content..."
              className="flex-1 outline-none text-lg"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              Start typing to search...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="mt-1">
                    {item.type === 'note' ? (
                      <FileText size={18} className="text-gray-600" />
                    ) : (
                      <Table2 size={18} className="text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {getNotebookName(item.notebookId)} • {item.type === 'note' ? 'Note' : 'Table'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
