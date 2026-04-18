import axios from 'axios';

const API_BASE = '/api/quizzes/levels';

const levelQuizService = {
    // Fetch all levels
    getLevels: async () => {
        try {
            const response = await axios.get(API_BASE);
            // The API returns { data: { levels: [...] }, success: true }
            return {
                data: response.data.data?.levels || [],
                success: response.data.success
            };
        } catch (error) {
            console.error('Error fetching level quizzes:', error);
            throw error;
        }
    },

    // Create a new level
    createLevel: async (data) => {
        try {
            const response = await axios.post(API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating level quiz:', error);
            throw error;
        }
    },

    // Update an existing level
    updateLevel: async (id, data) => {
        try {
            // Usually updates would be to a specific level path if not specified in curl
            const response = await axios.put(`${API_BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating level quiz:', error);
            throw error;
        }
    },

    // Delete a level
    deleteLevel: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting level quiz:', error);
            throw error;
        }
    }
};

export default levelQuizService;
