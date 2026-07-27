import { useEffect, useState } from 'react';
import { Smartphone, X } from 'lucide-react';

const DISMISSED_KEY = 'medbook_install_dismissed';

function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream
  );
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return;

    if (isIOS()) {
      setIos(true);
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShow(false);
      localStorage.setItem(DISMISSED_KEY, 'true');
    });
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up">
      <div className="rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-sm">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              Install MedBook
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {ios
                ? 'Tap the Share button, then scroll down and tap "Add to Home Screen".'
                : 'Install this app on your device for a faster experience.'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {ios ? (
                <button
                  onClick={handleDismiss}
                  className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  Got it
                </button>
              ) : (
                <button
                  onClick={handleInstall}
                  className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  Install
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
