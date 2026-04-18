import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import KaliPage from './KaliPage';

const Users = () => (
    <KaliPage
        title="Users"
        description="View and manage registered Kali Linux app users."
        icon={UsersIcon}
    />
);

export default Users;
