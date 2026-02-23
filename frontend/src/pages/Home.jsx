import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Yuumi Recipes</h1>
            <p style={styles.subtitle}>Sistema de receitas e avaliações</p>
        
            <div style={styles.buttonContainer}>
                <Link to="/login" style={styles.button}>
                    Fazer Login
                </Link>
                <Link to="/register" style={styles.buttonSecondary}>
                    Criar Conta
                </Link>
            </div>
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
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        fontSize: '3rem',
        color: '#1f2937',
        marginBottom: '1rem'
    },
    subtitle: {
        fontSize: '1.25rem',
        color: '#6b7280',
        marginBottom: '3rem'
    },
    buttonContainer: {
        display: 'flex',
        gap: '1rem'
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

export default Home