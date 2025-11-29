import React, { useState, useEffect } from 'react';
import { 
  Menu,
  ChevronRight,
  Search,
  Plus,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';

import { Category, Clip, ToastState, ClipFormData } from './types';
import { generateId, copyToClipboard } from './utils';
import { Sidebar } from './components/Sidebar';
import { Modal } from './components/Modal';
import { ClipForm, CategoryForm } from './components/Forms';
import { Toast } from './components/Toast';

// --- 初期データ ---
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'メール定型文', icon: 'mail' },
  { id: 'cat_2', name: 'コードスニペット', icon: 'code' },
  { id: 'cat_3', name: '署名・住所', icon: 'user' },
  { id: 'cat_4', name: 'ハッシュタグ', icon: 'hash' },
];

const INITIAL_CLIPS: Clip[] = [
  { id: 'clip_1', categoryId: 'cat_1', title: 'お世話になっております', content: 'いつも大変お世話になっております。\n株式会社〇〇の田中です。' },
  { id: 'clip_2', categoryId: 'cat_1', title: '日程調整のお願い', content: '以下の日程でご都合はいかがでしょうか。\n\n・〇月〇日（月） 10:00 - 18:00\n・〇月〇日（火） 13:00 - 16:00' },
  { id: 'clip_3', categoryId: 'cat_2', title: 'React Component', content: 'const Component = () => {\n  return <div>Hello World</div>;\n};' },
  { id: 'clip_4', categoryId: 'cat_3', title: 'オフィス住所', content: '〒100-0000\n東京都千代田区〇〇 1-2-3\n〇〇ビル 5F' },
];

export default function App() {
  // State
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(INITIAL_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Modals State
  const [showAddClipModal, setShowAddClipModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedCats = localStorage.getItem('sm_categories');
    const savedClips = localStorage.getItem('sm_clips');
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }
    if (savedClips) {
      try {
        setClips(JSON.parse(savedClips));
      } catch (e) {
        console.error("Failed to parse clips", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('sm_categories', JSON.stringify(categories));
    localStorage.setItem('sm_clips', JSON.stringify(clips));
  }, [categories, clips]);

  // Actions
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      showToast('クリップボードにコピーしました');
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  const handleDeleteClip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('このクリップを削除してもよろしいですか？')) {
      setClips(clips.filter(c => c.id !== id));
      showToast('クリップを削除しました', 'success');
    }
  };

  const handleDeleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) {
      showToast('最後のカテゴリは削除できません', 'error');
      return;
    }
    if (window.confirm('カテゴリ内の全クリップも削除されます。よろしいですか？')) {
      setCategories(categories.filter(c => c.id !== id));
      setClips(clips.filter(c => c.categoryId !== id));
      if (activeCategoryId === id) {
        // Fallback to the first available category if active one is deleted
        const remaining = categories.filter(c => c.id !== id);
        if (remaining.length > 0) {
          setActiveCategoryId(remaining[0].id);
        }
      }
      showToast('カテゴリを削除しました', 'success');
    }
  };

  const handleSaveClip = (data: ClipFormData) => {
    if (editingClip) {
      setClips(clips.map(c => c.id === editingClip.id ? { ...c, ...data } : c));
      showToast('クリップを更新しました');
    } else {
      setClips([{ id: generateId(), ...data }, ...clips]);
      showToast('クリップを追加しました');
    }
    setShowAddClipModal(false);
  };

  const handleSaveCategory = (name: string) => {
    const newCat: Category = { id: generateId(), name, icon: 'folder' };
    setCategories([...categories, newCat]);
    setActiveCategoryId(newCat.id);
    showToast('カテゴリを作成しました');
    setShowAddCategoryModal(false);
  };

  // Filter Logic
  const filteredClips = clips.filter(clip => {
    const matchesCategory = clip.categoryId === activeCategoryId;
    const matchesSearch = clip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clip.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryName = categories.find(c => c.id === activeCategoryId)?.name || 'カテゴリ';

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onAddCategory={() => setShowAddCategoryModal(true)}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 relative">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center text-sm text-slate-400">
              <span className="hidden sm:inline">ライブラリ</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span className="text-slate-100 font-semibold">{activeCategoryName}</span>
              <span className="ml-3 px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-500 border border-slate-700">
                {filteredClips.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text"
                placeholder="クリップを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-slate-950/50 border border-slate-700 text-sm rounded-full pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <button 
              onClick={() => {
                setEditingClip(null);
                setShowAddClipModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">新規作成</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {filteredClips.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-4 border border-slate-700/50">
                <Search size={32} className="opacity-20" />
              </div>
              <p className="text-lg font-medium text-slate-400">クリップが見つかりません</p>
              <p className="text-sm mt-2 opacity-60">右上のボタンから新しいクリップを追加してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredClips.map(clip => (
                <div 
                  key={clip.id}
                  onClick={() => handleCopy(clip.content)}
                  className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col h-48"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-200 truncate pr-8">{clip.title}</h3>
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingClip(clip); setShowAddClipModal(true); }}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="編集"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClip(clip.id, e)}
                        className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative">
                    <p className="text-sm text-slate-400 font-mono leading-relaxed whitespace-pre-wrap break-all">
                      {clip.content}
                    </p>
                    {/* Fade effect at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-800/90 to-transparent pointer-events-none group-hover:from-slate-800/80"></div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Copy size={12} />
                      クリックしてコピー
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="py-3 text-center text-xs text-slate-500 border-t border-slate-800/30">
          ©toyosystem
        </div>

      </main>

      {/* Toast Notification */}
      <Toast toast={toast} />

      {/* Modals */}
      {showAddClipModal && (
        <Modal onClose={() => setShowAddClipModal(false)} title={editingClip ? "クリップを編集" : "新規クリップ作成"}>
          <ClipForm 
            categories={categories}
            initialData={editingClip}
            activeCategoryId={activeCategoryId}
            onSave={handleSaveClip}
            onCancel={() => setShowAddClipModal(false)}
          />
        </Modal>
      )}

      {showAddCategoryModal && (
        <Modal onClose={() => setShowAddCategoryModal(false)} title="新しいカテゴリ">
          <CategoryForm 
            onSave={handleSaveCategory}
            onCancel={() => setShowAddCategoryModal(false)}
          />
        </Modal>
      )}

    </div>
  );
}