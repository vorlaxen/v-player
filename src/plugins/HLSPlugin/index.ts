import Hls, { HlsConfig } from 'hls.js';
import { logger } from "@/utils/logger.util";
import { BasePlugin } from '../BasePlugin';
import { HLSErrorHandlerPlugin } from './Extensions/HlsErrorHandler';

export interface HLSPluginOptions {
    maxBufferLength?: number;
    hlsConfig?: Partial<HlsConfig>;
    maxRetries?: number;
}

export class HLSPlugin extends BasePlugin {
    public readonly name = "hls-plugin";
    public readonly version = "2.5.0";

    private hlsInstance?: Hls;
    private errorHandler: ReturnType<typeof HLSErrorHandlerPlugin>;

    constructor(private options: HLSPluginOptions = {}) {
        super();
        this.errorHandler = HLSErrorHandlerPlugin(this.options.maxRetries ?? 3);
    }

    protected onInit() {
        const meta = this.ctx.getMetadata();
        const hlsUrl = Object.values(meta?.sources || {}).find(s => s.type === 'hls')?.url;

        if (!hlsUrl) {
            logger.warn(this.name, "No HLS source found in metadata.");
            return;
        }

        const isHlsFile = hlsUrl?.split('?')[0].endsWith('.m3u8');

        if (!hlsUrl || !isHlsFile) {
            logger.warn(this.name, "Geçerli bir HLS (.m3u8) kaynağı bulunamadı. Plugin başlatılmıyor.");
            return;
        }

        if (this.ctx.video.canPlayType('application/vnd.apple.mpegurl')) {
            logger.info(this.name, "Native HLS playback kullanılıyor.");
            this.ctx.video.src = hlsUrl;
            return;
        }

        this.ctx.video.crossOrigin = "anonymous";

        if (this.ctx.video.canPlayType('application/vnd.apple.mpegurl')) {
            logger.info(this.name, "Using native HLS playback.");
            this.ctx.video.src = hlsUrl;
            return;
        }

        if (Hls.isSupported()) {
            this.hlsInstance = new Hls({
                maxBufferLength: this.options.maxBufferLength ?? 60,
                backBufferLength: 90,
                maxMaxBufferLength: 120,
                enableWorker: true,
                lowLatencyMode: false,
                manifestLoadingMaxRetry: 10,
                levelLoadingMaxRetry: 10,
                fragLoadingMaxRetry: 10,
                capLevelToPlayerSize: true,

                ...this.options.hlsConfig
            });

            this.errorHandler.init(this.ctx, this.hlsInstance);

            this.hlsInstance.attachMedia(this.ctx.video);
            this.hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
                this.hlsInstance?.loadSource(hlsUrl);
            });

            logger.info(this.name, "HLS.js initialized successfully.");
        } else {
            logger.error(this.name, "HLS is not supported in this browser.");
        }
    }

    destroy() {
        this.errorHandler.destroy();

        if (this.hlsInstance) {
            this.hlsInstance.stopLoad();
            this.hlsInstance.detachMedia();
            this.hlsInstance.destroy();
            this.hlsInstance = undefined;
            logger.info(this.name, "HLS instance destroyed.");
        }
    }
}