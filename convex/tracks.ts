import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateTrack } from "../src/engine/validateTrack";

const tileValidator = v.object({
  type: v.union(
    v.literal("straight"),
    v.literal("corner"),
    v.literal("tee"),
    v.literal("cross"),
    v.literal("start"),
    v.literal("goal")
  ),
  rot: v.union(v.literal(0), v.literal(90), v.literal(180), v.literal(270))
});

export const createTrack = mutation({
  args: {
    name: v.string(),
    width: v.number(),
    height: v.number(),
    tiles: v.record(v.string(), tileValidator)
  },
  handler: async (ctx: any, args: any) => {
    const validation = validateTrack(args.tiles, args.width, args.height);

    if (!validation.isValid) {
      throw new Error(validation.errors.map((error) => error.message).join(" "));
    }

    const now = Date.now();

    return await ctx.db.insert("tracks", {
      name: args.name,
      width: args.width,
      height: args.height,
      tiles: args.tiles,
      createdAt: now,
      updatedAt: now,
      isStarter: false
    });
  }
});

export const listTracks = query({
  args: {},
  handler: async (ctx: any) => {
    const tracks = await ctx.db.query("tracks").collect();
    return tracks.sort((a: any, b: any) => Number(b.isStarter) - Number(a.isStarter) || a.name.localeCompare(b.name));
  }
});

export const getTrack = query({
  args: {
    id: v.id("tracks")
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  }
});
