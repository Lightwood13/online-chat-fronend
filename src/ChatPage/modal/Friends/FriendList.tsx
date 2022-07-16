import React from 'react';
import { UserData } from '../../../model/UserData';
import { UserListItem } from '../UserListItem';

export const FriendList = (props: {
    friends: UserData[],
    onRemoveFriend: (friendId: string) => void
}) => (
    <div>
        <div className='friends-label'>Friends</div>
        <div className='user-list'>
            {props.friends.map((user: UserData) => (
                <UserListItem key={user.id} user={user}>
                    <button 
                        className='friend-remove-button'
                        onClick={() => props.onRemoveFriend(user.id)}
                    >Remove</button>
                </UserListItem>
            ))}
        </div>
    </div>
);