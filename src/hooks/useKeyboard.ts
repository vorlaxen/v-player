import { useEffect } from "react";
import {
    KEYBOARD_SHORTCUTS,
    SEEK_STEP_SECONDS,
    VOLUME_STEP
} from "@/core/constants/keyboard.constants";
import { usePlayer } from "@/context/PlayerContext";

export const useKeyboard = () => {
    const engine = usePlayer();

    useEffect(() => {
        if (!engine) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElem = document.activeElement?.tagName;
            if (activeElem === "INPUT" || activeElem === "TEXTAREA") return;

            const { key } = e as any;

            if (KEYBOARD_SHORTCUTS.PLAY_PAUSE.includes(key)) {
                e.preventDefault();
                engine.ui.togglePlay();
            }
            else if (KEYBOARD_SHORTCUTS.SEEK_FORWARD.includes(key)) {
                engine.seek(engine.currentTime + SEEK_STEP_SECONDS);
            }
            else if (KEYBOARD_SHORTCUTS.SEEK_BACKWARD.includes(key)) {
                engine.seek(engine.currentTime - SEEK_STEP_SECONDS);
            }
            else if (KEYBOARD_SHORTCUTS.VOLUME_UP.includes(key)) {
                e.preventDefault();
                engine.setVolume(engine.volume + VOLUME_STEP);
            }
            else if (KEYBOARD_SHORTCUTS.VOLUME_DOWN.includes(key)) {
                e.preventDefault();
                engine.setVolume(engine.volume - VOLUME_STEP);
            }
            else if (KEYBOARD_SHORTCUTS.MUTE.includes(key)) {
                engine.ui.toggleMute();
            }
            else if (KEYBOARD_SHORTCUTS.FULLSCREEN.includes(key)) {
                engine.ui.toggleFullscreen();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [engine]);
};