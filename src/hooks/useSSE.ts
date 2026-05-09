"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  return document.cookie.match(/pacul_token=([^;]+)/)?.[1] ?? null;
}

export function useSSE() {
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    if (typeof EventSource === "undefined") return;

    const es = new EventSource(`${API_URL}/sse/stream?token=${token}`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "notifications") {
          console.info("[SSE] New notifications:", data.data?.length);
          // Dispatch to any registered store handlers here
        }

        if (data.type === "xp_update") {
          console.info("[SSE] XP update:", data.xp);
        }
      } catch {
        // ignore malformed messages
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, []);
}
