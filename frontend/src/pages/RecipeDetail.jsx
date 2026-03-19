import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import authService from '../services/authService';
import Alert from '../components/Alert';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

const RecipeDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [recipe, setRecipe] = useState(null);
    const [author, setAuthor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ average_rating: null, review_count: 0 });
    const [myReview, setMyReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRecipeData();
    }, [id]); 

    const loadRecipeData = async () => {
        try {
            setLoading(true);
            
            console.log(`🔍 Buscando receita ID: ${id}`);
            const recipeData = await recipeService.getRecipeById(id);
            console.log('✅ Receita encontrada:', recipeData);
            setRecipe(recipeData);
            
            if (recipeData.user_id) {
                console.log(`🔍 Buscando autor ID: ${recipeData.user_id}`);
                const authorData = await userService.getUserById(recipeData.user_id);
                console.log('✅ Autor encontrado:', authorData);
                setAuthor(authorData);
            }
            
            console.log('🔍 Buscando reviews...');
            const [reviewsData, statsData, myReviewData] = await Promise.all([
                reviewService.getRecipeReviews(id),
                reviewService.getRecipeStats(id),
                reviewService.getMyReview(id)
            ]);
            
            console.log('✅ Reviews encontradas:', reviewsData);
            console.log('✅ Estatísticas:', statsData);
            console.log('✅ Minha review:', myReviewData);
            
            setReviews(reviewsData || []);
            setStats(statsData);
            setMyReview(myReviewData);
            
        } catch (err) {
            console.error('❌ Erro:', err);
            setError(err.message || 'Erro ao carregar receita');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (rating, comment) => {
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            const reviewData = {
                recipe_id: parseInt(id),
                rating,
                comment
            };

            if (editingReview) {
                await reviewService.updateReview(editingReview.id, reviewData);
            } else {
                await reviewService.createReview(reviewData);
            }

            await loadRecipeData();
            setShowReviewForm(false);
            setEditingReview(null);
            
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
            try {
                await reviewService.deleteReview(reviewId);
                await loadRecipeData();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const ReviewForm = ({ onSubmit, initialData = null, onCancel }) => {
        const [rating, setRating] = useState(initialData?.rating || 0);
        const [comment, setComment] = useState(initialData?.comment || '');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (rating === 0) {
                alert('Selecione uma nota');
                return;
            }
            onSubmit(rating, comment);
        };

        return (
            <div style={styles.reviewForm}>
                <h3 style={styles.reviewFormTitle}>
                    {initialData ? 'Editar avaliação' : 'Avaliar receita'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div style={styles.ratingContainer}>
                        <label style={styles.ratingLabel}>Sua nota:</label>
                        <StarRating 
                            rating={rating} 
                            onRatingChange={setRating}
                            size="large"
                        />
                    </div>
                    
                    <textarea
                        placeholder="Escreva seu comentário (opcional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={styles.commentInput}
                        rows={4}
                    />
                    
                    <div style={styles.formButtons}>
                        <button type="submit" style={styles.submitButton}>
                            {initialData ? 'Atualizar' : 'Enviar avaliação'}
                        </button>
                        <button 
                            type="button" 
                            onClick={onCancel}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando receita...</div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <h2 style={styles.errorTitle}>Ops! Algo deu errado</h2>
                    <p style={styles.errorMessage}>{error || 'Receita não encontrada'}</p>
                    <Link to="/recipes" style={styles.backButton}>
                        ← Voltar para Receitas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <button 
                        onClick={() => navigate('/recipes')}
                        style={styles.backButton}
                    >
                        ← Voltar
                    </button>
                    
                    {author && author.id === recipe.user_id && (
                        <button
                            onClick={() => navigate(`/recipes/${id}/edit`)}
                            style={styles.editButton}
                        >
                            ✏️ Editar Receita
                        </button>
                    )}
                </div>

                <h1 style={styles.title}>{recipe.title}</h1>

                <div style={styles.authorCard}>
                    <div style={styles.authorInfo}>
                        <span style={styles.authorIcon}>👨‍🍳</span>
                        <div>
                            <p style={styles.authorName}>
                                {author ? author.name : `Usuário ${recipe.user_id}`}
                            </p>
                            <p style={styles.authorDate}>
                                Publicada em: {new Date().toLocaleDateString()} 
                            </p>
                        </div>
                    </div>
                </div>

                {recipe.description && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>📝 Descrição</h2>
                        <p style={styles.description}>{recipe.description}</p>
                    </div>
                )}

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>🛒 Ingredientes</h2>
                    <ul style={styles.ingredientsList}>
                        {recipe.ingredients?.map((ing, index) => (
                            <li key={index} style={styles.ingredientItem}>
                                <span style={styles.ingredientName}>{ing.name}</span>
                                <span style={styles.ingredientQuantity}>{ing.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>👩‍🍳 Modo de Preparo</h2>
                    <div style={styles.stepsList}>
                        {recipe.steps?.map((step, index) => (
                            <div key={index} style={styles.stepItem}>
                                <div style={styles.stepNumber}>{step.step_number}</div>
                                <p style={styles.stepDescription}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <div style={styles.reviewsHeader}>
                        <h2 style={styles.sectionTitle}>⭐ Avaliações</h2>

                        {!myReview && authService.getCurrentUser() && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                style={styles.addReviewButton}
                            >
                                + Avaliar esta Receita
                            </button>
                        )}
                    </div>

                    <div style={styles.statsCard}>
                        <div style={styles.statsAverage}>
                            <span style={styles.statsNumber}>
                                {stats.average_rating?.toFixed(1) || '0.0'}
                            </span>
                            <StarRating
                                rating={Math.round(stats.average_rating || 0)}
                                readonly={true}
                                size="small"
                            />
                        </div>
                        <p style={styles.statsCount}>
                            {stats.review_count} {stats.review_count === 1 ? 'avaliação' : 'avaliações'}
                        </p>
                    </div>

                    {showReviewForm && (
                        <ReviewForm
                            onSubmit={handleReviewSubmit}
                            initialData={editingReview}
                            onCancel={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                            }}
                        />
                    )}

                    <div style={styles.reviewsList}>
                        {reviews.length === 0 ? (
                            <p style={styles.noReviews}>
                                Nenhuma avaliação ainda. Seja o primeiro a avaliar! 🎉
                            </p>
                        ) : (
                            reviews.map(review => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    onEdit={handleEditReview}
                                    onDelete={handleDeleteReview}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px'
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: '#9ca3af',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s'
    },
    editButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s'
    },
    title: {
        fontSize: '2.5rem',
        color: '#1f2937',
        marginBottom: '20px',
        lineHeight: '1.2'
    },
    authorCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '30px'
    },
    authorInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    authorIcon: {
        fontSize: '2rem'
    },
    authorName: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '4px'
    },
    authorDate: {
        fontSize: '0.9rem',
        color: '#6b7280'
    },
    section: {
        marginBottom: '40px'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        color: '#1f2937',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #e5e7eb'
    },
    description: {
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: '#4b5563'
    },
    ingredientsList: {
        listStyle: 'none',
        padding: 0
    },
    ingredientItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e5e7eb'
    },
    ingredientName: {
        fontSize: '1rem',
        color: '#1f2937',
        fontWeight: '500'
    },
    ingredientQuantity: {
        fontSize: '0.95rem',
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    stepsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    stepItem: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
    },
    stepNumber: {
        minWidth: '30px',
        height: '30px',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    stepDescription: {
        flex: 1,
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4b5563'
    },
    comingSoon: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '1.1rem',
        padding: '40px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '50px'
    },
    errorContainer: {
        maxWidth: '600px',
        margin: '50px auto',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    },
    errorTitle: {
        fontSize: '2rem',
        color: '#ef4444',
        marginBottom: '16px'
    },
    errorMessage: {
        fontSize: '1.1rem',
        color: '#6b7280',
        marginBottom: '24px'
    },
    reviewsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    addReviewButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    statsCard: {
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        textAlign: 'center'
    },
    statsAverage: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '10px'
    },
    statsNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    statsCount: {
        fontSize: '1rem',
        color: '#6b7280'
    },
    reviewForm: {
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
    },
    reviewFormTitle: {
        fontSize: '1.2rem',
        color: '#1f2937',
        marginBottom: '20px'
    },
    ratingContainer: {
        marginBottom: '20px'
    },
    ratingLabel: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '0.95rem',
        color: '#374151'
    },
    commentInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.95rem',
        marginBottom: '20px',
        fontFamily: 'inherit',
        resize: 'vertical'
    },
    formButtons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '500'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#9ca3af',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.95rem'
    },
    noReviews: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '1rem',
        padding: '40px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    reviewsList: {
        marginTop: '20px'
    }
};

export default RecipeDetail;