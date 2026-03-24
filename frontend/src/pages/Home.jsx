// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import reviewService from '../services/reviewService';

const Home = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    const [userStats, setUserStats] = useState({
        recipes: 0,
        reviews: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const loadUserStats = async () => {
            if (!isAuthenticated || !user) {
                setLoadingStats(false);
                return;
            }
            
            try {
                const allRecipes = await recipeService.getRecipes({ limit: 1000 });
                const userRecipes = allRecipes.filter(r => r.user_id === user.id);
                
                const userReviews = await reviewService.getMyReviews();
                
                setUserStats({
                    recipes: userRecipes.length,
                    reviews: userReviews.length
                });
            } catch (err) {
                console.error('Erro ao carregar estatísticas:', err);
            } finally {
                setLoadingStats(false);
            }
        };
        
        loadUserStats();
    }, [isAuthenticated, user]);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>🍜 Yuumi Recipes</h1>
                <p style={styles.subtitle}>
                    Descubra, compartilhe e avalie receitas incríveis!
                </p>
                
                <div style={styles.grid}>
                    {/* Card de Perfil - aparece só se estiver logado */}
                    {isAuthenticated && (
                        <div style={styles.profileCard}>
                            <div style={styles.profileCardContent}>
                                <div style={styles.avatar}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={styles.profileName}>{user?.name}</h3>
                                <p style={styles.profileEmail}>{user?.email}</p>
                                
                                <div style={styles.stats}>
                                    <div style={styles.statItem}>
                                        <span style={styles.statNumber}>
                                            {loadingStats ? '...' : userStats.recipes}
                                        </span>
                                        <span style={styles.statLabel}>Receitas</span>
                                    </div>
                                    <div style={styles.statDivider} />
                                    <div style={styles.statItem}>
                                        <span style={styles.statNumber}>
                                            {loadingStats ? '...' : userStats.reviews}
                                        </span>
                                        <span style={styles.statLabel}>Avaliações</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate('/profile')}
                                    style={styles.profileButton}
                                >
                                    Ver meu perfil →
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Cards de funcionalidades - 2 por linha */}
                    <div style={styles.featuresGrid}>
                        <Link to="/recipes" style={styles.featureCard}>
                            <span style={styles.featureIcon}>📚</span>
                            <h3>Buscar Receitas</h3>
                            <p>Encontre receitas deliciosas para todos os gostos</p>
                            <span style={styles.featureLink}>Explorar →</span>
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/recipes/new" style={styles.featureCard}>
                                    <span style={styles.featureIcon}>✍️</span>
                                    <h3>Criar Receita</h3>
                                    <p>Compartilhe suas criações com a comunidade</p>
                                    <span style={styles.featureLink}>Criar →</span>
                                </Link>
                                
                                <Link to="/recipes" style={styles.featureCard}>
                                    <span style={styles.featureIcon}>⭐</span>
                                    <h3>Avaliar</h3>
                                    <p>Ajude outros com suas avaliações</p>
                                    <span style={styles.featureLink}>Avaliar →</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.featureCard}>
                                    <span style={styles.featureIcon}>🔐</span>
                                    <h3>Entrar</h3>
                                    <p>Acesse sua conta para criar receitas</p>
                                    <span style={styles.featureLink}>Fazer Login →</span>
                                </Link>
                                
                                <Link to="/register" style={styles.featureCard}>
                                    <span style={styles.featureIcon}>📝</span>
                                    <h3>Cadastrar</h3>
                                    <p>Crie sua conta e comece a compartilhar</p>
                                    <span style={styles.featureLink}>Criar Conta →</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
    },
    content: {
        maxWidth: '1000px',
        width: '100%',
        textAlign: 'center'
    },
    title: {
        fontSize: '3rem',
        color: '#1f2937',
        marginBottom: '1rem'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#6b7280',
        marginBottom: '3rem'
    },
    grid: {
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    // Card de Perfil
    profileCard: {
        width: '280px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden'
    },
    profileCardContent: {
        padding: '24px',
        textAlign: 'center'
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
        margin: '0 auto 16px',
        fontWeight: 'bold'
    },
    profileName: {
        fontSize: '1.2rem',
        color: '#1f2937',
        marginBottom: '4px'
    },
    profileEmail: {
        fontSize: '0.8rem',
        color: '#6b7280',
        marginBottom: '20px'
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '20px'
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    statNumber: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#3b82f6'
    },
    statLabel: {
        fontSize: '0.7rem',
        color: '#6b7280'
    },
    statDivider: {
        width: '1px',
        height: '30px',
        backgroundColor: '#e5e7eb'
    },
    profileButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s'
    },
    // Cards de funcionalidades - 2 por linha
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        flex: 1,
        minWidth: '280px'
    },
    featureCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, boxShadow 0.2s'
    },
    featureIcon: {
        fontSize: '2.5rem',
        display: 'block',
        marginBottom: '1rem'
    },
    featureLink: {
        display: 'inline-block',
        marginTop: '1rem',
        color: '#3b82f6',
        fontWeight: '500',
        fontSize: '0.9rem'
    }
};

export default Home;