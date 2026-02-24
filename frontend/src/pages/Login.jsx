import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import authService from '../services/authService';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email é obrigatório';
        else if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
        if (!formData.password) newErrors.password = 'Senha é obrigatória';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await authService.login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            toast.error('Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Entrar na Conta</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        error={errors.email}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        error={errors.password}
                        required
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div style={styles.footer}>
                    <span style={styles.footerText}>
                        Não tem uma conta? <Link to="/register" style={styles.link}>Cadastre-se</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1.5rem',
        textAlign: 'center'
    },
    formContainer: {
        marginBottom: '1.5rem'
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '0.5rem'
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed'
    },
    footer: {
        textAlign: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
    },
    footerText: {
        color: '#6b7280',
        fontSize: '0.875rem'
    },
    link: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default Login;