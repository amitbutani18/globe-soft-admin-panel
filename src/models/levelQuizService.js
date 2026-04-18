import axios from 'axios';

const BASE_URL = '/api/quizzes/levels';

const levelQuizService = {
    // Fetch all levels
    getLevels: async () => {
        try {
            const response = await axios.get(BASE_URL);
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
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating level quiz:', error);
            throw error;
        }
    },

    // Update a level
    updateLevel: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating level quiz:', error);
            throw error;
        }
    },

    // Delete a level
    deleteLevel: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting level quiz:', error);
            throw error;
        }
    }
};

export default levelQuizService;
