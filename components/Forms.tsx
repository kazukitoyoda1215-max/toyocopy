import React, { useState, useEffect } from 'react';
import { Category, ClipFormData, Clip } from '../types';

interface ClipFormProps {
  categories: Category[];
  initialData: Clip | null;
  activeCategoryId: string;
  onSave: (data: ClipFormData) => void;
  onCancel: () => void;
}

export const ClipForm: React.FC<ClipFormProps> = ({ 
  categories, 
  initialData, 
  activeCategoryId, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || activeCategoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content, categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">タイトル</label>
        <input 
          autoFocus
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          placeholder="例: メール挨拶"
        />
      </div>
      
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">カテゴリ</label>
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">内容 (コピーされるテキスト)</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm placeholder:text-slate-600 resize-none"
          placeholder="コピーしたい文章を入力..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          キャンセル
        </button>
        <button 
          type="submit" 
          disabled={!title.trim() || !content.trim()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
        >
          保存する
        </button>
      </div>
    </form>
  );
};

interface CategoryFormProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">カテゴリ名</label>
        <input 
          autoFocus
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          placeholder="例: プロジェクトA用"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          キャンセル
        </button>
        <button 
          type="submit" 
          disabled={!name.trim()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
        >
          追加する
        </button>
      </div>
    </form>
  );
};