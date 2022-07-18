import React from 'react';
import { UserData } from '../../../model/UserData';
import { UserListItemWithLeftContent } from '../UserListItem';

export const NewGroupMembersList = (props: {
    friends: UserData[],
    onMemberToggled: (memberId: string) => void
}) => (
    <div>
        <div className='friends-label'>Choose members</div>
        <div className='user-list'>
            {props.friends.map((user: UserData) => (
                <UserListItemWithLeftContent key={user.id} user={user}>
                    <input 
                        className='new-group-choose-members-checkbox'
                        type='checkbox'
                        onChange={() => props.onMemberToggled(user.id)}
                    />
                </UserListItemWithLeftContent>
            ))}
        </div>
    </div>
);