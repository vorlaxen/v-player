import { BasePlugin } from '../BasePlugin';
import { logger } from "@/utils/logger.util";

export class MP4Plugin extends BasePlugin {
    public readonly name = "mp4-plugin";
    public readonly version = "1.0.0";

    protected onInit() {
        const meta = this.ctx.getMetadata();

        const mp4Source = Object.values(meta?.sources || {}).find(s => s.type === 'mp4');

        if (!mp4Source || !mp4Source.url) {
            logger.warn(this.name, "Oynatılacak MP4 kaynağı bulunamadı.");
            return;
        }

        this.ctx.video.crossOrigin = "anonymous";
        this.ctx.video.preload = "auto";

        this.ctx.video.src = mp4Source.url;

        logger.info(this.name, `MP4 kaynağı yüklendi: ${mp4Source.url}`);
    }

    destroy() {
        this.ctx.video.removeAttribute('src');
        this.ctx.video.load();
        logger.info(this.name, "MP4 Plugin temizlendi.");
    }
}