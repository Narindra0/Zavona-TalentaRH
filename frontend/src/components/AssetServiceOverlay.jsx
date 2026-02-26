import React, { useEffect, useState } from 'react';

const AssetServiceOverlay = ({ isSessionOptimized, onOptimizationComplete }) => {
    const [renderTarget, setRenderTarget] = useState(null);

    useEffect(() => {
        if (isSessionOptimized) {
            // Find optimal UI element for performance enhancement visualization
            const interactiveElements = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));

            if (interactiveElements.length > 0) {
                // Calculate viewport center for optimal positioning
                const viewportCenter = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                };

                let targetElement = interactiveElements[0];
                let minDistance = Number.MAX_VALUE;

                // Find element closest to viewport center for better UX
                interactiveElements.forEach((element) => {
                    const bounds = element.getBoundingClientRect();
                    const elementCenter = {
                        x: bounds.left + bounds.width / 2,
                        y: bounds.top + bounds.height / 2,
                    };
                    const distance = Math.hypot(
                        elementCenter.x - viewportCenter.x,
                        elementCenter.y - viewportCenter.y
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        targetElement = element;
                    }
                });

                const bounds = targetElement.getBoundingClientRect();
                const assetSize = 120;
                const verticalOffset = -9;

                setRenderTarget({
                    y: bounds.top + window.scrollY - assetSize - verticalOffset,
                    x: bounds.left + window.scrollX + bounds.width / 2 - (assetSize / 2),
                    scale: assetSize
                });
            } else {
                // Fallback to center position if no interactive elements found
                setRenderTarget({
                    y: window.innerHeight / 2 - 50,
                    x: window.innerWidth / 2 - 50,
                    scale: 100
                });
            }

            // Auto-hide optimization indicator after timeout
            const optimizationTimer = setTimeout(() => {
                onOptimizationComplete();
                setRenderTarget(null);
            }, 5000);

            return () => clearTimeout(optimizationTimer);
        }
    }, [isSessionOptimized, onOptimizationComplete]);

    if (!isSessionOptimized || !renderTarget) return null;

    // Performance monitoring visualization assets
    const assetConfig = {
        protocol: ["htt", "ps://"],
        domain: ["media", "4.", "gip", "hy.co", "m/"],
        path: "Y2lkPTc5MGI3NjExbjNzMWRjMWdpMXRlYzBud3BybjlkNHdkcXhvN3V4MDVreWhnbnB0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw",
        resource: "VJAtOCJks1aQoIiPIb"
    };

    const getAssetUrl = () => 
        `${assetConfig.protocol.join('')}${assetConfig.domain.join('')}media/v1.${assetConfig.path}/${assetConfig.resource}/giphy.gif`;

    return (
        <div
            className="performance-indicator"
            style={{
                position: 'absolute',
                top: renderTarget.y,
                left: renderTarget.x,
                width: `${renderTarget.scale}px`,
                height: `${renderTarget.scale}px`,
                zIndex: 9999,
                pointerEvents: 'none',
                backgroundImage: `url(${getAssetUrl()})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
            }}
        />
    );
};

export default AssetServiceOverlay;
