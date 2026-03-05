import React from 'react';
import { usePlayer } from "@/context/PlayerContext";
import { SleepTimerPlugin } from "@/plugins/SleepTimerPlugin";
import { Check } from "lucide-react";

interface SleepTimerMenuProps {
    onBack: () => void;
    activeTimer: number;
}

const SleepTimerSubMenu: React.FC<SleepTimerMenuProps> = ({ onBack, activeTimer }) => {
    const engine = usePlayer();
    const plugin = engine.getPlugin<SleepTimerPlugin>("sleep-timer-plugin");

    const options = [
        { label: 'Kapalı', val: 0 },
        { label: '1 Dakika', val: 1 },
        { label: '15 Dakika', val: 15 },
        { label: '30 Dakika', val: 30 },
        { label: '60 Dakika', val: 60 },
    ];

    const handleSelect = (mins: number) => {
        if (!plugin) return;

        if (mins === 0) {
            plugin.clearTimer();
        } else {
            plugin.setTimer(mins);
        }
        onBack();
    };

    return (
        <div className="p-2 space-y-1 animate-in fade-in slide-in-from-right-4 duration-200">
            {options.map((opt) => {
                const isSelected = opt.val === 0
                    ? (activeTimer === 0 || !activeTimer)
                    : (activeTimer > 0 && Math.abs(activeTimer - opt.val) <= 1);

                return (
                    <button
                        key={opt.val}
                        onClick={() => handleSelect(opt.val)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/10 active:bg-white/5 transition-all group"
                    >
                        <span className={`text-sm ${isSelected ? 'text-sky-400 font-bold' : 'text-gray-300'}`}>
                            {opt.label}
                        </span>
                        {isSelected && (
                            <Check size={16} className="text-sky-400" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default SleepTimerSubMenu;