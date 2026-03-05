import React, { useEffect, useRef } from "react"
import { PLAYER_EVENTS } from "@/core/constants"
import { usePlayer } from "@/context/PlayerContext"

const DOUBLE_TAP_DELAY = 280

const GestureLayer: React.FC = () => {
    const engine = usePlayer()
    const layerRef = useRef<HTMLDivElement>(null)
    const lastTapRef = useRef<number>(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const layer = layerRef.current
        if (!layer || !engine) return

        const onPointerDown = (e: PointerEvent) => {
            // Sadece sol tık
            if (e.button !== 0) return

            const now = Date.now()
            const delta = now - lastTapRef.current
            lastTapRef.current = now

            // Her tıklamada kontrolcüleri göster
            engine.events.emit(PLAYER_EVENTS.SHOW_CONTROLLER, undefined)

            if (delta < DOUBLE_TAP_DELAY) {
                // ÇİFT TIKLAMA DURUMU
                if (timerRef.current) clearTimeout(timerRef.current)
                console.log("Çift tıklandı: İleri/Geri sarma mantığı buraya")
                return
            }

            if (timerRef.current) clearTimeout(timerRef.current)

            timerRef.current = setTimeout(() => {
                if (Date.now() - lastTapRef.current >= DOUBLE_TAP_DELAY) {
                    console.log("Tek tık: Toggle Play")
                    engine.ui.togglePlay()
                }
            }, DOUBLE_TAP_DELAY)
        }

        layer.addEventListener("pointerdown", onPointerDown)

        return () => {
            layer.removeEventListener("pointerdown", onPointerDown)
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [engine])

return (
    <div
        ref={layerRef}
        className="absolute inset-0 z-10 touch-manipulation select-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
    />
)
}

export default GestureLayer