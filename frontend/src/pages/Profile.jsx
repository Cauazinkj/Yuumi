// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import reviewService from '../services/reviewService';
import StarRating from '../components/StarRating';

const Profile = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const hasLoaded = useRef(false);

    const [activeTab, setActiveTab] = useState('recipes'); 
    const [myRecipes, setMyRecipes] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de paginação
    const [recipesPage, setRecipesPage] = useState(1);
    const [reviewsPage, setReviewsPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (!hasLoaded.current) {
            hasLoaded.current = true;
            loadUserData();
        }
    }, [user, navigate]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            
            // Busca todas as receitas e filtra as do usuário
            const allRecipes = await recipeService.getRecipes({ limit: 1000 });
            const userRecipes = allRecipes.filter(r => r.user_id === user.id);
            setMyRecipes(userRecipes);
            
            // Busca avaliações do usuário
            const userReviews = await reviewService.getMyReviews();
            
            // Para cada review, busca o título da receita
            const reviewsWithTitles = await Promise.all(
                userReviews.map(async (review) => {
                    try {
                        const recipe = await recipeService.getRecipeById(review.recipe_id);
                        return {
                            ...review,
                            recipe_title: recipe?.title || 'Receita'
                        };
                    } catch (err) {
                        return {
                            ...review,
                            recipe_title: 'Receita não encontrada'
                        };
                    }
                })
            );
            
            setMyReviews(reviewsWithTitles);
            
        } catch (err) {
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    // Paginação para receitas
    const totalRecipesPages = Math.ceil(myRecipes.length / itemsPerPage);
    const startRecipeIndex = (recipesPage - 1) * itemsPerPage;
    const currentRecipes = myRecipes.slice(startRecipeIndex, startRecipeIndex + itemsPerPage);

    // Paginação para avaliações
    const totalReviewsPages = Math.ceil(myReviews.length / itemsPerPage);
    const startReviewIndex = (reviewsPage - 1) * itemsPerPage;
    const currentReviews = myReviews.slice(startReviewIndex, startReviewIndex + itemsPerPage);

    // Resetar página quando trocar de aba
    useEffect(() => {
        setRecipesPage(1);
        setReviewsPage(1);
    }, [activeTab]);

    const goToRecipesPage = (page) => {
        if (page < 1 || page > totalRecipesPages) return;
        setRecipesPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToReviewsPage = (page) => {
        if (page < 1 || page > totalReviewsPages) return;
        setReviewsPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando perfil...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <button onClick={() => navigate('/')} style={styles.backButton}>
                        ← Voltar
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Sair
                    </button>
                </div>

                <div style={styles.profileHeader}>
                    <div style={styles.avatar}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userInfo}>
                        <h1 style={styles.userName}>{user?.name}</h1>
                        <p style={styles.userEmail}>{user?.email}</p>
                        <p style={styles.userStats}>
                            📝 {myRecipes.length} receita{myRecipes.length !== 1 ? 's' : ''} • 
                            ⭐ {myReviews.length} avaliação{myReviews.length !== 1 ? 'ões' : ''}
                        </p>
                    </div>
                </div>

                <div style={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('recipes')}
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'recipes' ? styles.activeTab : {})
                        }}
                    >
                        📋 Minhas Receitas ({myRecipes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        style={{
                            ...styles.tab,
                            ...(activeTab === 'reviews' ? styles.activeTab : {})
                        }}
                    >
                        ⭐ Minhas Avaliações ({myReviews.length})
                    </button>
                </div>

                <div style={styles.tabContent}>
                    {/* ABA DE RECEITAS COM PAGINAÇÃO */}
                    {activeTab === 'recipes' && (
                        <>
                            {myRecipes.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>Você ainda não criou nenhuma receita.</p>
                                    <Link to="/recipes/new" style={styles.emptyButton}>
                                        Criar primeira receita
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div style={styles.recipesGrid}>
                                        {currentRecipes.map(recipe => (
                                            <div key={recipe.id} style={styles.recipeCard}>
                                                <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                                                {recipe.description && (
                                                    <p style={styles.recipeDescription}>
                                                        {recipe.description.substring(0, 100)}...
                                                    </p>
                                                )}
                                                <div style={styles.recipeFooter}>
                                                    <Link to={`/recipes/${recipe.id}`} style={styles.viewLink}>
                                                        Ver Receita →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Paginação das receitas */}
                                    {totalRecipesPages > 1 && (
                                        <div style={styles.pagination}>
                                            <button
                                                onClick={() => goToRecipesPage(recipesPage - 1)}
                                                disabled={recipesPage === 1}
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(recipesPage === 1 ? styles.disabledButton : {})
                                                }}
                                            >
                                                ← Anterior
                                            </button>
                                            
                                            <div style={styles.pageNumbers}>
                                                {[...Array(Math.min(totalRecipesPages, 5))].map((_, i) => {
                                                    let pageNum;
                                                    if (totalRecipesPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (recipesPage <= 3) {
                                                        pageNum = i + 1;
                                                        if (i === 4) return <span key="dots" style={styles.dots}>...</span>;
                                                    } else if (recipesPage >= totalRecipesPages - 2) {
                                                        if (i === 0) return <span key="dots" style={styles.dots}>...</span>;
                                                        pageNum = totalRecipesPages - (4 - i);
                                                    } else {
                                                        if (i === 0) return <span key="dots" style={styles.dots}>...</span>;
                                                        if (i === 4) return <span key="dots" style={styles.dots}>...</span>;
                                                        pageNum = recipesPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => goToRecipesPage(pageNum)}
                                                            style={{
                                                                ...styles.pageNumber,
                                                                ...(recipesPage === pageNum ? styles.activePage : {})
                                                            }}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={() => goToRecipesPage(recipesPage + 1)}
                                                disabled={recipesPage === totalRecipesPages}
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(recipesPage === totalRecipesPages ? styles.disabledButton : {})
                                                }}
                                            >
                                                Próxima →
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div style={styles.info}>
                                        Mostrando {currentRecipes.length} de {myRecipes.length} receitas
                                        {totalRecipesPages > 1 && ` • Página ${recipesPage} de ${totalRecipesPages}`}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ABA DE AVALIAÇÕES COM PAGINAÇÃO */}
                    {activeTab === 'reviews' && (
                        <>
                            {myReviews.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>Você ainda não avaliou nenhuma receita.</p>
                                    <Link to="/recipes" style={styles.emptyButton}>
                                        Ver receitas para avaliar
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div style={styles.reviewsList}>
                                        {currentReviews.map(review => (
                                            <div key={review.id} style={styles.reviewCard}>
                                                <div style={styles.reviewHeader}>
                                                    <Link to={`/recipes/${review.recipe_id}`} style={styles.reviewTitle}>
                                                        {review.recipe_title}
                                                    </Link>
                                                    <StarRating rating={review.rating} readonly={true} size="small" />
                                                </div>
                                                {review.comment && (
                                                    <p style={styles.reviewComment}>{review.comment}</p>
                                                )}
                                                <div style={styles.reviewDate}>
                                                    {new Date(review.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Paginação das avaliações */}
                                    {totalReviewsPages > 1 && (
                                        <div style={styles.pagination}>
                                            <button
                                                onClick={() => goToReviewsPage(reviewsPage - 1)}
                                                disabled={reviewsPage === 1}
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(reviewsPage === 1 ? styles.disabledButton : {})
                                                }}
                                            >
                                                ← Anterior
                                            </button>
                                            
                                            <div style={styles.pageNumbers}>
                                                {[...Array(Math.min(totalReviewsPages, 5))].map((_, i) => {
                                                    let pageNum;
                                                    if (totalReviewsPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (reviewsPage <= 3) {
                                                        pageNum = i + 1;
                                                        if (i === 4) return <span key="dots" style={styles.dots}>...</span>;
                                                    } else if (reviewsPage >= totalReviewsPages - 2) {
                                                        if (i === 0) return <span key="dots" style={styles.dots}>...</span>;
                                                        pageNum = totalReviewsPages - (4 - i);
                                                    } else {
                                                        if (i === 0) return <span key="dots" style={styles.dots}>...</span>;
                                                        if (i === 4) return <span key="dots" style={styles.dots}>...</span>;
                                                        pageNum = reviewsPage - 2 + i;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => goToReviewsPage(pageNum)}
                                                            style={{
                                                                ...styles.pageNumber,
                                                                ...(reviewsPage === pageNum ? styles.activePage : {})
                                                            }}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={() => goToReviewsPage(reviewsPage + 1)}
                                                disabled={reviewsPage === totalReviewsPages}
                                                style={{
                                                    ...styles.pageButton,
                                                    ...(reviewsPage === totalReviewsPages ? styles.disabledButton : {})
                                                }}
                                            >
                                                Próxima →
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div style={styles.info}>
                                        Mostrando {currentReviews.length} de {myReviews.length} avaliações
                                        {totalReviewsPages > 1 && ` • Página ${reviewsPage} de ${totalReviewsPages}`}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px'
    },
    content: {
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px'
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: '#9ca3af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '16px'
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontSize: '1.5rem',
        marginBottom: '4px',
        color: '#1f2937'
    },
    userEmail: {
        color: '#6b7280',
        marginBottom: '8px',
        fontSize: '0.9rem'
    },
    userStats: {
        color: '#374151',
        fontSize: '0.9rem'
    },
    tabs: {
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
    },
    tab: {
        padding: '8px 20px',
        background: 'none',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#6b7280',
        transition: 'all 0.2s'
    },
    activeTab: {
        backgroundColor: '#3b82f6',
        color: 'white'
    },
    tabContent: {
        minHeight: '300px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px'
    },
    emptyButton: {
        display: 'inline-block',
        marginTop: '16px',
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px'
    },
    recipesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    recipeCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '16px',
        transition: 'transform 0.2s'
    },
    recipeTitle: {
        fontSize: '1.1rem',
        color: '#1f2937',
        marginBottom: '8px'
    },
    recipeDescription: {
        fontSize: '0.9rem',
        color: '#6b7280',
        marginBottom: '12px'
    },
    recipeFooter: {
        marginTop: '12px',
        textAlign: 'right'
    },
    viewLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontSize: '0.9rem'
    },
    reviewsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
    },
    reviewCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '16px'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    reviewTitle: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500'
    },
    reviewComment: {
        fontSize: '0.95rem',
        color: '#4b5563',
        marginBottom: '8px',
        lineHeight: '1.5'
    },
    reviewDate: {
        fontSize: '0.75rem',
        color: '#9ca3af'
    },
    // Estilos de paginação
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
    pageButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    pageNumbers: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    pageNumber: {
        minWidth: '36px',
        height: '36px',
        padding: '0 8px',
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    activePage: {
        backgroundColor: '#3b82f6',
        color: 'white'
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
        opacity: 0.6
    },
    dots: {
        color: '#9ca3af',
        fontSize: '1rem',
        padding: '0 4px'
    },
    info: {
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '0.85rem',
        color: '#9ca3af'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '1.2rem',
        color: '#6b7280'
    }
};

export default Profile;