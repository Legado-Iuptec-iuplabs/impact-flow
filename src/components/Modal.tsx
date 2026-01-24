import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirmar',
  onConfirm,
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0A0F14]/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-[#121820] rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-slate-800 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black text-[#F1F5F9] mb-4">{title}</h3>
        {children}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase text-[10px] tracking-widest"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 bg-[#FDB913] text-[#0A0F14] rounded-2xl font-black shadow-lg hover:bg-[#FDB913]/90 transition-all uppercase text-[10px] tracking-widest"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};