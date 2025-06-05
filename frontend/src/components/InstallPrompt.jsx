import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InstallPrompt = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setVisible(false);
      onClose();
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Install UIA Academics App
            </h2>
            <p className="mb-6 text-gray-600">
              Install this app on your device for a better experience and quick access.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleInstallClick}
                className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Install
              </button>
              <button
                onClick={() => {
                  setVisible(false);
                  onClose();
                }}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
