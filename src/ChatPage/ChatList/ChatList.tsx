import React from 'react';
import { ChatData } from '../../model/ChatData';
import { ChatListItem } from './ChatListItem';

export function ChatList(props: {
    chatList: ChatData[],
    activeChatId: string | null
    onChatSelected: (chat: ChatData) => void
}) {
    return (<ul className='chat-list'>
        {props.chatList.map( (chat: ChatData) => 
            <ChatListItem 
                key={chat.id} 
                data={chat}
                isActive={chat.id === props.activeChatId}
                onChatSelected={props.onChatSelected}
            />)}
    </ul>);
}