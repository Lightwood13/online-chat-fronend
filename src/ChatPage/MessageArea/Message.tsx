import React from 'react';
import { MessageData } from '../../model/MessageData';

import defaultProfilePhoto from '../../images/default.png';
import { UserData } from '../../model/UserData';
import { serverUrl } from '../../network';

export const Message = (props: {
    data: MessageData,
    author: UserData | undefined
}) => (
    <div className='message'>
        <img
            className='message-profile-photo'
            src={ props.author === undefined || props.author.profilePhotoLocation === null
                    ? defaultProfilePhoto
                    : `${serverUrl}/photo/${props.author.profilePhotoLocation}`
                }
        />
        <div className='message-bubble'>
            <div className='message-sender'>{
                props.author === undefined
                ? '[deleted]'
                : props.author.name
            }</div>
            <div className='message-text'>{props.data.text}</div>
            <div className='message-senton'>{props.data.sentOn.toLocaleTimeString(
                [], {hour: '2-digit', minute: '2-digit'}
            )}</div>
        </div>
    </div>
);
