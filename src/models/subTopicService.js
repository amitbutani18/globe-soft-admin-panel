import axios from 'axios';

const subTopicService = {
    /**
     * Fetch all sub-topics from the production registry
     */
    getSubTopics: async () => {
        try {
            const response = await axios.get('/api/subtopics');
            // Assuming the production API returns { data: [...], success: true }
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
     * Fetch a single sub-topic with detailed content (paragraphs, images, etc.)
     */
    getSubTopicById: async (id) => {
        try {
            const response = await axios.get(`/api/subtopics/${id}`);
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
            const response = await axios.post('/api/subtopics', data);
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
            const response = await axios.put(`/api/subtopics/${id}`, data);
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
            const response = await axios.delete(`/api/subtopics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Termination failure:', error);
            throw error;
        }
    }
};

export default subTopicService;
