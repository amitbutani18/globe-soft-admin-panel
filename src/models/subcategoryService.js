import axios from 'axios';

const BASE_URL = '/aesthetic-api';

const subcategoryService = {
    // Fetch all subcategories
    getSubcategories: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${BASE_URL}/sub-Categorys`, {
                params: { page, limit }
            });
            return response.data; // returns { success, data, pagination }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            throw error;
        }
    },
    // Fetch single subcategory by ID
    getSubcategoryById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/sub-Categorys/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategory by ID:', error);
            throw error;
        }
    },

    // Add a new subcategory
    addSubcategory: async (subcategoryData) => {
        try {
            const response = await axios.post(`${BASE_URL}/sub-Categorys`, subcategoryData);
            return response.data;
        } catch (error) {
            console.error('Error adding subcategory:', error);
            throw error;
        }
    },
    // Update subcategory (partial update)
    patchSubcategory: async (id, subcategoryData) => {
        try {
            const response = await axios.patch(`${BASE_URL}/sub-Categorys/${id}`, subcategoryData);
            return response.data;
        } catch (error) {
            console.error('Error patching subcategory:', error);
            throw error;
        }
    },
    // Delete a subcategory
    deleteSubcategory: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/sub-Categorys/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            throw error;
        }
    }
};

export default subcategoryService;
