import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user progress
export const getProgress = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) return null;

        const progress = await ctx.db
            .query("progress")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        return progress;
    },
});

// Save progress for a level
export const saveLevelProgress = mutation({
    args: {
        levelId: v.number(),
        stars: v.number(),
        unlocked: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        let user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            // Create user if they don't exist
            const userId = await ctx.db.insert("users", {
                name: identity.name || "Unknown Monkey",
                tokenIdentifier: identity.tokenIdentifier,
            });
            user = await ctx.db.get(userId);
        }

        // Check existing progress for this level
        const existing = await ctx.db
            .query("progress")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter((q) => q.eq(q.field("levelId"), args.levelId))
            .unique();

        if (existing) {
            // Update if stars are higher
            if (args.stars > existing.stars || args.unlocked !== existing.unlocked) {
                await ctx.db.patch(existing._id, {
                    stars: Math.max(args.stars, existing.stars),
                    unlocked: args.unlocked || existing.unlocked,
                });
            }
        } else {
            // New progress entry
            await ctx.db.insert("progress", {
                userId: user._id,
                levelId: args.levelId,
                stars: args.stars,
                unlocked: args.unlocked,
            });
        }
    },
});
