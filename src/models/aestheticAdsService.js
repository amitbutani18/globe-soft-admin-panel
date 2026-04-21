import axios from 'axios';

// Proxy configured in vite.config.js to avoid CORS
const BASE_URL = '/aesthetic-api';

const aestheticAdsService = {
    getAds: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/ads`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Aesthetic Ads:', error);
            throw error;
        }
    },

    createAds: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/ads`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating Aesthetic Ads:', error);
            throw error;
        }
    },

    patchAds: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/ads/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error patching Aesthetic Ads:', error);
            throw error;
        }
    },

    deleteAds: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/ads/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting Aesthetic Ads:', error);
            throw error;
        }
    }
};

export default aestheticAdsService;
