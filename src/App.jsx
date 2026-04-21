import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './views/layouts/AdminLayout';
import Dashboard from './views/pages/Dashboard';
import Settings from './views/pages/Settings';

// Aesthetic AI
import Category from './views/pages/aesthetic-ai/Category';
import Subcategory from './views/pages/aesthetic-ai/Subcategory';
import AIConfig from './views/pages/aesthetic-ai/AIConfig';
import Ads from './views/pages/aesthetic-ai/Ads';
import UserPrompt from './views/pages/aesthetic-ai/UserPrompt';
import ImageLimit from './views/pages/aesthetic-ai/ImageLimit';
import PremiumBenefits from './views/pages/aesthetic-ai/PremiumBenefits';
import AestheticAdConfig from './views/pages/aesthetic-ai/AdConfig';

// Kali Linux
import DailyBlogs from './views/pages/kali-linux/DailyBlogs';
import AdConfig from './views/pages/kali-linux/AdConfig';
import KaliAds from './views/pages/kali-linux/Ads';
import AiConfig from './views/pages/kali-linux/AiConfig';
import Content from './views/pages/kali-linux/Content';
import FlashedQuiz from './views/pages/kali-linux/FlashedQuiz';
import Languages from './views/pages/kali-linux/Languages';
import LevelQuizzes from './views/pages/kali-linux/LevelQuizzes';

import StoryLearning from './views/pages/kali-linux/StoryLearning';
import SubTopicQuiz from './views/pages/kali-linux/SubTopicQuiz';
import SubTopic from './views/pages/kali-linux/SubTopic';
import Topics from './views/pages/kali-linux/Topics';
import UserLoginConfig from './views/pages/kali-linux/UserLoginConfig';
import Users from './views/pages/kali-linux/Users';
import TranslatedContents from './views/pages/kali-linux/TranslatedContents';
import TranslatedLevelQuizzes from './views/pages/kali-linux/TranslatedLevelQuizzes';
import TranslatedSubtopicQuizzes from './views/pages/kali-linux/TranslatedSubtopicQuizzes';
import TranslatedSubtopic from './views/pages/kali-linux/TranslatedSubtopic';
import TranslatedTopic from './views/pages/kali-linux/TranslatedTopic';

// PromptVerse AI
import Prompts from './views/pages/prompt-verse/Prompts';
import Templates from './views/pages/prompt-verse/Templates';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />

                    {/* Aesthetic AI */}
                    <Route path="categories" element={<Category />} />
                    <Route path="subcategories" element={<Subcategory />} />
                    <Route path="ai-config" element={<AIConfig />} />
                    <Route path="ads" element={<Ads />} />
                    <Route path="ad-config" element={<AestheticAdConfig />} />
                    <Route path="image-prompt" element={<UserPrompt />} />
                    <Route path="image-generation-limits" element={<ImageLimit />} />
                    <Route path="premium-benefits" element={<PremiumBenefits />} />

                    {/* Kali Linux */}
                    <Route path="daily-blogs" element={<DailyBlogs />} />
                    <Route path="kali-ad-config" element={<AdConfig />} />
                    <Route path="kali-ads" element={<KaliAds />} />
                    <Route path="kali-ai-config" element={<AiConfig />} />
                    <Route path="kali-content" element={<Content />} />
                    <Route path="flashed-quiz" element={<FlashedQuiz />} />
                    <Route path="languages" element={<Languages />} />
                    <Route path="level-quizzes" element={<LevelQuizzes />} />

                    <Route path="story-learning" element={<StoryLearning />} />
                    <Route path="sub-topic-quiz" element={<SubTopicQuiz />} />
                    <Route path="sub-topic" element={<SubTopic />} />
                    <Route path="topics" element={<Topics />} />
                    <Route path="user-login-config" element={<UserLoginConfig />} />
                    <Route path="kali-users" element={<Users />} />
                    <Route path="translated-contents" element={<TranslatedContents />} />
                    <Route path="translated-level-quizzes" element={<TranslatedLevelQuizzes />} />
                    <Route path="translated-subtopic-quizzes" element={<TranslatedSubtopicQuizzes />} />
                    <Route path="translated-subtopic" element={<TranslatedSubtopic />} />
                    <Route path="translated-topic" element={<TranslatedTopic />} />

                    {/* PromptVerse AI */}
                    <Route path="prompts" element={<Prompts />} />
                    <Route path="templates" element={<Templates />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
