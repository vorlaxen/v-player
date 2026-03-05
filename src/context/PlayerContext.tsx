import React, { createContext, useContext } from 'react';
import { PlayerEngine } from '@/core/engine';

const PlayerContext = createContext<PlayerEngine | null>(null);

export const PlayerProvider: React.FC<{ engine: PlayerEngine; children: React.ReactNode }> = ({ engine, children }) => {
  return <PlayerContext.Provider value={engine}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};