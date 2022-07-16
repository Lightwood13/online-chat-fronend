import React from 'react';
import { UserData } from '../../model/UserData';
import { UserListItem } from './UserListItem';

export const UserList = (props: {
    users: UserData[]
}) => (
    <div className='user-list'>
        {props.users.map((user: UserData) => <UserListItem key={user.id} user={user}/>)}
    </div>
);