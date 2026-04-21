import axios from 'axios';

// Proxy configured in vite.config.js to avoid CORS
const BASE_URL = '/aesthetic-api';

const aestheticAiConfigService = {
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ai-config`);
            return response.data;
        } catch (error) {
            console.error('Error fetching AI Config:', error);
            throw error;
        }
    },

    update: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/ai-config/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating AI Config:', error);
            throw error;
        }
    }
};

export default aestheticAiConfigService;
