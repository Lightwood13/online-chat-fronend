import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { ChatDataWithLastMessage } from '../../model/ChatDataWithLastMessage';
import { ChatListItem } from './ChatListItem';

export function ChatList(props: {
    chatList: ChatDataWithLastMessage[],
    activeChatId: string | null,
    onChatSelected: (chatId: string) => void,
    onShowProfileInfo: () => void
}) {
    return (
        <div className='chat-area'>
            <div className='chat-list'>
            {props.chatList.map( (chat: ChatDataWithLastMessage) => 
                <ChatListItem 
                    key={chat.id} 
                    data={chat}
                    isActive={chat.id === props.activeChatId}
                    onChatSelected={props.onChatSelected}
                />)}
            </div>
            <div className='profile-button' onClick={props.onShowProfileInfo}>
                <BsFillPersonFill/> Profile
            </div>
        </div>
    );
}