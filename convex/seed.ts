import { mutation } from "./_generated/server";
import { getStarterTracks } from "../src/lib/starterTracks";
import { validateTrack } from "../src/engine/validateTrack";

export const seedStarterTracks = mutation({
  args: {},
  handler: async (ctx: any) => {
    const starters = getStarterTracks();
    const now = Date.now();

    let inserted = 0;

    for (const track of starters) {
      const existing = await ctx.db
        .query("tracks")
        .withIndex("by_name", (q: any) => q.eq("name", track.name))
        .first();

      if (existing) {
        continue;
      }

      const validation = validateTrack(track.tiles, track.width, track.height);
      if (!validation.isValid) {
        throw new Error(`Starter track ${track.name} is invalid.`);
      }

      await ctx.db.insert("tracks", {
        name: track.name,
        width: track.width,
        height: track.height,
        tiles: track.tiles,
        createdAt: now,
        updatedAt: now,
        isStarter: true
      });
      inserted += 1;
    }

    return {
      inserted
    };
  }
});
