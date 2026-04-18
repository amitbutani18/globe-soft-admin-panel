import axios from 'axios';

const BASE_URL = 'https://seahorse-app-doers.ondigitalocean.app/api';

const aestheticAiConfigService = {
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ai-configs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching AI Config:', error);
            throw error;
        }
    },

    update: async (id, payload) => {
        try {
            const response = await axios.put(`${BASE_URL}/ai-configs/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating AI Config:', error);
            throw error;
        }
    }
};

export default aestheticAiConfigService;
