import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onClose,
  onConfirm,
  message = "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet élément ?",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-7 animate-scaleIn">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#146C2D]/10">
            <FiTrash2 className="text-[#146C2D]" size={26} />
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-center text-xl font-semibold text-gray-900">
          Confirmer la suppression
        </h3>

        {/* Message */}
        <p className="mt-2 text-center text-sm text-gray-600 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-7 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700
              hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Annuler
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#146C2D] text-white font-semibold
              hover:bg-[#0a3d19] transition shadow-md
              focus:outline-none focus:ring-2 focus:ring-[#146C2D]/40"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};
