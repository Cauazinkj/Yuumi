// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import recipeService from '../services/recipeService';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Normalizar texto (remover acentos)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    // Buscar sugestões (apenas 5 para autocomplete)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const allRecipes = await recipeService.getRecipes();
                const normalizedSearch = normalizeText(searchTerm);
                
                // Filtra receitas que contêm o termo
                const matches = allRecipes
                    .filter(recipe => normalizeText(recipe.title).includes(normalizedSearch))
                    .slice(0, 5); // LIMITA A 5 SUGESTÕES NO AUTOCOMPLETE
                
                setSuggestions(matches);
            } catch (err) {
                console.error('Erro ao buscar sugestões:', err);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    // Fechar sugestões ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // BUSCA COMPLETA - vai para a página com todos os resultados
            navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (title) => {
        // Quando clica na sugestão, também faz a busca completa
        navigate(`/recipes?search=${encodeURIComponent(title)}`);
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo - clica para Home */}
                <Link to="/" style={styles.logo}>
                    🍜 Yuumi
                </Link>

                {/* Busca com sugestões */}
                <div style={styles.searchContainer} ref={searchRef}>
                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Buscar receitas..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            style={styles.searchInput}
                        />
                        <button type="submit" style={styles.searchButton}>
                            Buscar
                        </button>
                    </form>
                    
                    {/* Sugestões - apenas 5 */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div style={styles.suggestions}>
                            {suggestions.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    style={styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(recipe.title)}
                                >
                                    <span style={styles.suggestionIcon}>🍜</span>
                                    <div>
                                        <div style={styles.suggestionTitle}>{recipe.title}</div>
                                        <div style={styles.suggestionDesc}>
                                            {recipe.description?.substring(0, 60) || 'Sem descrição'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Área do usuário */}
                <div style={styles.userArea}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" style={styles.userName}>
                                👤 {user?.name}
                            </Link>
                            <button onClick={handleLogout} style={styles.logoutButton}>
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={styles.loginButton}>
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#3b82f6',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
    },
    searchContainer: {
        flex: 1,
        maxWidth: '400px',
        position: 'relative'
    },
    searchForm: {
        display: 'flex',
        gap: '8px',
        width: '100%'
    },
    searchInput: {
        flex: 1,
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    searchButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        whiteSpace: 'nowrap'
    },
    suggestions: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        marginTop: '4px',
        zIndex: 1000,
        maxHeight: '300px',
        overflowY: 'auto'
    },
    suggestionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        cursor: 'pointer',
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f3f4f6'
        }
    },
    suggestionIcon: {
        fontSize: '1.5rem'
    },
    suggestionTitle: {
        fontSize: '0.95rem',
        fontWeight: '500',
        color: '#1f2937'
    },
    suggestionDesc: {
        fontSize: '0.8rem',
        color: '#6b7280',
        marginTop: '2px'
    },
    userArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    userName: {
        color: '#374151',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500'
    },
    logoutButton: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem'
    },
    loginButton: {
        padding: '6px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.9rem'
    }
};

export default Navbar;