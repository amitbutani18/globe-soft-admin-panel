import axios from 'axios';

const BASE_URL = '/api';

const topicService = {
    /**
     * Fetch paginated topics
     * GET /api/topics?page=1&limit=10
     */
    getTopics: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${BASE_URL}/topics`, {
                params: { page, limit }
            });
            if (response.data && Array.isArray(response.data.data)) {
                return {
                    topics: response.data.data,
                    pagination: response.data.pagination || { page, limit, total: response.data.data.length, total_pages: 1 }
                };
            }
            return { topics: [], pagination: { page, limit, total: 0, total_pages: 0 } };
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    },

    /**
     * Fetch a single topic by ID
     */
    getTopicById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/topics/${id}`);
            return response.data?.data ?? null;
        } catch (error) {
            console.error('Error fetching topic by id:', error);
            throw error;
        }
    },

    /**
     * Create a new topic
     */
    createTopic: async (payload) => {
        try {
            // payload: { id, name, description, icon, nativeAdIndex, quizTopicName }
            const response = await axios.post(`${BASE_URL}/topics`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating topic:', error);
            throw error;
        }
    },

    /**
     * Update an existing topic
     */
    updateTopic: async (id, payload) => {
        try {
            // API expects PUT /api/topics/:id
            const response = await axios.put(`${BASE_URL}/topics/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating topic:', error);
            throw error;
        }
    },

    /**
     * Delete a topic
     */
    deleteTopic: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/topics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw error;
        }
    },

    /**
     * Fetch subtopics for a specific topic
     * GET /api/topics/{topicId}/subtopics
     */
    getTopicSubTopics: async (topicId) => {
        try {
            const response = await axios.get(`${BASE_URL}/topics/${topicId}/subtopics`);
            return {
                topic: response.data?.data?.topic || null,
                subTopics: response.data?.data?.subTopics || [],
                success: response.data?.success || false
            };
        } catch (error) {
            console.error(`Error fetching subtopics for topic ${topicId}:`, error);
            throw error;
        }
    }
};

export default topicService;
