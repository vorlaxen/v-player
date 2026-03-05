import { VideoMetadata } from "@/types/player.type"
import { BasePlugin } from "../BasePlugin"

export class MetadataPlugin extends BasePlugin {
    name = "metadata-plugin"
    version = "1.0.0"

    protected onInit() {
        //const urlParams = new URLSearchParams(window.location.search);

        const meta: VideoMetadata = {
            title: "Test Yayını",
            description: "Görüntü ve ses testi için örnek medya.",
            poster: "https://img2.wallspic.com/crops/1/3/3/3/6/163331/163331-atmosphere-darkness-night-astronomical_object-monochrome-1920x1080.png",
            sources: {
                1: {
                    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    type: "mp4",
                    resolution: 720
                }
            },
            duration: 596
        }

        this.ctx.setMetadata(meta)
    }
}