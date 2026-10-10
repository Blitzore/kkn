/**
 * soundSystem.js - Synthesizer Audio Web Audio API Retro 8-Bit
 * Menghasilkan semua SFX dan BGM secara prosedural tanpa file audio MP3/WAV eksternal.
 */

class SoundSystem {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.bgmStep = 0;
        this.tempo = 145;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBgm();
        } else {
            this.startBgm();
        }
        return this.muted;
    }

    playTone(freq, type = 'square', duration = 0.08, gainVal = 0.06, freqEnd = null) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            if (freqEnd !== null) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t + duration);
            }

            gain.gain.setValueAtTime(gainVal, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {
            // Audio context safely handled
        }
    }

    playStep() {
        this.playTone(320, 'triangle', 0.06, 0.08, 160);
    }

    playTurn() {
        this.playTone(440, 'sine', 0.08, 0.07, 660);
    }

    playJump() {
        this.playTone(280, 'sine', 0.18, 0.12, 750);
    }

    playDuck() {
        this.playTone(420, 'sine', 0.14, 0.09, 180);
    }

    playSnap() {
        this.playTone(700, 'triangle', 0.04, 0.06, 850);
    }

    playTrash() {
        this.playTone(500, 'sawtooth', 0.07, 0.05, 220);
    }

    playCrystal() {
        this.playTone(659.25, 'triangle', 0.1, 0.1);
        setTimeout(() => this.playTone(880, 'triangle', 0.1, 0.12), 80);
        setTimeout(() => this.playTone(1318.5, 'square', 0.22, 0.14), 160);
    }

    playError() {
        this.playTone(180, 'sawtooth', 0.18, 0.15, 90);
        setTimeout(() => this.playTone(140, 'sawtooth', 0.25, 0.12, 70), 120);
    }

    playFall() {
        this.playTone(550, 'sawtooth', 0.55, 0.14, 60);
    }

    playVictory() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.15, 0.12);
            }, idx * 110);
        });
        setTimeout(() => {
            this.playTone(1046.50, 'square', 0.45, 0.15);
        }, 460);
    }

    playLaser() {
        this.playTone(800, 'sawtooth', 0.12, 0.09, 200);
    }

    playSwitch() {
        this.playTone(450, 'square', 0.08, 0.08, 900);
    }

    playClick() {
        this.playTone(850, 'sine', 0.03, 0.04);
    }

    startBgm() {
        if (this.muted || this.bgmPlaying) return;
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.bgmPlaying = true;

        // Melodi Chiptune Retro Ceria & Ramah Anak SD
        const lead = [
            523.25, 659.25, 783.99, 659.25,
            587.33, 659.25, 698.46, 587.33,
            659.25, 783.99, 880.00, 783.99,
            698.46, 659.25, 587.33, 523.25,
            440.00, 523.25, 659.25, 523.25,
            493.88, 587.33, 698.46, 587.33,
            523.25, 659.25, 783.99, 1046.50,
            783.99, 659.25, 587.33, 523.25
        ];

        const bass = [
            130.81, 0, 130.81, 0,
            146.83, 0, 146.83, 0,
            164.81, 0, 164.81, 0,
            174.61, 0, 196.00, 0,
            110.00, 0, 110.00, 0,
            123.47, 0, 123.47, 0,
            130.81, 0, 164.81, 0,
            196.00, 0, 130.81, 0
        ];

        const stepTime = 160;
        this.bgmTimer = setInterval(() => {
            if (!this.bgmPlaying || this.muted) return;
            const leadNote = lead[this.bgmStep % lead.length];
            const bassNote = bass[this.bgmStep % bass.length];

            if (leadNote > 0) {
                this.playTone(leadNote, 'triangle', 0.12, 0.04);
            }
            if (bassNote > 0) {
                this.playTone(bassNote, 'sine', 0.14, 0.05);
            }
            this.bgmStep++;
        }, stepTime);
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.soundSystem = new SoundSystem();
