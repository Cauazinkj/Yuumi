import api from './api';

class RecipeService {

    async createRecipe(recipeData) {
        try {
            const response = await api.post('/recipes', recipeData);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data);
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    const messages = error.response.data.detail.map(err => err.msg).join(', ');
                    throw new Error(messages);
                }
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    async getRecipes(params = {}) {
        try {
            const response = await api.get('/recipes', { params });
            return response.data
        } catch (error) {
            console.error('Erro ao buscar receitas:', error);
            throw error;
        }
    }

    async getRecipeById(id) {
        try {
            const response = await api.get(`/recipes/${id}`);
            return response.data
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Receita nao encontrada');
            }
            throw error;
        }
    }

    async updateRecipe(id, recipeData) {
        try {
            const response = await api.put(`/recipes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar:', error.response?.data);
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    async deleteRecipe(id) {
        try {
            await api.delete(`/recipes/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao deletar receita:', error);
            throw error;
        }
    }
}

export default new RecipeService();