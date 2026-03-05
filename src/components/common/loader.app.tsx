import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { PLAYER_EVENTS } from "@/core/constants";
import { cn } from "@/utils";

const LoadingSpinner = () => {
  const engine = usePlayer();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubs = [
      engine.on(PLAYER_EVENTS.BUFFERING, () => setIsLoading(true)),
      engine.on(PLAYER_EVENTS.PLAYING, () => setIsLoading(false)),
      engine.on(PLAYER_EVENTS.ERROR, () => setIsLoading(false)),
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, [engine]);

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 flex flex-col items-center justify-center",
        "bg-black/40 backdrop-blur-[2px] transition-all duration-300"
      )}
    >
      <svg width="60" height="60" viewBox="0 0 50 50" className="animate-spin text-white">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" />
      </svg>
      
      <span className="mt-4 text-white text-sm font-medium tracking-widest uppercase animate-pulse">
        Yükleniyor...
      </span>
    </div>
  );
};

export default LoadingSpinner;