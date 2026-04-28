import axios from 'axios';

const BASE_URL = '/api';

const dailyBlogService = {
    /**
     * Fetch paginated daily blogs
     * GET /api/daily-blog?page=1&limit=10
     * Response: { data: [], pagination: { page, limit, total, total_pages }, message }
     */
    getBlogs: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${BASE_URL}/daily-blog`, {
                params: { page, limit }
            });
            // Response shape: { data: [], pagination: {}, message: "" }
            if (response.data && Array.isArray(response.data.data)) {
                return {
                    blogs: response.data.data,
                    pagination: response.data.pagination || {}
                };
            }
            return { blogs: [], pagination: {} };
        } catch (error) {
            console.error('Error fetching daily blogs:', error);
            throw error;
        }
    },

    /**
     * Fetch a single blog by ID
     * GET /api/daily-blog/:id
     * Response: { data: { id, title, content, quiz, created_at, updated_at }, message }
     */
    getBlogById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/daily-blog/${id}`);
            return response.data?.data ?? null;
        } catch (error) {
            console.error('Error fetching blog by id:', error);
            throw error;
        }
    },

    /**
     * POST /api/daily-blog
     * Body: { title, content, quiz: [{question, options, correctAnswerIndex}] }
     * Response: { data: { id, title, content, quiz, created_at, updated_at }, message }
     */
    addBlog: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/daily-blog`, payload);
            return response.data; // { data: {...}, message: "Daily blog created successfully" }
        } catch (error) {
            console.error('Error adding daily blog:', error);
            throw error;
        }
    },

    /**
     * Update an existing blog
     * PUT /api/daily-blog/:id
     * Body: { title, content, quiz: [{question, options, correctAnswerIndex}] }
     * Response: { data: { id, title, content, quiz, created_at, updated_at }, message }
     */
    updateBlog: async (id, payload) => {
        try {
            const response = await axios.put(`${BASE_URL}/daily-blog/${id}`, payload);
            return response.data; // { data: {...}, message: "Daily blog updated successfully" }
        } catch (error) {
            console.error('Error updating daily blog:', error);
            throw error;
        }
    },

    // Delete a blog
    deleteBlog: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/daily-blog/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting daily blog:', error);
            throw error;
        }
    }
};

export default dailyBlogService;
