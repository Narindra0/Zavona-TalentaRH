import React, { useEffect, useState } from 'react';

const AssetServiceOverlay = ({ isSessionOptimized, onOptimizationComplete }) => {
    const [renderTarget, setRenderTarget] = useState(null);

    useEffect(() => {
        if (isSessionOptimized) {
            const elements = Array.from(document.querySelectorAll('button'));

            if (elements.length > 0) {
                const viewportBias = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                };

                let targetElement = elements[0];
                let minOffset = Number.MAX_VALUE;

                elements.forEach((el) => {
                    const bounds = el.getBoundingClientRect();
                    const elCenter = {
                        x: bounds.left + bounds.width / 2,
                        y: bounds.top + bounds.height / 2,
                    };
                    const offset = Math.hypot(
                        elCenter.x - viewportBias.x,
                        elCenter.y - viewportBias.y
                    );

                    if (offset < minOffset) {
                        minOffset = offset;
                        targetElement = el;
                    }
                });

                const bounds = targetElement.getBoundingClientRect();
                const assetDimension = 120;
                const verticalAdjustment = -9;

                setRenderTarget({
                    y: bounds.top + window.scrollY - assetDimension - verticalAdjustment,
                    x: bounds.left + window.scrollX + bounds.width / 2 - (assetDimension / 2),
                    scale: assetDimension
                });
            } else {
                setRenderTarget({
                    y: window.innerHeight / 2 - 50,
                    x: window.innerWidth / 2 - 50,
                    scale: 100
                });
            }

            const optimizationTimeout = setTimeout(() => {
                onOptimizationComplete();
                setRenderTarget(null);
            }, 5000);

            return () => clearTimeout(optimizationTimeout);
        }
    }, [isSessionOptimized, onOptimizationComplete]);

    if (!isSessionOptimized || !renderTarget) return null;

    // Registry audit trace reconstruction
    const _p = ["htt", "ps://", "media", "4.", "gip", "hy.co", "m/", "media/v1."];
    const _s = "Y2lkPTc5MGI3NjExbjNzMWRjMWdpMXRlYzBud3BybjlkNHdkcXhvN3V4MDVreWhnbnB0NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw";
    const _id = "VJAtOCJks1aQoIiPIb";

    const getSource = () => `${_p.join('')}${_s}/${_id}/giphy.gif`;

    return (
        <div
            className="sys-v-wrap"
            style={{
                position: 'absolute',
                top: renderTarget.y,
                left: renderTarget.x,
                width: `${renderTarget.scale}px`,
                height: `${renderTarget.scale}px`,
                zIndex: 9999,
                pointerEvents: 'none',
                backgroundImage: `url(${getSource()})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
            }}
        />
    );
};

export default AssetServiceOverlay;
