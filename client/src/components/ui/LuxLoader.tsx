import React, { useEffect, useState, useRef } from 'react';
import { cn } from "@/lib/utils";

interface LuxLoaderProps {
    isLoading: boolean;
    text?: string;
}

export default function LuxLoader({ isLoading, text = "جاري تحميل المنتج..." }: LuxLoaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading) {
            // Trigger the loaded animation after a tiny delay so the browser paints the closed state first
            // This is crucial if the data is already cached and loads instantly
            const t1 = setTimeout(() => {
                setIsLoaded(true);
            }, 50);

            // Wait for the animation to finish before removing from DOM
            const t2 = setTimeout(() => {
                setIsVisible(false);
            }, 1850);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            setIsVisible(true);
            setIsLoaded(false);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    const rows = 20;
    const pieces = [];

    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= 2; c++) {
            const topOffset = (r - 1) * 5;

            // Calculate delay for cinematic ripple effect from center outwards
            const center1 = rows / 2;
            const center2 = (rows / 2) + 1;
            const distance = Math.min(Math.abs(r - center1), Math.abs(r - center2));
            const delay = distance * 0.04;

            pieces.push(
                <div
                    key={`piece-${r}-${c}`}
                    className={`piece piece-r${r} piece-c${c}`}
                    style={{
                        top: `${topOffset}vh`,
                        transitionDelay: isLoaded ? `${delay.toFixed(2)}s` : '0s'
                    }}
                >
                    <div className="decor-wrapper" style={{ top: `-${topOffset}vh` }}>
                        <div className="decor-wall">
                            <div id="lux-loading-overlay">
                                <div className="lux-brand-wrapper">
                                    <div className="lux-brand-icon"></div>
                                    <div className="lux-brand-text"></div>
                                </div>
                                <div className="lux-progress-container">
                                    <div className="lux-progress-bar"></div>
                                </div>
                                <div className="lux-loading-text">{text}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div
            ref={containerRef}
            id="global-loader"
            className={cn(
                isLoaded ? "loaded" : "",
                // We don't want to use ID styling directly if it conflicts, but the classes in index.html are global
                // Let's ensure it has fixed positioning and high z-index
                "fixed inset-0 z-[99999]"
            )}
            style={{ pointerEvents: 'all' }}
        >
            {pieces}
        </div>
    );
}
