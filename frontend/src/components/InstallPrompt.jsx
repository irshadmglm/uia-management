import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Zap, WifiOff, Bell } from "lucide-react";

const InstallPrompt = ({ deferredPrompt, onClose }) => {
  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      onClose();
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white dark:bg-[#11322f] w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-gray-100 dark:border-[#0d2522]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ y: 80, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-600" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#0d2522] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-teal to-sky-500 flex items-center justify-center shadow-lg shrink-0">
              <span className="text-2xl font-black text-white">U</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                UIA Academics
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Install for the best experience</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-[#0d2522] mx-6" />

          {/* Features */}
          <div className="px-6 py-4 space-y-3">
            {[
              { icon: Zap, label: "Faster loading & better performance", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
              { icon: WifiOff, label: "Works offline – access anytime", color: "text-sky-500 bg-sky-50 dark:bg-sky-900/20" },
              { icon: Bell, label: "Get important notifications instantly", color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${color} shrink-0`}>
                  <Icon size={15} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 pt-2 flex flex-col gap-2.5">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white text-sm font-bold rounded-2xl transition-all shadow-md active:scale-[0.98]"
            >
              <Download size={17} />
              Install App
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-2xl hover:bg-gray-50 dark:hover:bg-[#0d2522]"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;

