import React from "react";

interface ProgressBarProps {
    current: number;
    buffered: number;
    total: number;
    onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, buffered, total, onSeek }) => {
    const getPercent = (value: number) => (total > 0 ? (value / total) * 100 : 0);

    const progressPercent = getPercent(current);
    const bufferPercent = getPercent(buffered);

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="group w-full px-4 mb-2">
            <div className="flex justify-between text-[10px] font-medium text-white/60 mb-1">
                <span>{formatTime(current)}</span>
                <span>{formatTime(total)}</span>
            </div>

            <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all">
                <div
                    className="absolute h-full bg-white/30 transition-all duration-300"
                    style={{ width: `${bufferPercent}%` }}
                />

                <div
                    className="absolute h-full bg-sky-600 z-10"
                    style={{ width: `${progressPercent}%` }}
                />

                <input
                    type="range"
                    min={0}
                    max={total || 0}
                    value={current}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ProgressBar;