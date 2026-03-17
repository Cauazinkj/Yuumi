import React from 'react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'medium' }) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    const getStarSize = () => {
        switch(size) {
            case 'small': return '24px';
            case 'large': return '40px';
            default: return '32px';
        }
    };

    const starSize = getStarSize();

    return (
        <div style={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && onRatingChange(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    disabled={readonly}
                    style={{
                        ...styles.star,
                        fontSize: starSize,
                        width: starSize,
                        height: starSize,
                        cursor: readonly ? 'default' : 'pointer',
                        color: star <= (hoverRating || rating) ? '#fbbf24' : '#d1d5db'
                    }}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '4px',
        alignItems: 'center'
    },
    star: {
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'transform 0.1s',
        outline: 'none'
    }
};

export default StarRating;