"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  id: string;
  className?: string;
  /** false → static section, no pin/scrub */
  scrub?: boolean;
  children: (progress: number) => React.ReactNode;
};

/** Pinned full-screen section; children receive scroll progress 0..1. */
export default function StorySection({
  id,
  className = "",
  scrub = true,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();
  const active = scrub && !reduced;

  useEffect(() => {
    if (!active || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {children(active ? progress : 1)}
    </section>
  );
}
