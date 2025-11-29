import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div 
      className="bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all scale-100 animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);