"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

/** Hand-drawn phone with an infinitely scrolling feed inside. */
export default function PhoneFeed({
  className = "",
  scrolling = true,
}: {
  className?: string;
  scrolling?: boolean;
}) {
  const reduced = useReducedMotion();
  const animate = scrolling && !reduced;

  const Post = ({ video, image, label }: { video?: boolean; image?: boolean; label?: string }) => (
    <g>
      {/* header */}
      <circle cx="26" cy="14" r="6" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M40 10 h 40 M40 18 h 28" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      {/* media */}
      <rect
        x="14"
        y="28"
        width="112"
        height="58"
        rx="8"
        fill={image ? "var(--alive)" : "#2a2a2a"}
        fillOpacity={image ? "0.25" : "0.08"}
        stroke="var(--ink)"
        strokeWidth="3"
      />
      {video && (
        <path d="M64 48 l 18 9 l -18 9 Z" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      )}
      {image && (
        <path d="M22 78 l 24 -26 l 16 16 l 14 -12 l 26 22" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {label && (
        <text
          x="70"
          y="62"
          textAnchor="middle"
          fontSize="12"
          fill="var(--ink)"
          style={{ fontFamily: "var(--font-display), sans-serif", letterSpacing: 1 }}
        >
          {label}
        </text>
      )}
      {/* footer */}
      <path d="M18 96 q 4 -6 8 0 q -4 6 -8 0" fill="var(--alive)" />
      <path d="M34 96 h 26" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </g>
  );

  return (
    <div className={className}>
      <svg viewBox="0 0 140 250" className="h-auto w-full overflow-visible">
        {/* phone body */}
        <rect x="4" y="4" width="132" height="242" rx="22" fill="var(--paper)" stroke="var(--ink)" strokeWidth="6" />
        <path d="M52 16 h 36" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        {/* screen clip */}
        <clipPath id="feed-clip">
          <rect x="14" y="26" width="112" height="208" rx="10" />
        </clipPath>
        <g clipPath="url(#feed-clip)">
          <g
            style={
              animate
                ? { animation: "feed-scroll 7s linear infinite" }
                : undefined
            }
          >
            {/* two stacked feeds for a seamless loop (feed height = 3*112 = 336) */}
            <g transform="translate(0 26)">
              <g><Post video /></g>
              <g transform="translate(0 112)"><Post image /></g>
              <g transform="translate(0 224)"><Post label="WAIT FOR THE END…" /></g>
              <g transform="translate(0 336)"><Post video /></g>
              <g transform="translate(0 448)"><Post image /></g>
              <g transform="translate(0 560)"><Post label="WAIT FOR THE END…" /></g>
            </g>
          </g>
        </g>
        <style>{`@keyframes feed-scroll { to { transform: translateY(-336px); } }`}</style>
      </svg>
    </div>
  );
}
