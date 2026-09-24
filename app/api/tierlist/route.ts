import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const databasePath = path.join(
  process.cwd(),
  "data",
  "tierlist.json"
);

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

function normalizeGamemode(
  gamemode: string
): string | null {
  const value = gamemode
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

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

export async function GET() {
  try {
    const database = JSON.parse(
      fs.readFileSync(databasePath, "utf8")
    );

    const validPlayers = [];

    for (const [username, player] of Object.entries(
      database
    ) as [string, any][]) {
      if (!player?.userId) continue;

      if (
        !Array.isArray(player.results) ||
        player.results.length === 0
      ) {
        continue;
      }

      const validGamemodes: Record<string, string> = {};

      for (const [
        storedGamemode,
        tier,
      ] of Object.entries(
        player.gamemodes || {}
      ) as [string, string][]) {
        const gamemode =
          normalizeGamemode(storedGamemode);

        if (
          !gamemode ||
          !ALLOWED_GAMEMODES.includes(gamemode)
        ) {
          continue;
        }

        if (
          tier &&
          POINTS[tier] !== undefined
        ) {
          validGamemodes[gamemode] = tier;
        }
      }

      if (
        Object.keys(validGamemodes).length === 0
      ) {
        continue;
      }

      const score =
        Object.values(validGamemodes).reduce(
          (total, tier) =>
            total + POINTS[tier],
          0
        );

      validPlayers.push({
        username,
        userId: player.userId,
        region: player.region || "N/A",
        gamemodes: validGamemodes,
        score,
      });
    }

    validPlayers.sort(
      (a, b) => b.score - a.score
    );

    return NextResponse.json(
      {
        success: true,
        players: validPlayers,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error(
      "❌ Failed to load tierlist:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load tierlist.",
      },
      { status: 500 }
    );
  }
}
