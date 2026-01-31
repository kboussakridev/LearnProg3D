import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(), // From Clerk
    }).index("by_token", ["tokenIdentifier"]),

    progress: defineTable({
        userId: v.id("users"),
        levelId: v.number(),
        stars: v.number(),
        unlocked: v.boolean(),
    }).index("by_user", ["userId"]),
});
