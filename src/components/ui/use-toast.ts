// Inspired by react-hot-toast library
import * as React from "react";

type ToastActionElement = React.ReactElement<unknown>;

export type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "default" | "destructive";
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "default" | "destructive";
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toasts: ToasterToast[] = [];

type Toast = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

const listeners: Array<(toasts: ToasterToast[]) => void> = [];

function emitChange() {
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

function addToast(toast: Toast) {
  const id = genId();

  toasts.push({
    id,
    open: true,
    onOpenChange: () => {},
    ...toast,
  });
  emitChange();

  return id;
}

function dismissToast(toastId: string) {
  const index = toasts.findIndex((toast) => toast.id === toastId);
  if (index > -1) {
    toasts[index].open = false;
    emitChange();
  }
}

function updateToast(toastId: string, toast: Toast) {
  const index = toasts.findIndex((t) => t.id === toastId);
  if (index > -1) {
    toasts[index] = { ...toasts[index], ...toast };
    emitChange();
  }
}

function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>([]);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    dismiss: dismissToast,
    update: updateToast,
    toasts: state,
    toast: (props: Toast) => {
      return addToast(props);
    },
  };
}

export { useToast, dismissToast };

// For convenience, also expose a simple toast function
export function toast(props: Toast) {
  return addToast(props);
}
