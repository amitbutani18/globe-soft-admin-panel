import axios from 'axios';

const BASE_URL = '/api/flashed-quizzes';

const flashedQuizService = {
    // Fetch all quizzes
    getQuizzes: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching flashed quizzes:', error);
            throw error;
        }
    },

    // Add a new quiz
    addQuiz: async (data) => {
        try {
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error adding flashed quiz:', error);
            throw error;
        }
    },

    // Update an existing quiz
    updateQuiz: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating flashed quiz:', error);
            throw error;
        }
    },

    // Delete a quiz
    deleteQuiz: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting flashed quiz:', error);
            throw error;
        }
    }
};

export default flashedQuizService;
