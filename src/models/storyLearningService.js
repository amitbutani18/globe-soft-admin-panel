import axios from 'axios';

const API_BASE = '/api/story-based-learning';

const storyLearningService = {
    // Fetch all stories
    getStories: async () => {
        try {
            const response = await axios.get(API_BASE);
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    },

    // Create a new story
    createStory: async (data) => {
        try {
            const response = await axios.post(API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    },

    // Update an existing story
    updateStory: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating story:', error);
            throw error;
        }
    },

    // Delete a story
    deleteStory: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting story:', error);
            throw error;
        }
    }
};

export default storyLearningService;
