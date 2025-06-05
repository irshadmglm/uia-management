import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
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
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
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
