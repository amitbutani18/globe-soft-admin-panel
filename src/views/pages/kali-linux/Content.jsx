import React from 'react';
import { FileText } from 'lucide-react';
import KaliPage from './KaliPage';

const Content = () => (
    <KaliPage
        title="Content"
        description="Manage all rich content entries for Kali Linux."
        icon={FileText}
    />
);

export default Content;
