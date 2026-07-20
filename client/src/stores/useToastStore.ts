import { create } from "zustand";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";


export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}


interface ToastStore {
  toasts: Toast[];

  showToast: (
    toast: Omit<Toast, "id">
  ) => void;

  removeToast: (
    id: number
  ) => void;
}


export const useToastStore = create<ToastStore>((set) => ({

  toasts: [],


  showToast: (toast) => {

    const id = Date.now();


    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          ...toast,
        },
      ],
    }));


    // auto remove after 4 seconds

    setTimeout(() => {

      set((state) => ({
        toasts: state.toasts.filter(
          (item) => item.id !== id
        ),
      }));

    }, 4000);

  },


  removeToast: (id) => {

    set((state) => ({
      toasts: state.toasts.filter(
        (item) => item.id !== id
      ),
    }));

  },


}));