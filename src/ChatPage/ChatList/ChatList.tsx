import React from 'react';
import { ChatData, ChatListItem } from './ChatListItem';

export function ChatList(props: {
    chatList: ChatData[],
    onChatSelected: (chatId: string) => void
}) {
    return (<ul className='chat-list'>
        {props.chatList.map( (chat: ChatData) => 
            <ChatListItem 
                key={chat.id} 
                data={chat} 
                onChatSelected={props.onChatSelected}
            />)}
    </ul>);
}