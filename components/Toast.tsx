import React from 'react';
import { Check, X } from 'lucide-react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => (
  <div 
    className={`
      fixed bottom-8 right-8 z-50 transform transition-all duration-500 ease-out flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border
      ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
      ${toast.type === 'success' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-red-600 border-red-500 text-white'}
    `}
  >
    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
    <span className="font-medium text-sm">{toast.message}</span>
  </div>
);