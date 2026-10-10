/**
 * gameState.js - State Manager Permainan ALGO-BOT
 * Mengelola level aktif, bintang yang diperoleh, skor, dan inventori perintah.
 */

class GameState {
    constructor(levelsData) {
        this.levels = levelsData || [];
        this.currentLevelIndex = 0;
        this.starsEarned = new Array(this.levels.length).fill(0);
        this.completedLevels = new Array(this.levels.length).fill(false);
        this.totalScore = 0;
        this.loadProgress();
    }

    getCurrentLevel() {
        return this.levels[this.currentLevelIndex] || null;
    }

    setLevel(idx) {
        if (idx >= 0 && idx < this.levels.length) {
            this.currentLevelIndex = idx;
            return this.getCurrentLevel();
        }
        return null;
    }

    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            return { hasNext: true, level: this.getCurrentLevel() };
        }
        return { hasNext: false, isCompleted: true };
    }

    isLevelCompleted(idx) {
        return Boolean(this.completedLevels[idx] || (this.starsEarned[idx] && this.starsEarned[idx] > 0));
    }

    markCompleted(stars = 1) {
        this.completedLevels[this.currentLevelIndex] = true;
        const lvl = this.getCurrentLevel();
        const max = lvl ? (lvl.maxStars || 1) : 1;
        const finalStars = Math.min(stars, max);
        if (finalStars > (this.starsEarned[this.currentLevelIndex] || 0)) {
            this.starsEarned[this.currentLevelIndex] = finalStars;
        }
        this.totalScore += finalStars * 100;
        this.saveProgress();
    }

    getTotalStars() {
        return this.starsEarned.reduce((a, b) => a + b, 0);
    }

    getMaxStars() {
        return this.levels.reduce((total, lvl) => total + (lvl.maxStars || 1), 0);
    }

    saveProgress() {
        try {
            const data = {
                currentLevelIndex: this.currentLevelIndex,
                starsEarned: this.starsEarned,
                completedLevels: this.completedLevels,
                totalScore: this.totalScore
            };
            localStorage.setItem('algobot_progress', JSON.stringify(data));
        } catch (e) {
            // LocalStorage fallback
        }
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('algobot_progress');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.starsEarned && Array.isArray(data.starsEarned)) {
                    this.starsEarned = data.starsEarned;
                }
                if (data.completedLevels && Array.isArray(data.completedLevels)) {
                    this.completedLevels = data.completedLevels;
                } else if (data.starsEarned && Array.isArray(data.starsEarned)) {
                    this.completedLevels = data.starsEarned.map(s => s > 0);
                }
                if (typeof data.totalScore === 'number') {
                    this.totalScore = data.totalScore;
                }
            }
        } catch (e) {
            // LocalStorage fallback
        }
    }

    resetProgress() {
        this.currentLevelIndex = 0;
        this.starsEarned = new Array(this.levels.length).fill(0);
        this.completedLevels = new Array(this.levels.length).fill(false);
        this.totalScore = 0;
        try {
            localStorage.removeItem('algobot_progress');
        } catch (e) {}
    }
}

window.GameState = GameState;
