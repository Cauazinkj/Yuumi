import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';

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

        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Email inválido';
        }

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
            console.log('Tentando Login com: ', formData);
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            localStorage.setItem('token', 'fake-jwt-token');
            localStorage.setItem('user', JSON.stringify({
                id: 1,
                name: 'Usuario teste',
                email: formData.email
            }));

            navigate('/');

        } catch (error) {
            alert('Erro ao fazer login: ' + error.message);
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
                    />

                    <button
                        type="submit"
                        disable={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisable : {})
                        }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span style={styles.footerText}>
                        Não tem uma conta?{' '}
                        <Link to="/register" style={styles.link}>
                            Cadastre-se
                        </Link>
                    </span>
                </div>

                {/* Informações para teste */}
                <div style={styles.testInfo}>
                    <p style={styles.testTitle}>Para testar:</p>
                    <p>Email: <strong>teste@review.com</strong></p>
                    <p>Senha: <strong>Senha@123</strong></p>
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
        color: '#lf2937',
        marginBottom: '1.5rem',
        textAlign: 'center'
    },
    form: {
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
    },
    testInfo: {
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#1e40af'
    },
    testTitle: {
        fontWeight: 'bold',
        marginBottom: '0.5rem'
    }
};

export default Login
