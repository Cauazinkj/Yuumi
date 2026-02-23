import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false
}) => {
    return (
        <div style={styles.container}>
            {label && (
                <label htmlFor={name} style={styles.label}>
                    {label}
                    {required && <span style={styles.required}> *</span>}
                </label>
            )}

            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    ...styles.input,
                    ...(error ? styles.inputError : {})
                }}
            />

            {error && (
                <p style={styles.errorText}>{error}</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '1rem',
        width: '100%'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#374151'
    },
    required: {
        color: '#ef4444'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2'
    },
    errorText: {
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: '#ef4444'
    }
};

export default Input