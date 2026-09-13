"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/useFinePointer";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Floating hand-drawn distraction symbols with cursor parallax. */
export default function Doodles() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced || !ref.current) return;
    const layers = Array.from(
      ref.current.querySelectorAll<HTMLElement>("[data-depth]")
    );
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const loop = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      for (const el of layers) {
        const d = parseFloat(el.dataset.depth || "1");
        el.style.transform = `translate(${cx * d * 30}px, ${cy * d * 30}px) rotate(${cx * d * 6}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  const items: { x: string; y: string; depth: number; el: React.ReactNode }[] = [
    {
      x: "12%", y: "22%", depth: 1.4,
      el: (
        <svg viewBox="0 0 60 60" className="w-12 md:w-16">
          <path d="M30 6 L35 22 L52 22 L38 32 L43 50 L30 39 L17 50 L22 32 L8 22 L25 22 Z" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      x: "82%", y: "18%", depth: 0.8,
      el: (
        <svg viewBox="0 0 60 40" className="w-14 md:w-20">
          <path d="M6 8 Q 30 2 54 8 Q 58 20 54 32 Q 30 38 6 32 Q 2 20 6 8 Z" fill="none" stroke="var(--alive)" strokeWidth="3.5" />
          <path d="M16 16 h 20 M16 24 h 12" stroke="var(--alive)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      x: "88%", y: "58%", depth: 1.8,
      el: (
        <svg viewBox="0 0 50 50" className="w-10 md:w-14">
          <path d="M8 8 L42 42 M42 8 L8 42" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      x: "8%", y: "62%", depth: 1.1,
      el: (
        <svg viewBox="0 0 50 60" className="w-10 md:w-14">
          <path d="M25 4 C 36 4 44 14 44 26 C 44 34 38 40 32 44 L 32 52 L 18 52 L 18 44 C 12 40 6 34 6 26 C 6 14 14 4 25 4 Z" fill="none" stroke="var(--ink)" strokeWidth="3.5" />
          <path d="M20 58 h 10" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      x: "70%", y: "80%", depth: 0.6,
      el: (
        <svg viewBox="0 0 60 30" className="w-14 md:w-20">
          <path d="M4 15 q 8 -12 16 0 q 8 12 16 0 q 8 -12 16 0" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      x: "28%", y: "84%", depth: 1.5,
      el: (
        <svg viewBox="0 0 60 60" className="w-12 md:w-16">
          <circle cx="30" cy="30" r="24" fill="none" stroke="var(--alive)" strokeWidth="3.5" strokeDasharray="6 8" />
          <path d="M30 18 v 14 l 10 6" fill="none" stroke="var(--alive)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <div
          key={i}
          data-depth={it.depth}
          className="absolute"
          style={{ left: it.x, top: it.y }}
        >
          {it.el}
        </div>
      ))}
    </div>
  );
}
