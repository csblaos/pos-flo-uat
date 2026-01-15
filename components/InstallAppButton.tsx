"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function detectIos(userAgent: string) {
  return /iphone|ipad|ipod/i.test(userAgent);
}

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [canPromptInstall, setCanPromptInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isIOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return detectIos(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => {
      const iosStandalone = (navigator as { standalone?: boolean }).standalone === true;
      setIsInstalled(mediaQuery.matches || iosStandalone);
    };

    updateInstalled();
    mediaQuery.addEventListener("change", updateInstalled);
    window.addEventListener("appinstalled", updateInstalled);

    return () => {
      mediaQuery.removeEventListener("change", updateInstalled);
      window.removeEventListener("appinstalled", updateInstalled);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setCanPromptInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (isInstalled) return null;
  if (!isIOS && !canPromptInstall) return null;

  const handleClick = async () => {
    if (isIOS) {
      setIsModalOpen(true);
      return;
    }

    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanPromptInstall(false);
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full rounded-2xl text-base shadow-lg shadow-cyan-500/20 md:w-auto"
        onClick={() => void handleClick()}
      >
        Install App
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="flex items-start justify-between gap-4">
            <DialogTitle>Install on iPhone</DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-3 text-sm text-white/70">
            <p>iOS does not support automatic install prompts.</p>
            <ol className="list-decimal space-y-2 pl-5 text-white">
              <li>Tap the Share icon</li>
              <li>Tap “Add to Home Screen”</li>
              <li>Tap “Add”</li>
            </ol>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button size="lg" className="w-full md:w-auto">
                OK
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/*
Example usage:
import InstallAppButton from "../components/InstallAppButton";

function Header() {
  return (
    <header>
      <InstallAppButton />
    </header>
  );
}
*/
