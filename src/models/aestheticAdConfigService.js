import axios from 'axios';

// Proxy configured in vite.config.js to avoid CORS
const BASE_URL = '/aesthetic-api';

const aestheticAdConfigService = {
    /**
     * Fetch the aesthetic ad configuration global settings
     */
    getAdConfig: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ad_config`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Aesthetic Ad Config:', error);
            throw error;
        }
    },

    /**
     * Update/Patch aesthetic ad configuration
     */
    patchAdConfig: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/ad_config/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error patching Aesthetic Ad Config:', error);
            throw error;
        }
    },

    /**
     * Put update for aesthetic ad configuration
     */
    updateAdConfig: async (id, payload) => {
        try {
            const response = await axios.put(`${BASE_URL}/ad_config/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating Aesthetic Ad Config:', error);
            throw error;
        }
    }
};

export default aestheticAdConfigService;
