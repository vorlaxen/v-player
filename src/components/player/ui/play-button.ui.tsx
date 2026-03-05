import React from 'react'
import { Pause, Play } from 'lucide-react'
import { usePlayer } from "@/context/PlayerContext"
import { cn } from '@/utils';

interface PlayPauseButtonProps {
  playing: boolean;
  size?: number;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ playing, size = 40 }) => {
  const engine = usePlayer();

  return (
    <button
      onClick={() => engine.ui.togglePlay()}
      className={cn(
        "size-6 flex items-center justify-center rounded-full transition-transform  pointer-events-auto shadow-2xl",
        "text-white"
      )}
      aria-label={playing ? "Pause" : "Play"}
    >
      {playing ? (
        <Pause size={size} fill="currentColor" />
      ) : (
        <Play size={size} fill="currentColor" className="ml-1" />
      )}
    </button>
  )
}

export default PlayPauseButton