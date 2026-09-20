import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const databasePath = path.join(process.cwd(), "data", "tierlist.json");

const GUILD_ID = "1545864519530717195";

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

const ROLE_GAMEMODES: Record<string, string> = {
  Sword: "Sword",
  Axe: "Axe",
  NethPot: "Netherite Pot",
  DPot: "Pot",
  CPvP: "CPvP",
  DMace: "Mace",
  "Elytra Mace": "Elytra Mace",
  "TNT Cart": "TNT Cart",
  UHC: "UHC",
  SMP: "SMP",
};

function getRequiredRole(tier: string, gamemode: string) {
  const roleGamemode = ROLE_GAMEMODES[gamemode] || gamemode;
  return `${tier} • ${roleGamemode}`.toLowerCase();
}

async function discordFetch(url: string) {
  const token = process.env.TOKEN;

  if (!token) {
    throw new Error("TOKEN environment variable is missing.");
  }

  const response = await fetch(`https://discord.com/api/v10${url}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function GET() {
  try {
    const database = JSON.parse(
      fs.readFileSync(databasePath, "utf8")
    );

    const roles = await discordFetch(`/guilds/${GUILD_ID}/roles`);

    if (!Array.isArray(roles)) {
      throw new Error("Failed to fetch Discord roles.");
    }

    const roleNames = new Map<string, string>();

    for (const role of roles) {
      roleNames.set(role.id, role.name.toLowerCase());
    }

    const validPlayers = [];

    for (const [username, player] of Object.entries(database) as [string, any][]) {
      if (!player?.userId) continue;

      const member = await discordFetch(
        `/guilds/${GUILD_ID}/members/${player.userId}`
      );

      if (!member) continue;

      const memberRoles = new Set(member.roles || []);
      const validGamemodes: Record<string, string> = {};

      for (const [gamemode, tier] of Object.entries(
        player.gamemodes || {}
      ) as [string, string][]) {
        const requiredRole = getRequiredRole(
          tier as string,
          gamemode as string
        );

        const hasRole = [...memberRoles].some(
          roleId =>
            roleNames.get(roleId as string) === requiredRole
        );

        if (hasRole) {
          validGamemodes[gamemode] = tier as string;
        }
      }

      if (Object.keys(validGamemodes).length === 0) continue;

      const score = Object.values(validGamemodes).reduce(
        (total, tier) => total + (POINTS[tier] || 0),
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

    validPlayers.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      players: validPlayers,
    });
  } catch (error) {
    console.error("❌ Failed to load tierlist:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load tierlist.",
      },
      { status: 500 }
    );
  }
}
