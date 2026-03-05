import { PlayerEventMapType, VideoMetadata } from "@/types/player.type"
import { EventBus } from "../core/events/EventBus"
import { PlayerPluginType } from "@/types/plugin.type"

export interface PlayerConfigType {
    autoPlay?: boolean;
    muted?: boolean;
    ui?: {
        showControls?: boolean;
        title?: string;
    };
    params?: Record<string, string>;
}

export interface EngineContextType {
    readonly video: HTMLVideoElement;
    readonly container: HTMLElement;
    readonly config: PlayerConfigType;
    events: EventBus<PlayerEventMapType>
    metadata: VideoMetadata | null;

    setMetadata(meta: VideoMetadata): void
    getMetadata(): VideoMetadata | null

    getPaused(): void;
    play(): Promise<void>
    pause(): void
    seek(time: number): void
    setVolume(volume: number): void

    getTime(): number
    getDuration(): number
    getVolume(): number

    getPlugin<T extends PlayerPluginType>(name: string): T | null

    on<K extends keyof PlayerEventMapType>(event: K, cb: (payload: PlayerEventMapType[K]) => void): () => void
    off<K extends keyof PlayerEventMapType>(event: K, cb: (payload: PlayerEventMapType[K]) => void): void
    emit<K extends keyof PlayerEventMapType>(event: K, payload: PlayerEventMapType[K]): void
}
