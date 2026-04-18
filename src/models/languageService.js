import axios from 'axios';

const API_BASE = '/api/languages';

const languageService = {
    // Fetch all languages
    getLanguages: async () => {
        try {
            const response = await axios.get(API_BASE);
            return response.data;
        } catch (error) {
            console.error('Error fetching languages:', error);
            throw error;
        }
    },

    // Create a new language
    createLanguage: async (data) => {
        try {
            const response = await axios.post(API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating language:', error);
            throw error;
        }
    },

    // Update an existing language
    updateLanguage: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating language:', error);
            throw error;
        }
    },

    // Delete a language
    deleteLanguage: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting language:', error);
            throw error;
        }
    }
};

export default languageService;
