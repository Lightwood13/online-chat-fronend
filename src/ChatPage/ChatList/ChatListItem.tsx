import React from 'react';
import moment from 'moment';
import defaultGroupProfilePhoto from '../../images/default_group.png';
import { ChatDataWithLastMessageAndAuthorName } from '../../model/ChatDataWithLastMessageAndAuthorName';
import { serverUrl } from '../../network';

function formatDate(date: Date): string {
    if (new Date().getTime() - date.getTime() <= 86400000)
        return moment(date).format('HH:mm');
    else
        return moment(date).format('MMM D');
}

export const ChatListItem = (props: {
    data: ChatDataWithLastMessageAndAuthorName,
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
                : `${serverUrl}/photo/${props.data.profilePhotoLocation}`
            }
        />
        <div className='chat-summary'>
            <div className='chat-name-and-date'>
                <div className='chat-name'>{props.data.name}</div>
                { (props.data.lastMessageSentOn || props.data.createdOn) &&
                    <div className='chat-last-message-sent-on'>
                        {formatDate(props.data.lastMessageSentOn || props.data.createdOn)}
                    </div>
                }
            </div>
            { props.data.lastMessageAuthorName && props.data.lastMessageText &&
                <div className='last-message-and-unread-count'>
                    <div className='last-message'>
                        {props.data.lastMessageAuthorName}: {props.data.lastMessageText}
                    </div>
                </div>
            }
        </div>
    </div>
);