import React from 'react';

const IngredientInput = ({ ingredient, index, onChange, onRemove }) => {
    return (
        <div style={styles.container}>
            <input
                type="text"
                placeholder="Nome do ingrediente"
                value={ingredient.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Quantidade (ex: 2 xicaras, 200g)"
                value={ingredient.quantity}
                onChange={(e) => onChange(index, 'quantity', e.target.value)}
                style={styles.input}
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
        marginBottom: '8px',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: '8px',
        border: '1px solid #dld5db',
        borderRadius: '4px',
        fontSize: '0.9rem'
    },
    removeButton: {
        background: '#fee2e2',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#dc2626',
        fontSize: '1rem',
        minWidth: '40px'
    }
};

export default IngredientInput;