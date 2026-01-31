import { Clerk } from '@clerk/clerk-js';

export class AuthManager {
    constructor(game) {
        this.game = game;
        this.clerk = null;
        this.user = null;
        this.publicKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    }

    async init() {
        if (!this.publicKey) {
            console.warn("Clerk Publishable Key missing. Auth disabled.");
            return;
        }

        this.clerk = new Clerk(this.publicKey);
        await this.clerk.load();

        // Listen for session changes
        this.clerk.addListener(({ user }) => {
            this.user = user;
            this.game.onAuthChanged(!!user);
        });

        if (this.clerk.user) {
            this.user = this.clerk.user;
            this.game.onAuthChanged(true);
        } else {
            this.game.onAuthChanged(false);
        }
    }

    async login() {
        if (!this.clerk) return;
        this.clerk.openSignIn();
    }

    async logout() {
        if (!this.clerk) return;
        await this.clerk.signOut();
        window.location.reload();
    }

    async getToken() {
        if (!this.clerk || !this.clerk.session) return null;
        try {
            return await this.clerk.session.getToken({ template: "convex" });
        } catch (e) {
            console.error("Clerk Token error: Is the 'convex' JWT template configured?", e);
            return null;
        }
    }

    get isAuthenticated() {
        return !!this.user;
    }
}
