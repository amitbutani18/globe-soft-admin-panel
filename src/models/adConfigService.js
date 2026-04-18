import axios from 'axios';

const BASE_URL = '/api';

const adConfigService = {
    /**
     * Fetch the singleton ad configuration settings (flags and frequencies)
     * GET /api/ad_config
     */
    getAdConfig: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ad-configs`);
            // The API returns { data: { ... }, success: true }
            return response.data;
        } catch (error) {
            console.error('Error fetching Ad Configuration:', error);
            throw error;
        }
    },

    /**
     * Partially update the ad configuration settings
     * PATCH /api/ad-configs/:id
     */
    updateAdConfig: async (id, data) => {
        try {
            if (!id) throw new Error('Config ID is required for update');
            const response = await axios.patch(`${BASE_URL}/ad-configs/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error patching Ad Configuration:', error);
            throw error;
        }
    }
};

export default adConfigService;
