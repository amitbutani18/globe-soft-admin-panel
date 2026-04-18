import axios from 'axios';

const BASE_URL = '/api';

const subcategoryService = {
    // Fetch all subcategories
    getSubcategories: async (params = {}) => {
        try {
            const response = await axios.get(`${BASE_URL}/Subcategorys`, {
                params: { page: 1, limit: 50, ...params }
            });
            if (response.data?.success) return response.data.data;
            if (Array.isArray(response.data)) return response.data;
            return [];
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },

    // Add a new subcategory
    addSubcategory: async (subcategoryData) => {
        try {
            const response = await axios.post(`${BASE_URL}/Subcategorys`, subcategoryData);
            return response.data;
        } catch (error) {
            console.error('Error adding subcategory:', error);
            throw error;
        }
    },

    // Update a subcategory
    updateSubcategory: async (id, subcategoryData) => {
        try {
            const response = await axios.put(`${BASE_URL}/Subcategorys/${id}`, subcategoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating subcategory:', error);
            throw error;
        }
    },

    // Delete a subcategory
    deleteSubcategory: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/Subcategorys/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            throw error;
        }
    }
};

export default subcategoryService;
