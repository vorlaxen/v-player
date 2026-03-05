import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PLAYER_EVENTS } from '@/core/constants';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { AudioBoostPluginType } from '@/plugins/AudioPlugin';

const DEFAULT_MAX_BOOST = 2.0;
const METER_UPDATE_INTERVAL_MS = 16; // 60fps için daha düşük interval

const VolumeController = () => {
    const engine = usePlayer();
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [volume, setVolume] = useState<number>(() => engine ? Math.round(engine.getVolume() * 100) : 100);
    const [isMuted, setIsMuted] = useState<boolean>(() => engine?.muted ?? false);
    const [prevVolume, setPrevVolume] = useState<number>(100);
    const [meterLevel, setMeterLevel] = useState<number>(0);
    const animationFrameRef = useRef<number>(0);

    const audioPlugin = useMemo(() => engine?.getPlugin('audio-boost-plugin') as unknown as AudioBoostPluginType | undefined, [engine]);
    const maxBoost = audioPlugin?.options?.maxBoost ?? DEFAULT_MAX_BOOST;
    const sliderMax = maxBoost * 100;

    const isBoosted = volume > 100;
    const effectivelyMuted = isMuted || volume === 0;
    
    const volumeRatio = useMemo(() => volume / sliderMax, [volume, sliderMax]);

    const VolumeIcon = useMemo(() => {
        if (effectivelyMuted) return VolumeX;
        if (volume < 50) return Volume1;
        return Volume2;
    }, [effectivelyMuted, volume]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!audioPlugin?.getVolumeLevel) return;
        const updateMeter = () => {
            const level = audioPlugin.getVolumeLevel?.();
            if (level !== undefined) {
                setMeterLevel(effectivelyMuted ? 0 : Math.min(level, 100));
            }
            animationFrameRef.current = requestAnimationFrame(updateMeter);
        };
        animationFrameRef.current = requestAnimationFrame(updateMeter);
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [audioPlugin, effectivelyMuted]);

    useEffect(() => {
        if (!engine) return;
        const handleEngineVolumeChange = (newVolume: number) => setVolume(Math.round(newVolume * 100));
        const offVolume = engine.on(PLAYER_EVENTS.VOLUME_CHANGE, handleEngineVolumeChange);
        return () => offVolume();
    }, [engine]);

    const toggleMute = useCallback(() => {
        if (!engine) return;
        const nextMuted = !isMuted;
        engine.setMuted?.(nextMuted);
        setIsMuted(nextMuted);
        if (nextMuted) setPrevVolume(volume);
        else {
            const restore = prevVolume > 0 ? prevVolume : 50;
            setVolume(restore);
            engine.setVolume(restore / 100);
        }
    }, [engine, isMuted, volume, prevVolume]);

    const handleIconClick = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) setIsMobileOpen(!isMobileOpen);
        else toggleMute();
    };

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        
        setVolume(value);
        
        requestAnimationFrame(() => {
            engine?.setVolume(value / 100);
            if (value > 0 && isMuted) {
                engine?.setMuted?.(false);
                setIsMuted(false);
            }
        });
    }, [engine, isMuted]);

    return (
        <div ref={containerRef} className="flex items-center gap-1 md:gap-2 pointer-events-auto">
            <button
                onClick={handleIconClick}
                className={`transition-colors p-2 rounded-full hover:bg-white/10 ${effectivelyMuted ? 'text-white/40' : 'text-white/80'}`}
            >
                <VolumeIcon size={22} className={isBoosted && !effectivelyMuted ? "text-sky-500" : ""} />
            </button>

            <div className={`
                flex items-center gap-3 overflow-hidden transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'w-[140px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}
                md:w-auto md:min-w-[160px] md:opacity-100 md:pointer-events-auto md:ml-1
            `}>
                <div className="relative w-20 md:w-24 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    
                    <div
                        className="absolute inset-0 h-full bg-white/20 origin-left pointer-events-none"
                        style={{ 
                            transform: `scaleX(${meterLevel / 100})`,
                            transition: `transform ${METER_UPDATE_INTERVAL_MS}ms linear` 
                        }}
                    />

                    <div
                        className="absolute inset-0 h-full origin-left transition-colors duration-200"
                        style={{
                            transform: `scaleX(${effectivelyMuted ? 0 : volumeRatio})`,
                            background: isBoosted ? '#0EA5E9' : '#fff',
                            zIndex: 1
                        }}
                    />

                    <input
                        type="range"
                        min={0}
                        max={sliderMax}
                        value={effectivelyMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        step={1}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        style={{ WebkitAppearance: 'none' }}
                    />
                </div>

                <div className="w-10 flex-none">
                    {isBoosted && !effectivelyMuted && (
                        <span className="text-[10px] font-bold text-sky-500 tabular-nums animate-pulse whitespace-nowrap">
                            +{volume - 100}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const VolumeControllerWrapper = () =>  <VolumeController />

export default VolumeController;