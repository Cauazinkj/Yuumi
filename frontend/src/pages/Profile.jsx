import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import reviewService from '../services/reviewService';
import Alert from '../components/Alert';
import StarRating from '../components/StarRating';

const Profile = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [activeTab, setActiveTab] = useState('recipes'); 
    const [myRecipes, setMyRecipes] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!dataLoaded) {
            loadUserData();
        }
    }, [user, navigate, dataLoaded]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            
            console.log(`🔍 Buscando receitas do usuário ${user.id}`);
            const recipes = await recipeService.getRecipes({ user_id: user.id });
            console.log('✅ Receitas encontradas:', recipes);
            setMyRecipes(recipes || []);
            
            console.log(`🔍 Buscando avaliações do usuário ${user.id}`);

            setMyReviews([]);

            setDataLoaded(true);
            
        } catch (err) {
            console.error('❌ Erro:', err);
            setError('Erro ao carregar dados do perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
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
                    <button 
                        onClick={() => navigate('/')}
                        style={styles.backButton}
                    >
                        ← Voltar
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
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
                            📝 {myRecipes.length} receitas • ⭐ {myReviews.length} avaliações
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
                    {activeTab === 'recipes' && (
                        <>
                            {myRecipes.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p style={styles.emptyText}>
                                        Você ainda não criou nenhuma receita.
                                    </p>
                                    <Link to="/recipes/new" style={styles.emptyButton}>
                                        Criar primeira receita
                                    </Link>
                                </div>
                            ) : (
                                <div style={styles.recipesGrid}>
                                    {myRecipes.map(recipe => (
                                        <div key={recipe.id} style={styles.recipeCard}>
                                            <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                                            {recipe.description && (
                                                <p style={styles.recipeDescription}>
                                                    {recipe.description}
                                                </p>
                                            )}
                                            <div style={styles.recipeFooter}>
                                                <Link 
                                                    to={`/recipes/${recipe.id}`}
                                                    style={styles.viewButton}
                                                >
                                                    Ver Receita →
                                                </Link>
                                                <Link 
                                                    to={`/recipes/${recipe.id}/edit`}
                                                    style={styles.editButton}
                                                >
                                                    ✏️ Editar
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'reviews' && (
                        <>
                            {myReviews.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p style={styles.emptyText}>
                                        Você ainda não avaliou nenhuma receita.
                                    </p>
                                    <Link to="/recipes" style={styles.emptyButton}>
                                        Ver receitas para avaliar
                                    </Link>
                                </div>
                            ) : (
                                <div style={styles.reviewsList}>
                                    {myReviews.map(review => (
                                        <div key={review.id} style={styles.reviewCard}>
                                            <div style={styles.reviewHeader}>
                                                <div>
                                                    <Link 
                                                        to={`/recipes/${review.recipe_id}`}
                                                        style={styles.reviewRecipeTitle}
                                                    >
                                                        {review.recipe_title || 'Receita'}
                                                    </Link>
                                                    <StarRating 
                                                        rating={review.rating} 
                                                        readonly={true}
                                                        size="small"
                                                    />
                                                </div>
                                                <span style={styles.reviewDate}>
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p style={styles.reviewComment}>{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
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
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px'
    },
    content: {
        maxWidth: '900px',
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
        fontSize: '0.9rem'
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px'
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontSize: '2rem',
        color: '#1f2937',
        marginBottom: '5px'
    },
    userEmail: {
        fontSize: '1rem',
        color: '#6b7280',
        marginBottom: '10px'
    },
    userStats: {
        fontSize: '1rem',
        color: '#374151'
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px'
    },
    tab: {
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
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
        minHeight: '400px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    emptyText: {
        fontSize: '1.1rem',
        color: '#6b7280',
        marginBottom: '20px'
    },
    emptyButton: {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: '500'
    },
    recipesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
    },
    recipeCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    recipeTitle: {
        fontSize: '1.2rem',
        color: '#1f2937',
        marginBottom: '10px'
    },
    recipeDescription: {
        fontSize: '0.95rem',
        color: '#6b7280',
        marginBottom: '15px',
        flex: 1
    },
    recipeFooter: {
        display: 'flex',
        gap: '10px',
        marginTop: 'auto'
    },
    viewButton: {
        flex: 1,
        padding: '8px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '0.9rem'
    },
    editButton: {
        flex: 1,
        padding: '8px',
        backgroundColor: '#9ca3af',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '0.9rem'
    },
    reviewsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    reviewCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '20px'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px'
    },
    reviewRecipeTitle: {
        fontSize: '1.1rem',
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '500',
        marginBottom: '5px',
        display: 'block'
    },
    reviewDate: {
        fontSize: '0.85rem',
        color: '#9ca3af'
    },
    reviewComment: {
        fontSize: '0.95rem',
        color: '#4b5563',
        marginTop: '10px',
        lineHeight: '1.5'
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '50px'
    }
};

export default Profile;