import axios from 'axios';

const API_BASE = '/api/flashed-quizzes';

const flashedQuizService = {
    // Fetch all quizzes
    getQuizzes: async () => {
        try {
            const response = await axios.get(API_BASE);
            return response.data;
        } catch (error) {
            console.error('Error fetching flashed quizzes:', error);
            throw error;
        }
    },

    // Create a new quiz
    createQuiz: async (data) => {
        try {
            const response = await axios.post(API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating flashed quiz:', error);
            throw error;
        }
    },

    // Update an existing quiz
    updateQuiz: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating flashed quiz:', error);
            throw error;
        }
    },

    // Delete a quiz
    deleteQuiz: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting flashed quiz:', error);
            throw error;
        }
    }
};

export default flashedQuizService;
