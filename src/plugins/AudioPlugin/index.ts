import { logger } from "@/utils";
import { BasePlugin } from "../BasePlugin";
import { PLAYER_EVENTS } from "@/core/constants";
import { AudioEngine } from "@/core/engine/audio";
import { PluginUIConfigType } from "@/types/plugin.type";
import { VolumeControllerWrapper } from "./components/ui/volume-controller.ui";

export interface AudioBoostPluginOptionsType {
    maxBoost: number;
    enableLimiter: boolean;
    smoothness: number;
}

export interface AudioBoostPluginType {
    options?: AudioBoostPluginOptionsType;
    getVolumeLevel: () => number;
}

const DEFAULT_OPTIONS: AudioBoostPluginOptionsType = {
    maxBoost: 2.0,
    enableLimiter: true,
    smoothness: 0.1
};

export class AudioPlugin extends BasePlugin {
    readonly name = "audio-boost-plugin";
    readonly version = "1.2.0";

    ui: PluginUIConfigType = {
        slots: {
            bottomLeft: [
                VolumeControllerWrapper,
            ]
        }
    };

    private gainNode: GainNode | null = null;
    private limiter: DynamicsCompressorNode | null = null;
    private analyser: AnalyserNode | null = null;
    private freqData: Uint8Array | null = null;
    private options: AudioBoostPluginOptionsType;

    constructor(options: Partial<AudioBoostPluginOptionsType> = {}) {
        super();
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    protected onInit() {
        const engine = AudioEngine.getInstance();
        const ctx = engine.context;

        this.gainNode = ctx.createGain();
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

        engine.insertNode(this.gainNode);

        if (this.options.enableLimiter) {
            this.limiter = ctx.createDynamicsCompressor();
            this.limiter.threshold.setValueAtTime(-1.0, ctx.currentTime);
            this.limiter.ratio.setValueAtTime(12, ctx.currentTime);
            engine.insertNode(this.limiter);
            logger.debug(this.name, "Limiter enabled and inserted into graph.");
        }

        engine.insertNode(this.analyser);

        (this as any).getVolumeLevel = () => {
            if (!this.analyser || !this.freqData) return 0;

            this.analyser.getByteFrequencyData(this.freqData as any);

            let sum = 0;
            for (let i = 0; i < this.freqData.length; i++) {
                sum += this.freqData[i];
            }

            const average = sum / this.freqData.length;
            return Math.min((average / 150) * 100, 100);
        };

        this.ctx.on(PLAYER_EVENTS.VOLUME_CHANGE, (vol: number) => this.handleVolumeUpdate(vol));
    }

    private handleVolumeUpdate(vol: number) {
        if (vol === undefined || isNaN(vol)) return;

        const internalVolume = Math.min(Math.max(0, vol), this.options.maxBoost);

        const nativeVol = Math.min(internalVolume, 1.0);

        const boostGain = internalVolume > 1.0 ? internalVolume : 1.0;

        if (this.ctx.video.volume !== nativeVol) {
            this.ctx.video.volume = nativeVol;
        }

        if (this.gainNode) {
            const ctx = AudioEngine.getInstance().context;
            this.gainNode.gain.setTargetAtTime(
                boostGain,
                ctx.currentTime,
                this.options.smoothness 
            );

            logger.debug(this.name, `Volume Update -> Native: ${nativeVol}, Boost: ${boostGain.toFixed(2)} (Max: ${this.options.maxBoost})`);
        }
    }

    protected onDestroy() {
        this.gainNode?.disconnect();
        this.limiter?.disconnect();
        this.analyser?.disconnect();
    }
}