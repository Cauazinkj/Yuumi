import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    // Verifica se está na página de receitas para mostrar o foco
    const isRecipesPage = location.pathname === '/recipes';

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    🍜 Yuumi Recipes
                </Link>

                {/* Links e Busca */}
                <div style={styles.rightSection}>
                    <div style={styles.navLinks}>
                        <Link to="/recipes" style={styles.navLink}>
                            📋 Receitas
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" style={styles.navLink}>
                                    👤 {user?.name?.split(' ')[0] || 'Perfil'}
                                </Link>
                                <button onClick={handleLogout} style={styles.logoutButton}>
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.navLink}>
                                    Entrar
                                </Link>
                                <Link to="/register" style={styles.registerLink}>
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Barra de Busca */}
                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="🔍 Buscar receitas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                        <button type="submit" style={styles.searchButton}>
                            Buscar
                        </button>
                    </form>
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
        padding: '1rem 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#3b82f6',
        textDecoration: 'none'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    navLink: {
        color: '#374151',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'color 0.2s',
        ':hover': {
            color: '#3b82f6'
        }
    },
    searchForm: {
        display: 'flex',
        gap: '8px'
    },
    searchInput: {
        padding: '8px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '0.9rem',
        width: '200px',
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
        fontSize: '0.9rem'
    },
    logoutButton: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    registerLink: {
        padding: '6px 16px',
        backgroundColor: '#9ca3af',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.9rem'
    }
};

export default Navbar;