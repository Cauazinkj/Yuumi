import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = () => {
      const currentUser = authService.getCurrentUser();
      console.log('Usuário atual:', currentUser);
      setUser(currentUser);
      setLoading(false);
    };
    
    checkUser();
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };
  
  if (loading) {
    return (
      <div style={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🍜 Yuumi Recipes</h1>
      
      {user ? (
        <div style={styles.card}>
          {/* Avatar */}
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {/* Info do usuário */}
          <h2 style={styles.welcome}>
            Olá, <span style={styles.userName}>{user.name}</span>!
          </h2>
          
          {/* Email em destaque sutil */}
          <p style={styles.email}>{user.email}</p>
          
          {/* Menu de ações */}
          <div style={styles.menu}>
            <button 
              onClick={() => navigate('/recipes')}
              style={styles.menuButton}
            >
              <span style={styles.menuIcon}>📋</span>
              Ver Receitas
            </button>
            
            <button 
              onClick={() => navigate('/recipes/new')}
              style={styles.menuButton}
            >
              <span style={styles.menuIcon}>➕</span>
              Nova Receita
            </button>
            
            <button 
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              <span style={styles.menuIcon}>🚪</span>
              Sair
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.buttonContainer}>
          <Link to="/login" style={styles.button}>
            Fazer Login
          </Link>
          <Link to="/register" style={styles.buttonSecondary}>
            Criar Conta
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: '20px'
  },
  title: {
    fontSize: '3rem',
    color: '#1f2937',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem'
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
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
  },
  welcome: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  userName: {
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  email: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginBottom: '2rem',
    padding: '0.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '20px',
    display: 'inline-block',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  menuButton: {
    padding: '0.875rem',
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ':hover': {
      backgroundColor: '#e5e7eb'
    }
  },
  logoutButton: {
    padding: '0.875rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    ':hover': {
      backgroundColor: '#fecaca'
    }
  },
  menuIcon: {
    fontSize: '1.25rem'
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#3b82f6',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    border: '2px solid #3b82f6',
    transition: 'background-color 0.2s'
  }
};

export default Home;