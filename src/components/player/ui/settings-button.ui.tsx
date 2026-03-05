import { usePlayer } from "@/context/PlayerContext";
import { PLAYER_EVENTS } from "@/core/constants";
import { SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";

const SettingsButton: React.FC = () => {
    const engine = usePlayer();
    const [active, setActive] = useState(false);

    useEffect(() => {
        const sub = engine.on(PLAYER_EVENTS.SIDE_MENU_TOGGLE, (type) => {
            if (type === 'settings') setActive(prev => !prev);
        });
        const subClose = engine.on(PLAYER_EVENTS.SIDE_MENU_CLOSE, () => setActive(false));

        return () => { sub(); subClose(); };
    }, [engine]);

    return (
        <button
            onClick={() => engine.ui.toggleSettings()}
            className={`p-2 transition-all hover:scale-110 active:scale-95 outline-none ${active ? "text-sky-400 rotate-45" : "text-white"
                }`}
            aria-label="Toggle Settings"
        >
            <SettingsIcon className="w-6 h-6" />
        </button>
    );
};

export default SettingsButton;