import React from 'react';
import { MemberData } from '../../model/MemberData';
import { UserData } from '../../model/UserData';
import { UserListItem } from './UserListItem';

export function ChatMemberList (props: {
    users: (UserData & MemberData)[],
    userId: string,
    isAdmin: boolean,
    onPromote: (userId: string) => void,
    onDemote: (userId: string) => void,
    onKick: (userId: string) => void,
}) {
    return (
        <div className='user-list'>
            {props.users.map(user => 
                <UserListItem key={user.id} user={user}>
                    {user.role !== 'member' && <div className='chat-member-role'>admin</div>}
                    {props.isAdmin && user.id !== props.userId && 
                        <div className='chat-member-remove-promote-buttons'>
                            {user.role === 'member' 
                                ? <button
                                    className='chat-member-promote-button'
                                    onClick={() => props.onPromote(user.id)}
                                >Promote</button>
                                : <button
                                    className='chat-member-demote-button'
                                    onClick={() => props.onDemote(user.id)}
                                >Demote</button>
                            }
                            <button
                                className='chat-member-remove-button'
                                onClick={() => props.onKick(user.id)}
                            >Remove</button>
                        </div>
                    }
                </UserListItem>
            )}
        </div>
    );
}