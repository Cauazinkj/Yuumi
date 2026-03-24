import api from './api';

class ReviewService {
    
    async createReview(reviewData) {
        try {
            const response = await api.post('/review', reviewData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar review:', error.response?.data);
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    async getRecipeReviews(recipeId) {
        try {
            const response = await api.get(`/review/recipe/${recipeId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar reviews:', error);
            return [];
        }
    }

    async getMyReview(recipeId) {
        try {
            const response = await api.get(`/review/recipe/${recipeId}/me`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Erro ao buscar minha review:', error);
            return null;
        }
    }

    async updateReview(reviewId, reviewData) {
        try {
            const response = await api.put(`/review/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar review:', error.response?.data);
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    async deleteReview(reviewId) {
        try {
            await api.delete(`/review/${reviewId}`);
            return true;
        } catch (error) {
            console.error('Erro ao deletar review:', error);
            throw error;
        }
    }

    async getRecipeStats(recipeId) {
        try {
            const response = await api.get(`/review/recipe/${recipeId}/stats`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return {
                average_rating: null,
                review_count: 0,
                average_rating_formatted: "N/A"
            };
        }
    }

    async getUserReviews(userId) {
        try {
            // Se a API tiver um endpoint para buscar reviews por usuário
            // Ajuste conforme sua API
            const response = await api.get(`/review/user/me`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar avaliações do usuário:', error);
            return [];
        }
    }

    async getMyReviews() {
        try {
            const response = await api.get('/review/user/me');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar minhas reviews:', error);
            return [];
        }
    }

}

export default new ReviewService();