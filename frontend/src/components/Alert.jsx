import React, { useEffect } from 'react';

const Alert = ({ message, onClose, autoClose = true, duration = 4000 }) => {
    
    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    if (!message) return null;

    return (
        <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>❌</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                    {message}
                </span>
            </div>
            
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#b91c1c',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        padding: '0 4px'
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;