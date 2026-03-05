import React, { useEffect, useState, useMemo } from "react"
import { PLAYER_EVENTS } from "@/core/constants"
import { cn } from "@/utils"
import { usePlayerEvents } from "@/hooks/usePlayerEvents"
import { usePlayer } from "@/context/PlayerContext"
import LoadingSpinner from "@/components/common/loader.app"
import PlayPauseButton from "../ui/play-button.ui"
import ProgressBar from "../ui/progress-bar.ui"
import { throttle } from "lodash";
import FullscreenButton from "../ui/fullscreen-button.ui"
import SettingsButton from "../ui/settings-button.ui"
import { PlayerPluginType } from "@/types/plugin.type"

const ControllerLayer: React.FC<{ visible: boolean }> = ({ visible }) => {
    const engine = usePlayer();
    const { playing } = usePlayerEvents();

    const plugins = useMemo(() => engine.getPlugins() || [], [engine]);

    const bottomLeftPlugins = useMemo(() =>
        plugins.filter((p: PlayerPluginType) => !!p.ui?.slots?.bottomLeft),
        [plugins]);

    const bottomRightPlugins = useMemo(() =>
        plugins.filter((p: PlayerPluginType) => !!p.ui?.slots?.bottomRight),
        [plugins]);

    const [videoState, setVideoState] = useState({ current: 0, buffered: 0, total: 0 });
    const [isSeeking, setIsSeeking] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        const unsubs = [
            engine.on(PLAYER_EVENTS.BUFFERING, () => setIsBuffering(true)),
            engine.on(PLAYER_EVENTS.PLAYING, () => setIsBuffering(false)),
            engine.on(PLAYER_EVENTS.TIME, (time: number) => {
                if (!isSeeking) {
                    setVideoState(prev => ({ ...prev, current: time, total: engine.getDuration() }));
                }
            }),
            engine.on(PLAYER_EVENTS.BUFFER_UPDATE, (bufferedTime: number) => {
                setVideoState(prev => ({ ...prev, buffered: bufferedTime }));
            }),
            engine.on(PLAYER_EVENTS.SEEKED, () => {
                setIsBuffering(false);
                setIsSeeking(false);
            })
        ];
        return () => unsubs.forEach(u => u());
    }, [engine, isSeeking]);

    const throttledSeek = useMemo(() =>
        throttle((time: number) => engine.seek(time), 150), [engine]);

    const handleSeek = (t: number) => {
        setIsSeeking(true);
        setVideoState(prev => ({ ...prev, current: t }));
        throttledSeek(t);
    };

    return (
        <div className={cn(
            "absolute inset-0 z-20 flex flex-col justify-end transition-opacity duration-300",
            "pointer-events-none",
            visible ? "opacity-100" : "opacity-0"
        )}>
            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] z-[60]">
                    <LoadingSpinner />
                </div>
            )}

            <div className={cn(
                "w-full p-2 md:p-4 pb-4 md:pb-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent",
                "pointer-events-auto"
            )}>
                <div className="px-1 md:px-0 mb-1 md:mb-2">
                    <ProgressBar
                        current={videoState.current}
                        buffered={videoState.buffered}
                        total={videoState.total}
                        onSeek={handleSeek}
                    />
                </div>

                <div className="flex items-center justify-between px-1 md:px-2">
                    <div className="flex items-center gap-2 md:gap-4">
                        <PlayPauseButton playing={playing} />

                        {bottomLeftPlugins.map((plugin: PlayerPluginType) => (
                            <React.Fragment key={plugin.name}>
                                {plugin.ui?.slots?.bottomLeft?.map((SlotComponent, index) => (
                                    <SlotComponent
                                        key={`${plugin.name}-slot-${index}`}
                                        ctx={engine}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {bottomRightPlugins.map((plugin: PlayerPluginType) => (
                            <React.Fragment key={plugin.name}>
                                {plugin.ui?.slots?.bottomRight?.map((SlotComponent, index) => (
                                    <SlotComponent
                                        key={`${plugin.name}-slot-${index}`}
                                        ctx={engine}
                                    />
                                ))}
                            </React.Fragment>
                        ))}

                        <SettingsButton />
                        <FullscreenButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControllerLayer;