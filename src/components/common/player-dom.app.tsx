import React, { useEffect, useRef, useState } from "react"
import { PlayerEngine } from "@/core/engine"

import PlayerRoot from "@/components/player/PlayerRoot"
import GestureLayer from "@/components/player/layers/gesture.layer"
import ControllerLayer from "@/components/player/layers/controller.layer"
import { PlayerPluginType } from "@/types/plugin.type"
import { PlayerProvider } from "@/context/PlayerContext"
import VideoLayer from "@/components/player/layers/video.layer"
import SettingsMenu from "../player/side/settings.side"

interface PlayerDOMProps {
    plugins?: PlayerPluginType[]
}

const PlayerDOM: React.FC<PlayerDOMProps> = ({ plugins = [] }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [engine, setEngine] = useState<PlayerEngine | null>(null);

    useEffect(() => {
        if (!videoRef.current || !containerRef.current) return;

        const playerEngine = new PlayerEngine(videoRef.current, containerRef.current);
        plugins.forEach(p => playerEngine.registerPlugin(p));

        setEngine(playerEngine);

        setTimeout(() => {
            playerEngine.init();
        }, 100);

        return () => playerEngine.destroy();
    }, [plugins]);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-black aspect-video overflow-y-hidden">
            <VideoLayer videoRef={videoRef} />

            {engine ? (
                <PlayerProvider engine={engine}>
                    <PlayerRoot >
                        <GestureLayer />
                        <ControllerLayer visible={true} />

                        <SettingsMenu />
                    </PlayerRoot>
                </PlayerProvider>
            ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center text-white">
                    Başlatılıyor...
                </div>
            )}
        </div>
    )
}

export default PlayerDOM
