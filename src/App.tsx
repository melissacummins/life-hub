import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { Layout } from './components/Layout';
import { NoteView } from './components/NoteView';
import { TableView } from './components/TableView';
import type { Note, Table } from './types';

function App() {
  const { getCurrentItem } = useAppStore();
  const currentItem = getCurrentItem();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search (handled by Layout)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // This will be handled by the SearchModal in Layout
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout>
      {currentItem ? (
        currentItem.type === 'note' ? (
          <NoteView itemId={currentItem.id} note={currentItem.data as Note} />
        ) : (
          <TableView itemId={currentItem.id} table={currentItem.data as Table} />
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p>Select an item from the sidebar to get started</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
