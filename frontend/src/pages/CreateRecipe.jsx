import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import IngredientInput from '../components/IngredientInput';
import StepInput from '../components/StepInput';
import Alert from '../components/Alert';
import recipeService from '../services/recipeService';
import authService from '../services/authService';

const CreateRecipe = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    if (!user) {
        navigate('/login');
        return null;
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        steps: [{ step_number: 1, description: '' }]
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));

        if (errors.ingredients) {
            setErrors(prev => ({ ...prev, ingredients: '' }));
        }
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '' }]
        }));
    };

    const removeIngredient = (index) => {
        if (formData.ingredients.length > 1) {
            const newIngredients = formData.ingredients.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...formData.steps];
        newSteps[index][field] = value;
        setFormData(prev => ({ ...prev, steps: newSteps }));
        
        if (errors.steps) {
            setErrors(prev => ({ ...prev, steps: '' }));
        }
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, { step_number: prev.steps.length + 1, description: '' }]
        }));
    };

    const removeStep = (index) => {
        if (formData.steps.length > 1) {
            const newSteps = formData.steps.filter((_, i) => i !== index);

            newSteps.forEach((step, i) => (step.step_number = i + 1));
            setFormData(prev => ({ ...prev, steps: newSteps }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Titulo é obrigatorio';
        }

        const validIngredients = formData.ingredients.filter(
            i => i.name.trim() && i.quantity.trim()
        );

        if (validIngredients.length === 0) {
            newErrors.ingredients = 'Adicione pelo menos um ingrediente completo';
        } else {
            const hasIncomplete = formData.ingredients.some(
                i => (i.name.trim() && !i.quantity.trim()) || (!i.name.trim() && i.quantity.trim())
            );

            if (hasIncomplete) {
                newErrors.ingredients = 'Todos os ingredientes devem ter nome e quantidade';
            }
        }

        const validSteps = formData.steps.filter(s => s.description.trim());

        if (validSteps.length === 0) {
            newErrors.steps = 'Adicione pelo menos um passo';
        } else {
            const hasEmptyStep = formData.steps.some(s => !s.description.trim());
            if (hasEmptyStep) {
                newErrors.steps = 'Todos os passos devem ter descricao';
            }
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
        setAlertMessage('');

        try {
            const recipeData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                ingredients: formData.ingredients
                    .filter(i => i.name.trim() && i.quantity.trim())
                    .map(i => ({
                        name: i.name.trim(),
                        quantity: i.quantity.trim()
                    })),
                steps: formData.steps
                    .filter(s => s.description.trim())
                    .map((s, index) => ({
                        step_number: index + 1,
                        description: s.description.trim()
                    }))
            };

            console.log('Enviando receita:', recipeData);

            const result = await recipeService.createRecipe(recipeData);

            console.log('Receita criada:', result);

            navigate(`/recipes/${result.id}`);
            
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            setAlertMessage(error.message || 'Erro ao criar receita');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Criar Nova Receita</h1>

                {alertMessage && (
                    <Alert
                        message={alertMessage}
                        onClose={() => setAlertMessage()}
                    />
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Titulo da receita"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Bolo de chocolate"
                        error={errors.title}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Descrição (opcional)"
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Uma breve descricao da sua receita"
                        error={errors.description}
                        disabled={loading}
                    />

                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Ingredientes</h3>
                            <button
                                type="button"
                                onClick={addIngredient}
                                style={styles.addButton}
                                disabled={loading}
                            >
                                + Adicionar Ingrediente
                            </button>
                        </div>

                        {errors.ingredients && (
                            <p style={styles.errorText}>{errors.ingredients}</p>
                        )}

                        {formData.ingredients.map((ingredient, index) => (
                            <IngredientInput
                                key={index}
                                ingredient={ingredient}
                                index={index}
                                onChange={handleIngredientChange}
                                onRemove={removeIngredient}
                            />
                        ))}

                        <p style={styles.hint}>
                            * Todos os ingredientes precisam de nome e quantidade
                        </p>
                    </div>

                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Modo de Preparo</h3>
                            <button
                                type="button"
                                onClick={addStep}
                                style={styles.addButton}
                                disabled={loading}
                            >
                                + Adicionar Passo
                            </button>
                        </div>

                        {errors.steps && (
                            <p style={styles.errorText}>{errors.steps}</p>
                        )}

                        {formData.steps.map((step, index) => (
                            <StepInput
                                key={index}
                                step={step}
                                index={index}
                                onChange={handleStepChange}
                                onRemove={removeStep}
                            />
                        ))}
                    </div>
                    
                    <div style={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={styles.cancelButton}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitButton,
                                ...(loading ? styles.buttonDisabled : {})
                            }}
                        >
                            {loading ? 'Criando...' : 'Criar Receita'}
                        </button>
                    </div>
                </form>
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
        maxWidth: '600px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    title: {
        fontSize: '2rem',
        color: '#1f2937',
        marginBottom: '2rem',
        textAlign: 'center'
    },
    rox: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem'
    },
    section: {
        marginTop: '2rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        color: '#374151',
        margin: 0
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s'
    },
    errorText: {
        color: '#ef4444',
        fontSize: '0.875rem',
        marginBottom: '1rem'
    },
    buttonContainer: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem'
    },
    cancelButton: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#9ca3af',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    submitButton: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed'
    }
};

export default CreateRecipe;