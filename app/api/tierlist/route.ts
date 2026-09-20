import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const databasePath = path.join(process.cwd(), "data", "tierlist.json");

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

export async function GET() {
  try {
    const database = JSON.parse(
      fs.readFileSync(databasePath, "utf8")
    );

    const players = Object.entries(database)
      .map(([username, player]: [string, any]) => {
        const gamemodes = player.gamemodes || {};

        const score = Object.values(gamemodes).reduce(
          (total: number, tier: any) =>
            total + (POINTS[tier] || 0),
          0
        );

        return {
          username,
          userId: player.userId || null,
          region: player.region || "N/A",
          gamemodes,
          score,
        };
      })
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json({
      success: true,
      players,
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
