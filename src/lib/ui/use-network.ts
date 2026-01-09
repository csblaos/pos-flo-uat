"use client";

import { useEffect, useMemo, useState } from "react";

export type NetworkGrade = "great" | "ok" | "poor" | "offline";

export function useNetworkStatus() {
  const [online, setOnline] = useState<boolean>(true);
  const [grade, setGrade] = useState<NetworkGrade>("great");
  const [rtt, setRtt] = useState<number | null>(null);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    async function heartbeat() {
      if (!navigator.onLine) {
        setGrade("offline");
        setRtt(null);
        return;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2500);
      const start = performance.now();

      try {
        await fetch("/api/health", { signal: controller.signal });
        const elapsed = performance.now() - start;
        setRtt(elapsed);
        if (elapsed < 300) {
          setGrade("great");
        } else if (elapsed < 800) {
          setGrade("ok");
        } else {
          setGrade("poor");
        }
      } catch {
        setGrade("poor");
      } finally {
        window.clearTimeout(timeout);
      }
    }

    heartbeat();
    interval = window.setInterval(heartbeat, 12000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    // @ts-expect-error - Network Information API is experimental.
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return;

    const handleChange = () => {
      if (!navigator.onLine) {
        setGrade("offline");
        return;
      }
      const effectiveType = connection.effectiveType as string | undefined;
      if (effectiveType === "4g") {
        setGrade("great");
      } else if (effectiveType === "3g") {
        setGrade("ok");
      } else {
        setGrade("poor");
      }
    };

    connection.addEventListener("change", handleChange);
    handleChange();

    return () => connection.removeEventListener("change", handleChange);
  }, []);

  const label = useMemo(() => {
    if (!online) return "Offline";
    if (grade === "great") return "ดีมาก";
    if (grade === "ok") return "ปานกลาง";
    return "สัญญาณอ่อน";
  }, [grade, online]);

  return { online, grade, label, rtt };
}
