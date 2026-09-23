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
  NethPot: "Netherite Pot",
  CPvP: "CPvP",
  UHC: "UHC",
  DPot: "Pot",
  SMP: "SMP",
  Axe: "Axe",
  Mace: "Mace",
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

const TIERS = [
  "HT1",
  "LT1",
  "HT2",
  "LT2",
  "HT3",
  "LT3",
  "HT4",
  "LT4",
  "HT5",
  "LT5",
];

function getRequiredRole(tier: string, gamemode: string) {
  const roleGamemode = ROLE_GAMEMODES[gamemode] || gamemode;
  return `${tier} • ${roleGamemode}`.toLowerCase();
}

async function discordFetch(url: string, retries = 3) {
  const token = process.env.TOKEN;

  if (!token) {
    throw new Error("TOKEN environment variable is missing.");
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://discord.com/api/v10${url}`,
        {
          headers: {
            Authorization: `Bot ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        return {
          status: response.status,
          data: await response.json(),
        };
      }

      if (response.status === 404) {
        return {
          status: 404,
          data: null,
        };
      }

      if (response.status === 429 || response.status >= 500) {
        if (attempt < retries) {
          await new Promise(resolve =>
            setTimeout(resolve, attempt * 1000)
          );
          continue;
        }
      }

      return {
        status: response.status,
        data: null,
      };
    } catch {
      if (attempt < retries) {
        await new Promise(resolve =>
          setTimeout(resolve, attempt * 1000)
        );
        continue;
      }
    }
  }

  throw new Error(`Discord request failed: ${url}`);
}

async function fetchAllGuildMembers() {
  const members = new Map<string, any>();
  let after = "0";

  while (true) {
    const response = await discordFetch(
      `/guilds/${GUILD_ID}/members?limit=1000&after=${after}`
    );

    if (
      !response ||
      response.status !== 200 ||
      !Array.isArray(response.data)
    ) {
      throw new Error("Failed to fetch Discord guild members.");
    }

    for (const member of response.data) {
      if (member?.user?.id) {
        members.set(member.user.id, member);
      }
    }

    if (response.data.length < 1000) {
      break;
    }

    after = response.data[response.data.length - 1].user.id;
  }

  return members;
}

export async function GET() {
  try {
    const database = JSON.parse(
      fs.readFileSync(databasePath, "utf8")
    );

    const [rolesResponse, guildMembers] = await Promise.all([
      discordFetch(`/guilds/${GUILD_ID}/roles`),
      fetchAllGuildMembers(),
    ]);

    if (
      !rolesResponse ||
      rolesResponse.status !== 200 ||
      !Array.isArray(rolesResponse.data)
    ) {
      throw new Error("Failed to fetch Discord roles.");
    }

    const roleNames = new Map<string, string>();

    for (const role of rolesResponse.data) {
      roleNames.set(
        role.id,
        role.name.toLowerCase()
      );
    }

    const playerEntries = (
      Object.entries(database) as [string, any][]
    ).filter(
      ([, player]) => player?.userId
    );

    const validPlayers = [];

    for (const [username, player] of playerEntries) {
      const member = guildMembers.get(player.userId);

      if (!member) {
        continue;
      }

      const memberRoles = new Set<string>(
        Array.isArray(member.roles)
          ? member.roles
          : []
      );

      const validGamemodes: Record<string, string> = {};

      /*
       * Discord tier roles are the source of truth.
       * Only exact TIER • GAMEMODE roles are accepted.
       * All unrelated Discord roles are ignored.
       */
      for (const gamemode of ALLOWED_GAMEMODES) {
        const roleGamemode = (
          ROLE_GAMEMODES[gamemode] || gamemode
        ).toLowerCase();

        for (const tier of TIERS) {
          const requiredRole = `${tier} • ${roleGamemode}`.toLowerCase();

          const hasRole = [...memberRoles].some(roleId => {
            const roleName = roleNames.get(roleId);

            return roleName === requiredRole;
          });

          if (hasRole) {
            validGamemodes[gamemode] = tier;
            break;
          }
        }
      }

      /*
       * A player must have at least one valid tier role.
       * Players with no tier roles are excluded.
       */
      if (Object.keys(validGamemodes).length === 0) {
        continue;
      }

      if (Object.keys(validGamemodes).length === 0) {
        continue;
      }

      const score = Object.values(
        validGamemodes
      ).reduce(
        (total, tier) =>
          total + (POINTS[tier] || 0),
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

    return NextResponse.json({
      success: true,
      players: validPlayers,
    });
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
