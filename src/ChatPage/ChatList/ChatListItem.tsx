import React from 'react';
import { ChatDataWithLastMessage } from '../../model/ChatDataWithLastMessage';
import defaultGroupProfilePhoto from '../../images/default_group.png';

export const ChatListItem = (props: {
    data: ChatDataWithLastMessage,
    isActive: boolean,
    onChatSelected: (chatId: string) => void
}) => (
    <div
        className={props.isActive ? 'active-chat-item' : 'chat-item'}
        tabIndex={1}
        onFocus={() => props.onChatSelected(props.data.id)}
    >
        <img 
            className='chat-profile-photo'
            src={props.data.profilePhotoLocation === null
                ? defaultGroupProfilePhoto
                : `http://localhost:8080/photo/${props.data.profilePhotoLocation}`
            }
        />
        <div className='chat-name'>{props.data.name}</div>
    </div>
);