import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { RichTextEditor } from './RichTextEditor';
import { formatDateTime } from '../lib/utils';
import type { Note } from '../types';

interface NoteViewProps {
  itemId: string;
  note: Note;
}

export function NoteView({ itemId, note }: NoteViewProps) {
  const { updateNoteContent, addTagToItem, removeTagFromItem, tags } = useAppStore();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTagToItem(itemId, newTag.trim());
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{note.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Updated {formatDateTime(note.updatedAt)}</span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
            >
              <Tag size={12} />
              {tag}
              <button
                onClick={() => removeTagFromItem(itemId, tag)}
                className="hover:bg-blue-200 rounded p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {isAddingTag ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                  if (e.key === 'Escape') setIsAddingTag(false);
                }}
                onBlur={handleAddTag}
                placeholder="Tag name"
                className="px-2 py-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Plus size={12} />
              Add tag
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-6">
        <RichTextEditor
          content={note.content}
          onChange={(content) => updateNoteContent(note.id, content)}
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
}
