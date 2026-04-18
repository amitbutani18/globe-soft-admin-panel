import React from 'react';
import { Globe } from 'lucide-react';
import KaliPage from './KaliPage';

const TranslatedTopic = () => (
    <KaliPage
        title="Translated Topic"
        description="Manage translated versions of main topic content."
        icon={Globe}
    />
);

export default TranslatedTopic;
