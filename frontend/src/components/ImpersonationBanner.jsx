import React from "react";
import { ShieldAlert, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ImpersonationBanner = () => {
  const { authUser, stopImpersonate } = useAuthStore();

  if (!authUser?.isImpersonating) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-md z-50 relative">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-lg border border-white/30">
          <ShieldAlert size={16} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-widest uppercase">
          Impersonation Mode <span className="inline-block w-2 h-2 bg-yellow-200 rounded-full ml-1 animate-pulse shadow-[0_0_8px_rgba(253,230,138,0.8)]"></span>
        </span>
      </div>
      
      <button
        onClick={stopImpersonate}
        className="flex items-center gap-1.5 bg-white text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-full font-bold text-xs shadow-sm transition-colors"
      >
        <X size={14} />
        EXIT
      </button>
    </div>
  );
};

export default ImpersonationBanner;
