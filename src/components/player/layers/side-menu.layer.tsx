// src/components/player/layers/side-menu.layer.tsx
import { cn } from "@/utils";
import { X } from "lucide-react";
import React from "react";

interface SideMenuLayerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    
    width?: string;
    side?: 'left' | 'right';
    className?: string;
    overlayClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    hideCloseButton?: boolean;
}

const SideMenuLayer: React.FC<SideMenuLayerProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    width = "w-72",
    side = "right",
    className,
    overlayClassName,
    headerClassName,
    bodyClassName,
    hideCloseButton = false
}) => {
    const translateClass = side === 'right' 
        ? (isOpen ? "translate-x-0" : "translate-x-full")
        : (isOpen ? "translate-x-0" : "-translate-x-full");

    const sideClass = side === 'right' ? "right-0" : "left-0";

    return (
        <>
            <div 
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 z-[70]",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                    overlayClassName
                )}
                onClick={onClose}
            />

            <div className={cn(
                "absolute top-0 h-full z-[80] bg-black/90 shadow-2xl transition-transform duration-300 ease-in-out border-white/10",
                side === 'right' ? "border-l" : "border-r",
                width,
                sideClass,
                translateClass,
                className
            )}>
                <div className="flex flex-col h-full text-white">
                    {(title || !hideCloseButton) && (
                        <div className={cn(
                            "flex items-center justify-between p-4 border-b border-white/10",
                            headerClassName
                        )}>
                            <div className="flex-1 font-medium">{title}</div>
                            {!hideCloseButton && (
                                <button 
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors active:scale-90"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className={cn(
                        "flex-1 overflow-y-auto custom-scrollbar",
                        bodyClassName
                    )}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideMenuLayer;