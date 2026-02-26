import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import Alert from '../components/Alert';

const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            
            const recipesData = await recipeService.getRecipes();
            setRecipes(recipesData);
            
            const userIds = recipesData.map(recipe => recipe.user_id);
            
            if (userIds.length > 0) {
                const users = await userService.getUsersByIds(userIds);
                setUsersMap(users);
            }
            
        } catch (err) {
            setError('Erro ao carregar receitas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getAuthorName = (userId) => {
        const user = usersMap[userId];
        return user ? user.name : `Usuário ${userId}`;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Carregando receitas...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📋 Receitas</h1>
                <Link to="/recipes/new" style={styles.newButton}>
                    + Nova Receita
                </Link>
            </div>

            {error && (
                <Alert 
                    message={error} 
                    onClose={() => setError('')}
                />
            )}

            {recipes.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Nenhuma receita encontrada</p>
                    <Link to="/recipes/new" style={styles.emptyButton}>
                        Criar primeira receita
                    </Link>
                </div>
            ) : (
                <div style={styles.grid}>
                    {recipes.map((recipe) => (
                        <div key={recipe.id} style={styles.card}>
                            <h3 style={styles.cardTitle}>{recipe.title}</h3>
                            {recipe.description && (
                                <p style={styles.cardDescription}>
                                    {recipe.description}
                                </p>
                            )}
                            <div style={styles.cardFooter}>
                                <div style={styles.authorInfo}>
                                    <span style={styles.authorIcon}>👤</span>
                                    <span style={styles.authorName}>
                                        {getAuthorName(recipe.user_id)}
                                    </span>
                                    <span style={styles.authorId}>
                                        (ID: {recipe.user_id})
                                    </span>
                                </div>
                                <Link 
                                    to={`/recipes/${recipe.id}`}
                                    style={styles.cardButton}
                                >
                                    Ver Mais →
                                </Link>
                            </div>
                        </div>
                    ))}
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
        maxWidth: '1200px',
        margin: '0 auto 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '2.5rem',
        color: '#1f2937',
        margin: 0
    },
    newButton: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#2563eb'
        }
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '50px'
    },
    emptyState: {
        textAlign: 'center',
        marginTop: '50px'
    },
    emptyText: {
        fontSize: '1.2rem',
        color: '#6b7280',
        marginBottom: '20px'
    },
    emptyButton: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600'
    },
    grid: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, boxShadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        }
    },
    cardTitle: {
        fontSize: '1.25rem',
        color: '#1f2937',
        marginBottom: '10px',
        fontWeight: '600'
    },
    cardDescription: {
        color: '#6b7280',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        marginBottom: '15px',
        flex: 1
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '15px',
        borderTop: '1px solid #e5e7eb'
    },
    authorInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'wrap'
    },
    authorIcon: {
        fontSize: '1rem'
    },
    authorName: {
        color: '#374151',
        fontSize: '0.875rem',
        fontWeight: '500'
    },
    authorId: {
        color: '#9ca3af',
        fontSize: '0.75rem'
    },
    cardButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#2563eb'
        }
    }
};

export default RecipesList;