import axios from 'axios';

const BASE_URL = '/api';

const categoryService = {
    // Fetch all categories from production API
    getCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/Categorys`, {
                params: {
                    page: 1,
                    limit: 50,
                    is_active: true
                }
            });
            // Production response has a { data: [], pagination: {}, success: true } structure
            if (response.data && response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Add a new category
    addCategory: async (categoryData) => {
        try {
            const response = await axios.post(`${BASE_URL}/Categorys`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    // Delete a category (assuming endpoint exists based on convention)
    deleteCategory: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/Categorys/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default categoryService;
