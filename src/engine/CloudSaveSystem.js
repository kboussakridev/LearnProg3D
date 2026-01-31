import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export class CloudSaveSystem {
    constructor(game, auth) {
        this.game = game;
        this.auth = auth;
        this.convexUrl = import.meta.env.VITE_CONVEX_URL;
        this.client = new ConvexClient(this.convexUrl);
        this.progress = [];
    }

    async syncWithCloud() {
        if (!this.auth.isAuthenticated) return;

        // Pass the token fetcher function to Convex
        this.client.setAuth(() => this.auth.getToken());

        try {
            const cloudProgress = await this.client.query(api.progress.getProgress);
            if (cloudProgress) {
                this.progress = cloudProgress;

                // Merge cloud progress into game local state if needed
                cloudProgress.forEach(p => {
                    if (p.unlocked) this.game.saveSystem.data.unlockedLevels.push(p.levelId);
                    if (p.stars > 0) this.game.saveSystem.data.stars[p.levelId] = p.stars;
                });

                // Remove duplicates in unlockedLevels
                this.game.saveSystem.data.unlockedLevels = [...new Set(this.game.saveSystem.data.unlockedLevels)];
                this.game.saveSystem.updateTotalStars();
            }
        } catch (e) {
            console.error("Cloud Sync Error:", e);
        }
    }

    async saveLevel(levelId, stars, unlocked) {
        if (!this.auth.isAuthenticated) return;

        // Ensure Convex uses our token fetcher
        this.client.setAuth(() => this.auth.getToken());

        try {
            await this.client.mutation(api.progress.saveLevelProgress, {
                levelId,
                stars,
                unlocked
            });
            console.log(`Cloud: Level ${levelId} progress saved.`);
        } catch (e) {
            console.error("Cloud Save Error:", e);
        }
    }
}
