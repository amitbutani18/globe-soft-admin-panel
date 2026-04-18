import axios from 'axios';

const BASE_URL = '/api/languages';

const languageService = {
    // Fetch all languages
    getLanguages: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching languages:', error);
            throw error;
        }
    },

    // Add a new language
    addLanguage: async (data) => {
        try {
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Error adding language:', error);
            throw error;
        }
    },

    // Update an existing language
    updateLanguage: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating language:', error);
            throw error;
        }
    },

    // Delete a language
    deleteLanguage: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting language:', error);
            throw error;
        }
    }
};

export default languageService;
