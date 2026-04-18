import axios from 'axios';

const API_BASE = '/api/image-prompts';

const imagePromptService = {
    // Fetch all prompts with pagination
    getPrompts: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(API_BASE, {
                params: { page, limit }
            });
            return response.data; // Expected { data: [...], pagination: {...} }
        } catch (error) {
            console.error('Error fetching image prompts:', error);
            throw error;
        }
    },

    // Create a new prompt
    createPrompt: async (data) => {
        try {
            const response = await axios.post(API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating image prompt:', error);
            throw error;
        }
    },

    // Update an existing prompt
    updatePrompt: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating image prompt:', error);
            throw error;
        }
    },

    // Delete a prompt
    deletePrompt: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting image prompt:', error);
            throw error;
        }
    }
};

export default imagePromptService;
