"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/useFinePointer";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    document.body.classList.add("custom-cursor");
    const dot = dotRef.current!;
    let tx = -100, ty = -100, x = -100, y = -100, s = 1, ts = 1, raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      ts = t.closest("[data-cursor], a, button") ? 2.2 : 1;
    };
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      s += (ts - s) * 0.15;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${s})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2.5 w-2.5 rounded-full bg-ink mix-blend-difference"
      style={{ background: "var(--ink)" }}
    />
  );
}
