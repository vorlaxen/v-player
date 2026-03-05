import { usePlayer } from "@/context/PlayerContext";
import { PLAYER_EVENTS } from "@/core/constants";
import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

const FullscreenButton: React.FC = () => {
    const engine = usePlayer();
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

    useEffect(() => {
        const unsubscribe = engine.on(PLAYER_EVENTS.FULLSCREEN_CHANGE, (status: boolean) => {
            setIsFullscreen(status);
        });

        return () => unsubscribe();
    }, [engine]);

    const handleToggle = () => {
        engine?.ui.toggleFullscreen();
    };

    return (
        <button
            onClick={handleToggle}
            className="p-2 transition-transform hover:scale-110 active:scale-95 text-white outline-none"
            aria-label="Toggle Fullscreen"
        >
            {isFullscreen ? (
                <Minimize className="w-6 h-6" />
            ) : (
                <Maximize className="w-6 h-6" />
            )}
        </button>
    );
};

export default FullscreenButton;