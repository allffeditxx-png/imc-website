import { NextResponse } from "next/server";

const API_BASE = "https://api.github.com";
const REPO = "allffeditxx-png/imc-web";
const BRANCH = "main";
const FILE_PATH = "data/tierlist.json";

const POINTS: Record<string, number> = {
  LT5: 1,
  HT5: 2,
  LT4: 3,
  HT4: 4,
  LT3: 6,
  HT3: 10,
  LT2: 20,
  HT2: 30,
  LT1: 45,
  HT1: 60,
};

const ALLOWED_GAMEMODES = [
  "Sword",
  "NethPot",
  "CPvP",
  "UHC",
  "DPot",
  "SMP",
  "Axe",
  "Mace",
];

function normalizeGamemode(gamemode: string): string | null {
  const value = gamemode.trim().toLowerCase().replace(/\s+/g, " ");

  const map: Record<string, string> = {
    sword: "Sword",
    axe: "Axe",

    nethpot: "NethPot",
    "neth pot": "NethPot",
    "neth-pot": "NethPot",
    "netherite pot": "NethPot",
    netheritepot: "NethPot",

    cpvp: "CPvP",
    crystal: "CPvP",

    uhc: "UHC",

    dpot: "DPot",
    "d pot": "DPot",
    "d-pot": "DPot",
    "dia pot": "DPot",
    "dia-pot": "DPot",
    "diamond pot": "DPot",
    pot: "DPot",

    smp: "SMP",

    mace: "Mace",
    dmace: "Mace",
    "d mace": "Mace",
    "d-mace": "Mace",
  };

  return map[value] || null;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error("GITHUB_TOKEN is not configured");
    }

    const response = await fetch(
      `${API_BASE}/repos/${REPO}/contents/${FILE_PATH}?ref=${encodeURIComponent(BRANCH)}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `GitHub returned HTTP ${response.status}: ${body}`
      );
    }

    const file = await response.json();

    if (!file.content) {
      throw new Error("GitHub file has no content");
    }

    const database = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf8")
    );

    const validPlayers = [];

    for (const [username, player] of Object.entries(database) as [
      string,
      any
    ][]) {
      if (!player?.userId) continue;

      if (!Array.isArray(player.results) || player.results.length === 0) {
        continue;
      }

      const validGamemodes: Record<string, string> = {};

      for (const [storedGamemode, tier] of Object.entries(
        player.gamemodes || {}
      ) as [string, string][]) {
        const gamemode = normalizeGamemode(storedGamemode);

        if (!gamemode || !ALLOWED_GAMEMODES.includes(gamemode)) {
          continue;
        }

        if (tier && POINTS[tier] !== undefined) {
          validGamemodes[gamemode] = tier;
        }
      }

      if (Object.keys(validGamemodes).length === 0) {
        continue;
      }

      const score = Object.values(validGamemodes).reduce(
        (total, tier) => total + POINTS[tier],
        0
      );

      validPlayers.push({
        username,
        userId: player.userId,
        region: player.region || "N/A",
        gamemodes: Object.fromEntries(
          Object.entries(validGamemodes).map(([gamemode, tier]) => [
            gamemode === "NethPot"
              ? "Netherite Pot"
              : gamemode === "DPot"
                ? "Pot"
                : gamemode,
            tier,
          ])
        ),
        score,
      });
    }

    validPlayers.sort((a, b) => b.score - a.score);

    return NextResponse.json(
      {
        success: true,
        players: validPlayers,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("❌ Failed to load tierlist:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load tierlist.",
      },
      {
        status: 500,
      }
    );
  }
}
