import axios from 'axios';

// Proxy configured in vite.config.js to avoid CORS
const BASE_URL = '/aesthetic-api';

const aestheticLimitsService = {
    /**
     * Fetch the aesthetic image generation limits
     */
    getLimits: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/image_generation_limit`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Aesthetic Limits:', error);
            throw error;
        }
    },

    /**
     * Update aesthetic image generation limits
     */
    updateLimits: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/image_generation_limit/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating Aesthetic Limits:', error);
            throw error;
        }
    }
};

export default aestheticLimitsService;
