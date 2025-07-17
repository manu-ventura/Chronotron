import { Howl } from 'howler';

export class AudioManager {
  constructor() {
    this.sounds = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.7;
    this.isMuted = false;
    this.initializeSounds();
  }

  initializeSounds() {
    try {
      // Time jump sound effect
      this.sounds.timeJump = new Howl({
        src: ['/sounds/time-jump.mp3'],
        volume: this.sfxVolume,
        preload: true
      });

      // Puzzle solved sound effect
      this.sounds.puzzleSolved = new Howl({
        src: ['/sounds/puzzle-solved.mp3'],
        volume: this.sfxVolume,
        preload: true
      });

      // Paradox sound effect
      this.sounds.paradox = new Howl({
        src: ['/sounds/paradox.mp3'],
        volume: this.sfxVolume,
        preload: true
      });

      // Ambient background music
      this.sounds.ambient = new Howl({
        src: ['/sounds/ambient.mp3'],
        volume: this.musicVolume,
        loop: true,
        preload: true
      });

      // Jump sound effect
      this.sounds.jump = new Howl({
        src: ['/sounds/jump.mp3'],
        volume: this.sfxVolume * 0.5,
        preload: true
      });

      // Switch/button sound effect
      this.sounds.switch = new Howl({
        src: ['/sounds/switch.mp3'],
        volume: this.sfxVolume * 0.6,
        preload: true
      });

    } catch (error) {
      console.warn('Audio system not available:', error);
      this.createFallbackSounds();
    }
  }

  createFallbackSounds() {
    // Create simple beep sounds as fallbacks
    this.sounds.timeJump = this.createBeepSound(440, 0.3);
    this.sounds.puzzleSolved = this.createBeepSound(880, 0.5);
    this.sounds.paradox = this.createBeepSound(220, 0.8);
    this.sounds.jump = this.createBeepSound(660, 0.2);
    this.sounds.switch = this.createBeepSound(330, 0.3);
  }

  createBeepSound(frequency, duration) {
    return {
      play: () => {
        if (this.isMuted) return;
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(this.sfxVolume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
          console.warn('Could not play fallback sound:', error);
        }
      },
      stop: () => {
        // No-op for fallback sounds
      },
      volume: this.sfxVolume
    };
  }

  playSound(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;
    
    try {
      this.sounds[soundName].play();
    } catch (error) {
      console.warn('Could not play sound:', soundName, error);
    }
  }

  stopSound(soundName) {
    if (!this.sounds[soundName]) return;
    
    try {
      this.sounds[soundName].stop();
    } catch (error) {
      console.warn('Could not stop sound:', soundName, error);
    }
  }

  playMusic() {
    if (this.isMuted || !this.sounds.ambient) return;
    
    try {
      this.sounds.ambient.play();
    } catch (error) {
      console.warn('Could not play ambient music:', error);
    }
  }

  stopMusic() {
    if (!this.sounds.ambient) return;
    
    try {
      this.sounds.ambient.stop();
    } catch (error) {
      console.warn('Could not stop ambient music:', error);
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.sounds.ambient && this.sounds.ambient.volume !== undefined) {
      this.sounds.ambient.volume(this.musicVolume);
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      if (sound && sound.volume !== undefined && sound !== this.sounds.ambient) {
        sound.volume(this.sfxVolume);
      }
    });
  }

  mute() {
    this.isMuted = true;
    this.stopMusic();
  }

  unmute() {
    this.isMuted = false;
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  destroy() {
    Object.values(this.sounds).forEach(sound => {
      if (sound && sound.unload) {
        sound.unload();
      }
    });
    this.sounds = {};
  }
}