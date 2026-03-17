import React from 'react';
import StarRating from './StarRating';
import authService from '../services/authService';

const ReviewCard = ({ review, onEdit, onDelete }) => {
    const currentUser = authService.getCurrentUser();
    const isOwner = currentUser && currentUser.id === review.user_id;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div style={styles.userInfo}>
                    <span style={styles.userAvatar}>👤</span>
                    <div>
                        <p style={styles.userName}>
                            {review.user_username || `Usuário ${review.user_id}`}
                        </p>
                        <p style={styles.reviewDate}>
                            {formatDate(review.created_at)}
                        </p>
                    </div>
                </div>
                
                <StarRating 
                    rating={review.rating} 
                    readonly={true}
                    size="small"
                />
            </div>

            {review.comment && (
                <p style={styles.comment}>{review.comment}</p>
            )}

            {isOwner && (
                <div style={styles.actions}>
                    <button 
                        onClick={() => onEdit(review)}
                        style={styles.editButton}
                    >
                        ✏️ Editar
                    </button>
                    <button 
                        onClick={() => onDelete(review.id)}
                        style={styles.deleteButton}
                    >
                        🗑️ Excluir
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    userInfo: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    userAvatar: {
        fontSize: '1.5rem'
    },
    userName: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '2px'
    },
    reviewDate: {
        fontSize: '0.8rem',
        color: '#9ca3af'
    },
    comment: {
        fontSize: '0.95rem',
        lineHeight: '1.5',
        color: '#4b5563',
        marginBottom: '12px'
    },
    actions: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '12px',
        marginTop: '8px'
    },
    editButton: {
        padding: '6px 12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    deleteButton: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    }
};

export default ReviewCard;