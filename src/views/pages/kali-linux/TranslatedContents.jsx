import React from 'react';
import { Languages } from 'lucide-react';
import KaliPage from './KaliPage';

const TranslatedContents = () => (
    <KaliPage
        title="Translated Contents"
        description="Manage multilingual translations of content entries."
        icon={Languages}
    />
);

export default TranslatedContents;
