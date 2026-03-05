import { logger } from "@/utils";

export class AudioEngine {
    private static instance: AudioEngine;
    private _context: AudioContext | null = null;
    private _source: MediaElementAudioSourceNode | null = null;
    private _lastNode: AudioNode | null = null;
    private _pendingNodes: AudioNode[] = [];

    private constructor() { }

    static getInstance(): AudioEngine {
        if (!AudioEngine.instance) AudioEngine.instance = new AudioEngine();
        return AudioEngine.instance;
    }

    get context(): AudioContext {
        if (!this._context) {
            this._context = new (window.AudioContext || (window as any).webkitAudioContext)({
                latencyHint: 'playback'
            });
        }
        return this._context;
    }

    init(video: HTMLMediaElement) {
        if (this._source) return;
        try {
            this._source = this.context.createMediaElementSource(video);
            this._lastNode = this._source;
            this._lastNode.connect(this.context.destination);

            if (this._pendingNodes.length > 0) {
                this._pendingNodes.forEach(node => this.applyNodeToChain(node));
                this._pendingNodes = [];
            }
        } catch (err) {
            logger.error("AudioEngine: Source creation failed", err);
        }
    }

    insertNode(newNode: AudioNode) {
        if (!this._lastNode) {
            this._pendingNodes.push(newNode);
            return;
        }
        this.applyNodeToChain(newNode);
    }

    private applyNodeToChain(newNode: AudioNode) {
        if (!this._lastNode) return;

        this._lastNode.disconnect();
        this._lastNode.connect(newNode);
        newNode.connect(this.context.destination);

        this._lastNode = newNode;
    }

    async suspend(): Promise<void> {
        if (this._context && this._context.state === 'running') {
            await this._context.suspend();
        }
    }

    async resume(): Promise<void> {
        if (this._context && this._context.state === 'suspended') {
            await new Promise(resolve => setTimeout(resolve, 50));
            await this._context.resume();
        }
    }

    async resumeIfSuspended(): Promise<void> {
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
}

export * from "./AudioContextManager";