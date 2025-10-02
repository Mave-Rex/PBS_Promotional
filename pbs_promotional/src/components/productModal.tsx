"use client";
import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
        )}
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
