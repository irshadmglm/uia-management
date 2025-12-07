import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";
import InstallPrompt from "./components/InstallPrompt";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();            
      setDeferredPrompt(e);         
      setShowInstallPrompt(true);  
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isCheckingAuth) {
    return (
        <div className="flex items-center justify-center h-screen relative bg-gray-900">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900 dark:border-gray-100" />
          <img
            src="/web-app-manifest-192x192.png"
            alt="Logo"
            className="absolute h-12 w-12"
          />
        </div>
      );

  }

  return (
    <div data-theme={theme}>
      <AppRoutes />
      <Toaster />

      {showInstallPrompt && deferredPrompt && (
        <InstallPrompt
          deferredPrompt={deferredPrompt}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </div>
  );
}

export default App;
