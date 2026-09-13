"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/lib/useFinePointer";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type Pose =
  | "phone" // head down at phone
  | "overwhelmed" // head down, shoulders up
  | "aware" // head up, looking outward
  | "lookat" // looking toward the user
  | "sit" // sitting, knees up
  | "lie" // lying down, phone above face
  | "read" // holding an open book
  | "talk" // facing a second person
  | "walk"
  | "run";

type Props = {
  pose?: Pose;
  /** desktop: eyes/head follow cursor, notices when cursor is near */
  interactive?: boolean;
  className?: string;
  accent?: boolean;
};

/**
 * One hand-drawn character. All poses share the same skeleton:
 * rounded head, two dot eyes, simple body, imperfect strokes.
 */
export default function Character({
  pose = "phone",
  interactive = false,
  className = "",
  accent = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const noticeRef = useRef<SVGGElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  // cursor-follow only when the character is "awake"; phone poses stay hypnotized
  const canFollow = pose === "aware" || pose === "lookat" || pose === "talk";
  const active = interactive && canFollow && fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current!;
    const head = headRef.current!;
    const eyeL = eyeLRef.current!;
    const eyeR = eyeRRef.current!;
    const body = bodyRef.current!;
    const notice = noticeRef.current!;

    let tx = 0, ty = 0; // target cursor offset
    let hx = 0, hy = 0; // lerped head
    let ex = 0, ey = 0; // lerped eyes
    let aware = 0, awareT = 0; // "notices you" amount
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = 600;
      const n = Math.min(dist / max, 1);
      tx = (dx / (dist || 1)) * n;
      ty = (dy / (dist || 1)) * n;
      // notices when cursor close
      awareT = dist < r.width * 0.9 ? 1 : 0;
    };
    const onLeave = () => {
      tx = 0; ty = 0; awareT = 0;
    };

    const loop = () => {
      hx += (tx - hx) * 0.06;
      hy += (ty - hy) * 0.06;
      ex += (tx - ex) * 0.12;
      ey += (ty - ey) * 0.12;
      aware += (awareT - aware) * 0.08;

      head.style.transform = `translate(${hx * 7}px, ${hy * 5}px) rotate(${hx * 4}deg)`;
      eyeL.style.transform = `translate(${ex * 3}px, ${ey * 2.5}px)`;
      eyeR.style.transform = `translate(${ex * 3}px, ${ey * 2.5}px)`;
      body.style.transform = `translate(${hx * 2}px, ${hy * 1.5}px)`;
      // pupils widen when noticed: scale eyes slightly
      const s = 1 + aware * 0.35;
      eyeL.style.transform += ` scale(${s})`;
      eyeR.style.transform += ` scale(${s})`;
      notice.style.opacity = String(aware);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  // pose parameters
  const P = {
    phone: { headTilt: 14, headY: 8, eyesDown: 2.5, showPhone: true, shouldersUp: 0, spiral: true, body: "stand" },
    overwhelmed: { headTilt: 18, headY: 10, eyesDown: 3, showPhone: true, shouldersUp: 6, spiral: true, body: "stand" },
    aware: { headTilt: -4, headY: -2, eyesDown: 0, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
    lookat: { headTilt: 0, headY: -3, eyesDown: -0.5, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
    sit: { headTilt: 4, headY: 0, eyesDown: 1, showPhone: false, shouldersUp: 0, spiral: false, body: "sit" },
    lie: { headTilt: 10, headY: 8, eyesDown: 2.5, showPhone: true, shouldersUp: 0, spiral: true, body: "lie" },
    read: { headTilt: 8, headY: 4, eyesDown: 2, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
    talk: { headTilt: -2, headY: -2, eyesDown: 0, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
    walk: { headTilt: 2, headY: 0, eyesDown: 0, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
    run: { headTilt: -6, headY: -2, eyesDown: 0, showPhone: false, shouldersUp: 0, spiral: false, body: "stand" },
  }[pose] as {
    headTilt: number;
    headY: number;
    eyesDown: number;
    showPhone: boolean;
    shouldersUp: number;
    spiral: boolean;
    body: "stand" | "sit" | "lie";
  };

  const stroke = "var(--ink)";
  const teal = "var(--alive)";

  return (
    <div ref={rootRef} className={`select-none ${className}`} data-cursor="character">
      <style>{`@keyframes eye-spin { to { transform: rotate(360deg); } }`}</style>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        className="h-auto w-full overflow-visible"
        style={P.body === "lie" ? { transform: "rotate(90deg)" } : undefined}
      >
        {/* body */}
        <g ref={bodyRef} style={{ transition: "none" }}>
          {P.body === "sit" ? (
            <>
              {/* seated: torso + knees up */}
              <path
                d="M70 150 Q 66 190 76 208 Q 108 196 128 208 Q 138 200 134 182"
                stroke={stroke}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* ground line */}
              <path d="M40 212 Q 100 220 160 210" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
              {/* arms resting on knees */}
              <path
                d="M72 158 Q 66 184 88 196 M130 158 Q 136 184 114 196"
                stroke={stroke}
                strokeWidth="7"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* torso: imperfect rounded stroke */}
              <path
                d={`M62 ${150 - P.shouldersUp} Q 60 200 66 236 M138 ${150 - P.shouldersUp} Q 140 200 134 236 M66 236 Q 100 242 134 236`}
                stroke={stroke}
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* arms */}
              {P.showPhone ? (
                <>
                  {/* arms holding phone */}
                  <path
                    d={`M64 ${158 - P.shouldersUp} Q 58 190 82 200 M136 ${158 - P.shouldersUp} Q 142 190 118 200`}
                    stroke={stroke}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* phone */}
                  <g transform={`rotate(${P.headTilt * 0.4} 100 200)`}>
                    <rect
                      x="82"
                      y="188"
                      width="36"
                      height="60"
                      rx="7"
                      fill="#2a2a2a"
                      stroke={stroke}
                      strokeWidth="4"
                    />
                    <rect x="88" y="196" width="24" height="40" rx="3" fill={teal} opacity="0.55" />
                  </g>
                </>
              ) : pose === "read" ? (
                <>
                  {/* arms holding an open book */}
                  <path
                    d="M64 158 Q 58 190 84 198 M136 158 Q 142 190 116 198"
                    stroke={stroke}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* open book */}
                  <path
                    d="M100 192 L 74 184 Q 72 204 74 222 L 100 230 L 126 222 Q 128 204 126 184 L 100 192 M100 192 L 100 230"
                    stroke={stroke}
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                    fill="var(--paper)"
                  />
                  <path d="M80 196 l 14 4 M80 206 l 14 4 M106 200 l 14 -4 M106 210 l 14 -4" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* relaxed arms */}
                  <path
                    d={`M64 ${158 - P.shouldersUp} Q 56 196 62 228 M136 ${158 - P.shouldersUp} Q 144 196 138 228`}
                    stroke={stroke}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </>
              )}
            </>
          )}
        </g>

        {/* head group — moves with cursor */}
        <g
          ref={headRef}
          style={{
            transform: `translateY(${P.headY}px) rotate(${P.headTilt}deg)`,
            transformOrigin: "100px 90px",
          }}
        >
          {/* head: imperfect circle */}
          <path
            d="M100 18 C 138 16 158 46 156 84 C 154 118 132 140 100 141 C 66 142 44 116 44 82 C 44 46 64 20 100 18 Z"
            stroke={stroke}
            strokeWidth="7"
            strokeLinecap="round"
            fill="var(--paper)"
          />
          {/* eyes: spiral when hypnotized by the phone, dots otherwise */}
          {P.spiral ? (
            <>
              <g
                ref={eyeLRef}
                style={{
                  transform: `translateY(${P.eyesDown}px)`,
                  transformOrigin: "82px 78px",
                  animation: reduced ? "none" : "eye-spin 4s linear infinite",
                }}
              >
                <path
                  d="M82 78 m 0 -1 a 1.5 1.5 0 0 1 1.5 1.5 a 4 4 0 0 1 -4 4 a 7 7 0 0 1 -7 -7 a 10.5 10.5 0 0 1 10.5 -10.5"
                  stroke={stroke}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              <g
                ref={eyeRRef}
                style={{
                  transform: `translateY(${P.eyesDown}px)`,
                  transformOrigin: "118px 78px",
                  animation: reduced ? "none" : "eye-spin 4s linear infinite reverse",
                }}
              >
                <path
                  d="M118 78 m 0 -1 a 1.5 1.5 0 0 1 1.5 1.5 a 4 4 0 0 1 -4 4 a 7 7 0 0 1 -7 -7 a 10.5 10.5 0 0 1 10.5 -10.5"
                  stroke={stroke}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </>
          ) : (
            <>
              <g ref={eyeLRef} style={{ transform: `translateY(${P.eyesDown}px)` }}>
                <circle cx="82" cy={78} r={interactive ? 4 : 3.5} fill={stroke} />
              </g>
              <g ref={eyeRRef} style={{ transform: `translateY(${P.eyesDown}px)` }}>
                <circle cx="118" cy={78} r={interactive ? 4 : 3.5} fill={stroke} />
              </g>
            </>
          )}
          {/* mouth: flat when distracted, soft when aware */}
          {pose === "aware" || pose === "lookat" || pose === "talk" || pose === "read" ? (
            <path
              d="M88 106 Q 100 112 112 106"
              stroke={stroke}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M90 108 L 110 108"
              stroke={stroke}
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}
          {/* overhead mark: frustrated scribble (phone poses) / teal question (awake) */}
          <g ref={noticeRef} style={{ opacity: 0 }}>
            {P.spiral ? (
              <path
                d="M128 6 q 8 -10 16 -2 q 8 8 18 0 q 8 -8 16 2 q 6 8 16 0"
                stroke={stroke}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <>
                <path
                  d="M150 30 q 10 -12 18 -2 q 6 8 -4 14 l -4 6"
                  stroke={teal}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="158" cy="58" r="2.6" fill={teal} />
              </>
            )}
          </g>
        </g>

        {/* second person for the talk pose */}
        {pose === "talk" && (
          <g transform="translate(118 60) scale(0.62)" opacity="0.85">
            <path
              d="M100 18 C 138 16 158 46 156 84 C 154 118 132 140 100 141 C 66 142 44 116 44 82 C 44 46 64 20 100 18 Z"
              stroke={stroke}
              strokeWidth="7"
              strokeLinecap="round"
              fill="var(--paper)"
            />
            <circle cx="82" cy="78" r="4" fill={stroke} />
            <circle cx="118" cy="78" r="4" fill={stroke} />
            <path d="M88 104 Q 100 112 112 104" stroke={stroke} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path
              d="M62 150 Q 60 200 66 236 M138 150 Q 140 200 134 236 M66 236 Q 100 242 134 236"
              stroke={stroke}
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* small speech bubble */}
            <path
              d="M30 30 q -26 -4 -34 14 q -6 16 12 24 l -4 12 l 14 -8 q 22 4 34 -8"
              fill="none"
              stroke={teal}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
