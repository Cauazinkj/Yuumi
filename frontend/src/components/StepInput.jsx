import React from 'react';

const StepInput = ({ step, index, onChange, onRemove }) => {
    return (
        <div style={styles.container}>
            <span style={styles.stepNumber}>{index + 1}.</span>
            <textarea
                placeholder={`Descreva o passo ${index + 1}...`}
                value={step.description}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                style={styles.textarea}
                rows={3}
            />
            {index > 0 && (
                <button
                    onClick={() => onRemove(index)}
                    style={styles.removeButton}
                    type="button"
                >
                    ❌
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
        alignItems: 'flex-start'
    },
    stepNumber: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#3b82f6',
        minWidth: '25px',
        paddingTop: '8px'
    },
    textarea: {
        flex: 1,
        padding: '8px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '60px'
    },
    removeButton: {
        background: '#fee2e2',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#dc2626',
        fontSize: '1rem'
    }
};

export default StepInput;