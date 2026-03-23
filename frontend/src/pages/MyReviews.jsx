import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reviewService from '../services/reviewService';
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import StarRating from '../components/StarRating';
import authService from '../services/authService';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [recipesMap, setRecipesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (!user) return;
        loadMyReviews();
    }, [user]);

    const loadMyReviews = async () => {
        try {
            setLoading(true);
            
            const response = await fetch('http://localhost:8000/api/v1/review/user/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const myReviews = await response.json();
            setReviews(myReviews);
            
            const recipeIds = [...new Set(myReviews.map(r => r.recipe_id))];
            const recipesMapTemp = {};
            
            for (const recipeId of recipeIds) {
                try {
                    const recipe = await recipeService.getRecipeById(recipeId);
                    recipesMapTemp[recipeId] = recipe;
                } catch (err) {
                    console.error(`Erro ao buscar receita ${recipeId}:`, err);
                }
            }
            
            setRecipesMap(recipesMapTemp);
            
        } catch (err) {
            console.error('Erro ao carregar reviews:', err);
            setError('Erro ao carregar suas avaliações');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId, recipeId) => {
        if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
            try {
                await reviewService.deleteReview(reviewId);
                setReviews(reviews.filter(r => r.id !== reviewId));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!user) {
        return (
            <div style={styles.container}>
                <div style={styles.messageBox}>
                    <p>Você precisa estar logado para ver suas avaliações.</p>
                    <Link to="/login" style={styles.loginButton}>Fazer Login</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando suas avaliações...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>⭐ Minhas Avaliações</h1>
                <Link to="/recipes" style={styles.browseButton}>
                    Ver Receitas
                </Link>
            </div>

            {error && (
                <div style={styles.errorAlert}>{error}</div>
            )}

            {reviews.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Você ainda não avaliou nenhuma receita.</p>
                    <Link to="/recipes" style={styles.emptyButton}>
                        Explorar Receitas
                    </Link>
                </div>
            ) : (
                <div style={styles.reviewsList}>
                    {reviews.map(review => {
                        const recipe = recipesMap[review.recipe_id];
                        return (
                            <div key={review.id} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <div>
                                        <Link to={`/recipes/${review.recipe_id}`} style={styles.recipeTitle}>
                                            {recipe?.title || `Receita #${review.recipe_id}`}
                                        </Link>
                                        <p style={styles.reviewDate}>
                                            Avaliado em {formatDate(review.created_at)}
                                        </p>
                                    </div>
                                    <StarRating 
                                        rating={review.rating} 
                                        readonly={true}
                                        size="small"
                                    />
                                </div>
                                
                                {review.comment && (
                                    <p style={styles.comment}>"{review.comment}"</p>
                                )}
                                
                                <div style={styles.reviewActions}>
                                    <Link 
                                        to={`/recipes/${review.recipe_id}`}
                                        style={styles.viewButton}
                                    >
                                        Ver Receita
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteReview(review.id, review.recipe_id)}
                                        style={styles.deleteButton}
                                    >
                                        Excluir Avaliação
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px'
    },
    header: {
        maxWidth: '800px',
        margin: '0 auto 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '2rem',
        color: '#1f2937',
        margin: 0
    },
    browseButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '500'
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '50px'
    },
    errorAlert: {
        maxWidth: '800px',
        margin: '0 auto 20px',
        padding: '12px',
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        color: '#b91c1c',
        textAlign: 'center'
    },
    emptyState: {
        maxWidth: '600px',
        margin: '50px auto',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    emptyText: {
        fontSize: '1.1rem',
        color: '#6b7280',
        marginBottom: '20px'
    },
    emptyButton: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '500'
    },
    messageBox: {
        maxWidth: '600px',
        margin: '50px auto',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    loginButton: {
        display: 'inline-block',
        marginTop: '16px',
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px'
    },
    reviewsList: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    reviewCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    },
    recipeTitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#1f2937',
        textDecoration: 'none',
        ':hover': {
            color: '#3b82f6'
        }
    },
    reviewDate: {
        fontSize: '0.8rem',
        color: '#9ca3af',
        marginTop: '4px'
    },
    comment: {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#4b5563',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        fontStyle: 'italic'
    },
    reviewActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    viewButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.9rem'
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    }
};

export default MyReviews;