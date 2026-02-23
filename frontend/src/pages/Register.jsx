import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
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
      console.log('Registrando:', formData);
      
      // Simula sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para login
      navigate('/login');
      
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Criar Conta</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            error={errors.name}
            required
          />
          
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
            placeholder="••••••••"
            error={errors.password}
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <span style={styles.footerText}>
            Já tem uma conta?{' '}
            <Link to="/login" style={styles.link}>
              Faça login
            </Link>
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

export default Register;