import React from 'react';
import { UserData } from '../../../model/UserData';
import { UserListItem } from '../UserListItem';
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs';

export const FriendRequestList = (props: {
    requests: UserData[],
    onResolveRequest: (userId: string, accept: boolean) => void
}) => (props.requests.length === 0 ? null :
    <div>
        <div className='friends-label'>Friend requests</div>
        <div className='user-list'>
            {props.requests.map((user: UserData) => (
                <UserListItem key={user.id} user={user}>
                    <button 
                        className='friend-request-accept-button'
                        onClick={() => props.onResolveRequest(user.id, true)}
                    ><BsFillCheckCircleFill/></button>
                    <button 
                        className='friend-request-reject-button'
                        onClick={() => props.onResolveRequest(user.id, false)}
                    ><BsFillXCircleFill/></button>
                </UserListItem>
            ))}
        </div>
    </div>
);