import { AudioEngine } from "@/core/engine/audio";
import { logger } from "@/utils";

export interface AudioEnhancerOptions {
  maxBoost: number;           // Örn: 2.0 (200% ses)
  enableLimiter: boolean;     // Ses patlamasını önleme aktif mi?
  initialVolume: number;      // Başlangıç ses seviyesi
  smoothness: number;         // Ses değişim hızı (interpolation time)
}

export const DEFAULT_OPTIONS: AudioEnhancerOptions = {
  maxBoost: 2.0,
  enableLimiter: true,
  initialVolume: 1.0,
  smoothness: 0.1
};

export class AudioGraph {
  private source: MediaElementAudioSourceNode;
  private gainNode: GainNode;
  private limiter?: DynamicsCompressorNode;
  private readonly TAG = "AudioGraph";

  constructor(
    public video: HTMLMediaElement,
    private options: AudioEnhancerOptions
  ) {
    const ctx = AudioEngine.getInstance().context;

    logger.debug(this.TAG, "Initializing AudioGraph", {
      sampleRate: ctx.sampleRate,
      state: ctx.state,
      options
    });

    try {
      this.source = ctx.createMediaElementSource(video);
      this.gainNode = ctx.createGain();

      let lastNode: AudioNode = this.gainNode;

      if (this.options.enableLimiter) {
        this.limiter = ctx.createDynamicsCompressor();
        this.configureLimiter();
        this.gainNode.connect(this.limiter);
        lastNode = this.limiter;
        logger.debug(this.TAG, "Safety Limiter attached to pipeline");
      }

      this.source.connect(this.gainNode);
      lastNode.connect(ctx.destination);

      logger.info(this.TAG, "Audio pipeline established successfully");
    } catch (err) {
      logger.error(this.TAG, "Failed to build audio graph", err);
      throw err;
    }
  }

  private configureLimiter() {
    if (!this.limiter) return;
    const now = AudioEngine.getInstance().context.currentTime;
    this.limiter.threshold.setValueAtTime(-1.0, now);
    this.limiter.ratio.setValueAtTime(12, now);
  }

  setGain(value: number) {
    const ctx = AudioEngine.getInstance().context;

    let target = isFinite(value) ? value : 1.0;

    target = Math.min(Math.max(0, target), this.options.maxBoost);

    logger.debug("AudioGraph", `Applying safe gain: ${target}`);

    const startTime = ctx.currentTime || 0;

    this.gainNode.gain.setTargetAtTime(
      target,
      startTime,
      this.options.smoothness
    );
  }

  destroy() {
    logger.debug(this.TAG, "Destroying AudioGraph and disconnecting nodes");
    this.source.disconnect();
    this.gainNode.disconnect();
    this.limiter?.disconnect();
  }
}