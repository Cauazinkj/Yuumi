// src/pages/RecipesList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import Alert from '../components/Alert';

const RecipesList = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    
    // Estados de dados
    const [allRecipes, setAllRecipes] = useState([]);  // Todas as receitas
    const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtradas pela busca
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Função para normalizar texto (remover acentos)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    // Buscar todas as receitas uma vez
    const loadAllRecipes = async () => {
        try {
            setLoading(true);
            
            console.log('🔍 Buscando todas as receitas...');
            const recipes = await recipeService.getRecipes({ limit: 1000 });
            console.log(`✅ Encontradas ${recipes.length} receitas no total`);
            
            setAllRecipes(recipes);
            
            // Busca todos os autores
            const userIds = recipes.map(recipe => recipe.user_id);
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

    // Aplicar filtro de busca
    useEffect(() => {
        if (allRecipes.length === 0) return;
        
        if (searchQuery) {
            const normalizedSearch = normalizeText(searchQuery);
            const filtered = allRecipes.filter(recipe => 
                normalizeText(recipe.title).includes(normalizedSearch)
            );
            console.log(`🔍 Busca "${searchQuery}" encontrou ${filtered.length} receitas`);
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes(allRecipes);
        }
        setCurrentPage(1); // Volta para primeira página quando busca muda
    }, [searchQuery, allRecipes]);

    // Carregar dados iniciais
    useEffect(() => {
        loadAllRecipes();
    }, []);

    const getAuthorName = (userId) => {
        const user = usersMap[userId];
        return user ? user.name : `Usuário ${userId}`;
    };

    // Paginação
    const totalRecipes = filteredRecipes.length;
    const totalPages = Math.ceil(totalRecipes / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <h1 style={styles.title}>
                    {searchQuery 
                        ? `🔍 "${searchQuery}" - ${totalRecipes} ${totalRecipes === 1 ? 'resultado' : 'resultados'}`
                        : `📋 Receitas (${totalRecipes})`}
                </h1>
                {searchQuery && (
                    <Link to="/recipes" style={styles.clearSearch}>
                        Limpar busca
                    </Link>
                )}
            </div>

            {error && <Alert message={error} onClose={() => setError('')} />}

            {currentRecipes.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>
                        {searchQuery 
                            ? `Nenhuma receita encontrada para "${searchQuery}"` 
                            : 'Nenhuma receita encontrada'}
                    </p>
                    {!searchQuery && (
                        <Link to="/recipes/new" style={styles.emptyButton}>
                            Criar primeira receita
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div style={styles.grid}>
                        {currentRecipes.map((recipe) => (
                            <div key={recipe.id} style={styles.card}>
                                <h3 style={styles.cardTitle}>{recipe.title}</h3>
                                {recipe.description && (
                                    <p style={styles.cardDescription}>
                                        {recipe.description.length > 100 
                                            ? recipe.description.substring(0, 100) + '...' 
                                            : recipe.description}
                                    </p>
                                )}
                                <div style={styles.cardFooter}>
                                    <span style={styles.authorName}>
                                        👤 {getAuthorName(recipe.user_id)}
                                    </span>
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

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div style={styles.pagination}>
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === 1 ? styles.disabledButton : {})
                                }}
                            >
                                ← Anterior
                            </button>
                            
                            <div style={styles.pageNumbers}>
                                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 7) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 4) {
                                        pageNum = i + 1;
                                        if (i === 6) return <span key="dots" style={styles.dots}>...</span>;
                                    } else if (currentPage >= totalPages - 3) {
                                        if (i === 0) return <span key="dots1" style={styles.dots}>...</span>;
                                        pageNum = totalPages - (6 - i);
                                    } else {
                                        if (i === 0) return <span key="dots1" style={styles.dots}>...</span>;
                                        if (i === 6) return <span key="dots2" style={styles.dots}>...</span>;
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => goToPage(pageNum)}
                                            style={{
                                                ...styles.pageNumber,
                                                ...(currentPage === pageNum ? styles.activePage : {})
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    ...styles.pageButton,
                                    ...(currentPage === totalPages ? styles.disabledButton : {})
                                }}
                            >
                                Próxima →
                            </button>
                        </div>
                    )}
                    
                    <div style={styles.info}>
                        Mostrando {currentRecipes.length} de {totalRecipes} receitas
                        {searchQuery && ` (filtradas por "${searchQuery}")`}
                        {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#f3f4f6',
        padding: '40px 20px'
    },
    header: {
        maxWidth: '1200px',
        margin: '0 auto 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    title: {
        fontSize: '2rem',
        color: '#1f2937',
        margin: 0
    },
    clearSearch: {
        padding: '8px 16px',
        backgroundColor: '#9ca3af',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.9rem'
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#6b7280',
        marginTop: '50px'
    },
    emptyState: {
        textAlign: 'center',
        marginTop: '50px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        margin: '50px auto'
    },
    emptyButton: {
        display: 'inline-block',
        marginTop: '16px',
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px'
    },
    grid: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
    },
    cardTitle: {
        fontSize: '1.25rem',
        color: '#1f2937',
        marginBottom: '10px'
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
    authorName: {
        color: '#9ca3af',
        fontSize: '0.875rem'
    },
    cardButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.875rem'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '40px',
        flexWrap: 'wrap'
    },
    pageButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s'
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
        fontSize: '0.9rem',
        transition: 'all 0.2s'
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
        marginTop: '20px',
        fontSize: '0.85rem',
        color: '#9ca3af'
    }
};

export default RecipesList;