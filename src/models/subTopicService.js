import axios from 'axios';

const BASE_URL = '/api/subtopics';

const subTopicService = {
    /**
     * Fetch all sub-topics from the production registry
     */
    getSubTopics: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return {
                subTopics: response.data?.data || [],
                success: response.data?.success || false
            };
        } catch (error) {
            console.error('Error fetching sub-topics:', error);
            throw error;
        }
    },

    /**
     * Fetch sub-topics filtered by topic ID
     */
    getSubTopicsByTopicId: async (topicId) => {
        try {
            const response = await axios.get(BASE_URL, {
                params: { topic_id: topicId }
            });
            return {
                subTopics: response.data?.data || [],
                success: response.data?.success || false
            };
        } catch (error) {
            console.error(`Error fetching sub-topics for topic ${topicId}:`, error);
            throw error;
        }
    },

    /**
     * Fetch a single sub-topic with detailed content (paragraphs, images, etc.)
     */
    getSubTopicById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data?.data;
        } catch (error) {
            console.error(`Error fetching detail for sub-topic ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deployment of a new sub-topic node
     */
    createSubTopic: async (data) => {
        try {
            const response = await axios.post(BASE_URL, data);
            return response.data;
        } catch (error) {
            console.error('Deployment failure:', error);
            throw error;
        }
    },

    /**
     * Synchronize and update an existing sub-topic node
     */
    updateSubTopic: async (id, data) => {
        try {
            const response = await axios.patch(`${BASE_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Synchronization failure:', error);
            throw error;
        }
    },

    /**
     * Terminate and remove a sub-topic node from the registry
     */
    deleteSubTopic: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Termination failure:', error);
            throw error;
        }
    },

    /**
     * Fetch the detailed content for a sub-topic
     * GET /api/subtopics/{subTopicId}/content
     */
    getSubTopicContent: async (subTopicId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${subTopicId}/content`);
            return {
                content: response.data?.data || null,
                success: response.data?.success || false
            };
        } catch (error) {
            console.error(`Error fetching content for subtopic ${subTopicId}:`, error);
            throw error;
        }
    }
};

export default subTopicService;
