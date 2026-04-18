import React from 'react';
import { HelpCircle } from 'lucide-react';
import KaliPage from './KaliPage';

const SubTopicQuiz = () => (
    <KaliPage
        title="Sub Topic Quiz"
        description="Manage quizzes linked to specific sub-topics."
        icon={HelpCircle}
    />
);

export default SubTopicQuiz;
