import { useEffect, useState } from "react"
import { PLAYER_EVENTS } from "@/core/constants"
import { usePlayer } from "@/context/PlayerContext";

export function usePlayerEvents() {
    const engine = usePlayer();
    const [state, setState] = useState({
        time: 0,
        playing: !engine.getPaused(),
        title: engine.getMetadata()?.title || "Loading..."
    });

    useEffect(() => {
        const unsubs = [
            engine.on(PLAYER_EVENTS.TIME, (time) => setState(s => ({ ...s, time }))),
            engine.on(PLAYER_EVENTS.PLAY, () => setState(s => ({ ...s, playing: true }))),
            engine.on(PLAYER_EVENTS.PAUSE, () => setState(s => ({ ...s, playing: false }))),
            engine.on(PLAYER_EVENTS.READY, () => setState(s => ({ ...s, title: engine.getMetadata()?.title || "" })))
        ];

        return () => unsubs.forEach(unsub => unsub());
    }, [engine]);

    return state;
}