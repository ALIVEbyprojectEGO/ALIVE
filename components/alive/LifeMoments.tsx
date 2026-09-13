"use client";

import Character, { Pose } from "./Character";

/** Six small illustrated real-life moments, revealed one by one. */
export default function LifeMoments({ progress }: { progress: number }) {
  const moments: {
    label: string;
    render: () => React.ReactNode;
    pos: string; // tailwind absolute position
    rot: number;
  }[] = [
    {
      label: "run",
      pos: "left-[6%] top-[38%]",
      rot: -4,
      render: () => (
        <svg viewBox="0 0 120 120" className="w-full">
          <circle cx="60" cy="24" r="13" fill="none" stroke="var(--ink)" strokeWidth="5" />
          <path
            d="M60 38 L 54 70 M54 70 L 34 96 M54 70 L 74 92 M58 48 L 82 40 M58 48 L 36 62"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M18 104 q 10 -4 20 0" stroke="var(--alive)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
    {
      label: "read",
      pos: "left-[38%] top-[30%]",
      rot: 3,
      render: () => <Character pose="read" />,
    },
    {
      label: "walk outside",
      pos: "right-[8%] top-[36%]",
      rot: -2,
      render: () => (
        <svg viewBox="0 0 140 120" className="w-full">
          {/* sun */}
          <circle cx="112" cy="22" r="12" fill="none" stroke="var(--alive)" strokeWidth="4" />
          <path d="M112 2 v 6 M112 36 v 6 M92 22 h 6 M126 22 h 6" stroke="var(--alive)" strokeWidth="4" strokeLinecap="round" />
          {/* walking figure */}
          <circle cx="52" cy="30" r="12" fill="none" stroke="var(--ink)" strokeWidth="5" />
          <path
            d="M52 44 L 50 74 M50 74 L 36 102 M50 74 L 66 100 M51 54 L 72 66 M51 54 L 30 66"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* ground + grass */}
          <path d="M8 106 Q 70 112 132 104" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M22 104 l 2 -8 M28 105 l 4 -7 M96 104 l 2 -8 M102 105 l 4 -7" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "create",
      pos: "left-[10%] bottom-[10%]",
      rot: 2,
      render: () => (
        <svg viewBox="0 0 120 120" className="w-full">
          {/* pencil */}
          <path d="M30 88 L 74 44 L 86 56 L 42 100 L 28 102 Z" fill="none" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M74 44 L 82 36 L 94 48 L 86 56" fill="none" stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" />
          {/* sparkles */}
          <path d="M52 22 l 0 0 M52 16 v 12 M46 22 h 12" stroke="var(--alive)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M96 76 v 10 M91 81 h 10" stroke="var(--alive)" strokeWidth="3.5" strokeLinecap="round" />
          {/* squiggle being drawn */}
          <path d="M34 108 q 14 -10 26 0 q 12 10 26 0" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "talk",
      pos: "left-[42%] bottom-[6%]",
      rot: -3,
      render: () => <Character pose="talk" />,
    },
    {
      label: "be present",
      pos: "right-[10%] bottom-[12%]",
      rot: 4,
      render: () => <Character pose="sit" />,
    },
  ];

  return (
    <>
      {moments.map((m, i) => {
        // each moment appears across its slice of progress
        const start = 0.12 + i * 0.13;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.18));
        return (
          <div
            key={m.label}
            className={`absolute w-20 md:w-40 ${m.pos}`}
            style={{
              opacity: local,
              transform: `rotate(${m.rot}deg) translateY(${(1 - local) * 40}px) scale(${0.85 + local * 0.15})`,
            }}
          >
            {m.render()}
            <p
              className="font-hand mt-1 text-center text-xl text-ink/70 md:text-2xl"
              style={{ opacity: local }}
            >
              {m.label}
            </p>
          </div>
        );
      })}
    </>
  );
}
