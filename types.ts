export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Clip {
  id: string;
  categoryId: string;
  title: string;
  content: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export interface ClipFormData {
  title: string;
  content: string;
  categoryId: string;
}