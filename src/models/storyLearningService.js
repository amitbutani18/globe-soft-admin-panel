import axios from 'axios';

const BASE_URL = '/api/story-based-learning';

const storyLearningService = {
    // Fetch all stories
    getStories: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    },

    // Create a new story
    createStory: async (data) => {
        try {
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    },

    // Update a story
    updateStory: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating story:', error);
            throw error;
        }
    },

    // Delete a story
    deleteStory: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting story:', error);
            throw error;
        }
    }
};

export default storyLearningService;
