"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Chromium fires this before showing its own install UI; it's not in
// lib.dom.d.ts since it's non-standard, so it's typed locally.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Mounted only in the admin layout header — the "Install app" affordance is
// admin-only by request, even though the manifest/service worker
// (src/app/manifest.ts, src/app/sw.js) are still registered at the app
// root, not admin-scoped, so admin installability doesn't depend on which
// page the admin happened to log in from.
export function PwaRegister({ className }: { className?: string }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // No offline fallback / install prompt this session — not worth surfacing.
      });
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!installPrompt) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      title="Install app"
      onClick={async () => {
        await installPrompt.prompt();
        setInstallPrompt(null);
      }}
    >
      <Download className="size-3.5" />
      <span className="hidden sm:inline">Install app</span>
    </Button>
  );
}
