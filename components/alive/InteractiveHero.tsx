"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Character from "./Character";
import Doodles from "./Doodles";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function InteractiveHero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      // intro
      gsap.from("[data-hero-title] span", {
        yPercent: 110,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from("[data-hero-sub]", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.9,
        ease: "power2.out",
      });
      gsap.from("[data-hero-char]", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
      });

      // scroll: distractions multiply, title drifts, character sinks
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to("[data-hero-title]", { yPercent: -30, opacity: 0.15, ease: "none" }, 0)
        .to("[data-hero-char]", { y: 120, scale: 0.9, ease: "none" }, 0)
        .to("[data-hero-sub]", { opacity: 0, yPercent: -20, ease: "none" }, 0)
        .fromTo(
          "[data-noise]",
          { opacity: 0, scale: 0.4 },
          { opacity: 0.9, scale: 1, stagger: 0.06, ease: "none" },
          0.15
        );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[110vh] flex-col overflow-hidden"
    >
      <Doodles />

      {/* editorial title block — off-center */}
      <div className="relative z-10 mt-[12vh] pl-[6vw] md:mt-[12vh]">
        <h1
          data-hero-title
          className="font-display leading-[0.82] tracking-tight text-ink"
        >
          <span className="block overflow-hidden text-[24vw] md:text-[17vw]">
            <span className="block">ALIVE.</span>
          </span>
        </h1>
        <p
          data-hero-sub
          className="mt-8 max-w-[62vw] font-display text-[8vw] leading-[1.02] text-ink md:max-w-xl md:text-[3.4vw]"
        >
          WAKE UP
          <br />
          TO <span className="text-alive">REALITY.</span>
          <br />
          <span className="mt-4 block">
            LEAVE
            <br />
            YOUR <span className="text-alive">PHONE.</span>
          </span>
        </p>
      </div>

      {/* character — right side, overlapping the title */}
      <div
        data-hero-char
        className="absolute right-[4vw] top-[38vh] w-[42vw] max-w-[320px] md:top-[24vh] md:w-[24vw]"
      >
        <Character pose="phone" interactive />
        {/* frustrated thought bubble above the head, pops on loop */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[38%] left-1/2 w-[62%] -translate-x-1/2"
          style={{
            animation: "frustrated-pop 3.2s ease-in-out infinite",
            transformOrigin: "50% 100%",
          }}
        >
          <svg viewBox="0 0 120 100" className="h-auto w-full overflow-visible">
            {/* pointer dots toward the head */}
            <circle cx="60" cy="86" r="3.5" fill="none" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="52" cy="95" r="2.5" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            {/* bubble */}
            <path
              d="M60 6 C 90 4 112 20 112 40 C 112 58 92 70 62 70 C 46 70 34 66 24 58 C 12 48 8 36 14 24 C 22 10 40 8 60 6 Z"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* tangled scribble inside */}
            <path
              d="M34 44 q 6 -18 18 -12 q 16 8 30 -6 q 8 -8 4 4 q -4 14 -22 10 q -20 -4 -26 8 q -4 10 12 6 q 18 -4 26 2 q 8 6 -10 8 q -22 2 -30 -8 q -6 -8 4 -14"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* small teal lightning */}
            <path
              d="M66 16 l -6 10 h 7 l -8 12"
              fill="none"
              stroke="var(--alive)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* extra digital noise appearing on scroll */}
        <div className="pointer-events-none absolute inset-0">
          {["#", "@", "!", "♥", "▶"].map((s, i) => (
            <span
              key={i}
              data-noise
              className="font-hand absolute text-3xl md:text-5xl"
              style={{
                left: `${[-30, 90, -20, 100, 40][i]}%`,
                top: `${[10, 0, 60, 50, -25][i]}%`,
                color: i % 2 ? "var(--alive)" : "var(--ink)",
                opacity: 0,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div className="font-hand absolute bottom-8 left-1/2 -translate-x-1/2 rotate-[-2deg] text-xl text-ink/60">
        scroll ↓
      </div>
    </section>
  );
}
