import axios from 'axios';

const BASE_URL = '/api/user-login-config';

const userLoginConfigService = {
    // Fetch configuration
    getConfig: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching user login config:', error);
            throw error;
        }
    },

    // Update configuration
    // Based on the response structure, we use the ID for PUT
    updateConfig: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating user login config:', error);
            throw error;
        }
    }
};

export default userLoginConfigService;
