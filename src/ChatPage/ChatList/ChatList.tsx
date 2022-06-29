import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { ChatData } from '../../model/ChatData';
import { ChatListItem } from './ChatListItem';

export function ChatList(props: {
    chatList: ChatData[],
    activeChatId: string | null,
    onChatSelected: (chat: ChatData) => void,
    onShowProfileInfo: () => void
}) {
    return (
        <div className='chat-area'>
            <ul className='chat-list'>
            {props.chatList.map( (chat: ChatData) => 
                <ChatListItem 
                    key={chat.id} 
                    data={chat}
                    isActive={chat.id === props.activeChatId}
                    onChatSelected={props.onChatSelected}
                />)}
            </ul>
            <div className='profile-button' onClick={props.onShowProfileInfo}>
                <BsFillPersonFill/> Profile
            </div>
        </div>
    );
}