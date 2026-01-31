export class SaveSystem {
    constructor() {
        this.saveKey = 'codemonkey_3d_save';
        this.data = this.load();
    }

    load() {
        const raw = localStorage.getItem(this.saveKey);
        if (raw) {
            return JSON.parse(raw);
        }
        return {
            unlockedLevels: [1],
            stars: {}, // levelId: numStars
            totalStars: 0
        };
    }

    save() {
        localStorage.setItem(this.saveKey, JSON.stringify(this.data));
    }

    unlockLevel(id) {
        if (!this.data.unlockedLevels.includes(id)) {
            this.data.unlockedLevels.push(id);
            this.save();
        }
    }

    setStars(levelId, stars) {
        const current = this.data.stars[levelId] || 0;
        if (stars > current) {
            this.data.stars[levelId] = stars;
            this.updateTotalStars();
            this.save();
        }
    }

    updateTotalStars() {
        this.data.totalStars = Object.values(this.data.stars).reduce((a, b) => a + b, 0);
    }

    isUnlocked(id) {
        return this.data.unlockedLevels.includes(id);
    }

    getStars(id) {
        return this.data.stars[id] || 0;
    }
}
