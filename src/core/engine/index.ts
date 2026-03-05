import { PlayerEventMapType, VideoMetadata } from "@/types/player.type"
import { PLAYER_EVENTS, PlayerEvent, STORAGE_KEYS } from "../constants"
import { EventBus } from "../events/EventBus"
import { PlayerPluginType } from "@/types/plugin.type"
import { EngineContextType } from "../../types/engine.type"
import { logger, storage } from "@/utils"
import { AudioEngine } from "./audio"
import { UIController } from "./UIController"
import { IframeBridge } from "../events/IframeBridge"

export class PlayerEngine {
    private abortController = new AbortController();
    private _metadata: VideoMetadata | null = null;
    private plugins: PlayerPluginType[] = [];
    private playPromise: Promise<void> | null = null;
    public readonly ui: UIController;
    private isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    readonly events = new EventBus<PlayerEventMapType>();

    constructor(
        public readonly video: HTMLVideoElement,
        public readonly container: HTMLElement,
        public readonly config: Record<string, any> = {}
    ) {
        this.ui = new UIController(this);
        this.setupListeners();
        
        new IframeBridge(this.events, this);
    }

    get metadata(): VideoMetadata | null { return this._metadata; }
    get volume(): number { return this.video.volume; }
    get muted(): boolean { return this.video.muted; }
    get currentTime(): number { return this.video.currentTime; }
    get duration(): number { return this.video.duration || 0; }
    get paused(): boolean { return this.video.paused; }

    async play(): Promise<void> {
        if (!this.video?.src || !this.video.paused) return;

        try {
            if (this.isFirefox && this.video.currentTime === 0) {
                this.video.currentTime = 0.0001;
            }

            this.playPromise = this.video.play();
            await this.playPromise;
        } catch (err) {
            logger.error("PlayerEngine", "Play Error", err);
        } finally {
            this.playPromise = null;
        }
    }

    async pause(): Promise<void> {
        if (this.playPromise) {
            await this.playPromise.catch(() => { });
        }
        this.video.pause();
    }

    async seek(time: number): Promise<void> {
        if (!this.video || !isFinite(this.video.duration)) return;
        const targetTime = Math.max(0, Math.min(time, this.video.duration));
        this.video.currentTime = targetTime;
    }

    setVolume(v: number): void {
        const volume = isFinite(v) ? Math.max(0, Math.min(v, 1.0)) : 0.5;
        this.video.volume = volume;
    }

    setMuted(mute: boolean): void {
        this.video.muted = mute;
    }

    private setupListeners(): void {
        const { signal } = this.abortController;

        this.video.addEventListener("play", () => this.events.emit(PLAYER_EVENTS.PLAY, undefined), { signal });
        this.video.addEventListener("pause", () => this.events.emit(PLAYER_EVENTS.PAUSE, undefined), { signal });

        this.video.addEventListener("timeupdate", () => {
            this.events.emit(PLAYER_EVENTS.TIME, this.video.currentTime);
        }, { signal });

        this.video.addEventListener("waiting", () => AudioEngine.getInstance().suspend(), { signal });
        this.video.addEventListener("playing", () => AudioEngine.getInstance().resume(), { signal });

        this.video.addEventListener("volumechange", () => {
            const vol = this.video.volume;
            const isMuted = this.video.muted;

            storage.set(STORAGE_KEYS.VOLUME, vol.toFixed(2));
            storage.set(STORAGE_KEYS.MUTED, String(isMuted));

            this.events.emit(PLAYER_EVENTS.VOLUME_CHANGE, isMuted ? 0 : vol);
        }, { signal });

        this.video.addEventListener("progress", () => {
            if (this.video.buffered.length > 0) {
                const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
                this.events.emit(PLAYER_EVENTS.BUFFER_UPDATE, bufferedEnd);
            }
        }, { signal });

        const onFullscreenChange = () => {
            const isFS = !!document.fullscreenElement;
            this.events.emit(PLAYER_EVENTS.FULLSCREEN_CHANGE, isFS);
        };

        document.addEventListener("fullscreenchange", onFullscreenChange, { signal });
        document.addEventListener("webkitfullscreenchange", onFullscreenChange, { signal });
    }

    init(): void {
        const savedVolume = storage.get(STORAGE_KEYS.VOLUME);

        if (savedVolume !== null) {
            const parsedVol = parseFloat(savedVolume);

            if (!isNaN(parsedVol) && parsedVol >= 0 && parsedVol <= 1) {
                this.video.volume = parsedVol;
                setTimeout(() => {
                    this.events.emit(PLAYER_EVENTS.VOLUME_CHANGE, this.video.muted ? 0 : parsedVol);
                }, 0);
            }
        }

        AudioEngine.getInstance().init(this.video);
        this.events.emit(PLAYER_EVENTS.READY, undefined);
    }

    setMetadata(meta: VideoMetadata): void {
        this._metadata = meta;
        this.events.emit(PLAYER_EVENTS.READY, undefined);
    }

    registerPlugin(plugin: PlayerPluginType): void {
        if (this.plugins.some(p => p.name === plugin.name)) return;
        this.plugins.push(plugin);
        plugin.init(this);
    }

    getPlugin<T extends PlayerPluginType>(name: string): T | null {
        return (this.plugins.find(p => p.name === name) as T) || null;
    }

    public getUIPlugins(): PlayerPluginType[] {
        return this.plugins.filter(plugin => !!plugin.ui);
    }

    on<T = any>(event: PlayerEvent, cb: (payload: T) => void): () => void {
        return this.events.on(event as any, cb);
    }

    off<T = any>(event: PlayerEvent, cb: (payload: T) => void): void {
        this.events.off(event as any, cb);
    }

    emit(event: PlayerEvent, payload?: any): void {
        this.events.emit(event as any, payload);
    }

    destroy(): void {
        this.video.pause();
        this.abortController.abort();
        this.events.clear();
        this.plugins = [];
        this.playPromise = null;
    }

    getContext(): EngineContextType {
        return this;
    }

    public getPlugins(): PlayerPluginType[] {
        return this.plugins;
    }

    getMetadata(): VideoMetadata | null {
        return this._metadata;
    }

    getPaused(): boolean {
        return this.video.paused;
    }

    getTime(): number {
        return this.video.currentTime;
    }

    getDuration(): number {
        return this.video.duration || 0;
    }

    getVolume(): number {
        return this.video.muted ? 0 : this.video.volume;
    }
}