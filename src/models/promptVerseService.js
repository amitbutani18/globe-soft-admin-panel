import axios from 'axios';

// PromptVerse uses a dedicated production host.
// Keep this base URL out of component code so we can swap it via env/config.
const PROMPT_VERSE_BASE_URL = (import.meta.env.VITE_PROMPT_VERSE_BASE_URL || '').replace(/\/$/, '');

const request = async (endpointPath, { page = 1, limit = 10, params = {} } = {}) => {
    if (!PROMPT_VERSE_BASE_URL) {
        throw new Error('Missing VITE_PROMPT_VERSE_BASE_URL env var');
    }

    const url = `${PROMPT_VERSE_BASE_URL}${endpointPath}`;

    // Many of your backend endpoints follow a common { data, pagination } response shape.
    // When you provide the curl/response, we can adjust mapping as needed.
    const response = await axios.get(url, {
        params: { page, limit, ...params }
    });

    return response.data;
};

const promptVerseService = {
    // Generic paginated fetcher to be wired to the PromptVerse endpoints you share.
    // Example usage: getPrompts('/promptverse-ai/prompts', { page, limit })
    getPrompts: async (endpointPath, { page = 1, limit = 10, params = {} } = {}) => {
        return request(endpointPath, { page, limit, params });
    },

    // Same pattern for templates or other resources on PromptVerse.
    getTemplates: async (endpointPath, { page = 1, limit = 10, params = {} } = {}) => {
        return request(endpointPath, { page, limit, params });
    }
};

export default promptVerseService;

