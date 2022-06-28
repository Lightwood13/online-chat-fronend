import React from 'react';
import { MessageData } from '../MessageArea/Message';

export type ChatData = {
    id: string,
    name: string,
    lastMessage: MessageData | null
}

export const ChatListItem = (props: {
    data: ChatData,
    onChatSelected: (chatId: string) => void
}) => (
    <li
        className='chat-item'
        tabIndex={1}
        onFocus={() => props.onChatSelected(props.data.id)}
    >{props.data.name}</li>
);