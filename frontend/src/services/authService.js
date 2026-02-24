import api from './api';

class AuthService {

    async login(email, password) {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.token?.access_token) {
                localStorage.setItem('token', response.data.token.access_token);
                
                const userData = {
                    id: response.data.user_id,
                    name: response.data.name,
                    email: response.data.email
                };
                localStorage.setItem('user', JSON.stringify(userData));

                return response.data;
            }

            throw new Error('Resposta invalida do servidor');

        } catch (error) {
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }

            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await api.post('/users/new', userData);

            if (response.data) {
                return await this.login(userData.email, userData.password);
            }
            
        } catch (error) {
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');

        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
}

export default new AuthService();