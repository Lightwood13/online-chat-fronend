import React from 'react';
import { ChatData } from '../../model/ChatData';

export const ChatListItem = (props: {
    data: ChatData,
    isActive: boolean,
    onChatSelected: (chat: ChatData) => void
}) => (
    <li
        className={props.isActive ? 'active-chat-item' : 'chat-item'}
        tabIndex={1}
        onFocus={() => props.onChatSelected(props.data)}
    >{props.data.name}</li>
);