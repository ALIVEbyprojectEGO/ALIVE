"use client";

import { useEffect, useState } from "react";

/** true on desktop with a real mouse cursor */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const fn = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return fine;
}
