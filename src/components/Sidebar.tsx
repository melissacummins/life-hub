import { useState } from 'react';
import { Plus, FileText, Table2, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { CreateNotebookModal } from './CreateNotebookModal';
import { CreateItemModal } from './CreateItemModal';

export function Sidebar() {
  const {
    notebooks,
    currentNotebookId,
    currentItemId,
    setCurrentNotebook,
    setCurrentItem,
  } = useAppStore();

  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(new Set());

  const toggleNotebook = (notebookId: string) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">Life Hub</h1>
          <button
            onClick={() => setIsCreateNotebookOpen(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="New Notebook"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Notebooks List */}
      <div className="flex-1 overflow-y-auto p-2">
        {notebooks.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-gray-500 mb-3">No notebooks yet</p>
            <button
              onClick={() => setIsCreateNotebookOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first notebook
            </button>
          </div>
        ) : (
          notebooks.map((notebook) => {
            const isExpanded = expandedNotebooks.has(notebook.id);
            const isActive = currentNotebookId === notebook.id;

            return (
              <div key={notebook.id} className="mb-1">
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentNotebook(notebook.id);
                    if (!isExpanded) {
                      toggleNotebook(notebook.id);
                    }
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNotebook(notebook.id);
                    }}
                    className="p-0.5 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <span className="text-lg">{notebook.icon || '📁'}</span>
                  <span className="flex-1 text-sm font-medium truncate">{notebook.name}</span>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreateItemOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                      title="Add item"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>

                {/* Notebook Items */}
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {notebook.items.length === 0 ? (
                      <div className="px-2 py-2 text-xs text-gray-400">No items</div>
                    ) : (
                      notebook.items.map((item) => {
                        const isItemActive = currentItemId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setCurrentItem(item.id)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer ${
                              isItemActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.type === 'note' ? (
                              <FileText size={14} />
                            ) : (
                              <Table2 size={14} />
                            )}
                            <span className="flex-1 text-sm truncate">{item.name}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {isCreateNotebookOpen && (
        <CreateNotebookModal onClose={() => setIsCreateNotebookOpen(false)} />
      )}
      {isCreateItemOpen && currentNotebookId && (
        <CreateItemModal
          notebookId={currentNotebookId}
          onClose={() => setIsCreateItemOpen(false)}
        />
      )}
    </div>
  );
}
