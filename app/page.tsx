"use client";

import InteractiveHero from "@/components/alive/InteractiveHero";
import StorySection from "@/components/alive/StorySection";
import Character from "@/components/alive/Character";
import CustomCursor from "@/components/alive/CustomCursor";
import LenisProvider from "@/components/alive/LenisProvider";
import PhoneFeed from "@/components/alive/PhoneFeed";
import LifeMoments from "@/components/alive/LifeMoments";

export default function Home() {
  return (
    <LenisProvider>
      <CustomCursor />
      <main className="relative">
        <InteractiveHero />

        {/* 02 — DISTRACTION */}
        <StorySection id="distraction" className="bg-paper">
          {(p) => {
            const noiseCount = 9;
            return (
              <div className="relative flex h-full w-full flex-col overflow-hidden">
                {/* text: own layer, top half, noise never enters */}
                <div className="relative z-20 flex flex-1 items-center justify-center px-6 pb-[38vh]">
                  <h2 className="max-w-5xl text-center font-display text-[9vw] leading-[0.95] md:text-[6vw]">
                    HOW MUCH OF
                    <br />
                    YOUR LIFE ARE YOU
                    <br />
                    <span className="text-alive">ACTUALLY</span> LIVING?
                  </h2>
                </div>
                {/* character overwhelmed, anchored bottom, in front of noise */}
                <div className="absolute bottom-[4vh] left-1/2 z-10 w-48 -translate-x-1/2 md:w-64">
                  <Character pose="overwhelmed" />
                </div>
                {/* noise swarm: only in the character's zone, closing in on him */}
                {Array.from({ length: noiseCount }).map((_, i) => {
                  const angle = (i / noiseCount) * Math.PI * 2;
                  const r = 30 - p * 15; // closes in
                  // round to avoid server/client float mismatch
                  const x = +(50 + Math.cos(angle) * r).toFixed(2);
                  const y = +(74 + Math.sin(angle) * (r * 0.55)).toFixed(2);
                  const rot = +(Math.sin(i * 7) * 20).toFixed(2);
                  return (
                    <span
                      key={i}
                      className="font-hand absolute z-[5] text-2xl md:text-4xl"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${+(0.6 + p).toFixed(3)})`,
                        opacity: Math.min(1, p * 1.6),
                        color: i % 3 === 0 ? "var(--alive)" : "var(--ink)",
                      }}
                    >
                      {["!", "♥", "▶", "@", "#", "?", "✉", "♪", "%"][i]}
                    </span>
                  );
                })}
                {/* screen-time number, part of the artwork */}
                <div
                  className="font-hand absolute bottom-[30vh] right-[5%] z-20 rotate-[-6deg] text-5xl md:text-7xl"
                  style={{ opacity: Math.max(0, (p - 0.5) * 2) }}
                >
                  <span className="text-alive">4h</span> 37m
                  <svg viewBox="0 0 120 30" className="mt-1 w-full">
                    <path
                      d="M5 18 Q 35 8 65 16 T 115 14"
                      fill="none"
                      stroke="var(--alive)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          }}
        </StorySection>

        {/* 02b — THE LOOP */}
        <StorySection id="loop" className="bg-paper">
          {(p) => (
            <div className="relative flex h-full w-full flex-col-reverse justify-center gap-10 px-6 md:flex-row md:items-center md:gap-16 md:px-[8vw]">
              <div className="max-w-xl">
                <p className="font-hand text-2xl text-ink/60">02 — the loop</p>
                <h2 className="mt-2 font-display text-[13vw] leading-[0.9] md:text-[5.5vw]">
                  UNCONSCIOUS
                  <br />
                  SCROLLING<span className="text-alive">.</span>
                </h2>
                <p className="font-hand mt-5 text-2xl text-alive md:text-3xl">
                  * the infinite scroll, designed to never let you go.
                </p>
                <ul className="mt-8 space-y-5">
                  {[
                    ["Dopamine exhaustion", "micro-hits drain motivation for real life."],
                    ["Fragmented attention", "your brain adapts to 15-second stimuli."],
                    ["Passive anxiety", "endless feeds keep stress quietly elevated."],
                  ].map(([title, sub]) => (
                    <li key={title} className="flex gap-3">
                      <span className="mt-1 font-display text-alive">✕</span>
                      <div>
                        <span className="font-hand text-2xl md:text-3xl">{title}</span>
                        <span className="font-hand block text-xl leading-snug text-ink/60 md:text-2xl">
                          {sub}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="font-hand mt-10 text-xl italic text-ink/50 md:text-2xl">
                  &ldquo;Opened for 30 seconds. Closed 2 hours later.&rdquo;
                </p>
              </div>
              <div className="mx-auto w-36 shrink-0 md:w-72" style={{ opacity: Math.min(1, p * 2) }}>
                <PhoneFeed />
              </div>
            </div>
          )}
        </StorySection>

        {/* 03 — THE ENEMY? (no character — phone as the subject) */}
        <StorySection id="enemy" className="bg-paper">
          {(p) => (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6">
              <h2 className="relative z-10 max-w-5xl text-center font-display text-[10vw] leading-[0.95] md:text-[6.5vw]">
                THE PHONE IS NOT
                <br />
                THE <span className="text-alive">ENEMY.</span>
              </h2>
              <p
                className="font-hand mt-6 max-w-md text-center text-2xl text-ink/70 md:text-3xl"
                style={{ opacity: Math.max(0, (p - 0.35) * 2) }}
              >
                losing the choice — that&rsquo;s the problem.
              </p>
              {/* big hand-drawn phone, screen drains from teal to paper as you scroll */}
              <div className="mt-6 w-32 md:w-56">
                <svg viewBox="0 0 140 250" className="h-auto w-full overflow-visible">
                  <rect x="4" y="4" width="132" height="242" rx="22" fill="var(--paper)" stroke="var(--ink)" strokeWidth="6" />
                  <path d="M52 16 h 36" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
                  <rect x="16" y="28" width="108" height="200" rx="10" fill="var(--alive)" opacity={0.5 * (1 - p)} stroke="var(--ink)" strokeWidth="3" />
                  {/* cracks fading in */}
                  <g opacity={Math.max(0, (p - 0.4) * 1.8)} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M40 60 L 62 92 L 52 120 M62 92 L 88 84" />
                    <path d="M96 150 L 78 178 L 90 206" />
                  </g>
                  {/* power button highlighted near the end */}
                  <g opacity={Math.max(0, (p - 0.65) * 3)}>
                    <rect x="136" y="80" width="6" height="30" rx="3" fill="var(--alive)" />
                    <path d="M150 84 q 12 10 0 22" fill="none" stroke="var(--alive)" strokeWidth="3.5" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          )}
        </StorySection>

        {/* 03b — AWARENESS */}
        <StorySection id="awareness" className="bg-paper">
          {(p) => (
            <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
              {/* phone falls away */}
              <div
                className="absolute left-[12%] top-[18%] w-16 md:w-24"
                style={{
                  transform: `rotate(${p * -160}deg) translate(${p * -140}px, ${p * 180}px)`,
                  opacity: 1 - p,
                }}
              >
                <svg viewBox="-15 -25 90 160" className="w-full">
                  <rect
                    x="5"
                    y="-10"
                    width="52"
                    height="92"
                    rx="10"
                    fill="#2a2a2a"
                    stroke="var(--ink)"
                    strokeWidth="5"
                  />
                  <rect x="12" y="0" width="38" height="66" rx="4" fill="var(--alive)" opacity="0.5" />
                </svg>
              </div>
              <h2
                className="text-center font-display text-[10vw] leading-none md:text-[7vw]"
                style={{ opacity: Math.min(1, p * 2.2) }}
              >
                WHERE DID
                <br />
                YOUR <span className="font-hand font-normal text-alive">time</span> GO?
              </h2>
              {/* character sitting, head turning up — left side this time */}
              <div
                className="mt-10 w-44 self-start md:ml-[10vw] md:w-56"
                style={{
                  transform: `translateY(${(1 - p) * 60}px)`,
                  opacity: Math.min(1, p * 1.8),
                }}
              >
                <Character pose="aware" interactive={false} />
              </div>
            </div>
          )}
        </StorySection>

        {/* 04 — THE CHOICE (character left, phone flying off-screen) */}
        <StorySection id="choice" className="bg-paper">
          {(p) => (
            <div className="relative flex h-full w-full items-center overflow-hidden">
              {/* character left, half cropped by the viewport edge */}
              <div className="absolute bottom-[6vh] left-[-4vw] w-52 md:left-[2vw] md:w-80">
                <Character pose="aware" interactive={false} />
              </div>
              {/* statement, right of the character */}
              <h2 className="relative z-10 ml-auto mr-[6vw] max-w-3xl pl-[38vw] text-left font-display text-[8vw] leading-[0.95] md:pl-0 md:text-[5.5vw]">
                YOU CAN <span className="text-alive">CHOOSE</span>
                <br />
                WHERE YOUR
                <br />
                ATTENTION GOES.
              </h2>
              {/* phone flying out of the viewport */}
              <div
                className="absolute bottom-[30vh] left-[16vw] w-14 md:w-20"
                style={{
                  transform: `translate(${p * 70}vw, ${p * -30}vh) rotate(${p * 120}deg)`,
                  opacity: 1 - p * 0.6,
                }}
              >
                <svg viewBox="-15 -25 90 160" className="w-full">
                  <rect x="5" y="-10" width="52" height="92" rx="10" fill="#2a2a2a" stroke="var(--ink)" strokeWidth="5" />
                  <rect x="12" y="0" width="38" height="66" rx="4" fill="var(--alive)" opacity="0.4" />
                </svg>
              </div>
              {/* hand-drawn arrow pointing out */}
              <svg
                viewBox="0 0 200 60"
                className="absolute bottom-[46vh] left-[22vw] w-36 md:w-56"
                style={{
                  opacity: Math.max(0, (p - 0.25) * 1.8),
                  transform: `translateX(${p * 12}vw) rotate(-8deg)`,
                }}
              >
                <path
                  d="M10 40 Q 80 50 160 25 M140 15 L 162 24 L 146 40"
                  fill="none"
                  stroke="var(--alive)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </StorySection>

        {/* 05 — MAKE ROOM (moments appear one by one) */}
        <StorySection id="room" className="bg-paper">
          {(p) => (
            <div className="relative h-full w-full overflow-hidden">
              <div className="relative z-10 flex justify-center pt-[6vh] md:pt-[10vh]">
                <h2 className="text-center font-display text-[11vw] leading-[0.9] md:text-[7vw]">
                  MAKE ROOM
                  <br />
                  FOR <span className="text-alive">LIFE.</span>
                </h2>
              </div>
              {/* the phone, put down — small, still, corner */}
              <div
                className="absolute left-[8%] top-[8%] w-12 rotate-[80deg] opacity-40 md:w-16"
                style={{ opacity: 0.4 * (1 - p * 0.5) }}
              >
                <svg viewBox="-15 -25 90 160" className="w-full">
                  <rect x="5" y="-10" width="52" height="92" rx="10" fill="#2a2a2a" stroke="var(--ink)" strokeWidth="5" />
                  <rect x="12" y="0" width="38" height="66" rx="4" fill="var(--ink)" opacity="0.15" />
                </svg>
              </div>
              <LifeMoments progress={p} />
            </div>
          )}
        </StorySection>

        {/* 06 — ALIVE */}
        <section
          id="alive"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
        >
          <h2 className="text-center font-display text-[24vw] leading-[0.85] tracking-tight md:text-[17vw]">
            ALIVE.
          </h2>
          <div className="mt-12 w-56 md:w-80">
            <Character pose="lookat" interactive />
          </div>
          <p className="mt-12 max-w-3xl text-center font-display text-[7vw] leading-[1.05] md:text-[3.6vw]">
            ENJOY YOUR LIFE
            <br />
            WITHOUT <span className="text-alive">DISTRACTION</span>{" "}
            <span className="font-hand font-normal">:)</span>
          </p>
          <p className="font-hand mt-8 rotate-[-2deg] text-2xl text-ink/70 md:text-3xl">
            Make room for your life.
          </p>
        </section>
      </main>
    </LenisProvider>
  );
}
