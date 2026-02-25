import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onKeyPress,
    placeholder,
    error,
    required = false,
    disabled = false
}) => {

    const baseStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s, background-color 0.2s'
    };

    const getBorderStyle = () => {
        if (error) {
            return {
                border: '1px solid #ef4444',
                backgroundColor: '#fef2f2'
            };
        }
        if (disabled) {
            return {
                border: '1px solid #d1d5db',
                backgroundColor: '#f3f4f6',
                cursor: 'not-allowed',
                opacity: 0.7
            };
        }
        return {
            border: '1px solid #d1d5db',
            backgroundColor: 'white'
        };
    };

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
                onKeyPress={onKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    ...baseStyle,
                    ...getBorderStyle()
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
    errorText: {
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: '#ef4444'
    }
};

export default Input;