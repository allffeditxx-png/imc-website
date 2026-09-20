"use client";

import { useEffect, useState } from "react";

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
  const [selected,setSelected] = useState<Player|null>(null);
  const [search,setSearch] = useState("");
  const [filterMode,setFilterMode] = useState("All");

  useEffect(() => {
    fetch("/api/tierlist")
      .then(r => r.json())
      .then(d => setPlayers(d.players || []))
      .catch(() => {});
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

  return (
    <main
      className="min-h-screen bg-[#050505] px-4 pb-20 pt-28 text-white"
    >

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-red-600/[0.11] blur-[170px]" />
        <div className="absolute left-[-300px] top-[40%] h-[600px] w-[600px] rounded-full bg-red-900/[0.10] blur-[150px]" />
        <div className="absolute right-[-300px] top-[15%] h-[550px] w-[550px] rounded-full bg-red-700/[0.07] blur-[160px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        <section className="mb-10 rounded-2xl border border-white/5 bg-[#050505]/80 p-3 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Minecraft IGN..."
                className="w-full rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 pl-12 text-sm font-bold text-white outline-none transition placeholder:text-gray-600 focus:border-red-500/40"
              />
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-gray-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {search.trim() && players.some(p =>
              p.username.toLowerCase().includes(search.trim().toLowerCase())
            ) && (
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Player found
              </p>
            )}

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterMode("All")}
                className={`shrink-0 rounded-xl border px-4 py-2 text-[10px] font-black uppercase transition ${
                  filterMode === "All"
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-white/10 bg-white/[.02] text-gray-500"
                }`}
              >
                All
              </button>

              {modes.map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black transition duration-300 ${
                    filterMode === mode
                      ? "scale-[1.02] border-red-500/50 bg-red-500/10 text-white shadow-[0_0_18px_rgba(239,68,68,.12)]"
                      : "border-white/10 bg-white/[.02] text-gray-500 hover:border-white/20 hover:bg-white/[.04] hover:text-white"
                  }`}
                >
                  <img
                    src={`/tierlist-icons/${mode}.png`}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </section>

        <header className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[.4em] text-red-500">
            International Minecraft Tierlist
          </p>
          <h1 className="mt-3 text-6xl font-black tracking-tighter">
            TIERLIST
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Verified competitive Minecraft rankings.
          </p>
        </header>

        {players.length > 0 && (
          <>
            

            <section>
              <div className="mb-5 flex justify-between">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.3em] text-red-500">
                  {filterMode !== "All" && (
                    <img
                      src={`/tierlist-icons/${filterMode}.png`}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  {filterMode === "All" ? "Global Rankings" : `${filterMode} Rankings`}
                </p>
                <p className="text-xs text-gray-600">
                  {players
                    .filter(p => p.username.toLowerCase().includes(search.toLowerCase()))
                    .filter(p => filterMode === "All" || Boolean(p.gamemodes[filterMode]))
                    .length} Players
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10">
                {players
                  .filter(p =>
                    p.username.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter(p =>
                    filterMode === "All" || Boolean(p.gamemodes[filterMode])
                  )
                  .sort((a,b) =>
                    filterMode === "All"
                      ? b.score - a.score
                      : (tierPoints[b.gamemodes[filterMode]] || 0) -
                        (tierPoints[a.gamemodes[filterMode]] || 0)
                  )
                  .map((p,i) => (
                  <button
                    key={`${p.userId}-${i}`}
                    onClick={() => setSelected(p)}
                    className="flex w-full items-center gap-4 border-b border-white/[.05] bg-white/[.015] p-4 text-left transition hover:bg-red-500/[.04]"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                      i === 0
                        ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.15)]"
                        : i === 1
                        ? "border-gray-300/30 bg-gray-300/10 text-gray-300"
                        : i === 2
                        ? "border-orange-500/35 bg-orange-500/10 text-orange-400"
                        : "border-white/[0.06] bg-white/[0.02] text-gray-700"
                    }`}>
                      {i + 1}
                    </div>

                    <div className="flex min-w-[160px] items-center gap-3">
                      <img
                        src={`https://mc-heads.net/avatar/${encodeURIComponent(p.username)}/48`}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate font-black">
                          {p.username}

                        </p>
                        <p className="text-[9px] uppercase text-gray-700">
                          {p.region || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 gap-2 overflow-hidden">
                      {filterMode !== "All" ? (
                        p.gamemodes[filterMode] && (
                          <span className="flex shrink-0 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[.05] px-3 py-1.5 text-xs font-black text-white">
                            <img
                              src={`/tierlist-icons/${filterMode}.png`}
                              alt=""
                              className="h-5 w-5 object-contain"
                            />
                            {p.gamemodes[filterMode]}
                          </span>
                        )
                      ) : (
                        modes.map(mode => p.gamemodes[mode] && (
                          <span
                            key={mode}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-black text-gray-400"
                          >
                            <img
                              src={`/tierlist-icons/${mode}.png`}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                            {p.gamemodes[mode]}
                          </span>
                        ))
                      )}
                    </div>

                    <b className="hidden sm:block">
                      {filterMode === "All"
                        ? p.score
                        : tierPoints[p.gamemodes[filterMode]] || 0}
                    </b>
                    <span className="text-gray-700">→</span>
                  </button>
                ))}

                {players
                  .filter(p => p.username.toLowerCase().includes(search.toLowerCase()))
                  .filter(p => filterMode === "All" || Boolean(p.gamemodes[filterMode]))
                  .length === 0 && (
                    <div className="px-6 py-16 text-center">
                      <p className="text-2xl font-black text-gray-700">No players found</p>
                      <p className="mt-2 text-xs text-gray-800">
                        Try another IGN or gamemode.
                      </p>
                    </div>
                  )}
              </div>
            </section>
          </>
        )}

        {!players.length && (
          <p className="mt-20 text-center text-gray-600">
            Loading tierlist...
          </p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex animate-[fadeIn_.25s_ease-out] items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-xl animate-[profileIn_.55s_cubic-bezier(.16,1,.3,1)] rounded-3xl border border-red-500/20 bg-[#0b0b0b] p-6 shadow-[0_0_80px_rgba(239,68,68,.08)]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 rounded-lg px-2 py-1 text-gray-500 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-48 w-32 overflow-hidden">
                <img
                  src={`https://mc-heads.net/body/${encodeURIComponent(selected.username)}/100`}
                  alt=""
                  className="absolute left-1/2 top-0 h-48 w-auto -translate-x-1/2 object-contain object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <h2 className="mt-2 text-3xl font-black text-white">
                {selected.username}
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                🌍 {selected.region || "N/A"}
              </p>

              <p className="mt-4 text-sm font-black text-gray-500">
                Rank — <span className="text-red-400">{getPlayerRank(selected.score)}</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {modes.map(mode => {
                const tier = selected.gamemodes[mode];

                return (
                  <div
                    key={mode}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-3 py-2.5"
                  >
                    <img
                      src={`/tierlist-icons/${mode}.png`}
                      alt=""
                      className="h-6 w-6 shrink-0 object-contain"
                    />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-[8px] font-bold uppercase tracking-wide text-gray-600">
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

            <div className="mt-4 flex items-center justify-center gap-2 text-xs">
              <span className="text-gray-600">Total Points</span>
              <span className="font-black text-white">{selected.score}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
