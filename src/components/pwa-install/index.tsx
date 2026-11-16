import { useState } from "react";
import { Download, Smartphone, Share, PlusSquare, X, WifiOff } from "lucide-react";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export function PwaInstallButton({ className = "" }: { className?: string }) {
  const { canInstall, isInstalled, isIos, promptInstall } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  // If already running inside installed standalone app, don't show
  if (isInstalled) {
    return null;
  }

  // If browser doesn't support beforeinstallprompt and it's not iOS, hide
  if (!canInstall && !isIos) {
    return null;
  }

  const handleClick = async () => {
    if (canInstall) {
      await promptInstall();
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={[
          "inline-flex items-center gap-1.5 rounded-xl border border-pink-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#8B1447] shadow-2xs hover:bg-[#FFF4F7] hover:border-pink-300 transition-all cursor-pointer active:scale-95",
          className,
        ].join(" ")}
        title="Install Salora POS App on this device"
      >
        <Download className="size-3.5 text-[#D81B60]" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {/* iOS Safari Installation Modal Guide */}
      {showIosGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-slate-800 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-pink-50 text-[#D81B60]">
                  <Smartphone className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Install Salora on iOS</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="size-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-[#D81B60]">
                  1
                </span>
                <p>
                  Tap the <strong className="text-slate-800 inline-flex items-center gap-1">Share <Share className="inline size-3.5 text-blue-500" /></strong> button in Safari's bottom toolbar.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-[#D81B60]">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-slate-800 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="inline size-3.5 text-slate-700" /></strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full rounded-xl bg-[#8B1447] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#6e0f37] transition active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-900/90 text-amber-100 backdrop-blur-md px-4 py-1.5 text-xs font-medium shadow-lg border border-amber-500/30 animate-pulse"
    >
      <WifiOff className="size-3.5 text-amber-300" />
      <span>Offline Mode – Viewing cached data</span>
    </div>
  );
}
