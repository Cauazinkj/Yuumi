import api from './api';

class UserService {
    async getUserById(id) {
        try {
            console.log(`🔍 Buscando usuário ID: ${id}`);
            const response = await api.get(`/users/${id}`);
            console.log('✅ Resposta do backend:', response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ Erro ao buscar usuário ${id}:`, error);
            console.error('📦 Detalhe do erro:', error.response?.data);
            return null;
        }
    }

    async getUsersByIds(ids) {
        const uniqueIds = [...new Set(ids)];
        console.log('🔢 IDs únicos:', uniqueIds);

        const promises = uniqueIds.map(id => this.getUserById(id));

        const users = await Promise.all(promises);

        console.log('👥 Usuários encontrados:', users);
        
        const userMap = {};
        users.forEach(user => {
            if (user) {
                userMap[user.id] = user;
            }
        });
        console.log('🗺️ Mapa de usuários:', userMap);
        return userMap;
    }
}

export default new UserService();