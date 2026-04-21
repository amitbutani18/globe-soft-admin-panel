import axios from 'axios';

// Proxy configured in vite.config.js to avoid CORS
const BASE_URL = '/aesthetic-api';

const aestheticBenefitsService = {
    /**
     * Fetch all premium benefits
     */
    getBenefits: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/premium_benefit`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Aesthetic Benefits:', error);
            throw error;
        }
    },

    /**
     * Update benefits configuration
     */
    updateBenefits: async (id, payload) => {
        try {
            const response = await axios.patch(`${BASE_URL}/premium_benefit/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating Aesthetic Benefits:', error);
            throw error;
        }
    }
};

export default aestheticBenefitsService;
