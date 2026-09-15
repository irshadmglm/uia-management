import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, X, Trash2 } from 'lucide-react';

const ConfirmPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  variant = "danger",
  confirmText,
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  // Variant Configuration
  const variants = {
    danger: {
      icon: Trash2,
      iconBg: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      btnClass: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 dark:shadow-none",
      defaultConfirmText: "Delete"
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      btnClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200 dark:shadow-none",
      defaultConfirmText: "Proceed"
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-none",
      defaultConfirmText: "Confirm"
    }
  };

  const config = variants[variant] || variants.info;
  const Icon = config.icon;
  const finalConfirmText = confirmText || config.defaultConfirmText;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
          exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15, ease: "easeIn" } }}
          className="relative bg-white dark:bg-[#11322f] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#0d2522]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#0d2522] transition-colors"
          >
            <X size={18} />
          </button>

          <div className="p-6 pt-8 text-center flex flex-col items-center">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mb-5 rotate-3`}>
              <Icon size={32} className={config.iconColor} />
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#0a1f1d] hover:bg-gray-200 dark:hover:bg-[#0d2522] rounded-2xl transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all active:scale-[0.98] ${config.btnClass}`}
            >
              {finalConfirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmPopup;