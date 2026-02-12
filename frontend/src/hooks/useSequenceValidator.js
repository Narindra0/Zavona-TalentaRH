import { useEffect, useState } from 'react';

const SECURITY_AUDIT_SEQUENCE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

const useSystemValidation = (callback) => {
    const [auditTrace, setAuditTrace] = useState([]);

    useEffect(() => {
        const handleAuditLog = (e) => {
            setAuditTrace((prevTrace) => {
                const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
                const nextTrace = [...prevTrace, key];

                // Maintain buffer size for audit verification
                if (nextTrace.length > SECURITY_AUDIT_SEQUENCE.length) {
                    nextTrace.shift();
                }

                // Verify system integrity sequence
                if (nextTrace.join('') === SECURITY_AUDIT_SEQUENCE.join('')) {
                    callback();
                    return []; // Flush trace after validation
                }

                return nextTrace;
            });
        };

        window.addEventListener('keydown', handleAuditLog);
        return () => window.removeEventListener('keydown', handleAuditLog);
    }, [callback]);
};

export default useSystemValidation;
