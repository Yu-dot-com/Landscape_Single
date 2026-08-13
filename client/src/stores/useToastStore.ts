import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';

type ToastType = "success" | "error" | "warning" | "info";


interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}


interface ToastStore {

  toasts: Toast[];

  addToast: (
    toast: Omit<Toast,"id">
  ) => void;

  removeToast: (
    id:string
  ) => void;

}



export const useToastStore = create<ToastStore>((set)=>({

  toasts: [],


  addToast:(toast)=>{

    const id = uuidv4();


    set((state)=>({
      toasts:[
        ...state.toasts,
        {
          id,
          ...toast
        }
      ]
    }));


    // auto remove after 3 seconds
    setTimeout(()=>{

      set((state)=>({
        toasts:
          state.toasts.filter(
            (item)=>item.id !== id
          )
      }));

    },3000);

  },



  removeToast:(id)=>{

    set((state)=>({
      toasts:
        state.toasts.filter(
          (toast)=>toast.id !== id
        )
    }));

  }

}));