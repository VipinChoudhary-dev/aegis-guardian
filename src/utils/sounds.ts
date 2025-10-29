// Sound utility using Web Audio API and free sound libraries

export class SoundManager {
  private static audioContext: AudioContext | null = null;
  
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play click sound
  static playClick() {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.error('Sound error:', error);
    }
  }

  // Play success sound (NFT collected)
  static playSuccess() {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99]; // C, E, G
      
      notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = ctx.currentTime + (index * 0.1);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    } catch (error) {
      console.error('Sound error:', error);
    }
  }

  // Play emergency alarm sound - continuous for 5 seconds
  static playEmergencyAlarm() {
    try {
      const ctx = this.getAudioContext();
      
      // Create alternating siren sound for 5 seconds
      const duration = 5; // 5 seconds
      const beepInterval = 0.3; // Each beep duration
      const totalBeeps = Math.floor(duration / beepInterval);
      
      for (let i = 0; i < totalBeeps; i++) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Alternate between two frequencies for siren effect
        oscillator.frequency.value = i % 2 === 0 ? 900 : 700;
        oscillator.type = 'square';
        
        const startTime = ctx.currentTime + (i * beepInterval);
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + (beepInterval - 0.05));
        
        oscillator.start(startTime);
        oscillator.stop(startTime + beepInterval);
      }
    } catch (error) {
      console.error('Sound error:', error);
    }
  }

  // Play notification sound
  static playNotification() {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.error('Sound error:', error);
    }
  }

  // Play warning sound
  static playWarning() {
    try {
      const ctx = this.getAudioContext();
      
      for (let i = 0; i < 3; i++) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'sawtooth';
        
        const startTime = ctx.currentTime + (i * 0.2);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      }
    } catch (error) {
      console.error('Sound error:', error);
    }
  }
}
