import React from 'react';
import { BsFillPersonFill, BsFillPeopleFill } from 'react-icons/bs';
import { ChatDataWithLastMessageAndAuthorName } from '../../model/ChatDataWithLastMessageAndAuthorName';
import { ChatListItem } from './ChatListItem';

export function ChatList(props: {
    chatList: ChatDataWithLastMessageAndAuthorName[],
    activeChatId: string | null,
    friendRequestCount: number,
    onChatSelected: (chatId: string) => void,
    onShowFriends: () => void,
    onShowProfileInfo: () => void
}) {
    return (
        <div className='chat-area'>
            <div className='chat-list'>
            {props.chatList.map( (chat: ChatDataWithLastMessageAndAuthorName) => 
                <ChatListItem 
                    key={chat.id} 
                    data={chat}
                    isActive={chat.id === props.activeChatId}
                    onChatSelected={props.onChatSelected}
                />)}
            </div>
            <div className='friend-button' onClick={props.onShowFriends}>
                <div className='friend-label'>
                    <BsFillPeopleFill/> Friends
                </div>
                { props.friendRequestCount === 0 ? null :
                    <div className='friend-request-count'>{props.friendRequestCount}</div>
                }
            </div>
            <div className='profile-button' onClick={props.onShowProfileInfo}>
                <BsFillPersonFill/> Profile
            </div>
        </div>
    );
}