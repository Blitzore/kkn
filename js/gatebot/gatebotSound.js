/**
 * GATE-BOT — Sound FX Module
 * File: js/gatebot/gatebotSound.js
 * Synthesizes audio cues using Web Audio API (No external assets required)
 */

(function() {
    'use strict';

    class GateBotSound {
        constructor() {
            this.ctx = null;
            this.muted = false;
        }

        init() {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTone(freq, dur, type = 'sine', vol = 0.15) {
            if (this.muted) return;
            try {
                this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + dur);
            } catch(e) {}
        }

        gateOpen() {
            this.playTone(330, 0.09, 'sine', 0.18);
            setTimeout(() => this.playTone(440, 0.09, 'sine', 0.18), 80);
            setTimeout(() => this.playTone(660, 0.18, 'triangle', 0.2), 160);
        }

        gateDenied() {
            this.playTone(180, 0.28, 'sawtooth', 0.22);
        }

        accessGranted() {
            this.playTone(523.25, 0.1, 'triangle', 0.16);
            setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.18), 90);
        }

        fanfareWin() {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((n, i) => setTimeout(() => this.playTone(n, 0.2, 'triangle', 0.2), i * 110));
        }
    }

    if (typeof window !== 'undefined') {
        window.GateBotSound = GateBotSound;
    }
})();
