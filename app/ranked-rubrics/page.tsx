"use client";

import { useEffect, useState } from "react";
import DiscordEmojiText from "@/components/DiscordEmojiText";

const imcFontStyle = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
`;

const modes = [
  { name: "Sword", icon: "/tierlist-icons/Sword.png" },
  { name: "Netherite Pot", icon: "/tierlist-icons/Netherite Pot.png" },
  { name: "Pot", icon: "/tierlist-icons/Pot.png" },
  { name: "CPvP", icon: "/tierlist-icons/CPvP.png" },
  { name: "Axe", icon: "/tierlist-icons/Axe.png" },
  { name: "Mace", icon: "/tierlist-icons/Mace.png" },
  { name: "UHC", icon: "/tierlist-icons/UHC.png" },
  { name: "SMP", icon: "/tierlist-icons/SMP.png" },
];

type RubricItem = {
  id: number;
  type: "box" | "message";
  title: string;
  content: string;
};

export default function RankedRubricsPage() {
  const [selectedMode, setSelectedMode] = useState("Sword");
  const [rubrics, setRubrics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRubrics = async () => {
      try {
        const response = await fetch("/api/rubrics");
        const data = await response.json();

        if (data.success && data.rubrics) {
          setRubrics(data.rubrics);
        }
      } catch (error) {
        console.error("Failed to load rubrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRubrics();
  }, []);

  const selectedModeData = modes.find(
    (mode) => mode.name === selectedMode
  );

  const selectedData = rubrics[selectedMode];

  const selectedItems: RubricItem[] = Array.isArray(selectedData)
    ? selectedData
    : Array.isArray(selectedData?.items)
      ? selectedData.items
      : [];

  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');

        @keyframes imcRankedFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes imcRubricsFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes imcTitleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes imcAccentPulse {
          0%, 100% {
            opacity: 0.55;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.15);
          }
        }

        @keyframes imcLiveDot {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        .imc-ranked-flow {
          font-family: "Space Grotesk", sans-serif !important;
          font-weight: 700 !important;
          background-image: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 18%,
            #38bdf8 30%,
            #8b5cf6 42%,
            #ec4899 54%,
            #ffffff 68%,
            #ffffff 82%,
            #38bdf8 94%,
            #ffffff 100%
          ) !important;
          background-size: 200% 100% !important;
          background-position: 0% 50%;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          animation: imcRankedFlow 7s linear infinite !important;
        }

        .imc-rubrics-flow {
          font-family: "Space Grotesk", sans-serif !important;
          font-weight: 700 !important;
          background-image: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 12%,
            #ef4444 24%,
            #f97316 36%,
            #ec4899 48%,
            #a855f7 60%,
            #22d3ee 72%,
            #ffffff 86%,
            #ffffff 100%
          ) !important;
          background-size: 200% 100% !important;
          background-position: 0% 50%;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
          animation: imcRubricsFlow 8s linear infinite !important;
        }

        .imc-title-float {
          animation-name: imcTitleFloat;
          animation-duration: 4s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .imc-accent-line {
          animation: imcAccentPulse 3s ease-in-out infinite;
          transform-origin: center;
        }

        .imc-live-dot {
          animation: imcLiveDot 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .imc-ranked-flow,
          .imc-rubrics-flow,
          .imc-title-float,
          .imc-accent-line,
          .imc-live-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Premium IMC Rubrics */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-red-600/[0.07] blur-[120px]" />
          <div className="absolute left-[8%] top-[420px] h-64 w-64 rounded-full bg-purple-500/[0.035] blur-[100px]" />
          <div className="absolute right-[5%] top-[700px] h-72 w-72 rounded-full bg-cyan-400/[0.025] blur-[110px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 md:pb-16 md:pt-24">

          {/* Hero */}
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-black/50 px-4 py-2 shadow-[0_0_35px_rgba(239,68,68,.06)] backdrop-blur-xl">
              <span className="imc-live-dot h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.9)]" />
              <span className="text-[9px] font-black uppercase tracking-[.28em] text-red-400 sm:text-[10px]">
                Official IMC Standards
              </span>
            </div>

            <h1 className="imc-hero-title text-5xl leading-[.88] sm:text-6xl md:text-8xl">
              <span className="imc-ranked-flow imc-title-float inline-block">
                RANKED
              </span>
              <span className="imc-rubrics-flow imc-title-float block">
                RUBRICS
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              <span className="imc-gradient-text bg-[linear-gradient(90deg,#e4e4e7,#38bdf8,#8b5cf6,#ec4899,#ffffff,#22d3ee,#38bdf8,#e4e4e7)] bg-clip-text font-semibold text-transparent">
                The official standard behind every IMC test.
              </span>{" "}
              Explore the requirements, testing structure and progression
              standards used across every ranked gamemode.
            </p>

            <div className="imc-accent-line mx-auto mt-8 h-px w-32 bg-[linear-gradient(90deg,transparent,#ef4444,#a855f7,#22d3ee,#ef4444,transparent)]" />
          </div>

          {/* Mode navigation */}
          <div className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[.32em] text-red-500">
                  IMC DATABASE
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
                  Choose a standard
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-white/[.06] bg-white/[.02] px-3 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.7)]" />
                <span className="text-[9px] font-bold uppercase tracking-[.16em] text-zinc-600">
                  {modes.length} modes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
              {modes.map((mode) => {
                const active = selectedMode === mode.name;

                return (
                  <button
                    key={mode.name}
                    onClick={() => setSelectedMode(mode.name)}
                    className={`group relative overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                      active
                        ? "border-red-500/45 bg-gradient-to-b from-red-500/[.11] to-red-500/[.035] shadow-[0_0_35px_rgba(239,68,68,.08)]"
                        : "border-white/[.065] bg-black/35 hover:-translate-y-0.5 hover:border-white/[.14] hover:bg-white/[.035]"
                    }`}
                  >
                    {active && (
                      <>
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-red-500/[.10] blur-2xl" />
                      </>
                    )}

                    <div className="relative flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          active
                            ? "border-red-500/25 bg-red-500/[.10] shadow-[0_0_18px_rgba(239,68,68,.08)]"
                            : "border-white/[.06] bg-black/30 group-hover:border-white/[.12]"
                        }`}
                      >
                        <img
                          src={mode.icon}
                          alt=""
                          className={`h-6 w-6 object-contain transition-transform duration-300 ${
                            active ? "scale-110" : "group-hover:scale-110"
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`truncate text-[10px] font-black leading-4 ${
                            active ? "text-white" : "text-zinc-400"
                          }`}
                        >
                          {mode.name}
                        </p>

                        <p
                          className={`mt-0.5 text-[7px] font-bold uppercase tracking-[.16em] ${
                            active ? "text-red-400" : "text-zinc-700"
                          }`}
                        >
                          {active ? "Selected" : "View rubric"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Rubric Section */}
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/[.08] bg-[#07080b]/90 shadow-[0_30px_120px_rgba(0,0,0,.5)] backdrop-blur-2xl">

            {/* Rubric identity header */}
            <div className="relative overflow-hidden border-b border-white/[.07]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(239,68,68,.10),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,.07),transparent_35%)]" />

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-purple-500/40 to-transparent" />

              <div className="relative px-5 py-7 sm:px-8 sm:py-9 md:px-10">
                <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] border border-red-500/25 bg-gradient-to-br from-red-500/[.13] to-purple-500/[.05] shadow-[0_0_45px_rgba(239,68,68,.10)] sm:h-20 sm:w-20">
                      <div className="absolute inset-0 rounded-[1.25rem] bg-red-500/[.04] blur-xl" />

                      {selectedModeData && (
                        <img
                          src={selectedModeData.icon}
                          alt=""
                          className="relative h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,.15)] sm:h-11 sm:w-11"
                        />
                      )}

                      <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#07080b] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.65)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-[.3em] text-red-400">
                          Official IMC Standard
                        </span>

                        <span className="h-1 w-1 rounded-full bg-zinc-700" />

                        <span className="text-[8px] font-bold uppercase tracking-[.2em] text-zinc-600">
                          Ranked Testing
                        </span>
                      </div>

                      <h2 className="imc-rubrics-flow truncate text-3xl font-black tracking-tight sm:text-4xl">
                        {selectedMode}
                      </h2>

                      <p className="mt-1.5 text-[10px] font-medium text-zinc-600 sm:text-xs">
                        Official requirements and testing criteria
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:w-52">
                    <div className="rounded-xl border border-white/[.06] bg-black/35 px-3 py-2.5">
                      <p className="text-[7px] font-black uppercase tracking-[.2em] text-zinc-700">
                        STATUS
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,.7)]" />
                        <span className="text-[9px] font-black text-zinc-400">
                          ACTIVE
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[.06] bg-black/35 px-3 py-2.5">
                      <p className="text-[7px] font-black uppercase tracking-[.2em] text-zinc-700">
                        STANDARD
                      </p>
                      <p className="mt-1.5 text-[9px] font-black text-zinc-400">
                        IMC
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8 md:p-10">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl border border-white/[.05] bg-white/[.025]"
                  />
                ))}
              </div>
            ) : selectedItems.length === 0 ? (
              <div className="relative px-6 py-28 text-center md:px-10">
                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[.035] blur-[70px]" />

                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/[.07] bg-white/[.025] shadow-[0_20px_50px_rgba(0,0,0,.25)]">
                  {selectedModeData && (
                    <img
                      src={selectedModeData.icon}
                      alt=""
                      className="h-10 w-10 object-contain opacity-35"
                    />
                  )}
                </div>

                <p className="relative mt-7 text-[9px] font-black uppercase tracking-[.28em] text-red-500/70">
                  Standard Pending
                </p>

                <h3 className="relative mt-2 text-2xl font-black tracking-tight">
                  Rubric coming soon
                </h3>

                <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-600">
                  The official IMC {selectedMode} rubric has not been
                  published yet. Check back soon for the complete testing
                  standards.
                </p>
              </div>
            ) : (
              <div className="relative p-4 sm:p-7 md:p-9">

                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[.07] to-transparent" />
                  <span className="rounded-full border border-white/[.06] bg-white/[.025] px-3 py-1.5 text-[8px] font-black uppercase tracking-[.25em] text-zinc-600">
                    Testing Criteria
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[.07] to-transparent" />
                </div>

                <div className="space-y-4">
                  {selectedItems.map((item, index) =>
                    item.type === "box" ? (
                      <article
                        key={item.id}
                        className="group relative overflow-hidden rounded-[1.35rem] border border-white/[.075] bg-[#0a0b0f] transition-all duration-300 hover:border-red-500/20 hover:bg-[#0c0d11] hover:shadow-[0_20px_70px_rgba(0,0,0,.28)]"
                      >
                        <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-gradient-to-b from-red-500 via-red-500/50 to-purple-500/20 opacity-80 transition-all duration-300 group-hover:w-1 group-hover:opacity-100" />

                        <div className="absolute right-[-80px] top-[-100px] h-48 w-48 rounded-full bg-red-500/[.025] blur-[65px] transition-all duration-500 group-hover:bg-red-500/[.055]" />

                        <div className="relative p-5 sm:p-7 md:p-8">
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[.06] bg-black/40">
                              <span className="font-mono text-[10px] font-black text-red-400">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md border border-red-500/15 bg-red-500/[.06] px-2 py-1 text-[7px] font-black uppercase tracking-[.22em] text-red-400">
                                  Requirement
                                </span>

                                <span className="text-[7px] font-bold uppercase tracking-[.18em] text-zinc-700">
                                  IMC RUBRIC
                                </span>
                              </div>

                              <h3 className="mt-3 text-lg font-black tracking-tight text-white sm:text-xl">
                                {item.title || "Untitled Section"}
                              </h3>
                            </div>
                          </div>

                          <div className="my-5 h-px bg-gradient-to-r from-white/[.08] via-white/[.035] to-transparent" />

                          <div className="pl-0 sm:pl-14">
                            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-400 sm:text-[15px] sm:leading-8">
                              <DiscordEmojiText>
                                {item.content || "No content available."}
                              </DiscordEmojiText>
                            </p>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-[1.35rem] border border-red-500/15 bg-gradient-to-br from-red-500/[.07] via-red-500/[.025] to-purple-500/[.025] px-5 py-5 shadow-[0_15px_50px_rgba(239,68,68,.035)] sm:px-7 sm:py-6"
                      >
                        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-red-500 via-red-400/50 to-transparent" />

                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-500/[.045] blur-3xl" />

                        <div className="relative">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,.8)]" />
                            </span>

                            <span className="text-[8px] font-black uppercase tracking-[.28em] text-red-400">
                              IMC Notice
                            </span>
                          </div>

                          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300 sm:text-[15px] sm:leading-8">
                            <DiscordEmojiText>
                              {item.content || "No message available."}
                            </DiscordEmojiText>
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[.06] to-transparent" />
                  <span className="text-[7px] font-black uppercase tracking-[.25em] text-zinc-800">
                    International Minecraft Tierlist
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-white/[.06] to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
