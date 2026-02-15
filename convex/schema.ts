import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

export default defineSchema({
  tracks: defineTable({
    name: v.string(),
    width: v.number(),
    height: v.number(),
    tiles: v.record(v.string(), tileValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
    isStarter: v.optional(v.boolean())
  })
    .index("by_name", ["name"])
    .index("by_starter", ["isStarter"])
});
