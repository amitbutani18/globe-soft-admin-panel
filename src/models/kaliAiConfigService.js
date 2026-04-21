import axios from 'axios';

const BASE_URL = '/api';

const kaliAiConfigService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ai-configs`);

            // If the API returns a single object in data, wrap it in an array for the UI table
            if (response.data?.data && !Array.isArray(response.data.data)) {
                return { data: [response.data.data], success: response.data.success };
            }

            return { data: response.data?.data ?? [], success: response.data?.success };
        } catch (error) {
            console.error('Error fetching AI Configs:', error);
            throw error;
        }
    },

    create: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/ai-configs`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating AI Config:', error);
            throw error;
        }
    },

    update: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/ai-configs/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error patching AI Config:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/ai-configs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting AI Config:', error);
            throw error;
        }
    }
};

export default kaliAiConfigService;
