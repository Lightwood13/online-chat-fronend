import React from 'react';
import { ChatData } from '../../model/ChatData';

export function ChatHeader(props: {
    chat: ChatData,
    onShowChatInfo: () => void
}) {
    const memberWord = (props.chat.members.length === 1) ? 'member' : 'members';
    return (
        <div className='chat-header' onClick={
            () => { if (props.chat !== null) props.onShowChatInfo();}
            }>
            <div className='chat-header-name'>{props.chat.name}</div>
            <div className='chat-header-members'>{`${props.chat.members.length} ${memberWord}`}</div>
        </div>
    );
}