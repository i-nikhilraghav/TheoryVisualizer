import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Tag, 
  BookOpen, 
  Layers, 
  Award,
  Filter
} from 'lucide-react';
import { BookmarkItem } from '../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onSelectBookmark: (item: BookmarkItem) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onSelectBookmark,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'project' | 'node' | 'flashcard'>('all');

  if (!isOpen) return null;

  const filtered = filterType === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-slate-100 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Favorites & Bookmarks
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
              {bookmarks.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-4 text-xs">
          {(['all', 'project', 'node', 'flashcard'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                filterType === type
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All' : type === 'node' ? 'Nodes' : type === 'project' ? 'Theories' : 'Flashcards'}
            </button>
          ))}
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No bookmarks saved in this category.</p>
              <p className="text-[11px] text-slate-500">
                Click the bookmark star icon on any concept node, project, or flashcard to save it here.
              </p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectBookmark(item)}
                className="p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/50 bg-slate-950/70 hover:bg-slate-950 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(item.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {item.snippet}
                </p>

                <div className="text-[10px] text-indigo-400 font-mono pt-1">
                  Tag: #{item.tag}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
