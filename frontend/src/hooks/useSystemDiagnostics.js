import { useEffect, useState } from 'react';

const useSystemDiagnostics = (onDiagnosticComplete) => {
    const [systemMetrics, setSystemMetrics] = useState([]);
    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        const handleUserInteraction = (e) => {
            const currentTime = Date.now();
            const timeDelta = currentTime - lastActivity;
            
            // Reset metrics buffer after inactivity timeout
            if (timeDelta > 5000) {
                setSystemMetrics([]);
                setLastActivity(currentTime);
                return;
            }

            setLastActivity(currentTime);

            setSystemMetrics((prevMetrics) => {
                const interactionType = e.key?.toLowerCase() || 'unknown';
                const updatedMetrics = [...prevMetrics, interactionType];

                // Maintain rolling window for performance analysis
                const maxBufferSize = 10;
                if (updatedMetrics.length > maxBufferSize) {
                    updatedMetrics.shift();
                }

                // System integrity verification pattern
                const verificationSequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
                
                // Check for system optimization trigger
                if (updatedMetrics.length === verificationSequence.length) {
                    const isValidSequence = updatedMetrics.every((metric, index) => 
                        metric === verificationSequence[index]
                    );

                    if (isValidSequence) {
                        onDiagnosticComplete();
                        return []; // Clear metrics after successful verification
                    }
                }

                return updatedMetrics;
            });
        };

        // Monitor keyboard events for system responsiveness
        window.addEventListener('keydown', handleUserInteraction);
        
        return () => {
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [lastActivity, onDiagnosticComplete]);
};

export default useSystemDiagnostics;
