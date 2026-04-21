import axios from 'axios';

const BASE_URL = '/aesthetic-api/user-prompts';

const imagePromptService = {
    // Fetch all prompts with pagination
    getPrompts: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(BASE_URL, {
                params: { page, limit }
            });
            return response.data; // Expected { success, data, pagination }
        } catch (error) {
            console.error('Error fetching image prompts:', error);
            throw error;
        }
    },

    // Add a new prompt
    addPrompt: async (data) => {
        try {
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error adding image prompt:', error);
            throw error;
        }
    },

    // Update an existing prompt
    updatePrompt: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating image prompt:', error);
            throw error;
        }
    },

    // Delete a prompt
    deletePrompt: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting image prompt:', error);
            throw error;
        }
    }
};

export default imagePromptService;
