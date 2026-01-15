"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIosUserAgent(userAgent: string) {
  return /iphone|ipad|ipod/i.test(userAgent);
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const isIos = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return isIosUserAgent(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => setIsInstalled(mediaQuery.matches);
    updateInstalled();

    mediaQuery.addEventListener("change", updateInstalled);
    return () => mediaQuery.removeEventListener("change", updateInstalled);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const shouldShowButton = !isInstalled && (isIos || Boolean(deferredPrompt));
  if (!shouldShowButton) return null;

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosHelp(true);
      return;
    }

    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full rounded-2xl text-base md:w-auto"
        onClick={() => void handleInstallClick()}
      >
        Install App
      </Button>
      <Dialog open={showIosHelp} onOpenChange={setShowIosHelp}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Install on iPhone</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-white/70">
            <p>Safari (or iOS Chrome/Firefox) does not support auto-install.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Tap Share → Add to Home Screen</p>
              <p className="mt-2 text-xs text-white/60">
                This pins the POS app to your Home Screen for quick access.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
