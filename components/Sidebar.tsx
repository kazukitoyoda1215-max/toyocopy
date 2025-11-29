import React from 'react';
import { Layout, Plus, Folder, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  categories,
  activeCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory
}) => {
  return (
    <aside 
      className={`
        flex-shrink-0 bg-slate-950/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ease-in-out z-20 h-full
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 absolute md:relative md:w-0 md:opacity-0'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-400" />
            SnippetMaster
          </h1>
        </div>

        <div className="px-4 mb-4">
            <button 
            onClick={onAddCategory}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700 text-sm font-medium shadow-lg shadow-black/20"
          >
            <Plus size={16} />
            カテゴリを追加
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Library</div>
          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                ${activeCategoryId === cat.id 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3 truncate">
                <Folder size={16} className={activeCategoryId === cat.id ? 'text-indigo-400' : 'text-slate-500'} />
                <span className="truncate text-sm font-medium">{cat.name}</span>
              </div>
              {activeCategoryId === cat.id && (
                <button 
                  onClick={(e) => onDeleteCategory(cat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                  title="カテゴリを削除"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span>PC Local Storage Sync</span>
          </div>
        </div>
      </div>
    </aside>
  );
};