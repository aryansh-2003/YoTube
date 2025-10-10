import React from "react";

export default function CapybaraLoader() {
  return (
    <>
      {/* 🔥 Inline keyframes and extra CSS — no tailwind.config needed */}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { fill: #2d2d2d; }
          50% { fill: #505050; }
        }
        @keyframes traceFlow {
          from { stroke-dashoffset: 720; }
          to { stroke-dashoffset: 0; }
        }
        .trace-flow {
          stroke-width: 1;
          fill: none;
          stroke-dasharray: 120 600;
          stroke-dashoffset: 720;
          animation: traceFlow 5s linear infinite;
          opacity: 0.95;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 8px currentColor) blur(0.5px);
          color: #00ccff;
        }
      `}</style>

      <div className="flex justify-center items-center w-full h-full overflow-hidden bg-black">
        <svg
          viewBox="0 0 900 900"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient
              id="traceGradient1"
              x1="250"
              y1="120"
              x2="100"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="traceGradient2"
              x1="650"
              y1="120"
              x2="800"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="traceGradient3"
              x1="250"
              y1="380"
              x2="400"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="traceGradient4"
              x1="650"
              y1="120"
              x2="500"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00ccff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00ccff" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <g>
            <g>
              {[...Array(17)].map((_, i) => (
                <line
                  key={i}
                  x1={i * 100}
                  y1="0"
                  x2={i * 100}
                  y2="100%"
                  className="stroke-[#222] stroke-[0.5]"
                />
              ))}
            </g>
            <g>
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={(i + 1) * 100}
                  x2="100%"
                  y2={(i + 1) * 100}
                  className="stroke-[#222] stroke-[0.5]"
                />
              ))}
            </g>
          </g>

          {/* Browser frame */}
          <g transform="translate(0, 200)">
            <rect
              x="250"
              y="120"
              width="400"
              height="260"
              rx="8"
              ry="8"
              className="fill-[#111] stroke-[#666] stroke-[1px] drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]"
            />
            <rect
              x="250"
              y="120"
              width="400"
              height="30"
              rx="8"
              ry="8"
              className="fill-[#1a1a1a]"
            />
            <text
              x="294"
              y="140"
              textAnchor="middle"
              className="fill-[#e4e4e4] text-[14px] font-[Haettenschweiler,sans-serif]"
            >
              Loading...
            </text>

            {/* Skeleton animation */}
            <rect
              x="270"
              y="160"
              width="360"
              height="20"
              className="fill-[#2d2d2d]"
              style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
              rx="4"
              ry="4"
            />
            <rect
              x="270"
              y="190"
              width="200"
              height="15"
              className="fill-[#2d2d2d]"
              style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
              rx="4"
              ry="4"
            />
            <rect
              x="270"
              y="215"
              width="300"
              height="15"
              className="fill-[#2d2d2d]"
              style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
              rx="4"
              ry="4"
            />
            <rect
              x="270"
              y="240"
              width="360"
              height="90"
              className="fill-[#2d2d2d]"
              style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
              rx="4"
              ry="4"
            />
            <rect
              x="270"
              y="340"
              width="180"
              height="20"
              className="fill-[#2d2d2d]"
              style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
              rx="4"
              ry="4"
            />
          </g>

          {/* Trace animation */}
          <g transform="translate(0, 200)">
            <path
              d="M100 300 H250 V120"
              className="trace-flow"
              stroke="url(#traceGradient1)"
            />
            <path
              d="M800 200 H650 V380"
              className="trace-flow"
              stroke="url(#traceGradient2)"
            />
            <path
              d="M400 520 V380 H250"
              className="trace-flow"
              stroke="url(#traceGradient3)"
            />
            <path
              d="M500 50 V120 H650"
              className="trace-flow"
              stroke="url(#traceGradient4)"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
