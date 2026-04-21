import axios from 'axios';

const BASE_URL = '/aesthetic-api';

const categoryService = {
    // Fetch all categories from production API
    getCategories: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${BASE_URL}/Categorys`, {
                params: {
                    page,
                    limit
                    // is_active: true // Removed so we can see all categories in admin
                }
            });
            // Production response has a { data: [], pagination: {}, success: true } structure
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Fetch single category by ID
    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/Categorys/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category by ID:', error);
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

    // Update category (partial update)
    patchCategory: async (id, categoryData) => {
        try {
            const response = await axios.patch(`${BASE_URL}/Categorys/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error patching category:', error);
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
