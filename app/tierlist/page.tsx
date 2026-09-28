"use client";

import { useEffect, useRef, useState } from "react";

const modes = ["CPvP","Netherite Pot","Pot","Sword","Axe","Mace","UHC","SMP"];

const tierPoints: Record<string,number> = {
  LT5: 1,
  HT5: 2,
  LT4: 3,
  HT4: 4,
  LT3: 6,
  HT3: 10,
  LT2: 20,
  HT2: 30,
  LT1: 45,
  HT1: 60
};

function getPlayerRank(score:number) {
  if (score >= 400) return "Grandmaster";
  if (score >= 300) return "Legend";
  if (score >= 180) return "Ace";
  if (score >= 100) return "Master";
  if (score >= 50) return "Elite";
  if (score >= 20) return "Challenger";
  return "Rookie";
}

type Player = {
  username:string;
  userId:string|null;
  region:string;
  score:number;
  gamemodes:Record<string,string>;
};

export default function Tierlist() {
  const [players,setPlayers] = useState<Player[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [selected,setSelected] = useState<Player|null>(null);
  const [search,setSearch] = useState("");
  const [filterMode,setFilterMode] = useState("All");

  const selectedRank = selected
    ? [...players]
        .sort((a, b) => b.score - a.score)
        .findIndex(p => p.username === selected.username) + 1
    : 0;

  const selectedStats = selected
    ? (() => {
        const tested = modes
          .filter(mode => selected.gamemodes[mode])
          .map(mode => ({
            mode,
            tier: selected.gamemodes[mode],
            points: tierPoints[selected.gamemodes[mode]] || 0,
          }));

        const sorted = [...tested].sort((a, b) => b.points - a.points);
        const averagePoints = tested.length
          ? tested.reduce((sum, item) => sum + item.points, 0) / tested.length
          : 0;

        const tierLevels = Object.entries(tierPoints).sort((a, b) => b[1] - a[1]);
        const averageTier =
          tierLevels.find(([, points]) => averagePoints >= points)?.[0] || "—";

        return {
          tested,
          highest: sorted[0] || null,
          lowest: sorted[sorted.length - 1] || null,
          averageTier,
          spread: sorted.length ? sorted[0].points - sorted[sorted.length - 1].points : 0,
        };
      })()
    : null;

  useEffect(() => {
    let cancelled = false;

    fetch("/api/tierlist", {
      cache: "no-store"
    })
      .then(async r => {
        if (!r.ok) {
          throw new Error(`API returned ${r.status}`);
        }

        const data = await r.json();

        if (!data?.success) {
          throw new Error(data?.error || "Failed to load tierlist");
        }

        return data;
      })
      .then(data => {
        if (cancelled) return;

        setPlayers(Array.isArray(data.players) ? data.players : []);
        setError("");
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;

        console.error("❌ Tierlist loading error:", err);
        setError("Failed to load tierlist.");
        setLoading(false);
      });

  return () => {
      cancelled = true;
    };
  },[]);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) return;

    const exact = players.find(
      p => p.username.toLowerCase() === query
    );

    if (exact) {
      setSelected(exact);
    }
  }, [search, players]);

  const skinCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!selected || !skinCanvasRef.current) return;

    let viewer: any = null;
    let waveTimer: ReturnType<typeof setTimeout> | null = null;
    let intervalTimer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const start = async () => {
      const skinview3d = await import("skinview3d");

      if (cancelled || !skinCanvasRef.current) return;

      viewer = new skinview3d.SkinViewer({
        canvas: skinCanvasRef.current,
        width: 150,
        height: 190,
        skin: `https://mc-heads.net/download/${encodeURIComponent(selected.username)}`,
      });

      viewer.fov = 38;
      viewer.zoom = 0.62;

      const idle = () => {
        if (!viewer) return;
        viewer.animation = new skinview3d.IdleAnimation();
        viewer.animation.speed = 0.65;
      };

      const wave = () => {
        if (!viewer) return;
        viewer.animation = new skinview3d.WaveAnimation();
        viewer.animation.speed = 0.55;

        if (waveTimer) clearTimeout(waveTimer);
        waveTimer = setTimeout(idle, 4200);
      };

      // Wave immediately when profile opens
      wave();

      // Wave again every 10 seconds
      intervalTimer = setInterval(wave, 10000);
    };

    start();

    return () => {
      cancelled = true;

      if (waveTimer) clearTimeout(waveTimer);
      if (intervalTimer) clearInterval(intervalTimer);

      if (viewer) {
        viewer.dispose();
        viewer = null;
      }
    };
  }, [selected?.username]);

  return (
    <main
      className="min-h-screen bg-[#050505] px-3 pb-20 pt-24 text-white sm:px-4 sm:pt-28"
    >

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-red-600/[0.16] blur-[150px]" />
        <div className="absolute left-[-300px] top-[40%] h-[600px] w-[600px] rounded-full bg-red-900/[0.13] blur-[140px]" />
        <div className="absolute right-[-300px] top-[15%] h-[550px] w-[550px] rounded-full bg-red-700/[0.10] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* IMC TIERLIST HERO */}
        <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/[.08] bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(220,38,38,.18),transparent_32%),radial-gradient(circle_at_15%_100%,rgba(127,29,29,.12),transparent_35%)]" />
          <div className="absolute inset-0 opacity-[.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:34px_34px]" />

          <div className="relative px-5 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-col gap-7">

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-8 bg-red-500" />
                  <span className="text-[9px] font-black uppercase tracking-[.28em] text-red-400">
                    International Minecraft Tierlist
                  </span>
                </div>

                <h1 className="text-4xl font-black leading-[.9] tracking-[-.04em] sm:text-6xl">
                  <span className="text-white">IMC </span>
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">
                    TIERLIST
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-[11px] font-medium leading-relaxed text-gray-500 sm:text-xs">
                  Competitive Minecraft PvP rankings across every supported gamemode.
                  Explore players, tiers and overall performance.
                </p>
              </div>

              {/* SEARCH */}
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search player by Minecraft IGN..."
                  className="h-12 w-full rounded-2xl border border-white/[.09] bg-black/60 px-12 pr-12 text-xs font-bold text-white outline-none backdrop-blur-xl transition placeholder:text-gray-700 focus:border-red-500/40 focus:bg-black/80 focus:shadow-[0_0_35px_rgba(239,68,68,.08)]"
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-red-400">
                  🔎
                </span>

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-gray-600 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {search.trim() && players.some(p =>
                p.username.toLowerCase().includes(search.trim().toLowerCase())
              ) && (
                <p className="-mt-4 text-[8px] font-black uppercase tracking-[.2em] text-red-400/70">
                  Player found
                </p>
              )}

            </div>
          </div>
        </section>

        {/* GAMEMODE NAVIGATION */}
        <section className="mb-7 rounded-[1.5rem] border border-white/[.07] bg-[#090909]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,.3)] backdrop-blur-xl">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">

            <div className="mr-1 hidden shrink-0 px-2 sm:block">
              <p className="text-[7px] font-black uppercase tracking-[.2em] text-gray-700">
                Mode
              </p>
            </div>

            <button
              onClick={() => setFilterMode("All")}
              className={`group relative shrink-0 overflow-hidden rounded-xl border px-4 py-2.5 text-[9px] font-black uppercase tracking-[.12em] transition-all duration-200 ${
                filterMode === "All"
                  ? "border-red-500/50 bg-red-500/[.10] text-red-300 shadow-[0_0_24px_rgba(239,68,68,.12)]"
                  : "border-white/[.06] bg-white/[.02] text-gray-600 hover:border-white/[.12] hover:bg-white/[.04] hover:text-gray-300"
              }`}
            >
              {filterMode === "All" && (
                <span className="absolute inset-x-3 bottom-0 h-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.8)]" />
              )}
              Overall
            </button>

            {modes.map(mode => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[9px] font-black uppercase tracking-[.08em] transition-all duration-200 ${
                  filterMode === mode
                    ? "border-red-500/50 bg-red-500/[.10] text-red-300 shadow-[0_0_24px_rgba(239,68,68,.12)]"
                    : "border-white/[.06] bg-white/[.02] text-gray-600 hover:border-white/[.12] hover:bg-white/[.04] hover:text-gray-300"
                }`}
              >
                <img
                  src={`/tierlist-icons/${mode}.png`}
                  alt=""
                  className="h-4 w-4 object-contain opacity-80"
                />
                {mode}
                {filterMode === mode && (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,.8)]" />
                )}
              </button>
            ))}

          </div>
        </section>

          <>
            <section>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/[.08] bg-gradient-to-b from-white/[.025] via-[#0a0a0a] to-black/40 shadow-[0_30px_100px_rgba(0,0,0,.45)]">

                {filterMode === "All" ? (
                  <>
                    {players
                      .filter(p => p.username.toLowerCase().includes(search.toLowerCase()))
                      .sort((a, b) => b.score - a.score)
                      .map((p, i) => {
                        const rankIndex = i;
        return (
                  <button
                    key={`${p.userId}-${rankIndex}`}
                    onClick={() => setSelected(p)}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden border-b border-white/[.05] bg-gradient-to-r from-[#0d0d0d] via-[#090909] to-[#0b0808] p-3.5 text-left transition-all duration-300 hover:bg-red-500/[.035] hover:shadow-[inset_3px_0_0_rgba(239,68,68,.55),0_0_35px_rgba(239,68,68,.04)] sm:p-4 ${
                      rankIndex === 0
                        ? "imc-top-card imc-rank-gold"
                        : rankIndex === 1
                        ? "imc-top-card imc-rank-silver"
                        : rankIndex === 2
                        ? "imc-top-card imc-rank-bronze"
                        : ""
                    }`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${
                      rankIndex === 0
                        ? "border-yellow-400/40 bg-yellow-400/[.08] text-yellow-400 shadow-[0_0_22px_rgba(250,204,21,.12)]"
                        : rankIndex === 1
                        ? "border-slate-200/30 bg-slate-200/[.07] text-slate-200 shadow-[0_0_20px_rgba(226,232,240,.08)]"
                        : rankIndex === 2
                        ? "border-orange-500/35 bg-orange-500/[.08] text-orange-400 shadow-[0_0_20px_rgba(180,83,9,.10)]"
                        : "border-white/[.07] bg-white/[.025] text-gray-600"
                    }`}>
                      #{rankIndex + 1}
                    </div>

                    <div className="flex min-w-[230px] items-start gap-3">
                      <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-black/50 ${
                        rankIndex === 0
                          ? "border-yellow-400/30"
                          : rankIndex === 1
                          ? "border-slate-200/25"
                          : rankIndex === 2
                          ? "border-orange-500/30"
                          : "border-white/[.07]"
                      }`}>
                        <img
                          src={`https://mc-heads.net/avatar/${encodeURIComponent(p.username)}/64`}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-sm font-black tracking-[.035em] [font-family:Impact,Haettenschweiler,Arial_Narrow_Bold,sans-serif] text-white">
                            {p.username}
                          </p>
                        </div>

                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase tracking-[.15em] text-red-400">
                            {filterMode === "All"
                              ? getPlayerRank(p.score)
                              : p.gamemodes[filterMode]}
                          </span>
                          <span className="text-gray-700">•</span>
                          <span className="text-[8px] font-bold uppercase tracking-[.12em] text-gray-600">
                            {p.region || "N/A"}
                          </span>
                        </div>

                        <div className="mt-2 flex max-w-full flex-wrap gap-1.5">
                          {filterMode !== "All" ? (
                            p.gamemodes[filterMode] && (
                              <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[.06] px-2 py-1 text-[9px] font-black text-gray-200">
                                <img
                                  src={`/tierlist-icons/${filterMode}.png`}
                                  alt=""
                                  className="h-3.5 w-3.5 object-contain"
                                />
                                {p.gamemodes[filterMode]}
                              </span>
                            )
                          ) : (
                            modes.map(mode => p.gamemodes[mode] && (
                              <span
                                key={mode}
                                className="flex shrink-0 items-center gap-1 rounded-md border border-white/[.07] bg-black/40 px-1.5 py-0.5 text-[8px] font-black text-gray-500"
                              >
                                <img
                                  src={`/tierlist-icons/${mode}.png`}
                                  alt=""
                                  className="h-3 w-3 object-contain"
                                />
                                {p.gamemodes[mode]}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden min-w-[70px] text-right sm:block">
                      <p className="text-lg font-black leading-none text-white">
                        {filterMode === "All"
                          ? p.score
                          : tierPoints[p.gamemodes[filterMode]] || 0}
                      </p>
                      <p className="mt-1 text-[7px] font-black uppercase tracking-[.18em] text-gray-700">
                        points
                      </p>
                    </div>

                    <span className="ml-1 text-gray-700 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-400">
                      →
                    </span>
                  </button>
                      );
                            })}

                    {players
                      .filter(p => p.username.toLowerCase().includes(search.toLowerCase()))
                      .length === 0 && (
                        <div className="px-6 py-16 text-center">
                          <p className="text-2xl font-black text-gray-700">No players found</p>
                          <p className="mt-2 text-xs text-gray-800">
                            Try another IGN or gamemode.
                          </p>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="space-y-5 bg-transparent p-2 sm:p-3">
                    {["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"].map(tierGroup => {
                      const tierNumber = tierGroup.replace("Tier ", "");

                      const tierPlayers = players
                        .filter(p =>
                          p.username.toLowerCase().includes(search.toLowerCase()) &&
                          Boolean(p.gamemodes[filterMode])
                        )
                        .filter(p => p.gamemodes[filterMode].endsWith(tierNumber))
                        .sort((a, b) => {
                          const order: Record<string, number> = {
                            HT1: 1, LT1: 2,
                            HT2: 3, LT2: 4,
                            HT3: 5, LT3: 6,
                            HT4: 7, LT4: 8,
                            HT5: 9, LT5: 10,
                          };

                          return (
                            (order[a.gamemodes[filterMode]] || 99) -
                            (order[b.gamemodes[filterMode]] || 99)
                          );
                        });

                      if (tierPlayers.length === 0) return null;

                      return (
                        <section key={tierGroup}>
                          <div className="mb-2 flex items-center gap-3 px-1">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

                            <div className="rounded-full border border-red-500/15 bg-red-500/[.04] px-4 py-1.5">
                              <p className="text-[9px] font-black uppercase tracking-[.22em] text-red-400">
                                {tierGroup}
                              </p>
                            </div>

                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                          </div>

                          <div
                            className="overflow-y-auto overscroll-contain touch-pan-y rounded-2xl border border-white/[.06] bg-black/20"
                            style={{
                              scrollbarWidth: "thin",
                              WebkitOverflowScrolling: "touch",
                            }}
                          >
                              {tierPlayers.map((p) => {
                                return (
                                  <button
                                    key={`${p.userId}-${p.username}-${filterMode}`}
                                    onClick={() => setSelected(p)}
                                    className="group relative flex min-w-0 items-center gap-2 rounded-xl border border-white/[.07] bg-gradient-to-r from-[#101010] to-[#090909] px-2.5 py-2 pr-20 text-left transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/[.05] hover:shadow-[0_0_20px_rgba(239,68,68,.06)]"
                                  >
                                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/[.08] bg-black/60">
                                      <img
                                        src={`https://mc-heads.net/avatar/${encodeURIComponent(p.username)}/64`}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-[10px] font-black tracking-[.02em] text-white">
                                        {p.username}
                                      </p>
                                    </div>

                                    <div className="absolute right-2.5 top-1/2 w-14 -translate-y-1/2 text-right">
                                      <p className="text-[8px] font-black uppercase tracking-[.08em] text-red-400">
                                        {p.gamemodes[filterMode]}
                                      </p>
                                      <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[.08em] text-gray-600">
                                        {p.region || "N/A"}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                          </div>
                        </section>
                      );
                    })}

                    {players
                      .filter(p =>
                        p.username.toLowerCase().includes(search.toLowerCase()) &&
                        Boolean(p.gamemodes[filterMode])
                      )
                      .length === 0 && (
                        <div className="px-6 py-16 text-center">
                          <p className="text-2xl font-black text-gray-700">No players found</p>
                          <p className="mt-2 text-xs text-gray-800">
                            Try another IGN or gamemode.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </section>
          </>

        {loading && (
          <p className="mt-20 text-center text-gray-600">
            Loading tierlist...
          </p>
        )}

        {!loading && error && (
          <p className="mt-20 text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && !players.length && (
          <p className="mt-20 text-center text-gray-600">
            No players found.
          </p>
        )}
      </div>


      <style jsx>{`
        @keyframes imcSkinFloat {
          0%, 100% {
            filter: drop-shadow(0 18px 25px rgba(0,0,0,.65));
          }
          50% {
            filter: drop-shadow(0 25px 30px rgba(239,68,68,.12));
          }
        }

        @keyframes imcSkinIdle {
          0%, 100% {
            transform: translateX(-50%) translateY(0) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-6px) rotate(-1deg);
          }
        }

        .imc-top-card {
          position: relative;
          isolation: isolate;
        }

        .imc-top-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: .75;
        }

        .imc-top-card::after {
          content: "";
          position: absolute;
          z-index: 5;
          top: -20%;
          bottom: -20%;
          left: -45%;
          width: 18%;
          background: linear-gradient(
            105deg,
            transparent,
            rgba(255,255,255,.68),
            transparent
          );
          transform: skewX(-18deg);
          animation: imcRankSweep 5s ease-in-out infinite;
          pointer-events: none;
        }

        .imc-rank-gold {
          border-color: rgba(250,204,21,.38) !important;
          background:
            radial-gradient(circle at 8% 50%, rgba(250,204,21,.13), transparent 28%),
            linear-gradient(90deg, rgba(250,204,21,.055), transparent 48%, rgba(250,204,21,.025)) !important;
          box-shadow:
            0 0 32px rgba(250,204,21,.11),
            inset 0 0 28px rgba(250,204,21,.035);
        }

        .imc-rank-silver {
          border-color: rgba(226,232,240,.34) !important;
          background:
            radial-gradient(circle at 8% 50%, rgba(226,232,240,.11), transparent 28%),
            linear-gradient(90deg, rgba(226,232,240,.045), transparent 48%, rgba(226,232,240,.02)) !important;
          box-shadow:
            0 0 30px rgba(226,232,240,.09),
            inset 0 0 26px rgba(226,232,240,.03);
        }

        .imc-rank-bronze {
          border-color: rgba(180,83,9,.38) !important;
          background:
            radial-gradient(circle at 8% 50%, rgba(180,83,9,.14), transparent 28%),
            linear-gradient(90deg, rgba(180,83,9,.055), transparent 48%, rgba(180,83,9,.025)) !important;
          box-shadow:
            0 0 30px rgba(180,83,9,.11),
            inset 0 0 26px rgba(180,83,9,.035);
        }

        @keyframes imcRankSweep {
          0%, 58% {
            left: -45%;
            opacity: 0;
          }

          66% {
            opacity: .9;
          }

          82%, 100% {
            left: 125%;
            opacity: 0;
          }
        }

        .profile-skin {
          animation: imcSkinIdle 2.8s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        @keyframes imcSkinIdle {
          0%, 100% {
            transform: translateX(-50%) rotate(0deg);
          }
          25% {
            transform: translateX(-50%) rotate(0.35deg);
          }
          50% {
            transform: translateX(-50%) rotate(0deg);
          }
          75% {
            transform: translateX(-50%) rotate(-0.35deg);
          }
        }
      `}</style>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/[.88] p-3 pt-14 backdrop-blur-2xl sm:items-center sm:p-5"
          onClick={() => setSelected(null)}
        >
          <button
      onClick={() => setSelected(null)}
      className="absolute right-3 top-3 z-[100] flex h-9 w-9 items-center justify-center rounded-xl border border-white/[.10] bg-black/80 text-sm text-gray-400 shadow-[0_0_20px_rgba(0,0,0,.6)] backdrop-blur-xl transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white sm:right-5 sm:top-5"
      aria-label="Close profile"
    >
      ✕
    </button>

    <div
            className={`relative w-full max-w-[330px] max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain touch-pan-y animate-[profileIn_.55s_cubic-bezier(.16,1,.3,1)] rounded-[1.5rem] border p-3 shadow-[0_0_100px_rgba(239,68,68,.13)] sm:max-h-[calc(100dvh-4rem)] sm:p-3 ${
              selectedRank === 1
                ? "border-yellow-400/35 bg-gradient-to-b from-yellow-400/[.08] via-[#0a0a0a] to-[#070707] shadow-[0_0_70px_rgba(250,204,21,.12)]"
                : selectedRank === 2
                ? "border-slate-200/30 bg-gradient-to-b from-slate-200/[.07] via-[#0a0a0a] to-[#070707] shadow-[0_0_70px_rgba(226,232,240,.10)]"
                : selectedRank === 3
                ? "border-orange-500/35 bg-gradient-to-b from-orange-500/[.08] via-[#0a0a0a] to-[#070707] shadow-[0_0_70px_rgba(180,83,9,.12)]"
                : "border-red-500/20 bg-gradient-to-b from-[#111111] via-[#0a0a0a] to-[#070707]"
            }`}
            onClick={e => e.stopPropagation()}
          >

            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-24 w-full items-center justify-center overflow-visible sm:h-28">
                <canvas
                  ref={skinCanvasRef}
                  className="h-[145px] w-[115px] max-w-full"
                />
              </div>

              <h2 className="mt-0 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {selected.username}
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                🌍 {selected.region || "N/A"}
              </p>

              <p className="mt-3 text-xs font-black text-gray-500">
                Rank — <span className={
                  selectedRank === 1
                    ? "text-yellow-400"
                    : selectedRank === 2
                    ? "text-slate-200"
                    : selectedRank === 3
                    ? "text-orange-400"
                    : "text-red-400"
                }>{getPlayerRank(selected.score)}</span>
              </p>
              {selectedRank > 0 && selectedRank <= 3 && (
                <span className={`mt-2 rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-[.18em] ${
                  selectedRank === 1
                    ? "border-yellow-400/25 bg-yellow-400/10 text-yellow-400"
                    : selectedRank === 2
                    ? "border-slate-200/20 bg-slate-200/10 text-slate-200"
                    : "border-orange-500/25 bg-orange-500/10 text-orange-400"
                }`}>
                  {selectedRank === 1 ? "🥇 #1" : selectedRank === 2 ? "🥈 #2" : "🥉 #3"} Overall
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
              {modes.map(mode => {
                const tier = selected.gamemodes[mode];

                return (
                  <div
                    key={mode}
                    className="flex h-[70px] flex-col items-center justify-between rounded-xl border border-white/[.07] bg-gradient-to-b from-white/[.045] to-white/[.012] px-1.5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/25 hover:shadow-[0_8px_20px_rgba(239,68,68,.08)]"
                  >
                    <img
                      src={`/tierlist-icons/${mode}.png`}
                      alt=""
                      className="h-5 w-5 object-contain opacity-70 drop-shadow-[0_0_6px_rgba(255,255,255,.08)]"
                    />
                    <div className="min-w-0 text-left">
                      <p className="w-full truncate text-center text-[7px] font-bold uppercase tracking-wide text-gray-600">
                        {mode}
                      </p>
                      <p className="text-sm font-black text-white">
                        {tier || "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 rounded-2xl border border-white/[.07] bg-gradient-to-b from-white/[.035] to-white/[.01] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.22em] text-red-400">
                    Tier Analytics
                  </p>
                  <p className="mt-1 text-[8px] text-gray-600">
                    Performance across gamemodes
                  </p>
                </div>

                <span className="rounded-lg border border-red-500/15 bg-red-500/[.06] px-2 py-1 text-[8px] font-black text-red-400">
                  {Object.keys(selected.gamemodes).length} MODES
                </span>
              </div>

              <div className="space-y-2.5">
                {modes.map(mode => {
                  const tier = selected.gamemodes[mode];
                  if (!tier) return null;

                  const points = tierPoints[tier] || 0;
                  const percentage = Math.max(4, (points / 60) * 100);

                  return (
                    <div key={mode} className="flex items-center gap-2">
                      <img
                        src={`/tierlist-icons/${mode}.png`}
                        alt=""
                        className="h-4 w-4 shrink-0 object-contain"
                      />

                      <span className="w-[66px] shrink-0 truncate text-[8px] font-bold text-gray-500">
                        {mode}
                      </span>

                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[.045]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 shadow-[0_0_8px_rgba(239,68,68,.28)] transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="w-7 text-right text-[9px] font-black text-white">
                        {tier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>



            <div className="mt-3 overflow-hidden rounded-2xl border border-white/[.07] bg-gradient-to-b from-white/[.035] to-white/[.01] p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.22em] text-red-400">
                    Web Analytics
                  </p>
                  <p className="mt-1 text-[8px] text-gray-600">
                    Overall performance shape
                  </p>
                </div>
                <span className="text-[8px] font-black text-gray-700">8 MODES</span>
              </div>

              <div className="flex justify-center">
                <svg viewBox="0 0 220 220" className="h-[260px] w-[260px] max-w-full">
                  <polygon
                    points="110,20 173.64,46.36 200,110 173.64,173.64 110,200 46.36,173.64 20,110 46.36,46.36"
                    fill="none"
                    stroke="rgba(255,255,255,.08)"
                    strokeWidth="1"
                  />
                  <polygon
                    points="110,65 141.82,78.18 155,110 141.82,141.82 110,155 78.18,141.82 65,110 78.18,78.18"
                    fill="none"
                    stroke="rgba(255,255,255,.05)"
                    strokeWidth="1"
                  />

                  {modes.map((mode, i) => {
                    const angle = (Math.PI * 2 * i) / modes.length - Math.PI / 2;
                    const x = 110 + Math.cos(angle) * 90;
                    const y = 110 + Math.sin(angle) * 90;
                    return (
                      <line
                        key={`axis-${mode}`}
                        x1="110"
                        y1="110"
                        x2={x}
                        y2={y}
                        stroke="rgba(255,255,255,.06)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon
                    points={modes.map((mode, i) => {
                      const value = tierPoints[selected.gamemodes[mode]] || 0;
                      const angle = (Math.PI * 2 * i) / modes.length - Math.PI / 2;
                      const radius = 90 * (value / 60);
                      return `${110 + Math.cos(angle) * radius},${110 + Math.sin(angle) * radius}`;
                    }).join(" ")}
                    fill="rgba(239,68,68,.13)"
                    stroke="rgba(239,68,68,.8)"
                    strokeWidth="2"
                  />

                  {modes.map((mode, i) => {
                    const angle = (Math.PI * 2 * i) / modes.length - Math.PI / 2;
                    const x = 110 + Math.cos(angle) * 105;
                    const y = 110 + Math.sin(angle) * 105;
                    return (
                      <text
                        key={`label-${mode}`}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-500 text-[7px] font-bold"
                      >
                        {mode}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[.07] bg-white/[.02] p-3">
              <div className="mb-3">
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-red-400">
                  Profile Statistics
                </p>
                <p className="mt-1 text-[8px] text-gray-600">
                  Overall performance breakdown
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Overall Rank", `#${selectedRank}`],
                  ["Highest Tier", selectedStats?.highest?.tier || "—"],
                  ["Average Tier", selectedStats?.averageTier || "—"],
                  ["Modes Tested", `${selectedStats?.tested.length || 0}/8`],
                  ["Best Mode", selectedStats?.highest?.mode || "—"],
                  ["Lowest Mode", selectedStats?.lowest?.mode || "—"],
                  ["Tier Spread", `${selectedStats?.spread || 0} pts`],
                  ["Total Points", `${selected.score}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[.05] bg-black/30 px-3 py-2.5"
                  >
                    <p className="text-[7px] font-black uppercase tracking-[.16em] text-gray-600">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-xs font-black text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
