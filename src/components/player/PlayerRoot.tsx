import React, { useEffect, useRef, useState } from "react"
import { usePlayer } from "@/context/PlayerContext"
import { PLAYER_EVENTS } from "@/core/constants"
import { useKeyboard } from "@/hooks/useKeyboard"

interface PlayerRootProps {
    children: React.ReactNode
}

const PlayerRoot: React.FC<PlayerRootProps> = ({ children }) => {
    const engine = usePlayer()
    const rootRef = useRef<HTMLDivElement>(null)
    const hideTimer = useRef<number | null>(null)
    const [isVisible, setIsVisible] = useState(true)

    const handleShow = () => {
        setIsVisible(true)

        if (hideTimer.current) window.clearTimeout(hideTimer.current)

        hideTimer.current = window.setTimeout(() => {
            setIsVisible(false)
        }, 3000)
    }

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const onMouseMove = () => handleShow()

        root.addEventListener('pointermove', onMouseMove)
        root.addEventListener('pointerdown', onMouseMove)

        const unsubs = [
            engine.on(PLAYER_EVENTS.PLAY, handleShow),
            engine.on(PLAYER_EVENTS.PAUSE, handleShow),
            engine.on(PLAYER_EVENTS.SHOW_CONTROLLER, handleShow)
        ]

        handleShow()

        return () => {
            root.removeEventListener('pointermove', onMouseMove)
            root.removeEventListener('pointerdown', onMouseMove)
            if (hideTimer.current) window.clearTimeout(hideTimer.current)
            unsubs.forEach(u => u())
        }
    }, [engine])

    useKeyboard();

    return (
        <div ref={rootRef} className="relative w-full h-full bg-transparent overflow-hidden select-none">
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { visible: isVisible })
                }
                return child
            })}
        </div>
    )
}

export default PlayerRoot