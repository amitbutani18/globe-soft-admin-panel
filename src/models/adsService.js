import axios from 'axios';

const BASE_URL = '/api';

const adsService = {
    /**
     * Fetch the singleton ad configuration
     * GET /api/ads
     */
    getAds: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ads`);
            // The API returns { data: { ... }, success: true }
            return response.data;
        } catch (error) {
            console.error('Error fetching Ads configuration:', error);
            throw error;
        }
    },


    /**
     * Create a new ad configuration
     * POST /api/ads
     */
    createAds: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/ads`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating Ads configuration:', error);
            throw error;
        }
    },


    /**
     * Partially update an existing ad configuration
     * PATCH /api/ads/:id
     */
    patchAds: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/ads/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error patching Ads configuration:', error);
            throw error;
        }
    },

    /**
     * Delete an ad configuration
     * DELETE /api/ads/:id
     */
    deleteAds: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/ads/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting Ads configuration:', error);
            throw error;
        }
    }
};

export default adsService;
