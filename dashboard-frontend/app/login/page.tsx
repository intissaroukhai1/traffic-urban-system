"use client";

import { LOGIN_MUTATION } from "@/graphql/auth";
import { saveAuth } from "@/lib/auth";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

type LoginResponse = {
  login: {
    accessToken: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
  };
};

type LoginVariables = {
  email: string;
  password: string;
};

// Animated SVG background component
function TrafficBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Road grid lines */}
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>

          {/* Dashed road center lines */}
          <pattern id="dashH" width="60" height="4" patternUnits="userSpaceOnUse">
            <rect width="30" height="2" y="1" fill="rgba(255,220,50,0.15)" rx="1" />
          </pattern>

          {/* Car glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Headlight glow */}
          <filter id="headlight" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dark city background */}
        <rect width="1200" height="800" fill="#060912" />

        {/* Grid pattern */}
        <rect width="1200" height="800" fill="url(#grid)" />

        {/* Horizontal roads */}
        <rect x="0" y="195" width="1200" height="28" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="0" y="200" width="1200" height="4" fill="url(#dashH)" />

        <rect x="0" y="395" width="1200" height="28" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="0" y="400" width="1200" height="4" fill="url(#dashH)" />

        <rect x="0" y="595" width="1200" height="28" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="0" y="600" width="1200" height="4" fill="url(#dashH)" />

        {/* Vertical roads */}
        <rect x="195" y="0" width="28" height="800" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="200" y="0" width="4" height="800" fill="url(#dashH)" transform="rotate(90 204 400)" />

        <rect x="595" y="0" width="28" height="800" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="600" y="0" width="4" height="800" fill="url(#dashH)" transform="rotate(90 604 400)" />

        <rect x="995" y="0" width="28" height="800" fill="rgba(255,255,255,0.025)" rx="2" />
        <rect x="1000" y="0" width="4" height="800" fill="url(#dashH)" transform="rotate(90 1004 400)" />

        {/* Intersection nodes */}
        {[
          [209, 209],
          [609, 209],
          [1009, 209],
          [209, 409],
          [609, 409],
          [1009, 409],
          [209, 609],
          [609, 609],
          [1009, 609],
        ].map(([cx, cy], i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle
              cx={cx}
              cy={cy}
              r="10"
              fill="rgba(59,130,246,0.08)"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="1.5"
            />
            <circle cx={cx} cy={cy} r="3" fill="rgba(59,130,246,0.5)" />
          </g>
        ))}

        {/* Animated cars moving right */}
        <g className="car-r1">
          <rect x="-40" y="200" width="36" height="12" rx="3" fill="rgba(59,130,246,0.7)" filter="url(#glow)" />
          <ellipse cx="-4" cy="206" rx="6" ry="3" fill="rgba(255,230,100,0.6)" filter="url(#headlight)" />
          <style>{`
            .car-r1 { animation: moveRight 8s linear infinite; }
            @keyframes moveRight { from { transform: translateX(0); } to { transform: translateX(1280px); } }
          `}</style>
        </g>

        <g className="car-r2">
          <rect x="-40" y="402" width="30" height="10" rx="3" fill="rgba(239,68,68,0.6)" filter="url(#glow)" />
          <ellipse cx="-4" cy="407" rx="5" ry="2.5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-r2 { animation: moveRight2 12s linear infinite 3s; }
            @keyframes moveRight2 { from { transform: translateX(0); } to { transform: translateX(1280px); } }
          `}</style>
        </g>

        <g className="car-r3">
          <rect x="-40" y="602" width="32" height="11" rx="3" fill="rgba(16,185,129,0.6)" filter="url(#glow)" />
          <ellipse cx="-4" cy="607" rx="5" ry="2.5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-r3 { animation: moveRight3 10s linear infinite 6s; }
            @keyframes moveRight3 { from { transform: translateX(0); } to { transform: translateX(1280px); } }
          `}</style>
        </g>

        {/* Animated cars moving left */}
        <g className="car-l1">
          <rect x="1200" y="210" width="36" height="12" rx="3" fill="rgba(139,92,246,0.6)" filter="url(#glow)" />
          <ellipse cx="1236" cy="216" rx="6" ry="3" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-l1 { animation: moveLeft 9s linear infinite 2s; }
            @keyframes moveLeft { from { transform: translateX(0); } to { transform: translateX(-1280px); } }
          `}</style>
        </g>

        <g className="car-l2">
          <rect x="1200" y="412" width="28" height="10" rx="3" fill="rgba(251,146,60,0.6)" filter="url(#glow)" />
          <ellipse cx="1228" cy="417" rx="5" ry="2.5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-l2 { animation: moveLeft2 11s linear infinite 5s; }
            @keyframes moveLeft2 { from { transform: translateX(0); } to { transform: translateX(-1280px); } }
          `}</style>
        </g>

        {/* Animated cars moving down */}
        <g className="car-d1">
          <rect x="200" y="-30" width="12" height="32" rx="3" fill="rgba(59,130,246,0.6)" filter="url(#glow)" />
          <ellipse cx="206" cy="-4" rx="3" ry="5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-d1 { animation: moveDown 10s linear infinite 1s; }
            @keyframes moveDown { from { transform: translateY(0); } to { transform: translateY(880px); } }
          `}</style>
        </g>

        <g className="car-d2">
          <rect x="600" y="-30" width="12" height="30" rx="3" fill="rgba(234,179,8,0.6)" filter="url(#glow)" />
          <ellipse cx="606" cy="-4" rx="3" ry="5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-d2 { animation: moveDown2 7s linear infinite 4s; }
            @keyframes moveDown2 { from { transform: translateY(0); } to { transform: translateY(880px); } }
          `}</style>
        </g>

        {/* Animated cars moving up */}
        <g className="car-u1">
          <rect x="610" y="800" width="10" height="28" rx="3" fill="rgba(16,185,129,0.6)" filter="url(#glow)" />
          <ellipse cx="615" cy="828" rx="3" ry="5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-u1 { animation: moveUp 9s linear infinite 2.5s; }
            @keyframes moveUp { from { transform: translateY(0); } to { transform: translateY(-880px); } }
          `}</style>
        </g>

        <g className="car-u2">
          <rect x="1010" y="800" width="10" height="26" rx="3" fill="rgba(239,68,68,0.5)" filter="url(#glow)" />
          <ellipse cx="1015" cy="826" rx="3" ry="5" fill="rgba(255,230,100,0.5)" filter="url(#headlight)" />
          <style>{`
            .car-u2 { animation: moveUp2 11s linear infinite 7s; }
            @keyframes moveUp2 { from { transform: translateY(0); } to { transform: translateY(-880px); } }
          `}</style>
        </g>

        {/* Traffic signals */}
        {[
          [190, 190],
          [600, 190],
          [1000, 190],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width="8" height="20" rx="2" fill="rgba(255,255,255,0.08)" />
            <circle cx={x + 4} cy={y + 5} r="3" fill="rgba(239,68,68,0.7)">
              <animate attributeName="opacity" values="1;0.3;1" dur={`${2 + i * 0.7}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x + 4} cy={y + 11} r="3" fill="rgba(234,179,8,0.7)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.7}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={x + 4} cy={y + 17} r="3" fill="rgba(16,185,129,0.7)">
              <animate attributeName="opacity" values="0.3;0.3;1" dur={`${2 + i * 0.7}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Ambient city glow blobs */}
        <ellipse cx="200" cy="400" rx="120" ry="200" fill="rgba(59,130,246,0.04)" />
        <ellipse cx="600" cy="200" rx="100" ry="150" fill="rgba(139,92,246,0.04)" />
        <ellipse cx="1000" cy="600" rx="130" ry="180" fill="rgba(16,185,129,0.04)" />
      </svg>
    </div>
  );
}

// Traffic light indicator component
function TrafficLight({ active }: { active: "red" | "amber" | "green" }) {
  return (
    <div className="flex gap-1.5 items-center">
      <div
        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          active === "red"
            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            : "bg-red-900/40"
        }`}
      />
      <div
        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          active === "amber"
            ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            : "bg-amber-900/40"
        }`}
      />
      <div
        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          active === "green"
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            : "bg-emerald-900/40"
        }`}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin.test@test.com");
  const [password, setPassword] = useState("123456");
  const [errorMessage, setErrorMessage] = useState("");
  const [signalState, setSignalState] = useState<"red" | "amber" | "green">("red");
  const [isVisible, setIsVisible] = useState(false);

  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION);

  // Animate signal on load
  useEffect(() => {
    setIsVisible(true);

    const timer1 = setTimeout(() => setSignalState("amber"), 600);
    const timer2 = setTimeout(() => setSignalState("green"), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Pulse signal on loading
  useEffect(() => {
    if (loading) {
      setSignalState("amber");
    }
  }, [loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSignalState("amber");

    try {
      const result = await login({
        variables: {
          email,
          password,
        },
      });

      const data = result.data?.login;

      if (!data) {
        setSignalState("red");
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      setSignalState("green");
      saveAuth(data.accessToken, data.user);

      setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
    } catch {
      setSignalState("red");
      setErrorMessage("Invalid email or password.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#060912] px-4 overflow-hidden">
      {/* Animated traffic background */}
      <TrafficBackground />

      {/* Radial light behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      {/* Login card */}
      <div
        className={`relative w-full max-w-md transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Card outer border glow */}
        <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-b from-white/10 to-white/[0.03] pointer-events-none" />

        <div className="relative rounded-[1.75rem] bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 shadow-2xl shadow-black/60">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              {/* Brand tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-blue-400 font-mono">
                  Traffic Urban
                </span>
              </div>

              <h1 className="text-2xl font-semibold text-white leading-tight">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-white/35">
                ADMIN or OPERATOR account required
              </p>
            </div>

            {/* Traffic light indicator */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    signalState === "red"
                      ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                      : "bg-red-950/60"
                  }`}
                />
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    signalState === "amber"
                      ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                      : "bg-amber-950/60"
                  }`}
                />
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    signalState === "green"
                      ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                      : "bg-emerald-950/60"
                  }`}
                />
              </div>

              <span className="text-[9px] text-white/20 font-mono uppercase tracking-wider">
                CTRL
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative h-px mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div
              className="absolute top-0 h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{ animation: "slideDash 3s linear infinite" }}
            />
          </div>

          <style>{`
            @keyframes slideDash {
              from { left: -4rem; }
              to { left: 100%; }
            }
          `}</style>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-widest uppercase text-white/40 font-mono">
                Email
              </label>

              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  placeholder="admin@traffic-urban.io"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-widest uppercase text-white/40 font-mono">
                Password
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">
                  {errorMessage}
                </span>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="relative w-full overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 group"
              >
                {/* Button shimmer on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Access dashboard
                      <svg
                        className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-white/20 font-mono">
              v2.4.1
            </span>

            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/25 font-mono">
                System operational
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-3 flex justify-center gap-3 opacity-30">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-8 h-0.5 rounded-full bg-yellow-400/40" />
          ))}
        </div>
      </div>
    </main>
  );
}